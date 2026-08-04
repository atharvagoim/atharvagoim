import { motion } from "framer-motion";

const OPTIONS = [
  { key: "work", label: "Work" },
  { key: "blog", label: "Blog" },
];

// Reusable segmented pill toggle. `layoutId` lets multiple instances on the
// page (e.g. one in the hero, one above the content) share a single sliding
// indicator animation without fighting each other.
export default function WorkBlogToggle({ activeTab, onSelect, layoutId = "work-blog-toggle", className = "" }) {
  return (
    <div className={`inline-flex rounded-full border border-neutral-800 bg-neutral-950/60 p-1 ${className}`}>
      {OPTIONS.map((t) => (
        <button
          key={t.key}
          type="button"
          onClick={() => onSelect(t.key)}
          className={`relative px-5 sm:px-6 py-2.5 text-xs sm:text-sm uppercase tracking-[0.15em] rounded-full transition-colors duration-300 ${
            activeTab === t.key ? "text-black" : "text-neutral-400 hover:text-neutral-200"
          }`}
        >
          {activeTab === t.key && (
            <motion.span
              layoutId={layoutId}
              transition={{ type: "spring", stiffness: 400, damping: 32 }}
              className="absolute inset-0 rounded-full bg-white"
            />
          )}
          <span className="relative">{t.label}</span>
        </button>
      ))}
    </div>
  );
}
