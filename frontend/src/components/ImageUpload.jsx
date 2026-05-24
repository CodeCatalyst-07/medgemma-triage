import { useRef, useState } from "react";

const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const MAX_BYTES = 5 * 1024 * 1024;

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isValidFile(file) {
  return file && ACCEPTED_TYPES.includes(file.type) && file.size <= MAX_BYTES;
}

export default function ImageUpload({ onFileSelected, selectedFile }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const previewUrl = selectedFile ? URL.createObjectURL(selectedFile) : null;

  function handleDragOver(e) { e.preventDefault(); e.stopPropagation(); setDragging(true); }
  function handleDragLeave(e) { e.preventDefault(); e.stopPropagation(); setDragging(false); }
  function handleDrop(e) {
    e.preventDefault(); e.stopPropagation(); setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (isValidFile(file)) onFileSelected(file);
  }
  function handleClick() { inputRef.current?.click(); }
  function handleInputChange(e) {
    const file = e.target.files?.[0];
    if (isValidFile(file)) onFileSelected(file);
    e.target.value = "";
  }
  function handleRemove(e) { e.stopPropagation(); onFileSelected(null); }

  return (
    <div className="flex flex-col gap-4">
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,image/jpeg,image/png"
        className="hidden"
        onChange={handleInputChange}
        aria-label="Browse medical image file"
      />

      {/* Drop Zone */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Drop zone for medical image"
        onClick={handleClick}
        onKeyDown={(e) => e.key === "Enter" && handleClick()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="flex flex-col items-center justify-center gap-4 w-full py-10 px-6 rounded-2xl cursor-pointer select-none transition-all duration-200"
        style={{
          background: dragging ? "#dbeafe" : "#eff6ff",
          border: dragging ? "2px solid #2563eb" : "2px dashed #93c5fd",
          transform: dragging ? "scale(1.01)" : "scale(1)",
        }}
        onMouseEnter={(e) => { if (!dragging) e.currentTarget.style.borderColor = "#3b82f6"; }}
        onMouseLeave={(e) => { if (!dragging) e.currentTarget.style.borderColor = "#93c5fd"; }}
      >
        <div className="text-5xl" aria-hidden="true">🩻</div>
        <div className="text-center">
          <p className="font-bold text-base" style={{ color: "#1e293b" }}>
            {dragging ? "Release to upload" : "Drop your X-ray or medical scan here"}
          </p>
          <p className="text-sm mt-1" style={{ color: "#64748b" }}>
            Supports JPG, PNG • Maximum 5MB
          </p>
        </div>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); handleClick(); }}
          className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-150"
          style={{ background: "linear-gradient(135deg, #2563eb, #0891b2)" }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = "0.88"}
          onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
        >
          Browse Files
        </button>
      </div>

      {/* Preview */}
      {selectedFile && previewUrl && (
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{ border: "1.5px solid #e2e8f0", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
        >
          <img
            src={previewUrl}
            alt="Selected scan preview"
            className="w-full object-contain"
            style={{ maxHeight: "200px", background: "#f8fafc" }}
          />
          {/* Info overlay */}
          <div
            className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-2 text-xs font-medium"
            style={{ background: "rgba(15,23,42,0.75)", color: "#e2e8f0" }}
          >
            <span className="truncate max-w-[200px]">📎 {selectedFile.name}</span>
            <span style={{ color: "#94a3b8" }}>{formatBytes(selectedFile.size)}</span>
          </div>
          {/* Remove button */}
          <button
            onClick={handleRemove}
            aria-label="Remove image"
            className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold transition-all duration-150"
            style={{ background: "#dc2626" }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#b91c1c"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#dc2626"}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
