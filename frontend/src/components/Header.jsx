export default function Header({ isConnected }) {
  return (
    <header className="w-full sticky top-0 z-50" style={{ background: "#0f172a", boxShadow: "0 4px 24px rgba(0,0,0,0.25)" }}>
      <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between" style={{ height: "70px" }}>

        {/* Left — Logo + Titles */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-xl text-xl font-bold"
            style={{ background: "linear-gradient(135deg, #2563eb, #0891b2)" }}
            aria-hidden="true"
          >
            ✚
          </div>
          <div>
            <div className="text-white font-bold leading-tight" style={{ fontSize: "17px", letterSpacing: "-0.3px" }}>
              MedGemma Clinical Triage Copilot
            </div>
            <div className="hidden sm:block font-medium" style={{ fontSize: "11px", color: "#0891b2", letterSpacing: "0.3px" }}>
              Powered by Google Gemini AI
            </div>
          </div>
        </div>

        {/* Right — Connection badge */}
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-300"
          style={
            isConnected
              ? { background: "rgba(22,163,74,0.12)", borderColor: "#16a34a", color: "#4ade80" }
              : { background: "rgba(220,38,38,0.12)", borderColor: "#dc2626", color: "#f87171" }
          }
        >
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{
              background: isConnected ? "#4ade80" : "#f87171",
              animation: isConnected ? "pulseDot 1.5s ease-in-out infinite" : "none",
            }}
          />
          {isConnected ? "API Connected" : "Offline"}
        </div>
      </div>

      {/* Gradient bottom border */}
      <div style={{ height: "2px", background: "linear-gradient(90deg, #2563eb, #0891b2, #2563eb)" }} />
    </header>
  );
}
