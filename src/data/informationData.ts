import { InformationItem } from '../types';
import { 
  fetchArticlesFromCloud, 
  upsertArticleToCloud, 
  deleteArticleFromCloud, 
  seedAllArticlesToCloud,
  fetchAdminCredentialsFromCloud,
  saveAdminCredentialsToCloud,
  getSupabaseConfig
} from '../lib/supabase';

export const INITIAL_ARTICLES_DATA: InformationItem[] = [
  {
    id: 'artikel-1',
    slug: 'bagaimana-strategi-manajemen-pengadaan-barang-jasa-di-bumd-yang-tepat',
    title: 'Bagaimana Strategi Manajemen Pengadaan Barang/Jasa di BUMD yang Tepat?',
    category: 'Artikel',
    author: 'Saepul Rizal, M.M., CHCM',
    date: '1 Agustus 2024',
    day: '01',
    month: 'AUG',
    readTime: '4 min',
    imageUrl: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'Foto saat sesi konsultasi dan pendampingan penyusunan Peraturan Direksi PBJ BUMD',
    summary: 'Mengelola pengadaan barang/jasa di Badan Usaha Milik Daerah (BUMD) adalah sebuah perjalanan penuh tantangan yang memerlukan strategi dan metode yang komprehensif serta efektif. Sebagai seorang praktisi dan ahli pengadaan barang/jasa, saya akan bercerita pengalaman mendampingi BUMD dalam menyusun fleksibilitas bisnis tanpa melanggar regulasi kepatuhan.',
    content: `Mengelola pengadaan barang/jasa di Badan Usaha Milik Daerah (BUMD) adalah sebuah perjalanan penuh tantangan yang memerlukan strategi dan metode yang komprehensif serta efektif. Sebagai seorang praktisi dan ahli pengadaan barang/jasa, kami sering menjumpai dilema di mana BUMD dituntut untuk bergerak cepat dan lincah secara komersial (business-driven), namun di sisi lain tetap terikat pada prinsip kehati-hatian pengelolaan keuangan daerah.

### Karakteristik Unik Pengadaan BUMD
Berbeda dengan instansi pemerintah murni (K/L/PD) yang sepenuhnya tunduk pada Perpres Pengadaan Pemerintah, BUMD memiliki keleluasaan untuk menyusun **Peraturan Direksi (Perdir)** tersendiri yang mengatur tata cara PBJ BUMD, sepanjang berpedoman pada prinsip efisiensi, transparansi, persaingan sehat, dan akuntabilitas.

Namun, fleksibilitas ini kerap menjadi bumerang apabila regulasi internal tidak disusun secara presisi dan tidak memiliki mitigasi risiko hukum yang memadai.

### 4 Pilar Utama Strategi PBJ BUMD:
1. **Penyusunan Peraturan Direksi (Perdir) & SOP yang Kokoh**: Memastikan seluruh batasan kewenangan, metode pemilihan (tender, seleksi, pengadaan langsung, penunjukan langsung darurat), dan eskalasi persetujuan Direksi/Komisaris tertuang secara tegas dan terukur.
2. **Kertas Kerja HPS & Analisis Pasar Riil**: Menghindari penetapan HPS yang semata-mata mengandalkan brosur atau penawaran formalitas. Pengadaan BUMD harus didukung data intelijen pasar (market intelligence) yang dapat dipertanggungjawabkan.
3. **Penerapan Sistem Vendor Management System (VMS)**: Membangun basis data penyedia terverifikasi (DPT) dengan rekam jejak performa yang jelas guna mempercepat proses pengadaan berkala.
4. **Klausul Kontrak Mitigasi Risiko & Arbitrase**: Mengantisipasi fluktuasi harga komoditas, force majeure, serta klausul penyelesaian sengketa komersial melalui arbitrase (seperti BANI) demi kelangsungan operasional bisnis.

Dengan menerapkan tata kelola pengadaan yang adaptif dan profesional, BUMD tidak hanya mampu memaksimalkan laba dan efisiensi belanja, tetapi juga memberikan rasa aman bagi jajaran Direksi dan pengelola pengadaan dari potensi risiko audit hukum.`,
    postViews: 342,
    createdAt: Date.parse('2024-08-01T08:00:00Z'),
    comments: [
      {
        id: 'c1',
        authorName: 'Hendra Setiawan, S.E.',
        email: 'hendra.bumd@example.com',
        comment: 'Ulasan yang sangat mencerahkan. Fleksibilitas Perdir memang kunci agar BUMD tidak kalah saing dengan swasta murni, namun mitigasi risiko klausul kontrak tetap nomor satu.',
        createdAt: '02 Agustus 2024 09:15 WIB'
      },
      {
        id: 'c2',
        authorName: 'Ratna Kusuma',
        email: 'ratna.k@example.com',
        comment: 'Sangat bermanfaat untuk unit pengadaan kami yang sedang merevisi SOP PBJ. Terima kasih PT. Agen Pengadaan Nasional!',
        createdAt: '03 Agustus 2024 14:30 WIB'
      }
    ]
  },
  {
    id: 'artikel-2',
    slug: 'rahasia-kesuksesan-proyek-konstruksi-memadukan-manajemen-konstruksi-dengan-strategi-pengadaan-efektif',
    title: 'Rahasia Kesuksesan Proyek Konstruksi: Memadukan Manajemen Konstruksi dengan Strategi Pengadaan Efektif',
    category: 'Artikel',
    author: 'Agung Dwijosasongko, S.T., CDMS',
    date: '28 Juni 2024',
    day: '27',
    month: 'JUN',
    readTime: '4 min',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'Foto saat sedang mengisi Workshop Strategi Manajemen Konstruksi & Reviu HPS Terpadu',
    summary: 'Kesuksesan sebuah proyek konstruksi tidak hanya bergantung pada bagaimana bangunan fisik didirikan, tetapi juga bagaimana manajemen konstruksi dan strategi pengadaan dirancang sejak awal. Pengendalian kontrak terintegrasi menjadi kunci utama mencegah adendum berulang dan pembengkakan biaya.',
    content: `Kesuksesan sebuah proyek konstruksi tidak hanya bergantung pada bagaimana bangunan fisik didirikan, tetapi juga pada bagaimana manajemen konstruksi dan strategi pengadaan dirancang secara matang sejak tahap perencanaan umum dan persiapan dokumen pemilihan.

Sering kali proyek konstruksi mengalami deviasi waktu (keterlambatan/show cause meeting), pembengkakan anggaran (cost overrun), atau bahkan sengketa hukum karena adanya ketidaksinkronan antara Detail Engineering Design (DED), Syarat-Syarat Khusus Kontrak (SSKK), dan metode pemilihan penyedia.

### Titik Kritis yang Sering Diabaikan:
- **Kualitas Dokumen Perencanaan (DED & Spesifikasi Teknis)**: DED yang belum matang atau tidak sinkron dengan kondisi lapangan eksisting menjadi pemicu utama timbulnya *Contract Change Order (CCO)* dan Addendum volume pekerjaan.
- **Kesesuaian Tipe Kontrak**: Pemilihan jenis kontrak (Lump Sum, Harga Satuan, atau Gabungan) harus secara ketat mencerminkan derajat kepastian desain dan tingkat risiko geoteknik lapangan.
- **Manajemen Klaim & Masa Pemeliharaan (FHO/PHO)**: Pengawasan penyerahan pertama (PHO) dan masa pemeliharaan wajib dilengkapi checklist pengujian teknis yang ketat untuk menjamin kelaikan fungsi bangunan.

### Pendekatan Agen Pengadaan Profesional
Melalui keterlibatan Tenaga Ahli Pengadaan dan Manajemen Konstruksi yang tersertifikasi, instansi pemilik proyek mendapatkan supervisi independen mulai dari reviu HPS berbasis analisa harga satuan pekerjaan (AHSP) riil, audit kelayakan kualifikasi kontraktor, hingga asistensi berkala dalam rapat pembuktian keterlambatan (*Show Cause Meeting*).

Sinergi antara disiplin teknik sipil dan kepatuhan hukum kontrak pengadaan inilah yang menjadi jaminan mutlak rampungnya proyek tepat mutu, tepat waktu, tepat biaya, dan tertib administrasi hukum.`,
    postViews: 512,
    createdAt: Date.parse('2024-06-28T09:30:00Z'),
    comments: [
      {
        id: 'c3',
        authorName: 'Ir. Bambang Trihatmojo',
        email: 'bambang.ppk@example.com',
        comment: 'Poin mengenai sinkronisasi DED dan SSKK sangat krusial. Sering sekali PPK terjebak klaim kontraktor karena klausul SSKK yang ambigu.',
        createdAt: '29 Juni 2024 11:20 WIB'
      }
    ]
  },
  {
    id: 'artikel-3',
    slug: 'optimalisasi-proses-pengadaan-dengan-memahami-landasan-hukum-dan-praktik-terbaik-untuk-organisasi',
    title: 'Optimalisasi Proses Pengadaan Dengan Memahami Landasan Hukum dan Praktik Terbaik untuk Organisasi',
    category: 'Artikel',
    author: 'Adv. M. Erwin Syahroni, S.H.',
    date: '21 Juni 2024',
    day: '21',
    month: 'JUN',
    readTime: '4 min',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'Foto saat sedang mengisi Bimbingan Teknis Strategi Pengembangan Perdir dan SOP BUMD/BUMN',
    summary: 'Proses pengadaan barang dan jasa merupakan elemen vital dalam operasional berbagai jenis organisasi, baik itu pemerintah, BUMN, BUMD, BLU, BLUD, maupun perusahaan swasta. Mengingat kompleksitas dan besarnya dampak yang dihasilkan, pemahaman mendalam mengenai landasan regulasi dan mitigasi risiko hukum menjadi pondasi utama keberhasilan organisasi.',
    content: `Proses pengadaan barang dan jasa merupakan elemen vital dalam operasional berbagai jenis organisasi, baik itu pemerintah, BUMN, BUMD, BLU, BLUD, maupun perusahaan swasta. Mengingat kompleksitas dan besarnya dampak yang dihasilkan terhadap kinerja organisasi serta akuntabilitas keuangan, pemahaman mendalam mengenai landasan hukum dan praktik terbaik menjadi keharusan mutlak bagi seluruh pelaku pengadaan.

### Mengapa Landasan Hukum Menjadi Pondasi Utama?
Dalam ekosistem Pengadaan Barang/Jasa Pemerintah (PBJP), setiap tahapan—mulai dari perencanaan kebutuhan, penyusunan spesifikasi teknis/KAK, penetapan HPS, pemilihan penyedia, hingga penandatanganan dan pengendalian kontrak—diatur secara rigid oleh regulasi nasional, seperti **Perpres No. 16 Tahun 2018 beserta perubahannya (termasuk Perpres No. 46 Tahun 2025)** dan berbagai Peraturan LKPP terkait.

Ketidaktahuan atau kekeliruan interpretasi terhadap klausul regulasi sering kali berujung pada:
1. Sengketa perdata antara Pejabat Pembuat Komitmen (PPK) dan Penyedia.
2. Sanggahan dan pengaduan masyarakat yang menghambat progres proyek strategis.
3. Temuan pemeriksaan administratif hingga potensi indikasi tindak pidana korupsi oleh APIP, BPKP, atau BPK RI.

### Praktik Terbaik (Best Practices) Pengadaan Modern:
- **Penerapan Probity Advisory Sejak Dini**: Melibatkan konsultan independen atau Agen Pengadaan untuk mendampingi pengambilan keputusan krusial sehingga seluruh prosedur terekam secara objektif (*audit trail* transparan).
- **Perancangan Kontrak Komprehensif (Legal Drafting)**: Menghindari penggunaan template kontrak standar yang kaku. Kontrak harus disesuaikan dengan profil risiko spesifik pekerjaan, memuat klausul *dispute resolution* berjenjang, dan batasan tanggung jawab yang adil.
- **Pemanfaatan Sistem Digital dan Monitoring ITKP**: Memanfaatkan platform elektronik seperti SPSE, e-Katalog, serta aplikasi manajemen Indeks Tata Kelola Pengadaan (ITKP) untuk menjamin transparansi dan kepatuhan indikator kinerja utama instansi.

Dengan memadukan ketaatan regulasi, integritas personil, dan asistensi tenaga ahli yang kompeten, organisasi dapat menjalankan fungsi pengadaan barang/jasa secara efektif dan bebas dari kekhawatiran risiko hukum di masa mendatang.`,
    postViews: 489,
    createdAt: Date.parse('2024-06-21T10:00:00Z'),
    comments: [
      {
        id: 'c4',
        authorName: 'Dra. Siti Aminah, M.Si.',
        email: 'siti.ukpbj@example.com',
        comment: 'Materi bimbingan teknis yang dibawakan sangat aplikatif. Kami di UKPBJ mendapatkan banyak wawasan baru mengenai formulasi klausul kontrak yang aman dari temuan audit.',
        createdAt: '22 Juni 2024 16:45 WIB'
      },
      {
        id: 'c5',
        authorName: 'Ahmad Fauzi, S.H.',
        email: 'fauzi.law@example.com',
        comment: 'Legal opinion dan pendampingan probity memang langkah preventif terbaik sebelum menandatangani kontrak bernilai miliaran rupiah.',
        createdAt: '23 Juni 2024 08:20 WIB'
      }
    ]
  },
  {
    id: 'artikel-4',
    slug: 'sosialisasi-perpres-46-tahun-2025-dan-akselerasi-e-katalog-versi-6',
    title: 'Sosialisasi Perpres No. 46 Tahun 2025 & Akselerasi Implementasi e-Katalog Versi 6',
    category: 'Berita',
    author: 'Tim Regulasi PT. APN',
    date: '15 Juli 2024',
    day: '15',
    month: 'JUL',
    readTime: '3 min',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'Foto dokumentasi sosialisasi teknis implementasi e-Katalog Versi 6 bersama Tim Pokja Pemilihan',
    summary: 'LKPP resmi meluncurkan transformasi ekosistem digital e-Katalog Versi 6. Pelajari bagaimana integrasi sistem baru ini mempercepat proses e-Purchasing dan mini-kompetisi secara transparan dan akuntabel.',
    content: `Transformasi digital pengadaan barang/jasa pemerintah terus melaju dengan diundangkannya regulasi terbaru dan peluncuran e-Katalog Versi 6 oleh Lembaga Kebijakan Pengadaan Barang/Jasa Pemerintah (LKPP).

Dalam format baru ini, proses belanja pemerintah (e-Purchasing) dirancang jauh lebih interaktif dengan fitur negosiasi digital, mini-kompetisi real-time, dan pembayaran langsung yang terintegrasi dengan Kartu Kredit Pemerintah (KKP).

PT. Agen Pengadaan Nasional siap mendampingi K/L/PD dan BUMN dalam menyesuaikan tata kelola belanja dan melatih Pejabat Pengadaan agar mampu memanfaatkan seluruh fitur e-Katalog V6 secara maksimal.`,
    postViews: 280,
    createdAt: Date.parse('2024-07-15T08:00:00Z'),
    comments: []
  },
  {
    id: 'artikel-5',
    slug: 'kegiatan-bimtek-penyusunan-hps-dan-manajemen-kontrak-konstruksi',
    title: 'Kegiatan Bimtek Terpadu: Penyusunan HPS & Manajemen Kontrak Konstruksi Berbasis Risiko',
    category: 'Kegiatan',
    author: 'Divisi Pelatihan PT. APN',
    date: '10 Mei 2024',
    day: '10',
    month: 'MAY',
    readTime: '5 min',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'Foto kegiatan bimbingan teknis intensif bersama 45 peserta PPK dan Pejabat Pengadaan',
    summary: 'Dokumentasi pelaksanaan bimbingan teknis intensif selama 3 hari yang diikuti oleh 45 peserta dari jajaran PPK, Pokja Pemilihan, dan Tim Teknis dinas pekerjaan umum se-wilayah Banten & Jawa Barat.',
    content: `PT. Agen Pengadaan Nasional sukses menyelenggarakan program Bimbingan Teknis (Bimtek) Tatap Muka bertajuk "Penyusunan HPS Berbasis Risiko Pasar & Mitigasi Klaim Konstruksi".

Pelatihan ini membedah studi kasus nyata mengenai sengketa adendum, keterlambatan akibat cuaca ekstrem (force majeure), serta teknik pembuktian kualifikasi vendor dalam tender bernilai strategis. Seluruh peserta mendapatkan sertifikat kompetensi pelatihan dan modul pendukung siap pakai.`,
    postViews: 410,
    createdAt: Date.parse('2024-05-10T08:00:00Z'),
    comments: []
  }
];

