import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { defaultData } from "../data/defaultData";
import { fetchRemoteData, saveRemoteData } from "../utils/api";

const STORAGE_KEY = "portfolio_data_v1";
const PIN_SESSION_KEY = "portfolio_admin_pin";
const SYNC_DEBOUNCE_MS = 800;

const PortfolioDataContext = createContext(null);

function mergeWithDefaults(parsed) {
  if (!parsed || typeof parsed !== "object") return structuredClone(defaultData);
  return {
    images: {
      ...defaultData.images,
      ...(parsed.images || {}),
      heroPosition: {
        ...defaultData.images.heroPosition,
        ...((parsed.images && parsed.images.heroPosition) || {}),
      },
    },
    footer: { ...defaultData.footer, ...(parsed.footer || {}) },
    skills: Array.isArray(parsed.skills) ? parsed.skills : defaultData.skills,
    projects: Array.isArray(parsed.projects) ? parsed.projects : defaultData.projects,
    blogPosts: Array.isArray(parsed.blogPosts) ? parsed.blogPosts : defaultData.blogPosts,
  };
}

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(defaultData);
    return mergeWithDefaults(JSON.parse(raw));
  } catch {
    return structuredClone(defaultData);
  }
}

function uid(prefix) {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

export function PortfolioDataProvider({ children }) {
  const [data, setData] = useState(loadInitial);
  // "idle" (nothing to sync yet), "synced" (backend confirmed), "local-only"
  // (no backend configured — expected until MONGODB_URI/ADMIN_PIN are set),
  // "syncing", "error" (backend configured but the last save/load failed).
  const [syncStatus, setSyncStatus] = useState("idle");
  const [syncError, setSyncError] = useState("");

  const skipNextSync = useRef(true); // the initial mount's load shouldn't trigger a save
  const debounceTimer = useRef(null);
  const backendConfigured = useRef(true); // optimistic until we learn otherwise

  // Always keep localStorage as an instant-load cache / offline fallback.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // storage full or unavailable — silently ignore
    }
  }, [data]);

  // On mount, pull the shared/remote copy (if a backend is configured) so
  // every device converges on the same content instead of each browser's
  // own local cache.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { configured, data: remote } = await fetchRemoteData();
        backendConfigured.current = configured;
        if (!configured) {
          setSyncStatus("local-only");
          return;
        }
        if (!cancelled && remote) {
          skipNextSync.current = true;
          setData(mergeWithDefaults(remote));
        }
        setSyncStatus("synced");
        setSyncError("");
      } catch (err) {
        // The backend IS configured but the request failed (bad connection
        // string, unreachable DB, etc.) — surface this as a real error
        // instead of silently pretending nothing is configured.
        backendConfigured.current = true;
        setSyncStatus("error");
        setSyncError(err.message || "Failed to load from database");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Push changes to the backend (debounced), skipping the sync that would
  // otherwise fire right after we just loaded data from local/remote.
  useEffect(() => {
    if (skipNextSync.current) {
      skipNextSync.current = false;
      return;
    }
    if (!backendConfigured.current) return;

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(async () => {
      try {
        setSyncStatus("syncing");
        const pin = sessionStorage.getItem(PIN_SESSION_KEY) || "";
        await saveRemoteData(data, pin);
        setSyncStatus("synced");
        setSyncError("");
      } catch (err) {
        setSyncStatus("error");
        setSyncError(err.message || "Failed to save to database");
      }
    }, SYNC_DEBOUNCE_MS);

    return () => clearTimeout(debounceTimer.current);
  }, [data]);

  const api = useMemo(
    () => ({
      data,
      syncStatus,
      syncError,

      setImage: (key, url) =>
        setData((d) => ({ ...d, images: { ...d.images, [key]: url } })),
      setHeroPosition: (pos) =>
        setData((d) => ({ ...d, images: { ...d.images, heroPosition: pos } })),

      updateFooter: (patch) =>
        setData((d) => ({ ...d, footer: { ...d.footer, ...patch } })),

      addSkill: (skill) =>
        setData((d) => ({ ...d, skills: [...d.skills, { id: uid("s"), ...skill }] })),
      updateSkill: (id, patch) =>
        setData((d) => ({
          ...d,
          skills: d.skills.map((s) => (s.id === id ? { ...s, ...patch } : s)),
        })),
      removeSkill: (id) =>
        setData((d) => ({ ...d, skills: d.skills.filter((s) => s.id !== id) })),

      addProject: (project) =>
        setData((d) => ({ ...d, projects: [...d.projects, { id: uid("pr"), ...project }] })),
      updateProject: (id, patch) =>
        setData((d) => ({
          ...d,
          projects: d.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        })),
      removeProject: (id) =>
        setData((d) => ({ ...d, projects: d.projects.filter((p) => p.id !== id) })),

      addBlogPost: (post) =>
        setData((d) => ({ ...d, blogPosts: [...d.blogPosts, { id: uid("bp"), ...post }] })),
      updateBlogPost: (id, patch) =>
        setData((d) => ({
          ...d,
          blogPosts: d.blogPosts.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        })),
      removeBlogPost: (id) =>
        setData((d) => ({ ...d, blogPosts: d.blogPosts.filter((p) => p.id !== id) })),

      resetToDefault: () => setData(structuredClone(defaultData)),
      importData: (incoming) => setData(mergeWithDefaults(incoming)),
    }),
    [data, syncStatus, syncError]
  );

  return (
    <PortfolioDataContext.Provider value={api}>{children}</PortfolioDataContext.Provider>
  );
}

export function usePortfolioData() {
  const ctx = useContext(PortfolioDataContext);
  if (!ctx) throw new Error("usePortfolioData must be used within PortfolioDataProvider");
  return ctx;
}

export { PIN_SESSION_KEY };
