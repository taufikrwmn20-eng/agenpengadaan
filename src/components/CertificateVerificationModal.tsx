import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, AlertCircle, CheckCircle2, Search, X, QrCode, 
  ExternalLink, Calendar, User, Building, Award, Copy, Check, Download
} from 'lucide-react';
import { CertificateItem } from '../types';
import { verifyCertificate } from '../data/certificateData';

interface CertificateVerificationModalProps {
  isOpen: boolean;
  initialQuery?: string;
  onClose: () => void;
}

export const CertificateVerificationModal: React.FC<CertificateVerificationModalProps> = ({
  isOpen,
  initialQuery = '',
  onClose
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<CertificateItem | null>(null);
  const [searched, setSearched] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (initialQuery && isOpen) {
      if (initialQuery !== 'undefined' && initialQuery !== 'null') {
        setQuery(initialQuery);
        performSearch(initialQuery);
      } else {
        setQuery('');
        setResult(null);
        setSearched(false);
      }
    }
  }, [initialQuery, isOpen]);

  const performSearch = async (searchTarget: string) => {
    const clean = (searchTarget || '').trim();
    if (!clean || clean === 'undefined' || clean === 'null') return;
    setIsSearching(true);
    setSearched(true);
    try {
      const cert = await verifyCertificate(clean);
      setResult(cert);
    } catch (err) {
      console.error('Error verifying certificate:', err);
      setResult(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/?verify=${encodeURIComponent(result?.id || query)}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-[#073B75] via-[#094A94] to-[#073B75] text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-md">
              <ShieldCheck className="w-7 h-7 text-amber-300" />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-amber-300">
                Layanan Verifikasi Resmi
              </span>
              <h2 className="text-lg font-bold text-white leading-tight">
                Pengecekan Keaslian Sertifikat
              </h2>
              <p className="text-xs text-blue-100/80">PT. Agen Pengadaan Nasional</p>
            </div>
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/70">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Masukkan Nomor Sertifikat atau Kode UUID QR..."
              className="w-full pl-10 pr-24 py-3 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#073B75] focus:ring-2 focus:ring-blue-100 font-medium"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <button
              type="submit"
              disabled={isSearching || !query.trim()}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-2 bg-[#073B75] hover:bg-[#094A94] text-white text-xs font-bold rounded-lg transition disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {isSearching ? 'Memeriksa...' : 'Cek Status'}
            </button>
          </form>
          <p className="text-[11px] text-slate-500 mt-2">
            Contoh format: <span className="font-mono text-slate-700">APN/SERT/2026/001</span> atau kode unik dari pemindaian QR Code.
          </p>
        </div>

        {/* Verification Result Area */}
        <div className="p-6">
          {isSearching ? (
            <div className="py-12 text-center">
              <div className="w-10 h-10 border-3 border-[#073B75] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-xs font-semibold text-slate-700">Menghubungkan ke Database PT. APN...</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Memvalidasi stempel digital dan integritas arsip sertifikat</p>
            </div>
          ) : searched && !result ? (
            /* NOT FOUND / INVALID */
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
                <AlertCircle className="w-8 h-8 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Sertifikat Tidak Ditemukan</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto mt-1 leading-relaxed">
                  Data dengan nomor atau kode <span className="font-mono font-bold text-rose-600">"{query}"</span> tidak terdaftar dalam basis data resmi PT. Agen Pengadaan Nasional.
                </p>
              </div>
              <div className="pt-2">
                <p className="text-[11px] text-slate-400">
                  Pastikan nomor yang Anda masukkan sesuai tanpa salah ketik, atau hubungi Sekretariat APN untuk klarifikasi.
                </p>
              </div>
            </div>
          ) : result ? (
            /* VALID OR REVOKED VERIFICATION CARD */
            <div className="space-y-5">
              {/* Status Banner */}
              {result.status === 'valid' ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3.5 shadow-xs">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-emerald-950 flex items-center gap-1.5">
                      DOKUMEN ASLI &amp; TERVERIFIKASI SAH
                    </h4>
                    <p className="text-[11px] text-emerald-800 leading-tight mt-0.5">
                      Sertifikat ini secara resmi diterbitkan oleh PT. Agen Pengadaan Nasional dan terdaftar dalam arsip nasional.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center gap-3.5 shadow-xs">
                  <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-rose-950">
                      STATUS: SERTIFIKAT DICABUT / TIDAK BERLAKU
                    </h4>
                    <p className="text-[11px] text-rose-800 leading-tight mt-0.5">
                      Sertifikat ini telah dinonaktifkan atau dicabut keabsahannya oleh penyelenggara.
                    </p>
                  </div>
                </div>
              )}

              {/* Certificate Detail Grid */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 divide-y divide-slate-200 text-xs">
                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                    <Award className="w-3.5 h-3.5 text-[#073B75]" />
                    Nomor Sertifikat:
                  </span>
                  <span className="font-bold text-[#073B75] font-mono text-sm">
                    {result.certificateNumber}
                  </span>
                </div>

                <div className="py-2.5 flex justify-between items-start gap-4">
                  <span className="text-slate-500 flex items-center gap-1.5 font-medium shrink-0">
                    <User className="w-3.5 h-3.5 text-[#073B75]" />
                    Nama Penerima:
                  </span>
                  <span className="font-bold text-slate-900 text-right">
                    {result.recipientName}
                  </span>
                </div>

                

                <div className="py-2.5 flex justify-between items-start gap-4">
                  <span className="text-slate-500 flex items-center gap-1.5 font-medium shrink-0">
                    <Award className="w-3.5 h-3.5 text-[#073B75]" />
                    Nama Kegiatan:
                  </span>
                  <span className="font-semibold text-slate-900 text-right max-w-xs">
                    {result.eventName}
                  </span>
                </div>

                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-[#073B75]" />
                    Tanggal Terbit:
                  </span>
                  <span className="font-medium text-slate-800 font-mono">
                    {result.issueDate}
                  </span>
                </div>

                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                    <QrCode className="w-3.5 h-3.5 text-[#073B75]" />
                    ID Verifikasi Sistem:
                  </span>
                  <span className="font-mono text-[10px] text-slate-600 truncate max-w-[200px]">
                    {result.id}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Tautan Disalin' : 'Salin Tautan Verifikasi'}</span>
                </button>

                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-[#073B75] hover:bg-[#094A94] text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          ) : (
            /* INITIAL STATE: Scan Info */
            <div className="py-8 text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 text-[#073B75] flex items-center justify-center mx-auto shadow-xs">
                <QrCode className="w-8 h-8 text-[#073B75]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Validasi Digital Tanpa Ragu</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
                  Arahkan kamera smartphone Anda ke QR Code yang tercantum pada sertifikat fisik atau masukkan nomor registrasi sertifikat pada kolom di atas.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="px-6 py-3 bg-slate-100/80 border-t border-slate-200 text-center">
          <p className="text-[10px] text-slate-500">
            Sistem Verifikasi Digital Terpusat • PT. Agen Pengadaan Nasional • Seluruh Hak Cipta Dilindungi
          </p>
        </div>
      </div>
    </div>
  );
};
