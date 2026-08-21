import { ServiceItem, ITKPIndicator, RegionData, ExpertTeamMember } from '../types';

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'konsultasi-langsung',
    number: 1,
    title: 'Konsultasi Pengadaan Barang Jasa',
    shortDesc: 'Layanan konsultasi interaktif tatap muka & daring terpadu bersama Tenaga Ahli PBJ untuk solusi strategis dan kepatuhan regulasi.',
    fullDesc: 'Layanan konsultasi langsung secara real-time bersama Tenaga Ahli Pengadaan Barang/Jasa bersertifikasi LKPP/BNSP. Menangani konsultasi strategi perencanaan, pemilihan penyedia, mitigasi risiko hukum kontrak, hingga konsultasi audit pengadaan.',
    iconName: 'MessageSquareShare',
    category: 'direct',
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80',
    isDirectWhatsApp: true,
    features: [
      'Konsultasi terpadu langsung bersama Tenaga Ahli & Praktisi Pengadaan Berpengalaman',
      'Pendampingan kasus spesifik K/L, Pemerintah Daerah, BUMN, dan Swasta',
      'Konsultasi hukum kontrak pengadaan & mitigasi risiko temuan APIP/BPK',
      'Klarifikasi regulasi Perpres No. 46/2025 (Perubahan Kedua Perpres 16/2018) & Perlem LKPP terkini',
      'Tersedia format Konsultasi Singkat, Sesi Private Zoom, atau On-Site Discussion'
    ],
    benefits: [
      'Penyelesaian masalah kritis pengadaan tanpa birokrasi berbelit',
      'Mencegah kesalahan administratif yang berpotensi menjadi sengketa hukum',
      'Kerahasiaan data & dokumen pengadaan terjamin (NDA compliant)'
    ],
    targetAudience: [
      'Pengguna Anggaran (PA) / Kuasa Pengguna Anggaran (KPA)',
      'Pejabat Pembuat Komitmen (PPK)',
      'Kelompok Kerja (Pokja) Pemilihan / Pejabat Pengadaan',
      'Penyedia Barang/Jasa (Vendor/Kontraktor/Konsultan)',
      'Auditor Internal (APIP) / Inspektorat'
    ],
    deliverables: [
      'Opini / Rekomendasi Ahli Pengadaan tertulis (jika diperlukan)',
      'Notulensi & matriks rekomendasi tindak lanjut penanganan masalah',
      'Checklist kepatuhan regulasi PBJ'
    ],
    regulations: [
      'Perpres No. 46 Tahun 2025 (Perubahan Kedua Perpres No. 16/2018)',
      'Perlem LKPP No. 10 Tahun 2021',
      'Surat Edaran Bersama LKPP & Kemendagri'
    ]
  },
  {
    id: 'agen-pengadaan',
    number: 2,
    title: 'Agen Pengadaan Barang Jasa',
    shortDesc: 'Jasa profesional Agen Pengadaan independen bertindak untuk dan atas nama Pokja Pemilihan maupun Pejabat Pembuat Komitmen (PPK).',
    fullDesc: 'Layanan terpadu Agen Pengadaan independen berlandaskan Perpres No. 46 Tahun 2025 dan Peraturan LKPP No. 10 Tahun 2021. Menyediakan jasa pelaksanaan pemilihan penyedia (Tender/Seleksi/E-Purchasing) mewakili Pokja Pemilihan, serta pengelolaan manajemen kontrak pengadaan menyeluruh membantu Pejabat Pembuat Komitmen (PPK) dari penerbitan SPPBJ hingga Serah Terima Akhir Pekerjaan (BAST).',
    iconName: 'UserCheck',
    category: 'procurement',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    features: [
      'Pelaksanaan Pemilihan Penyedia: Penyusunan Dokumen Pemilihan, Evaluasi Dokumen Penawaran, Aanwijzing, hingga Penetapan Pemenang SPSE',
      'Manajemen Pelaksanaan Kontrak: Penyusunan SPPBJ, Naskah Kontrak, SSKK, SSUK, dan Pengelolaan Jaminan',
      'Rapat Persiapan Kontrak (Pre-Construction Meeting / PCM) & Pengawasan Progres Prestasi Kerja',
      'Analisis & Pendampingan Contract Change Order (CCO), Addendum Kontrak, dan Mitigasi Denda/Klaim',
      'Pengujian Mutu, Uji Fungsi Teknis, dan Penyusunan Berita Acara Serah Terima (BAST)'
    ],
    benefits: [
      'Solusi tuntas keterbatasan kapasitas dan sertifikasi SDM Pokja / PPK internal instansi',
      'Menghilangkan potensi konflik kepentingan dan intervensi eksternal dalam pengadaan',
      'Perlindungan tata kelola dan kepastian hukum maksimal bagi Pengguna Anggaran (PA/KPA)'
    ],
    targetAudience: [
      'Kementerian, Lembaga, dan Pemerintah Daerah (K/L/PD)',
      'BUMN, BUMD, Rumah Sakit Umum Daerah (RSUD), dan Badan Layanan Umum (BLU/BLUD)',
      'Pengelola Proyek Strategis Nasional (PSN) & Proyek Multi-Years bernilai tinggi'
    ],
    deliverables: [
      'Dokumen Pemilihan, Berita Acara Hasil Pemilihan (BAHP), dan Arsip Tender Terverifikasi',
      'Draf Naskah Kontrak Sah, Dokumen Addendum / CCO dengan Justifikasi Teknis Kuat',
      'Berita Acara Kemajuan Pekerjaan, Berita Acara Pemeriksaan, dan BAST Final'
    ],
    regulations: [
      'Perpres No. 46 Tahun 2025 (Ketentuan Agen Pengadaan & Pelaksanaan PBJ)',
      'Peraturan LKPP No. 10 Tahun 2021 tentang Tata Cara Agen Pengadaan',
      'Peraturan LKPP No. 12 Tahun 2021 tentang Pedoman Pelaksanaan PBJ Melalui Penyedia'
    ]
  },
  {
    id: 'legal-drafting',
    number: 3,
    title: 'Perancangan Peraturan dan Standar Oprasional (Legal Drafting)',
    shortDesc: 'Penyusunan dan penelaahan dokumen hukum kontrak, rancangan regulasi internal (SOP/Perdir), MoU, serta klausul mitigasi risiko sengketa.',
    fullDesc: 'Layanan perancangan regulasi, SOP, dan dokumen hukum (Legal Drafting) spesifik Pengadaan Barang/Jasa oleh Tenaga Ahli Hukum Kontrak Pengadaan. Meliputi perancangan draf kontrak kerja sama, Syarat-Syarat Umum & Khusus Kontrak (SSUK/SSKK), Peraturan Direksi/SOP PBJ BUMN/BUMD/BLU, adendum kontrak kompleks, klausul arbitrase, serta pendapat hukum (Legal Opinion) pencegahan tindak pidana korupsi/perdata.',
    iconName: 'FileCheck2',
    category: 'contract',
    imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    features: [
      'Perancangan & Review Naskah Kontrak Pengadaan Kompleks (EPC, Turnkey, Design & Build, Multiyears)',
      'Penyusunan Standar Operasional Prosedur (SOP) PBJ & Peraturan Direksi (Perdir)',
      'Penyusunan Syarat-Syarat Umum Kontrak (SSUK) dan Syarat-Syarat Khusus Kontrak (SSKK)',
      'Perumusan Klausul Mitigasi Risiko: Force Majeure, Eskalasi Harga, Wanprestasi, Denda, & Arbitrase BANI',
      'Penyusunan Legal Opinion (Pendapat Hukum) Pengadaan & Penelaahan Draf Addendum / CCO Kontrak'
    ],
    benefits: [
      'Perlindungan hukum maksimal terhadap potensi sengketa kontrak perdata maupun tuduhan pidana kerugian negara',
      'Menjamin kekuatan hukum eksekutabel pada setiap pasal dan batasan hak-kewajiban para pihak',
      'Mengurangi celah hukum yang sering dimanfaatkan penyedia untuk melakukan wanprestasi/klaim berlebih'
    ],
    targetAudience: [
      'Pejabat Pembuat Komitmen (PPK) & Kuasa Pengguna Anggaran (KPA)',
      'Biro Hukum / Bagian Hukum Pemerintah Daerah, BUMN, dan BUMD',
      'Direksi Perusahaan, Tim Legal Korporasi, dan Penyedia Jasa Konstruksi/Konsultansi'
    ],
    deliverables: [
      'Naskah Kontrak Pengadaan / Addendum Kontrak Final Siap Tanda Tangan',
      'Dokumen Regulasi / SOP PBJ / Peraturan Direksi Terstandarisasi',
      'Dokumen Legal Review, Legal Opinion, dan Matriks Komparasi Risiko Hukum'
    ],
    regulations: [
      'Kitab Undang-Undang Hukum Perdata (KUHPerdata Buku III)',
      'Perpres No. 46 Tahun 2025 & Perlem LKPP No. 12 Tahun 2021',
      'UU No. 30 Tahun 1999 tentang Arbitrase dan Alternatif Penyelesaian Sengketa'
    ]
  },
  {
    id: 'pendampingan-pbj',
    number: 4,
    title: 'Pendampingan Pengadaan Barang/Jasa (Advice)',
    shortDesc: 'Asistensi pendampingan (advice) pengadaan, mitigasi risiko sengketa, probity advisory, dan persiapan audit BPK/APIP.',
    fullDesc: 'Layanan pendampingan pengadaan menyeluruh (Procurement Advice & Probity Advisory) dari tahap perencanaan, persiapan, pemilihan, pelaksanaan hingga audit pasca-pengadaan. Melindungi pengambil kebijakan dari kesalahan prosedur dan membantu mitigasi potensi temuan pemeriksa internal/eksternal.',
    iconName: 'ShieldCheck',
    category: 'assistance',
    imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80',
    features: [
      'Pendampingan & Advice Pengadaan Barang/Jasa Strategis (Probity Advisory)',
      'Asistensi Pendampingan Pemeriksaan Audit BPK, BPKP, dan APIP',
      'Mediasi & Pendampingan Non-Litigasi Sengketa Kontrak PBJ',
      'Reviu Kepatuhan Tingkat Komponen Dalam Negeri (TKDN / P3DN)',
      'Mitigasi Risiko Hukum Pengadaan pada Tahap Persiapan & Pelaksanaan'
    ],
    benefits: [
      'Menjamin kepatuhan proses terhadap seluruh regulasi PBJ yang berlaku',
      'Menyediakan second opinion dari pakar independen sebelum keputusan final diambil',
      'Memberikan rasa aman & kepastian hukum bagi pejabat pengadaan'
    ],
    targetAudience: [
      'Pimpinan Daerah (Gubernur, Bupati, Walikota) & Kepala OPD',
      'KPA, PPK, dan Pejabat Pengadaan',
      'Inspektorat / APIP yang memerlukan tenaga ahli pendamping audit'
    ],
    deliverables: [
      'Laporan Probity & Procurement Advice Review serta Memo Pendapat Ahli Pengadaan',
      'Panduan mitigasi dan jawaban atas lembar temuan pemeriksaan (LHP)',
      'Matriks mitigasi risiko hukum dan kepatuhan pengadaan'
    ],
    regulations: [
      'Peraturan BPKP No. 3 Tahun 2019 tentang Pedoman Probity Audit',
      'Inpres No. 2 Tahun 2022 tentang Percepatan P3DN'
    ]
  },
  {
    id: 'aplikasi-pbj',
    number: 5,
    title: 'Pembuatan dan Pengembangan Sistem (System Development)',
    shortDesc: 'Pengembangan sistem & aplikasi digital PBJ terpadu, dengan unggulan khusus Aplikasi Indeks Tata Kelola Pengadaan (ITKP), e-procurement, dan manajemen kontrak.',
    fullDesc: 'Penyediaan, perancangan, dan pengembangan sistem aplikasi digital cerdas (System Development) untuk siklus Pengadaan Barang/Jasa. Layanan ini mengunggulkan Aplikasi Indeks Tata Kelola Pengadaan (ITKP) yang dirancang khusus untuk memonitor, mengukur, dan mendongkrak skor kepatuhan ITKP instansi (K/L/PD), serta didukung modul manajemen kontrak (E-Contract), otomatisasi HPS, dan integrasi SPSE.',
    iconName: 'Laptop',
    category: 'procurement',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    features: [
      'Aplikasi Indeks Tata Kelola Pengadaan (ITKP) - Monitoring & Peningkatan Indeks Kepatuhan PBJ',
      'Sistem Informasi Manajemen Kontrak & Tracking Progres Pekerjaan (E-Contract)',
      'Aplikasi Otomatisasi Kertas Kerja HPS & Analisis Harga Pasar Riil',
      'Platform E-Procurement & Manajemen Vendor (Vendor Management System)',
      'Integrasi Sistem Sesuai Standar SPSE & Regulasi LKPP'
    ],
    benefits: [
      'Meningkatkan perolehan skor Indeks Tata Kelola Pengadaan (ITKP) instansi secara terukur',
      'Meningkatkan efisiensi waktu proses administrasi pengadaan hingga 60%',
      'Mencegah human error dan manipulasi data melalui audit trail digital yang aman',
      'Dashboard eksekutif real-time untuk monitoring serapan anggaran & status pengadaan'
    ],
    targetAudience: [
      'Unit Kerja Pengadaan Barang/Jasa (UKPBJ) & Biro Pengadaan K/L/PD',
      'Pejabat Pembuat Komitmen (PPK) & Tim Pokja Pemilihan',
      'Inspektorat / Tim Evaluator ITKP & RB (Reformasi Birokrasi)',
      'Direksi, Manajemen BUMN/BUMD, dan Korporasi Swasta'
    ],
    deliverables: [
      'Aplikasi Indeks Tata Kelola Pengadaan (ITKP) & Modul Sistem PBJ Siap Pakai',
      'Akses Sistem & Lisensi Aplikasi Pengadaan Barang/Jasa',
      'Kustomisasi Fitur sesuai Proses Bisnis & SOP Internal Instansi',
      'Pelatihan Operator, Buku Panduan Pengguna (User Manual), dan Dukungan Teknis 24/7'
    ],
    regulations: [
      'Perpres No. 46 Tahun 2025 (Penyelenggaraan PBJ Berbasis Elektronik)',
      'Peraturan LKPP tentang Indeks Tata Kelola Pengadaan (ITKP)',
      'Standar Sistem Pemerintahan Berbasis Elektronik (SPBE)'
    ]
  },
  {
    id: 'pelatihan-pbj',
    number: 6,
    title: 'Pelatihan Pengadaan Barang/Jasa (Training)',
    shortDesc: 'Program pelatihan, Bimtek & Workshop sertifikasi kompetensi SDM pengadaan berstandar nasional dan aplikatif.',
    fullDesc: 'Program pelatihan komprehensif (Training PBJ) untuk peningkatan kapasitas dan kompetensi SDM Pengadaan. Menyelenggarakan Bimbingan Teknis (Bimtek), Pelatihan Sertifikasi Kompetensi PBJ Level 1, e-Katalog Versi 6, Penyusunan HPS & Dokumen Kontrak, serta In-House Training khusus instansi pemerintah dan BUMN.',
    iconName: 'GraduationCap',
    category: 'training',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
    features: [
      'Pelatihan & Bimtek Sertifikasi Pengadaan Barang/Jasa Pemerintah (Level 1)',
      'Workshop Terapan: Penyusunan HPS Berbasis Risiko & Data Pasar Riil',
      'Pelatihan Teknis e-Katalog V6, Mini-Kompetisi, dan Toko Daring',
      'Pelatihan Manajemen Kontrak Konstruksi & Mitigasi Klaim Pekerjaan',
      'In-House Training kustomisasi kurikulum sesuai kebutuhan organisasi'
    ],
    benefits: [
      'Meningkatkan persentase kelulusan ujian sertifikasi PBJ nasional',
      'Meningkatkan kapasitas teknis praktisi dan aparatur pengadaan',
      'Metode belajar studi kasus nyata, simulasi aplikasi SPSE, dan interaktif'
    ],
    targetAudience: [
      'Aparatur Sipil Negara (ASN) calon Pejabat Pengadaan / PPK / Pokja',
      'Pengelola UKPBJ & Pejabat Fungsional Pengelola PBJ',
      'Direksi & Tim Tender Perusahaan Swasta / BUMN / BUMD'
    ],
    deliverables: [
      'Sertifikat Pelatihan dari PT. Agen Pengadaan Nasional',
      'Modul pelatihan lengkap, draf template dokumen, & kumpulan latihan soal',
      'Grup diskusi bimbingan pasca-pelatihan bersama instruktur'
    ],
    regulations: [
      'Perlem LKPP No. 7 Tahun 2021 tentang SDM Pengadaan',
      'Standar Kompetensi Kerja Nasional Indonesia (SKKNI) Bidang PBJ'
    ]
  }
];

