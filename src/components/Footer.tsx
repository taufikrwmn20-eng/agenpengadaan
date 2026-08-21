import React from 'react';
import { 
  Phone, Mail, MapPin, ShieldCheck, 
  MessageSquare, ExternalLink, ChevronRight,
  Instagram, Key
} from 'lucide-react';
import { Logo } from './Logo';
import { COMPANY_PROFILE, SERVICES_DATA } from '../data/procurementData';

interface FooterProps {
  onOpenConsultation: (topic?: string) => void;
  onScrollToSection: (sectionId: string) => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  onOpenConsultation, 
  onScrollToSection,
  onOpenAdmin
}) => {
  const handleServiceClick = (service: typeof SERVICES_DATA[0]) => {
    if (service.isDirectWhatsApp || service.id === 'konsultasi-langsung') {
      const msg = encodeURIComponent(
        `Halo PT. Agen Pengadaan Nasional, saya ingin Konsultasi Langsung Pengadaan Barang Jasa via WhatsApp. Terima kasih.`
      );
      window.open(`https://wa.me/${COMPANY_PROFILE.contact.whatsapp}?text=${msg}`, '_blank');
    } else {
      onScrollToSection('layanan');
    }
  };

  return (
    <footer className="bg-slate-100/90 text-slate-700 pt-16 pb-12 border-t border-slate-200 relative overflow-hidden">
      {/* Subtle Ambient Depth Lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-100/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-orange-100/60 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-200">
          {/* Col 1: Brand & Profile (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <Logo size="lg" />
            <p className="text-xs text-slate-600 leading-relaxed pt-2">
              <strong>PT. Agen Pengadaan Nasional</strong> (National Procurement Agent) adalah entitas penyedia jasa Agen Pengadaan independen, profesional, dan berbadan hukum di Indonesia yang beroperasi berlandaskan Perpres No. 46 Tahun 2025 (Perubahan Kedua Perpres No. 16/2018) serta Peraturan LKPP.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#EA580C] font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#EA580C]" />
              <span>Innovation and Solution Hub</span>
            </div>
          </div>

          {/* Col 2: Daftar 6 Layanan (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-sm font-bold text-[#073B75] uppercase tracking-wider font-display">
              Layanan Kami
            </h4>
            <ul className="space-y-2 text-xs">
              {SERVICES_DATA.map((svc) => (
                <li key={svc.id}>
                  <button
                    onClick={() => handleServiceClick(svc)}
                    className="transition flex items-center gap-2 text-left text-slate-600 hover:text-[#0284C7] cursor-pointer group"
                  >
                    <span className="w-5 h-5 rounded-md bg-blue-100/80 text-[#0369A1] font-bold text-[10px] flex items-center justify-center flex-shrink-0 group-hover:bg-[#0284C7] group-hover:text-white transition">
                      {svc.number}
                    </span>
                    <span className="line-clamp-1 font-medium">{svc.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Informasi Kontak & Media Sosial (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-[#073B75] uppercase tracking-wider font-display">
              Kontak & Media Sosial
            </h4>
            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#EA580C] flex-shrink-0 mt-0.5" />
                <span className="leading-tight text-slate-700">{COMPANY_PROFILE.contact.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#073B75] flex-shrink-0" />
                <a 
                  href={`tel:${COMPANY_PROFILE.contact.phone}`} 
                  className="hover:text-[#073B75] font-bold text-slate-900 transition"
                >
                  {COMPANY_PROFILE.contact.whatsappFormatted}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#0284C7] flex-shrink-0" />
                <a 
                  href={`mailto:${COMPANY_PROFILE.contact.email}`}
                  className="text-slate-700 hover:text-[#073B75] transition"
                >
                  {COMPANY_PROFILE.contact.email}
                </a>
              </div>

              {/* Instagram & TikTok Social Accounts with Logos and Names */}
              <div className="pt-2 space-y-1.5">
                <a
                  href={COMPANY_PROFILE.contact.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-slate-700 hover:text-[#E1306C] transition group py-0.5"
                >
                  <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-2xs group-hover:opacity-90 transition flex-shrink-0">
                    <Instagram className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold text-slate-800 group-hover:text-[#E1306C] transition">
                    {COMPANY_PROFILE.contact.instagram}
                  </span>
                </a>
                <a
                  href={COMPANY_PROFILE.contact.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-slate-700 hover:text-black transition group py-0.5"
                >
                  <div className="w-5 h-5 rounded-md bg-black flex items-center justify-center text-white shadow-2xs group-hover:bg-slate-800 transition flex-shrink-0">
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.81 4.47A6.34 6.34 0 0 0 14.88 15V8.33a8.27 8.27 0 0 0 4.71 1.48v-3.12z"/>
                    </svg>
                  </div>
                  <span className="font-semibold text-slate-800 group-hover:text-black transition">
                    {COMPANY_PROFILE.contact.tiktok}
                  </span>
                </a>
              </div>
            </div>

            <div className="pt-3">
              <button
                onClick={() => onOpenConsultation('Konsultasi via Footer WhatsApp')}
                className="w-full py-2.5 px-3.5 bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Konsultasi WhatsApp</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Legal Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} <strong>PT. Agen Pengadaan Nasional</strong>. Hak Cipta Dilindungi Undang-Undang.
          </div>
          <div className="flex items-center gap-4 text-slate-500 font-medium">
            <span>Perpres No. 46 Tahun 2025</span>
            <span>•</span>
            <span>Peraturan LKPP</span>
            {onOpenAdmin && (
              <>
                <span>•</span>
                <button
                  onClick={onOpenAdmin}
                  className="text-slate-400 hover:text-[#073B75] hover:bg-slate-200/70 p-1 rounded-md transition cursor-pointer flex items-center justify-center"
                  title="Portal Admin CMS"
                  aria-label="Portal Admin CMS"
                >
                  <Key className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
