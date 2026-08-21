import React, { useState } from 'react';
import { MessageSquare, Send, CheckCircle2, PhoneCall, Sparkles, X, Clock, ShieldCheck } from 'lucide-react';
import { COMPANY_PROFILE } from '../data/procurementData';

interface WhatsAppConsultModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTopic?: string;
}

export const WhatsAppConsultModal: React.FC<WhatsAppConsultModalProps> = ({
  isOpen,
  onClose,
  defaultTopic = '1. Konsultasi Pengadaan Barang Jasa'
}) => {
  const [name, setName] = useState('');
  const [instansi, setInstansi] = useState('');
  const [topic, setTopic] = useState(defaultTopic);
  const [urgency, setUrgency] = useState('Mendesak');
  const [problemSummary, setProblemSummary] = useState('');

  if (!isOpen) return null;

  const topicsList = [
    '1. Konsultasi Pengadaan Barang Jasa',
    '2. Agen Pengadaan Barang Jasa (Pokja & PPK)',
    '3. Perancangan Peraturan dan Standar Oprasional (Legal Drafting)',
    '4. Pendampingan Pengadaan Barang/Jasa (Advice)',
    '5. Pembuatan dan Pengembangan Sistem (System Development)',
    '6. Pelatihan Pengadaan Barang/Jasa (Training)'
  ];

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedText = `Halo Tenaga Ahli PT. Agen Pengadaan Nasional,

Saya ingin melakukan *Konsultasi Pengadaan Barang/Jasa*:
👤 *Nama:* ${name || 'Bapak/Ibu'}
🏢 *Instansi / Perusahaan:* ${instansi || 'Instansi Terkait'}
📌 *Topik Layanan:* ${topic}
⚡ *Tingkat Kebutuhan:* ${urgency}
📝 *Uraian Singkat / Pertanyaan:*
${problemSummary || 'Mohon pendampingan dan jadwal diskusi lebih lanjut terkait pengadaan kami.'}

Terima kasih atas bantuan dan respon cepatnya.`;

    const encoded = encodeURIComponent(formattedText);
    const waUrl = `https://wa.me/${COMPANY_PROFILE.contact.whatsapp}?text=${encoded}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  const handleQuickDirectChat = () => {
    const quickText = encodeURIComponent(
      `Halo PT. Agen Pengadaan Nasional, saya ingin berkonsultasi langsung terkait Pengadaan Barang/Jasa Pemerintah / Korporasi. Mohon informasi ketersediaan Tenaga Ahli. Terima kasih.`
    );
    window.open(`https://wa.me/${COMPANY_PROFILE.contact.whatsapp}?text=${quickText}`, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-scaleUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0A4D92] via-[#0369A1] to-[#0284C7] p-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-md">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-emerald-300 font-bold bg-emerald-950/40 px-2 py-0.5 rounded-full inline-block mb-1">
                Layanan Konsultasi Langsung
              </span>
              <h3 className="text-lg font-bold font-display text-white">
                Hubungi Tenaga Ahli PBJ via WhatsApp
              </h3>
            </div>
          </div>
          <p className="text-xs text-blue-100 mt-2">
            Terhubung langsung dengan Tenaga Ahli Pengadaan bersertifikasi LKPP untuk konsultasi cepat & solusi tepat.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSendWhatsApp} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Ir. Budi Santoso"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Instansi / Organisasi / Perusahaan
            </label>
            <input
              type="text"
              required
              value={instansi}
              onChange={(e) => setInstansi(e.target.value)}
              placeholder="Contoh: Dinas PUPR / UKPBJ Kab. / PT. Penyedia"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Pilih Topik Konsultasi PBJ
            </label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            >
              {topicsList.map((t, idx) => (
                <option key={idx} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Tingkat Urgensi
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Biasa', 'Penting', 'Mendesak'].map((lvl) => (
                <button
                  type="button"
                  key={lvl}
                  onClick={() => setUrgency(lvl)}
                  className={`py-2 text-xs font-semibold rounded-lg border transition ${
                    urgency === lvl
                      ? 'bg-blue-50 border-blue-600 text-blue-700'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Uraian Masalah / Kebutuhan
            </label>
            <textarea
              rows={3}
              value={problemSummary}
              onChange={(e) => setProblemSummary(e.target.value)}
              placeholder="Ceritakan kendala pengadaan atau bantuan yang Anda butuhkan..."
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
            />
          </div>

          <div className="pt-2 space-y-2.5">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              Kirim & Mulai Chat WhatsApp
            </button>

            <button
              type="button"
              onClick={handleQuickDirectChat}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5 text-slate-500" />
              Chat Langsung Tanpa Isi Form ({COMPANY_PROFILE.contact.whatsappFormatted})
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-500" /> Respon Cepat 24/7
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" /> Kerahasiaan Terjamin
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};
