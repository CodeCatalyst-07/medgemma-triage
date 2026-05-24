import { useState, useEffect } from "react";
import Header from "./components/Header.jsx";
import ImageUpload from "./components/ImageUpload.jsx";
import NotesInput from "./components/NotesInput.jsx";
import LanguageSelector from "./components/LanguageSelector.jsx";
import LoadingSpinner from "./components/LoadingSpinner.jsx";
import TriageResultCard from "./components/TriageResultCard.jsx";
import { analyzeImage, analyzeNotes, checkHealth } from "./api.js";

const SAMPLE_NOTES =
  "63-year-old female with acute onset productive cough, fever 38.7°C, pleuritic chest pain on the right side, shortness of breath on exertion, history of COPD, current smoker.";

const TABS = [
  { id: "image", label: "🩻 Image Analysis" },
  { id: "notes", label: "📋 Clinical Notes" },
];

function getErrorMessage(raw) {
  if (!raw) return "An unexpected error occurred.";
  const msg = raw.toLowerCase();
  if (msg.includes("429") || msg.includes("busy"))
    return "⏳ AI model is busy — please wait 30 seconds and try again.";
  if (msg.includes("authentication") || msg.includes("api key"))
    return "🔑 API key issue — check your .env file.";
  return "❌ Analysis failed — please try again.";
}

