import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { InformationItem } from '../types';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConfigured: boolean;
}

/**
 * Normalize Supabase Project URL to prevent common input mistakes
 * e.g., converting dashboard URL https://supabase.com/dashboard/project/xyz to https://xyz.supabase.co
 */
export function normalizeSupabaseUrl(input: string): string {
  let trimmed = (input || '').trim();
  if (!trimmed) return '';

  // Case 1: User pasted dashboard URL (e.g. https://supabase.com/dashboard/project/iqaognnflikyxedswmrz)
  const dashboardMatch = trimmed.match(/supabase\.com\/dashboard\/project\/([a-zA-Z0-9_-]+)/i);
  if (dashboardMatch && dashboardMatch[1]) {
    return `https://${dashboardMatch[1]}.supabase.co`;
  }

  // Case 2: User entered raw project ID (e.g. iqaognnflikyxedswmrz)
  if (/^[a-zA-Z0-9_-]{15,30}$/.test(trimmed) && !trimmed.includes('.') && !trimmed.includes('/')) {
    return `https://${trimmed}.supabase.co`;
  }

  // Case 3: Missing protocol
  if (trimmed.includes('.supabase.co') && !trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return `https://${trimmed}`;
  }

  // Remove trailing slash
  return trimmed.replace(/\/+$/, '');
}

/**
 * Get Supabase configuration directly from Environment Variables (Vercel / .env)
 * with direct pre-configured fallback for PT. APN's official Supabase project
 */
export function getSupabaseConfig(): SupabaseConfig {
  let url = normalizeSupabaseUrl((import.meta.env.VITE_SUPABASE_URL || '').trim());
  let anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

  // Fallback to legacy local storage if env is not loaded yet in some test builds
  if (typeof window !== 'undefined') {
    if (!url) {
      url = normalizeSupabaseUrl((localStorage.getItem('apn_supabase_url') || '').trim());
    }
    if (!anonKey) {
      anonKey = (localStorage.getItem('apn_supabase_anon_key') || '').trim();
    }
  }

  // Pre-configured official Supabase instance credentials for PT. APN
  if (!url) {
    url = 'https://iqaognnflikyxedswmrz.supabase.co';
  }
  if (!anonKey) {
    anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxYW9nbm5mbGlreXhlZHN3bXJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyOTg4MTgsImV4cCI6MjEwMjg3NDgxOH0.795ZMmo6AACoeerxmcDWa1bfgaXLciDPFZaK2s7AOxE';
  }

  url = normalizeSupabaseUrl(url);

  const isPlaceholder = !url || url.includes('your-project') || url.includes('example.com') || anonKey.includes('...');

  return {
    url,
    anonKey,
    isConfigured: Boolean(url && anonKey && url.startsWith('https://') && !isPlaceholder)
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

export function saveCustomSupabaseConfig(url: string, anonKey: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const cleanUrl = normalizeSupabaseUrl(url.trim());
    const cleanKey = anonKey.trim();
    if (cleanUrl) {
      localStorage.setItem('apn_supabase_url', cleanUrl);
    } else {
      localStorage.removeItem('apn_supabase_url');
    }
    if (cleanKey) {
      localStorage.setItem('apn_supabase_anon_key', cleanKey);
    } else {
      localStorage.removeItem('apn_supabase_anon_key');
    }
    // Reset client instance to force re-instantiation with new credentials
    supabaseInstance = null;
    currentConfigKey = '';
    return true;
  } catch {
    return false;
  }
}

export async function testSupabaseConnection(): Promise<{ connected: boolean; message: string; tablesFound?: string[] }> {
  const config = getSupabaseConfig();
  if (!config.isConfigured) {
    return {
      connected: false,
      message: 'Konfigurasi Supabase belum lengkap. Masukkan Project URL dan Anon Key.'
    };
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return {
      connected: false,
      message: 'Gagal menginisialisasi Supabase Client. Periksa format URL & Anon Key.'
    };
  }

  try {
    // 1. Test app_settings table
    const settingsRes = await supabase.from('app_settings').select('key').limit(1);
    // 2. Test articles table
    const articlesRes = await supabase.from('articles').select('id').limit(1);

    const tablesFound: string[] = [];
    if (!settingsRes.error) tablesFound.push('app_settings');
    if (!articlesRes.error) tablesFound.push('articles');

    if (settingsRes.error && articlesRes.error) {
      return {
        connected: false,
        message: `Koneksi gagal: ${settingsRes.error.message || articlesRes.error.message}`
      };
    }

    return {
      connected: true,
      message: 'Koneksi ke Supabase Cloud Berhasil 100%!',
      tablesFound
    };
  } catch (err: any) {
    return {
      connected: false,
      message: `Gagal terhubung: ${err?.message || 'Network error'}`
    };
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

export async function syncAllDataToCloudNow(
  articles: InformationItem[],
  username: string,
  pass: string
): Promise<{ success: boolean; message: string; details: { articlesSynced: number; credsSynced: boolean } }> {
  const config = getSupabaseConfig();
  if (!config.isConfigured) {
    return {
      success: false,
      message: 'Supabase belum terhubung. Silakan masukkan Project URL & Anon Key.',
      details: { articlesSynced: 0, credsSynced: false }
    };
  }

  // 1. Sync credentials
  const credsSynced = await saveAdminCredentialsToCloud(username, pass);

  // 2. Sync articles
  let articlesSynced = 0;
  if (articles.length > 0) {
    const seedRes = await seedAllArticlesToCloud(articles);
    if (seedRes.success) {
      articlesSynced = seedRes.count;
    }
  }

  if (credsSynced || articlesSynced > 0) {
    return {
      success: true,
      message: `Sinkronisasi berhasil! Password admin tersimpan & ${articlesSynced} artikel tersinkronisasi ke Supabase.`,
      details: { articlesSynced, credsSynced }
    };
  } else {
    return {
      success: false,
      message: 'Gagal sinkronisasi data ke Supabase. Pastikan SQL Setup Policy sudah dijalankan di Supabase.',
      details: { articlesSynced: 0, credsSynced: false }
    };
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