const STORAGE_KEY = 'apn_information_articles_v1';
const ADMIN_AUTH_KEY = 'apn_admin_session_v1';

export const getStoredArticles = (): InformationItem[] => {
  if (typeof window === 'undefined') return INITIAL_ARTICLES_DATA;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ARTICLES_DATA));
      return INITIAL_ARTICLES_DATA;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_ARTICLES_DATA;
  } catch (e) {
    console.error('Error loading articles from localStorage', e);
    return INITIAL_ARTICLES_DATA;
  }
};

/**
 * Asynchronously fetch articles from Supabase Cloud Database.
 * If connected, updates local cache and returns latest data.
 * If not connected, returns local data.
 */
export const fetchArticlesAsync = async (): Promise<InformationItem[]> => {
  const localArticles = getStoredArticles();
  const config = getSupabaseConfig();
  
  if (!config.isConfigured) {
    return localArticles;
  }

  try {
    const cloudArticles = await fetchArticlesFromCloud();
    if (cloudArticles !== null && Array.isArray(cloudArticles)) {
      if (cloudArticles.length > 0) {
        // Merge cloud with local, taking strictly newer version of each article by createdAt
        const mergedMap = new Map<string, InformationItem>();
        localArticles.forEach(a => mergedMap.set(a.id, a));
        cloudArticles.forEach(ca => {
          const existing = mergedMap.get(ca.id);
          if (!existing || (ca.createdAt && ca.createdAt > (existing.createdAt || 0))) {
            mergedMap.set(ca.id, ca);
          }
        });
        const merged = Array.from(mergedMap.values()).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        saveAllArticles(merged, false);
        return merged;
      } else if (localArticles.length > 0) {
        // First-time seed to cloud if cloud table is empty
        seedAllArticlesToCloud(localArticles);
      }
    }
  } catch (err) {
    console.warn('Cloud sync error, using local fallback:', err);
  }

  return localArticles;
};

