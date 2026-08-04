// Formats a datetime-local string (e.g. "2026-07-31T15:30") into a readable
// "Jul 31, 2026 · 3:30 PM" label. Falls back gracefully for missing/invalid
// values, and for older posts that only have a free-text `date` field.
export function formatPublishedAt(publishedAt, fallbackDate) {
  if (publishedAt) {
    const d = new Date(publishedAt);
    if (!isNaN(d.getTime())) {
      const datePart = d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      const timePart = d.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
      });
      return `${datePart} · ${timePart}`;
    }
  }
  return fallbackDate || "";
}

// Returns a sortable timestamp (ms) for a post, newest-first sorting.
export function postTimestamp(post) {
  if (post.publishedAt) {
    const t = new Date(post.publishedAt).getTime();
    if (!isNaN(t)) return t;
  }
  return 0;
}