export const ITKP_INDICATORS: ITKPIndicator[] = [
  {
    id: 'pemanfaatan-sistem',
    name: 'Pemanfaatan Sistem Pengadaan (e-Purchasing & SPSE)',
    category: 'Pemanfaatan Sistem',
    weight: 40,
    currentScore: 84.5,
    targetScore: 95.0,
    status: 'warning',
    description: 'Mengukur rasio pemanfaatan e-Purchasing (Katalog Elektronik & Toko Daring), e-Tendering, e-Seleksi, dan keterumuman SiRUP secara tepat waktu.',
    formula: '(Bobot e-Purchasing × 50%) + (Bobot e-Tendering × 30%) + (Keterumuman SiRUP × 20%)',
    recommendations: [
      'Tingkatkan transaksi e-Katalog lokal dan sektoral minimal 30% dari total belanja pengadaan',
      'Percepat pengumuman RUP melalui SiRUP sebelum akhir bulan Januari tahun anggaran berjalan',
      'Gunakan Toko Daring (Bela Pengadaan) untuk belanja barang/jasa mikro & kecil'
    ]
  },
  {
    id: 'kualifikasi-sdm',
    name: 'Kualifikasi & Kompetensi SDM Pengadaan',
    category: 'Kualifikasi SDM',
    weight: 30,
    currentScore: 78.2,
    targetScore: 90.0,
    status: 'warning',
    description: 'Mengukur ketersediaan dan pemenuhan Pejabat Fungsional Pengelola Pengadaan Barang/Jasa (JF PBJ) yang telah tersertifikasi kompetensi standar LKPP/BNSP.',
    formula: '(Rasio JF PBJ Tersertifikasi / Kebutuhan Formasi) × Bobot SDM + Nilai Sertifikasi Level Lanjutan',
    recommendations: [
      'Daftarkan ASN pengelola PBJ ke pelatihan kompetensi sertifikasi Level 1 bersama PT. APN',
      'Lakukan penyesuaian formasi jabatan fungsional PBJ pada UKPBJ',
      'Fasilitasi uji kompetensi berkala bagi seluruh PPK dan Pokja'
    ]
  },
  {
    id: 'kematangan-ukpbj',
    name: 'Tingkat Kematangan UKPBJ (Maturitas)',
    category: 'Kematangan UKPBJ',
    weight: 30,
    currentScore: 86.0,
    targetScore: 95.0,
    status: 'optimal',
    description: 'Tingkat kematangan kelembagaan Unit Kerja Pengadaan Barang/Jasa (Level 1 Inisiasi, Level 2 Esensi, Level 3 Proaktif, Level 4 Strategis, Level 5 Unggul).',
    formula: 'Evaluasi 9 Variabel Kematangan UKPBJ LKPP (Tata Kelola, SDM, Sistem Informasi, Manajemen Risiko)',
    recommendations: [
      'Lengkapi dokumen SOP pengelolaan risiko pengadaan dan kode etik pengadaan',
      'Penuhi seluruh bukti dukung (eviden) 9 variabel menuju UKPBJ Level 3 Proaktif / Level 4',
      'Gunakan jasa Agen Pengadaan independen untuk mengatasi kekurangan kapasitas personil'
    ]
  }
];