export const saveAllArticles = (articles: InformationItem[], syncCloud = true) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
  } catch (e) {
    console.error('Error saving articles to localStorage', e);
  }

  if (syncCloud) {
    seedAllArticlesToCloud(articles).catch((err) => {
      console.warn('Background cloud sync warning:', err);
    });
  }
};

export const getArticleBySlug = (slug: string): InformationItem | undefined => {
  const articles = getStoredArticles();
  return articles.find((a) => a.slug === slug || a.id === slug);
};

export const incrementArticleViews = (slugOrId: string): number => {
  const articles = getStoredArticles();
  const index = articles.findIndex((a) => a.slug === slugOrId || a.id === slugOrId);
  if (index !== -1) {
    articles[index].postViews = (articles[index].postViews || 0) + 1;
    saveAllArticles(articles, false);
    // Sync single article view to cloud
    upsertArticleToCloud(articles[index]).catch(() => {});
    return articles[index].postViews;
  }
  return 0;
};

export const addArticleComment = async (slugOrId: string, authorName: string, email: string, commentText: string): Promise<InformationItem | null> => {
  const articles = getStoredArticles();
  const index = articles.findIndex((a) => a.slug === slugOrId || a.id === slugOrId);
  if (index !== -1) {
    const now = new Date();
    const formattedDate = `${now.getDate()} ${now.toLocaleString('id-ID', { month: 'long' })} ${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;
    
    const newComment = {
      id: 'cmt-' + Date.now(),
      authorName: authorName.trim(),
      email: email.trim(),
      comment: commentText.trim(),
      createdAt: formattedDate
    };

    if (!articles[index].comments) {
      articles[index].comments = [];
    }
    articles[index].comments.unshift(newComment);
    articles[index].createdAt = Date.now();
    saveAllArticles(articles, false);
    try {
      await upsertArticleToCloud(articles[index]);
    } catch (e) {
      console.warn('Cloud sync error on addComment:', e);
    }
    return articles[index];
  }
  return null;
};

export const toggleHideComment = async (articleIdOrSlug: string, commentId: string): Promise<boolean> => {
  const articles = getStoredArticles();
  const index = articles.findIndex((a) => a.id === articleIdOrSlug || a.slug === articleIdOrSlug);
  if (index !== -1 && articles[index].comments) {
    const cIdx = articles[index].comments.findIndex((c) => c.id === commentId);
    if (cIdx !== -1) {
      articles[index].comments[cIdx].isHidden = !articles[index].comments[cIdx].isHidden;
      articles[index].createdAt = Date.now();
      saveAllArticles(articles, false);
      try {
        await upsertArticleToCloud(articles[index]);
      } catch (e) {
        console.warn('Cloud sync error on toggleHide:', e);
      }
      return true;
    }
  }
  return false;
};

export const replyToComment = async (
  articleIdOrSlug: string,
  commentId: string,
  replyText: string,
  authorName: string = 'Admin PT. APN',
  role: string = 'Representasi Resmi'
): Promise<boolean> => {
  const articles = getStoredArticles();
  const index = articles.findIndex((a) => a.id === articleIdOrSlug || a.slug === articleIdOrSlug);
  if (index !== -1 && articles[index].comments) {
    const cIdx = articles[index].comments.findIndex((c) => c.id === commentId);
    if (cIdx !== -1) {
      const now = new Date();
      const formattedDate = `${now.getDate()} ${now.toLocaleString('id-ID', { month: 'long' })} ${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;
      
      const newReply = {
        id: 'rpl-' + Date.now(),
        authorName: authorName.trim() || 'Admin PT. APN',
        role: role.trim() || 'Tim Ahli PBJ',
        comment: replyText.trim(),
        createdAt: formattedDate
      };

      if (!articles[index].comments[cIdx].replies) {
        articles[index].comments[cIdx].replies = [];
      }
      articles[index].comments[cIdx].replies!.push(newReply);
      articles[index].createdAt = Date.now();
      saveAllArticles(articles, false);
      try {
        await upsertArticleToCloud(articles[index]);
      } catch (e) {
        console.warn('Cloud sync error on replyToComment:', e);
      }
      return true;
    }
  }
  return false;
};

