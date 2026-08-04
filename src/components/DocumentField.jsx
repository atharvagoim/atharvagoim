import { useRef, useState } from "react";
import { FaFileAlt, FaTimes } from "react-icons/fa";

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function isImage(value) {
  if (!value) return false;
  if (value.startsWith("data:image")) return true;
  return /\.(png|jpe?g|webp|gif|svg)$/i.test(value.split("?")[0]);
}

// A URL-or-upload field for documents that aren't necessarily images
// (e.g. a certificate, which could be a JPG/PNG or a PDF).
export default function DocumentField({ label, value, onChange }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const dataUrl = await fileToDataUrl(file);
      onChange(dataUrl);
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-xs uppercase tracking-[0.15em] text-neutral-400">{label}</label>
      )}

      {value ? (
        <div className="flex items-center gap-3 rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2.5">
          {isImage(value) ? (
            <img src={value} alt="" className="h-10 w-10 rounded object-cover shrink-0" />
          ) : (
            <div className="h-10 w-10 rounded bg-neutral-900 flex items-center justify-center shrink-0 text-neutral-400">
              <FaFileAlt />
            </div>
          )}
          <span className="text-xs text-neutral-400 truncate flex-1">
            {value.startsWith("data:") ? "Uploaded file attached" : value}
          </span>
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-neutral-500 hover:text-red-400 transition p-1 shrink-0"
            aria-label="Remove"
          >
            <FaTimes size={12} />
          </button>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Paste certificate URL…"
            value=""
            onChange={(e) => onChange(e.target.value)}
            className="min-w-0 flex-1 rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500"
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="shrink-0 rounded-md border border-neutral-700 px-3 py-2 text-xs uppercase tracking-[0.1em] text-neutral-200 hover:bg-neutral-800 transition"
          >
            {busy ? "Uploading…" : "Upload File"}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFile}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}
