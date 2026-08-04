import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaLock, FaTrash, FaPen, FaCheck, FaArrowLeft } from "react-icons/fa";
import { usePortfolioData, PIN_SESSION_KEY } from "../context/PortfolioDataContext";
import { ICON_LIBRARY, ICON_KEYS } from "../data/iconLibrary";
import ImageField from "../components/ImageField";
import DocumentField from "../components/DocumentField";
import SkillIcon from "../components/SkillIcon";
import { formatPublishedAt } from "../utils/formatDate";

// Set VITE_ADMIN_PIN in your .env file (see .env.example) and in your
// hosting provider's environment variables when deploying.
const PIN = import.meta.env.VITE_ADMIN_PIN || "141005";
const SESSION_KEY = "portfolio_admin_unlocked";
const TABS = ["Images", "Skills", "Projects", "Blog", "Footer", "Data"];

/* ---------------------------------- PIN gate ---------------------------------- */

function PinGate({ onUnlock }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  function submit(e) {
    e.preventDefault();
    if (pin === PIN) {
      sessionStorage.setItem(SESSION_KEY, "1");
      sessionStorage.setItem(PIN_SESSION_KEY, pin);
      onUnlock();
    } else {
      setError(true);
      setPin("");
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6">
      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xs flex flex-col items-center gap-6 text-center"
      >
        <div className="h-14 w-14 rounded-full border border-neutral-700 flex items-center justify-center text-xl">
          <FaLock />
        </div>
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-wide mb-1">Admin Access</h1>
          <p className="text-neutral-500 text-sm">Enter PIN to manage your portfolio</p>
        </div>

        <motion.input
          animate={error ? { x: [0, -10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          type="password"
          inputMode="numeric"
          autoFocus
          value={pin}
          onChange={(e) => {
            setError(false);
            setPin(e.target.value.replace(/\D/g, ""));
          }}
          placeholder="••••••"
          className="w-full text-center tracking-[0.6em] text-2xl rounded-lg border border-neutral-800 bg-neutral-950 py-3 focus:outline-none focus:border-neutral-500"
        />

        {error && <p className="text-red-500 text-xs uppercase tracking-widest">Incorrect PIN</p>}

        <button
          type="submit"
          className="w-full rounded-lg bg-white text-black py-3 text-sm font-semibold uppercase tracking-[0.15em] hover:bg-neutral-200 transition"
        >
          Unlock
        </button>

        <Link to="/" className="text-neutral-500 hover:text-white text-xs uppercase tracking-widest flex items-center gap-2 transition">
          <FaArrowLeft size={10} /> Back to site
        </Link>
      </motion.form>
    </div>
  );
}

/* -------------------------------- Icon picker -------------------------------- */

function IconPicker({ value, onSelect }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ICON_KEYS;
    return ICON_KEYS.filter((k) => ICON_LIBRARY[k].label.toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="flex flex-col gap-3">
      <input
        type="text"
        placeholder="Search icons…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500"
      />
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-56 overflow-y-auto pr-1">
        {filtered.map((key) => {
          const { Icon, label, color } = ICON_LIBRARY[key];
          const selected = value === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelect(key)}
              title={label}
              className={`flex flex-col items-center gap-1 rounded-md border px-1 py-2 text-[10px] leading-tight transition ${
                selected
                  ? "border-white bg-neutral-800"
                  : "border-neutral-800 hover:border-neutral-600"
              }`}
            >
              <Icon className="text-xl" style={{ color }} />
              <span className="truncate w-full text-center text-neutral-400">{label}</span>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <p className="col-span-full text-neutral-600 text-xs py-4 text-center">No icons match.</p>
        )}
      </div>
    </div>
  );
}

/* --------------------------------- Images tab --------------------------------- */

function CoverCropPicker() {
  const { data, setHeroPosition } = usePortfolioData();
  const heroUrl = data.images.hero;
  const pos = data.images.heroPosition || { x: 50, y: 50 };
  const boxRef = useRef(null);
  const draggingRef = useRef(false);

  function updateFromEvent(e) {
    const box = boxRef.current;
    if (!box) return;
    const rect = box.getBoundingClientRect();
    const point = e.touches ? e.touches[0] : e;
    const x = Math.min(100, Math.max(0, ((point.clientX - rect.left) / rect.width) * 100));
    const y = Math.min(100, Math.max(0, ((point.clientY - rect.top) / rect.height) * 100));
    setHeroPosition({ x: Math.round(x), y: Math.round(y) });
  }

  function handlePointerDown(e) {
    draggingRef.current = true;
    updateFromEvent(e);
  }
  function handlePointerMove(e) {
    if (!draggingRef.current) return;
    e.preventDefault();
    updateFromEvent(e);
  }
  function stopDragging() {
    draggingRef.current = false;
  }

  return (
    <div className="flex flex-col gap-3 max-w-xl">
      <label className="text-xs uppercase tracking-[0.15em] text-neutral-400">Cover crop position</label>
      <p className="text-xs text-neutral-600">
        The cover photo crops to fill the frame on phones and laptops alike — click or drag
        anywhere on the preview to choose which part of the photo stays in view.
      </p>

      <div
        ref={boxRef}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={stopDragging}
        className="relative w-full aspect-video rounded-lg overflow-hidden border border-neutral-800 bg-neutral-900 cursor-crosshair select-none touch-none"
        style={{
          backgroundImage: heroUrl ? `url('${heroUrl}')` : undefined,
          backgroundSize: "cover",
          backgroundPosition: `${pos.x}% ${pos.y}%`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/40 pointer-events-none" />
        {/* Focal point marker */}
        <div
          className="absolute h-6 w-6 -ml-3 -mt-3 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.4)] pointer-events-none"
          style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
        >
          <span className="absolute inset-1 rounded-full bg-white/40" />
        </div>
      </div>

      <p className="text-xs text-neutral-600">
        Focus point: {pos.x}% horizontal, {pos.y}% vertical
      </p>
    </div>
  );
}

function ImagesTab() {
  const { data, setImage } = usePortfolioData();
  return (
    <div className="flex flex-col gap-8">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <ImageField label="Cover / Hero Image" value={data.images.hero} onChange={(v) => setImage("hero", v)} />
        <ImageField label="About Image" value={data.images.about} onChange={(v) => setImage("about", v)} aspect="aspect-square" />
        <ImageField label="Mindset Image" value={data.images.mindset} onChange={(v) => setImage("mindset", v)} aspect="aspect-square" />
      </div>
      <CoverCropPicker />
    </div>
  );
}

/* --------------------------------- Skills tab --------------------------------- */

const emptySkillForm = { name: "", category: "technology", iconKey: "react", color: "", customIcon: "" };

function SkillsTab() {
  const { data, addSkill, updateSkill, removeSkill } = usePortfolioData();
  const [form, setForm] = useState(emptySkillForm);
  const [iconMode, setIconMode] = useState("preset");
  const [editingId, setEditingId] = useState(null);

  function resetForm() {
    setForm(emptySkillForm);
    setIconMode("preset");
    setEditingId(null);
  }

  function startEdit(skill) {
    setEditingId(skill.id);
    setForm({
      name: skill.name,
      category: skill.category,
      iconKey: skill.iconKey || "react",
      color: skill.color || "",
      customIcon: skill.customIcon || "",
    });
    setIconMode(skill.customIcon ? "custom" : "preset");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function submit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;

    const payload = {
      name: form.name.trim(),
      category: form.category,
      iconKey: iconMode === "preset" ? form.iconKey : "",
      customIcon: iconMode === "custom" ? form.customIcon : "",
      color: form.color || "",
    };

    if (editingId) updateSkill(editingId, payload);
    else addSkill(payload);

    resetForm();
  }

  return (
    <div className="flex flex-col gap-10">
      <form onSubmit={submit} className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-5 flex flex-col gap-5">
        <h3 className="text-sm uppercase tracking-[0.2em] text-neutral-400">
          {editingId ? "Edit Skill" : "Add New Skill"}
        </h3>

        <div className="grid sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Skill name (e.g. Next.js)"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm focus:outline-none focus:border-neutral-500"
          />
          <select
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            className="rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm focus:outline-none focus:border-neutral-500"
          >
            <option value="technology">Technology</option>
            <option value="tool">Tool</option>
            <option value="platform">Platform</option>
          </select>
        </div>

        <div className="flex gap-2 text-xs uppercase tracking-widest">
          {["preset", "custom"].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setIconMode(m)}
              className={`px-3 py-1.5 rounded-full border transition ${
                iconMode === m ? "border-white bg-white text-black" : "border-neutral-700 text-neutral-400"
              }`}
            >
              {m === "preset" ? "Preset Icon" : "Custom Image"}
            </button>
          ))}
        </div>

        {iconMode === "preset" ? (
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <IconPicker value={form.iconKey} onSelect={(k) => setForm((f) => ({ ...f, iconKey: k }))} />
            </div>
            <div className="flex sm:flex-col items-center sm:items-start gap-2 shrink-0">
              <span className="text-xs text-neutral-500 uppercase tracking-widest">Color</span>
              <input
                type="color"
                value={form.color || ICON_LIBRARY[form.iconKey]?.color || "#ffffff"}
                onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                className="h-9 w-14 rounded cursor-pointer bg-transparent border border-neutral-800"
              />
            </div>
          </div>
        ) : (
          <ImageField
            label="Custom icon image"
            aspect="aspect-square max-w-[140px]"
            value={form.customIcon}
            onChange={(v) => setForm((f) => ({ ...f, customIcon: v }))}
          />
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-md bg-white text-black px-5 py-2 text-xs uppercase tracking-[0.15em] font-semibold hover:bg-neutral-200 transition"
          >
            {editingId ? "Save Changes" : "Add Skill"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-md border border-neutral-700 px-5 py-2 text-xs uppercase tracking-[0.15em] text-neutral-300 hover:bg-neutral-800 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {["technology", "tool", "platform"].map((cat) => {
        const items = data.skills.filter((s) => s.category === cat);
        if (!items.length) return null;
        return (
          <div key={cat}>
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-3">{cat}s</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {items.map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center gap-3 rounded-lg border border-neutral-800 bg-neutral-950/50 px-3 py-2.5"
                >
                  <SkillIcon skill={skill} className="text-2xl shrink-0" />
                  <span className="text-sm truncate flex-1">{skill.name}</span>
                  <button
                    type="button"
                    onClick={() => startEdit(skill)}
                    className="text-neutral-500 hover:text-white transition p-1"
                    aria-label="Edit"
                  >
                    <FaPen size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeSkill(skill.id)}
                    className="text-neutral-500 hover:text-red-400 transition p-1"
                    aria-label="Delete"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* -------------------------------- Projects tab -------------------------------- */

const emptyProjectForm = { title: "", desc: "", repository: "", certificate: "", image: "" };

function ProjectsTab() {
  const { data, addProject, updateProject, removeProject } = usePortfolioData();
  const [form, setForm] = useState(emptyProjectForm);
  const [editingId, setEditingId] = useState(null);

  function resetForm() {
    setForm(emptyProjectForm);
    setEditingId(null);
  }

  function startEdit(project) {
    setEditingId(project.id);
    setForm({
      title: project.title,
      desc: project.desc,
      repository: project.repository,
      certificate: project.certificate || "",
      image: project.image || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function submit(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    if (editingId) updateProject(editingId, form);
    else addProject(form);
    resetForm();
  }

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={submit} className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-5 flex flex-col gap-4">
        <h3 className="text-sm uppercase tracking-[0.2em] text-neutral-400">
          {editingId ? "Edit Project" : "Add New Project"}
        </h3>

        <input
          type="text"
          placeholder="Project title"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          className="rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm focus:outline-none focus:border-neutral-500"
        />
        <textarea
          placeholder="Short description"
          value={form.desc}
          onChange={(e) => setForm((f) => ({ ...f, desc: e.target.value }))}
          rows={3}
          className="rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm focus:outline-none focus:border-neutral-500 resize-none"
        />
        <input
          type="text"
          placeholder="Repository / live link"
          value={form.repository}
          onChange={(e) => setForm((f) => ({ ...f, repository: e.target.value }))}
          className="rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm focus:outline-none focus:border-neutral-500"
        />
        <ImageField
          label="Project image (optional)"
          value={form.image}
          onChange={(v) => setForm((f) => ({ ...f, image: v }))}
        />
        <DocumentField
          label="Certificate (optional — shows a Certificate link only if set)"
          value={form.certificate}
          onChange={(v) => setForm((f) => ({ ...f, certificate: v }))}
        />

        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-md bg-white text-black px-5 py-2 text-xs uppercase tracking-[0.15em] font-semibold hover:bg-neutral-200 transition"
          >
            {editingId ? "Save Changes" : "Add Project"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-md border border-neutral-700 px-5 py-2 text-xs uppercase tracking-[0.15em] text-neutral-300 hover:bg-neutral-800 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="flex flex-col gap-3">
        {data.projects.map((project) => (
          <div
            key={project.id}
            className="flex items-start gap-4 rounded-lg border border-neutral-800 bg-neutral-950/50 p-4"
          >
            {project.image && (
              <img src={project.image} alt="" className="h-16 w-16 rounded-md object-cover shrink-0" />
            )}
            <div className="min-w-0 flex-1">
              <p className="font-semibold uppercase text-sm truncate">{project.title}</p>
              <p className="text-neutral-500 text-xs line-clamp-2 mt-1">{project.desc}</p>
            </div>
            <div className="flex gap-1 shrink-0">
              <button
                type="button"
                onClick={() => startEdit(project)}
                className="text-neutral-500 hover:text-white transition p-2"
                aria-label="Edit"
              >
                <FaPen size={12} />
              </button>
              <button
                type="button"
                onClick={() => removeProject(project.id)}
                className="text-neutral-500 hover:text-red-400 transition p-2"
                aria-label="Delete"
              >
                <FaTrash size={12} />
              </button>
            </div>
          </div>
        ))}
        {data.projects.length === 0 && (
          <p className="text-neutral-600 text-sm text-center py-6">No projects yet.</p>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------- Blog tab ---------------------------------- */

const emptyBlogForm = { title: "", excerpt: "", link: "", publishedAt: "", image: "" };

function defaultBlogForm() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return { ...emptyBlogForm, publishedAt: now.toISOString().slice(0, 16) };
}

function BlogTab() {
  const { data, addBlogPost, updateBlogPost, removeBlogPost } = usePortfolioData();
  const [form, setForm] = useState(defaultBlogForm);
  const [editingId, setEditingId] = useState(null);

  function resetForm() {
    setForm(defaultBlogForm());
    setEditingId(null);
  }

  function startEdit(post) {
    setEditingId(post.id);
    setForm({
      title: post.title,
      excerpt: post.excerpt || "",
      link: post.link || "",
      publishedAt: post.publishedAt || "",
      image: post.image || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function submit(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    if (editingId) updateBlogPost(editingId, form);
    else addBlogPost(form);
    resetForm();
  }

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={submit} className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-5 flex flex-col gap-4">
        <h3 className="text-sm uppercase tracking-[0.2em] text-neutral-400">
          {editingId ? "Edit Post" : "Add New Post"}
        </h3>

        <div className="grid sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Post title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm focus:outline-none focus:border-neutral-500"
          />
          <input
            type="datetime-local"
            value={form.publishedAt}
            onChange={(e) => setForm((f) => ({ ...f, publishedAt: e.target.value }))}
            className="rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm focus:outline-none focus:border-neutral-500 [color-scheme:dark]"
          />
        </div>
        <textarea
          placeholder="Short excerpt"
          value={form.excerpt}
          onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
          rows={3}
          className="rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm focus:outline-none focus:border-neutral-500 resize-none"
        />
        <input
          type="text"
          placeholder="Link to full post (optional)"
          value={form.link}
          onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
          className="rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm focus:outline-none focus:border-neutral-500"
        />
        <ImageField
          label="Cover image (optional — shown square on the site)"
          value={form.image}
          onChange={(v) => setForm((f) => ({ ...f, image: v }))}
          aspect="aspect-square max-w-[200px]"
        />

        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-md bg-white text-black px-5 py-2 text-xs uppercase tracking-[0.15em] font-semibold hover:bg-neutral-200 transition"
          >
            {editingId ? "Save Changes" : "Add Post"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-md border border-neutral-700 px-5 py-2 text-xs uppercase tracking-[0.15em] text-neutral-300 hover:bg-neutral-800 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="flex flex-col gap-3">
        {data.blogPosts.map((post) => (
          <div
            key={post.id}
            className="flex items-start gap-4 rounded-lg border border-neutral-800 bg-neutral-950/50 p-4"
          >
            {post.image && (
              <img src={post.image} alt="" className="h-16 w-16 rounded-md object-cover shrink-0" />
            )}
            <div className="min-w-0 flex-1">
              <p className="font-semibold uppercase text-sm truncate">{post.title}</p>
              {post.publishedAt && (
                <p className="text-neutral-600 text-[11px] uppercase tracking-wide mt-0.5">
                  {formatPublishedAt(post.publishedAt)}
                </p>
              )}
              <p className="text-neutral-500 text-xs line-clamp-2 mt-1">{post.excerpt}</p>
            </div>
            <div className="flex gap-1 shrink-0">
              <button
                type="button"
                onClick={() => startEdit(post)}
                className="text-neutral-500 hover:text-white transition p-2"
                aria-label="Edit"
              >
                <FaPen size={12} />
              </button>
              <button
                type="button"
                onClick={() => removeBlogPost(post.id)}
                className="text-neutral-500 hover:text-red-400 transition p-2"
                aria-label="Delete"
              >
                <FaTrash size={12} />
              </button>
            </div>
          </div>
        ))}
        {data.blogPosts.length === 0 && (
          <p className="text-neutral-600 text-sm text-center py-6">No blog posts yet.</p>
        )}
      </div>
    </div>
  );
}

/* --------------------------------- Footer tab --------------------------------- */

const FOOTER_FIELDS = [
  { key: "phone", label: "Phone (shown + used for tel: link)", placeholder: "+91 9930598420" },
  { key: "email", label: "Email", placeholder: "you@example.com" },
  { key: "github", label: "GitHub URL", placeholder: "https://github.com/username" },
  { key: "linkedin", label: "LinkedIn URL", placeholder: "https://linkedin.com/in/username" },
  { key: "instagram", label: "Instagram URL", placeholder: "https://instagram.com/username" },
  { key: "resume", label: "Resume link", placeholder: "https://drive.google.com/..." },
];

function FooterTab() {
  const { data, updateFooter } = usePortfolioData();

  return (
    <div className="flex flex-col gap-5 max-w-xl">
      <p className="text-neutral-500 text-sm leading-6">
        These power the Contact footer buttons and the GitHub icon in the navbar. Leave a field
        blank to hide that button on the live site.
      </p>
      {FOOTER_FIELDS.map((f) => (
        <div key={f.key} className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-[0.15em] text-neutral-400">{f.label}</label>
          <input
            type="text"
            placeholder={f.placeholder}
            value={data.footer[f.key] || ""}
            onChange={(e) => updateFooter({ [f.key]: e.target.value })}
            className="rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm focus:outline-none focus:border-neutral-500"
          />
        </div>
      ))}
    </div>
  );
}

/* ---------------------------------- Data tab ---------------------------------- */

function DataTab() {
  const { data, resetToDefault, importData, syncStatus, syncError } = usePortfolioData();
  const [copied, setCopied] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  function download() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "portfolio-data.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function copyDefaultDataCode() {
    const code = `export const defaultData = ${JSON.stringify(data, null, 2)};\n`;
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleImportFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        importData(parsed);
      } catch {
        alert("Invalid JSON file.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  return (
    <div className="flex flex-col gap-6 max-w-xl">
      {syncStatus === "error" ? (
        <div className="rounded-xl border border-red-900/60 bg-red-950/20 p-5">
          <h3 className="text-sm uppercase tracking-[0.2em] text-red-400 mb-2">
            Database connected but the last request failed
          </h3>
          <p className="text-neutral-400 text-sm leading-6 mb-3">
            Your site is talking to <code className="text-neutral-300">/api/data</code>, but the
            database itself is rejecting the request. The exact error from the server:
          </p>
          <p className="rounded-md bg-black/50 border border-red-900/40 px-3 py-2 text-xs font-mono text-red-300 break-words">
            {syncError || "Unknown error"}
          </p>
          <p className="text-neutral-500 text-xs leading-5 mt-3">
            Common causes: the password in <code className="text-neutral-300">MONGODB_URI</code> is
            wrong or not URL-encoded, MongoDB Atlas → Network Access doesn't allow{" "}
            <code className="text-neutral-300">0.0.0.0/0</code>, or{" "}
            <code className="text-neutral-300">ADMIN_PIN</code> doesn't match{" "}
            <code className="text-neutral-300">VITE_ADMIN_PIN</code>. After fixing the env var in
            Vercel, redeploy for it to take effect.
          </p>
        </div>
      ) : syncStatus === "local-only" ? (
        <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-5">
          <h3 className="text-sm uppercase tracking-[0.2em] text-neutral-400 mb-2">
            Saving locally (no database connected yet)
          </h3>
          <p className="text-neutral-500 text-sm leading-6">
            Edits are saved instantly to <span className="text-neutral-300">this browser</span> only
            — they won't show up on other devices or for other visitors yet. Connect a database
            (see the README's "Persistent storage" section — it's a one-time, ~5 minute setup) and
            every edit will automatically sync everywhere the moment you save it, on any device,
            with no redeploy needed. Until then, use{" "}
            <span className="text-neutral-300">"Copy source code"</span> below and paste it into{" "}
            <code className="text-neutral-300">src/data/defaultData.js</code> to make an edit
            permanent for everyone.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-5">
          <h3 className="text-sm uppercase tracking-[0.2em] text-neutral-400 mb-2">
            Synced — edits go live everywhere
          </h3>
          <p className="text-neutral-500 text-sm leading-6">
            Your database is connected, so every edit here saves to the shared backend a moment
            after you make it (see the status dot in the header) and shows up for every visitor on
            every device — no redeploy needed.{" "}
            <span className="text-neutral-300">"Copy source code"</span> below is still handy as a
            backup or to bump what ships in <code className="text-neutral-300">src/data/defaultData.js</code>{" "}
            (used only if the database is ever unreachable).
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={copyDefaultDataCode}
          className="rounded-md bg-white text-black px-5 py-2.5 text-xs uppercase tracking-[0.15em] font-semibold hover:bg-neutral-200 transition flex items-center gap-2"
        >
          {copied ? <FaCheck size={12} /> : null} {copied ? "Copied!" : "Copy source code"}
        </button>
        <button
          type="button"
          onClick={download}
          className="rounded-md border border-neutral-700 px-5 py-2.5 text-xs uppercase tracking-[0.15em] text-neutral-200 hover:bg-neutral-800 transition"
        >
          Export JSON
        </button>
        <label className="rounded-md border border-neutral-700 px-5 py-2.5 text-xs uppercase tracking-[0.15em] text-neutral-200 hover:bg-neutral-800 transition cursor-pointer">
          Import JSON
          <input type="file" accept="application/json" onChange={handleImportFile} className="hidden" />
        </label>
      </div>

      <div className="pt-4 border-t border-neutral-900">
        {!confirmReset ? (
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="text-red-500 text-xs uppercase tracking-[0.15em] hover:text-red-400 transition"
          >
            Reset everything to default
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-neutral-400 text-xs uppercase tracking-widest">Are you sure?</span>
            <button
              type="button"
              onClick={() => {
                resetToDefault();
                setConfirmReset(false);
              }}
              className="rounded-md bg-red-600 px-4 py-1.5 text-xs uppercase tracking-widest text-white hover:bg-red-500 transition"
            >
              Yes, reset
            </button>
            <button
              type="button"
              onClick={() => setConfirmReset(false)}
              className="text-neutral-500 text-xs uppercase tracking-widest hover:text-white transition"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ----------------------------------- Admin ----------------------------------- */

function SyncBadge() {
  const { syncStatus, syncError } = usePortfolioData();
  const config = {
    idle: null,
    syncing: { label: "Saving…", dot: "bg-yellow-400 animate-pulse" },
    synced: { label: "Synced", dot: "bg-green-500" },
    "local-only": { label: "Local only", dot: "bg-neutral-500" },
    error: { label: "Save failed", dot: "bg-red-500" },
  }[syncStatus];

  if (!config) return null;
  return (
    <span
      className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-neutral-400"
      title={syncStatus === "error" ? syncError : config.label}
    >
      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${config.dot}`} />
      <span className="hidden sm:inline">{config.label}</span>
    </span>
  );
}

function Dashboard() {
  const [tab, setTab] = useState("Images");

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <header className="sticky top-0 z-20 bg-black/90 backdrop-blur-md border-b border-neutral-900 px-4 sm:px-8 py-3 sm:py-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-neutral-500">Admin</p>
          <h1 className="text-base sm:text-xl font-bold uppercase tracking-wide truncate">Portfolio Manager</h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <SyncBadge />
          <Link
            to="/"
            className="text-[10px] sm:text-xs uppercase tracking-widest text-neutral-300 border border-neutral-700 rounded-md px-2.5 sm:px-3 py-1.5 sm:py-2 hover:bg-neutral-800 transition whitespace-nowrap"
          >
            View Site
          </Link>
          <button
            type="button"
            onClick={() => {
              sessionStorage.removeItem(SESSION_KEY);
              sessionStorage.removeItem(PIN_SESSION_KEY);
              window.location.reload();
            }}
            className="text-[10px] sm:text-xs uppercase tracking-widest text-neutral-500 hover:text-red-400 transition whitespace-nowrap"
          >
            Lock
          </button>
        </div>
      </header>

      <nav className="no-scrollbar sticky top-[57px] sm:top-[65px] z-10 bg-[#050505]/95 backdrop-blur-sm border-b border-neutral-900 px-4 sm:px-8 flex gap-0.5 sm:gap-1 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`relative px-2.5 sm:px-4 py-2.5 sm:py-3 text-[11px] sm:text-sm uppercase tracking-[0.1em] sm:tracking-[0.15em] whitespace-nowrap transition ${
              tab === t ? "text-white" : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            {t}
            {tab === t && (
              <motion.span layoutId="admin-tab-underline" className="absolute left-0 right-0 -bottom-px h-0.5 bg-white" />
            )}
          </button>
        ))}
      </nav>

      <main className="px-4 sm:px-8 py-6 sm:py-8 max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {tab === "Images" && <ImagesTab />}
            {tab === "Skills" && <SkillsTab />}
            {tab === "Projects" && <ProjectsTab />}
            {tab === "Blog" && <BlogTab />}
            {tab === "Footer" && <FooterTab />}
            {tab === "Data" && <DataTab />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function Admin() {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(SESSION_KEY) === "1");
  if (!unlocked) return <PinGate onUnlock={() => setUnlocked(true)} />;
  return <Dashboard />;
}
