// src/api/content.js
import { supa } from "../lib/supa";

/** Normalise un code set: 'EV10.5 BL' -> 'ev105bl' */
export const normalizeCode = (raw) =>
  String(raw).toLowerCase().replace(/\s+/g, "").replace(/\./g, "");

/* =========================
   BLOG / ACTUS / FEEDBACK
   ========================= */

export async function listPosts(limit = 3) {
  let q = supa
    .from("posts")
    .select("id,title,slug,excerpt,content_md,cover_url,published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (limit) q = q.limit(limit);
  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}

export async function listNews(limit = 4) {
  let q = supa
    .from("news")
    .select("id,title,slug,excerpt,content_md,cover_url,published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (limit) q = q.limit(limit);
  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}

export async function sendFeedback(payload) {
  const { error } = await supa.from("feedback").insert(payload);
  if (error) throw error;
}

/* =========================
   SETS (logos + métadonnées)
   ========================= */

export async function listSets(limit = null) {
  let q = supa
    .from("sets")
    .select("code_raw,code_norm,name,logo_url,created_at")
    .order("created_at", { ascending: false });
  if (limit) q = q.limit(limit);
  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}

export async function getSetByNorm(code_norm) {
  const { data, error } = await supa
    .from("sets")
    .select("code_raw,code_norm,name,logo_url")
    .eq("code_norm", code_norm)
    .single();
  if (error) return null;
  return data;
}
