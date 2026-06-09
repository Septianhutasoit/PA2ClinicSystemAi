'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Clock, CheckCircle2, AlertCircle,
    Search, ArrowRight, Loader2, Stethoscope,
    UserCheck, TimerReset, RefreshCw
} from 'lucide-react';

interface Appointment {
    id: number;
    patient_name: string;
    doctor_name?: string;
    appointment_date: string;
    status: string;
    notes?: string;
}

const STATUS_CONFIG = {
    pending:   { label: 'Menunggu',     badge: 'bg-emerald-50 text-emerald-600 border-emerald-200', dot: 'bg-emerald-300' },
    confirmed: { label: 'Dikonfirmasi', badge: 'bg-emerald-50 text-emerald-700 border-emerald-300', dot: 'bg-emerald-500' },
    scheduled: { label: 'Terjadwal',    badge: 'bg-emerald-50 text-emerald-600 border-emerald-200', dot: 'bg-emerald-400' },
    completed: { label: 'Selesai',      badge: 'bg-slate-900 text-emerald-400 border-slate-700',    dot: 'bg-emerald-400' },
    cancelled: { label: 'Dibatalkan',   badge: 'bg-red-50 text-red-500 border-red-200',             dot: 'bg-red-400' },
};

export default function DoctorQueuePage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [toast, setToast] = useState<string | null>(null);

    // refresh data function
    const fetchData = async (refresh = false) => {
        if (refresh) setIsRefreshing(true);
        try {
            const res = await api.get('/clinic/appointments');
            setAppointments(res.data);
        } catch {
            showToast('Gagal memuat data antrian');
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    const handleStatusUpdate = async (id: number, newStatus: string) => {
        try {
            await api.patch(`/clinic/appointments/${id}`, { status: newStatus });
            showToast('Status pasien berhasil diperbarui');
            fetchData();
        } catch {
            showToast('Gagal memperbarui status');
        }
    };

    const filtered = appointments.filter(a => {
        const matchSearch = a.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (a.doctor_name || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchFilter = filter === 'all' || a.status === filter;
        return matchSearch && matchFilter;
    });

    const pending = appointments.filter(a => a.status === 'pending' || a.status === 'confirmed').length;
    const completed = appointments.filter(a => a.status === 'completed').length;

    return (
        <div className="space-y-6">
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                        className="fixed top-6 right-6 z-[99] bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl text-sm font-bold"
                    >{toast}</motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Antrian Pasien</h1>
                    <p className="text-sm text-slate-400 font-medium mt-1">{pending} menunggu · {completed} selesai </p>
                </div>
                <button
                    onClick={() => fetchData(true)} disabled={isRefreshing}
                    className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-all"
                >
                    <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} /> Refresh
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total', value: appointments.length, icon: <Users size={20} />, color: 'bg-emerald-50 text-emerald-600' },
                    { label: 'Menunggu', value: appointments.filter(a => a.status === 'pending').length, icon: <TimerReset size={20} />, color: 'bg-emerald-50 text-emerald-500' },
                    { label: 'Dikonfirmasi', value: appointments.filter(a => a.status === 'confirmed').length, icon: <UserCheck size={20} />, color: 'bg-emerald-50 text-emerald-600' },
                    { label: 'Selesai', value: completed, icon: <CheckCircle2 size={20} />, color: 'bg-emerald-50 text-emerald-600' },
                ].map((s, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${s.color}`}>{s.icon}</div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                            <p className="text-3xl font-black text-slate-800">{s.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input type="text" placeholder="Cari nama pasien atau dokter..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 outline-none transition-all"/>
                </div>
                <div className="flex gap-2">
                    {(['all', 'pending', 'confirmed', 'completed'] as const).map(s => (
                        <button key={s} onClick={() => setFilter(s)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${filter === s ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'bg-white text-slate-400 border-slate-200 hover:border-emerald-300'}`}>
                            {s === 'all' ? 'Semua' : s === 'pending' ? 'Tunggu' : s === 'confirmed' ? 'Konfirmasi' : 'Selesai'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/80 border-b border-slate-100">
                            <tr>
                                {['#', 'Pasien', 'Dokter', 'Waktu', 'Status', 'Aksi'].map((h, i) => (
                                    <th key={i} className={`px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest ${i === 5 ? 'text-right' : ''}`}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <tr><td colSpan={6} className="py-20 text-center">
                                    <Loader2 className="animate-spin text-emerald-600 mx-auto" size={32} />
                                    <p className="text-xs text-slate-400 mt-3">Memuat antrian...</p>
                                </td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={6} className="py-20 text-center">
                                    <Users size={40} className="mx-auto text-slate-200 mb-3" />
                                    <p className="text-slate-400 text-sm font-bold">Tidak ada data pasien</p>
                                </td></tr>
                            ) : filtered.map((app, idx) => {
                                const st = STATUS_CONFIG[app.status] || STATUS_CONFIG.pending;
                                return (
                                    <motion.tr key={app.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4"><span className="w-8 h-8 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center text-xs font-black text-black">{idx + 1}</span></td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center font-black text-emerald-700 text-sm">{app.patient_name.charAt(0)}</div>
                                                <p className="text-sm font-black text-slate-800">{app.patient_name}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Stethoscope size={12} className="text-emerald-400" />
                                                <p className="text-xs font-bold text-slate-600">{app.doctor_name || 'Belum ditentukan'}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
                                                <Clock size={11} />
                                                {new Date(app.appointment_date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                <span className="text-slate-200">·</span>
                                                {new Date(app.appointment_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${st.badge}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />{st.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {(app.status === 'pending' || app.status === 'confirmed') && (
                                                <button onClick={() => handleStatusUpdate(app.id, 'completed')}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all">
                                                    Selesai <CheckCircle2 size={12} />
                                                </button>
                                            )}
                                            {app.status === 'completed' && (
                                                <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-xl text-[10px] font-black uppercase">
                                                    <CheckCircle2 size={12} /> Selesai
                                                </span>
                                            )}
                                        </td>
                                    </motion.tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
