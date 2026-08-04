// Vercel serverless function: GET/PUT the entire portfolio data document.
//
// Requires two server-side env vars (set in Vercel → Project → Settings →
// Environment Variables — NOT prefixed with VITE_, so they never reach the
// browser bundle):
//   MONGODB_URI  - your MongoDB Atlas connection string
//   ADMIN_PIN    - the same PIN used for /admin, checked here on every write
// Optional:
//   MONGODB_DB   - database name (defaults to "portfolio")
//
// If MONGODB_URI isn't set, this endpoint responds with 503 so the frontend
// can fall back to its local-only (localStorage) mode without erroring.

import { MongoClient } from "mongodb";

const DB_NAME = process.env.MONGODB_DB || "portfolio";
const COLLECTION = "site";
const DOC_ID = "main";

let clientPromise = null;

function getClient() {
  if (!process.env.MONGODB_URI) return null;
  if (!clientPromise) {
    const client = new MongoClient(process.env.MONGODB_URI, {
      // Fail fast with a clear error instead of hanging until Vercel's
      // function timeout kills the request with no useful message.
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 8000,
    });
    clientPromise = client.connect().catch((err) => {
      // Don't cache a failed connection attempt — let the next request retry
      // instead of being stuck forever until a cold start.
      clientPromise = null;
      throw err;
    });
  }
  return clientPromise;
}

export default async function handler(req, res) {
  if (!process.env.MONGODB_URI) {
    res.status(503).json({ error: "Database not configured" });
    return;
  }

  let client;
  try {
    client = await getClient();
  } catch (err) {
    console.error("MongoDB connection error:", err);
    res.status(500).json({ error: `Database connection failed: ${err.message}` });
    return;
  }

  const col = client.db(DB_NAME).collection(COLLECTION);

  if (req.method === "GET") {
    try {
      const doc = await col.findOne({ _id: DOC_ID });
      res.status(200).json(doc ? doc.data : null);
    } catch (err) {
      console.error("MongoDB read error:", err);
      res.status(500).json({ error: `Database read failed: ${err.message}` });
    }
    return;
  }

  if (req.method === "PUT") {
    const pin = req.headers["x-admin-pin"];
    if (!process.env.ADMIN_PIN || pin !== process.env.ADMIN_PIN) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const body = req.body;
    if (!body || typeof body !== "object") {
      res.status(400).json({ error: "Invalid payload" });
      return;
    }

    try {
      await col.updateOne(
        { _id: DOC_ID },
        { $set: { data: body, updatedAt: new Date() } },
        { upsert: true }
      );
      res.status(200).json({ ok: true });
    } catch (err) {
      console.error("MongoDB write error:", err);
      res.status(500).json({ error: `Database write failed: ${err.message}` });
    }
    return;
  }

  res.setHeader("Allow", "GET, PUT");
  res.status(405).json({ error: "Method not allowed" });
}
