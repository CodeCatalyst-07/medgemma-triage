import os
from typing import Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from medgemma_client import call_medgemma_image_triage, call_medgemma_notes_summary

load_dotenv()

app = FastAPI(
    title="MedGemma Clinical Triage Copilot",
    description="AI-powered clinical triage using MedGemma 4B",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"]

def _apply_translation(result: dict, language: str) -> dict:
    if language != "en":
        from translator import from_english
        if result.get("overall_summary"):
            result["overall_summary_translated"] = from_english(
                result["overall_summary"], language
            )
        if result.get("recommended_action"):
            result["recommended_action_translated"] = from_english(
                result["recommended_action"], language
            )
    return result

def _translate_input(text: str, language: str) -> str:
    if language != "en" and text:
        from translator import to_english
        return to_english(text, language)
    return text


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "model": "gemini-2.5-flash",
        "version": "1.0.0"
    }


@app.post("/analyze-image")
async def analyze_image(
    image: UploadFile = File(...),
    notes: Optional[str] = Form(None),
    language: Optional[str] = Form("en"),
):
    if image.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Only JPEG and PNG images are supported."
        )
    image_bytes = await image.read()
    if len(image_bytes) > 5 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="Image too large. Max size is 5MB."
        )
    notes_en = _translate_input(notes, language) if notes else None
    try:
        result = call_medgemma_image_triage(image_bytes, notes_en)
    except Exception as e:
        error_msg = str(e)
        if "429" in error_msg:
            raise HTTPException(
                status_code=429,
                detail="AI model is busy. Please wait 30 seconds and try again."
            )
        elif "401" in error_msg or "403" in error_msg:
            raise HTTPException(
                status_code=502,
                detail="AI service authentication failed. Check API key."
            )
        else:
            raise HTTPException(
                status_code=502,
                detail="AI analysis failed. Please try again."
            )
    return _apply_translation(result, language)


class NotesRequest(BaseModel):
    text: str
    language: Optional[str] = "en"


@app.post("/analyze-notes")
async def analyze_notes(payload: NotesRequest):
    if not payload.text or not payload.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty.")
    text_en = _translate_input(payload.text, payload.language)
    try:
        result = call_medgemma_notes_summary(text_en)
    except Exception as e:
        error_msg = str(e)
        if "429" in error_msg:
            raise HTTPException(
                status_code=429,
                detail="AI model is busy. Please wait 30 seconds and try again."
            )
        elif "401" in error_msg or "403" in error_msg:
            raise HTTPException(
                status_code=502,
                detail="AI service authentication failed. Check API key."
            )
        else:
            raise HTTPException(
                status_code=502,
                detail="AI analysis failed. Please try again."
            )
    return _apply_translation(result, payload.language)
