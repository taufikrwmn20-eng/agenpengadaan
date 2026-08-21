import React, { useState } from 'react';
import { InformationItem } from '../types';
import { Search, ChevronRight, Home, Calendar, Clock, User, Filter } from 'lucide-react';

interface InformationListViewProps {
  articles: InformationItem[];
  onSelectArticle: (slug: string) => void;
  onBackToHome: () => void;
  onOpenAdmin?: () => void;
}

export const InformationListView: React.FC<InformationListViewProps> = ({
  articles,
  onSelectArticle,
  onBackToHome,
  onOpenAdmin
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  const categories = ['Semua', 'Artikel', 'Berita', 'Kegiatan'];

  const filteredArticles = articles.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'Semua' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 animate-fadeIn">
      {/* 1. Header Banner matching Image 2 */}
      <div className="bg-[#073B75] text-white pt-32 md:pt-40 pb-20 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-wider font-display">
            INFORMASI
          </h1>
          <p className="text-sm sm:text-base text-slate-200 mt-2 font-medium">
            Artikel, Berita &amp; Kegiatan
          </p>
          <div className="w-10 h-1 bg-amber-400 mx-auto mt-3 rounded-full" />
        </div>
      </div>

      {/* 2. Breadcrumb Bar matching Image 2 */}
      <div className="bg-slate-100/90 border-b border-slate-200/90 py-3 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 uppercase tracking-wide text-[11px] font-semibold">
            <button
              onClick={onBackToHome}
              className="hover:text-[#073B75] transition flex items-center gap-1 cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>BERANDA</span>
            </button>
            <span>&gt;</span>
            <span className="text-[#073B75]">INFORMASI</span>
          </div>

          <div className="text-[11px] text-slate-500">
            Menampilkan <strong>{filteredArticles.length}</strong> publikasi
          </div>
        </div>
      </div>

      {/* 3. Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search & Filter Bar */}
        <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#073B75] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari artikel, topik, atau penulis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#073B75] focus:bg-white text-slate-800"
            />
          </div>
        </div>

        {/* Articles Grid matching Image 2 */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-500 text-sm">Tidak ditemukan artikel dengan kata kunci "{searchTerm}".</p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory('Semua'); }}
              className="mt-4 px-4 py-2 bg-[#073B75] text-white text-xs font-bold rounded-lg"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((item) => (
              <article
                key={item.id}
                onClick={() => onSelectArticle(item.slug)}
                className="group flex flex-col bg-white rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1.5 shadow-xs hover:shadow-md border border-slate-100"
              >
                {/* Image (Object-Contain so infographics & images are never cropped) */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 flex items-center justify-center p-1 border-b border-slate-100">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 right-3 z-10">
                    <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold rounded-md shadow-xs">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Content area with Date Box + Excerpt (Exact Image 2 Style) */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="flex items-start gap-4">
                    {/* Date Badge Box */}
                    <div className="flex-shrink-0 w-13 h-13 border-2 border-slate-300/90 rounded-md flex flex-col items-center justify-center text-center bg-slate-50 group-hover:border-[#073B75] group-hover:bg-blue-50/40 transition-colors">
                      <span className="text-base font-black text-slate-800 group-hover:text-[#073B75] leading-none">
                        {item.day}
                      </span>
                      <span className="text-[9px] font-bold uppercase text-slate-500 group-hover:text-[#073B75] tracking-wider mt-0.5">
                        {item.month}
                      </span>
                    </div>

                    {/* Title */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-[#073B75] group-hover:text-[#0284C7] leading-snug line-clamp-2 transition-colors">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  {/* Summary / Excerpt text matching Image 2 */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-4">
                      {item.title} Oleh: <strong>{item.author}</strong> Tanggal: {item.date} {item.summary ? item.summary.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() : ''} [...]
                    </p>

                    {/* Dark Blue Accent Bar */}
                    <div className="w-8 h-1 bg-[#073B75] mt-3 group-hover:w-16 group-hover:bg-[#0284C7] transition-all duration-300" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Bottom Back Button */}
        <div className="mt-14 text-center">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-lg transition cursor-pointer"
          >
            <span>&larr; Kembali ke Beranda</span>
          </button>
        </div>
      </div>
    </div>
  );
};
