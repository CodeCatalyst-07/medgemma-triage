const MAX_CHARS = 1000;

export default function NotesInput({ value, onChange, language }) {
  const count = value ? value.length : 0;
  const isOverLimit = count > MAX_CHARS;
  const isNearLimit = count > 850;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <label htmlFor="patient-notes" className="text-sm font-semibold" style={{ color: "#1e293b" }}>
          Patient Notes
        </label>
        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "#f1f5f9", color: "#64748b" }}>
          Optional
        </span>
        <span className="text-xs" title="Enter symptoms, history, and vital signs" style={{ color: "#94a3b8" }}>ℹ️</span>
      </div>

      <div className="relative">
        <textarea
          id="patient-notes"
          rows={5}
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, MAX_CHARS))}
          placeholder="Enter symptoms, history, vital signs, chief complaint..."
          className="w-full resize-none rounded-xl px-4 py-3 text-sm transition-all duration-150"
          style={{
            border: isOverLimit ? "1.5px solid #dc2626" : "1.5px solid #e2e8f0",
            color: "#1e293b",
            background: isOverLimit ? "#fff5f5" : "#fff",
            outline: "none",
            lineHeight: "1.6",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            paddingBottom: "2rem",
          }}
          onFocus={(e) => {
            if (!isOverLimit) {
              e.target.style.borderColor = "#2563eb";
              e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.12)";
            }
          }}
          onBlur={(e) => {
            e.target.style.borderColor = isOverLimit ? "#dc2626" : "#e2e8f0";
            e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)";
          }}
        />
        <span
          className="absolute bottom-2.5 right-3 text-xs font-semibold px-2 py-0.5 rounded-full pointer-events-none"
          style={
            isOverLimit
              ? { background: "#fee2e2", color: "#dc2626" }
              : isNearLimit
              ? { background: "#fef3c7", color: "#d97706" }
              : { background: "#f1f5f9", color: "#94a3b8" }
          }
        >
          {count} / {MAX_CHARS}
        </span>
      </div>
    </div>
  );
}
