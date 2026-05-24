export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-5">
      {/* Gradient spinning ring */}
      <div className="relative w-16 h-16">
        <div
          className="absolute inset-0 rounded-full"
          style={{ border: "4px solid #e2e8f0" }}
        />
        <div
          className="absolute inset-0 rounded-full animate-spin"
          style={{
            border: "4px solid transparent",
            borderTopColor: "#2563eb",
            borderRightColor: "#0891b2",
          }}
        />
      </div>

      {/* Title */}
      <div className="text-center">
        <p className="font-bold text-base" style={{ color: "#1e293b" }}>
          🤖 Analyzing with Gemini AI
        </p>
        <p className="text-sm mt-1" style={{ color: "#64748b" }}>
          Processing medical data...
        </p>
      </div>

      {/* Bouncing dots */}
      <div className="flex items-center gap-2">
        {["dot-1", "dot-2", "dot-3"].map((cls) => (
          <span
            key={cls}
            className={`inline-block w-2 h-2 rounded-full ${cls}`}
            style={{ background: "#2563eb", opacity: 0.7 }}
          />
        ))}
      </div>
    </div>
  );
}