export const updateCommentReply = async (
  articleIdOrSlug: string,
  commentId: string,
  replyId: string,
  replyText: string,
  authorName?: string,
  role?: string
): Promise<boolean> => {
  const articles = getStoredArticles();
  const index = articles.findIndex((a) => a.id === articleIdOrSlug || a.slug === articleIdOrSlug);
  if (index !== -1 && articles[index].comments) {
    const cIdx = articles[index].comments.findIndex((c) => c.id === commentId);
    if (cIdx !== -1 && articles[index].comments[cIdx].replies) {
      const rIdx = articles[index].comments[cIdx].replies!.findIndex((r) => r.id === replyId);
      if (rIdx !== -1) {
        const now = new Date();
        const formattedDate = `${now.getDate()} ${now.toLocaleString('id-ID', { month: 'long' })} ${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB (Diedit)`;
        
        articles[index].comments[cIdx].replies![rIdx] = {
          ...articles[index].comments[cIdx].replies![rIdx],
          authorName: authorName !== undefined && authorName.trim() ? authorName.trim() : articles[index].comments[cIdx].replies![rIdx].authorName,
          role: role !== undefined && role.trim() ? role.trim() : articles[index].comments[cIdx].replies![rIdx].role,
          comment: replyText.trim(),
          createdAt: formattedDate
        };
        articles[index].createdAt = Date.now();
        saveAllArticles(articles, false);
        try {
          await upsertArticleToCloud(articles[index]);
        } catch (e) {
          console.warn('Cloud sync error on updateCommentReply:', e);
        }
        return true;
      }
    }
  }
  return false;
};