export const SAMPLE_REGIONS_ITKP: RegionData[] = [
  {
    id: 'prov-01',
    name: 'Pemerintah Provinsi Jawa Timur',
    category: 'Pemerintah Provinsi',
    itkpScore: 94.8,
    grade: 'Sangat Baik',
    ePurchasingRatio: 92.4,
    tenderDiniRatio: 78.0,
    sirupAnnounced: 98.5,
    sdmCertified: 91.0,
    ukpbjLevel: 3,
    year: 2024
  },
  {
    id: 'prov-02',
    name: 'Pemerintah Provinsi Jawa Barat',
    category: 'Pemerintah Provinsi',
    itkpScore: 91.2,
    grade: 'Sangat Baik',
    ePurchasingRatio: 88.5,
    tenderDiniRatio: 65.0,
    sirupAnnounced: 97.2,
    sdmCertified: 89.0,
    ukpbjLevel: 3,
    year: 2024
  },
  {
    id: 'kl-01',
    name: 'Kementerian Pekerjaan Umum & Perumahan Rakyat',
    category: 'Kementerian',
    itkpScore: 93.6,
    grade: 'Sangat Baik',
    ePurchasingRatio: 89.0,
    tenderDiniRatio: 92.5,
    sirupAnnounced: 99.0,
    sdmCertified: 94.0,
    ukpbjLevel: 4,
    year: 2024
  },
  {
    id: 'kl-02',
    name: 'Kementerian Kesehatan RI',
    category: 'Kementerian',
    itkpScore: 88.4,
    grade: 'Baik',
    ePurchasingRatio: 84.2,
    tenderDiniRatio: 61.0,
    sirupAnnounced: 95.8,
    sdmCertified: 85.0,
    ukpbjLevel: 3,
    year: 2024
  },
  {
    id: 'kab-01',
    name: 'Pemerintah Kota Surabaya',
    category: 'Pemerintah Kab/Kota',
    itkpScore: 96.2,
    grade: 'Sangat Baik',
    ePurchasingRatio: 96.0,
    tenderDiniRatio: 88.0,
    sirupAnnounced: 100.0,
    sdmCertified: 95.0,
    ukpbjLevel: 4,
    year: 2024
  },
  {
    id: 'kab-02',
    name: 'Pemerintah Kabupaten Badung',
    category: 'Pemerintah Kab/Kota',
    itkpScore: 89.7,
    grade: 'Baik',
    ePurchasingRatio: 87.1,
    tenderDiniRatio: 72.0,
    sirupAnnounced: 96.5,
    sdmCertified: 82.0,
    ukpbjLevel: 3,
    year: 2024
  },
  {
    id: 'kab-03',
    name: 'Pemerintah Kabupaten Muara Enim',
    category: 'Pemerintah Kab/Kota',
    itkpScore: 82.5,
    grade: 'Baik',
    ePurchasingRatio: 74.0,
    tenderDiniRatio: 52.0,
    sirupAnnounced: 91.0,
    sdmCertified: 76.0,
    ukpbjLevel: 2,
    year: 2024
  },
  {
    id: 'lem-01',
    name: 'Badan Pengawas Obat dan Makanan (BPOM)',
    category: 'Lembaga',
    itkpScore: 92.1,
    grade: 'Sangat Baik',
    ePurchasingRatio: 90.5,
    tenderDiniRatio: 70.0,
    sirupAnnounced: 98.0,
    sdmCertified: 90.0,
    ukpbjLevel: 3,
    year: 2024
  }
];

