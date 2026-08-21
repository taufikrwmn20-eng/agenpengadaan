import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { InformationItem } from '../types';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConfigured: boolean;
}

/**
 * Get Supabase configuration directly from Environment Variables (Vercel / .env)
 */
export function getSupabaseConfig(): SupabaseConfig {
  let url = (import.meta.env.VITE_SUPABASE_URL || '').trim();
  let anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

  // Fallback to legacy local storage if env is not loaded yet in some test builds
  if (typeof window !== 'undefined') {
    if (!url) {
      url = (localStorage.getItem('apn_supabase_url') || '').trim();
    }
    if (!anonKey) {
      anonKey = (localStorage.getItem('apn_supabase_anon_key') || '').trim();
    }
  }

  const isPlaceholder = !url || url.includes('your-project') || url.includes('example.com') || anonKey.includes('...');

  return {
    url,
    anonKey,
    isConfigured: Boolean(url && anonKey && url.startsWith('http') && !isPlaceholder)
  };
}

let supabaseInstance: SupabaseClient | null = null;
let currentConfigKey = '';

export function getSupabaseClient(): SupabaseClient | null {
  const config = getSupabaseConfig();
  if (!config.isConfigured) return null;

  const key = `${config.url}_${config.anonKey}`;
  if (supabaseInstance && currentConfigKey === key) {
    return supabaseInstance;
  }

  try {
    supabaseInstance = createClient(config.url, config.anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
    currentConfigKey = key;
    return supabaseInstance;
  } catch (e) {
    console.error('Failed to initialize Supabase client:', e);
    return null;
  }
}

// Convert InformationItem to Supabase DB Row
export function mapItemToDbRow(item: InformationItem) {
  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    category: item.category,
    author: item.author,
    date: item.date,
    day: item.day,
    month: item.month,
    read_time: item.readTime,
    image_url: item.imageUrl,
    image_caption: item.imageCaption || '',
    summary: item.summary,
    content: item.content,
    post_views: item.postViews || 0,
    comments: item.comments || [],
    created_at: typeof item.createdAt === 'number' ? new Date(item.createdAt).toISOString() : new Date().toISOString()
  };
}

// Convert Supabase DB Row to InformationItem
export function mapDbRowToItem(row: any): InformationItem {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category || 'Artikel',
    author: row.author || 'Tim Ahli PT. APN',
    date: row.date || '',
    day: row.day || '',
    month: row.month || '',
    readTime: row.read_time || '4 min',
    imageUrl: row.image_url || '',
    imageCaption: row.image_caption || '',
    summary: row.summary || '',
    content: row.content || '',
    postViews: Number(row.post_views) || 0,
    comments: Array.isArray(row.comments) ? row.comments : [],
    createdAt: row.created_at ? new Date(row.created_at).getTime() : Date.now()
  };
}

/**
 * Fetch all articles from Supabase Cloud Database
 */
export async function fetchArticlesFromCloud(): Promise<InformationItem[] | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch notice:', error.message);
      return null;
    }

    if (data && data.length > 0) {
      return data.map(mapDbRowToItem);
    }
    return [];
  } catch (err: any) {
    console.warn('Supabase fetch network notice (using local storage fallback):', err?.message || err);
    return null;
  }
}

/**
 * Upsert (Insert/Update) article in Supabase Cloud
 */
export async function upsertArticleToCloud(article: InformationItem): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const row = mapItemToDbRow(article);
    const { error } = await supabase
      .from('articles')
      .upsert(row, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase upsert notice:', error.message);
      return false;
    }
    return true;
  } catch (err: any) {
    console.warn('Supabase upsert network notice (saved locally):', err?.message || err);
    return false;
  }
}

/**
 * Delete article from Supabase Cloud
 */
export async function deleteArticleFromCloud(id: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);

    if (error) {
      console.warn('Supabase delete notice:', error.message);
      return false;
    }
    return true;
  } catch (err: any) {
    console.warn('Supabase delete network notice:', err?.message || err);
    return false;
  }
}

/**
 * Push initial/all articles from local state to Supabase Cloud
 */
export async function seedAllArticlesToCloud(articles: InformationItem[]): Promise<{ success: boolean; count: number; error?: string }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, count: 0, error: 'Database Supabase belum dikonfigurasi di Vercel/Environment.' };
  }

  try {
    const rows = articles.map(mapItemToDbRow);
    const { error } = await supabase
      .from('articles')
      .upsert(rows, { onConflict: 'id' });

    if (error) {
      return { success: false, count: 0, error: error.message };
    }
    return { success: true, count: rows.length };
  } catch (err: any) {
    return { success: false, count: 0, error: err?.message || 'Gagal terhubung ke Supabase (Network Error)' };
  }
}

/**
 * Admin Credentials Cloud Synchronization (Supabase app_settings table)
 */
export interface AdminCredentials {
  username: string;
  passwordHash: string;
}

export async function fetchAdminCredentialsFromCloud(): Promise<AdminCredentials | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', 'admin_auth')
      .single();

    if (error || !data) {
      return null;
    }

    if (data.value && typeof data.value === 'object') {
      return data.value as AdminCredentials;
    }
    return null;
  } catch {
    return null;
  }
}

export async function saveAdminCredentialsToCloud(username: string, pass: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const payload = {
      key: 'admin_auth',
      value: {
        username: username.trim(),
        passwordHash: pass.trim(),
        updatedAt: new Date().toISOString()
      },
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('app_settings')
      .upsert(payload, { onConflict: 'key' });

    if (error) {
      console.warn('Could not save credentials to Supabase app_settings:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Network error saving credentials to Supabase:', err);
    return false;
  }
}

/**
 * SQL Setup script for both Articles and Admin Settings tables
 */
export const SUPABASE_SETUP_SQL = `-- 1. BUAT TABEL ARTIKEL & KOMENTAR PT. APN
CREATE TABLE IF NOT EXISTS articles (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT DEFAULT 'Artikel',
  author TEXT DEFAULT 'Tim Ahli PT. APN',
  date TEXT,
  day TEXT,
  month TEXT,
  read_time TEXT DEFAULT '4 min',
  image_url TEXT,
  image_caption TEXT,
  summary TEXT,
  content TEXT,
  post_views INTEGER DEFAULT 0,
  comments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BUAT TABEL PENGATURAN ADMIN & KREDENSIAL TERPUSAT
CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. AKTIFKAN KEAMANAN (ROW LEVEL SECURITY)
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- 4. HAPUS POLICY LAMA (AGAR TIDAK DUPLIKAT)
DROP POLICY IF EXISTS "Public Read All" ON articles;
DROP POLICY IF EXISTS "Public Write All" ON articles;
DROP POLICY IF EXISTS "Public Settings Read" ON app_settings;
DROP POLICY IF EXISTS "Public Settings Write" ON app_settings;

-- 5. BUAT POLICY IZIN BACA & TULIS
CREATE POLICY "Public Read All" ON articles FOR SELECT USING (true);
CREATE POLICY "Public Write All" ON articles FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public Settings Read" ON app_settings FOR SELECT USING (true);
CREATE POLICY "Public Settings Write" ON app_settings FOR ALL USING (true) WITH CHECK (true);
`;
