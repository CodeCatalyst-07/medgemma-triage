import os
import base64
import json
import time
import requests
from typing import Any, Dict, Optional
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
GEMINI_API_URL = (
    "https://generativelanguage.googleapis.com/v1beta/models/"
    "gemini-2.5-flash:generateContent"
)

SYSTEM_PROMPT_IMAGE = """
You are an expert clinical triage assistant for medical images.
Analyze the provided medical image and optional patient notes.
Detect key imaging findings and anomalies.
Assign triage urgency: one of ["emergent", "urgent", "routine"].
Output VALID JSON ONLY — no markdown, no code fences, no extra text:
{
  "triage_level": "emergent | urgent | routine",
  "anomalies": [
    {
      "name": "finding name",
      "location": "location in body",
      "confidence": 0.0,
      "reasoning": "1-2 sentence clinical reasoning"
    }
  ],
  "overall_summary": "2-4 sentence clinical summary",
  "recommended_action": "clear next steps for clinician",
  "safety_notes": "disclaimer that this is not a diagnosis"
}
""".strip()

SYSTEM_PROMPT_NOTES = """
You are an expert clinical triage assistant.
Read the clinical text (chief complaint, history, vitals).
Detect key problems and risks.
Assign triage urgency: one of ["emergent", "urgent", "routine"].
Output VALID JSON ONLY — no markdown, no code fences, no extra text:
{
  "triage_level": "emergent | urgent | routine",
  "anomalies": [
    {
      "name": "problem name",
      "location": "organ or system or N/A",
      "confidence": 0.0,
      "reasoning": "1-2 sentence reasoning"
    }
  ],
  "overall_summary": "2-4 sentence summary",
  "recommended_action": "next steps",
  "safety_notes": "disclaimer"
}
""".strip()

def _parse_safe(content: str) -> Dict[str, Any]:
    # Strip markdown code fences if model ignores the instruction
    cleaned = content.strip()
    if cleaned.startswith("```"):
        lines = cleaned.splitlines()
        # Remove first line (```json or ```) and last closing ```
        cleaned = "\n".join(
            lines[1:-1] if lines[-1].strip() == "```" else lines[1:]
        ).strip()
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        start = cleaned.find("{")
        end = cleaned.rfind("}")
        if start != -1 and end != -1 and end > start:
            return json.loads(cleaned[start:end + 1])
        raise ValueError(f"Could not parse JSON: {cleaned[:300]}")

def _call_gemini(contents: list, system_prompt: str) -> str:
    headers = {"Content-Type": "application/json"}
    payload = {
        "system_instruction": {
            "parts": [{"text": system_prompt}]
        },
        "contents": contents,
        "generationConfig": {
            "temperature": 0.1,
            "maxOutputTokens": 4096,
            "responseMimeType": "application/json",
        }
    }
    url = f"{GEMINI_API_URL}?key={GEMINI_API_KEY}"

    # Retry logic: 3 attempts with exponential backoff
    max_retries = 3
    for attempt in range(max_retries):
        resp = requests.post(
            url,
            headers=headers,
            json=payload,
            timeout=60
        )

        if resp.status_code == 429:
            # Rate limited — wait and retry
            wait_time = (2 ** attempt) * 5  # 5s, 10s, 20s
            if attempt < max_retries - 1:
                time.sleep(wait_time)
                continue
            else:
                raise Exception(
                    "429: Rate limit hit after 3 retries. "
                    "Please wait 1 minute."
                )

        resp.raise_for_status()
        return resp.json()["candidates"][0]["content"]["parts"][0]["text"]

    raise Exception("Failed after maximum retries")

def call_medgemma_image_triage(
    image_bytes: bytes,
    patient_notes: Optional[str] = None
) -> Dict[str, Any]:
    b64 = base64.b64encode(image_bytes).decode("utf-8")
    user_text = "Analyze this medical image and perform clinical triage."
    if patient_notes:
        user_text += f"\n\nAdditional patient notes:\n{patient_notes}"
    contents = [
        {
            "role": "user",
            "parts": [
                {"text": user_text},
                {
                    "inline_data": {
                        "mime_type": "image/jpeg",
                        "data": b64
                    }
                }
            ]
        }
    ]
    return _parse_safe(_call_gemini(contents, SYSTEM_PROMPT_IMAGE))

def call_medgemma_notes_summary(text: str) -> Dict[str, Any]:
    contents = [
        {
            "role": "user",
            "parts": [{"text": text}]
        }
    ]
    return _parse_safe(_call_gemini(contents, SYSTEM_PROMPT_NOTES))