export const EXPERT_TEAM: ExpertTeamMember[] = [
  {
    name: 'Dr. Ir. Hendra Prasetyo, M.T., CCMS, PBJ-Expert',
    role: 'Lead Procurement Specialist & Managing Partner',
    certification: ['Sertifikat Ahli PBJ LKPP', 'Certified Contract Management Specialist (CCMS)', 'Fasilitator Nasional LKPP'],
    experienceYears: 18,
    specialization: 'Perencanaan Strategis Pengadaan, Manajemen Kontrak Konstruksi Kompleks, & Audit Tata Kelola',
    bio: 'Berpengalaman memimpin lebih dari 150+ paket pemilihan strategis dan mendampingi berbagai K/L/Pemda dalam audit PBJ nasional.'
  },
  {
    name: 'Siti Rahmawati, S.H., M.H., CLI',
    role: 'Legal Contract & Dispute Resolution Advisor',
    certification: ['Certified Legal Auditor', 'Ahli Hukum Pengadaan Publik', 'Mediator Bersertifikat MA RI'],
    experienceYears: 14,
    specialization: 'Penyusunan Kontrak Kritis, Penanganan Sanggah & Mitigasi Risiko Hukum Pengadaan',
    bio: 'Pakar hukum kontrak pengadaan yang telah mendampingi puluhan penyelesaian sengketa klaim konstruksi dan pengadaan barang/jasa publik.'
  },
  {
    name: 'Agus Kurniawan, S.T., M.Sc., PMP',
    role: 'Procurement Digitalization & ITKP Architect',
    certification: ['Project Management Professional (PMP)', 'Lead Auditor ISO 37001 (SMAP)', 'Sertifikasi Ahli PBJ Nasional'],
    experienceYears: 12,
    specialization: 'Dashboard ITKP, Optimasi SPSE & e-Katalog V6, Maturitas UKPBJ Level Proaktif',
    bio: 'Arsitek sistem pemantauan pengadaan yang telah mendesain roadmap peningkatan ITKP di 30+ Pemerintah Daerah hingga mencapai predikat Sangat Baik.'
  },
  {
    name: 'Nurul Hidayah, S.E., M.Ak., CA, PBJ-L1',
    role: 'Senior Financial & HPS Reviewer',
    certification: ['Chartered Accountant (CA)', 'Certified Procurement Practitioner', 'Probity Auditor Bersertifikat'],
    experienceYears: 11,
    specialization: 'Reviu Kertas Kerja HPS, Analisis Tingkat Komponen Dalam Negeri (TKDN), Audit Keuangan PBJ',
    bio: 'Ahli dalam verifikasi struktur harga pasar riil, perhitungan kewajaran biaya tender, dan probity audit pengadaan barang bernilai tinggi.'
  }
];

