import * as XLSX from 'xlsx';
import QRCode from 'qrcode';
import JSZip from 'jszip';
import { CertificateItem, CertificateBatch, CertificateMappingConfig, CertificateEvent } from '../types';
import { getSupabaseClient } from '../lib/supabase';

// LocalStorage Keys
const CERTIFICATES_STORAGE_KEY = 'apn_certificates_v1';
const BATCHES_STORAGE_KEY = 'apn_certificate_batches_v1';
const EVENTS_STORAGE_KEY = 'apn_certificate_events_v1';

// Initial default events list so user immediately has choices or can add new
export const INITIAL_DEFAULT_EVENTS: CertificateEvent[] = [
  {
    id: 'evt-mitigasi-risiko-2026',
    name: 'Bimbingan Teknis Strategis Mitigasi Risiko Hukum Kontrak Pengadaan',
    date: '15 September 2026',
    batchCode: 'BATCH-01-2026',
    organizer: 'PT. Agen Pengadaan Nasional',
    createdAt: Date.now() - 86400000 * 5
  },
  {
    id: 'evt-pbj-level-1',
    name: 'Pelatihan Kompetensi Pengadaan Barang/Jasa Pemerintah (PBJP)',
    date: '20 Oktober 2026',
    batchCode: 'BATCH-02-2026',
    organizer: 'PT. Agen Pengadaan Nasional & Mitra PBJ',
    createdAt: Date.now() - 86400000 * 2
  }
];

// Default Elegant Mapping Configuration
export const DEFAULT_MAPPING_CONFIG: CertificateMappingConfig = {
  recipientName: {
    x: 50, // 50% Center
    y: 48, // 48% Height
    fontSize: 48,
    color: '#073B75',
    fontFamily: 'serif',
    fontWeight: 'bold',
    textAlign: 'center',
    prefix: '',
    suffix: '',
    enabled: true
  },
  certificateNumber: {
    x: 50,
    y: 29,
    fontSize: 20,
    color: '#475569',
    fontFamily: 'sans-serif',
    fontWeight: 'normal',
    textAlign: 'center',
    prefix: '',
    suffix: '',
    enabled: true
  },
  eventName: {
    x: 50,
    y: 62,
    fontSize: 24,
    color: '#1e293b',
    fontFamily: 'sans-serif',
    fontWeight: 'bold',
    textAlign: 'center',
    prefix: '',
    suffix: '',
    enabled: false
  },
  issueDate: {
    x: 82,
    y: 72,
    fontSize: 18,
    color: '#334155',
    fontFamily: 'sans-serif',
    fontWeight: 'normal',
    textAlign: 'center',
    prefix: 'Jakarta, ',
    suffix: '',
    enabled: false
  },
  qrCode: {
    x: 82,
    y: 84,
    size: 140,
    colorDark: '#073B75',
    colorLight: '#ffffff'
  },
  paperSize: 'auto'
};

/**
 * Generate Procedural Elegant Default Certificate Template
 * (If admin doesn't upload a custom certificate background yet)
 */
