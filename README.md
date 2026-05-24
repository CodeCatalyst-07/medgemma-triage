# 🏥 MedGemma Clinical Triage Copilot

<div align="center">

![MedGemma Banner](https://img.shields.io/badge/Powered%20by-Google%20Gemini%202.5%20Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/Frontend-React%20+%20Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Deployed on Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Backend on Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)

**An AI-powered clinical triage assistant for healthcare professionals.**  
Analyze medical images and clinical notes in seconds using Google Gemini 2.5 Flash.

🌐 **Live Demo → [medgemma-triage.vercel.app](https://medgemma-triage.vercel.app)**

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Deployment](#-deployment)
- [Project Structure](#-project-structure)
- [Security](#-security)
- [Disclaimer](#-disclaimer)

---

## 🔭 Overview

**MedGemma Clinical Triage Copilot** is a full-stack medical AI web application that assists healthcare professionals in quickly triaging patients by analyzing:

- 🩻 **Medical Images** — X-rays, CT scans, MRI scans, and other diagnostic images
- 📋 **Clinical Notes** — Chief complaints, patient history, vital signs, and symptom descriptions

The AI assigns a triage urgency level (**Emergent / Urgent / Routine**), identifies key anomalies with confidence scores, provides a clinical summary, and recommends next steps — all in under 15 seconds.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🩻 **Image Analysis** | Drag-and-drop medical image upload with AI-powered anomaly detection |
| 📋 **Clinical Notes Analysis** | Text-based triage from symptoms, history, and vitals |
| 🚦 **Triage Classification** | Three-level system: Emergent 🔴 / Urgent 🟡 / Routine 🟢 |
| 🔬 **Anomaly Detection** | Lists detected findings with confidence scores and visual progress bars |
| 💊 **Recommended Actions** | Clear, actionable next steps for the clinician |
| 🌐 **Multilingual Support** | Supports 8 languages: English, Hindi, Tamil, Telugu, Kannada, Marathi, Bengali, Gujarati |
| ⚡ **Retry Logic** | Exponential backoff (5s → 10s → 20s) for rate-limited API calls |
| 🔒 **Secure Error Handling** | API keys never exposed to frontend — all errors are sanitized |
| 📱 **Responsive Design** | Works on mobile, tablet, and desktop |

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Python 3.11+** | Core language |
| **FastAPI** | REST API framework |
| **Uvicorn** | ASGI server |
| **Google Gemini 2.5 Flash** | Multimodal AI model for clinical analysis |
| **Google Cloud Translate v2** | Multilingual input/output translation |
| **python-dotenv** | Environment variable management |
| **Requests** | HTTP client for Gemini REST API |

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI framework |
| **Vite** | Build tool and dev server |
| **Tailwind CSS v4** | Utility-first styling |
| **Inter (Google Fonts)** | Typography |
| **Native HTML5 Drag & Drop** | Image upload (no external libraries) |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         USER BROWSER                         │
│                                                             │
│   React + Vite Frontend  (Vercel)                          │
│   medgemma-triage.vercel.app                               │
│                                                             │
│   ┌──────────┐  ┌──────────────┐  ┌──────────────────┐   │
│   │ImageUpload│  │ NotesInput   │  │ TriageResultCard  │   │
│   └──────────┘  └──────────────┘  └──────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS (REST API)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              FastAPI Backend  (Render)                       │
│         medgemma-triage.onrender.com                        │
│                                                             │
│   POST /analyze-image     POST /analyze-notes               │
│   GET  /health                                              │
│                                                             │
│   ┌──────────────────┐    ┌───────────────────────┐        │
│   │ medgemma_client  │    │     translator.py      │        │
│   │ (Gemini API)     │    │ (Google Cloud Translate)│       │
│   └────────┬─────────┘    └───────────────────────┘        │
└────────────┼────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────┐
│   Google Gemini 2.5 Flash   │
│  (Multimodal AI Analysis)   │
└─────────────────────────────┘
```

### Request Flow
1. User uploads image or enters clinical notes on the frontend
2. Frontend sends a `POST` request to the FastAPI backend on Render
3. If a non-English language is selected, the backend translates input to English first
4. Backend encodes the image as base64 and sends it with a structured system prompt to Gemini 2.5 Flash
5. Gemini responds with structured JSON containing triage level, anomalies, summary, and recommendations
6. If a non-English language was selected, the response is translated back
7. Frontend renders the result in a color-coded triage card

---

## 🚀 Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- A [Google Gemini API key](https://aistudio.google.com/app/apikey)
- (Optional) Google Cloud project with Translation API enabled

### 1. Clone the repository

```bash
git clone https://github.com/CodeCatalyst-07/medgemma-triage.git
cd medgemma-triage
```

### 2. Set up the Backend

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate        # macOS/Linux
# venv\Scripts\activate         # Windows

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

### 3. Set up the Frontend

```bash
cd frontend
npm install
```

### 4. Run locally

**Terminal 1 — Backend:**
```bash
cd backend
uvicorn main:app --reload --port 8000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 🔑 Environment Variables

Create `backend/.env` (never commit this file):

```env
# Required — Google Gemini API key
GEMINI_API_KEY=your_gemini_api_key_here

# Optional — Google Cloud service account for multilingual translation
# Download from Google Cloud Console → IAM → Service Accounts
GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json

# Legacy — not used (kept for reference)
HF_TOKEN=
```

### Getting a Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click **"Create API Key"**
3. Copy the key into your `.env` file

### Setting up Google Cloud Translation (Optional)
1. Create a project in [Google Cloud Console](https://console.cloud.google.com)
2. Enable the **Cloud Translation API**
3. Create a **Service Account** and download the JSON key
4. Place the JSON file in `backend/` as `google-credentials.json`
5. Set `GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json` in `.env`

> Without this, the app works in English-only mode. Translation features will be disabled.

---

## 📡 API Reference

### `GET /health`
Returns the API status.

**Response:**
```json
{
  "status": "ok",
  "model": "gemini-2.5-flash",
  "version": "1.0.0"
}
```

---

### `POST /analyze-image`
Analyzes a medical image and optional clinical notes.

**Request:** `multipart/form-data`

| Field | Type | Required | Description |
|---|---|---|---|
| `image` | File | ✅ | Medical image (JPG/PNG, max 5MB) |
| `notes` | string | ❌ | Additional patient notes |
| `language` | string | ❌ | Response language code (default: `en`) |

**Response:**
```json
{
  "triage_level": "urgent",
  "anomalies": [
    {
      "name": "Consolidation",
      "location": "Right lower lobe",
      "confidence": 0.92,
      "reasoning": "Dense opacification consistent with pneumonia."
    }
  ],
  "overall_summary": "The chest X-ray shows...",
  "recommended_action": "Administer supplemental oxygen...",
  "safety_notes": "This is not a medical diagnosis..."
}
```

---

### `POST /analyze-notes`
Analyzes clinical text notes.

**Request:** `application/json`

```json
{
  "text": "63-year-old female with acute onset productive cough, fever 38.7°C...",
  "language": "en"
}
```

**Response:** Same structure as `/analyze-image`

---

### Supported Language Codes

| Code | Language |
|---|---|
| `en` | 🇬🇧 English |
| `hi` | 🇮🇳 Hindi (हिंदी) |
| `ta` | 🇮🇳 Tamil (தமிழ்) |
| `te` | 🇮🇳 Telugu (తెలుగు) |
| `kn` | 🇮🇳 Kannada (ಕನ್ನಡ) |
| `mr` | 🇮🇳 Marathi (मराठी) |
| `bn` | 🇮🇳 Bengali (বাংলা) |
| `gu` | 🇮🇳 Gujarati (ગુજરાતી) |

---

## 🌐 Deployment

### Frontend — Vercel

1. Go to [vercel.com](https://vercel.com) → New Project → Import from GitHub
2. Set **Root Directory** to `frontend`
3. Framework: **Vite** (auto-detected)
4. Deploy

### Backend — Render

1. Go to [render.com](https://render.com) → New Web Service → Connect GitHub repo
2. Set **Root Directory** to `backend`
3. Set **Start Command** to:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000
   ```
4. Add environment variable: `GEMINI_API_KEY=your_key`
5. Deploy

> ⚠️ **Render Free Tier Note:** The service spins down after 15 minutes of inactivity. The first request after idle takes ~30 seconds. Hit `/health` before demos to warm it up.

---

## 📁 Project Structure

```
medgemma-triage/
│
├── .gitignore                    # Root gitignore (protects .env, node_modules)
│
├── backend/
│   ├── main.py                   # FastAPI app, endpoints, CORS, error handling
│   ├── medgemma_client.py        # Gemini 2.5 Flash API client with retry logic
│   ├── translator.py             # Google Cloud Translate integration
│   ├── requirements.txt          # Python dependencies
│   ├── .env                      # 🔒 Secret keys (NOT committed)
│   ├── .env.example              # Template for environment variables
│   └── .gitignore                # Backend-specific gitignore
│
└── frontend/
    ├── index.html                # HTML entry point + Google Fonts
    ├── package.json              # Node dependencies
    ├── vite.config.js            # Vite configuration
    └── src/
        ├── main.jsx              # React entry point
        ├── App.jsx               # Root component — state, layout, tabs
        ├── api.js                # API calls to the FastAPI backend
        ├── index.css             # Global styles, animations
        └── components/
            ├── Header.jsx        # Sticky nav with connection badge
            ├── ImageUpload.jsx   # Drag-and-drop image uploader
            ├── NotesInput.jsx    # Textarea with character counter
            ├── LanguageSelector.jsx  # Language dropdown with flag emojis
            ├── LoadingSpinner.jsx    # Animated loading state
            └── TriageResultCard.jsx  # Triage result with confidence bars
```

---

## 🔐 Security

| Measure | Implementation |
|---|---|
| **No API key leakage** | Structured error handling in `main.py` — raw exceptions (which may contain URL+key) are never forwarded to the frontend |
| **Secret protection** | `backend/.env` and `*.json` credential files are gitignored at both root and backend level |
| **Input validation** | Image type and size validated before processing (JPG/PNG only, max 5MB) |
| **JSON injection prevention** | Gemini responses use `responseMimeType: "application/json"` to force structured output |
| **Rate limit handling** | 429 responses trigger exponential backoff (3 retries: 5s, 10s, 20s) before returning a user-friendly error |

---

## ⚕️ Disclaimer

> **This application is built for educational and demonstration purposes only.**
>
> - Results generated by this tool are **NOT a medical diagnosis**
> - This tool should **NOT** be used as a substitute for professional medical judgment
> - Always consult a qualified healthcare professional for medical decisions
> - The AI model may produce incorrect or incomplete assessments

---

## 🙏 Acknowledgements

- [Google Gemini API](https://ai.google.dev/) — Multimodal AI model powering clinical analysis
- [Google Cloud Translation](https://cloud.google.com/translate) — Multilingual support
- [FastAPI](https://fastapi.tiangolo.com/) — High-performance Python web framework
- [Vercel](https://vercel.com/) — Frontend deployment
- [Render](https://render.com/) — Backend deployment

---

<div align="center">

Built with ❤️ for the healthcare community

**[Live Demo](https://medgemma-triage.vercel.app)** • **[GitHub](https://github.com/CodeCatalyst-07/medgemma-triage)**

</div>
