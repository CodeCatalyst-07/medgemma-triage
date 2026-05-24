const TRIAGE_CONFIG = {
  emergent: {
    icon: "🚨",
    label: "EMERGENT",
    sublabel: "Immediate Action Required",
    bannerBg: "#dc2626",
    bannerText: "#fff",
    stripeColor: "#dc2626",
  },
  urgent: {
    icon: "⚠️",
    label: "URGENT",
    sublabel: "Prompt Attention Needed",
    bannerBg: "#d97706",
    bannerText: "#1e293b",
    stripeColor: "#d97706",
  },
  routine: {
    icon: "✅",
    label: "ROUTINE",
    sublabel: "Standard Care",
    bannerBg: "#16a34a",
    bannerText: "#fff",
    stripeColor: "#16a34a",
  },
};

function ConfidenceBar({ value }) {
  const pct = Math.round((value ?? 0) * 100);
  const color = pct >= 80 ? "#dc2626" : pct >= 60 ? "#d97706" : "#2563eb";
  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="flex-1 rounded-full overflow-hidden" style={{ height: "6px", background: "#e2e8f0" }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="text-xs font-semibold tabular-nums" style={{ color, minWidth: "32px" }}>
        {pct}%
      </span>
    </div>
  );
}

export default function TriageResultCard({ result, language }) {
  if (!result) return null;

  const level = (result.triage_level ?? "routine").toLowerCase();
  const cfg = TRIAGE_CONFIG[level] ?? TRIAGE_CONFIG.routine;
  const anomalies = result.anomalies ?? [];
  const hasSummaryTx = language !== "en" && result.overall_summary_translated;
  const hasActionTx = language !== "en" && result.recommended_action_translated;

  return (
    <div
      className="rounded-2xl overflow-hidden animate-fade-slide-up"
      style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.12)", border: "1px solid #e2e8f0" }}
    >
      {/* ── TRIAGE BANNER ── */}
      <div
        className="flex items-center gap-4 px-6 py-5"
        style={{
          background: cfg.bannerBg,
          color: cfg.bannerText,
          animation: level === "emergent" ? "pulseDot 2s ease-in-out infinite" : "none",
        }}
      >
        <span style={{ fontSize: "36px" }}>{cfg.icon}</span>
        <div>
          <p className="font-extrabold uppercase tracking-widest" style={{ fontSize: "26px", lineHeight: 1 }}>
            {cfg.label}
          </p>
          <p className="font-medium mt-0.5" style={{ fontSize: "13px", opacity: 0.85 }}>
            {cfg.sublabel}
          </p>
        </div>
      </div>

      <div style={{ background: "#fff" }}>
        {/* ── CLINICAL SUMMARY ── */}
        <section className="px-6 py-5" style={{ borderBottom: "1px solid #f1f5f9" }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#2563eb" }}>
            📋 Clinical Summary
          </p>
          <div style={{ borderLeft: "4px solid #2563eb", paddingLeft: "14px" }}>
            <p className="text-sm leading-relaxed" style={{ color: "#1e293b", lineHeight: "1.7" }}>
              {result.overall_summary ?? "—"}
            </p>
            {hasSummaryTx && (
              <div className="mt-3 p-3 rounded-xl" style={{ background: "#eff6ff", border: "1px solid #bfdbfe" }}>
                <p className="text-xs mb-1" style={{ color: "#2563eb" }}>🌐 Translated</p>
                <p className="text-sm leading-relaxed" style={{ color: "#1e293b" }}>
                  {result.overall_summary_translated}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ── ANOMALIES ── */}
        <section className="px-6 py-5" style={{ borderBottom: "1px solid #f1f5f9" }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#2563eb" }}>
            🔬 Detected Anomalies
          </p>
          {anomalies.length === 0 ? (
            <p className="text-sm italic" style={{ color: "#94a3b8" }}>No anomalies detected.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {anomalies.map((a, i) => {
                const pct = Math.round((a.confidence ?? 0) * 100);
                const stripe = pct >= 80 ? "#dc2626" : pct >= 60 ? "#d97706" : "#2563eb";
                return (
                  <div
                    key={i}
                    className="rounded-xl overflow-hidden flex"
                    style={{ border: "1px solid #e2e8f0", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
                  >
                    <div className="w-1 shrink-0" style={{ background: stripe }} />
                    <div className="flex-1 px-4 py-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm" style={{ color: "#1e293b" }}>
                          {a.name ?? "Unknown finding"}
                        </span>
                      </div>
                      {a.location && (
                        <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>📍 {a.location}</p>
                      )}
                      <ConfidenceBar value={a.confidence} />
                      {a.reasoning && (
                        <p className="text-xs mt-2 italic leading-relaxed" style={{ color: "#64748b" }}>
                          {a.reasoning}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── RECOMMENDED ACTION ── */}
        <section className="px-6 py-5" style={{ borderBottom: "1px solid #f1f5f9" }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#2563eb" }}>
            💊 Recommended Action
          </p>
          <div
            className="rounded-xl px-4 py-3"
            style={{ background: "#eff6ff", borderLeft: "4px solid #2563eb" }}
          >
            <p className="text-sm leading-relaxed" style={{ color: "#1e293b", lineHeight: "1.7" }}>
              {result.recommended_action ?? "—"}
            </p>
            {hasActionTx && (
              <div className="mt-3 pt-3" style={{ borderTop: "1px solid #bfdbfe" }}>
                <p className="text-xs mb-1" style={{ color: "#2563eb" }}>🌐 Translated</p>
                <p className="text-sm leading-relaxed" style={{ color: "#1e293b" }}>
                  {result.recommended_action_translated}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ── SAFETY DISCLAIMER ── */}
        <section className="px-6 py-4" style={{ background: "#f8fafc" }}>
          <p className="text-xs italic leading-relaxed" style={{ color: "#94a3b8" }}>
            <span className="not-italic mr-1">⚕️</span>
            {result.safety_notes ?? "This output is AI-generated and is not a medical diagnosis. Always consult a qualified healthcare professional."}
          </p>
        </section>
      </div>
    </div>
  );
}