export function generateDefaultCertificateTemplate(width = 1920, height = 1080): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // 1. Background clean ivory cream
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#fbfcfe');
  bgGrad.addColorStop(0.5, '#f8fafc');
  bgGrad.addColorStop(1, '#f1f5f9');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Luxury Navy & Gold Border
  ctx.strokeStyle = '#073B75';
  ctx.lineWidth = 14;
  ctx.strokeRect(40, 40, width - 80, height - 80);

  ctx.strokeStyle = '#D97706'; // Gold accent
  ctx.lineWidth = 4;
  ctx.strokeRect(55, 55, width - 110, height - 110);

  // Corner Ornaments
  const cornerSize = 40;
  ctx.fillStyle = '#073B75';
  // Top-left
  ctx.fillRect(40, 40, cornerSize, cornerSize);
  // Top-right
  ctx.fillRect(width - 40 - cornerSize, 40, cornerSize, cornerSize);
  // Bottom-left
  ctx.fillRect(40, height - 40 - cornerSize, cornerSize, cornerSize);
  // Bottom-right
  ctx.fillRect(width - 40 - cornerSize, height - 40 - cornerSize, cornerSize, cornerSize);

  // 3. Header Branding
  ctx.textAlign = 'center';
  ctx.fillStyle = '#073B75';
  ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('PT. AGEN PENGADAAN NASIONAL', width / 2, 140);

  ctx.fillStyle = '#D97706';
  ctx.font = 'bold 16px sans-serif';
  ctx.letterSpacing = '4px';
  ctx.fillText('LEMBAGA KONSULTASI & PENGEMBANGAN SDM PENGADAAN NASIONAL', width / 2, 175);
  ctx.letterSpacing = '0px';

  // Divider Gold Line
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 350, 195);
  ctx.lineTo(width / 2 + 350, 195);
  ctx.stroke();

  // Certificate Big Title
  ctx.fillStyle = '#073B75';
  ctx.font = 'bold 64px "Times New Roman", Georgia, serif';
  ctx.fillText('SERTIFIKAT', width / 2, 265);

  ctx.fillStyle = '#64748b';
  ctx.font = 'italic 20px "Times New Roman", Georgia, serif';
  ctx.fillText('Diberikan dengan penuh kehormatan kepada:', width / 2, 420);

  // Underline for recipient name
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 380, height * 0.54);
  ctx.lineTo(width / 2 + 380, height * 0.54);
  ctx.stroke();

  // Statement
  ctx.fillStyle = '#475569';
  ctx.font = '18px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Atas partisipasi, kelulusan, dan kontribusi aktif dalam kegiatan:', width / 2, height * 0.585);

  // Signatures Area
  const sigLeftX = width * 0.22;
  const sigRightX = width * 0.82;
  const sigY = height * 0.88;

  // Left Signature: Direktur Utama
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(sigLeftX - 140, sigY);
  ctx.lineTo(sigLeftX + 140, sigY);
  ctx.stroke();

  ctx.fillStyle = '#073B75';
  ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('H. Taufik Rahman, S.T., M.Si.', sigLeftX, sigY + 30);
  ctx.fillStyle = '#64748b';
  ctx.font = '15px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Direktur Utama PT. Agen Pengadaan Nasional', sigLeftX, sigY + 54);

  // Stamp Watermark / Badge
  ctx.save();
  ctx.translate(sigLeftX, sigY - 45);
  ctx.strokeStyle = 'rgba(7, 59, 117, 0.4)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, 48, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = 'rgba(7, 59, 117, 0.6)';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText('PT. APN INDONESIA', 0, -10);
  ctx.fillText('OFFICIAL STAMP', 0, 8);
  ctx.restore();

  // Right Signatory Title
  ctx.fillStyle = '#64748b';
  ctx.font = '15px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Scan QR Code untuk Verifikasi Keaslian Dokumen', sigRightX, sigY + 54);

  return canvas.toDataURL('image/png');
}

/**
 * Generate verification URL based on current deployment environment
 */
export function getVerificationUrl(certificateId: string): string {
  let origin = 'https://agenpengadaannasional.co.id';
  if (typeof window !== 'undefined' && window.location.origin) {
    origin = window.location.origin;
  }
  return `${origin}/?verify=${encodeURIComponent(certificateId)}`;
}

/**
 * Download sample Excel Template for bulk certificate import
 */
