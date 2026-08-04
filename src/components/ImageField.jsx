import { useRef, useState } from "react";

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Lets the admin either paste an image URL or upload a file from their
// device (converted to a base64 data URL and stored in localStorage).
export default function ImageField({ label, value, onChange, aspect = "aspect-video" }) {
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
        <label className="text-xs uppercase tracking-[0.15em] text-neutral-400">
          {label}
        </label>
      )}

      <div className={`relative w-full ${aspect} overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900`}>
        {value ? (
          <img src={value} alt={label} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-neutral-600 text-xs">
            No image set
          </div>
        )}
        {busy && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-xs text-white">
            Uploading…
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Paste image URL…"
          value={value?.startsWith("data:") ? "" : value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="min-w-0 flex-1 rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="shrink-0 rounded-md border border-neutral-700 px-3 py-2 text-xs uppercase tracking-[0.1em] text-neutral-200 hover:bg-neutral-800 transition"
        >
          Upload File
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
        />
      </div>
    </div>
  );
}
