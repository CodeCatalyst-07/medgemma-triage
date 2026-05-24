const LANGUAGES = [
  { value: "en",  label: "🇬🇧 English" },
  { value: "hi",  label: "🇮🇳 हिंदी (Hindi)" },
  { value: "ta",  label: "🇮🇳 தமிழ் (Tamil)" },
  { value: "te",  label: "🇮🇳 తెలుగు (Telugu)" },
  { value: "kn",  label: "🇮🇳 ಕನ್ನಡ (Kannada)" },
  { value: "mr",  label: "🇮🇳 मराठी (Marathi)" },
  { value: "bn",  label: "🇮🇳 বাংলা (Bengali)" },
  { value: "gu",  label: "🇮🇳 ગુજરાતી (Gujarati)" },
];

export default function LanguageSelector({ value, onChange }) {
  const isNonEnglish = value !== "en";

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor="language-select"
        className="text-sm font-semibold"
        style={{ color: "#1e293b" }}
      >
        Response Language
      </label>

      <select
        id="language-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 rounded-xl text-sm cursor-pointer transition-all duration-150"
        style={{
          border: "1.5px solid #e2e8f0",
          color: "#1e293b",
          background: "#fff",
          outline: "none",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        }}
        onFocus={(e) => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.12)"; }}
        onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)"; }}
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.value} value={lang.value}>
            {lang.label}
          </option>
        ))}
      </select>

      {isNonEnglish && (
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium"
          style={{ background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe" }}
        >
          🌐 Input will be auto-translated to English
        </div>
      )}
    </div>
  );
}