export const FOUNDER_DIRECTOR_PROFILE = {
  name: 'Didi Nahtadi, S.Sy., M.H.',
  role: 'Direktur',
  titleDesc: 'Pakar Hukum Pengadaan Barang/Jasa Pemerintah & Legal Drafter Senior',
  bio: 'Praktisi dan pakar hukum pengadaan barang/jasa publik dengan rekam jejak panjang dalam pendampingan hukum, penyelesaian sengketa kontrak, bimbingan teknis nasional, serta review proyek strategis KPBU kementerian.',
  experiences: [
    {
      title: 'Pendampingan Hukum Litigasi PBJ',
      desc: 'Pendampingan Permasalahan Hukum Pengadaan Barang/Jasa Pemerintah pada Tahap Penyelidikan, Penyidikan, dan Persidangan',
      highlight: '> 30 Kasus',
      metric: '30+',
      metricUnit: 'Kasus Litigasi',
      iconName: 'Scale'
    },
    {
      title: 'Pendampingan Permasalahan Kontrak',
      desc: 'Pendampingan dan Mediasi Permasalahan Kontrak Pengadaan Barang/Jasa Pemerintah',
      highlight: '> 50 Kasus',
      metric: '50+',
      metricUnit: 'Kasus Kontrak',
      iconName: 'FileText'
    },
    {
      title: 'Layanan Penyelesaian Sengketa Kontrak',
      desc: 'Tim Penyelenggara Layanan Penyelesaian Sengketa Pengadaan Barang/Jasa Pemerintah',
      highlight: '> 25 Kasus',
      metric: '25+',
      metricUnit: 'Kasus Sengketa',
      iconName: 'ShieldAlert'
    },
    {
      title: 'Training Kontrak & Bimtek PBJ Nasional',
      desc: 'Tim Penyelenggara Training Kontrak dan Bimbingan Teknis Pengadaan Barang/Jasa Pemerintah',
      highlight: '> 50 Kegiatan',
      metric: '50+',
      metricUnit: 'Kegiatan Bimtek',
      iconName: 'GraduationCap'
    },
    {
      title: 'Legal Drafting & Konsultasi PBJ',
      desc: 'Legal Drafting Dokumen Kontrak dan Konsultasi Permasalahan Pengadaan Barang/Jasa Pemerintah',
      highlight: '> 200 Kasus',
      metric: '200+',
      metricUnit: 'Kasus Konsultasi',
      iconName: 'FileCheck'
    },
    {
      title: 'Review Pengadaan KPBU Kementerian PUPR',
      desc: 'Tim Review Kelengkapan dan Dokumen Pengadaan Kerjasama Pemerintah dengan Badan Usaha (KPBU) Kementerian PUPR',
      highlight: '> 10 Proyek',
      metric: '10+',
      metricUnit: 'Proyek KPBU',
      iconName: 'Building2'
    }
  ]
};

