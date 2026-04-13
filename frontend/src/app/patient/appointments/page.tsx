'use client';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar, Clock, User, Stethoscope, CheckCircle,
    XCircle, AlertCircle, Plus, Search, Filter,
    ChevronRight, Phone, MapPin, CalendarDays
} from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '@/services/api';

interface Appointment {
    id: number;
    patient_name: string;
    patient_phone: string;
    doctor_name: string;
    appointment_date: string;
    status: string;
}

export default function AppointmentsPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [doctors, setDoctors] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        patient_name: '',
        patient_phone: '',
        doctor_name: '',
        appointment_date: ''
    });
    const [submitStatus, setSubmitStatus] = useState({ type: '', msg: '' });

    useEffect(() => {
        fetchAppointments();
        fetchDoctors();
    }, []);

    const fetchAppointments = async () => {
        try {
            const res = await api.get('/clinic/appointments');
            setAppointments(res.data);
        } catch {
            // Use sample data if API fails
            setAppointments([
                { id: 1, patient_name: 'Septian Adi', patient_phone: '081234567890', doctor_name: 'Dr. Sarah', appointment_date: '2024-12-20T09:00', status: 'confirmed' },
                { id: 2, patient_name: 'Septian Adi', patient_phone: '081234567890', doctor_name: 'Dr. Budi', appointment_date: '2024-12-22T14:00', status: 'pending' },
                { id: 3, patient_name: 'Septian Adi', patient_phone: '081234567890', doctor_name: 'Dr. Maya', appointment_date: '2024-11-15T10:00', status: 'completed' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const fetchDoctors = async () => {
        try {
            const res = await api.get('/clinic/doctors');
            setDoctors(res.data);
        } catch {
            setDoctors([]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitStatus({ type: 'loading', msg: 'Mengirim...' });
        try {
            await api.post('/clinic/appointments', formData);
            setSubmitStatus({ type: 'success', msg: '✅ Janji temu berhasil dibuat!' });
            setFormData({ patient_name: '', patient_phone: '', doctor_name: '', appointment_date: '' });
            fetchAppointments();
            setTimeout(() => { setShowForm(false); setSubmitStatus({ type: '', msg: '' }); }, 2000);
        } catch {
            setSubmitStatus({ type: 'error', msg: '❌ Gagal membuat janji temu.' });
            setTimeout(() => setSubmitStatus({ type: '', msg: '' }), 3000);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'confirmed':
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold">
                        <CheckCircle size={12} /> Dikonfirmasi
                    </span>
                );
            case 'pending':
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-bold">
                        <AlertCircle size={12} /> Menunggu
                    </span>
                );
            case 'completed':
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold">
                        <CheckCircle size={12} /> Selesai
                    </span>
                );
            case 'cancelled':
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-bold">
                        <XCircle size={12} /> Dibatalkan
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-50 text-slate-600 rounded-full text-xs font-bold">
                        <AlertCircle size={12} /> {status || 'Pending'}
                    </span>
                );
        }
    };

    const formatDate = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
        } catch { return dateStr; }
    };

    const formatTime = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        } catch { return ''; }
    };

    const filteredAppointments = appointments.filter(apt => {
        if (filter !== 'all' && apt.status !== filter) return false;
        if (searchQuery && !apt.doctor_name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    const tabs = [
        { id: 'all', label: 'Semua', count: appointments.length },
        { id: 'pending', label: 'Menunggu', count: appointments.filter(a => a.status === 'pending').length },
        { id: 'confirmed', label: 'Dikonfirmasi', count: appointments.filter(a => a.status === 'confirmed').length },
        { id: 'completed', label: 'Selesai', count: appointments.filter(a => a.status === 'completed').length },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 py-12 px-6">
                <div className="max-w-5xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full mb-3">
                                    <CalendarDays size={12} className="text-emerald-200" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-white">Manajemen Janji Temu</span>
                                </div>
                                <h1 className="text-2xl sm:text-3xl font-black text-white">Janji Temu Saya</h1>
                                <p className="text-emerald-100 text-sm mt-1">Kelola semua jadwal kunjungan Anda</p>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowForm(!showForm)}
                                className="px-5 py-3 bg-white text-emerald-700 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                            >
                                <Plus size={16} /> Buat Janji Baru
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-8">
                {/* New Appointment Form */}
                <AnimatePresence>
                    {showForm && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-8 overflow-hidden"
                        >
                            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 md:p-8">
                                <h3 className="text-lg font-black text-slate-800 mb-5 flex items-center gap-2">
                                    <Calendar size={20} className="text-emerald-500" /> Formulir Janji Temu Baru
                                </h3>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="relative">
                                            <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input type="text" placeholder="Nama Lengkap" className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all" value={formData.patient_name} onChange={e => setFormData({ ...formData, patient_name: e.target.value })} required />
                                        </div>
                                        <div className="relative">
                                            <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input type="text" placeholder="Nomor WhatsApp" className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all" value={formData.patient_phone} onChange={e => setFormData({ ...formData, patient_phone: e.target.value })} required />
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="relative">
                                            <Stethoscope size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
                                            <select className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium appearance-none cursor-pointer focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all" value={formData.doctor_name} onChange={e => setFormData({ ...formData, doctor_name: e.target.value })} required>
                                                <option value="">-- Pilih Dokter --</option>
                                                {doctors.map((d: any) => (
                                                    <option key={d.id} value={d.name}>{d.name} - {d.specialty}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="relative">
                                            <Clock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input type="datetime-local" className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all" value={formData.appointment_date} onChange={e => setFormData({ ...formData, appointment_date: e.target.value })} required />
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button type="submit" className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all">
                                            {submitStatus.type === 'loading' ? 'Memproses...' : 'Kirim Janji Temu'}
                                        </button>
                                        <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all">
                                            Batal
                                        </button>
                                    </div>
                                    {submitStatus.msg && (
                                        <p className={`text-sm font-medium p-3 rounded-xl ${submitStatus.type === 'success' ? 'text-green-600 bg-green-50' : submitStatus.type === 'error' ? 'text-red-600 bg-red-50' : 'text-emerald-600 bg-emerald-50'}`}>
                                            {submitStatus.msg}
                                        </p>
                                    )}
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Filters & Search */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari berdasarkan nama dokter..."
                            className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Status Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setFilter(tab.id)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${filter === tab.id
                                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                                    : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'
                                }`}
                        >
                            {tab.label} <span className="ml-1 text-xs opacity-70">({tab.count})</span>
                        </button>
                    ))}
                </div>

                {/* Appointments List */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-slate-500 text-sm">Memuat janji temu...</p>
                    </div>
                ) : filteredAppointments.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
                        <Calendar size={48} className="mx-auto text-slate-300 mb-4" />
                        <h3 className="text-lg font-bold text-slate-400 mb-2">Belum Ada Janji Temu</h3>
                        <p className="text-sm text-slate-400">Buat janji temu pertama Anda dengan dokter spesialis kami</p>
                    </motion.div>
                ) : (
                    <div className="space-y-4">
                        {filteredAppointments.map((apt, idx) => (
                            <motion.div
                                key={apt.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-all group"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shrink-0">
                                            <Stethoscope size={22} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800">{apt.doctor_name}</h3>
                                            <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500">
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={12} className="text-emerald-500" />
                                                    {formatDate(apt.appointment_date)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock size={12} className="text-emerald-500" />
                                                    {formatTime(apt.appointment_date)} WIB
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {getStatusBadge(apt.status)}
                                        <ChevronRight size={16} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
