import React, { useState } from 'react';
import { 
  MessageSquareShare, MessageSquare, UserCheck, FileCheck2, ShieldCheck, 
  GraduationCap, ArrowRight, ExternalLink, Check, Phone, 
  ChevronRight, X, Layers, Sparkles, Laptop
} from 'lucide-react';
import { SERVICES_DATA, COMPANY_PROFILE } from '../data/procurementData';
import { ServiceItem } from '../types';

interface ServicesSectionProps {
  onOpenConsultation: (topic?: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onOpenConsultation
}) => {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  const getServiceIcon = (id: string) => {
    switch (id) {
      case 'konsultasi-langsung':
        return <MessageSquareShare className="w-4 h-4" />;
      case 'agen-pengadaan':
        return <UserCheck className="w-4 h-4" />;
      case 'legal-drafting':
        return <FileCheck2 className="w-4 h-4" />;
      case 'pendampingan-pbj':
        return <ShieldCheck className="w-4 h-4" />;
      case 'aplikasi-pbj':
        return <Laptop className="w-4 h-4" />;
      case 'pelatihan-pbj':
        return <GraduationCap className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  const getServiceBadge = (id: string) => {
    switch (id) {
      case 'konsultasi-langsung':
        return 'Konsultasi PBJ';
      case 'agen-pengadaan':
        return 'Agen Pengadaan';
      case 'legal-drafting':
        return 'Legal Drafting';
      case 'pendampingan-pbj':
        return 'Advice';
      case 'aplikasi-pbj':
        return 'System Development';
      case 'pelatihan-pbj':
        return 'Training';
      default:
        return 'Layanan PBJ';
    }
  };

  const handleServiceClick = (service: ServiceItem) => {
    setSelectedService(service);
  };

  return (
    <section id="layanan" className="py-20 bg-slate-50 relative overflow-hidden">
      {/* Soft Luminous Ambient Depth Lighting */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-100/40 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-[#073B75] text-xs font-bold uppercase tracking-wider mb-3">
            <Layers className="w-3.5 h-3.5 text-[#073B75]" />
            <span>Layanan Kami</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-slate-900">
            Daftar Layanan Pengadaan
          </h2>
          <p className="mt-3 text-base text-slate-600 font-normal">
            Solusi Layanan Pengadaan Terpadu PT. Agen Pengadaan Nasional untuk Kementerian, Lembaga, Pemerintah Daerah, BUMN, dan Swasta.
          </p>
        </div>

        {/* Services Structured Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {SERVICES_DATA.map((service) => {
            return (
              <div
                key={service.id}
                onClick={() => handleServiceClick(service)}
                className="bg-white rounded-3xl border border-slate-200/80 hover:border-blue-400/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group shadow-xs cursor-pointer relative overflow-hidden"
              >
                <div>
                  {/* Service Card Cover Photo */}
                  <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-100">
                    <img
                      src={service.imageUrl || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80'}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent" />

                    {/* Top Overlay Badges */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-[#051E3C]/90 text-white backdrop-blur-xs border border-white/20 shadow-xs">
                        {getServiceBadge(service.id)}
                      </span>
                    </div>

                    {/* Floating Service Icon on Bottom Right of Image - Fully Visible & Compact */}
                    <div className="absolute bottom-3 right-3 z-10">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-110 bg-[#073B75] text-white border border-white/40">
                        {getServiceIcon(service.id)}
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 pt-5">
                    <h3 className="text-lg font-bold font-display text-slate-900 group-hover:text-[#073B75] transition-colors leading-snug">
                      {service.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed line-clamp-3">
                      {service.shortDesc}
                    </p>

                    {/* Mini Feature Highlights */}
                    <div className="mt-4 space-y-1.5 pt-3 border-t border-slate-100">
                      {service.features.slice(0, 2).map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-600 line-clamp-1">
                          <Check className="w-3.5 h-3.5 text-[#10B981] flex-shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Bottom Action */}
                <div className="p-6 pt-0">
                  <div className="w-full py-3 px-4 bg-slate-50 group-hover:bg-blue-50/80 text-slate-700 group-hover:text-[#073B75] text-xs font-bold rounded-xl border border-slate-200/80 group-hover:border-blue-200 transition-all flex items-center justify-between">
                    <span>Lihat Ruang Lingkup Layanan</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#073B75] group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SERVICE DETAIL MODAL FOR SERVICES */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200">
            {/* Modal Image Header Banner */}
            <div className="relative h-48 sm:h-56 w-full overflow-hidden">
              <img
                src={selectedService.imageUrl || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=80'}
                alt={selectedService.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/50 to-transparent" />
              
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-xs transition cursor-pointer"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
                <div>
                  <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                    {getServiceBadge(selectedService.id)} • PT. Agen Pengadaan Nasional
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white font-display mt-0.5">
                    {selectedService.title}
                  </h3>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Deskripsi Layanan
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {selectedService.fullDesc}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Fitur & Ruang Lingkup Pekerjaan
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedService.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200">
                      <Check className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-100">
                  <h4 className="text-xs font-bold text-[#073B75] uppercase tracking-wider mb-2">
                    Keuntungan & Nilai Tambah
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {selectedService.benefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-blue-600 font-bold">•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-orange-50/70 p-4 rounded-2xl border border-orange-100">
                  <h4 className="text-xs font-bold text-[#EA580C] uppercase tracking-wider mb-2">
                    Output & Laporan (Deliverables)
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {selectedService.deliverables.map((d, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-[#EA580C] font-bold">•</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    const svcName = selectedService.title;
                    setSelectedService(null);
                    const msg = encodeURIComponent(
                      `Halo Tenaga Ahli PT. Agen Pengadaan Nasional, saya ingin berkonsultasi mengenai layanan: ${svcName}. Terima kasih.`
                    );
                    window.open(`https://wa.me/${COMPANY_PROFILE.contact.whatsapp}?text=${msg}`, '_blank');
                  }}
                  className="flex-1 py-3.5 px-4 bg-[#073B75] hover:bg-[#052C59] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-orange-400" />
                  Konsultasi Layanan Ini
                </button>
                <button
                  onClick={() => setSelectedService(null)}
                  className="py-3.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