export function downloadExcelTemplate() {
  const sampleData = [
    {
      'Nomor_Sertifikat': 'APN/SERT/2026/001',
      'Nama_Lengkap': 'Dr. H. Rahmat Hidayat, M.T., CCMS'
    },
    {
      'Nomor_Sertifikat': 'APN/SERT/2026/002',
      'Nama_Lengkap': 'Siti Nurhaliza, S.E., M.Ak.'
    },
    {
      'Nomor_Sertifikat': 'APN/SERT/2026/003',
      'Nama_Lengkap': 'Ir. Bambang Triyono, M.Eng.'
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleData);
  
  // Set column widths
  worksheet['!cols'] = [
    { wch: 24 }, // Nomor_Sertifikat
    { wch: 36 }  // Nama_Lengkap
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Peserta');
  
  XLSX.writeFile(workbook, 'Template_Data_Peserta_Sertifikat_APN.xlsx');
}

/**
 * Parse uploaded Excel or CSV file
 */
export async function parseExcelOrCsvFile(file: File): Promise<Array<{
  certificateNumber: string;
  recipientName: string;
  recipientAgency?: string;
  recipientRole?: string;
}>> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawJson: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (!rawJson || rawJson.length === 0) {
          throw new Error('File Excel tidak memiliki data baris peserta.');
        }

        const parsedList = rawJson.map((row, index) => {
          // Normalize column keys
          const keys = Object.keys(row);
          
          const findVal = (...targets: string[]) => {
            for (const k of keys) {
              const cleaned = k.toLowerCase().replace(/[^a-z0-9]/g, '');
              for (const t of targets) {
                if (cleaned.includes(t)) return String(row[k]).trim();
              }
            }
            return '';
          };

          const certNo = findVal('nosertifikat', 'nomor', 'sertifikat', 'no') || `APN/SERT/${new Date().getFullYear()}/${String(index + 1).padStart(3, '0')}`;
          const name = findVal('namalengkap', 'nama', 'peserta', 'name') || `Peserta ${index + 1}`;
          const agency = findVal('instansi', 'lembaga', 'perusahaan', 'kantor', 'organisasi');
          const role = findVal('peran', 'kategori', 'role') || 'Peserta';

          return {
            certificateNumber: certNo,
            recipientName: name,
            recipientAgency: agency,
            recipientRole: role
          };
        }).filter(item => item.recipientName.length > 0);

        resolve(parsedList);
      } catch (err: any) {
        reject(new Error(err?.message || 'Gagal membaca isi file spreadsheet.'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Gagal membaca file dari disk.'));
    };

    reader.readAsBinaryString(file);
  });
}

/**
 * Generate QR Code as DataURL
 */
export async function generateQrDataUrl(text: string, size = 200, colorDark = '#073B75', colorLight = '#ffffff'): Promise<string> {
  return await QRCode.toDataURL(text, {
    width: size,
    margin: 1,
    color: {
      dark: colorDark,
      light: colorLight
    },
    errorCorrectionLevel: 'H'
  });
}

/**
 * Render Certificate onto high-res HTML5 Canvas and return DataURL (PNG)
 */
