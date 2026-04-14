import { createClient } from '@supabase/supabase-js';

// القراءة من السيكرتس لضمان الأمان
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// الحفاظ على اسمك القديم كما هو لتجنب تعديل باقي الملفات
export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);