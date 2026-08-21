import React, { useState, useEffect, useRef } from 'react';
import { InformationItem, ArticleComment } from '../types';
import { 
  Lock, Key, LogOut, Plus, Edit2, Trash2, Eye, EyeOff,
  Check, X, FileText, ArrowLeft, Image as ImageIcon,
  MessageSquare, User, Calendar, RefreshCw, Shield,
  Upload, FileUp, Sparkles, AlertCircle, Link as LinkIcon,
  Reply, MessageCircle, Search, Filter, CheckCircle2,
  CornerDownRight, ChevronRight, ShieldCheck, Mail,
  Cloud, Database, Copy, HelpCircle, CheckCircle, ExternalLink
} from 'lucide-react';
import { 
  checkAdminAuth, loginAdmin, logoutAdmin, 
  upsertArticle, deleteArticleById, updateAdminCredentials,
  toggleHideComment, replyToComment, updateCommentReply, deleteComment, deleteCommentReply,
  addArticleComment, syncAdminCredentialsWithCloud
} from '../data/informationData';
import { 
  getSupabaseConfig, saveCustomSupabaseConfig, 
  testSupabaseConnection, syncAllDataToCloudNow, 
  normalizeSupabaseUrl, SUPABASE_SETUP_SQL 
} from '../lib/supabase';
import { WYSIWYGEditor } from './WYSIWYGEditor';

interface AdminCMSProps {
  articles: InformationItem[];
  onRefreshArticles: () => void;
  onCloseAdmin: () => void;
  onPreviewArticle: (slug: string) => void;
}