export async function renderCertificateToCanvas(
  templateImgSrc: string,
  certificate: {
    id: string;
    certificateNumber: string;
    recipientName: string;
    eventName: string;
    issueDate: string;
  },
  mapping: CertificateMappingConfig,
  customWidth?: number,
  customHeight?: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = async () => {
      try {
        const canvas = document.createElement('canvas');
        let width = img.naturalWidth || 1920;
        let height = img.naturalHeight || 1080;

        if (customWidth && customWidth <= 1280) {
          // Interactive Preview Mode
          width = customWidth;
          if (mapping.paperSize === 'A4') {
            height = Math.round(customWidth / (297 / 210));
          } else if (mapping.paperSize === 'F4') {
            height = Math.round(customWidth / (330 / 215));
          } else {
            height = customHeight || Math.round(((img.naturalHeight || 1080) / (img.naturalWidth || 1920)) * customWidth) || 720;
          }
        } else {
          // High Resolution Output Mode (PNG Download & ZIP Massal)
          if (mapping.paperSize === 'A4') {
            // A4 Landscape 300 DPI: 297 x 210 mm -> 3508 x 2480 px
            width = 3508;
            height = 2480;
          } else if (mapping.paperSize === 'F4') {
            // F4 / Folio Landscape 300 DPI: 330 x 215 mm -> 3898 x 2539 px
            width = 3898;
            height = 2539;
          } else {
            // Auto: use original template image dimensions (or customWidth/Height if provided)
            width = customWidth || img.naturalWidth || 1920;
            height = customHeight || img.naturalHeight || 1080;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Canvas context tidak tersedia');
        }

        // 1. Draw Template Background
        ctx.drawImage(img, 0, 0, width, height);

        // Helper to get pixel coords from percentages
        const getX = (pct: number) => (pct / 100) * width;
        const getY = (pct: number) => (pct / 100) * height;

        // 2. Draw Certificate Number
        if (mapping.certificateNumber.enabled !== false) {
          const cfg = mapping.certificateNumber;
          ctx.save();
          ctx.textAlign = cfg.textAlign || 'center';
          ctx.fillStyle = cfg.color || '#475569';
          ctx.font = `${cfg.fontWeight || 'normal'} ${Math.round((cfg.fontSize / 1080) * height)}px ${cfg.fontFamily === 'serif' ? 'Georgia, serif' : '"Plus Jakarta Sans", sans-serif'}`;
          const certText = `${cfg.prefix || ''}${certificate.certificateNumber}${cfg.suffix || ''}`;
          ctx.fillText(certText, getX(cfg.x), getY(cfg.y));
          ctx.restore();
        }

        // 4. Draw Recipient Name (Center element)
        if (mapping.recipientName.enabled !== false) {
          const cfg = mapping.recipientName;
          ctx.save();
          ctx.textAlign = cfg.textAlign || 'center';
          ctx.fillStyle = cfg.color || '#073B75';
          ctx.font = `${cfg.fontWeight || 'bold'} ${Math.round((cfg.fontSize / 1080) * height)}px ${cfg.fontFamily === 'serif' ? '"Times New Roman", Georgia, serif' : '"Plus Jakarta Sans", sans-serif'}`;
          const nameText = `${cfg.prefix || ''}${certificate.recipientName}${cfg.suffix || ''}`;
          ctx.fillText(nameText, getX(cfg.x), getY(cfg.y));
          ctx.restore();
        }

        // 5. Note: Event Name and Issue Date are excluded from being printed onto the certificate canvas
        // as they are already printed/embedded directly in the background template design.
        // They remain preserved as metadata for archives and verification.

        // 6. Draw QR Code
        const qrCfg = mapping.qrCode;
        const qrSize = Math.round((qrCfg.size / 1080) * height);
        const qrUrl = getVerificationUrl(certificate.id);
        const qrDataUrl = await generateQrDataUrl(qrUrl, qrSize * 2, qrCfg.colorDark || '#073B75', qrCfg.colorLight || '#ffffff');
        
        const qrImg = new Image();
        qrImg.onload = () => {
          ctx.save();
          // Draw white card backing for QR with subtle border for high scan reliability
          const qrX = getX(qrCfg.x) - (qrSize / 2);
          const qrY = getY(qrCfg.y) - (qrSize / 2);
          
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(qrX - 4, qrY - 4, qrSize + 8, qrSize + 8);
          ctx.strokeStyle = 'rgba(7, 59, 117, 0.2)';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(qrX - 4, qrY - 4, qrSize + 8, qrSize + 8);

          ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
          ctx.restore();

          resolve(canvas.toDataURL('image/png', 0.95));
        };
        qrImg.onerror = () => {
          // Fallback if QR image fails to load
          resolve(canvas.toDataURL('image/png', 0.95));
        };
        qrImg.src = qrDataUrl;
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = () => {
      reject(new Error('Gagal memuat template gambar sertifikat'));
    };
    img.src = templateImgSrc;
  });
}

/**
 * Generate Batch ZIP containing all generated certificate PNG images
 */
export async function generateBatchZipFile(
  templateImgSrc: string,
  certificates: CertificateItem[],
  mapping: CertificateMappingConfig,
  onProgress?: (processed: number, total: number) => void
): Promise<Blob> {
  const zip = new JSZip();
  const folder = zip.folder('Sertifikat_PT_APN');

  for (let i = 0; i < certificates.length; i++) {
    const cert = certificates[i];
    const dataUrl = await renderCertificateToCanvas(templateImgSrc, cert, mapping);
    const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
    
    // Clean filename
    const safeName = cert.recipientName.replace(/[^a-zA-Z0-9_\-]/g, '_');
    const safeNo = cert.certificateNumber.replace(/[^a-zA-Z0-9_\-]/g, '_');
    const filename = `${safeNo}_${safeName}.png`;

    folder?.file(filename, base64Data, { base64: true });

    if (onProgress) {
      onProgress(i + 1, certificates.length);
    }
  }

  return await zip.generateAsync({ type: 'blob' });
}

/**
 * Storage Helpers (LocalStorage + Supabase Synchronization)
 */
export function getSavedCertificatesFromLocalStorage(): CertificateItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CERTIFICATES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCertificatesToLocalStorage(items: CertificateItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CERTIFICATES_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.warn('LocalStorage limit reached for certificates:', e);
  }
}