export const COMPANY_PROFILE = {
  fullName: 'PT. Agen Pengadaan Nasional',
  brandName: 'National Procurement Agent',
  tagline: 'Innovation and Solution Hub',
  director: 'Didi Nahtadi, S.Sy., M.H.',
  directorRole: 'Pendiri / Direktur Utama',
  shortBio: 'PT. Agen Pengadaan Nasional adalah entitas penyedia jasa Agen Pengadaan independen dan profesional pertama dan terpercaya di Indonesia, didirikan berlandaskan Peraturan Presiden (Perpres) Nomor 46 Tahun 2025 tentang Perubahan Kedua atas Peraturan Presiden Nomor 16 Tahun 2018 tentang Pengadaan Barang/Jasa Pemerintah serta Peraturan LKPP terkait Agen Pengadaan.',
  vision: 'Menjadi pusat inovasi dan solusi terdepan di Indonesia dalam tata kelola pengadaan barang/jasa yang berintegritas, transparan, efektif, dan bernilai tambah bagi pembangunan nasional.',
  missions: [
    'Menyelenggarakan jasa Agen Pengadaan Pemilihan dan Kontrak yang profesional, akuntabel, dan bebas dari benturan kepentingan.',
    'Memberikan layanan pendampingan, konsultasi hukum, dan probity advice bermutu tinggi untuk mitigasi risiko audit dan sengketa.',
    'Membangun ekosistem pemantauan digital melalui Dashboard ITKP demi optimalisasi Indeks Reformasi Birokrasi instansi pemerintah.',
    'Meningkatkan kapasitas kompetensi SDM pengadaan nasional melalui pelatihan dan bimbingan teknis terpadu.',
    'Mendorong akselerasi penggunaan produk dalam negeri (P3DN/TKDN) dan pemberdayaan UMKM dalam pengadaan publik.'
  ],
  coreValues: [
    { title: 'Integritas (Integrity)', desc: 'Menjunjung tinggi kejujuran, kode etik, dan bebas dari gratifikasi dalam setiap tahapan pengadaan.' },
    { title: 'Akuntabilitas (Accountability)', desc: 'Setiap rekomendasi dan tindakan terdokumentasi rapi serta dapat dipertanggungjawabkan di hadapan hukum dan audit.' },
    { title: 'Inovasi Solutif (Innovation)', desc: 'Menyediakan pendekatan modern, dashboard digital, dan solusi cepat untuk masalah pengadaan yang rumit.' },
    { title: 'Profesionalisme (Professionalism)', desc: 'Dikelola oleh tenaga ahli bersertifikasi LKPP, BNSP, dan praktisi berpengalaman puluhan tahun.' },
    { title: 'Transparansi (Transparency)', desc: 'Mewujudkan proses pengadaan yang terbuka, adil, bersaing sehat, dan berkeadilan bagi seluruh pihak.' }
  ],
  statistics: [
    { value: '100%', label: 'Standar Regulasi LKPP & Perpres' },
    { value: 'End-to-End', label: 'Solusi Pengadaan Hulu ke Hilir' },
    { value: '100%', label: 'Bebas Benturan Kepentingan' },
    { value: '24/7', label: 'Kesiapan Respon Konsultasi' },
    { value: '100%', label: 'Perlindungan Dokumen (NDA)' }
  ],
  contact: {
    phone: '085111343315',
    whatsapp: '6285111343315',
    whatsappFormatted: '0851-1134-3315',
    email: 'agenpengadaannasional@gmail.com',
    consultEmail: 'agenpengadaannasional@gmail.com',
    address: 'Azalea Garden Blok B3, No.12A, Jl. Tipar Raya-Daru, Daru, Jambe, Tangerang, Banten',
    hours: 'Senin - Jumat: 08:00 - 16:00 WIB (Konsultasi WA 24 Jam)',
    instagram: '@agenpengadaan.nasional',
    instagramUrl: 'https://instagram.com/agenpengadaan.nasional',
    tiktok: '@agenpengadaan.nasional',
    tiktokUrl: 'https://tiktok.com/@agenpengadaan.nasional',
    googleMapsUrl: 'https://maps.google.com'
  }
};

export const FAQ_DATA = [
  {
    question: 'Apa itu Agen Pengadaan berdasarkan Perpres Pengadaan Barang/Jasa Pemerintah?',
    answer: 'Agen Pengadaan adalah Unit Kerja Pengadaan Barang/Jasa (UKPBJ) atau Pelaku Usaha yang melaksanakan sebagian atau seluruh pekerjaan Pengadaan Barang/Jasa yang dipercayakan oleh Kementerian/Lembaga/Pemerintah Daerah/Institusi lain sebagai Pengguna Anggaran (PA) atau Kuasa Pengguna Anggaran (KPA), sebagaimana diatur dalam Perpres No. 16/2018 jo Perpres No. 12/2021 Pasal 1 angka 17.'
  },
  {
    question: 'Kapan instansi pemerintah perlu menggunakan jasa PT. Agen Pengadaan Nasional?',
    answer: 'Instansi membutuhkan Agen Pengadaan ketika: (1) UKPBJ/Pokja internal mengalami keterbatasan personil atau beban kerja paket pengadaan sangat tinggi, (2) Proyek pengadaan bersifat strategis, kompleks, bernilai besar, atau berisiko tinggi, (3) Memerlukan independensi dan probity tinggi untuk mencegah benturan kepentingan, (4) Ingin meningkatkan nilai Indeks Tata Kelola Pengadaan (ITKP) ke kategori Sangat Baik.'
  },
  {
    question: 'Bagaimana mekanisme kontrak kerja sama dengan PT. Agen Pengadaan Nasional?',
    answer: 'Kerja sama dapat dilakukan melalui mekanisme Pengadaan Jasa Konsultansi (Seleksi/Pengadaan Langsung sesuai nilai) atau Nota Kesepahaman (MoU) & Kontrak Swakelola Tipe III/Penyedia Jasa berpayung hukum Peraturan LKPP No. 10 Tahun 2021.'
  },
  {
    question: 'Apakah PT. APN memiliki akses langsung untuk konsultasi cepat via WhatsApp?',
    answer: 'Ya! Layanan "Konsultasi Pengadaan Barang Jasa" kami terhubung langsung ke Tenaga Ahli Pengadaan via WhatsApp resmi (0851-1134-3315) untuk memberikan respon cepat terhadap persoalan darurat pengadaan Anda.'
  },
  {
    question: 'Bagaimana Dashboard Monitoring ITKP PT. APN membantu Pemerintah Daerah?',
    answer: 'Dashboard ITKP kami menyajikan simulasi kalkulasi skor, deteksi gap indikator yang belum memenuhi target LKPP, panduan eviden dokumen pendukung, dan pendampingan teknis hingga instansi Anda meraih nilai ITKP di atas 90 (Kategori Sangat Baik) yang berpengaruh positif terhadap Dana Insentif Fiskal.'
  }
];

