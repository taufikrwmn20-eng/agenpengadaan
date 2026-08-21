import React, { useState, useEffect } from 'react';
import { 
  Menu, X, MessageSquare, ChevronRight, Phone, Mail, 
  Clock, ShieldCheck
} from 'lucide-react';
import { Logo } from './Logo';
import { COMPANY_PROFILE } from '../data/procurementData';

interface NavbarProps {
  onOpenConsultation: (topic?: string) => void;
  activeSection: string;
  onNavigateHome?: (targetSectionId?: string) => void;
  onNavigateInformasi?: () => void;
  currentView?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenConsultation, 
  activeSection,
  onNavigateHome,
  onNavigateInformasi,
  currentView = 'home'
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId: string) => {
    setIsMobileMenuOpen(false);

    if (sectionId === 'informasi') {
      if (currentView !== 'home') {
        if (onNavigateHome) {
          onNavigateHome('informasi');
        }
      } else {
        scrollToSection('informasi');
      }
      return;
    }

    if (currentView !== 'home') {
      if (onNavigateHome) {
        onNavigateHome(sectionId);
      }
      return;
    }

    scrollToSection(sectionId);
  };

  const scrollToSection = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
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

  const navLinks = [
    { id: 'hero', label: 'Beranda' },
    { id: 'layanan', label: 'Layanan' },
    { id: 'tentang', label: 'Tentang Kami' },
    { id: 'informasi', label: 'Informasi' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40">
      {/* 1. Top Information Bar (Signature Corporate Design - Tatakreasindo style) */}
      <div className="bg-[#051E3C] text-slate-300 text-xs border-b border-blue-900/50 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between">
          {/* Left: Contact Info */}
          <div className="flex items-center gap-6">
            <a 
              href={`https://wa.me/${COMPANY_PROFILE.contact.whatsapp}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2 hover:text-emerald-300 transition-colors group"
            >
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Phone className="w-3 h-3 text-[#10B981] group-hover:scale-110 transition-transform" />
              </span>
              <span className="font-bold text-slate-100">{COMPANY_PROFILE.contact.whatsappFormatted}</span>
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                (Gratis Konsultasi 24 Jam)
              </span>
            </a>
            <a 
              href={`mailto:${COMPANY_PROFILE.contact.email}`} 
              className="flex items-center gap-1.5 hover:text-blue-300 transition-colors text-slate-300"
            >
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              <span>{COMPANY_PROFILE.contact.email}</span>
            </a>
          </div>

          {/* Right: Legal Badge & Social Links */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-amber-300 text-[11px] font-medium bg-amber-400/10 px-3 py-0.5 rounded-full border border-amber-400/20">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Perpres No. 46/2025 (Perubahan Kedua Perpres 16/2018) & LKPP</span>
            </div>
            <div className="flex items-center gap-2.5 border-l border-blue-900/80 pl-3">
              <a 
                href={COMPANY_PROFILE.contact.instagramUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-rose-300 transition-colors text-[11px] font-medium"
              >
                Instagram
              </a>
              <span className="text-slate-600">•</span>
              <a 
                href={COMPANY_PROFILE.contact.tiktokUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-white transition-colors text-[11px] font-medium"
              >
                TikTok
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Sticky Navbar */}
      <div 
        className={`transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-md py-3 border-b border-slate-200/80' 
            : 'bg-white py-3.5 border-b border-slate-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); handleNavClick('hero'); }}
              className="flex items-center group cursor-pointer"
              aria-label="PT. Agen Pengadaan Nasional"
            >
              <Logo size="md" />
            </a>

            {/* Desktop Navigation Links - 4 Menu: Beranda, Layanan, Tentang Kami, Informasi */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-1.5 bg-slate-50/80 p-1 rounded-2xl border border-slate-200/60">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`px-4 py-2 text-xs lg:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                      isActive 
                        ? 'text-[#073B75] bg-white shadow-xs border border-slate-200/80' 
                        : 'text-slate-600 hover:text-[#073B75] hover:bg-slate-100/60'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </nav>

            {/* Quick Action Consultation Button */}
            <div className="hidden sm:flex items-center gap-3">
              <button
                onClick={() => onOpenConsultation('Konsultasi Cepat dari Navbar')}
                className="flex items-center gap-2 py-2.5 px-4.5 bg-[#073B75] hover:bg-[#052C59] text-white font-bold text-xs rounded-xl shadow-md shadow-[#073B75]/20 hover:shadow-lg hover:shadow-[#073B75]/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-orange-400" />
                <span>Konsultasi Pengadaan</span>
              </button>
            </div>

            {/* Mobile Hamburger Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2.5 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-2 animate-fadeIn shadow-xl">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full text-left px-4 py-3 text-sm font-bold rounded-xl transition flex items-center justify-between ${
                  activeSection === link.id
                    ? 'text-[#073B75] bg-blue-50/80 border border-blue-200/80'
                    : 'text-slate-800 hover:bg-slate-50'
                }`}
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            ))}

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenConsultation('Konsultasi via WhatsApp Mobile');
                }}
                className="w-full py-3.5 px-4 bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md"
              >
                <MessageSquare className="w-4 h-4" />
                Konsultasi WhatsApp Tenaga Ahli (24/7)
              </button>

              <div className="flex items-center justify-center gap-4 text-xs text-slate-600 pt-2">
                <a href={COMPANY_PROFILE.contact.instagramUrl} target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-rose-600">
                  Instagram
                </a>
                <span>•</span>
                <a href={COMPANY_PROFILE.contact.tiktokUrl} target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-black">
                  TikTok
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
