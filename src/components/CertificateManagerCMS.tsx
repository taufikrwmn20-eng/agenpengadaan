import React, { useState, useEffect, useRef } from 'react';
import { 
  Award, Upload, Download, FileSpreadsheet, QrCode, CheckCircle2, 
  AlertCircle, Trash2, Eye, RefreshCw, Sparkles, Layers, Sliders, 
  Move, Plus, X, Search, FileText, Check, Copy, ExternalLink, ShieldCheck,
  FileType, Calendar, Edit2, Building2, BookmarkPlus, ArrowRight, ArrowLeft,
  ChevronRight, Filter, CloudUpload
} from 'lucide-react';
import { 
  CertificateItem, CertificateMappingConfig, CertificateEvent 
} from '../types';
import { 
  DEFAULT_MAPPING_CONFIG, 
  downloadExcelTemplate, 
  parseExcelOrCsvFile, 
  renderCertificateToCanvas, 
  generateBatchZipFile, 
  getSavedCertificatesFromLocalStorage, 
  saveCertificatesToLocalStorage, 
  saveCertificatesToCloud, 
  getVerificationUrl,
  getSavedEventsFromLocalStorage,
  addOrUpdateEventInLocalStorage,
  deleteEventFromLocalStorage
} from '../data/certificateData';
import { convertPdfFirstPageToImage } from '../utils/pdfHelper';

interface CertificateManagerCMSProps {
  onShowToast: (msg: string) => void;
  onPreviewVerifyModal: (certificateId: string) => void;
}

