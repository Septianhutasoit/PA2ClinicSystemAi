'use client';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText, Calendar, Stethoscope, Activity, Heart,
    Search, CheckCircle, AlertTriangle, Pill,
    ClipboardList, ChevronDown, ChevronUp,
    ShieldCheck, Sparkles, MapPin, Phone, Clock,
    ArrowRight, Star, BadgeCheck, Award,
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface MedicalRecord {
    id: number;
    date: string;
    doctor: string;
    doctorImage?: string;
    diagnosis: string;
    treatment: string;
    prescription: string;
    notes: string;
    status: 'completed' | 'follow-up';
}

// ── Dokter Avatar ──────────────────────────────────────────────────────────
function DoctorAvatar({ name, image, size = 48 }: { name: string; image?: string; size?: number }) {
    const initials = name.replace('Dr. ', '').split(' ').map(w => w[0]).slice(0, 2).join('');
    const [imgError, setImgError] = useState(false);

    if (image && !imgError) {
        return (
            <img
                src={image} alt={name}
                onError={() => setImgError(true)}
                style={{ width: size, height: size, borderRadius: size * 0.28, objectFit: 'cover', flexShrink: 0, border: '2px solid #d1fae5' }}
            />
        );
    }
    return (
        <div style={{
            width: size, height: size, borderRadius: size * 0.28, flexShrink: 0,
            background: 'linear-gradient(135deg, #059669, #0d9488)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: size * 0.3, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em',
        }}>
            {initials}
        </div>
    );
}

