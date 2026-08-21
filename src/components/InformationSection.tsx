import React from 'react';
import { InformationItem } from '../types';
import { ChevronRight, Calendar, ArrowRight } from 'lucide-react';

interface InformationSectionProps {
  articles: InformationItem[];
  onSelectArticle: (slug: string) => void;
  onViewAll: () => void;
}

export const InformationSection: React.FC<InformationSectionProps> = ({
  articles,
  onSelectArticle,
  onViewAll
}) => {
  // Take top 3 latest items
  const topArticles = articles.slice(0, 3);

  return (
    <section id="informasi" className="py-20 bg-white border-t border-slate-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#073B75] tracking-tight font-display">
            Informasi
          </h2>
          <div className="w-12 h-1 bg-[#0284C7] mx-auto mt-3 rounded-full" />
          <p className="text-xs sm:text-sm text-slate-500 mt-2 font-medium">
            Artikel, Berita &amp; Kegiatan Pengadaan Barang/Jasa
          </p>
        </div>

        {/* 3 Columns Grid matching Image 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {topArticles.map((item) => (
            <article
              key={item.id}
              onClick={() => onSelectArticle(item.slug)}
              className="group flex flex-col bg-white rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1.5"
            >
              {/* Featured Image (Object-Contain to preserve entire infographic/photo) */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 rounded-lg shadow-sm flex items-center justify-center p-1 border border-slate-200/60">
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

              {/* Date Box + Title layout (Exact match with reference image) */}
              <div className="pt-5 flex items-start gap-4">
                {/* Date Badge Box */}
                <div className="flex-shrink-0 w-14 h-14 border-2 border-slate-300/90 rounded-md flex flex-col items-center justify-center text-center bg-slate-50/50 group-hover:border-[#073B75] group-hover:bg-blue-50/40 transition-colors">
                  <span className="text-lg font-black text-slate-800 group-hover:text-[#073B75] leading-none">
                    {item.day}
                  </span>
                  <span className="text-[10px] font-bold uppercase text-slate-500 group-hover:text-[#073B75] tracking-wider mt-0.5">
                    {item.month}
                  </span>
                </div>

                {/* Title and accent bar */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-[#073B75] group-hover:text-[#0284C7] leading-snug line-clamp-3 transition-colors">
                    {item.title}
                  </h3>
                  {/* Dark Blue Underline Bar */}
                  <div className="w-9 h-1 bg-[#073B75] mt-3 group-hover:w-16 group-hover:bg-[#0284C7] transition-all duration-300" />
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Center Button: "Lihat Semua Informasi" */}
        <div className="mt-14 text-center">
          <button
            onClick={onViewAll}
            className="inline-flex items-center gap-2 px-7 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs sm:text-sm font-semibold rounded-md transition-all shadow-xs hover:shadow cursor-pointer"
          >
            <span>Lihat Semua Informasi</span>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </div>
    </section>
  );
};
