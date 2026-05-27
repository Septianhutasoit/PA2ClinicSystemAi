'use client';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar, Clock, User, Stethoscope, CheckCircle,
    XCircle, AlertCircle, Plus, Search,
    ChevronRight, Phone, CalendarDays, Sparkles,
    MapPin, Heart, Star, BadgeCheck, Award, ShieldCheck
} from 'lucide-react';
import { useState, useEffect, Suspense } from 'react';
import api from '@/services/api';

interface Appointment {
    id: number;
    patient_name: string;
    patient_phone: string;
    doctor_name: string;
    appointment_date: string;
    status: string;
    notes?: string;
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; border: string; dot: string }> = {
    confirmed: { label: 'Dikonfirmasi', bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0', dot: '#22c55e' },
    pending: { label: 'Menunggu', bg: '#fffbeb', text: '#b45309', border: '#fde68a', dot: '#f59e0b' },
    completed: { label: 'Selesai', bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe', dot: '#3b82f6' },
    cancelled: { label: 'Dibatalkan', bg: '#fef2f2', text: '#b91c1c', border: '#fecaca', dot: '#ef4444' },
};

function StatusBadge({ status }: { status: string }) {
    const cfg = STATUS_CONFIG[status] ?? { label: status || 'Pending', bg: '#f8fafc', text: '#475569', border: '#e2e8f0', dot: '#94a3b8' };
    return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold"
            style={{ backgroundColor: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}` }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cfg.dot }} />
            {cfg.label}
        </span>
    );
}

function formatDate(dateStr: string) {
    try { return new Date(dateStr).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }); }
    catch { return dateStr; }
}

function formatTime(dateStr: string) {
    try { return new Date(dateStr).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }); }
    catch { return ''; }
}

// ── Hero Section dengan Background Slider ─────────────────────────────────
function HeroSection() {
    const [currentSlide, setCurrentSlide] = useState(0);

    const images = [
        { src: '/images/bg/galery5.png', alt: 'Nauli Dental Care Gallery' },
        { src: '/images/bg/keunggulan.png', alt: 'Keunggulan Nauli Dental' },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div className="relative h-[500px] md:h-[550px] w-full overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full"
                >
                    <img
                        src={images[currentSlide].src}
                        alt={images[currentSlide].alt}
                        className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-50/80 via-transparent to-transparent" />
                </motion.div>
            </AnimatePresence>

            {/* Slide Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {images.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`transition-all duration-300 rounded-full ${currentSlide === idx
                                ? 'w-8 h-1.5 bg-white'
                                : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
                            }`}
                    />
                ))}
            </div>

            {/* Content Overlay */}
            <div className="relative h-full flex items-center z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="max-w-2xl"
                    >
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-1.5 mb-5 border border-white/30">
                            <CalendarDays size={14} className="text-emerald-300" />
                            <span className="text-[10px] font-bold text-white tracking-wider">MANAJEMEN JANJI TEMU</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
                            Janji Temu{' '}
                            <span className="bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
                                Saya
                            </span>
                        </h1>
                        <p className="text-white/80 text-sm sm:text-base md:text-lg max-w-md leading-relaxed">
                            Kelola semua jadwal kunjungan Anda dengan mudah dan cepat
                        </p>
                        <div className="mt-6 flex items-center gap-2">
                            <div className="w-12 h-0.5 bg-emerald-400 rounded-full" />
                            <div className="w-3 h-3 rounded-full bg-emerald-400" />
                            <div className="w-24 h-0.5 bg-emerald-400/50 rounded-full" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────
function AppointmentsContent() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [doctors, setDoctors] = useState<any[]>([]);
    const [formData, setFormData] = useState({ patient_name: '', patient_phone: '', doctor_name: '', appointment_date: '' });
    const [submitStatus, setSubmitStatus] = useState({ type: '', msg: '' });

    useEffect(() => { fetchAppointments(); fetchDoctors(); }, []);

    const fetchAppointments = async () => {
        try { const res = await api.get('/clinic/appointments/me'); setAppointments(res.data); }
        catch { setAppointments([]); }
        finally { setLoading(false); }
    };

    const fetchDoctors = async () => {
        try { const res = await api.get('/clinic/doctors'); setDoctors(res.data); }
        catch { setDoctors([]); }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitStatus({ type: 'loading', msg: 'Mengirim...' });
        try {
            await api.post('/clinic/appointments', formData);
            setSubmitStatus({ type: 'success', msg: 'Janji temu berhasil dibuat!' });
            setFormData({ patient_name: '', patient_phone: '', doctor_name: '', appointment_date: '' });
            fetchAppointments();
            setTimeout(() => { setShowForm(false); setSubmitStatus({ type: '', msg: '' }); }, 2000);
        } catch {
            setSubmitStatus({ type: 'error', msg: 'Gagal membuat janji temu. Coba lagi.' });
            setTimeout(() => setSubmitStatus({ type: '', msg: '' }), 3000);
        }
    };

    const tabs = [
        { id: 'all', label: 'Semua', count: appointments.length, icon: CalendarDays },
        { id: 'pending', label: 'Menunggu', count: appointments.filter(a => a.status === 'pending').length, icon: AlertCircle },
        { id: 'confirmed', label: 'Dikonfirmasi', count: appointments.filter(a => a.status === 'confirmed').length, icon: CheckCircle },
        { id: 'completed', label: 'Selesai', count: appointments.filter(a => a.status === 'completed').length, icon: Star },
    ];

    const filtered = appointments.filter(apt => {
        if (filter !== 'all' && apt.status !== filter) return false;
        if (searchQuery && !apt.doctor_name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    const stats = [
        { label: 'Total', value: appointments.length, color: '#3b82f6', bg: '#eff6ff' },
        { label: 'Menunggu', value: appointments.filter(a => a.status === 'pending').length, color: '#f59e0b', bg: '#fffbeb' },
        { label: 'Dikonfirmasi', value: appointments.filter(a => a.status === 'confirmed').length, color: '#059669', bg: '#f0fdf4' },
        { label: 'Selesai', value: appointments.filter(a => a.status === 'completed').length, color: '#0d9488', bg: '#f0fdfa' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">

            {/* Hero Section */}
            <HeroSection />

            {/* Main Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

                {/* Grid 2 Kolom */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">

                    {/* ========== KOLOM KIRI ========== */}
                    <div className="space-y-6">
                        {/* Info Klinik Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden"
                        >
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

                            <div className="divide-y divide-slate-100">
                                {[
                                    { icon: MapPin, label: 'Alamat', value: 'Jl. Balige No. 12, Toba, Sumatera Utara', color: '#059669' },
                                    { icon: Phone, label: 'WhatsApp', value: '0821-6352-6363', color: '#0d9488' },
                                    { icon: Clock, label: 'Jam Buka', value: 'Senin–Sabtu | 08.00–20.00 WIB', color: '#0891b2' },
                                ].map((item) => (
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

                        {/* Tips Card */}
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
                                        <h4 className="text-sm font-bold text-emerald-800">Tips Sebelum Kunjungan</h4>
                                        <Sparkles size={12} className="text-emerald-500" />
                                    </div>
                                    <p className="text-xs text-emerald-700 leading-relaxed">
                                        Datang 15 menit sebelum jadwal, bawa kartu identitas, dan jangan lupa makan sebelum perawatan (kecuali ada arahan khusus).
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* ========== KOLOM KANAN ========== */}
                    <div className="space-y-5">

                        {/* Header & Stat Cards */}
                        <div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-4"
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-1 h-6 bg-emerald-500 rounded-full" />
                                    <h2 className="text-xl font-black text-slate-800">Daftar Janji Temu</h2>
                                </div>
                                <p className="text-sm text-slate-500 ml-3">Kelola semua jadwal kunjungan Anda</p>
                            </motion.div>

                            {/* Stat Cards */}
                            <div className="grid grid-cols-4 gap-2 mb-5">
                                {stats.map((s, i) => (
                                    <motion.div
                                        key={s.label}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="bg-white rounded-xl p-3 text-center shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
                                    >
                                        <p className="text-lg font-black text-slate-800">{s.value}</p>
                                        <p className="text-[9px] font-medium text-slate-400">{s.label}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Tombol Buat Janji Baru */}
                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setShowForm(!showForm)}
                            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                        >
                            <Plus size={16} />
                            {showForm ? 'Tutup Formulir' : 'Buat Janji Baru'}
                        </motion.button>

                        {/* Formulir */}
                        <AnimatePresence>
                            {showForm && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                >
                                    <div className="bg-white rounded-xl border border-emerald-100 p-5 shadow-lg">
                                        <form onSubmit={handleSubmit} className="space-y-3">
                                            <div className="relative">
                                                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    type="text"
                                                    placeholder="Nama Lengkap"
                                                    required
                                                    value={formData.patient_name}
                                                    onChange={e => setFormData({ ...formData, patient_name: e.target.value })}
                                                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                                                />
                                            </div>
                                            <div className="relative">
                                                <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    type="text"
                                                    placeholder="Nomor WhatsApp"
                                                    required
                                                    value={formData.patient_phone}
                                                    onChange={e => setFormData({ ...formData, patient_phone: e.target.value })}
                                                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                                                />
                                            </div>
                                            <div className="relative">
                                                <Stethoscope size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
                                                <select
                                                    required
                                                    value={formData.doctor_name}
                                                    onChange={e => setFormData({ ...formData, doctor_name: e.target.value })}
                                                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition appearance-none cursor-pointer"
                                                >
                                                    <option value="">-- Pilih Dokter --</option>
                                                    {doctors.map((d: any) => (
                                                        <option key={d.id} value={d.name}>{d.name} — {d.specialty}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="relative">
                                                <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    type="datetime-local"
                                                    required
                                                    value={formData.appointment_date}
                                                    onChange={e => setFormData({ ...formData, appointment_date: e.target.value })}
                                                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-2.5 rounded-lg font-semibold text-sm transition-all hover:shadow-md"
                                            >
                                                {submitStatus.type === 'loading' ? 'Memproses...' : 'Kirim Janji Temu'}
                                            </button>
                                            {submitStatus.msg && (
                                                <p className={`text-center text-xs font-medium py-2 rounded-lg ${submitStatus.type === 'success' ? 'text-emerald-600 bg-emerald-50' :
                                                        submitStatus.type === 'error' ? 'text-red-600 bg-red-50' : 'text-emerald-600 bg-emerald-50'
                                                    }`}>
                                                    {submitStatus.msg}
                                                </p>
                                            )}
                                        </form>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Search & Tabs */}
                        <div className="relative">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Cari berdasarkan nama dokter..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition shadow-sm"
                            />
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setFilter(tab.id)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${filter === tab.id
                                            ? 'bg-emerald-600 text-white shadow-md'
                                            : 'bg-white text-slate-500 border border-slate-200 hover:border-emerald-300'
                                        }`}
                                >
                                    <tab.icon size={12} />
                                    {tab.label}
                                    <span className={`text-[10px] ${filter === tab.id ? 'text-emerald-200' : 'text-slate-400'}`}>({tab.count})</span>
                                </button>
                            ))}
                        </div>

                        {/* Daftar Janji Temu */}
                        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 custom-scroll">
                            {loading ? (
                                <div className="bg-white rounded-xl border border-slate-200 text-center py-12">
                                    <div className="w-12 h-12 border-3 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-3" />
                                    <p className="text-sm text-slate-500">Memuat janji temu...</p>
                                </div>
                            ) : filtered.length === 0 ? (
                                <div className="bg-white rounded-xl border border-slate-200 text-center py-12">
                                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                                        <Calendar size={24} className="text-slate-400" />
                                    </div>
                                    <p className="font-semibold text-slate-600 mb-1">Belum Ada Janji Temu</p>
                                    <p className="text-sm text-slate-400">Buat janji temu pertama Anda</p>
                                </div>
                            ) : (
                                filtered.map((apt, idx) => (
                                    <motion.div
                                        key={apt.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.03 }}
                                        className="bg-white rounded-xl border border-slate-200 p-4 hover:border-emerald-200 hover:shadow-md transition-all duration-200"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
                                                <Stethoscope size={20} className="text-white" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2 flex-wrap">
                                                    <h3 className="font-bold text-slate-800 text-sm">{apt.doctor_name}</h3>
                                                    <StatusBadge status={apt.status} />
                                                </div>
                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5">
                                                    <span className="flex items-center gap-1 text-xs text-slate-500">
                                                        <Calendar size={11} className="text-emerald-500" />
                                                        {formatDate(apt.appointment_date)}
                                                    </span>
                                                    <span className="flex items-center gap-1 text-xs text-slate-500">
                                                        <Clock size={11} className="text-emerald-500" />
                                                        {formatTime(apt.appointment_date)} WIB
                                                    </span>
                                                </div>
                                                {apt.notes && (
                                                    <div className="mt-2 text-xs text-slate-500 bg-slate-50 p-2 rounded-lg">
                                                        📝 {apt.notes}
                                                    </div>
                                                )}
                                            </div>
                                            <ChevronRight size={16} className="text-slate-300 flex-shrink-0" />
                                        </div>
                                    </motion.div>
                                ))
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

export default function AppointmentsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="w-12 h-12 border-3 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
            </div>
        }>
            <AppointmentsContent />
        </Suspense>
    );
}