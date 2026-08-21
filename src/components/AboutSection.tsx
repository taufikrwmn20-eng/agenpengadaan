import React from 'react';
import { 
  Building2, CheckCircle2, ShieldCheck, Award, 
  Scale, FileText, ShieldAlert, GraduationCap, FileCheck,
  UserCheck, Briefcase
} from 'lucide-react';
import { FOUNDER_DIRECTOR_PROFILE } from '../data/procurementData';

interface AboutSectionProps {
  onOpenConsultation?: (topic?: string) => void;
}

export const AboutSection: React.FC<AboutSectionProps> = () => {
  const getExperienceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Scale':
        return <Scale className="w-5 h-5 text-[#073B75]" />;
      case 'FileText':
        return <FileText className="w-5 h-5 text-[#EA580C]" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-5 h-5 text-rose-600" />;
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5 text-emerald-600" />;
      case 'FileCheck':
        return <FileCheck className="w-5 h-5 text-indigo-600" />;
      case 'Building2':
        return <Building2 className="w-5 h-5 text-blue-600" />;
      default:
        return <Award className="w-5 h-5 text-[#073B75]" />;
    }
  };

  return (
    <section id="tentang" className="py-20 bg-slate-50/70 relative overflow-hidden">
      {/* Organic Ambient Depth Lighting */}
      <div className="absolute top-10 right-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-[500px] h-[500px] bg-orange-100/40 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Unified Master Container */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden">
          
          {/* Header Banner with Premium Architectural & Soft Luminous Background */}
          <div className="bg-gradient-to-r from-[#051E3C] via-[#073B75] to-[#0A4D92] text-white p-8 sm:p-12 relative overflow-hidden">
            {/* Background Texture Image with Smooth Masking */}
            <img
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80"
              alt="Futuristic Architecture"
              className="absolute inset-0 w-full h-full object-cover object-center opacity-15 mix-blend-overlay pointer-events-none"
              referrerPolicy="no-referrer"
            />
            {/* Smooth Ambient Light Accents (No Lines) */}
            <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-cyan-400/15 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute top-0 left-1/3 w-60 h-60 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
            
            <div className="max-w-4xl mx-auto text-center space-y-3 relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-cyan-400/30 text-cyan-200 text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-xs">
                <Building2 className="w-3.5 h-3.5 text-orange-400" />
                <span>Tentang Kami</span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display tracking-tight text-white drop-shadow-md">
                PT. Agen Pengadaan Nasional
              </h2>
              <div className="flex items-center justify-center flex-wrap gap-2 text-sm sm:text-base font-semibold text-orange-400 font-display">
                <span>NATIONAL PROCUREMENT AGENT</span>
                <span className="text-blue-300">•</span>
                <span className="text-blue-100 font-normal italic">Innovation and Solution Hub</span>
              </div>
            </div>
          </div>

          {/* Integrated Company & Director Profile */}
          <div className="p-6 sm:p-10 lg:p-12 space-y-12">
            
            {/* Top Grid: Company Narrative (Left) & Director Leadership Card (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Company Background (7 cols) */}
              <div className="lg:col-span-7 space-y-5 text-slate-700 leading-relaxed text-sm sm:text-base">
                <p className="font-medium text-slate-900 text-base sm:text-lg">
                  <strong>PT. Agen Pengadaan Nasional</strong> adalah entitas penyedia jasa Agen Pengadaan profesional, independen, dan terpercaya di Indonesia yang bergerak dalam penyelenggaraan dan pendampingan tata kelola Pengadaan Barang/Jasa (PBJ) Pemerintah, BUMN/BUMD, maupun Korporasi Swasta.
                </p>
                <p>
                  Didirikan sebagai wujud implementasi amanat <strong>Peraturan Presiden (Perpres) Nomor 46 Tahun 2025 tentang Perubahan Kedua atas Peraturan Presiden Nomor 16 Tahun 2018 tentang Pengadaan Barang/Jasa Pemerintah</strong> dan <strong>Peraturan LKPP No. 10 Tahun 2021</strong> tentang Agen Pengadaan, kami bertindak untuk dan atas nama Pengguna Jasa dalam menyelenggarakan proses pengadaan yang transparan, akuntabel, efisien, dan bebas dari benturan kepentingan.
                </p>
                <p>
                  Sebagai <em>Innovation and Solution Hub</em>, kami mengintegrasikan kepakaran mendalam terhadap regulasi pengadaan publik dengan metodologi mitigasi risiko audit BPK/APIP, manajemen kontrak berdaya lindung hukum tinggi, serta reviu HPS berbasis data pasar riil.
                </p>

                {/* Company Highlights */}
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-100/90 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#073B75] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Independen & Berbadan Hukum</span>
                      <span className="text-[11px] text-slate-600 mt-0.5 block">Terdaftar dan beroperasi penuh sesuai koridor hukum pengadaan nasional.</span>
                    </div>
                  </div>

                  <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-100/90 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Mitigasi Risiko Audit BPK & APIP</span>
                      <span className="text-[11px] text-slate-600 mt-0.5 block">Dokumentasi kepatuhan berlapis untuk melindungi para pengambil kebijakan (PA/KPA/PPK).</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Director Leadership Showcase (5 cols) */}
              <div className="lg:col-span-5 bg-gradient-to-br from-[#051E3C] via-[#073B75] to-[#0A4D92] text-white p-6 sm:p-7 rounded-3xl shadow-xl border border-blue-900/50 relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/15 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="relative z-10 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-400/30 text-orange-300 text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
                    <UserCheck className="w-3.5 h-3.5 text-orange-400" />
                    <span>Direktur Perusahaan</span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-extrabold font-display tracking-tight text-white">
                      {FOUNDER_DIRECTOR_PROFILE.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-blue-200 font-medium mt-1">
                      {FOUNDER_DIRECTOR_PROFILE.titleDesc}
                    </p>
                  </div>

                  <div className="p-4 bg-white/10 rounded-2xl border border-white/15 backdrop-blur-xs text-xs text-slate-200 leading-relaxed">
                    Praktisi dan pakar hukum pengadaan barang/jasa publik yang memimpin operasional PT. Agen Pengadaan Nasional dengan standar kepatuhan regulasi mutlak, mitigasi risiko sengketa, dan perlindungan hukum bagi pengguna jasa.
                  </div>

                  <div className="pt-2 flex items-center gap-2 text-xs text-orange-300 font-semibold">
                    <ShieldCheck className="w-4 h-4 text-orange-400" />
                    <span>Integritas, Akuntabilitas, & Kepastian Hukum PBJ</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Middle Section: 6 Experience & Track Record Cards */}
            <div className="pt-8 border-t border-slate-200/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#EA580C] mb-1">
                    <Briefcase className="w-4 h-4 text-[#EA580C]" />
                    <span>Rekam Jejak & Portofolio</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">
                    Pengalaman Praktik & Advokasi PBJ
                  </h3>
                </div>
                <span className="text-xs text-slate-500 max-w-xs">
                  Portofolio komprehensif pendampingan kasus pengadaan nasional, sengketa kontrak, dan proyek KPBU.
                </span>
              </div>

              {/* 6 Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {FOUNDER_DIRECTOR_PROFILE.experiences.map((exp, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:bg-white hover:shadow-lg hover:border-blue-300/80 hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs group-hover:scale-105 transition-transform">
                          {getExperienceIcon(exp.iconName)}
                        </div>
                        <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-orange-100 text-[#EA580C] border border-orange-200/80">
                          {exp.highlight}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 mb-2 leading-snug group-hover:text-[#073B75] transition-colors">
                        {exp.title}
                      </h4>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {exp.desc}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="font-semibold">{exp.metricUnit}</span>
                      <span className="font-bold text-slate-900 text-xs">{exp.metric}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Section: Client Sectors Showcase (Sektor yang Dilayani) */}
            <div className="pt-8 border-t border-slate-200/80">
              <div className="text-center max-w-2xl mx-auto mb-8">
                <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C]">
                  Ekosistem Klien & Mitra Kerja
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 mt-1">
                  Sektor yang Siap Kami Layani
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2">
                  Pengalaman mendampingi berbagai sektor publik dan komersial dengan standar kepatuhan tinggi.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Sector 1 - Kementerian & Lembaga */}
                <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group">
                  <div className="h-32 w-full overflow-hidden relative">
                    <img
                      src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=600&q=80"
                      alt="Kementerian & Lembaga"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                    <span className="absolute bottom-2.5 left-3 text-xs font-bold text-white tracking-wide">
                      Kementerian & Lembaga
                    </span>
                  </div>
                  <div className="p-3.5">
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Pendampingan paket strategis K/L, penyusunan HPS, dan mitigasi temuan pemeriksaan BPK RI.
                    </p>
                  </div>
                </div>

                {/* Sector 2 - Pemerintah Daerah */}
                <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group">
                  <div className="h-32 w-full overflow-hidden relative bg-slate-100">
                    <img
                      src="https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=600&q=80"
                      alt="Pemerintah Daerah Provinsi & Kab/Kota"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                    <span className="absolute bottom-2.5 left-3 text-xs font-bold text-white tracking-wide">
                      Pemerintah Daerah
                    </span>
                  </div>
                  <div className="p-3.5">
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Asistensi tender konstruksi OPD, peningkatan skor ITKP, dan pemenuhan target P3DN/TKDN.
                    </p>
                  </div>
                </div>

                {/* Sector 3 */}
                <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group">
                  <div className="h-32 w-full overflow-hidden relative">
                    <img
                      src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80"
                      alt="BUMN BUMD dan BLU"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                    <span className="absolute bottom-2.5 left-3 text-xs font-bold text-white tracking-wide">
                      BUMN, BUMD & BLU
                    </span>
                  </div>
                  <div className="p-3.5">
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Penyelenggaraan e-procurement independen dan manajemen kontrak korporasi berisiko tinggi.
                    </p>
                  </div>
                </div>

                {/* Sector 4 */}
                <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group">
                  <div className="h-32 w-full overflow-hidden relative">
                    <img
                      src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80"
                      alt="Kesehatan, IT & Infrastruktur"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                    <span className="absolute bottom-2.5 left-3 text-xs font-bold text-white tracking-wide">
                      Infrastruktur & IT
                    </span>
                  </div>
                  <div className="p-3.5">
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Reviu spesifikasi teknis peralatan canggih, proyek multiyears, dan sistem digital instansi.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