export const deleteComment = async (articleIdOrSlug: string, commentId: string): Promise<boolean> => {
  const articles = getStoredArticles();
  const index = articles.findIndex((a) => a.id === articleIdOrSlug || a.slug === articleIdOrSlug);
  if (index !== -1 && articles[index].comments) {
    articles[index].comments = articles[index].comments.filter((c) => c.id !== commentId);
    articles[index].createdAt = Date.now();
    saveAllArticles(articles, false);
    try {
      await upsertArticleToCloud(articles[index]);
    } catch (e) {
      console.warn('Cloud sync error on deleteComment:', e);
    }
    return true;
  }
  return false;
};

export const deleteCommentReply = async (articleIdOrSlug: string, commentId: string, replyId: string): Promise<boolean> => {
  const articles = getStoredArticles();
  const index = articles.findIndex((a) => a.id === articleIdOrSlug || a.slug === articleIdOrSlug);
  if (index !== -1 && articles[index].comments) {
    const cIdx = articles[index].comments.findIndex((c) => c.id === commentId);
    if (cIdx !== -1 && articles[index].comments[cIdx].replies) {
      articles[index].comments[cIdx].replies = articles[index].comments[cIdx].replies!.filter((r) => r.id !== replyId);
      articles[index].createdAt = Date.now();
      saveAllArticles(articles, false);
      try {
        await upsertArticleToCloud(articles[index]);
      } catch (e) {
        console.warn('Cloud sync error on deleteCommentReply:', e);
      }
      return true;
    }
  }
  return false;
};