export function getSavedBatchesFromLocalStorage(): CertificateBatch[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(BATCHES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveBatchesToLocalStorage(batches: CertificateBatch[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(BATCHES_STORAGE_KEY, JSON.stringify(batches));
  } catch (e) {
    console.warn('LocalStorage limit for batches:', e);
  }
}

/**
 * Event Storage Helpers
 */
export function getSavedEventsFromLocalStorage(): CertificateEvent[] {
  if (typeof window === 'undefined') return INITIAL_DEFAULT_EVENTS;
  try {
    const raw = localStorage.getItem(EVENTS_STORAGE_KEY);
    if (raw === null) {
      localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(INITIAL_DEFAULT_EVENTS));
      return INITIAL_DEFAULT_EVENTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_DEFAULT_EVENTS;
  } catch {
    return INITIAL_DEFAULT_EVENTS;
  }
}

export function saveEventsToLocalStorage(events: CertificateEvent[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
  } catch (e) {
    console.warn('LocalStorage limit for events:', e);
  }
}

export function addOrUpdateEventInLocalStorage(event: CertificateEvent): CertificateEvent[] {
  const current = getSavedEventsFromLocalStorage();
  const existingIndex = current.findIndex(e => e.id === event.id);
  let updated: CertificateEvent[];
  if (existingIndex >= 0) {
    updated = [...current];
    updated[existingIndex] = event;
  } else {
    updated = [event, ...current];
  }
  saveEventsToLocalStorage(updated);
  return updated;
}

export function deleteEventFromLocalStorage(id: string): CertificateEvent[] {
  const current = getSavedEventsFromLocalStorage();
  const updated = current.filter(e => e.id !== id);
  saveEventsToLocalStorage(updated);
  return updated;
}

/**
 * Save Certificates to Supabase Cloud Database with batch chunking
 */
export async function saveCertificatesToCloud(certificates: CertificateItem[]): Promise<{ success: boolean; count: number; error?: string }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, count: 0, error: 'Koneksi Supabase belum aktif. Data tersimpan di penyimpanan lokal browser.' };
  }

  if (!certificates || certificates.length === 0) {
    return { success: true, count: 0 };
  }

  try {
    const rows = certificates.map(c => ({
      id: c.id,
      certificate_number: c.certificateNumber,
      recipient_name: c.recipientName,
      recipient_agency: c.recipientAgency || '',
      recipient_role: c.recipientRole || 'Peserta',
      event_name: c.eventName,
      issue_date: c.issueDate,
      status: c.status || 'valid',
      batch_id: c.batchId || '',
      batch_name: c.batchName || '',
      verification_url: c.verificationUrl,
      notes: c.notes || '',
      created_at: new Date(c.createdAt || Date.now()).toISOString()
    }));

    // Chunk upserts into batches of 50 to avoid network payload limits & timeouts
    const CHUNK_SIZE = 50;
    let totalSaved = 0;

    for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
      const chunk = rows.slice(i, i + CHUNK_SIZE);
      const { error } = await supabase
        .from('certificates')
        .upsert(chunk, { onConflict: 'id' });

      if (error) {
        console.warn(`Supabase certificates save error on chunk ${i}:`, error.message);
        return { success: false, count: totalSaved, error: error.message };
      }
      totalSaved += chunk.length;
    }

    return { success: true, count: totalSaved };
  } catch (err: any) {
    return { success: false, count: 0, error: err?.message || 'Network error saat menghubungi Supabase.' };
  }
}

