import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { AboutSection } from './components/AboutSection';
import { InformationSection } from './components/InformationSection';
import { InformationListView } from './components/InformationListView';
import { InformationDetailView } from './components/InformationDetailView';
import { AdminCMS } from './components/AdminCMS';
import { Footer } from './components/Footer';
import { WhatsAppConsultModal } from './components/WhatsAppConsultModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { CertificateVerificationModal } from './components/CertificateVerificationModal';
import { InformationItem } from './types';
import { getStoredArticles, fetchArticlesAsync } from './data/informationData';

type ViewMode = 'home' | 'blog-list' | 'blog-detail' | 'admin';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [selectedArticleSlug, setSelectedArticleSlug] = useState<string>('');
  const [articles, setArticles] = useState<InformationItem[]>([]);
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
  const [consultationTopic, setConsultationTopic] = useState('Konsultasi Pengadaan Barang/Jasa');
  const [activeSection, setActiveSection] = useState('hero');

  // Certificate Verification Modal State (Auto open if URL has ?verify=... or ?sertifikat=...)
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [verifyQuery, setVerifyQuery] = useState('');

  // Check URL query parameters on load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const verifyParam = urlParams.get('verify') || urlParams.get('sertifikat') || urlParams.get('cert');
      if (verifyParam) {
        if (verifyParam !== 'undefined' && verifyParam !== 'null') {
          setVerifyQuery(verifyParam);
        } else {
          setVerifyQuery('');
        }
        setIsVerifyModalOpen(true);
      }
    }
  }, []);

  // Load articles from localStorage/default dataset and sync with Cloud
  const refreshArticles = () => {
    const data = getStoredArticles();
    setArticles(data);
    
    // Asynchronously fetch from cloud
    fetchArticlesAsync().then((cloudData) => {
      if (Array.isArray(cloudData)) {
        setArticles(cloudData);
      }
    });
  };

  useEffect(() => {
    refreshArticles();
  }, []);

  // Handle URL hash routing (e.g., #admin, #informasi, #artikel-slug)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#/, '');
      const pathname = window.location.pathname;

      if (hash === 'admin' || pathname === '/admin') {
        setCurrentView('admin');
        window.scrollTo(0, 0);
      } else if (hash.startsWith('artikel/')) {
        const slug = hash.replace('artikel/', '');
        setSelectedArticleSlug(slug);
        setCurrentView('blog-detail');
        window.scrollTo(0, 0);
      } else if (hash === 'informasi' || hash === 'blog' || hash === 'semua-informasi') {
        setCurrentView('blog-list');
        window.scrollTo(0, 0);
      } else {
        setCurrentView('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Track active section for navbar highlighting on home view (4 Menu: Beranda, Layanan, Tentang Kami, Informasi)
  useEffect(() => {
    if (currentView !== 'home') return;

    const handleScroll = () => {
      const sections = ['hero', 'layanan', 'tentang', 'informasi'];
      const scrollPos = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentView]);

  const handleOpenConsultation = (topic?: string) => {
    if (topic) {
      setConsultationTopic(topic);
    }
    setIsConsultModalOpen(true);
  };

  const handleScrollToSection = (sectionId: string) => {
    if (currentView !== 'home') {
      setCurrentView('home');
      window.location.hash = '';
      setTimeout(() => {
        performScroll(sectionId);
      }, 100);
      return;
    }
    performScroll(sectionId);
  };

  const performScroll = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 70;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleSelectArticle = (slug: string) => {
    setSelectedArticleSlug(slug);
    setCurrentView('blog-detail');
    window.location.hash = `artikel/${slug}`;
    window.scrollTo(0, 0);
  };

  const handleViewAllArticles = () => {
    setCurrentView('blog-list');
    window.location.hash = 'informasi';
    window.scrollTo(0, 0);
  };

  const handleBackToHome = (targetSectionId?: string) => {
    setCurrentView('home');
    window.location.hash = '';
    if (targetSectionId) {
      setTimeout(() => performScroll(targetSectionId), 100);
    } else {
      window.scrollTo(0, 0);
    }
  };

  const handleOpenAdmin = () => {
    setCurrentView('admin');
    window.location.hash = 'admin';
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-[#073B75] selection:text-white">
      {/* 1. Header & Navigation (4 Menu: Beranda, Layanan, Tentang Kami, Informasi) */}
      {currentView !== 'admin' && (
        <Navbar
          onOpenConsultation={handleOpenConsultation}
          activeSection={currentView === 'home' ? activeSection : 'informasi'}
          onNavigateHome={handleBackToHome}
          onNavigateInformasi={handleViewAllArticles}
          currentView={currentView}
        />
      )}

      {/* 2. Main Content Routing */}
      <main className="flex-grow">
        {currentView === 'admin' ? (
          <AdminCMS
            articles={articles}
            onRefreshArticles={refreshArticles}
            onCloseAdmin={() => handleBackToHome()}
            onPreviewArticle={handleSelectArticle}
          />
        ) : currentView === 'blog-detail' ? (
          <InformationDetailView
            slug={selectedArticleSlug}
            allArticles={articles}
            onSelectArticle={handleSelectArticle}
            onBackToList={handleViewAllArticles}
            onBackToHome={() => handleBackToHome()}
            onRefreshArticles={refreshArticles}
          />
        ) : currentView === 'blog-list' ? (
          <InformationListView
            articles={articles}
            onSelectArticle={handleSelectArticle}
            onBackToHome={() => handleBackToHome()}
            onOpenAdmin={handleOpenAdmin}
          />
        ) : (
          /* Default: Home View */
          <>
            {/* Beranda (Hero Section) */}
            <Hero
              onOpenConsultation={handleOpenConsultation}
              onScrollToSection={handleScrollToSection}
            />

            {/* Layanan (Daftar 6 Layanan Pengadaan) */}
            <ServicesSection
              onOpenConsultation={handleOpenConsultation}
            />

            {/* Tentang Kami (Profil Perusahaan, Landasan Hukum, Kredensial, Sektor Klien) */}
            <AboutSection
              onOpenConsultation={handleOpenConsultation}
            />

            {/* Informasi & Blog (Disembunyikan sementara) */}
            {/* <InformationSection
              articles={articles}
              onSelectArticle={handleSelectArticle}
              onViewAll={handleViewAllArticles}
            /> */}
          </>
        )}
      </main>

      {/* 3. Footer (Always present on client views) */}
      {currentView !== 'admin' && (
        <Footer
          onOpenConsultation={handleOpenConsultation}
          onScrollToSection={handleScrollToSection}
          onOpenAdmin={handleOpenAdmin}
          onOpenVerification={() => {
            setVerifyQuery('');
            setIsVerifyModalOpen(true);
          }}
        />
      )}

      {/* 4. WhatsApp Consultation Form Modal */}
      <WhatsAppConsultModal
        isOpen={isConsultModalOpen}
        onClose={() => setIsConsultModalOpen(false)}
        defaultTopic={consultationTopic}
      />

      {/* 5. Persistent Floating WhatsApp Action Widget */}
      {currentView !== 'admin' && (
        <FloatingWhatsApp
          onOpenConsultationModal={() => handleOpenConsultation('Konsultasi Langsung via WhatsApp')}
        />
      )}

      {/* 6. Public Certificate Verification Modal */}
      <CertificateVerificationModal
        isOpen={isVerifyModalOpen}
        initialQuery={verifyQuery}
        onClose={() => {
          setIsVerifyModalOpen(false);
          // Clean URL param gracefully if present
          if (typeof window !== 'undefined' && window.location.search.includes('verify')) {
            window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
          }
        }}
      />
    </div>
  );
}
