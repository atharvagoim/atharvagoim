// Thin wrapper around the /api/data serverless endpoint. Every function here
// is designed to fail quietly (return null / throw a caught error) so the
// app keeps working in local-only mode if the backend isn't configured yet.

export async function fetchRemoteData() {
  const res = await fetch("/api/data", { method: "GET" });
  if (res.status === 503) return { configured: false, data: null };
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Fetch failed: ${res.status}`);
  }
  const data = await res.json();
  return { configured: true, data };
}

export async function saveRemoteData(data, pin) {
  const res = await fetch("/api/data", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-admin-pin": pin || "",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Save failed: ${res.status}`);
  }
  return res.json();
}
