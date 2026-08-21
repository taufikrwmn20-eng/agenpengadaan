import React, { useState, useEffect } from 'react';
import { InformationItem, ArticleComment } from '../types';
import { 
  BarChart2, User, Clock, Calendar, ArrowLeft, MessageSquare, 
  Send, Share2, Check, ExternalLink, Bookmark
} from 'lucide-react';
import { incrementArticleViews, addArticleComment, getStoredArticles } from '../data/informationData';

interface InformationDetailViewProps {
  slug: string;
  allArticles: InformationItem[];
  onSelectArticle: (slug: string) => void;
  onBackToList: () => void;
  onBackToHome: () => void;
  onRefreshArticles?: () => void;
}

export const InformationDetailView: React.FC<InformationDetailViewProps> = ({
  slug,
  allArticles,
  onSelectArticle,
  onBackToList,
  onBackToHome,
  onRefreshArticles
}) => {
  const article = allArticles.find((a) => a.slug === slug || a.id === slug) || allArticles[0];

  const [views, setViews] = useState(article ? article.postViews : 0);
  const [comments, setComments] = useState<ArticleComment[]>([]);
  
  // Comment Form state
  const [authorName, setAuthorName] = useState('');
  const [email, setEmail] = useState('');
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentSuccess, setCommentSuccess] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Increment views & load freshest comments on load or slug change
  useEffect(() => {
    if (article) {
      const updatedViews = incrementArticleViews(article.id);
      setViews(updatedViews || article.postViews + 1);
      
      // Load current freshest comments directly from stored articles
      const freshArticles = getStoredArticles();
      const current = freshArticles.find((a) => a.id === article.id || a.slug === article.slug);
      setComments(current?.comments || article.comments || []);
      window.scrollTo(0, 0);
    }
  }, [slug, article?.id]);

  if (!article) {
    return (
      <div className="min-h-screen pt-32 pb-20 text-center bg-slate-50">
        <h2 className="text-xl font-bold text-slate-800">Artikel tidak ditemukan</h2>
        <button
          onClick={onBackToList}
          className="mt-4 px-5 py-2 bg-[#073B75] text-white text-xs font-bold rounded-lg cursor-pointer"
        >
          Kembali ke Daftar Informasi
        </button>
      </div>
    );
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !email.trim() || !commentText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    
    try {
      const updated = await addArticleComment(article.id, authorName, email, commentText);
      
      if (updated && updated.comments) {
        setComments([...updated.comments]);
      } else {
        const now = new Date();
        const newCmt: ArticleComment = {
          id: 'cmt-' + Date.now(),
          authorName: authorName.trim(),
          email: email.trim(),
          comment: commentText.trim(),
          createdAt: `${now.getDate()} ${now.toLocaleString('id-ID', { month: 'long' })} ${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`
        };
        setComments((prev) => [newCmt, ...prev]);
      }

      if (onRefreshArticles) {
        onRefreshArticles();
      }

      // Reset input form
      setAuthorName('');
      setEmail('');
      setCommentText('');
      setCommentSuccess(true);
      setTimeout(() => setCommentSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to post comment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    }
  };

  // Related articles
  const relatedArticles = allArticles
    .filter((a) => a.id !== article.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-white text-slate-900 pt-28 md:pt-36 pb-20 animate-fadeIn">
      {/* 1. Breadcrumb Top Bar */}
      <div className="border-b border-slate-100 bg-slate-50/70 py-3 text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] font-medium flex-wrap">
            <button onClick={onBackToHome} className="hover:text-[#073B75] transition cursor-pointer">
              Beranda
            </button>
            <span>/</span>
            <button onClick={onBackToList} className="hover:text-[#073B75] transition cursor-pointer">
              Informasi
            </button>
            <span>/</span>
            <span className="text-[#073B75] font-semibold line-clamp-1 max-w-xs sm:max-w-md">
              {article.title}
            </span>
          </div>

          <button
            onClick={onBackToList}
            className="flex items-center gap-1 text-[#073B75] hover:text-[#0284C7] font-bold text-xs cursor-pointer flex-shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Daftar Informasi</span>
          </button>
        </div>
      </div>

      {/* 2. Main Article Content Container matching Image 3 */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        {/* Post Views Metric (Exact Match with Image 3) */}
        <div className="flex items-center justify-between gap-4 pb-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-100/90 px-3 py-1 rounded-md">
            <BarChart2 className="w-3.5 h-3.5 text-[#073B75]" />
            <span>Post Views: {views}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md transition cursor-pointer"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Tersalin!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-600" />
                  <span>Bagikan</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Article Title (Exact Image 3 Style) */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#073B75] tracking-tight font-display leading-tight mt-2">
          {article.title}
        </h1>

        {/* Author & Date Meta info (Exact Image 3 Style) */}
        <div className="mt-4 pt-3 pb-6 border-b border-slate-100 text-xs sm:text-sm text-slate-500 space-y-1">
          <div>
            Oleh: <strong className="text-slate-800 font-semibold">{article.author}</strong>
          </div>
          <div>
            Tanggal: {article.date}
          </div>
        </div>

        {/* Featured Image with Caption (Supports Full Infographics & Landscape without Cropping) */}
        <div className="my-8">
          <div className="rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 shadow-sm flex items-center justify-center p-1 sm:p-2">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-auto max-h-[720px] object-contain rounded-xl"
            />
          </div>
          {article.imageCaption && (
            <p className="text-xs text-slate-500 italic mt-2.5 px-1 leading-relaxed text-center sm:text-left">
              {article.imageCaption}
            </p>
          )}
        </div>

        {/* Formatted Article Body (Supports Rich WYSIWYG HTML & Plain Markdown) */}
        <div className="article-body prose prose-slate max-w-none text-sm sm:text-base text-slate-700 leading-relaxed space-y-4">
          {(() => {
            // Unescape entities if HTML was stored as escaped text
            let processedContent = article.content || '';
            if (processedContent.includes('&lt;h') || processedContent.includes('&lt;p') || processedContent.includes('&lt;div')) {
              processedContent = processedContent
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'")
                .replace(/&amp;/g, '&');
            }

            const isHtml = /<\/?(p|div|h[1-6]|ul|ol|li|blockquote|span|strong|em|b|i|br|table|a|hr|section)\b/i.test(processedContent);

            if (isHtml) {
              return (
                <div 
                  className="rich-text-content space-y-4 text-slate-700 leading-relaxed [&>h2]:text-xl sm:[&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-[#073B75] [&>h2]:mt-8 [&>h2]:mb-3 [&>h2]:font-display [&>h3]:text-lg sm:[&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-[#073B75] [&>h3]:mt-6 [&>h3]:mb-2 [&>h3]:font-display [&>p]:leading-relaxed [&>p]:text-slate-700 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-2 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:space-y-2 [&>blockquote]:border-l-4 [&>blockquote]:border-[#073B75] [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-slate-600 [&>blockquote]:bg-blue-50/50 [&>blockquote]:py-2 [&>blockquote]:rounded-r-lg [&>blockquote]:my-4 [&>a]:text-[#0284C7] [&>a]:underline [&>a]:font-semibold [&>hr]:border-slate-200 [&>hr]:my-6"
                  dangerouslySetInnerHTML={{ __html: processedContent }} 
                />
              );
            }

            // Fallback for markdown-style text
            return processedContent.split('\n\n').map((paragraph, index) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={index} className="text-lg sm:text-xl font-bold text-[#073B75] mt-6 mb-3 font-display">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={index} className="text-xl sm:text-2xl font-bold text-[#073B75] mt-8 mb-3 font-display">
                    {paragraph.replace('## ', '')}
                  </h2>
                );
              }
              if (paragraph.startsWith('1. ') || paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
                const lines = paragraph.split('\n');
                return (
                  <ul key={index} className="space-y-2 pl-4 list-disc marker:text-[#073B75] my-4">
                    {lines.map((line, lIdx) => (
                      <li key={lIdx} className="text-slate-700">
                        {line.replace(/^[0-9]+\.\s+/, '').replace(/^[-*]\s+/, '')}
                      </li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={index} className="text-slate-700 leading-relaxed">
                  {paragraph}
                </p>
              );
            });
          })()}
        </div>

        {/* 3. Interactive Comment Section */}
        <div className="mt-16 pt-10 border-t-2 border-slate-100">
          {(() => {
            const visibleComments = comments.filter((c) => !c.isHidden);
            return (
              <>
                <div className="flex items-center gap-2 mb-8">
                  <MessageSquare className="w-5 h-5 text-[#073B75]" />
                  <h3 className="text-xl font-bold text-[#073B75] font-display">
                    Komentar ({visibleComments.length})
                  </h3>
                </div>

                {/* Comment Form */}
                <div className="bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200 mb-10">
                  <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">
                    Tinggalkan Komentar
                  </h4>
                  <p className="text-xs text-slate-500 mb-5">
                    Alamat email Anda tidak akan dipublikasikan. Ruas yang wajib ditandai *
                  </p>

                  {commentSuccess && (
                    <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-lg flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Komentar Anda telah berhasil dipublikasikan!</span>
                    </div>
                  )}

                  <form onSubmit={handleCommentSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Nama Lengkap *
                        </label>
                        <input
                          type="text"
                          required
                          value={authorName}
                          onChange={(e) => setAuthorName(e.target.value)}
                          placeholder="Masukkan nama Anda"
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-[#073B75] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Alamat Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="nama@instansi.go.id"
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-[#073B75] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Isi Komentar *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Tuliskan tanggapan, pertanyaan, atau pandangan Anda terkait topik ini..."
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-[#073B75] focus:outline-none"
                      />
                    </div>

                    <div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2.5 bg-[#073B75] hover:bg-[#052C59] text-white text-xs font-bold rounded-lg shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{isSubmitting ? 'Mengirim...' : 'Kirim Komentar'}</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* Comments List */}
                <div className="space-y-4">
                  {visibleComments.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">
                      Belum ada komentar untuk artikel ini. Jadilah yang pertama memberikan tanggapan!
                    </p>
                  ) : (
                    visibleComments.map((cmt) => (
                      <div
                        key={cmt.id}
                        className="p-5 bg-white border border-slate-200 rounded-xl space-y-3 shadow-2xs"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-[#073B75]/10 text-[#073B75] font-bold text-xs flex items-center justify-center">
                              {cmt.authorName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h5 className="text-xs font-bold text-slate-900">{cmt.authorName}</h5>
                              <span className="text-[10px] text-slate-400">{cmt.createdAt}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed pl-10">
                          {cmt.comment}
                        </p>

                        {/* Admin Responses / Replies */}
                        {cmt.replies && cmt.replies.length > 0 && (
                          <div className="ml-10 mt-3 pt-3 border-t border-slate-100 space-y-2.5">
                            {cmt.replies.map((reply) => (
                              <div
                                key={reply.id}
                                className="p-3.5 bg-blue-50/60 border border-blue-100 rounded-xl text-xs space-y-1.5"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <div className="w-5 h-5 rounded-full bg-[#073B75] text-white flex items-center justify-center text-[10px] font-bold">
                                      ✓
                                    </div>
                                    <span className="font-bold text-[#073B75] text-xs">
                                      {reply.authorName}
                                    </span>
                                    <span className="px-1.5 py-0.5 bg-[#073B75] text-white text-[9px] font-bold rounded">
                                      {reply.role || 'Admin'}
                                    </span>
                                  </div>
                                  <span className="text-[10px] text-slate-400">
                                    {reply.createdAt}
                                  </span>
                                </div>
                                <p className="text-slate-700 text-xs leading-relaxed pl-6">
                                  {reply.comment}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </>
            );
          })()}
        </div>

        {/* 4. Related Posts Section */}
        {relatedArticles.length > 0 && (
          <div className="mt-16 pt-10 border-t border-slate-200">
            <h4 className="text-lg font-bold text-[#073B75] font-display mb-6">
              Informasi Lainnya
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedArticles.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onSelectArticle(rel.slug)}
                  className="group cursor-pointer bg-slate-50 rounded-xl p-3 border border-slate-100 hover:border-slate-300 transition"
                >
                  <div className="aspect-[16/10] rounded-lg overflow-hidden mb-3 bg-slate-200 flex items-center justify-center p-1 border border-slate-200">
                    <img
                      src={rel.imageUrl}
                      alt={rel.title}
                      className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-orange-600 uppercase">
                    {rel.category}
                  </span>
                  <h5 className="text-xs font-bold text-slate-800 group-hover:text-[#073B75] line-clamp-2 mt-1">
                    {rel.title}
                  </h5>
                  <span className="text-[10px] text-slate-400 mt-2 block">
                    {rel.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="mt-12 text-center pt-8 border-t border-slate-100">
          <button
            onClick={onBackToList}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Semua Informasi</span>
          </button>
        </div>
      </div>
    </div>
  );
};
