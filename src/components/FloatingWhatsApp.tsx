import React from 'react';
import { MessageSquare } from 'lucide-react';
import { COMPANY_PROFILE } from '../data/procurementData';

interface FloatingWhatsAppProps {
  onOpenConsultationModal: () => void;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = () => {
  const handleDirectClick = () => {
    const text = encodeURIComponent(
      `Halo Tenaga Ahli PT. Agen Pengadaan Nasional, saya ingin berkonsultasi mengenai Pengadaan Barang & Jasa Pemerintah / Korporasi. Mohon info lebih lanjut. Terima kasih.`
    );
    window.open(`https://wa.me/${COMPANY_PROFILE.contact.whatsapp}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 select-none">
      <button
        onClick={handleDirectClick}
        className="group relative w-14 h-14 rounded-full bg-[#10B981] hover:bg-[#059669] text-white shadow-xl shadow-emerald-950/20 flex items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer ring-4 ring-emerald-500/20"
        title="Hubungi WhatsApp PT. Agen Pengadaan Nasional"
        aria-label="Chat WhatsApp Tenaga Ahli Pengadaan"
      >
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border-2 border-white"></span>
        </span>
        <MessageSquare className="w-6 h-6 fill-white" />
      </button>
    </div>
  );
};