export const deleteArticleById = async (id: string): Promise<boolean> => {
  const articles = getStoredArticles();
  const filtered = articles.filter((a) => a.id !== id);
  if (filtered.length !== articles.length) {
    saveAllArticles(filtered, false);
    try {
      await deleteArticleFromCloud(id);
    } catch (e) {
      console.warn('Cloud sync error on deleteArticle:', e);
    }
    return true;
  }
  return false;
};

export const upsertArticle = async (article: Partial<InformationItem> & { title: string }): Promise<InformationItem> => {
  const articles = getStoredArticles();
  
  // Format slug
  const slug = article.slug || article.title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');

  const now = new Date();
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const monthNamesId = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  const dayStr = article.day || String(now.getDate()).padStart(2, '0');
  const monthStr = article.month || months[now.getMonth()];
  const dateStr = article.date || `${now.getDate()} ${monthNamesId[now.getMonth()]} ${now.getFullYear()}`;

  if (article.id) {
    const index = articles.findIndex((a) => a.id === article.id);
    if (index !== -1) {
      const updated: InformationItem = {
        ...articles[index],
        ...article,
        slug: article.slug || articles[index].slug || slug,
        day: dayStr,
        month: monthStr,
        date: dateStr,
        createdAt: Date.now()
      };
      articles[index] = updated;
      saveAllArticles(articles, false);
      try {
        await upsertArticleToCloud(updated);
      } catch (e) {
        console.warn('Cloud sync error on update:', e);
      }
      return updated;
    }
  }

  // Create new
  const newItem: InformationItem = {
    id: 'art-' + Date.now(),
    slug,
    title: article.title,
    category: article.category || 'Artikel',
    author: article.author || 'Tim Ahli PT. APN',
    date: dateStr,
    day: dayStr,
    month: monthStr,
    readTime: article.readTime || '4 min',
    imageUrl: article.imageUrl || 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80',
    imageCaption: article.imageCaption || '',
    summary: article.summary || article.content?.replace(/<[^>]*>/g, '').slice(0, 180) + '...' || '',
    content: article.content || '',
    postViews: article.postViews || 1,
    comments: [],
    createdAt: Date.now()
  };

  articles.unshift(newItem);
  saveAllArticles(articles, false);
  try {
    await upsertArticleToCloud(newItem);
  } catch (e) {
    console.warn('Cloud sync error on create:', e);
  }
  return newItem;
};