/**
 * Get the exact count of certificates in Supabase Cloud
 */
export async function getCloudCertificatesCount(): Promise<number> {
  const supabase = getSupabaseClient();
  if (!supabase) return 0;
  try {
    const { count, error } = await supabase.from('certificates').select('*', { count: 'exact', head: true });
    if (error) {
      console.warn('Error fetching Supabase certificates count:', error);
      return 0;
    }
    return count || 0;
  } catch {
    return 0;
  }
}

/**
 * Verify Certificate by ID (UUID) or Certificate Number
 * Checks Supabase Cloud first, then falls back to LocalStorage
 */
export async function verifyCertificate(query: string): Promise<CertificateItem | null> {
  const cleanQuery = query.trim();
  if (!cleanQuery) return null;

  // 1. Try Supabase Cloud
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .or(`id.eq.${cleanQuery},certificate_number.ilike.${cleanQuery}`)
        .limit(1);

      if (!error && data && data.length > 0) {
        const row = data[0];
        return {
          id: row.id,
          certificateNumber: row.certificate_number,
          recipientName: row.recipient_name,
          recipientAgency: row.recipient_agency,
          recipientRole: row.recipient_role,
          eventName: row.event_name,
          issueDate: row.issue_date,
          status: row.status,
          batchId: row.batch_id,
          batchName: row.batch_name,
          verificationUrl: row.verification_url || getVerificationUrl(row.id),
          notes: row.notes,
          createdAt: new Date(row.created_at).getTime()
        };
      }
    } catch (e) {
      console.warn('Cloud verification fallback to local:', e);
    }
  }

  // 2. Fallback to LocalStorage
  const localList = getSavedCertificatesFromLocalStorage();
  const found = localList.find(c => 
    c.id.toLowerCase() === cleanQuery.toLowerCase() || 
    c.certificateNumber.toLowerCase() === cleanQuery.toLowerCase()
  );

  return found || null;
}

/**
 * SQL Setup script for Certificates table in Supabase
 */
export const SUPABASE_CERTIFICATES_SQL = `-- BUAT TABEL VERIFIKASI SERTIFIKAT DIGITAL PT. APN
CREATE TABLE IF NOT EXISTS certificates (
  id TEXT PRIMARY KEY,
  certificate_number TEXT NOT NULL,
  recipient_name TEXT NOT NULL,
  recipient_agency TEXT,
  recipient_role TEXT DEFAULT 'Peserta',
  event_name TEXT NOT NULL,
  issue_date TEXT NOT NULL,
  status TEXT DEFAULT 'valid',
  batch_id TEXT,
  batch_name TEXT,
  verification_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AKTIFKAN KEAMANAN (ROW LEVEL SECURITY)
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- BUAT POLICY: Publik dapat membaca/verifikasi sertifikat, Admin dapat menulis/mengubah
DROP POLICY IF EXISTS "Public Read Certificates" ON certificates;
DROP POLICY IF EXISTS "Public Write Certificates" ON certificates;

-- BUAT TABEL KEGIATAN / PELATIHAN (EVENTS)
CREATE TABLE IF NOT EXISTS certificate_events (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  date TEXT NOT NULL,
  batch_code TEXT,
  organizer TEXT,
  template_file_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE certificate_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Certificate Events" ON certificate_events;
DROP POLICY IF EXISTS "Public Write Certificate Events" ON certificate_events;
CREATE POLICY "Public Read Certificate Events" ON certificate_events FOR SELECT USING (true);
CREATE POLICY "Public Write Certificate Events" ON certificate_events FOR ALL USING (true) WITH CHECK (true);
`;
