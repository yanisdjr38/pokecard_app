import { supa } from "../lib/supa";

export async function listPosts(limit = 3) {
  let q = supa
    .from("posts")
    .select("id,title,slug,excerpt,cover_url,published_at")
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
    .select("id,title,published_at,link")
    .order("pinned", { ascending: false })
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
