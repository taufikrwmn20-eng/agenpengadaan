import React from 'react';
import { 
  ShieldCheck, MessageSquare, ChevronRight, Layers,
  Scale, Award, Lock, Sparkles, Cpu
} from 'lucide-react';
import { COMPANY_PROFILE } from '../data/procurementData';

interface HeroProps {
  onOpenConsultation: (topic?: string) => void;
  onScrollToSection: (sectionId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ 
  onOpenConsultation, 
  onScrollToSection
}) => {
  const handleDirectWhatsApp = () => {
    const text = encodeURIComponent(
      `Halo PT. Agen Pengadaan Nasional, saya ingin Konsultasi Langsung Pengadaan Barang Jasa via WhatsApp. Mohon informasi layanan dan pendampingan. Terima kasih.`
    );
    window.open(`https://wa.me/${COMPANY_PROFILE.contact.whatsapp}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const credibilityPillars = [
    {
      icon: ShieldCheck,
      title: '100% Berlandaskan Regulasi',
      desc: 'Sesuai Perpres No. 46/2025 & Peraturan LKPP',
      color: 'text-blue-600',
      bg: 'bg-blue-50/90',
      border: 'border-blue-100/90'
    },
    {
      icon: Scale,
      title: 'Independen & Berintegritas',
      desc: 'Bebas benturan kepentingan & berbadan hukum',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50/90',
      border: 'border-emerald-100/90'
    },
    {
      icon: Award,
      title: 'Tenaga Ahli Bersertifikasi',
      desc: 'Didukung praktisi bersertifikat PBJ LKPP & BNSP',
      color: 'text-amber-600',
      bg: 'bg-amber-50/90',
      border: 'border-amber-100/90'
    },
    {
      icon: Lock,
      title: 'Kerahasiaan Dokumen Terjamin',
      desc: 'Standar ketat perlindungan data & kepatuhan NDA',
      color: 'text-purple-600',
      bg: 'bg-purple-50/90',
      border: 'border-purple-100/90'
    }
  ];

  return (
    <section id="hero" className="pt-32 pb-16 lg:pt-40 lg:pb-24 relative overflow-hidden bg-slate-950">
      {/* 1. Cinematic Architectural Modern Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=85"
          alt="Modern Architecture"
          className="w-full h-full object-cover object-center transform scale-105 filter brightness-110 contrast-105"
        />
        {/* Deep Executive Gradient Overlay with Smooth Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#051E3C]/90 via-[#073B75]/75 to-slate-950/95" />
        <div className="absolute inset-0 bg-radial from-transparent via-slate-950/40 to-slate-950/90 pointer-events-none" />
      </div>

      {/* 2. Organic Luminous Ambient Lighting (No Grid Lines) */}
      <div className="absolute -top-20 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/20 via-sky-400/15 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 left-10 w-[550px] h-[550px] bg-gradient-to-tr from-orange-500/15 via-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Regulatory Badge - Futuristic Glowing Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-cyan-400/40 text-cyan-300 text-xs font-bold tracking-wide shadow-lg shadow-cyan-500/10 mx-auto group hover:border-cyan-400 transition-all">
            <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span className="truncate">Berlandaskan Perpres No. 46 Tahun 2025 & Peraturan LKPP</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          {/* Main Headline */}
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-white leading-[1.14] drop-shadow-md">
              Solusi Strategis & Terpercaya{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-200 to-cyan-300">
                Pengadaan Barang/Jasa
              </span>{' '}
              Nasional
            </h1>
            <div className="mt-4 flex items-center justify-center gap-2.5">
              <span className="text-base sm:text-lg font-black text-orange-400 uppercase tracking-wider font-display drop-shadow-sm">
                PT. Agen Pengadaan Nasional
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs sm:text-sm font-semibold text-slate-300 italic flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Innovation and Solution Hub</span>
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-base sm:text-lg text-slate-200 font-normal leading-relaxed max-w-3xl mx-auto drop-shadow-sm">
            Mitra profesional independen pertama di Indonesia yang mendampingi Kementerian, Lembaga, Pemerintah Daerah, BUMN, dan Swasta dalam pelaksanaan pemilihan tender, manajemen kontrak, reviu HPS, pendampingan kepatuhan, dan pelatihan SDM pengadaan.
          </p>

          {/* Action Buttons */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-3.5">
            {/* Primary CTA with Futuristic Glow */}
            <button
              onClick={handleDirectWhatsApp}
              className="flex items-center gap-2.5 py-3.5 px-7 bg-gradient-to-r from-[#073B75] to-[#0284C7] hover:from-[#052C59] hover:to-[#0369A1] text-white font-bold text-sm rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-400/35 border border-cyan-400/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-orange-400" />
              <span>Konsultasi Pengadaan</span>
            </button>

            {/* Secondary CTA with Glass Effect */}
            <button
              onClick={() => onScrollToSection('layanan')}
              className="flex items-center gap-2 py-3.5 px-6 bg-slate-900/70 hover:bg-slate-800/90 text-white font-bold text-sm rounded-xl border border-slate-700/80 backdrop-blur-md shadow-lg shadow-black/20 hover:border-cyan-400/50 transition-all cursor-pointer group"
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Lihat Ruang Lingkup Layanan</span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* 4 Komitmen & Jaminan Kredibilitas (Modern Glassmorphic Cards) */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {credibilityPillars.map((pillar, idx) => {
            const IconComponent = pillar.icon;
            return (
              <div 
                key={idx}
                className="bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-xl shadow-slate-950/20 hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-1 transition-all duration-300 border border-white/60 hover:border-cyan-400/60 flex items-start gap-3.5 text-left group"
              >
                <div className={`w-11 h-11 rounded-xl ${pillar.bg} ${pillar.color} flex items-center justify-center flex-shrink-0 shadow-xs mt-0.5 group-hover:scale-110 transition-transform`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-[#073B75] transition-colors">
                    {pillar.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