// Admin authentication helpers
export const checkAdminAuth = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
};

export const syncAdminCredentialsWithCloud = async () => {
  try {
    const cloudCreds = await fetchAdminCredentialsFromCloud();
    if (cloudCreds && cloudCreds.username && cloudCreds.passwordHash) {
      localStorage.setItem('apn_custom_admin_user', cloudCreds.username);
      localStorage.setItem('apn_custom_admin_pass', cloudCreds.passwordHash);
    }
  } catch {
    // Ignore network errors
  }
};

export const loginAdmin = async (username: string, pass: string): Promise<boolean> => {
  if (typeof window === 'undefined') return false;

  // Try checking cloud credentials first
  try {
    const cloudCreds = await fetchAdminCredentialsFromCloud();
    if (cloudCreds && cloudCreds.username && cloudCreds.passwordHash) {
      localStorage.setItem('apn_custom_admin_user', cloudCreds.username);
      localStorage.setItem('apn_custom_admin_pass', cloudCreds.passwordHash);

      if (username.trim() === cloudCreds.username && pass === cloudCreds.passwordHash) {
        localStorage.setItem(ADMIN_AUTH_KEY, 'true');
        return true;
      }
    }
  } catch {
    // Fallback to local
  }

  // Default credentials: admin / apn2026 or custom saved in localStorage
  const savedPass = localStorage.getItem('apn_custom_admin_pass') || 'apn2026';
  const savedUser = localStorage.getItem('apn_custom_admin_user') || 'admin';

  if (username.trim() === savedUser && pass === savedPass) {
    localStorage.setItem(ADMIN_AUTH_KEY, 'true');
    return true;
  }
  return false;
};

export const logoutAdmin = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ADMIN_AUTH_KEY);
};

export const updateAdminCredentials = async (newUsername: string, newPassword: string): Promise<boolean> => {
  if (typeof window === 'undefined') return false;
  const user = newUsername.trim() || 'admin';
  const pass = newPassword.trim() || 'apn2026';

  localStorage.setItem('apn_custom_admin_user', user);
  localStorage.setItem('apn_custom_admin_pass', pass);

  // Sync to Supabase cloud
  const synced = await saveAdminCredentialsToCloud(user, pass);
  return synced;
};
