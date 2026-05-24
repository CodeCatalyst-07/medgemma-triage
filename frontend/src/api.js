const API_BASE = "http://localhost:8000";

export async function analyzeImage({ file, notes, language = "en" }) {
  const form = new FormData();
  form.append("image", file);
  if (notes) form.append("notes", notes);
  form.append("language", language);
  const res = await fetch(`${API_BASE}/analyze-image`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Server error ${res.status}: ${err}`);
  }
  return res.json();
}

export async function analyzeNotes({ text, language = "en" }) {
  const res = await fetch(`${API_BASE}/analyze-notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, language }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Server error ${res.status}: ${err}`);
  }
  return res.json();
}

export async function checkHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}