// ── Hero Section dengan Single Background Image ───────────────────────────
function HeroSection() {
    const [currentImage] = useState('/images/bg/galery5.png');

    return (
        <div className="relative h-80 md:h-96 w-full overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full">
                <img
                    src={currentImage}
                    alt="Nauli Dental Care Background"
                    className="w-full h-full object-cover"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent" />
            </div>

            {/* Content Overlay */}
            <div className="relative h-full flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-2xl"
                    >
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-1.5 mb-4 border border-white/30">
                            <Sparkles size={14} className="text-emerald-300" />
                            <span className="text-[10px] font-bold text-white tracking-wider">NAULI DENTAL CARE</span>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-3">
                            Rekam Medis <span className="text-emerald-300">Digital</span>
                        </h1>
                        <p className="text-white/80 text-sm sm:text-base max-w-md">
                            Akses riwayat perawatan gigi Anda kapan saja dan di mana saja
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

export default function RecordsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [openId, setOpenId] = useState<number | null>(null);

    const records: MedicalRecord[] = [
        {
            id: 1, date: '2024-12-15', doctor: 'Dr. Sarah Manullang',
            doctorImage: '/images/doctors/sarah.jpg',
            diagnosis: 'Karies Gigi (Gigi Berlubang)', treatment: 'Penambalan Komposit',
            prescription: 'Amoxicillin 500mg (3x1), Ibuprofen 400mg (jika nyeri)',
            notes: 'Gigi geraham bawah kanan (gigi 46) dilakukan penambalan komposit. Pasien disarankan kontrol 2 minggu lagi.',
            status: 'follow-up',
        },
        {
            id: 2, date: '2024-11-20', doctor: 'Dr. Budi Siregar',
            doctorImage: '/images/doctors/budi.jpg',
            diagnosis: 'Gingivitis (Radang Gusi)', treatment: 'Scaling & Pembersihan Karang Gigi',
            prescription: 'Chlorhexidine mouthwash (2x sehari), Metronidazole 500mg (3x1)',
            notes: 'Pembersihan karang gigi menyeluruh. Gusi sudah tampak membaik. Pasien diedukasi tentang cara sikat gigi yang benar.',
            status: 'completed',
        },
        {
            id: 3, date: '2024-10-05', doctor: 'Dr. Maya Situmorang',
            doctorImage: '/images/doctors/maya.jpg',
            diagnosis: 'Pemeriksaan Rutin', treatment: 'Pembersihan Gigi & Pemeriksaan Panoramik',
            prescription: '-',
            notes: 'Kondisi gigi secara umum baik. Tidak ditemukan karies baru. Saran: kontrol rutin 6 bulan sekali.',
            status: 'completed',
        },
        {
            id: 4, date: '2024-08-12', doctor: 'Dr. Sarah Manullang',
            doctorImage: '/images/doctors/sarah.jpg',
            diagnosis: 'Pulpitis Reversibel', treatment: 'Perawatan Saluran Akar (PSA) Tahap 1',
            prescription: 'Ibuprofen 400mg (3x1 setelah makan), Clindamycin 300mg (3x1)',
            notes: 'Gigi premolar atas kiri mengalami pulpitis. Dilakukan perawatan saluran akar tahap pertama. Dipasang tambalan sementara.',
            status: 'completed',
        },
    ];

    const filtered = records.filter(r =>
        r.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.treatment.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const stats = [
        { icon: ClipboardList, label: 'Total Kunjungan', value: records.length, accent: '#3b82f6', bg: '#eff6ff' },
        { icon: Stethoscope, label: 'Tindakan', value: records.filter(r => r.treatment !== '-').length, accent: '#059669', bg: '#f0fdf4' },
        { icon: AlertTriangle, label: 'Follow-up', value: records.filter(r => r.status === 'follow-up').length, accent: '#d97706', bg: '#fffbeb' },
        { icon: CheckCircle, label: 'Selesai', value: records.filter(r => r.status === 'completed').length, accent: '#0d9488', bg: '#f0fdfa' },
    ];

    const formatDate = (d: string) =>
        new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">

            {/* Hero Section dengan 1 Background Gambar */}
            <HeroSection />

            {/* Container Utama dengan Layout 2 Kolom */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

                {/* Grid 2 Kolom: Kiri (Info Klinik) | Kanan (Riwayat) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">

                    {/* ========== KOLOM KIRI ========== */}
                    <div className="space-y-6">
                        {/* Info Klinik Card - Modern */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden"
                        >
                            {/* Header Klinik */}
                            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur">
                                        <img
                                            src="/images/Logo.png"
                                            alt="Nauli Dental"
                                            className="w-8 h-8 object-contain"
                                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-lg">Nauli Dental Care</h3>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <BadgeCheck size={12} className="text-emerald-300" />
                                            <span className="text-[10px] text-emerald-100">Klinik Gigi Terpercaya</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Rating & Stats Ringkas */}
                            <div className="px-5 py-4 border-b border-slate-100">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="flex">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star key={star} size={14} className="fill-amber-400 text-amber-400" />
                                            ))}
                                        </div>
                                        <span className="text-xs font-semibold text-slate-700">4.9</span>
                                        <span className="text-xs text-slate-400">(1,000+ pasien)</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Award size={14} className="text-emerald-500" />
                                        <span className="text-xs text-emerald-600 font-medium">Bersertifikat</span>
                                    </div>
                                </div>
                            </div>

                            {/* Kontak Info */}
                            <div className="divide-y divide-slate-100">
                                {[
                                    { icon: MapPin, label: 'Alamat', value: 'Jl. Balige No. 12, Toba, Sumatera Utara', color: '#059669' },
                                    { icon: Phone, label: 'WhatsApp', value: '0821-6352-6363', color: '#0d9488' },
                                    { icon: Clock, label: 'Jam Buka', value: 'Senin–Sabtu | 08.00–20.00 WIB', color: '#0891b2' },
                                ].map((item, i) => (
                                    <div key={item.label} className="px-5 py-3 flex items-start gap-3 hover:bg-slate-50 transition-colors">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                                            <item.icon size={14} color={item.color} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
                                            <p className="text-sm font-medium text-slate-700">{item.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Tips Kesehatan Gigi */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-100"
                        >
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
                                    <Heart size={18} className="text-white" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="text-sm font-bold text-emerald-800">Tips Kesehatan Gigi</h4>
                                        <Sparkles size={12} className="text-emerald-500" />
                                    </div>
                                    <p className="text-xs text-emerald-700 leading-relaxed">
                                        Sikat gigi minimal 2 kali sehari, gunakan benang gigi, dan lakukan pemeriksaan rutin setiap 6 bulan.
                                        Hindari makanan terlalu manis atau asam untuk menjaga kesehatan email gigi.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* ========== KOLOM KANAN (Riwayat Rekam Medis) ========== */}
                    <div className="space-y-5">

                        {/* Header + Stat Cards */}
                        <div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-4"
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-1 h-6 bg-emerald-500 rounded-full" />
                                    <h2 className="text-xl font-black text-slate-800">Riwayat Rekam Medis</h2>
                                </div>
                                <p className="text-sm text-slate-500 ml-3">Riwayat perawatan dan diagnosis kesehatan gigi Anda</p>
                            </motion.div>

                            {/* Stat Cards - Horizontal Compact */}
                            <div className="grid grid-cols-4 gap-2 mb-5">
                                {stats.map((s, i) => (
                                    <motion.div
                                        key={s.label}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="bg-white rounded-xl p-3 text-center shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center mx-auto mb-2">
                                            <s.icon size={14} color={s.accent} />
                                        </div>
                                        <p className="text-lg font-black text-slate-800">{s.value}</p>
                                        <p className="text-[9px] font-medium text-slate-400">{s.label}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="relative">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Cari diagnosis, dokter, atau tindakan..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 text-sm text-slate-700 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all shadow-sm"
                            />
                        </div>

                        {/* Record List */}
                        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1 custom-scroll">
                            {filtered.map((rec, idx) => {
                                const isOpen = openId === rec.id;
                                const isFollowUp = rec.status === 'follow-up';

                                return (
                                    <motion.div
                                        key={rec.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className={`bg-white rounded-xl border transition-all duration-200 ${isOpen
                                            ? 'border-emerald-300 shadow-lg shadow-emerald-100/50'
                                            : 'border-slate-200 hover:border-emerald-200 hover:shadow-md'
                                            }`}
                                    >
                                        {/* Header Card */}
                                        <div
                                            onClick={() => setOpenId(isOpen ? null : rec.id)}
                                            className="p-4 cursor-pointer"
                                        >
                                            <div className="flex items-start gap-3">
                                                <DoctorAvatar name={rec.doctor} image={rec.doctorImage} size={44} />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <h3 className="font-bold text-slate-800 text-sm line-clamp-1">{rec.diagnosis}</h3>
                                                        <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${isFollowUp
                                                            ? 'bg-amber-50 text-amber-600 border border-amber-200'
                                                            : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                                                            }`}>
                                                            {isFollowUp ? 'Perlu Kontrol' : 'Selesai'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                                                        <span className="flex items-center gap-1 text-xs text-slate-500">
                                                            <Calendar size={11} className="text-emerald-500" />
                                                            {formatDate(rec.date)}
                                                        </span>
                                                        <span className="flex items-center gap-1 text-xs text-slate-500">
                                                            <Stethoscope size={11} className="text-emerald-500" />
                                                            {rec.doctor}
                                                        </span>
                                                    </div>
                                                </div>
                                                <button className="shrink-0 text-slate-400 hover:text-emerald-500 transition-colors">
                                                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Expandable Detail */}
                                        <AnimatePresence>
                                            {isOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <div className="border-t border-slate-100 bg-slate-50/50 p-4 space-y-3">
                                                        {/* Treatment & Prescription */}
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div className="bg-white rounded-lg p-3 border border-slate-100">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <Activity size={12} className="text-emerald-500" />
                                                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Tindakan</span>
                                                                </div>
                                                                <p className="text-xs text-slate-700">{rec.treatment}</p>
                                                            </div>
                                                            <div className="bg-white rounded-lg p-3 border border-slate-100">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <Pill size={12} className="text-emerald-500" />
                                                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Resep</span>
                                                                </div>
                                                                <p className="text-xs text-slate-700">{rec.prescription}</p>
                                                            </div>
                                                        </div>

                                                        {/* Notes */}
                                                        <div className="bg-white rounded-lg p-3 border border-slate-100">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <FileText size={12} className="text-blue-500" />
                                                                <span className="text-[10px] font-bold text-slate-400 uppercase">Catatan Dokter</span>
                                                            </div>
                                                            <p className="text-xs text-slate-600 leading-relaxed">{rec.notes}</p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                );
                            })}

                            {filtered.length === 0 && (
                                <div className="bg-white rounded-xl border border-slate-200 text-center py-12">
                                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                                        <FileText size={24} className="text-slate-400" />
                                    </div>
                                    <p className="font-semibold text-slate-600 mb-1">Tidak Ditemukan</p>
                                    <p className="text-sm text-slate-400">Coba kata kunci yang berbeda</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .custom-scroll::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scroll::-webkit-scrollbar-track {
                    background: #f1f5f9;
                    border-radius: 10px;
                }
                .custom-scroll::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 10px;
                }
                .custom-scroll::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
            `}</style>
        </div>
    );
}