export default function App() {
  const [activeTab, setActiveTab] = useState("image");
  const [selectedFile, setSelectedFile] = useState(null);
  const [notes, setNotes] = useState("");
  const [language, setLanguage] = useState("en");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    checkHealth()
      .then(() => setIsConnected(true))
      .catch(() => setIsConnected(false));
  }, []);

  const isAnalyzeDisabled =
    loading ||
    (activeTab === "image" && !selectedFile) ||
    (activeTab === "notes" && !notes.trim());

  function handleTabChange(tabId) {
    setActiveTab(tabId);
    setResult(null);
    setError(null);
  }

  async function onAnalyze() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data =
        activeTab === "image"
          ? await analyzeImage({ file: selectedFile, notes, language })
          : await analyzeNotes({ text: notes, language });
      setResult(data);
    } catch (err) {
      setError(getErrorMessage(err.message));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#f0f4f8", fontFamily: "'Inter', sans-serif" }}>
      {/* ── HEADER ── */}
      <Header isConnected={isConnected} />

      {/* ── HERO ── */}
      <section
        className="w-full py-10 px-4"
        style={{ background: "linear-gradient(135deg, #fff 0%, #eff6ff 60%, #e0f2fe 100%)" }}
      >
        <div className="max-w-[1200px] mx-auto text-center">
          <h1
            className="font-extrabold mb-3"
            style={{ color: "#0f172a", fontSize: "clamp(22px, 4vw, 34px)", letterSpacing: "-0.5px" }}
          >
            AI-Powered Clinical Triage Assistant
          </h1>
          <p className="mb-6 max-w-xl mx-auto" style={{ color: "#64748b", fontSize: "15px", lineHeight: "1.6" }}>
            Upload medical images or enter clinical notes for instant AI-powered triage assessment
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { icon: "🏥", text: "Medical Grade AI" },
              { icon: "⚡", text: "Results in Seconds" },
              { icon: "🔒", text: "Privacy First" },
            ].map(({ icon, text }) => (
              <span
                key={text}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold"
                style={{ background: "#fff", color: "#1e293b", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0" }}
              >
                {icon} {text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* ══ LEFT COLUMN ══ */}
          <div className="flex flex-col gap-5">

            {/* Tab switcher */}
            <div
              className="flex p-1 rounded-2xl"
              style={{ background: "#e2e8f0" }}
            >
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  id={`tab-${tab.id}`}
                  onClick={() => handleTabChange(tab.id)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                  style={
                    activeTab === tab.id
                      ? {
                          background: "#2563eb",
                          color: "#fff",
                          boxShadow: "0 2px 8px rgba(37,99,235,0.35)",
                        }
                      : { color: "#64748b", background: "transparent" }
                  }
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Input card */}
            <div
              className="rounded-2xl p-6 flex flex-col gap-5"
              style={{ background: "#fff", boxShadow: "0 4px 20px rgba(0,0,0,0.07)", border: "1px solid #e2e8f0" }}
            >
              {activeTab === "image" ? (
                <>
                  <ImageUpload selectedFile={selectedFile} onFileSelected={setSelectedFile} />
                  <NotesInput value={notes} onChange={setNotes} language={language} />
                </>
              ) : (
                <NotesInput value={notes} onChange={setNotes} language={language} />
              )}

              <LanguageSelector value={language} onChange={setLanguage} />

              {/* Sample notes button */}
              {activeTab === "notes" && (
                <button
                  id="load-sample-notes"
                  onClick={() => setNotes(SAMPLE_NOTES)}
                  className="text-xs font-medium self-start transition-all duration-150 underline underline-offset-2"
                  style={{ color: "#2563eb" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#1d4ed8"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "#2563eb"}
                >
                  📋 Load Sample Notes
                </button>
              )}

              {/* Analyze button */}
              <button
                id="analyze-button"
                onClick={onAnalyze}
                disabled={isAnalyzeDisabled}
                className="w-full flex items-center justify-center gap-3 font-bold text-white rounded-2xl transition-all duration-150"
                style={{
                  height: "56px",
                  fontSize: "16px",
                  background: isAnalyzeDisabled
                    ? "#94a3b8"
                    : "linear-gradient(135deg, #2563eb, #0891b2)",
                  cursor: isAnalyzeDisabled ? "not-allowed" : "pointer",
                  boxShadow: isAnalyzeDisabled ? "none" : "0 4px 16px rgba(37,99,235,0.35)",
                }}
                onMouseEnter={(e) => { if (!isAnalyzeDisabled) { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(37,99,235,0.45)"; }}}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = isAnalyzeDisabled ? "none" : "0 4px 16px rgba(37,99,235,0.35)"; }}
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 rounded-full animate-spin border-2 border-white border-t-transparent" />
                    Analyzing with Gemini AI...
                  </>
                ) : (
                  <>🔍 Analyze with MedGemma</>
                )}
              </button>

              {/* Error box */}
              {error && (
                <div
                  role="alert"
                  className="rounded-xl px-4 py-3 text-sm"
                  style={{ background: "#fef2f2", border: "1.5px solid #fca5a5", color: "#dc2626" }}
                >
                  <p className="font-bold mb-0.5">Analysis Failed</p>
                  <p style={{ color: "#b91c1c", fontSize: "13px" }}>{error}</p>
                </div>
              )}
            </div>
          </div>

          {/* ══ RIGHT COLUMN ══ */}
          <div className="flex flex-col">
            {loading ? (
              <div
                className="rounded-2xl"
                style={{ background: "#fff", boxShadow: "0 4px 20px rgba(0,0,0,0.07)", border: "1px solid #e2e8f0" }}
              >
                <LoadingSpinner />
              </div>
            ) : result ? (
              <TriageResultCard result={result} language={language} />
            ) : (
              /* Empty state */
              <div
                className="rounded-2xl flex flex-col items-center justify-center py-16 px-8 text-center"
                style={{
                  background: "#fff",
                  border: "2px dashed #cbd5e1",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                }}
              >
                <div style={{ fontSize: "64px", marginBottom: "16px" }}>🏥</div>
                <h2 className="font-bold text-lg mb-2" style={{ color: "#1e293b" }}>
                  Ready for Analysis
                </h2>
                <p className="text-sm mb-6 max-w-xs leading-relaxed" style={{ color: "#64748b" }}>
                  Upload a medical image or enter clinical notes to receive AI-powered triage assessment
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {["🩻 Image Analysis", "📋 Text Reasoning", "🌐 Multilingual"].map((pill) => (
                    <span
                      key={pill}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold"
                      style={{ background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe" }}
                    >
                      {pill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer
        className="w-full py-4 text-center text-xs mt-8"
        style={{ background: "#0f172a", color: "#64748b" }}
      >
        MedGemma Clinical Triage Copilot &nbsp;•&nbsp; Built with Google Gemini AI &nbsp;•&nbsp;
        <span style={{ color: "#475569" }}> ⚕️ Not a substitute for professional medical advice</span>
      </footer>
    </div>
  );
}