export const TRACK_RECORD_PROJECTS: import('../types').TrackRecordProject[] = [
  {
    id: 'proj-rsud-terpadu',
    title: 'Pembangunan Gedung Rawat Inap & Instalasi Bedah Sentral RSUD',
    category: 'medical',
    categoryLabel: 'Fasilitas Kesehatan & Konstruksi',
    clientType: 'Pemerintah Provinsi',
    packageValue: 'Rp 58,4 Miliar',
    year: '2024 - 2025',
    imageUrl: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80',
    role: 'Agen Pemilihan & Probity Advisory Penuh',
    scope: [
      'Reviu HPS dan Spesifikasi Teknis MEP & Struktur Bangunan Rumah Sakit',
      'Pelaksanaan Tender Terbuka Pascakualifikasi Sistem Gugur SPSE',
      'Mitigasi Risiko Adendum Kontrak & Penyusunan SSKK Khusus Alat Kesehatan',
      'Pendampingan Serah Terima Hasil Pekerjaan (BAST) Tepat Mutu'
    ],
    keyAchievement: '0 Sanggahan Banding, Efisiensi Anggaran Rp 4,2 Miliar (7,2%), dan 100% Bebas Temuan Audit BPK',
    complianceRate: '100% LKPP & SNI Standar Rumah Sakit',
    description: 'Pendampingan menyeluruh dari penyusunan dokumen tender, mitigasi klausul eskalasi harga material konstruksi, hingga pemilihan penyedia berkualifikasi tinggi tanpa sengketa hukum.'
  },
  {
    id: 'proj-smart-datacenter',
    title: 'Pengadaan Infrastruktur Cloud & Disaster Recovery Center (DRC)',
    category: 'it_tech',
    categoryLabel: 'Teknologi Informasi & Smart City',
    clientType: 'Pemerintah Kab/Kota',
    packageValue: 'Rp 28,7 Miliar',
    year: '2024',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    role: 'Agen Kontrak & Reviu HPS E-Purchasing',
    scope: [
      'Studi Kelayakan Spesifikasi Server, Storage Tier-3, dan Lisensi Keamanan Siber',
      'Negosiasi E-Purchasing E-Katalog LKPP bersama Distributor Tunggal Resmi',
      'Penyusunan Service Level Agreement (SLA 99.98%) dan Klausul Penalti Keterlambatan',
      'Pengujian UAT (User Acceptance Testing) dan Verifikasi Keaslian Barang (CoC)'
    ],
    keyAchievement: 'Penyelesaian Pengadaan 14 Hari Lebih Cepat, Penghematan Biaya Pemeliharaan 12% Per Tahun',
    complianceRate: '100% Sesuai Regulasi BSSN & LKPP',
    description: 'Menjembatani kebutuhan digitalisasi pemerintah daerah dengan regulasi e-katalog, memastikan spesifikasi teknologi canggih tidak melanggar asas persaingan sehat dan non-monopoli.'
  },
  {
    id: 'proj-jembatan-strategis',
    title: 'Pembangunan Jembatan Penghubung Kawasan Industri Strategis',
    category: 'construction',
    categoryLabel: 'Konstruksi & Infrastruktur Publik',
    clientType: 'Kementerian',
    packageValue: 'Rp 114,6 Miliar',
    year: '2023 - 2024',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    role: 'Pendampingan Manajemen Kontrak Multiyears',
    scope: [
      'Penyusunan Naskah Kontrak Multi-Tahun (Multiyears Contract) berpayung hukum Kemenkeu',
      'Reviu Kertas Kerja Analisis Harga Satuan Pekerjaan (AHSP) Spesial Pondasi Bore Pile',
      'Penetapan Matriks Manajemen Risiko & Mitigasi Force Majeure Bencana Alam',
      'Asistensi Rapat Pra-Pelaksanaan Pekerjaan (Pre-Construction Meeting / PCM)'
    ],
    keyAchievement: 'Pekerjaan Selesai Tepat Waktu Tanpa Keterlambatan Denda, Nilai Audit BPK Wajar Tanpa Pengecualian',
    complianceRate: '100% Standar PUPR & BPK RI',
    description: 'Memastikan proteksi hukum PPK dalam menghadapi fluktuasi harga material skala besar serta menjamin kepatuhan administrasi pencairan bertahap lintas tahun anggaran.'
  },
  {
    id: 'proj-eproc-bumn',
    title: 'Transformasi Digitalisasi E-Procurement & Good Corporate Governance',
    category: 'consultancy',
    categoryLabel: 'Jasa Konsultansi & GCG Korporasi',
    clientType: 'BUMN / BUMD',
    packageValue: 'Rp 14,2 Miliar',
    year: '2024',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    role: 'Konsultan Utama Perumusan Pedoman Pengadaan BUMN',
    scope: [
      'Penyusunan Peraturan Direksi tentang Pedoman Pengadaan Barang/Jasa BUMN',
      'Pembangunan Standar Operasional Prosedur (SOP) Vendor Management & Scoring',
      'Digitalisasi Vendor Portal dan Modul Evaluasi Penawaran Terotomasi',
      'Pelatihan dan Sertifikasi Internal 85 Anggota Panitia Pengadaan Perusahaan'
    ],
    keyAchievement: 'Memangkas Lead Time Pengadaan dari 45 Hari Menjadi 18 Hari, Efisiensi Opex BUMN 14,5%',
    complianceRate: '100% Selaras Permen BUMN & ISO 37001 (Anti Suap)',
    description: 'Membangun ekosistem pengadaan korporasi yang lincah (agile) namun tetap memiliki benteng kepatuhan hukum ketat sesuai standar pencegahan fraud dan korupsi.'
  },
  {
    id: 'proj-bimtek-nasional',
    title: 'Bimtek Terpadu Sertifikasi PBJ Level 1 & E-Katalog Versi 6',
    category: 'training',
    categoryLabel: 'Pelatihan & Sertifikasi PBJ',
    clientType: 'Badan Layanan Umum',
    packageValue: '450+ Peserta',
    year: '2024 - 2025',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
    role: 'Penyelenggara Resmi Lembaga Pelatihan Terakreditasi',
    scope: [
      'Penyelenggaraan Bimbingan Teknis Tatap Muka & Simulasi Ujian Sertifikasi LKPP',
      'Workshop Hands-On Penyusunan HPS Menggunakan Real-Market Quotation Data',
      'Praktik Langsung Pengoperasian SPSE 4.5 dan Fitur Mini-Kompetisi E-Katalog v6',
      'Bimbingan Konseling Kasus Nyata Sengketa Kontrak Bersama Narasumber Hakim/Jaksa'
    ],
    keyAchievement: 'Tingkat Kelulusan Sertifikasi 94.6% (Tertinggi Nasional), Indeks Kepuasan Peserta 4.92/5.0',
    complianceRate: 'Kurikulum Resmi Pusdiklat LKPP & BNSP',
    description: 'Mencetak ratusan personil Pejabat Pengadaan dan Pokja Pemilihan yang kompeten, berani mengambil keputusan secara akuntabel, dan menguasai regulasi terbaru.'
  },
  {
    id: 'proj-armada-logistik',
    title: 'Pengadaan Armada Angkutan Logistik & Alat Berat Kebersihan Kota',
    category: 'construction',
    categoryLabel: 'Peralatan & Transportasi',
    clientType: 'Pemerintah Kab/Kota',
    packageValue: 'Rp 36,5 Miliar',
    year: '2023',
    imageUrl: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=800&q=80',
    role: 'Agen Pemilihan & Verifikasi TKDN',
    scope: [
      'Verifikasi Sertifikat Bobot Manfaat Perusahaan (BMP) dan TKDN Kemenperin > 40%',
      'Uji Coba Lapangan (Field Testing) Daya Angkut & Emisi Standar EURO 4',
      'Pengawasan Jaminan Purna Jual (After-Sales Warranty 3 Tahun) & Ketersediaan Suku Cadang',
      'Dokumentasi BAST Digital Terintegrasi Aplikasi Aset Daerah (SIMDA Aset)'
    ],
    keyAchievement: 'Penyerapan Produk Dalam Negeri (TKDN) 52,4%, Penghargaan P3DN Tingkat Provinsi',
    complianceRate: '100% Mandatori Instruksi Presiden No. 2/2022',
    description: 'Mengoptimalkan pemenuhan target belanja produk dalam negeri instansi pemerintah sekaligus melindungi anggaran daerah dari produk impor ilegal tanpa jaminan purna jual.'
  }
];

