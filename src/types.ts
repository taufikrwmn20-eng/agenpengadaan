export interface ServiceItem {
  id: string;
  number: number;
  title: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  category: 'direct' | 'dashboard' | 'procurement' | 'contract' | 'assistance' | 'training';
  imageUrl?: string;
  isDirectWhatsApp?: boolean;
  features: string[];
  benefits: string[];
  targetAudience: string[];
  deliverables: string[];
  regulations: string[];
}

export interface ITKPIndicator {
  id: string;
  name: string;
  category: 'Pemanfaatan Sistem' | 'Kualifikasi SDM' | 'Kematangan UKPBJ';
  weight: number; // percentage
  currentScore: number;
  targetScore: number;
  status: 'optimal' | 'warning' | 'critical';
  description: string;
  formula: string;
  recommendations: string[];
}

export interface RegionData {
  id: string;
  name: string;
  category: 'Kementerian' | 'Lembaga' | 'Pemerintah Provinsi' | 'Pemerintah Kab/Kota';
  itkpScore: number;
  grade: 'Sangat Baik' | 'Baik' | 'Cukup' | 'Kurang';
  ePurchasingRatio: number;
  tenderDiniRatio: number;
  sirupAnnounced: number;
  sdmCertified: number;
  ukpbjLevel: number;
  year: number;
}

export interface ExpertTeamMember {
  name: string;
  role: string;
  certification: string[];
  experienceYears: number;
  specialization: string;
  bio: string;
}

export interface ConsultationFormState {
  fullName: string;
  agencyOrCompany: string;
  phone: string;
  email: string;
  serviceCategory: string;
  procurementStage: string;
  estimatedBudget: string;
  urgencyLevel: 'Biasa' | 'Penting' | 'Sangat Mendesak (Segera Butuh Pendampingan)';
  notes: string;
}

export interface TrackRecordProject {
  id: string;
  title: string;
  category: 'construction' | 'it_tech' | 'medical' | 'consultancy' | 'training';
  categoryLabel: string;
  clientType: 'Kementerian' | 'Pemerintah Provinsi' | 'Pemerintah Kab/Kota' | 'BUMN / BUMD' | 'Badan Layanan Umum';
  packageValue: string;
  year: string;
  imageUrl: string;
  role: string;
  scope: string[];
  keyAchievement: string;
  complianceRate: string;
  description: string;
}

export interface PartnershipStep {
  stepNumber: number;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  deliverables: string;
  iconName: string;
}

export interface ArticleCommentReply {
  id: string;
  authorName: string;
  role?: string;
  comment: string;
  createdAt: string;
}

export interface ArticleComment {
  id: string;
  authorName: string;
  email: string;
  comment: string;
  createdAt: string;
  isHidden?: boolean;
  replies?: ArticleCommentReply[];
}

export interface InformationItem {
  id: string;
  slug: string;
  title: string;
  category: 'Artikel' | 'Berita' | 'Kegiatan';
  author: string;
  date: string;
  day: string;
  month: string;
  readTime: string;
  imageUrl: string;
  imageCaption?: string;
  summary: string;
  content: string;
  postViews: number;
  comments: ArticleComment[];
  createdAt: number;
}