export const CertificateManagerCMS: React.FC<CertificateManagerCMSProps> = ({
  onShowToast,
  onPreviewVerifyModal
}) => {
  // 4-Tier Hierarchical Flow:
  // 1: Tabel Kegiatan (Tampilan Default saat Sertifikat Digital Dibuka)
  // 2: Form Kegiatan (Nama & Tanggal), Upload Template (PDF/Gambar) & Pengaturan Koordinat (Canvas Mapping)
  // 3: Upload Nama Peserta untuk Cetak (Excel / CSV / Manual) & Preview
  // 4: List Data Sertifikat yang Sudah Tercetak & Tombol Download Sertifikat (.ZIP / PNG)
  const [activeTier, setActiveTier] = useState<1 | 2 | 3 | 4>(1);

  // Master Data Events List & Active Event
  const [events, setEvents] = useState<CertificateEvent[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [isEditingEvent, setIsEditingEvent] = useState<boolean>(false);

  // Event Metadata
  const [eventName, setEventName] = useState('Bimbingan Teknis Strategis Mitigasi Risiko Hukum Kontrak Pengadaan');
  const [issueDate, setIssueDate] = useState(() => {
    const d = new Date();
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  });
  const [batchName, setBatchName] = useState('BATCH-01-2026');
  const [organizerName, setOrganizerName] = useState('PT. Agen Pengadaan Nasional');

  // Template Image State (Mandatory Upload - No Default)
  const [templateImage, setTemplateImage] = useState<string>('');
  const [templateLoading, setTemplateLoading] = useState<boolean>(false);
  const [templateLoadingMsg, setTemplateLoadingMsg] = useState<string>('Memuat template...');
  const [templateFileInfo, setTemplateFileInfo] = useState<{
    name: string;
    type: 'none' | 'image' | 'pdf';
    details?: string;
  }>({
    name: 'Belum Ada Template',
    type: 'none',
    details: 'Wajib diupload (PDF / Gambar)'
  });
  const templateInputRef = useRef<HTMLInputElement>(null);

  // Mapping Config State
  const [mapping, setMapping] = useState<CertificateMappingConfig>(() => {
    try {
      const saved = localStorage.getItem('apn_cert_mapping_cfg');
      if (saved) {
        const parsed = JSON.parse(saved);
        // If legacy prefix "Nomor: " is present, clear it to avoid duplication with template text
        if (parsed?.certificateNumber?.prefix === 'Nomor: ') {
          parsed.certificateNumber.prefix = '';
        }
        return parsed;
      }
      return DEFAULT_MAPPING_CONFIG;
    } catch {
      return DEFAULT_MAPPING_CONFIG;
    }
  });

  const [activeElementToEdit, setActiveElementToEdit] = useState<
    'recipientName' | 'certificateNumber' | 'qrCode'
  >('recipientName');

  // Participants Data List (for Tier 3)
  const [participants, setParticipants] = useState<Array<{
    id: string;
    certificateNumber: string;
    recipientName: string;
    recipientAgency?: string;
    recipientRole?: string;
  }>>([]);

  // Excel Upload state
  const [isParsingExcel, setIsParsingExcel] = useState(false);
  const excelInputRef = useRef<HTMLInputElement>(null);

  // Manual Add Participant Modal state
  const [manualCertNo, setManualCertNo] = useState('');
  const [manualName, setManualName] = useState('');
  const [manualAgency, setManualAgency] = useState('');
  const [manualRole, setManualRole] = useState('Peserta');
  const [showManualAddModal, setShowManualAddModal] = useState(false);

  // Preview Canvas State
  const [previewParticipantIndex, setPreviewParticipantIndex] = useState(0);
  const [generatedPreviewUrl, setGeneratedPreviewUrl] = useState<string>('');
  const [isRenderingPreview, setIsRenderingPreview] = useState(false);

  // Save to DB & Export ZIP states
  const [isSavingToDb, setIsSavingToDb] = useState(false);
  const [isGeneratingZip, setIsGeneratingZip] = useState(false);
  const [zipProgress, setZipProgress] = useState({ processed: 0, total: 0 });

  // History & Verification States (Tier 4)
  const [savedCertificates, setSavedCertificates] = useState<CertificateItem[]>([]);
  const [historySearch, setHistorySearch] = useState('');
  const [historyFilterStatus, setHistoryFilterStatus] = useState<'all' | 'valid' | 'revoked'>('all');
  const [historyFilterEvent, setHistoryFilterEvent] = useState<string>('all');
  const [isSyncingToCloud, setIsSyncingToCloud] = useState(false);
  const [isSyncedToCloud, setIsSyncedToCloud] = useState(false);

  const handleSyncAllCertificatesToCloud = async () => {
    setIsSyncingToCloud(true);
    try {
      const list = getSavedCertificatesFromLocalStorage();
      if (list.length === 0) {
        onShowToast('Tidak ada data sertifikat untuk dikirim ke Cloud.');
        return;
      }

      // Heal and ensure every certificate has a valid non-null ID
      let didFixIds = false;
      const sanitizedList: CertificateItem[] = list.map((item, idx) => {
        if (!item.id || typeof item.id !== 'string' || !item.id.trim()) {
          didFixIds = true;
          const cleanNum = (item.certificateNumber || `APN-${idx + 1}`).replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
          const generatedId = `cert-${cleanNum || 'apn'}-${idx + 1}`;
          return {
            ...item,
            id: generatedId,
            verificationUrl: getVerificationUrl(generatedId)
          };
        }
        return item;
      });

      if (didFixIds) {
        saveCertificatesToLocalStorage(sanitizedList);
        setSavedCertificates(sanitizedList);
      }

      const res = await saveCertificatesToCloud(sanitizedList);
      if (res.success) {
        setIsSyncedToCloud(true);
        onShowToast(`Sukses! ${res.count} sertifikat berhasil disimpan ke Supabase Cloud & siap verifikasi QR.`);
      } else {
        onShowToast(`Peringatan: ${res.error || 'Gagal menyimpan ke Supabase Cloud'}`);
      }
    } catch (err: any) {
      onShowToast(`Gagal: ${err?.message || 'Error koneksi database'}`);
    } finally {
      setIsSyncingToCloud(false);
    }
  };

  // In-App Confirmation Modal State (replaces window.confirm to avoid iframe sandbox restrictions)
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    onConfirm: () => void;
  } | null>(null);

  // Load Saved Events & History from LocalStorage on mount
  useEffect(() => {
    const savedEvents = getSavedEventsFromLocalStorage();
    setEvents(savedEvents);

    if (savedEvents.length > 0) {
      const firstEvt = savedEvents[0];
      setSelectedEventId(firstEvt.id);
      setEventName(firstEvt.name);
      setIssueDate(firstEvt.date);
      setBatchName(firstEvt.batchCode || 'BATCH-01-2026');
      setOrganizerName(firstEvt.organizer || 'PT. Agen Pengadaan Nasional');
      if (firstEvt.templateImage) {
        setTemplateImage(firstEvt.templateImage);
        setTemplateFileInfo({
          name: firstEvt.templateFileName || `Template ${firstEvt.name}`,
          type: firstEvt.templateFileName?.toLowerCase().endsWith('.pdf') ? 'pdf' : 'image',
          details: 'Tersimpan untuk kegiatan ini'
        });
      }
      if (firstEvt.mappingConfig) {
        const cfg = { ...firstEvt.mappingConfig };
        if (cfg.certificateNumber && cfg.certificateNumber.prefix === 'Nomor: ') {
          cfg.certificateNumber.prefix = '';
        }
        setMapping(cfg);
      }
    }
    loadSavedHistory();
  }, []);

  const loadSavedHistory = () => {
    const list = getSavedCertificatesFromLocalStorage();
    setSavedCertificates(list);
    // Silent background auto-sync so QR code verification always stays up-to-date
    if (list.length > 0) {
      saveCertificatesToCloud(list).catch(() => {});
    }
  };

  // Helper to count printed certificates per event
  const getEventCertCount = (evt: CertificateEvent) => {
    return savedCertificates.filter(c => c.eventName === evt.name || c.batchId === evt.id).length;
  };

  // Select an Event and load its metadata & template
  const handleSelectEvent = (evtId: string) => {
    setSelectedEventId(evtId);
    const found = events.find(e => e.id === evtId);
    if (found) {
      setEventName(found.name);
      setIssueDate(found.date);
      setBatchName(found.batchCode || '');
      setOrganizerName(found.organizer || 'PT. Agen Pengadaan Nasional');
      if (found.templateImage) {
        setTemplateImage(found.templateImage);
        setTemplateFileInfo({
          name: found.templateFileName || `Template ${found.name}`,
          type: found.templateFileName?.toLowerCase().endsWith('.pdf') ? 'pdf' : 'image',
          details: 'Tersimpan untuk kegiatan ini'
        });
      } else {
        setTemplateImage('');
        setTemplateFileInfo({
          name: 'Belum Ada Template',
          type: 'none',
          details: 'Wajib diupload (PDF / Gambar)'
        });
      }
      if (found.mappingConfig) {
        const cfg = { ...found.mappingConfig };
        if (cfg.certificateNumber && cfg.certificateNumber.prefix === 'Nomor: ') {
          cfg.certificateNumber.prefix = '';
        }
        if (!cfg.paperSize) {
          cfg.paperSize = 'auto';
        }
        setMapping(cfg);
      }
    }
  };

  // Trigger Action: Start Adding New Event (Tier 2 with blank form)
  const handleStartAddNewEvent = () => {
    setIsEditingEvent(false);
    setSelectedEventId('');
    setEventName('');
    const d = new Date();
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    setIssueDate(`${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`);
    setBatchName(`BATCH-${String(events.length + 1).padStart(2, '0')}-${d.getFullYear()}`);
    setOrganizerName('PT. Agen Pengadaan Nasional');
    setTemplateImage('');
    setTemplateFileInfo({
      name: 'Belum Ada Template',
      type: 'none',
      details: 'Wajib diupload (PDF / Gambar)'
    });
    setActiveTier(2);
  };

  // Trigger Action: Edit Event & Template (Tier 2 with loaded event)
  const handleStartEditEvent = (evt: CertificateEvent) => {
    setIsEditingEvent(true);
    handleSelectEvent(evt.id);
    setActiveTier(2);
  };

  // Trigger Action: Print/Upload Participants for Event (Tier 3)
  const handleStartPrintForEvent = (evt: CertificateEvent) => {
    handleSelectEvent(evt.id);
    if (evt.templateImage) {
      setActiveTier(3);
    } else {
      onShowToast(`Kegiatan "${evt.name}" belum memiliki template sertifikat. Silakan unggah template terlebih dahulu di Tingkat 2.`);
      setActiveTier(2);
    }
  };

  // Trigger Action: View Printed Certificates for Event (Tier 4)
  const handleViewPrintedForEvent = (evt: CertificateEvent) => {
    handleSelectEvent(evt.id);
    setHistoryFilterEvent(evt.name);
    loadSavedHistory();
    setActiveTier(4);
  };

  // Delete Event with In-App Confirmation Modal
  const handleDeleteEvent = (id: string, name: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Hapus Kegiatan Pelatihan?',
      message: `Apakah Anda yakin ingin menghapus kegiatan "${name}"? Seluruh sertifikat yang telah diterbitkan akan tetap aman tersimpan di arsip riwayat, namun kegiatan ini akan dihapus dari daftar master kegiatan.`,
      confirmText: 'Ya, Hapus Kegiatan',
      onConfirm: () => {
        const updated = deleteEventFromLocalStorage(id);
        setEvents(updated);
        if (selectedEventId === id) {
          if (updated.length > 0) {
            handleSelectEvent(updated[0].id);
          } else {
            setSelectedEventId('');
            setEventName('');
            setTemplateImage('');
          }
        }
        onShowToast(`Kegiatan "${name}" berhasil dihapus.`);
        setConfirmDialog(null);
      }
    });
  };

  // Save Event and proceed to Tier 3 (Upload Peserta)
  const handleSaveEventAndProceedToTier3 = () => {
    if (!eventName.trim()) {
      onShowToast('Mohon isi Nama Kegiatan terlebih dahulu.');
      return;
    }
    if (!issueDate.trim()) {
      onShowToast('Mohon isi Tanggal Pelaksanaan kegiatan.');
      return;
    }
    if (!templateImage) {
      onShowToast('Wajib mengunggah berkas template sertifikat (PDF atau Gambar) sebelum melanjutkan ke data peserta.');
      return;
    }

    const existingEvt = events.find(e => e.id === selectedEventId);
    const newEvtId = selectedEventId || 'evt-' + Date.now();
    const newEvent: CertificateEvent = {
      id: newEvtId,
      name: eventName.trim(),
      date: issueDate.trim(),
      batchCode: (batchName || '').trim(),
      organizer: (organizerName || 'PT. Agen Pengadaan Nasional').trim(),
      templateImage: templateImage,
      templateFileName: templateFileInfo.name !== 'Belum Ada Template' ? templateFileInfo.name : 'Template Sertifikat',
      mappingConfig: mapping,
      createdAt: existingEvt?.createdAt || Date.now()
    };

    const updatedList = addOrUpdateEventInLocalStorage(newEvent);
    setEvents(updatedList);
    setSelectedEventId(newEvtId);
    onShowToast(`Kegiatan "${newEvent.name}" dan template berhasil disimpan!`);
    setActiveTier(3);
  };

  // Persist mapping to localStorage and link to active event
  useEffect(() => {
    try {
      localStorage.setItem('apn_cert_mapping_cfg', JSON.stringify(mapping));
      if (selectedEventId) {
        const currentEvt = events.find(e => e.id === selectedEventId);
        if (currentEvt && currentEvt.mappingConfig !== mapping) {
          const updatedEvt = { ...currentEvt, mappingConfig: mapping };
          addOrUpdateEventInLocalStorage(updatedEvt);
        }
      }
    } catch {
      // Ignore storage errors
    }
  }, [mapping, selectedEventId]);

  // Render Realtime Preview Canvas when mapping, participant, or template changes
  useEffect(() => {
    if (!templateImage) {
      setGeneratedPreviewUrl('');
      return;
    }

    let isMounted = true;
    setIsRenderingPreview(true);

    const activeParticipant = participants[previewParticipantIndex] || {
      id: 'demo-cert-id',
      certificateNumber: 'APN/SERT/2026/001',
      recipientName: 'Dr. H. Rahmat Hidayat, M.T.',
      recipientAgency: "",
      recipientRole: 'Peserta'
    };

    renderCertificateToCanvas(
      templateImage,
      {
        id: activeParticipant.id,
        certificateNumber: activeParticipant.certificateNumber,
        recipientName: activeParticipant.recipientName,
        eventName: eventName || 'Nama Kegiatan Pelatihan PBJ',
        issueDate: issueDate || '14 September 2026'
      },
      mapping,
      1280, // Render in 720p for fast interactive canvas preview
      720
    ).then((url) => {
      if (isMounted) {
        setGeneratedPreviewUrl(url);
        setIsRenderingPreview(false);
      }
    }).catch((err) => {
      console.error('Error rendering preview:', err);
      if (isMounted) setIsRenderingPreview(false);
    });

    return () => {
      isMounted = false;
    };
  }, [templateImage, mapping, previewParticipantIndex, participants, eventName, issueDate]);

  // Handle Template Upload (Supports PDF and Images: JPG, PNG, WEBP)
  const handleUploadTemplate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isImage = file.type.startsWith('image/') || /\.(jpe?g|png|webp)$/i.test(file.name);

    if (!isPdf && !isImage) {
      onShowToast('Mohon pilih file PDF dokumen (.pdf) atau file gambar (JPG, PNG, WEBP).');
      if (e.target) e.target.value = '';
      return;
    }

    setTemplateLoading(true);

    try {
      if (isPdf) {
        setTemplateLoadingMsg(`Mengonversi halaman 1 dari PDF "${file.name}" ke resolusi tinggi...`);
        const { dataUrl, width, height, totalPages } = await convertPdfFirstPageToImage(file);
        setTemplateImage(dataUrl);
        setTemplateFileInfo({
          name: file.name,
          type: 'pdf',
          details: `PDF Halaman 1 dari ${totalPages} • HD ${width}×${height}px`
        });

        // Save to selected event if exists
        if (selectedEventId) {
          const currentEvt = events.find(ev => ev.id === selectedEventId);
          if (currentEvt) {
            const updatedEvt: CertificateEvent = {
              ...currentEvt,
              templateImage: dataUrl,
              templateFileName: file.name,
              mappingConfig: mapping
            };
            const updatedList = addOrUpdateEventInLocalStorage(updatedEvt);
            setEvents(updatedList);
          }
        }

        onShowToast(`Template PDF "${file.name}" berhasil dikonversi dan siap digunakan!`);
      } else {
        setTemplateLoadingMsg(`Memuat gambar template "${file.name}"...`);
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target?.result as string;
          setTemplateImage(dataUrl);
          setTemplateFileInfo({
            name: file.name,
            type: 'image',
            details: `Gambar • ${(file.size / 1024).toFixed(1)} KB`
          });

          // Save to selected event if exists
          if (selectedEventId) {
            const currentEvt = events.find(ev => ev.id === selectedEventId);
            if (currentEvt) {
              const updatedEvt: CertificateEvent = {
                ...currentEvt,
                templateImage: dataUrl,
                templateFileName: file.name,
                mappingConfig: mapping
              };
              const updatedList = addOrUpdateEventInLocalStorage(updatedEvt);
              setEvents(updatedList);
            }
          }

          onShowToast(`Template gambar "${file.name}" berhasil diunggah!`);
          setTemplateLoading(false);
        };
        reader.readAsDataURL(file);
        return;
      }
    } catch (err: any) {
      console.error('Error handling template file:', err);
      onShowToast('Gagal memproses file template: ' + (err?.message || 'Format tidak didukung'));
    } finally {
      setTemplateLoading(false);
      if (e.target) e.target.value = '';
    }
  };

  // Remove Template with In-App Confirmation
  const handleRemoveTemplate = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Hapus Template Sertifikat?',
      message: 'Template sertifikat saat ini akan dikosongkan. Anda harus mengunggah template baru (PDF atau Gambar) untuk melakukan pencetakan sertifikat.',
      confirmText: 'Kosongkan Template',
      onConfirm: () => {
        setTemplateImage('');
        setTemplateFileInfo({
          name: 'Belum Ada Template',
          type: 'none',
          details: 'Wajib diupload (PDF / Gambar)'
        });
        if (selectedEventId) {
          const currentEvt = events.find(ev => ev.id === selectedEventId);
          if (currentEvt) {
            const updatedEvt: CertificateEvent = {
              ...currentEvt,
              templateImage: '',
              templateFileName: ''
            };
            const updatedList = addOrUpdateEventInLocalStorage(updatedEvt);
            setEvents(updatedList);
          }
        }
        onShowToast('Template sertifikat berhasil dikosongkan.');
        setConfirmDialog(null);
      }
    });
  };

  // Excel / CSV Upload Handler
  const handleUploadExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsingExcel(true);
    try {
      const parsedParticipants = await parseExcelOrCsvFile(file);
      if (parsedParticipants.length === 0) {
        onShowToast('Tidak ada data peserta yang ditemukan dalam berkas spreadsheet ini. Pastikan format kolom sesuai.');
        return;
      }

      setParticipants(parsedParticipants);
      setPreviewParticipantIndex(0);
      onShowToast(`Berhasil mengimpor ${parsedParticipants.length} data peserta dari Excel!`);
    } catch (err: any) {
      onShowToast('Gagal membaca file Excel/CSV: ' + (err?.message || 'Format tidak didukung'));
    } finally {
      setIsParsingExcel(false);
      if (e.target) e.target.value = '';
    }
  };

  // Add Manual Participant
  const handleAddManualParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim()) {
      onShowToast('Nama peserta wajib diisi!');
      return;
    }

    const newP = {
      id: 'cert-' + Math.random().toString(36).substring(2, 9),
      certificateNumber: manualCertNo.trim() || `APN/SERT/2026/${String(participants.length + 1).padStart(3, '0')}`,
      recipientName: manualName.trim(),
      recipientAgency: "",
      
    };

    setParticipants(prev => [...prev, newP]);
    setManualCertNo('');
    setManualName('');
    setManualAgency('');
    setManualRole('Peserta');
    setShowManualAddModal(false);
    onShowToast(`Peserta "${newP.recipientName}" berhasil ditambahkan ke daftar.`);
  };

  // Delete Single Participant from List
  const handleDeleteParticipant = (id: string, name?: string) => {
    setParticipants(prev => prev.filter(p => p.id !== id));
    setPreviewParticipantIndex(0);
    onShowToast(name ? `Peserta "${name}" dihapus dari daftar cetak.` : 'Peserta dihapus dari daftar cetak.');
  };

  // Clear All Participants with In-App Confirmation
  const handleClearAllParticipants = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Kosongkan Daftar Peserta?',
      message: `Apakah Anda yakin ingin menghapus seluruh (${participants.length}) data peserta dari daftar cetak ini?`,
      confirmText: 'Kosongkan Daftar',
      onConfirm: () => {
        setParticipants([]);
        setPreviewParticipantIndex(0);
        onShowToast('Daftar peserta berhasil dikosongkan.');
        setConfirmDialog(null);
      }
    });
  };

  // Print & Publish all participants (Tier 3 -> Tier 4)
  const handlePublishAndProceedToTier4 = async () => {
    if (participants.length === 0) {
      onShowToast('Belum ada data peserta untuk dicetak.');
      return;
    }
    if (!templateImage) {
      onShowToast('Template sertifikat belum diunggah.');
      return;
    }

    setIsSavingToDb(true);
    const now = Date.now();
    const batchId = selectedEventId || 'batch-' + now;

    const certificateItemsToSave: CertificateItem[] = participants.map((p, idx) => {
      const pId = (p as any).id || `cert-${(p.certificateNumber || 'apn').replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}-${idx + 1}`;
      return {
        id: pId,
        certificateNumber: p.certificateNumber,
        recipientName: p.recipientName,
        recipientAgency: "",
        recipientRole: p.recipientRole,
        eventName: eventName || 'Kegiatan APN',
        issueDate: issueDate || '2026',
        status: 'valid',
        batchId,
        batchName: batchName || eventName,
        // DO NOT STORE templateImageUrl and mappingConfig to prevent LocalStorage QuotaExceededError
        // templateImageUrl: templateImage,
        // mappingConfig: mapping,
        verificationUrl: getVerificationUrl(pId),
        createdAt: now
      };
    });

    try {
      // 1. Save to LocalStorage
      const currentSaved = getSavedCertificatesFromLocalStorage();
      const updatedList = [...certificateItemsToSave, ...currentSaved];
      saveCertificatesToLocalStorage(updatedList);
      setSavedCertificates(updatedList);

      // 2. Sync to Supabase Cloud
      const cloudRes = await saveCertificatesToCloud(certificateItemsToSave);

      if (cloudRes.success) {
        onShowToast(`Sukses! ${certificateItemsToSave.length} sertifikat berhasil dicetak, terdaftar di Supabase Cloud & siap diverifikasi QR.`);
      } else {
        onShowToast(`Tersimpan lokal (${certificateItemsToSave.length} sertifikat). Siap diunduh.`);
      }

      // Filter Tier 4 to this event and switch view
      setHistoryFilterEvent(eventName || 'Kegiatan APN');
      setActiveTier(4);
    } catch (err: any) {
      console.error('Error saving certificates:', err);
      onShowToast('Sertifikat berhasil dicetak dan disimpan (Namun mungkin gagal disimpan secara permanen karena melebihi batas penyimpanan).');
      setHistoryFilterEvent(eventName || 'Kegiatan APN');
      setActiveTier(4);
    } finally {
      setIsSavingToDb(false);
    }
  };

  // Download Single Current Certificate as High-Res PNG (from Tier 3 Preview)
  const handleDownloadSinglePng = async (participantIndex: number) => {
    const p = participants[participantIndex];
    if (!p || !templateImage) return;

    try {
      onShowToast(`Menyiapkan sertifikat resolusi tinggi untuk ${p.recipientName}...`);
      const highResPng = await renderCertificateToCanvas(
        templateImage,
        {
          id: p.id,
          certificateNumber: p.certificateNumber,
          recipientName: p.recipientName,
          eventName,
          issueDate
        },
        mapping,
        1920,
        1080
      );

      const link = document.createElement('a');
      link.href = highResPng;
      const cleanName = p.recipientName.replace(/[^a-zA-Z0-9_\-]/g, '_');
      const cleanNo = p.certificateNumber.replace(/[^a-zA-Z0-9_\-]/g, '_');
      link.download = `Sertifikat_${cleanNo}_${cleanName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      onShowToast('Sertifikat berhasil diunduh!');
    } catch (err) {
      onShowToast('Gagal mengunduh sertifikat.');
    }
  };

  // Download Single Certificate from Tier 4 (Historical Archive)
  const handleDownloadHistoricalSinglePng = async (item: CertificateItem) => {
    const matchedEvent = events.find(e => e.id === item.batchId || e.name === item.eventName);
    const tmpl = item.templateImageUrl || matchedEvent?.templateImage || templateImage;
    if (!tmpl) {
      onShowToast('Template gambar tidak ditemukan untuk kegiatan ini. Silakan pasang template terlebih dahulu.');
      return;
    }
    const mappingCfg = item.mappingConfig || matchedEvent?.mappingConfig || mapping;

    try {
      onShowToast(`Menyiapkan sertifikat resolusi tinggi untuk ${item.recipientName}...`);
      const highResPng = await renderCertificateToCanvas(
        tmpl,
        {
          id: item.id,
          certificateNumber: item.certificateNumber,
          recipientName: item.recipientName,
          eventName: item.eventName,
          issueDate: item.issueDate
        },
        mappingCfg,
        1920,
        1080
      );

      const link = document.createElement('a');
      link.href = highResPng;
      const cleanName = item.recipientName.replace(/[^a-zA-Z0-9_\-]/g, '_');
      const cleanNo = item.certificateNumber.replace(/[^a-zA-Z0-9_\-]/g, '_');
      link.download = `Sertifikat_${cleanNo}_${cleanName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      onShowToast('Sertifikat berhasil diunduh!');
    } catch (err) {
      console.error('Error downloading certificate:', err);
      onShowToast('Gagal mengunduh gambar sertifikat.');
    }
  };

  // Download All Certificates as ZIP (Tier 4)
  const handleDownloadAllZipFromTier4 = async () => {
    const certsToDownload = filteredHistory;
    if (certsToDownload.length === 0) {
      onShowToast('Tidak ada data sertifikat yang memenuhi filter untuk diunduh.');
      return;
    }

    // Find appropriate template
    const matchedEvent = events.find(e => e.name === historyFilterEvent || e.id === selectedEventId);
    const tmpl = matchedEvent?.templateImage || templateImage || certsToDownload[0]?.templateImageUrl;

    if (!tmpl) {
      onShowToast('Template gambar sertifikat belum tersedia untuk membuat berkas ZIP massal.');
      return;
    }

    setIsGeneratingZip(true);
    setZipProgress({ processed: 0, total: certsToDownload.length });

    try {
      const zipBlob = await generateBatchZipFile(
        tmpl,
        certsToDownload,
        matchedEvent?.mappingConfig || mapping,
        (processed, total) => {
          setZipProgress({ processed, total });
        }
      );

      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      const safeBatchName = (historyFilterEvent !== 'all' ? historyFilterEvent : 'Semua_Sertifikat_APN').replace(/[^a-zA-Z0-9_\-]/g, '_');
      link.download = `${safeBatchName}_(${certsToDownload.length}_Sertifikat).zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      onShowToast(`File ZIP berisi ${certsToDownload.length} sertifikat berhasil diunduh!`);
    } catch (err) {
      console.error('Error generating zip:', err);
      onShowToast('Terjadi kesalahan saat memproses berkas ZIP.');
    } finally {
      setIsGeneratingZip(false);
    }
  };

  // Toggle Certificate Revocation Status in History
  const handleToggleCertificateStatus = (id: string, currentStatus: 'valid' | 'revoked' | 'expired') => {
    const newStatus = currentStatus === 'valid' ? 'revoked' : 'valid';
    const updated = savedCertificates.map(c => c.id === id ? { ...c, status: newStatus as any } : c);
    setSavedCertificates(updated);
    saveCertificatesToLocalStorage(updated);
    saveCertificatesToCloud(updated.filter(c => c.id === id));
    onShowToast(`Status sertifikat diubah menjadi ${newStatus.toUpperCase()}`);
  };

  // Delete certificate from history with In-App Confirmation
  const handleDeleteFromHistory = (id: string, certNo?: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Hapus Arsip Sertifikat?',
      message: `Apakah Anda yakin ingin menghapus sertifikat ${certNo ? `"${certNo}"` : 'ini'} dari arsip? Tautan dan QR code publik tidak akan lagi dapat memverifikasi sertifikat ini.`,
      confirmText: 'Hapus dari Arsip',
      onConfirm: () => {
        const updated = savedCertificates.filter(c => c.id !== id);
        setSavedCertificates(updated);
        saveCertificatesToLocalStorage(updated);
        onShowToast('Sertifikat berhasil dihapus dari arsip.');
        setConfirmDialog(null);
      }
    });
  };

  // Filtered History for Tier 4
  const filteredHistory = savedCertificates.filter(c => {
    const matchQuery = 
      c.recipientName.toLowerCase().includes(historySearch.toLowerCase()) ||
      c.certificateNumber.toLowerCase().includes(historySearch.toLowerCase()) ||
      c.eventName.toLowerCase().includes(historySearch.toLowerCase());
    
    const matchStatus = 
      historyFilterStatus === 'all' || c.status === historyFilterStatus;

    const matchEvent = 
      historyFilterEvent === 'all' || c.eventName === historyFilterEvent;

    return matchQuery && matchStatus && matchEvent;
  });

  return (
    <div className="space-y-6">
      {/* Module Header & Stepper Navigation */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
                Sistem Terverifikasi Digital
              </span>
              <span className="text-xs text-slate-500 font-medium">• PT. Agen Pengadaan Nasional</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
              <Award className="w-6 h-6 text-[#073B75]" />
              Penerbitan &amp; Verifikasi Sertifikat Digital
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Alur kerja bertingkat untuk mengelola kegiatan, mengunggah template, mapping koordinat nama &amp; QR, upload data peserta, hingga unduhan sertifikat massal (.ZIP).
            </p>
          </div>
        </div>

        {/* 4-Tier Horizontal Stepper */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
          {/* Step 1: Tabel Kegiatan */}
          <button
            onClick={() => setActiveTier(1)}
            className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex items-center gap-3 ${
              activeTier === 1
                ? 'bg-[#073B75] border-[#073B75] text-white shadow-md shadow-blue-900/10'
                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/80 shadow-xs'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
              activeTier === 1 ? 'bg-amber-400 text-slate-950 font-black shadow-xs' : 'bg-slate-100 text-slate-700 border border-slate-200'
            }`}>
              1
            </div>
            <div className="min-w-0">
              <p className={`text-xs font-bold truncate leading-tight ${activeTier === 1 ? 'text-white' : 'text-slate-900'}`}>Tabel Kegiatan</p>
              <p className={`text-[11px] truncate ${activeTier === 1 ? 'text-blue-100' : 'text-slate-500'}`}>Daftar kegiatan ({events.length})</p>
            </div>
          </button>

          {/* Step 2: Form Kegiatan & Template Koordinat */}
          <button
            onClick={() => {
              if (!selectedEventId && events.length > 0) {
                handleSelectEvent(events[0].id);
              }
              setActiveTier(2);
            }}
            className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex items-center gap-3 ${
              activeTier === 2
                ? 'bg-[#073B75] border-[#073B75] text-white shadow-md shadow-blue-900/10'
                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/80 shadow-xs'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
              activeTier === 2 ? 'bg-amber-400 text-slate-950 font-black shadow-xs' : 'bg-slate-100 text-slate-700 border border-slate-200'
            }`}>
              2
            </div>
            <div className="min-w-0">
              <p className={`text-xs font-bold truncate leading-tight ${activeTier === 2 ? 'text-white' : 'text-slate-900'}`}>Kegiatan &amp; Template</p>
              <p className={`text-[11px] truncate ${activeTier === 2 ? 'text-blue-100' : 'text-slate-500'}`}>Form &amp; mapping koordinat</p>
            </div>
          </button>

          {/* Step 3: Upload Peserta untuk Cetak */}
          <button
            onClick={() => {
              if (!templateImage) {
                onShowToast('Pilih atau unggah template sertifikat di Tingkat 2 terlebih dahulu.');
                setActiveTier(2);
                return;
              }
              setActiveTier(3);
            }}
            className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex items-center gap-3 ${
              activeTier === 3
                ? 'bg-[#073B75] border-[#073B75] text-white shadow-md shadow-blue-900/10'
                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/80 shadow-xs'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
              activeTier === 3 ? 'bg-amber-400 text-slate-950 font-black shadow-xs' : 'bg-slate-100 text-slate-700 border border-slate-200'
            }`}>
              3
            </div>
            <div className="min-w-0">
              <p className={`text-xs font-bold truncate leading-tight ${activeTier === 3 ? 'text-white' : 'text-slate-900'}`}>Upload Peserta</p>
              <p className={`text-[11px] truncate ${activeTier === 3 ? 'text-blue-100' : 'text-slate-500'}`}>Data peserta ({participants.length})</p>
            </div>
          </button>

          {/* Step 4: List Data Sertifikat Tercetak & Unduhan */}
          <button
            onClick={() => {
              loadSavedHistory();
              setActiveTier(4);
            }}
            className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex items-center gap-3 ${
              activeTier === 4
                ? 'bg-[#073B75] border-[#073B75] text-white shadow-md shadow-blue-900/10'
                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/80 shadow-xs'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
              activeTier === 4 ? 'bg-amber-400 text-slate-950 font-black shadow-xs' : 'bg-slate-100 text-slate-700 border border-slate-200'
            }`}>
              4
            </div>
            <div className="min-w-0">
              <p className={`text-xs font-bold truncate leading-tight ${activeTier === 4 ? 'text-white' : 'text-slate-900'}`}>Sertifikat Tercetak</p>
              <p className={`text-[11px] truncate ${activeTier === 4 ? 'text-blue-100' : 'text-slate-500'}`}>Arsip &amp; unduh ZIP ({savedCertificates.length})</p>
            </div>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TINGKAT 1: TABEL KEGIATAN (TAMPILAN AWAL / DEFAULT)                       */}
      {/* ========================================================================= */}
      {activeTier === 1 && (
        <div className="space-y-6">
          {/* Header & Stats Banner */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-[#073B75]" />
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                  Master Data Tabel Kegiatan
                </h3>
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Setiap kegiatan memiliki template sertifikat khusus, pengaturan posisi koordinat (Nama, Nomor, QR), dan daftar peserta masing-masing.
              </p>
            </div>

            <button
              onClick={handleStartAddNewEvent}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs transition flex items-center gap-2 shadow-sm hover:shadow cursor-pointer whitespace-nowrap self-start md:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tambah Kegiatan Baru</span>
            </button>
          </div>

          {/* Table Container */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-4 py-3.5 w-12 text-center">No.</th>
                    <th className="px-4 py-3.5">Nama Kegiatan</th>
                    <th className="px-4 py-3.5">Tanggal Pelaksanaan</th>
                    <th className="px-4 py-3.5">Status Template</th>
                    <th className="px-4 py-3.5 text-center">Sertifikat Tercetak</th>
                    <th className="px-4 py-3.5 text-right">Aksi Alur Kerja</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {events.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-slate-500 text-xs font-medium">
                        Belum ada kegiatan terdaftar. Silakan klik tombol <strong className="text-amber-600 font-bold">+ Tambah Kegiatan Baru</strong> di atas untuk membuat kegiatan dan mengunggah template.
                      </td>
                    </tr>
                  ) : (
                    events.map((evt, idx) => {
                      const isSelected = selectedEventId === evt.id;
                      const certCount = getEventCertCount(evt);
                      return (
                        <tr 
                          key={evt.id} 
                          className={`transition ${
                            isSelected ? 'bg-blue-50/70 hover:bg-blue-50' : 'hover:bg-slate-50/80'
                          }`}
                        >
                          <td className="px-4 py-4 text-center font-mono text-slate-500 font-bold text-xs">
                            {idx + 1}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-sm">{evt.name}</span>
                              {isSelected && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
                                  Aktif
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-slate-500 font-normal block mt-0.5">
                              Penyelenggara: {evt.organizer || 'PT. Agen Pengadaan Nasional'}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-slate-700 font-semibold text-xs whitespace-nowrap">
                            {evt.date}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            {evt.templateImage ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                Template Siap
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-300">
                                <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                                Wajib Upload
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-4 text-center whitespace-nowrap">
                            {certCount > 0 ? (
                              <button
                                onClick={() => handleViewPrintedForEvent(evt)}
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#073B75] border border-blue-200 hover:bg-blue-100 transition cursor-pointer"
                                title="Klik untuk melihat sertifikat tercetak"
                              >
                                <span>{certCount} Sertifikat</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <span className="text-slate-400 font-medium text-xs">Belum Ada</span>
                            )}
                          </td>
                          <td className="px-4 py-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                              {/* Action 1: Print / Upload Participants */}
                              <button
                                onClick={() => handleStartPrintForEvent(evt)}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                                title="Lanjut cetak data peserta untuk kegiatan ini"
                              >
                                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                                <span>+ Cetak Peserta</span>
                              </button>

                              {/* Action 2: Edit & Template */}
                              <button
                                onClick={() => handleStartEditEvent(evt)}
                                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                                title="Edit Detail Kegiatan & Atur Template Koordinat"
                              >
                                <Sliders className="w-3.5 h-3.5 text-[#073B75]" />
                                <span>Atur Template</span>
                              </button>

                              {/* Action 3: Delete */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteEvent(evt.id, evt.name);
                                }}
                                className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 border border-rose-200 rounded-lg transition cursor-pointer active:scale-95"
                                title="Hapus Kegiatan"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 font-medium">
              <span>Total {events.length} kegiatan terdaftar.</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TINGKAT 2: FORM KEGIATAN, UPLOAD TEMPLATE & PENGATURAN KOORDINAT          */}
      {/* ========================================================================= */}
      {activeTier === 2 && (
        <div className="space-y-6">
          {/* Breadcrumb & Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveTier(1)}
              className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1.5 font-bold transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>&larr; Kembali ke Tabel Kegiatan</span>
            </button>
            <div className="text-xs text-slate-500 font-medium">
              Tingkat 2 dari 4: <span className="text-[#073B75] font-bold">Informasi Kegiatan &amp; Template Koordinat</span>
            </div>
          </div>

          {/* Form Input Data Kegiatan */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Calendar className="w-4 h-4 text-[#073B75]" />
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                {isEditingEvent ? 'Perbarui Data Kegiatan' : 'Tambah Kegiatan Baru'}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
              <div className="md:col-span-7">
                <label className="block font-bold text-slate-800 mb-1.5">
                  Nama Kegiatan *
                </label>
                <input
                  type="text"
                  required
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="Contoh: Bimtek Mitigasi Risiko Hukum Kontrak PBJ"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-xs"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Sebagai identitas kegiatan &amp; metadata verifikasi publik (tidak dicetak di atas kanvas template).
                </span>
              </div>

              <div className="md:col-span-5">
                <label className="block font-bold text-slate-800 mb-1.5">
                  Tanggal Pelaksanaan / Terbit *
                </label>
                <input
                  type="text"
                  required
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  placeholder="Contoh: 15 September 2026"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-xs"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Metadata tanggal untuk pencatatan arsip &amp; scan QR.
                </span>
              </div>
            </div>
          </div>

          {/* Visual Mapping Live Canvas & Coordinate Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Visual Canvas Live Preview */}
            <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${templateImage ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
                  <h3 className="text-sm font-bold text-slate-900">Visual Mapping Live Canvas</h3>
                </div>
                <div className="flex items-center flex-wrap gap-2 text-xs">
                  {templateImage && (
                    <button
                      onClick={handleRemoveTemplate}
                      disabled={templateLoading}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-[11px] font-bold transition cursor-pointer disabled:opacity-50 flex items-center gap-1"
                      title="Kosongkan template sertifikat saat ini"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                      <span>Hapus Template</span>
                    </button>
                  )}
                  <button
                    onClick={() => templateInputRef.current?.click()}
                    disabled={templateLoading}
                    className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{templateImage ? 'Ganti Template (PDF / Gambar)' : 'Upload Template (PDF / Gambar)'}</span>
                  </button>
                  <input
                    type="file"
                    ref={templateInputRef}
                    onChange={handleUploadTemplate}
                    accept="application/pdf,.pdf,image/png,image/jpeg,image/webp"
                    className="hidden"
                  />
                </div>
              </div>

              {/* Active Template Status Bar */}
              <div className="mb-3 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 truncate">
                  {templateFileInfo.type === 'pdf' ? (
                    <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-300 text-[10px] font-bold shrink-0 flex items-center gap-1">
                      <FileType className="w-3 h-3 text-rose-600" />
                      PDF Document
                    </span>
                  ) : templateFileInfo.type === 'image' ? (
                    <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 border border-blue-300 text-[10px] font-bold shrink-0">
                      Gambar Kustom
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-300 text-[10px] font-bold shrink-0 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-rose-600" />
                      Template Kosong
                    </span>
                  )}
                  <span className="font-bold text-slate-800 truncate text-[11px]">
                    {templateFileInfo.name}
                  </span>
                  {templateFileInfo.details && (
                    <span className="text-[10px] text-slate-500 shrink-0">
                      ({templateFileInfo.details})
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold shrink-0">
                    Ukuran: {mapping.paperSize === 'A4' ? 'A4 (297×210 mm)' : mapping.paperSize === 'F4' ? 'F4 / Folio (330×215 mm)' : 'Auto'}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium hidden sm:inline-block">
                  Mendukung PDF Dokumen, JPG, PNG
                </span>
              </div>

              {/* Canvas Container */}
              <div className={`relative w-full ${
                mapping.paperSize === 'A4' ? 'aspect-[297/210]' : mapping.paperSize === 'F4' ? 'aspect-[330/215]' : 'aspect-[16/9]'
              } bg-slate-100 rounded-xl overflow-hidden border border-slate-300 flex items-center justify-center group shadow-inner transition-all duration-200`}>
                {templateLoading ? (
                  <div className="absolute inset-0 bg-white/90 backdrop-blur-xs flex flex-col items-center justify-center z-20 text-center p-4">
                    <div className="w-9 h-9 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                    <p className="text-xs font-bold text-slate-900">{templateLoadingMsg}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Memproses rasterisasi vektor &amp; penyesuaian resolusi</p>
                  </div>
                ) : isRenderingPreview ? (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10 text-xs text-blue-700 font-bold gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                    <span>Memperbarui posisi elemen...</span>
                  </div>
                ) : null}

                {templateImage && generatedPreviewUrl ? (
                  <img
                    src={generatedPreviewUrl}
                    alt="Certificate Live Canvas"
                    className="w-full h-full object-contain pointer-events-none select-none drop-shadow-sm"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-6 max-w-md">
                    <div className="w-14 h-14 rounded-2xl bg-white border border-dashed border-slate-300 shadow-xs flex items-center justify-center mb-3">
                      <Upload className="w-7 h-7 text-amber-500" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mb-1">
                      Template Sertifikat Belum Diunggah
                    </h4>
                    <p className="text-xs text-slate-600 mb-4 leading-relaxed font-normal">
                      Sistem memerlukan berkas template desain sertifikat Anda. Silakan unggah dokumen sertifikat dalam format <span className="text-amber-700 font-bold">PDF</span> atau <span className="text-blue-700 font-bold">Gambar (JPG/PNG)</span>.
                    </p>
                    <button
                      onClick={() => templateInputRef.current?.click()}
                      disabled={templateLoading}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Pilih Berkas Template Sekarang</span>
                    </button>
                  </div>
                )}

                {/* Visual Hotspot Marker indicator for the currently active element */}
                {templateImage && (
                  <div 
                    className="absolute border-2 border-dashed border-amber-500 bg-amber-500/15 pointer-events-none rounded transition-all duration-150"
                    style={{
                      left: `${mapping[activeElementToEdit === 'qrCode' ? 'qrCode' : activeElementToEdit].x}%`,
                      top: `${mapping[activeElementToEdit === 'qrCode' ? 'qrCode' : activeElementToEdit].y}%`,
                      transform: 'translate(-50%, -50%)',
                      width: activeElementToEdit === 'qrCode' ? '12%' : '40%',
                      height: activeElementToEdit === 'qrCode' ? '18%' : '8%'
                    }}
                  >
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-amber-500 text-slate-950 font-black text-[10px] rounded whitespace-nowrap shadow-md">
                      Posisi: {activeElementToEdit === 'recipientName' ? 'Nama Peserta' : activeElementToEdit === 'certificateNumber' ? 'No. Sertifikat' : 'QR Code'}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1.5 font-medium">
                  <Move className="w-3.5 h-3.5 text-amber-600" />
                  Pilih elemen di sebelah kanan, lalu sesuaikan slider posisi X &amp; Y untuk penempatan yang presisi.
                </span>
              </div>
            </div>

            {/* Right Column: Mapping Coordinate Controls */}
            <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#073B75]" />
                  Pengaturan Mapping Elemen
                </h3>
              </div>

              {/* Opsi Ukuran Sertifikat: A4 dan F4 */}
              <div className="p-3 bg-gradient-to-br from-slate-50 to-blue-50/40 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#073B75]" />
                    Ukuran Kertas Sertifikat:
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-[#073B75] border border-blue-200">
                    {mapping.paperSize === 'A4' ? 'A4 (297 × 210 mm)' : mapping.paperSize === 'F4' ? 'F4 / Folio (330 × 215 mm)' : 'Auto (Template Asli)'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setMapping(prev => ({ ...prev, paperSize: 'A4' }));
                      onShowToast('Ukuran sertifikat diatur ke A4 (297 × 210 mm)');
                    }}
                    className={`py-1.5 px-2 rounded-lg font-bold border transition text-center cursor-pointer flex flex-col items-center justify-center ${
                      mapping.paperSize === 'A4'
                        ? 'bg-[#073B75] text-white border-[#073B75] shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xs">A4</span>
                    <span className={`text-[9px] ${mapping.paperSize === 'A4' ? 'text-blue-200' : 'text-slate-400'}`}>297 × 210 mm</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMapping(prev => ({ ...prev, paperSize: 'F4' }));
                      onShowToast('Ukuran sertifikat diatur ke F4 / Folio (330 × 215 mm)');
                    }}
                    className={`py-1.5 px-2 rounded-lg font-bold border transition text-center cursor-pointer flex flex-col items-center justify-center ${
                      mapping.paperSize === 'F4'
                        ? 'bg-[#073B75] text-white border-[#073B75] shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xs">F4 (Folio)</span>
                    <span className={`text-[9px] ${mapping.paperSize === 'F4' ? 'text-blue-200' : 'text-slate-400'}`}>330 × 215 mm</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMapping(prev => ({ ...prev, paperSize: 'auto' }));
                      onShowToast('Ukuran sertifikat diatur ke Auto (Sesuai Template Asli)');
                    }}
                    className={`py-1.5 px-2 rounded-lg font-bold border transition text-center cursor-pointer flex flex-col items-center justify-center ${
                      !mapping.paperSize || mapping.paperSize === 'auto'
                        ? 'bg-[#073B75] text-white border-[#073B75] shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xs">Auto</span>
                    <span className={`text-[9px] ${!mapping.paperSize || mapping.paperSize === 'auto' ? 'text-blue-200' : 'text-slate-400'}`}>Rasio Template</span>
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">
                  Pilih ukuran standar cetak (A4 atau F4/Folio) untuk resolusi tinggi (300 DPI) saat ekspor PNG &amp; ZIP massal.
                </p>
              </div>

              {/* Element Selector Tabs: Nama Peserta, No. Sertifikat, QR Code */}
              <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs">
                <button
                  onClick={() => setActiveElementToEdit('recipientName')}
                  className={`py-2 px-1 rounded-lg font-bold transition text-center cursor-pointer text-[11px] ${
                    activeElementToEdit === 'recipientName'
                      ? 'bg-[#073B75] text-white shadow-xs'
                      : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  Nama Peserta
                </button>
                <button
                  onClick={() => setActiveElementToEdit('certificateNumber')}
                  className={`py-2 px-1 rounded-lg font-bold transition text-center cursor-pointer text-[11px] ${
                    activeElementToEdit === 'certificateNumber'
                      ? 'bg-[#073B75] text-white shadow-xs'
                      : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  No. Sertifikat
                </button>
                <button
                  onClick={() => setActiveElementToEdit('qrCode')}
                  className={`py-2 px-1 rounded-lg font-bold transition text-center cursor-pointer text-[11px] ${
                    activeElementToEdit === 'qrCode'
                      ? 'bg-[#073B75] text-white shadow-xs'
                      : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  QR Code
                </button>
              </div>

              {/* CONTROLS: FOR TEXT (Nama Peserta / No Sertifikat) */}
              {activeElementToEdit !== 'qrCode' && (
                <div className="space-y-4 pt-1">
                  {/* Position X Slider */}
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                      <span>Posisi Horizontal (X):</span>
                      <span className="text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded font-mono font-bold text-xs">{mapping[activeElementToEdit].x}%</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="95"
                      step="1"
                      value={mapping[activeElementToEdit].x}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setMapping(prev => ({
                          ...prev,
                          [activeElementToEdit]: { ...prev[activeElementToEdit], x: val }
                        }));
                      }}
                      className="w-full accent-blue-600 bg-slate-200 rounded-lg h-2"
                    />
                  </div>

                  {/* Position Y Slider */}
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                      <span>Posisi Vertikal (Y):</span>
                      <span className="text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded font-mono font-bold text-xs">{mapping[activeElementToEdit].y}%</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="95"
                      step="1"
                      value={mapping[activeElementToEdit].y}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setMapping(prev => ({
                          ...prev,
                          [activeElementToEdit]: { ...prev[activeElementToEdit], y: val }
                        }));
                      }}
                      className="w-full accent-blue-600 bg-slate-200 rounded-lg h-2"
                    />
                  </div>

                  {/* Font Size Slider */}
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                      <span>Ukuran Huruf (Font Size):</span>
                      <span className="text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded font-mono font-bold text-xs">{mapping[activeElementToEdit].fontSize} px</span>
                    </div>
                    <input
                      type="range"
                      min="14"
                      max="90"
                      step="1"
                      value={mapping[activeElementToEdit].fontSize}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setMapping(prev => ({
                          ...prev,
                          [activeElementToEdit]: { ...prev[activeElementToEdit], fontSize: val }
                        }));
                      }}
                      className="w-full accent-blue-600 bg-slate-200 rounded-lg h-2"
                    />
                  </div>

                  {/* Color & Alignment */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Warna Huruf</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={mapping[activeElementToEdit].color}
                          onChange={(e) => {
                            const val = e.target.value;
                            setMapping(prev => ({
                              ...prev,
                              [activeElementToEdit]: { ...prev[activeElementToEdit], color: val }
                            }));
                          }}
                          className="w-8 h-8 rounded border border-slate-300 bg-white cursor-pointer shadow-xs"
                        />
                        <span className="text-xs font-mono font-bold text-slate-800">{mapping[activeElementToEdit].color}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Perataan Teks</label>
                      <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
                        {(['left', 'center', 'right'] as const).map(align => (
                          <button
                            key={align}
                            type="button"
                            onClick={() => {
                              setMapping(prev => ({
                                ...prev,
                                [activeElementToEdit]: { ...prev[activeElementToEdit], textAlign: align }
                              }));
                            }}
                            className={`py-1 rounded font-bold capitalize ${
                              mapping[activeElementToEdit].textAlign === align
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            {align[0].toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Font Family & Weight */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Ketebalan Font</label>
                      <select
                        value={mapping[activeElementToEdit].fontWeight}
                        onChange={(e) => {
                          const val = e.target.value;
                          setMapping(prev => ({
                            ...prev,
                            [activeElementToEdit]: { ...prev[activeElementToEdit], fontWeight: val }
                          }));
                        }}
                        className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-900 font-medium"
                      >
                        <option value="normal">Normal</option>
                        <option value="600">Semi Bold</option>
                        <option value="bold">Bold (Tebal)</option>
                        <option value="800">Extra Bold</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Jenis Font</label>
                      <select
                        value={mapping[activeElementToEdit].fontFamily}
                        onChange={(e) => {
                          const val = e.target.value;
                          setMapping(prev => ({
                            ...prev,
                            [activeElementToEdit]: { ...prev[activeElementToEdit], fontFamily: val }
                          }));
                        }}
                        className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-900 font-medium"
                      >
                        <option value="serif">Serif (Formal / Klasik)</option>
                        <option value="sans-serif">Sans-Serif (Modern)</option>
                      </select>
                    </div>
                  </div>

                  {/* Prefix (e.g. "Nomor: ") */}
                  {activeElementToEdit === 'certificateNumber' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Teks Awalan (Prefix)</label>
                      <input
                        type="text"
                        value={mapping.certificateNumber.prefix || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setMapping(prev => ({
                            ...prev,
                            certificateNumber: { ...prev.certificateNumber, prefix: val }
                          }));
                        }}
                        placeholder="Kosongkan jika template sudah ada teks Nomor"
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-900 font-medium"
                      />
                      <span className="text-[10px] text-slate-400 mt-0.5 block">Biarkan kosong agar hanya nomor seri yang dicetak.</span>
                    </div>
                  )}
                </div>
              )}

              {/* CONTROLS: FOR QR CODE */}
              {activeElementToEdit === 'qrCode' && (
                <div className="space-y-4 pt-1">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                      <span>Posisi Horizontal (X):</span>
                      <span className="text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded font-mono font-bold text-xs">{mapping.qrCode.x}%</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="95"
                      step="1"
                      value={mapping.qrCode.x}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setMapping(prev => ({
                          ...prev,
                          qrCode: { ...prev.qrCode, x: val }
                        }));
                      }}
                      className="w-full accent-blue-600 bg-slate-200 rounded-lg h-2"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                      <span>Posisi Vertikal (Y):</span>
                      <span className="text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded font-mono font-bold text-xs">{mapping.qrCode.y}%</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="95"
                      step="1"
                      value={mapping.qrCode.y}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setMapping(prev => ({
                          ...prev,
                          qrCode: { ...prev.qrCode, y: val }
                        }));
                      }}
                      className="w-full accent-blue-600 bg-slate-200 rounded-lg h-2"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                      <span>Ukuran QR Code:</span>
                      <span className="text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded font-mono font-bold text-xs">{mapping.qrCode.size} px</span>
                    </div>
                    <input
                      type="range"
                      min="80"
                      max="260"
                      step="10"
                      value={mapping.qrCode.size}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setMapping(prev => ({
                          ...prev,
                          qrCode: { ...prev.qrCode, size: val }
                        }));
                      }}
                      className="w-full accent-blue-600 bg-slate-200 rounded-lg h-2"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Warna QR Code</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={mapping.qrCode.colorDark || '#073B75'}
                        onChange={(e) => {
                          const val = e.target.value;
                          setMapping(prev => ({
                            ...prev,
                            qrCode: { ...prev.qrCode, colorDark: val }
                          }));
                        }}
                        className="w-8 h-8 rounded border border-slate-300 bg-white cursor-pointer shadow-xs"
                      />
                      <span className="text-xs font-mono font-bold text-slate-800">{mapping.qrCode.colorDark || '#073B75'}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900">
                    <p className="font-bold flex items-center gap-1.5 mb-1 text-blue-950">
                      <QrCode className="w-4 h-4 text-[#073B75]" />
                      Verifikasi Keaslian QR
                    </p>
                    QR Code otomatis mengarahkan kamera ponsel / scanner ke halaman verifikasi resmi PT. Agen Pengadaan Nasional.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Bottom Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <button
              onClick={() => setActiveTier(1)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              &larr; Batal &amp; Kembali ke Tabel Kegiatan
            </button>

            <button
              onClick={handleSaveEventAndProceedToTier3}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs transition flex items-center gap-2 cursor-pointer shadow-sm hover:shadow"
            >
              <span>Simpan &amp; Lanjut ke Data Peserta (Tingkat 3)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TINGKAT 3: UPLOAD NAMA PESERTA UNTUK CETAK                                */}
      {/* ========================================================================= */}
      {activeTier === 3 && (
        <div className="space-y-6">
          {/* Breadcrumb & Selected Event Banner */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveTier(2)}
              className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1.5 font-bold transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>&larr; Kembali ke Form Kegiatan &amp; Template</span>
            </button>
            <div className="text-xs text-slate-500 font-medium">
              Tingkat 3 dari 4: <span className="text-[#073B75] font-bold">Upload Data Peserta untuk Dicetak</span>
            </div>
          </div>

          {/* Active Event Summary Banner */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5 text-[#073B75]" />
              </div>
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-300 uppercase tracking-wider inline-block mb-0.5">Kegiatan Aktif</span>
                <h4 className="font-bold text-slate-900 text-sm">{eventName}</h4>
                <p className="text-xs text-slate-600">
                  Tanggal Pelaksanaan: <span className="text-slate-900 font-bold">{issueDate}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTier(2)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5 text-[#073B75]" />
                <span>Atur Ulang Mapping / Template</span>
              </button>
            </div>
          </div>

          {/* Toolbar: Upload Excel, Template, Manual Add */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                Daftar Peserta Siap Cetak ({participants.length} Orang)
              </h3>
              <p className="text-xs text-slate-600 mt-1 font-medium">
                Upload berkas Excel/CSV untuk memuat seluruh penerima, atau tambahkan peserta secara manual.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={downloadExcelTemplate}
                className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-xl transition flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Download className="w-4 h-4 text-emerald-600" />
                <span>Unduh Format Excel (2 Kolom)</span>
              </button>

              <button
                onClick={() => excelInputRef.current?.click()}
                disabled={isParsingExcel}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isParsingExcel ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                <span>{isParsingExcel ? 'Membaca Excel...' : 'Upload File Excel / CSV'}</span>
              </button>
              <input
                type="file"
                ref={excelInputRef}
                onChange={handleUploadExcel}
                accept=".xlsx,.xls,.csv"
                className="hidden"
              />

              <button
                onClick={() => setShowManualAddModal(true)}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-bold rounded-xl transition flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-slate-700" />
                <span>+ Input Manual</span>
              </button>
            </div>
          </div>

          {/* Grid Layout: Table Participants & Live Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Table of Participants */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                  Tabel Peserta Terdaftar
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Klik ikon mata untuk melihat preview cetak
                </span>
              </div>

              <div className="overflow-x-auto max-h-[420px] overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold uppercase tracking-wider text-[11px] sticky top-0 z-10">
                    <tr>
                      <th className="px-3.5 py-3 w-10 text-center">No</th>
                      <th className="px-3.5 py-3">No. Sertifikat</th>
                      <th className="px-3.5 py-3">Nama Peserta</th>
                      
                      <th className="px-3.5 py-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {participants.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-10 text-slate-500 font-medium text-xs">
                          Belum ada peserta. Silakan klik <strong className="text-emerald-700">Upload File Excel</strong> atau <strong className="text-slate-800">+ Input Manual</strong>.
                        </td>
                      </tr>
                    ) : (
                      participants.map((p, idx) => {
                        const isPreviewActive = previewParticipantIndex === idx;
                        return (
                          <tr 
                            key={p.id || idx} 
                            className={`transition ${
                              isPreviewActive ? 'bg-blue-50 font-semibold' : 'hover:bg-slate-50/80'
                            }`}
                          >
                            <td className="px-3.5 py-2.5 text-center font-mono text-slate-500 font-bold text-xs">{idx + 1}</td>
                            <td className="px-3.5 py-2.5">
                              <span className="font-mono text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-300 font-bold text-xs">
                                {p.certificateNumber}
                              </span>
                            </td>
                            <td className="px-3.5 py-2.5">
                              <span className="font-bold text-slate-900">{p.recipientName}</span>
                              
                            </td>
                                                        <td className="px-3.5 py-2.5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setPreviewParticipantIndex(idx)}
                                  className={`p-1.5 rounded-lg transition cursor-pointer ${
                                    isPreviewActive 
                                      ? 'bg-[#073B75] text-white font-bold shadow-xs' 
                                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                                  }`}
                                  title="Pratinjau Sertifikat Peserta Ini"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteParticipant(p.id, p.recipientName)}
                                  className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 border border-rose-200 rounded-lg transition cursor-pointer active:scale-95"
                                  title="Hapus Peserta"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              <div className="p-3.5 bg-slate-50 border-t border-slate-200 mt-auto flex items-center justify-between text-xs text-slate-600 font-medium">
                <span>{participants.length} peserta siap diterbitkan.</span>
                {participants.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearAllParticipants}
                    className="text-rose-600 font-bold hover:underline text-xs cursor-pointer"
                  >
                    Kosongkan Daftar
                  </button>
                )}
              </div>
            </div>

            {/* Right Column: Live Certificate Preview & Print Execution */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#073B75]" />
                  Pratinjau Cetak Terpilih
                </h3>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300">
                    {mapping.paperSize === 'A4' ? 'A4 (297×210 mm)' : mapping.paperSize === 'F4' ? 'F4 / Folio (330×215 mm)' : 'Auto (Template Asli)'}
                  </span>
                  {participants.length > 0 && (
                    <span className="text-xs font-mono font-bold text-[#073B75] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                      {previewParticipantIndex + 1} / {participants.length}
                    </span>
                  )}
                </div>
              </div>

              {/* Preview Image Box */}
              <div className={`relative w-full ${
                mapping.paperSize === 'A4' ? 'aspect-[297/210]' : mapping.paperSize === 'F4' ? 'aspect-[330/215]' : 'aspect-[16/9]'
              } bg-slate-100 rounded-xl overflow-hidden border border-slate-300 flex items-center justify-center shadow-inner transition-all duration-200`}>
                {generatedPreviewUrl ? (
                  <img
                    src={generatedPreviewUrl}
                    alt="Certificate Preview"
                    className="w-full h-full object-contain drop-shadow-sm"
                  />
                ) : (
                  <div className="text-xs text-slate-500 font-medium flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                    <span>Memproses pratinjau sertifikat...</span>
                  </div>
                )}
              </div>

              {participants.length > 0 && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <p className="font-bold text-slate-900 text-sm">{participants[previewParticipantIndex]?.recipientName}</p>
                  <p className="text-xs font-mono font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-300 inline-block">{participants[previewParticipantIndex]?.certificateNumber}</p>
                  <p className="text-xs text-slate-600 block">{participants[previewParticipantIndex]?.recipientAgency || 'PT. Agen Pengadaan Nasional'}</p>
                </div>
              )}

              {/* Quick Single Download for currently inspected participant */}
              {participants.length > 0 && (
                <button
                  onClick={() => handleDownloadSinglePng(previewParticipantIndex)}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-[#073B75]" />
                  <span>Download Contoh Sertifikat Ini (PNG)</span>
                </button>
              )}
            </div>
          </div>

          {/* Action Bottom Bar: Proceed to Print */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Siap Mencetak &amp; Menerbitkan Sertifikat?
              </h4>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                Sistem akan menerbitkan {participants.length} sertifikat resmi lengkap dengan kode QR verifikasi publik dan menyimpannya ke database.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTier(2)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                &larr; Kembali ke Template
              </button>

              <button
                onClick={handlePublishAndProceedToTier4}
                disabled={isSavingToDb || participants.length === 0}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-sm hover:shadow disabled:opacity-50"
              >
                {isSavingToDb ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Mencetak &amp; Menyimpan Database...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Cetak &amp; Terbitkan Sertifikat ({participants.length}) &rarr;</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TINGKAT 4: LIST DATA SERTIFIKAT TERCETAK & TOMBOL DOWNLOAD SERTIFIKAT     */}
      {/* ========================================================================= */}
      {activeTier === 4 && (
        <div className="space-y-6">
          {/* Breadcrumb & Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveTier(1)}
              className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1.5 font-bold transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>&larr; Kembali ke Tabel Kegiatan (Tingkat 1)</span>
            </button>
            <div className="text-xs text-slate-500 font-medium">
              Tingkat 4 dari 4: <span className="text-[#073B75] font-bold">Data Sertifikat Tercetak &amp; Unduhan</span>
            </div>
          </div>

          {/* Batch ZIP Export & Action Hero Box */}
          <div className="bg-gradient-to-r from-blue-50 via-white to-amber-50/60 border border-blue-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-extrabold text-slate-900">
                  Unduh Berkas Massal (.ZIP) &amp; Arsip Sertifikat Sah
                </h3>
              </div>
              <p className="text-xs text-slate-600 max-w-xl leading-relaxed font-medium">
                Seluruh sertifikat yang telah diterbitkan siap diunduh dalam kemasan .ZIP (PNG resolusi tinggi) atau diunduh satuan per peserta. Seluruh kode QR aktif dan sah diverifikasi secara publik.
              </p>

              {isGeneratingZip && (
                <div className="space-y-1.5 p-3 bg-white rounded-xl border border-blue-200 max-w-md text-xs shadow-xs">
                  <div className="flex justify-between text-slate-700 font-medium">
                    <span>Sedang mengemas gambar sertifikat...</span>
                    <span className="font-mono text-[#073B75] font-bold">{zipProgress.processed} / {zipProgress.total}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="bg-[#073B75] h-full transition-all duration-150"
                      style={{ width: `${(zipProgress.processed / (zipProgress.total || 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-700 bg-white px-3 py-2.5 rounded-xl border border-blue-200 shadow-2xs">
                <FileText className="w-3.5 h-3.5 text-[#073B75]" />
                <span className="text-slate-500 font-medium">Ukuran:</span>
                <span className="font-bold text-[#073B75]">
                  {mapping.paperSize === 'A4' ? 'A4 (297×210 mm)' : mapping.paperSize === 'F4' ? 'F4 / Folio (330×215 mm)' : 'Auto (Template Asli)'}
                </span>
              </div>

              {/* Tombol Cepat Kirim ke Cloud (Opsi 1) */}
              <button
                onClick={handleSyncAllCertificatesToCloud}
                disabled={isSyncingToCloud || savedCertificates.length === 0}
                className={`px-4 py-3 font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow disabled:opacity-50 ${
                  isSyncedToCloud 
                    ? 'bg-emerald-700 text-white' 
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
                title="Kirim semua data sertifikat ke database Supabase Cloud agar QR code sah diverifikasi secara publik"
              >
                {isSyncingToCloud ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Menyimpan ke Cloud...</span>
                  </>
                ) : isSyncedToCloud ? (
                  <>
                    <ShieldCheck className="w-4 h-4 text-emerald-200" />
                    <span>✓ Tersimpan di Cloud ({savedCertificates.length})</span>
                  </>
                ) : (
                  <>
                    <CloudUpload className="w-4 h-4 text-emerald-100" />
                    <span>Kirim ke Cloud ({savedCertificates.length})</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDownloadAllZipFromTier4}
                disabled={isGeneratingZip || filteredHistory.length === 0}
                className="px-5 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow disabled:opacity-50"
              >
                {isGeneratingZip ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Mengemas Berkas ZIP...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download Semua Sertifikat (.ZIP)</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setActiveTier(3)}
                className="px-4 py-3 bg-[#073B75] hover:bg-blue-800 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>+ Cetak Peserta Lain</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                placeholder="Cari berdasarkan nama peserta atau no. sertifikat..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-500 font-medium focus:outline-none focus:border-[#073B75] focus:bg-white"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              {/* Filter Kegiatan */}
              <select
                value={historyFilterEvent}
                onChange={(e) => setHistoryFilterEvent(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:border-[#073B75] focus:bg-white cursor-pointer"
              >
                <option value="all">Semua Kegiatan ({savedCertificates.length})</option>
                {events.map(ev => (
                  <option key={ev.id} value={ev.name}>{ev.name}</option>
                ))}
              </select>

              {/* Filter Status */}
              <select
                value={historyFilterStatus}
                onChange={(e) => setHistoryFilterStatus(e.target.value as any)}
                className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:border-[#073B75] focus:bg-white cursor-pointer"
              >
                <option value="all">Semua Status Keabsahan</option>
                <option value="valid">Hanya Valid / Sah</option>
                <option value="revoked">Dicabut / Tidak Berlaku</option>
              </select>

              <button
                onClick={loadSavedHistory}
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-xl transition cursor-pointer"
                title="Refresh Riwayat"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Certificates Table */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-4 py-3">No. Sertifikat</th>
                    <th className="px-4 py-3">Nama Penerima</th>
                    <th className="px-4 py-3">Kegiatan Pelatihan</th>
                    <th className="px-4 py-3">Tanggal Terbit</th>
                    <th className="px-4 py-3">Status Keabsahan</th>
                    <th className="px-4 py-3 text-right">Aksi &amp; Unduh</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredHistory.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-slate-500 font-medium text-xs">
                        Belum ada sertifikat yang tersimpan. Silakan mulai cetak dari <strong className="text-[#073B75]">Tabel Kegiatan</strong> atau <strong className="text-emerald-700">Upload Peserta</strong>.
                      </td>
                    </tr>
                  ) : (
                    filteredHistory.map((item, index) => (
                      <tr key={item.id || index} className="hover:bg-slate-50/80 transition">
                        <td className="px-4 py-3 font-mono">
                          <span className="font-mono text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-300 font-bold text-xs">
                            {item.certificateNumber}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-bold text-slate-900">{item.recipientName}</span>
                          {item.recipientAgency && (
                            <span className="block text-[11px] text-slate-500 font-normal">
                              {item.recipientAgency}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-700 font-medium max-w-xs truncate">
                          {item.eventName}
                        </td>
                        <td className="px-4 py-3 text-slate-600 font-mono text-xs font-semibold">
                          {item.issueDate}
                        </td>
                        <td className="px-4 py-3">
                          {item.status === 'valid' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Sah &amp; Terverifikasi
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-300">
                              <AlertCircle className="w-3 h-3 text-rose-600" />
                              Dicabut / Tidak Sah
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Download Single PNG */}
                            <button
                              onClick={() => handleDownloadHistoricalSinglePng(item)}
                              className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-xs"
                              title="Download Gambar Sertifikat Ini (PNG)"
                            >
                              <Download className="w-3.5 h-3.5 text-amber-800" />
                              <span>Unduh PNG</span>
                            </button>

                            {/* Public QR Check */}
                            <button
                              onClick={() => onPreviewVerifyModal(item.id)}
                              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                              title="Buka Halaman Verifikasi Publik"
                            >
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Cek QR</span>
                            </button>

                            {/* Copy URL */}
                            <button
                              onClick={() => {
                                const url = item.verificationUrl || getVerificationUrl(item.id);
                                navigator.clipboard.writeText(url);
                                onShowToast('Tautan verifikasi berhasil disalin!');
                              }}
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-lg transition cursor-pointer"
                              title="Salin URL Verifikasi"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>

                            {/* Revoke / Restore */}
                            <button
                              onClick={() => handleToggleCertificateStatus(item.id, item.status)}
                              className={`px-2 py-1 rounded-lg border transition text-xs font-bold cursor-pointer ${
                                item.status === 'valid'
                                  ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-300'
                                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
                              }`}
                              title={item.status === 'valid' ? 'Cabut Sertifikat' : 'Aktifkan Kembali'}
                            >
                              {item.status === 'valid' ? 'Cabut' : 'Pulihkan'}
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteFromHistory(item.id, item.certificateNumber);
                              }}
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 border border-rose-200 rounded-lg transition cursor-pointer active:scale-95"
                              title="Hapus Arsip"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 font-medium">
              <span>Menampilkan {filteredHistory.length} dari {savedCertificates.length} arsip sertifikat.</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveTier(1)}
                  className="text-slate-700 font-bold hover:text-slate-900 cursor-pointer"
                >
                  &larr; Ke Tabel Kegiatan
                </button>
                <button
                  onClick={handleStartAddNewEvent}
                  className="text-[#073B75] font-extrabold hover:underline cursor-pointer"
                >
                  + Tambah Kegiatan Baru
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: MANUAL ADD PARTICIPANT ================= */}
      {showManualAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#073B75]" />
                Tambah Data Peserta Manual
              </h3>
              <button
                onClick={() => setShowManualAddModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddManualParticipant} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Nomor Sertifikat</label>
                <input
                  type="text"
                  value={manualCertNo}
                  onChange={(e) => setManualCertNo(e.target.value)}
                  placeholder={`APN/SERT/2026/${String(participants.length + 1).padStart(3, '0')}`}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono focus:bg-white focus:border-[#073B75] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Nama Lengkap &amp; Gelar *</label>
                <input
                  type="text"
                  required
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  placeholder="Contoh: Ir. Budi Santoso, M.Si., CCMS"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:border-[#073B75] focus:outline-none"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowManualAddModal(false)} className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition text-sm cursor-pointer">Batal</button>
                <button type="submit" className="px-4 py-2.5 bg-[#073B75] hover:bg-blue-800 text-white font-bold rounded-xl transition text-sm cursor-pointer">Tambahkan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* IN-APP CONFIRMATION DIALOG MODAL (RELIABLE IN IFRAMES)                    */}
      {/* ========================================================================= */}
      {confirmDialog && confirmDialog.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-rose-600" />
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="text-sm font-extrabold text-slate-900">{confirmDialog.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {confirmDialog.message}
                </p>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setConfirmDialog(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDialog.onConfirm}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{confirmDialog.confirmText || 'Hapus'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
