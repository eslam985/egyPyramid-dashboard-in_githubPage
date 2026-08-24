import { createClient } from "@supabase/supabase-js";

let instance = null;

async function getConfig() {
  try {
    const res = await fetch(`${import.meta.env.BASE_URL}config.json`);
    return await res.json();
  } catch {
    return {};
  }
}

export async function getSupabase() {
  if (instance) return instance;

  // 1- حاول من .env الاول (للتطوير المحلي)
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (envUrl && envKey) {
    instance = createClient(envUrl, envKey);
    return instance;
  }

  // 2- لو مفيش .env اقرا من config.json (لـ GitHub Pages)
  const cfg = await getConfig();
  const url = cfg.SUPABASE_URL;
  const key = cfg.SUPABASE_ANON_KEY;

  if (!url || !key) throw new Error("SUPABASE_URL / ANON_KEY ناقصين في config.json");

  instance = createClient(url, key);
  return instance;
}

// ده عشان تحافظ على الكود القديم بتاعك شغال
// Vite بيدعم top-level await
export const supabaseClient = await getSupabase();