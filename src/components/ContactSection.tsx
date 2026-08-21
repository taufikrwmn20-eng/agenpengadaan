import React, { useState } from 'react';
import { 
  Phone, Mail, MapPin, MessageSquare, ExternalLink, 
  Send, Building, ArrowRight, ShieldCheck
} from 'lucide-react';
import { COMPANY_PROFILE } from '../data/procurementData';

interface ContactSectionProps {
  onOpenConsultation: (topic?: string) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onOpenConsultation }) => {
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryAgency, setInquiryAgency] = useState('');
  const [inquiryService, setInquiryService] = useState('1. Konsultasi Pengadaan Barang Jasa');
  const [inquiryMessage, setInquiryMessage] = useState('');

  const handleWhatsAppClick = () => {
    const text = encodeURIComponent(
      `Halo Tenaga Ahli PT. Agen Pengadaan Nasional, saya ingin berkonsultasi mengenai pengadaan barang dan jasa. Terima kasih.`
    );
    window.open(`https://wa.me/${COMPANY_PROFILE.contact.whatsapp}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const handleSendFastInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    let text = `*KONSULTASI PENGADAAN BARANG/JASA - PT. APN*\n\n`;
    if (inquiryName) text += `*Nama:* ${inquiryName}\n`;
    if (inquiryAgency) text += `*Instansi/Perusahaan:* ${inquiryAgency}\n`;
    text += `*Layanan yang Dibutuhkan:* ${inquiryService}\n`;
    if (inquiryMessage) text += `*Catatan/Kebutuhan:* ${inquiryMessage}\n`;
    text += `\nMohon informasi dan ketersediaan waktu untuk sesi diskusi. Terima kasih.`;

    window.open(`https://wa.me/${COMPANY_PROFILE.contact.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section id="kontak" className="py-20 bg-slate-50 relative overflow-hidden">
      {/* Soft Luminous Ambient Depth Lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-100/40 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#073B75] text-xs font-bold uppercase tracking-wider mb-3">
            <Mail className="w-3.5 h-3.5 text-[#073B75]" />
            <span>Kontak Kami</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-slate-900">
            Hubungi PT. Agen Pengadaan Nasional
          </h2>
          <p className="mt-3 text-base text-slate-600 font-normal">
            Saluran komunikasi untuk layanan konsultasi, kerja sama Agen Pengadaan, dan informasi pelatihan PBJ.
          </p>
        </div>

        {/* 5 Contact Information Cards Grid */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 1. Alamat Kantor with Photo */}
          <div className="md:col-span-2 lg:col-span-2 bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group">
            <div className="grid grid-cols-1 sm:grid-cols-12 h-full">
              {/* Left Photo */}
              <div className="sm:col-span-5 relative h-48 sm:h-auto min-h-[180px] overflow-hidden bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=700&q=80"
                  alt="Kantor Pusat PT. Agen Pengadaan Nasional"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-slate-950/70 via-slate-900/20 to-transparent" />
                <span className="absolute bottom-3 left-3 text-[11px] font-bold text-white bg-slate-900/85 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-white/20">
                  Kantor Operasional PBJ
                </span>
              </div>

              {/* Right Details */}
              <div className="sm:col-span-7 p-6 sm:p-7 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C]">
                      Lokasi Kantor Pusat
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                      Senin - Jumat: 08:00 - 16:00 WIB
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 font-display">
                    Kantor Pusat & Pusat Konsultasi PBJ
                  </h3>
                  <div className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    <MapPin className="w-4 h-4 text-[#EA580C] flex-shrink-0 mt-0.5" />
                    <span>{COMPANY_PROFILE.contact.address}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-[#073B75] flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-[#073B75]" /> Layanan K/L/PD & BUMN Seluruh Indonesia
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Nomor WhatsApp */}
          <div className="bg-gradient-to-br from-[#10B981] via-[#059669] to-[#047857] rounded-3xl p-7 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white border border-white/20">
                  <MessageSquare className="w-6 h-6 fill-white" />
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/20 text-white border border-white/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  24 Jam Siap Respon
                </span>
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">WhatsApp</span>
                <h3 className="text-lg font-bold text-white mt-1 font-display">Layanan Konsultasi Langsung</h3>
                <p className="text-2xl font-extrabold text-white mt-2 font-display tracking-tight">
                  {COMPANY_PROFILE.contact.whatsappFormatted}
                </p>
                <p className="text-xs text-emerald-100 mt-1.5 leading-relaxed">
                  Terhubung langsung dengan Tenaga Ahli Pengadaan Barang/Jasa.
                </p>
              </div>
            </div>

            <div className="mt-6 relative z-10">
              <button
                onClick={handleWhatsAppClick}
                className="w-full py-3 px-4 bg-white text-[#059669] hover:bg-emerald-50 text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>Chat WhatsApp Sekarang</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 3. Email */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#073B75] border border-blue-200/80 flex items-center justify-center">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Surel</span>
                <h3 className="text-lg font-bold text-slate-900 mt-1 font-display">Email Korespondensi</h3>
                <a 
                  href={`mailto:${COMPANY_PROFILE.contact.email}`}
                  className="text-sm font-bold text-[#073B75] hover:text-[#EA580C] transition mt-2 block break-all"
                >
                  {COMPANY_PROFILE.contact.email}
                </a>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Surat penawaran kerja sama, dokumen administrasi, & undangan.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <a
                href={`mailto:${COMPANY_PROFILE.contact.email}`}
                className="w-full py-2.5 px-3 bg-slate-50 hover:bg-blue-50/80 text-slate-700 hover:text-[#073B75] text-xs font-bold rounded-xl border border-slate-200/80 hover:border-blue-200 transition flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5 text-blue-600" />
                <span>Kirim Email</span>
              </a>
            </div>
          </div>

          {/* 4. Instagram */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              {/* Instagram Gradient Icon */}
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shadow-xs">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Media Sosial</span>
                <h3 className="text-lg font-bold text-slate-900 mt-1 font-display">Instagram</h3>
                <a 
                  href={COMPANY_PROFILE.contact.instagramUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-sm font-bold text-rose-600 hover:text-rose-700 transition mt-2 block"
                >
                  {COMPANY_PROFILE.contact.instagram}
                </a>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Update info regulasi PBJ, telaah hukum, & dokumentasi kegiatan pelatihan.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <a
                href={COMPANY_PROFILE.contact.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200/80 transition flex items-center justify-center gap-1.5"
              >
                <span>Kunjungi Instagram</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          </div>

          {/* 5. TikTok */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              {/* TikTok Icon */}
              <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center shadow-xs">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.81 4.47A6.34 6.34 0 0 0 14.88 15V8.33a8.27 8.27 0 0 0 4.71 1.48v-3.12z"/>
                </svg>
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Video Edukasi</span>
                <h3 className="text-lg font-bold text-slate-900 mt-1 font-display">TikTok</h3>
                <a 
                  href={COMPANY_PROFILE.contact.tiktokUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-sm font-bold text-slate-900 hover:text-[#EA580C] transition mt-2 block"
                >
                  {COMPANY_PROFILE.contact.tiktok}
                </a>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Video singkat tips pengadaan, regulasi terbaru, & studi kasus praktis PBJ.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <a
                href={COMPANY_PROFILE.contact.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200/80 transition flex items-center justify-center gap-1.5"
              >
                <span>Kunjungi TikTok</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          </div>
        </div>

        {/* Interactive Fast Inquiry Form to Direct WhatsApp */}
        <div className="mt-14 max-w-5xl mx-auto bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-lg">
          <div className="max-w-2xl mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
              Form Permohonan Informasi & Konsultasi Cepat
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Isi data kebutuhan pengadaan instansi/perusahaan Anda untuk langsung terhubung ke Tenaga Ahli kami via WhatsApp.
            </p>
          </div>

          <form onSubmit={handleSendFastInquiry} className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nama Lengkap / Jabatan
              </label>
              <input
                type="text"
                value={inquiryName}
                onChange={(e) => setInquiryName(e.target.value)}
                placeholder="Contoh: Budi Santoso (PPK)"
                className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200/90 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#073B75] focus:bg-white text-slate-800 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Instansi / Perusahaan
              </label>
              <input
                type="text"
                value={inquiryAgency}
                onChange={(e) => setInquiryAgency(e.target.value)}
                placeholder="Contoh: Dinas PUPR / PT..."
                className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200/90 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#073B75] focus:bg-white text-slate-800 transition-all"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Layanan yang Diperlukan
              </label>
              <select
                value={inquiryService}
                onChange={(e) => setInquiryService(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200/90 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#073B75] focus:bg-white text-slate-800 font-medium transition-all"
              >
                <option value="1. Konsultasi Pengadaan Barang Jasa">1. Konsultasi Pengadaan Barang Jasa</option>
                <option value="2. Agen Pengadaan Barang Jasa (Pokja & PPK)">2. Agen Pengadaan Barang Jasa (Pokja & PPK)</option>
                <option value="3. Perancangan Peraturan dan Standar Oprasional (Legal Drafting)">3. Perancangan Peraturan dan Standar Oprasional (Legal Drafting)</option>
                <option value="4. Pendampingan Pengadaan Barang/Jasa (Advice)">4. Pendampingan Pengadaan Barang/Jasa (Advice)</option>
                <option value="5. Pembuatan dan Pengembangan Sistem (System Development)">5. Pembuatan dan Pengembangan Sistem (System Development)</option>
                <option value="6. Pelatihan Pengadaan Barang/Jasa (Training)">6. Pelatihan Pengadaan Barang/Jasa (Training)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Uraian Singkat Masalah / Kebutuhan
              </label>
              <textarea
                rows={3}
                value={inquiryMessage}
                onChange={(e) => setInquiryMessage(e.target.value)}
                placeholder="Jelaskan secara singkat jenis paket pengadaan atau persoalan yang ingin didiskusikan..."
                className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200/90 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#073B75] focus:bg-white text-slate-800 transition-all"
              />
            </div>

            <div className="sm:col-span-2 pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto py-3.5 px-7 bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 transition-all flex items-center justify-center gap-2.5 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Kirimkan ke WhatsApp Tenaga Ahli PT. APN</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