export const PARTNERSHIP_WORKFLOW: import('../types').PartnershipStep[] = [
  {
    stepNumber: 1,
    title: 'Konsultasi & Identifikasi Kebutuhan',
    subtitle: 'Tahap Awal Penelaahan Paket Pengadaan',
    description: 'Instansi menyampaikan rincian paket pengadaan, rencana umum (RUP), pagu anggaran, serta kendala teknis atau keterbatasan SDM yang dihadapi via WhatsApp atau pertemuan langsung.',
    duration: '1 - 2 Hari Kerja',
    deliverables: 'Notulensi Telaah Awal & Rekomendasi Bentuk Kemitraan',
    iconName: 'MessageSquare'
  },
  {
    stepNumber: 2,
    title: 'Penyusunan MoU & Kontrak Agen Pengadaan',
    subtitle: 'Payung Hukum Berbasis Perpres 16/2018',
    description: 'Penyusunan naskah Nota Kesepahaman (MoU) atau Surat Perjanjian Kerja Sama Agen Pengadaan berdasarkan Peraturan LKPP No. 10 Tahun 2021 secara transparan dan akuntabel.',
    duration: '2 - 3 Hari Kerja',
    deliverables: 'Naskah Perjanjian Kerja Sama (PKS) & Surat Kuasa PA/KPA',
    iconName: 'FileSignature'
  },
  {
    stepNumber: 3,
    title: 'Eksekusi Tugas Pengadaan & Probity Advisory',
    subtitle: 'Pelaksanaan Reviu, Tender SPSE, atau Manajemen Kontrak',
    description: 'Tenaga Ahli bersertifikasi PT. Agen Pengadaan Nasional terjun langsung menjalankan seluruh tahapan pemilihan, verifikasi kualifikasi, negosiasi harga, dan pendampingan PPK.',
    duration: 'Sesuai Jadwal Tender / Proyek',
    deliverables: 'Kertas Kerja Reviu, Berita Acara Evaluasi, Naskah Kontrak Matang',
    iconName: 'Cpu'
  },
  {
    stepNumber: 4,
    title: 'Penyerahan Hasil & Pendampingan Audit',
    subtitle: 'Akuntabilitas Penuh & Perlindungan Hukum Pasca-Tender',
    description: 'Penyerahan seluruh arsip pengadaan yang tertata rapi sesuai standar audit, disertai pendampingan saat pemeriksaan internal APIP (Inspektorat) maupun eksternal (BPK RI).',
    duration: 'Hingga BAST & Audit Selesai',
    deliverables: 'Laporan Akhir Pelaksanaan Tugas & Dokumen Kesiapan Audit',
    iconName: 'ShieldCheck'
  }
];