export const AdminCMS: React.FC<AdminCMSProps> = ({
  articles,
  onRefreshArticles,
  onCloseAdmin,
  onPreviewArticle
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Active Tab: 'articles' or 'comments'
  const [activeTab, setActiveTab] = useState<'articles' | 'comments'>('articles');

  // Comment Moderation Filters & State
  const [commentSearch, setCommentSearch] = useState('');
  const [commentArticleFilter, setCommentArticleFilter] = useState<string>('all');
  const [commentStatusFilter, setCommentStatusFilter] = useState<'all' | 'visible' | 'hidden' | 'unreplied' | 'replied'>('all');
  
  // Reply Form State (for specific comment)
  const [replyingCommentId, setReplyingCommentId] = useState<string | null>(null);
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [replyAuthor, setReplyAuthor] = useState('Admin PT. APN');
  const [replyRole, setReplyRole] = useState('Tim Ahli PBJ');
  const [replyText, setReplyText] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  // Add New Comment Modal State (Admin directly adding a comment)
  const [isAddCommentModalOpen, setIsAddCommentModalOpen] = useState(false);
  const [newCommentTargetArticle, setNewCommentTargetArticle] = useState(articles[0]?.id || '');
  const [newCommentAuthor, setNewCommentAuthor] = useState('');
  const [newCommentEmail, setNewCommentEmail] = useState('');
  const [newCommentBody, setNewCommentBody] = useState('');

  // In-App Confirmation Modal (replaces window.confirm which is blocked in iframes)
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Hapus',
    onConfirm: () => {}
  });

  // Action feedback toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Editing / Creation Modal
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Artikel' as 'Artikel' | 'Berita' | 'Kegiatan',
    author: 'Tim Ahli PT. APN',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80',
    imageCaption: '',
    summary: '',
    content: ''
  });

  // Credential modal
  const [isCredModalOpen, setIsCredModalOpen] = useState(false);
  const [newUsername, setNewUsername] = useState('admin');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [credSuccess, setCredSuccess] = useState(false);
  const [isSavingCreds, setIsSavingCreds] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Cloud Supabase Connection Modal & Sync State
  const [isCloudModalOpen, setIsCloudModalOpen] = useState(false);
  const [cloudUrl, setCloudUrl] = useState(() => getSupabaseConfig().url || 'https://iqaognnflikyxedswmrz.supabase.co');
  const [cloudAnonKey, setCloudAnonKey] = useState(() => getSupabaseConfig().anonKey || '');
  const [showCloudAnonKey, setShowCloudAnonKey] = useState(false);
  const [isCloudConfigured, setIsCloudConfigured] = useState(() => getSupabaseConfig().isConfigured);
  const [cloudTestLoading, setCloudTestLoading] = useState(false);
  const [cloudTestResult, setCloudTestResult] = useState<{ connected: boolean; message: string; tablesFound?: string[] } | null>(null);
  const [cloudSyncLoading, setCloudSyncLoading] = useState(false);
  const [cloudSyncResult, setCloudSyncResult] = useState<{ success: boolean; message: string } | null>(null);
  const [sqlCopied, setSqlCopied] = useState(false);

  useEffect(() => {
    setIsAuthenticated(checkAdminAuth());
    syncAdminCredentialsWithCloud();
    // Test initial connection status silently
    if (getSupabaseConfig().isConfigured) {
      testSupabaseConnection().then((res) => {
        setIsCloudConfigured(res.connected);
      });
    }
  }, []);

  const handleTestAndSaveCloud = async (e: React.FormEvent) => {
    e.preventDefault();
    setCloudTestLoading(true);
    setCloudTestResult(null);
    setCloudSyncResult(null);

    const formattedUrl = normalizeSupabaseUrl(cloudUrl);
    setCloudUrl(formattedUrl);

    const saved = saveCustomSupabaseConfig(formattedUrl, cloudAnonKey);
    if (!saved) {
      setCloudTestLoading(false);
      setCloudTestResult({ connected: false, message: 'Gagal menyimpan konfigurasi ke browser.' });
      return;
    }

    const res = await testSupabaseConnection();
    setCloudTestLoading(false);
    setCloudTestResult(res);
    setIsCloudConfigured(getSupabaseConfig().isConfigured && res.connected);

    if (res.connected) {
      showToast('Koneksi Supabase berhasil diverifikasi!');
    }
  };

  const handleSyncAllToCloud = async () => {
    setCloudSyncLoading(true);
    setCloudSyncResult(null);
    const savedUser = localStorage.getItem('apn_custom_admin_user') || 'admin';
    const savedPass = localStorage.getItem('apn_custom_admin_pass') || 'apn2026';
    
    const res = await syncAllDataToCloudNow(articles, savedUser, savedPass);
    setCloudSyncLoading(false);
    setCloudSyncResult(res);

    if (res.success) {
      showToast('Sinkronisasi cloud berhasil!');
      onRefreshArticles();
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SETUP_SQL);
    setSqlCopied(true);
    setTimeout(() => setSqlCopied(false), 2500);
    showToast('SQL Setup berhasil disalin!');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');
    try {
      const ok = await loginAdmin(username, password);
      if (ok) {
        setIsAuthenticated(true);
        setLoginError('');
      } else {
        setLoginError('Username atau Password yang Anda masukkan salah.');
      }
    } catch {
      setLoginError('Terjadi kesalahan saat memverifikasi login.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    setIsAuthenticated(false);
  };

  // Image Upload with Automatic Resizing and Optimization
  const handleProcessImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih file gambar yang valid (JPG, PNG, WebP).');
      return;
    }

    setIsResizing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        // Auto-scale keeping aspect ratio
        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setFormData((prev) => ({
            ...prev,
            imageUrl: optimizedDataUrl
          }));
        }
        setIsResizing(false);
      };
      img.onerror = () => {
        setIsResizing(false);
        alert('Gagal memproses gambar. Silakan coba file lain.');
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleDropImage = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProcessImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setShowUrlInput(false);
    setFormData({
      title: '',
      category: 'Artikel',
      author: 'Tim Ahli PT. APN',
      imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80',
      imageCaption: '',
      summary: '',
      content: ''
    });
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (item: InformationItem) => {
    setEditingId(item.id);
    setShowUrlInput(false);
    setFormData({
      title: item.title,
      category: item.category,
      author: item.author,
      imageUrl: item.imageUrl,
      imageCaption: item.imageCaption || '',
      summary: item.summary,
      content: item.content
    });
    setIsEditorOpen(true);
  };

  const handleDelete = (id: string, title: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Hapus Publikasi / Artikel',
      message: `Apakah Anda yakin ingin menghapus artikel "${title}" beserta seluruh datanya? Tindakan ini permanen.`,
      confirmText: 'Ya, Hapus Artikel',
      onConfirm: async () => {
        await deleteArticleById(id);
        onRefreshArticles();
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        showToast(`Artikel "${title}" berhasil dihapus.`);
      }
    });
  };

  const [isSavingArticle, setIsSavingArticle] = useState(false);

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || isSavingArticle) return;

    setIsSavingArticle(true);
    try {
      await upsertArticle({
        id: editingId || undefined,
        title: formData.title,
        category: formData.category,
        author: formData.author,
        readTime: '4 min',
        imageUrl: formData.imageUrl,
        imageCaption: formData.imageCaption,
        summary: formData.summary || formData.content.replace(/<[^>]*>/g, '').slice(0, 180) + '...',
        content: formData.content
      });

      setIsEditorOpen(false);
      onRefreshArticles();
      showToast(editingId ? 'Perubahan artikel berhasil disimpan.' : 'Artikel baru berhasil dipublikasikan.');
    } catch (err) {
      console.error('Save error:', err);
      showToast('Terjadi kendala saat menyimpan. Perubahan tetap disimpan di browser.');
      setIsEditorOpen(false);
      onRefreshArticles();
    } finally {
      setIsSavingArticle(false);
    }
  };

  const handleSaveCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) return;
    setIsSavingCreds(true);
    const synced = await updateAdminCredentials(newUsername, newPassword);
    setIsSavingCreds(false);
    setCredSuccess(true);
    setTimeout(() => {
      setCredSuccess(false);
      setIsCredModalOpen(false);
      showToast(synced ? 'Kredensial login berhasil diperbarui & tersinkronisasi ke Cloud Supabase!' : 'Kredensial login berhasil diperbarui secara lokal!');
    }, 1500);
  };

  // Comment Actions
  const handleToggleHide = async (articleId: string, commentId: string) => {
    await toggleHideComment(articleId, commentId);
    onRefreshArticles();
    showToast('Status tampilan komentar diperbarui.');
  };

  const handleDeleteComment = (articleId: string, commentId: string, authorName: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Hapus Komentar',
      message: `Apakah Anda yakin ingin menghapus komentar dari "${authorName}" secara permanen?`,
      confirmText: 'Ya, Hapus Komentar',
      onConfirm: async () => {
        await deleteComment(articleId, commentId);
        onRefreshArticles();
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        showToast(`Komentar dari "${authorName}" berhasil dihapus.`);
      }
    });
  };

  const handleStartReply = (commentId: string) => {
    setReplyingCommentId(commentId);
    setEditingReplyId(null);
    setReplyAuthor('Admin PT. APN');
    setReplyRole('Tim Ahli PBJ');
    setReplyText('');
  };

  const handleStartEditReply = (commentId: string, reply: { id: string; authorName: string; role?: string; comment: string }) => {
    setReplyingCommentId(commentId);
    setEditingReplyId(reply.id);
    setReplyAuthor(reply.authorName || 'Admin PT. APN');
    setReplyRole(reply.role || 'Tim Ahli PBJ');
    setReplyText(reply.comment || '');
  };

  const handleSubmitReply = async (articleId: string, commentId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || isSubmittingReply) return;

    setIsSubmittingReply(true);
    try {
      if (editingReplyId) {
        await updateCommentReply(articleId, commentId, editingReplyId, replyText, replyAuthor, replyRole);
        showToast('Tanggapan resmi admin berhasil diperbarui.');
      } else {
        await replyToComment(articleId, commentId, replyText, replyAuthor, replyRole);
        showToast('Balasan resmi admin berhasil dikirim.');
      }

      setReplyingCommentId(null);
      setEditingReplyId(null);
      setReplyText('');
      onRefreshArticles();
    } catch (err) {
      console.error('Error submitting reply:', err);
      showToast('Tanggapan berhasil disimpan secara lokal.');
      setReplyingCommentId(null);
      setEditingReplyId(null);
      setReplyText('');
      onRefreshArticles();
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleDeleteReply = (articleId: string, commentId: string, replyId: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Hapus Tanggapan Admin',
      message: 'Apakah Anda yakin ingin menghapus balasan resmi admin ini? Tanggapan akan segera dihapus.',
      confirmText: 'Ya, Hapus Balasan',
      onConfirm: async () => {
        await deleteCommentReply(articleId, commentId, replyId);
        onRefreshArticles();
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        showToast('Tanggapan admin berhasil dihapus.');
      }
    });
  };

  const handleAddDirectComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentTargetArticle || !newCommentAuthor.trim() || !newCommentEmail.trim() || !newCommentBody.trim()) return;

    await addArticleComment(newCommentTargetArticle, newCommentAuthor, newCommentEmail, newCommentBody);
    onRefreshArticles();
    setIsAddCommentModalOpen(false);
    setNewCommentAuthor('');
    setNewCommentEmail('');
    setNewCommentBody('');
    showToast('Komentar baru berhasil ditambahkan.');
  };

  // Compile all comments across all articles
  const allCommentsWithArticle = articles.flatMap((art) => 
    (art.comments || []).map((cmt) => ({
      ...cmt,
      articleId: art.id,
      articleTitle: art.title,
      articleSlug: art.slug,
      articleCategory: art.category
    }))
  );

  const totalCommentsCount = allCommentsWithArticle.length;
  const hiddenCommentsCount = allCommentsWithArticle.filter((c) => c.isHidden).length;
  const visibleCommentsCount = allCommentsWithArticle.filter((c) => !c.isHidden).length;
  const unrepliedCommentsCount = allCommentsWithArticle.filter((c) => !c.replies || c.replies.length === 0).length;

  // Filtered comments list
  const filteredComments = allCommentsWithArticle.filter((item) => {
    const matchesSearch =
      item.authorName.toLowerCase().includes(commentSearch.toLowerCase()) ||
      item.email.toLowerCase().includes(commentSearch.toLowerCase()) ||
      item.comment.toLowerCase().includes(commentSearch.toLowerCase()) ||
      item.articleTitle.toLowerCase().includes(commentSearch.toLowerCase());

    const matchesArticle = commentArticleFilter === 'all' || item.articleId === commentArticleFilter;

    let matchesStatus = true;
    if (commentStatusFilter === 'visible') matchesStatus = !item.isHidden;
    if (commentStatusFilter === 'hidden') matchesStatus = !!item.isHidden;
    if (commentStatusFilter === 'unreplied') matchesStatus = !item.replies || item.replies.length === 0;
    if (commentStatusFilter === 'replied') matchesStatus = !!item.replies && item.replies.length > 0;

    return matchesSearch && matchesArticle && matchesStatus;
  });

  // Image Presets
  const imagePresets = [
    { label: 'Bimtek / Pelatihan', url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Rapat / Diskusi MoU', url: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Proyek Konstruksi', url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Sistem Digital SPSE', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Legal / Kontrak Hukum', url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80' },
  ];

  // 1. Login View if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[#073B75] border border-blue-400/30 flex items-center justify-center mx-auto mb-4 text-white shadow-lg">
              <Shield className="w-7 h-7 text-orange-400" />
            </div>
            <h2 className="text-xl font-bold font-display">Portal Admin CMS</h2>
            <p className="text-xs text-slate-400 mt-1">
              Pengelolaan Informasi, Artikel, Berita &amp; Moderasi Komentar PT. APN
            </p>
          </div>

          {loginError && (
            <div className="mb-5 p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-300 text-xs font-semibold text-center">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Masukkan username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition cursor-pointer p-1"
                  title={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 bg-[#073B75] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg transition mt-4 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi Akun...</span>
                </>
              ) : (
                <span>Masuk ke Panel Admin</span>
              )}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-slate-700/60 text-center">
            <button
              onClick={onCloseAdmin}
              className="text-xs text-slate-400 hover:text-white transition flex items-center justify-center gap-1.5 mx-auto"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Website Utama</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Dashboard View if authenticated
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      {/* Top Admin Bar */}
      <header className="bg-[#051E3C] text-white border-b border-blue-900 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white font-bold text-xs shadow-xs">
              CMS
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight">Admin Portal • Informasi &amp; Komentar</h1>
              <span className="text-[10px] text-slate-400">PT. Agen Pengadaan Nasional</span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setActiveTab('articles')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'articles'
                  ? 'bg-[#073B75] text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Publikasi ({articles.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('comments')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'comments'
                  ? 'bg-[#073B75] text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
              <span>Kelola Komentar</span>
              <span className="px-1.5 py-0.2 bg-amber-500/30 text-amber-300 text-[10px] rounded-full font-bold">
                {totalCommentsCount}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCredModalOpen(true)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 cursor-pointer"
            >
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Ganti Password</span>
            </button>

            <button
              onClick={onCloseAdmin}
              className="px-3 py-1.5 bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Lihat Website</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-lg transition cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* TAB 1: ARTICLES MANAGEMENT */}
        {activeTab === 'articles' && (
          <div className="space-y-6">
            {/* Actions bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-display">Daftar Publikasi ({articles.length})</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tambah, sunting, dan kelola artikel, siaran pers, dan dokumentasi kegiatan pengadaan.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={onRefreshArticles}
                  className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer"
                  title="Refresh Data"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>

                <button
                  onClick={handleOpenCreate}
                  className="px-4 py-2.5 bg-[#073B75] hover:bg-[#052C59] text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Informasi Baru</span>
                </button>
              </div>
            </div>

            {/* Table of Articles */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
                    <tr>
                      <th className="py-3.5 px-4">Informasi / Judul</th>
                      <th className="py-3.5 px-4">Kategori</th>
                      <th className="py-3.5 px-4">Penulis &amp; Tanggal</th>
                      <th className="py-3.5 px-4 text-center">Views</th>
                      <th className="py-3.5 px-4 text-center">Komentar</th>
                      <th className="py-3.5 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {articles.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                              <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 line-clamp-1 max-w-xs sm:max-w-md">
                                {item.title}
                              </div>
                              <span className="text-[11px] text-slate-400 font-mono">
                                /{item.slug}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                            item.category === 'Artikel'
                              ? 'bg-blue-50 text-blue-700'
                              : item.category === 'Berita'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}>
                            {item.category}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-semibold text-slate-800">{item.author}</div>
                          <div className="text-[11px] text-slate-400">{item.date}</div>
                        </td>
                        <td className="py-4 px-4 text-center font-bold text-slate-700">
                          {item.postViews || 0}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <button
                            onClick={() => {
                              setCommentArticleFilter(item.id);
                              setActiveTab('comments');
                            }}
                            className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-[#073B75] rounded-full font-bold text-[11px] transition flex items-center justify-center gap-1 mx-auto cursor-pointer"
                            title="Kelola komentar untuk artikel ini"
                          >
                            <MessageSquare className="w-3 h-3 text-[#073B75]" />
                            <span>{item.comments?.length || 0}</span>
                          </button>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => onPreviewArticle(item.slug)}
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition cursor-pointer"
                              title="Lihat Pratinjau"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenEdit(item)}
                              className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition cursor-pointer"
                              title="Edit Artikel"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id, item.title)}
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition cursor-pointer"
                              title="Hapus Artikel"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COMMENT MODERATION (HIDE, REPLY, DELETE) */}
        {activeTab === 'comments' && (
          <div className="space-y-6">
            {/* Header & Stats Cards */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-[#073B75]" />
                    <span>Moderasi &amp; Manajemen Komentar</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Saring tanggapan pembaca, sembunyikan komentar tidak pantas (Hide), dan berikan balasan resmi tim APN.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setNewCommentTargetArticle(articles[0]?.id || '');
                      setNewCommentAuthor('');
                      setNewCommentEmail('');
                      setNewCommentBody('');
                      setIsAddCommentModalOpen(true);
                    }}
                    className="px-3.5 py-2 bg-[#073B75] hover:bg-[#052C59] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Komentar</span>
                  </button>

                  <button
                    onClick={onRefreshArticles}
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                    title="Segarkan Data"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span className="hidden sm:inline">Segarkan</span>
                  </button>
                </div>
              </div>

              {/* Quick Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-500">Total Komentar</span>
                  <div className="text-xl font-bold text-slate-900 mt-0.5">{totalCommentsCount}</div>
                </div>
                <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200">
                  <span className="text-[11px] font-semibold text-emerald-700">Ditampilkan (Publik)</span>
                  <div className="text-xl font-bold text-emerald-800 mt-0.5">{visibleCommentsCount}</div>
                </div>
                <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200">
                  <span className="text-[11px] font-semibold text-amber-700">Disembunyikan (Hide)</span>
                  <div className="text-xl font-bold text-amber-800 mt-0.5">{hiddenCommentsCount}</div>
                </div>
                <div className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-200">
                  <span className="text-[11px] font-semibold text-[#073B75]">Menunggu Balasan</span>
                  <div className="text-xl font-bold text-[#073B75] mt-0.5">{unrepliedCommentsCount}</div>
                </div>
              </div>
            </div>

            {/* Search & Filter Toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari pengirim, email, atau isi..."
                  value={commentSearch}
                  onChange={(e) => setCommentSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#073B75] focus:bg-white"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                {/* Filter by Article */}
                <select
                  value={commentArticleFilter}
                  onChange={(e) => setCommentArticleFilter(e.target.value)}
                  className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#073B75] text-slate-700 max-w-xs"
                >
                  <option value="all">Semua Publikasi ({articles.length})</option>
                  {articles.map((art) => (
                    <option key={art.id} value={art.id}>
                      {art.title.length > 35 ? art.title.slice(0, 35) + '...' : art.title} ({art.comments?.length || 0})
                    </option>
                  ))}
                </select>

                {/* Filter by Status */}
                <select
                  value={commentStatusFilter}
                  onChange={(e) => setCommentStatusFilter(e.target.value as any)}
                  className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#073B75] text-slate-700"
                >
                  <option value="all">Semua Status</option>
                  <option value="visible">Ditampilkan (Aktif)</option>
                  <option value="hidden">Disembunyikan (Hide)</option>
                  <option value="unreplied">Belum Dibalas</option>
                  <option value="replied">Sudah Dibalas</option>
                </select>

                {(commentSearch || commentArticleFilter !== 'all' || commentStatusFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setCommentSearch('');
                      setCommentArticleFilter('all');
                      setCommentStatusFilter('all');
                    }}
                    className="px-2.5 py-2 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition cursor-pointer"
                  >
                    Reset Filter
                  </button>
                )}
              </div>
            </div>

            {/* Comments List */}
            {filteredComments.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-slate-700">Tidak ada komentar ditemukan</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Belum ada komentar yang sesuai dengan kriteria pencarian atau filter yang dipilih.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredComments.map((cmt) => (
                  <div
                    key={cmt.id}
                    className={`bg-white rounded-2xl border transition-all duration-200 p-5 shadow-xs space-y-4 ${
                      cmt.isHidden 
                        ? 'border-amber-200 bg-amber-50/20' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {/* Top Row: Article context info + Status Badge */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 font-bold rounded text-[10px] uppercase">
                          {cmt.articleCategory}
                        </span>
                        <span className="font-bold text-[#073B75] line-clamp-1 max-w-md">
                          {cmt.articleTitle}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {cmt.isHidden ? (
                          <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full flex items-center gap-1">
                            <EyeOff className="w-3 h-3 text-amber-600" />
                            <span>Disembunyikan dari Publik</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Ditampilkan (Aktif)</span>
                          </span>
                        )}

                        <button
                          onClick={() => onPreviewArticle(cmt.articleSlug)}
                          className="text-[11px] text-slate-400 hover:text-[#073B75] flex items-center gap-0.5 font-semibold cursor-pointer"
                          title="Buka Pratinjau Artikel"
                        >
                          <span>Buka Artikel</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Middle Row: Commenter Info & Body */}
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-[#073B75]/10 text-[#073B75] font-bold text-sm flex items-center justify-center flex-shrink-0">
                        {cmt.authorName.charAt(0).toUpperCase()}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <span className="font-bold text-slate-900 text-sm">{cmt.authorName}</span>
                            <span className="text-xs text-slate-400 ml-2 font-mono">{cmt.email}</span>
                          </div>
                          <span className="text-[11px] text-slate-400">{cmt.createdAt}</span>
                        </div>

                        <p className="text-xs text-slate-700 leading-relaxed mt-2 p-3 bg-slate-50/80 rounded-xl border border-slate-100">
                          {cmt.comment}
                        </p>
                      </div>
                    </div>

                    {/* Existing Admin Replies */}
                    {cmt.replies && cmt.replies.length > 0 && (
                      <div className="ml-13 space-y-2.5 pt-1">
                        {cmt.replies.map((r) => (
                          <div
                            key={r.id}
                            className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-xl text-xs space-y-1.5"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-[#073B75]" />
                                <span className="font-bold text-[#073B75] text-xs">
                                  {r.authorName}
                                </span>
                                <span className="px-1.5 py-0.5 bg-[#073B75] text-white text-[9px] font-bold rounded">
                                  {r.role || 'Admin APN'}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] text-slate-400">{r.createdAt}</span>
                                
                                {/* Edit Reply Button */}
                                <button
                                  type="button"
                                  onClick={() => handleStartEditReply(cmt.id, r)}
                                  className="px-2 py-1 bg-white hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-md transition cursor-pointer flex items-center gap-1 text-[11px] font-bold"
                                  title="Edit balasan resmi admin ini"
                                >
                                  <Edit2 className="w-3 h-3 text-blue-600" />
                                  <span>Edit</span>
                                </button>

                                {/* Delete Reply Button */}
                                <button
                                  type="button"
                                  onClick={() => handleDeleteReply(cmt.articleId, cmt.id, r.id)}
                                  className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition cursor-pointer"
                                  title="Hapus tanggapan admin ini"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            <p className="text-slate-700 text-xs leading-relaxed pl-6">
                              {r.comment}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Inline Reply / Edit Form */}
                    {replyingCommentId === cmt.id && (
                      <form
                        onSubmit={(e) => handleSubmitReply(cmt.articleId, cmt.id, e)}
                        className="ml-13 p-4 bg-slate-50 border border-blue-200 rounded-xl space-y-3 mt-3 shadow-inner animate-fadeIn"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#073B75] flex items-center gap-1.5">
                            {editingReplyId ? (
                              <>
                                <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                                <span>Edit Tanggapan Resmi Tim APN:</span>
                              </>
                            ) : (
                              <>
                                <Reply className="w-3.5 h-3.5 text-orange-500" />
                                <span>Tulis Balasan Resmi Tim APN:</span>
                              </>
                            )}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setReplyingCommentId(null);
                              setEditingReplyId(null);
                            }}
                            className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">
                              Nama Penjawab
                            </label>
                            <input
                              type="text"
                              value={replyAuthor}
                              onChange={(e) => setReplyAuthor(e.target.value)}
                              placeholder="Admin PT. APN"
                              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#073B75]"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">
                              Jabatan / Peran
                            </label>
                            <input
                              type="text"
                              value={replyRole}
                              onChange={(e) => setReplyRole(e.target.value)}
                              placeholder="Tim Ahli Pengadaan"
                              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#073B75]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">
                            Isi Tanggapan / Jawaban *
                          </label>
                          <textarea
                            required
                            rows={3}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Tuliskan jawaban atau penjelasan resmi di sini..."
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#073B75]"
                          />
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              setReplyingCommentId(null);
                              setEditingReplyId(null);
                            }}
                            className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg font-semibold cursor-pointer"
                          >
                            Batal
                          </button>
                          <button
                            type="submit"
                            disabled={isSubmittingReply}
                            className="px-4 py-1.5 bg-[#073B75] hover:bg-[#052C59] disabled:bg-slate-400 text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
                          >
                            {isSubmittingReply ? (
                              <>
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                <span>Menyimpan...</span>
                              </>
                            ) : editingReplyId ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Simpan Perubahan Tanggapan</span>
                              </>
                            ) : (
                              <>
                                <Reply className="w-3.5 h-3.5" />
                                <span>Kirim Balasan</span>
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Bottom Action Buttons for Comment */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        {/* Toggle Hide / Unhide button */}
                        <button
                          type="button"
                          onClick={() => handleToggleHide(cmt.articleId, cmt.id)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                            cmt.isHidden
                              ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {cmt.isHidden ? (
                            <>
                              <Eye className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Tampilkan ke Publik</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3.5 h-3.5 text-amber-600" />
                              <span>Sembunyikan (Hide)</span>
                            </>
                          )}
                        </button>

                        {/* Reply or Edit Reply button (Only 1 reply allowed per comment) */}
                        {cmt.replies && cmt.replies.length > 0 ? (
                          <button
                            type="button"
                            onClick={() => handleStartEditReply(cmt.id, cmt.replies![0])}
                            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg border border-blue-200 transition flex items-center gap-1.5 cursor-pointer"
                            title="Edit tanggapan resmi yang sudah ada"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                            <span>Edit Tanggapan</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleStartReply(cmt.id)}
                            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#073B75] text-xs font-bold rounded-lg border border-blue-200 transition flex items-center gap-1.5 cursor-pointer"
                          >
                            <Reply className="w-3.5 h-3.5" />
                            <span>Balas Komentar</span>
                          </button>
                        )}
                      </div>

                      {/* Delete button */}
                      <button
                        type="button"
                        onClick={() => handleDeleteComment(cmt.articleId, cmt.id, cmt.authorName)}
                        className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-lg border border-rose-200 transition flex items-center gap-1.5 cursor-pointer"
                        title="Hapus Komentar Secara Permanen"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Editor Modal (Create / Edit) */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#073B75] font-display flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-500" />
                <span>{editingId ? 'Edit Informasi' : 'Tambah Informasi Baru'}</span>
              </h3>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Judul Informasi / Artikel *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: Optimalisasi Proses Pengadaan PBJ..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#073B75] focus:bg-white"
                />
              </div>

              {/* 2-Column: Kategori & Penulis */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kategori *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#073B75] focus:bg-white"
                  >
                    <option value="Artikel">Artikel</option>
                    <option value="Berita">Berita</option>
                    <option value="Kegiatan">Kegiatan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Penulis *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="Adv. M. Erwin Syahroni, S.H."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#073B75] focus:bg-white"
                  />
                </div>
              </div>

              {/* Foto Sampul: Upload Gambar dengan Penyesuaian Ukuran Otomatis */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Foto Sampul / Infografis Kegiatan
                  </label>
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-500" />
                    <span>Auto-Resize &amp; Bebas Terpotong</span>
                  </span>
                </div>

                {/* Info Panduan Dimensi Gambar */}
                <div className="mb-2.5 p-2.5 bg-blue-50/70 border border-blue-100 rounded-xl text-[11px] text-slate-600 flex items-start gap-2 leading-relaxed">
                  <AlertCircle className="w-4 h-4 text-[#073B75] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#073B75]">Panduan Dimensi Foto:</span>
                    <ul className="list-disc pl-4 mt-0.5 space-y-0.5 text-slate-600">
                      <li><strong>Foto Lanskap Standar:</strong> Dianjurkan <strong>1200 × 675 px (16:9)</strong> atau <strong>1200 × 800 px (3:2)</strong>.</li>
                      <li><strong>Infografis / Poster:</strong> Bebas ukuran. Sistem otomatis mengoptimalkan kualitas tanpa memotong (crop) bagian atas/bawah.</li>
                    </ul>
                  </div>
                </div>

                {/* Hidden File Input for Direct Upload */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={(e) => e.target.files?.[0] && handleProcessImageFile(e.target.files[0])}
                  className="hidden"
                />

                {/* Main Upload Dropzone & Preview Box */}
                {formData.imageUrl ? (
                  <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/80 space-y-3">
                    <div className="relative w-full max-h-56 rounded-lg overflow-hidden border border-slate-200 bg-slate-900 shadow-inner flex items-center justify-center p-1 group">
                      <img
                        src={formData.imageUrl}
                        alt="Preview Foto Sampul"
                        className="max-h-52 w-auto max-w-full object-contain rounded-sm"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition flex items-end justify-between p-3 text-white pointer-events-none">
                        <span className="text-[11px] font-semibold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          Foto Utuh Siap Dipublikasikan
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-1.5 bg-[#073B75] hover:bg-[#052C59] text-white text-xs font-bold rounded-lg shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Ganti Foto dari Perangkat</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, imageUrl: '' })}
                          className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-lg border border-rose-200 transition flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3 text-rose-600" />
                          <span>Hapus</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowUrlInput(!showUrlInput)}
                        className="text-[11px] text-slate-500 hover:text-slate-700 underline font-medium cursor-pointer"
                      >
                        {showUrlInput ? 'Tutup Pilihan URL' : 'Gunakan URL / Preset'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDropImage}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition flex flex-col items-center justify-center ${
                      isDragging 
                        ? 'border-[#073B75] bg-blue-50/70 scale-[0.99]' 
                        : 'border-slate-300 hover:border-[#073B75] bg-slate-50 hover:bg-white'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-blue-100/70 text-[#073B75] flex items-center justify-center mb-3 shadow-inner">
                      {isResizing ? (
                        <RefreshCw className="w-6 h-6 animate-spin text-[#073B75]" />
                      ) : (
                        <FileUp className="w-6 h-6" />
                      )}
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-slate-800">
                      {isResizing ? 'Sedang Memproses & Menyesuaikan Ukuran...' : 'Upload Foto Sampul / Infografis'}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1 max-w-sm">
                      Seret gambar ke sini atau <span className="text-[#073B75] font-semibold underline">klik untuk memilih file</span> (JPG, PNG, WebP).
                    </p>
                    <div className="mt-3 px-2.5 py-1 bg-white border border-slate-200 rounded-full text-[10px] text-slate-500 font-medium flex items-center gap-1.5 shadow-2xs">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>Sistem otomatis menyesuaikan resolusi &amp; menjaga aspek rasio utuh</span>
                    </div>
                  </div>
                )}

                {/* Optional URL or Preset Picker */}
                {(showUrlInput || !formData.imageUrl) && (
                  <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                    <div className="flex items-center gap-2">
                      <LinkIcon className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <input
                        type="url"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        placeholder="Atau tempel URL gambar: https://..."
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-[#073B75] focus:outline-none"
                      />
                    </div>

                    {/* Preset image suggestions */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] text-slate-400 font-semibold">Preset Cepat:</span>
                      {imagePresets.map((preset, pIdx) => (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => setFormData({ ...formData, imageUrl: preset.url })}
                          className="px-2 py-0.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-600 rounded text-[10px] font-medium transition cursor-pointer"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Keterangan Foto (Caption)
                </label>
                <input
                  type="text"
                  value={formData.imageCaption}
                  onChange={(e) => setFormData({ ...formData, imageCaption: e.target.value })}
                  placeholder="Contoh: Dokumentasi kegiatan pendampingan PBJ bersama Tim Pokja..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#073B75] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ringkasan Singkat (Excerpt)
                </label>
                <textarea
                  rows={2}
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="Deskripsi singkat yang muncul pada kartu preview artikel..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#073B75] focus:bg-white"
                />
              </div>

              {/* Isi Lengkap Artikel dengan WYSIWYG Editor */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Isi Lengkap Artikel *
                  </label>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Editor WYSIWYG (Format Visual &amp; Teks Kaya)
                  </span>
                </div>
                <WYSIWYGEditor
                  value={formData.content}
                  onChange={(html) => setFormData({ ...formData, content: html })}
                  placeholder="Tuliskan isi artikel lengkap di sini dengan format paragraf, sub-judul (H2/H3), poin daftar, kutipan, tautan, dan lainnya..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSavingArticle}
                  className="px-6 py-2.5 bg-[#073B75] hover:bg-[#052C59] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition flex items-center gap-2 disabled:opacity-60"
                >
                  {isSavingArticle && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isSavingArticle ? 'Menyimpan...' : 'Simpan & Publikasikan'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {isCredModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 animate-fadeIn">
            <h3 className="text-sm font-bold text-slate-800 font-display mb-1 flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-500" />
              <span>Ganti Akun &amp; Password Admin</span>
            </h3>
            <p className="text-[11px] text-slate-500 mb-3">
              Perbarui kredensial akun login panel admin. Password baru otomatis tersimpan dan berlaku di seluruh perangkat.
            </p>

            {credSuccess && (
              <div className="mb-3 p-2.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-1.5 border border-emerald-200">
                <Check className="w-4 h-4 text-emerald-600" /> 
                <span>Kredensial berhasil diperbarui!</span>
              </div>
            )}

            <form onSubmit={handleSaveCredentials} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Username Baru</label>
                <input
                  type="text"
                  required
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-[#073B75]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Password Baru</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Ketik password baru..."
                    className="w-full pl-3 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-[#073B75]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer p-1"
                    title={showNewPassword ? 'Sembunyikan password' : 'Lihat password'}
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCredModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 font-semibold cursor-pointer"
                >
                  Tutup
                </button>
                <button
                  type="submit"
                  disabled={isSavingCreds}
                  className="px-4 py-2 bg-[#073B75] hover:bg-[#052C59] text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer transition flex items-center gap-1.5 disabled:opacity-60"
                >
                  {isSavingCreds ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>Simpan Perubahan</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Direct Add Comment Modal (Admin) */}
      {isAddCommentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 font-display">
                <MessageSquare className="w-4 h-4 text-[#073B75]" />
                <span>Tambah Komentar / Ulasan Baru</span>
              </h3>
              <button
                onClick={() => setIsAddCommentModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddDirectComment} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pilih Artikel Target *
                </label>
                <select
                  value={newCommentTargetArticle}
                  onChange={(e) => setNewCommentTargetArticle(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#073B75]"
                >
                  {articles.map((a) => (
                    <option key={a.id} value={a.id}>
                      [{a.category}] {a.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Pengirim / Pembaca *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCommentAuthor}
                    onChange={(e) => setNewCommentAuthor(e.target.value)}
                    placeholder="Nama Lengkap..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#073B75]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Pengirim *
                  </label>
                  <input
                    type="email"
                    required
                    value={newCommentEmail}
                    onChange={(e) => setNewCommentEmail(e.target.value)}
                    placeholder="email@instansi.go.id"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#073B75]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Isi Komentar / Tanggapan *
                </label>
                <textarea
                  required
                  rows={4}
                  value={newCommentBody}
                  onChange={(e) => setNewCommentBody(e.target.value)}
                  placeholder="Tuliskan komentar pembaca di sini..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#073B75]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddCommentModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#073B75] hover:bg-[#052C59] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition"
                >
                  Simpan Komentar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* In-App Confirmation Modal (Guaranteed to work in iframe) */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 animate-fadeIn">
            <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-sm font-bold text-slate-900 text-center font-display mb-1.5">
              {confirmModal.title}
            </h3>

            <p className="text-xs text-slate-600 text-center leading-relaxed mb-6">
              {confirmModal.message}
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmModal.onConfirm}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-sm cursor-pointer transition"
              >
                {confirmModal.confirmText || 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 text-xs font-medium flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
