'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Clock, CheckCircle2,
    AlertCircle, Search, Bell,
    ArrowRight, Loader2, ShieldCheck,
    Stethoscope, ClipboardList, Heart,
    UserCheck, TimerReset, ChevronRight,
    RefreshCw, CircleDot, TriangleAlert,
    CalendarCheck2, StickyNote
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Appointment {
    id: number;
    patient_name: string;
    doctor_name?: string;
    appointment_date: string;
    status: 'pending' | 'scheduled' | 'completed';
    notes?: string;
}

// ─── Config ───────────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
    pending: {
        label: 'Menunggu',
        badge: 'bg-amber-50 text-amber-600 border-amber-200',
        dot: 'bg-amber-400',
        row: 'hover:bg-amber-50/40',
    },
    scheduled: {
        label: 'Dipanggil',
        badge: 'bg-blue-50 text-blue-600 border-blue-200',
        dot: 'bg-blue-400',
        row: 'hover:bg-blue-50/40',
    },
    completed: {
        label: 'Selesai',
        badge: 'bg-emerald-50 text-emerald-600 border-emerald-200',
        dot: 'bg-emerald-400',
        row: 'hover:bg-emerald-50/30',
    },
};

// ─── Sub-komponen ─────────────────────────────────────────────────────────────
function StatPill({ label, value, color, icon }: {
    label: string; value: number; color: string; icon: React.ReactNode;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`bg-white rounded-[1.5rem] border border-slate-100 shadow-sm p-5 flex items-center gap-4`}
        >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${color}`}>
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
                <p className="text-3xl font-black text-slate-800 italic leading-none">{value}</p>
            </div>
        </motion.div>
    );
}

// ─── Komponen Utama ────────────────────────────────────────────────────────────
export default function NurseDashboard() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading]       = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [searchTerm, setSearchTerm]     = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'scheduled' | 'completed'>('all');
    const [now, setNow]                   = useState(new Date());
    const [toast, setToast]               = useState<string | null>(null);

    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    const fetchData = async (refresh = false) => {
        if (refresh) setIsRefreshing(true);
        try {
            const res = await api.get('/clinic/appointments');
            setAppointments(res.data);
        } catch {
            showToast('❌ Gagal memuat data antrian');
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
            showToast(`✅ Status pasien berhasil diperbarui`);
            fetchData();
        } catch {
            showToast('❌ Gagal memperbarui status');
        }
    };

    const total     = appointments.length;
    const pending   = appointments.filter(a => a.status === 'pending').length;
    const scheduled = appointments.filter(a => a.status === 'scheduled').length;
    const completed = appointments.filter(a => a.status === 'completed').length;

    const filtered = appointments.filter(a => {
        const matchSearch = a.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (a.doctor_name || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = filterStatus === 'all' || a.status === filterStatus;
        return matchSearch && matchStatus;
    });

    return (
        <div className="space-y-7 pb-28 relative">

            {/* ── TOAST ─────────────────────────────────────────────────────── */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="fixed top-6 right-6 z-[99] bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl text-sm font-bold"
                    >
                        {toast}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── HERO HEADER ───────────────────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative bg-gradient-to-br from-teal-700 via-teal-600 to-cyan-600 rounded-[2rem] p-8 overflow-hidden shadow-xl shadow-teal-200"
            >
                <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/5 rounded-full" />
                <div className="absolute -bottom-16 -left-8 w-48 h-48 bg-white/5 rounded-full" />

                <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 px-4 py-1.5 rounded-full mb-3">
                            <CircleDot size={10} className="text-green-300 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white">Perawat Aktif</span>
                        </div>
                        <h1 className="text-3xl font-black text-white tracking-tighter leading-tight">
                            Nurse Information<br />
                            <span className="text-teal-200">System</span>
                        </h1>
                        <p className="text-white/60 text-sm font-medium mt-2">
                            Manajemen antrian & pelayanan pasien — {total} pasien hari ini
                        </p>
                    </div>

                    <div className="flex flex-col items-end gap-2.5">
                        <div className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-2xl px-5 py-3.5 text-right">
                            <p className="text-2xl font-black text-white tabular-nums">
                                {now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </p>
                            <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mt-1">
                                {now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </p>
                        </div>
                        <button
                            onClick={() => fetchData(true)}
                            disabled={isRefreshing}
                            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                        >
                            <RefreshCw size={12} className={isRefreshing ? 'animate-spin' : ''} />
                            Refresh
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* ── STATS ─────────────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatPill label="Total Pasien"  value={total}     icon={<Users size={22} />}         color="bg-teal-50 text-teal-600" />
                <StatPill label="Menunggu"       value={pending}   icon={<TimerReset size={22} />}    color="bg-amber-50 text-amber-500" />
                <StatPill label="Dipanggil"      value={scheduled} icon={<Bell size={22} />}           color="bg-blue-50 text-blue-500" />
                <StatPill label="Selesai"        value={completed} icon={<CheckCircle2 size={22} />}  color="bg-emerald-50 text-emerald-600" />
            </div>

            {/* ── PROGRESS BAR ──────────────────────────────────────────────── */}
            {total > 0 && (
                <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progres Pelayanan Hari Ini</span>
                        <span className="text-[10px] font-black text-teal-600">{Math.round((completed / total) * 100)}% Selesai</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden flex gap-0.5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(completed / total) * 100}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className="h-full bg-emerald-400 rounded-l-full"
                        />
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(scheduled / total) * 100}%` }}
                            transition={{ duration: 1, delay: 0.1, ease: 'easeOut' }}
                            className="h-full bg-blue-400"
                        />
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(pending / total) * 100}%` }}
                            transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
                            className="h-full bg-amber-300 rounded-r-full"
                        />
                    </div>
                    <div className="flex items-center gap-5 mt-2">
                        {[
                            { label: 'Selesai', color: 'bg-emerald-400', val: completed },
                            { label: 'Dipanggil', color: 'bg-blue-400', val: scheduled },
                            { label: 'Menunggu', color: 'bg-amber-300', val: pending },
                        ].map(i => (
                            <div key={i.label} className="flex items-center gap-1.5">
                                <span className={`w-2.5 h-2.5 rounded-sm ${i.color}`} />
                                <span className="text-[10px] font-bold text-slate-400">{i.label} ({i.val})</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── SEARCH & FILTER ───────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input
                        type="text"
                        placeholder="Cari nama pasien atau dokter..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-teal-400 outline-none transition-all shadow-sm"
                    />
                </div>
                <div className="flex gap-2">
                    {(['all', 'pending', 'scheduled', 'completed'] as const).map(s => (
                        <button
                            key={s}
                            onClick={() => setFilterStatus(s)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                                filterStatus === s
                                    ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-100'
                                    : 'bg-white text-slate-400 border-slate-200 hover:border-teal-300 hover:text-teal-600'
                            }`}
                        >
                            {s === 'all' ? 'Semua' : s === 'pending' ? 'Tunggu' : s === 'scheduled' ? 'Dipanggil' : 'Selesai'}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── PATIENT TABLE ─────────────────────────────────────────────── */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-8 py-5 border-b border-slate-50 flex items-center justify-between">
                    <h3 className="font-black text-slate-800 tracking-tight flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-teal-50 rounded-xl flex items-center justify-center">
                            <ClipboardList size={16} className="text-teal-600" />
                        </div>
                        Antrian Pasien
                    </h3>
                    <span className="text-[10px] font-black text-slate-400 bg-slate-50 border border-slate-100 px-3 py-1 rounded-full">
                        {filtered.length} dari {total} pasien
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/80 border-b border-slate-100">
                            <tr>
                                {['#', 'Pasien & Waktu', 'Dokter Tujuan', 'Status', 'Tindakan Perawat'].map((h, i) => (
                                    <th key={i} className={`px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest ${i === 4 ? 'text-right' : ''}`}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="py-24 text-center">
                                        <Loader2 className="animate-spin text-teal-500 mx-auto" size={36} />
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-3">Memuat data antrian...</p>
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-24 text-center">
                                        <Users size={44} className="mx-auto text-slate-200 mb-3" />
                                        <p className="text-slate-400 text-sm font-bold">Tidak ada data yang cocok</p>
                                        <p className="text-slate-300 text-xs mt-1">Coba ubah filter atau kata pencarian</p>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((app, idx) => {
                                    const st = STATUS_CONFIG[app.status] || STATUS_CONFIG.pending;
                                    return (
                                        <motion.tr
                                            key={app.id}
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.04 }}
                                            className={`transition-colors ${st.row}`}
                                        >
                                            {/* Nomor */}
                                            <td className="px-6 py-5">
                                                <span className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center text-[11px] font-black text-slate-500">
                                                    {idx + 1}
                                                </span>
                                            </td>

                                            {/* Pasien & Waktu */}
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center font-black text-teal-700 text-sm shrink-0">
                                                        {app.patient_name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-slate-800">{app.patient_name}</p>
                                                        <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-slate-400 font-bold">
                                                            <Clock size={9} />
                                                            {new Date(app.appointment_date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                            <span className="text-slate-200">·</span>
                                                            {new Date(app.appointment_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Dokter */}
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 bg-indigo-50 rounded-lg flex items-center justify-center">
                                                        <Stethoscope size={12} className="text-indigo-500" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black text-slate-700">{app.doctor_name || 'Belum ditentukan'}</p>
                                                        <p className="text-[10px] text-slate-400 font-bold">Poli Umum</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Status */}
                                            <td className="px-6 py-5">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${st.badge}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                                                    {st.label}
                                                </span>
                                            </td>

                                            {/* Action */}
                                            <td className="px-6 py-5 text-right">
                                                {app.status === 'pending' ? (
                                                    <button
                                                        onClick={() => handleStatusUpdate(app.id, 'scheduled')}
                                                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-teal-700 active:scale-95 transition-all shadow-md shadow-teal-100"
                                                    >
                                                        Panggil ke Poli <ArrowRight size={12} />
                                                    </button>
                                                ) : app.status === 'scheduled' ? (
                                                    <button
                                                        onClick={() => handleStatusUpdate(app.id, 'completed')}
                                                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 active:scale-95 transition-all shadow-md shadow-blue-100"
                                                    >
                                                        Selesaikan <CheckCircle2 size={12} />
                                                    </button>
                                                ) : (
                                                    <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest">
                                                        <CheckCircle2 size={12} /> Tindakan Selesai
                                                    </div>
                                                )}
                                            </td>
                                        </motion.tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Table Footer */}
                {!isLoading && total > 0 && (
                    <div className="px-8 py-4 border-t border-slate-50 bg-slate-50/40 flex items-center justify-between">
                        <p className="text-[10px] font-bold text-slate-400">
                            Menampilkan <span className="text-slate-700 font-black">{filtered.length}</span> pasien
                        </p>
                        {pending > 0 && (
                            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
                                <TriangleAlert size={12} className="text-amber-500" />
                                <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">
                                    {pending} pasien masih menunggu dipanggil
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ── QUICK SUMMARY CARDS ───────────────────────────────────────── */}
            <div className="grid md:grid-cols-3 gap-5">
                {/* Prioritas */}
                <div className="bg-white rounded-[1.75rem] border border-slate-100 shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-9 h-9 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500">
                            <AlertCircle size={18} />
                        </div>
                        <h4 className="font-black text-slate-800 text-sm uppercase tracking-wider">Prioritas</h4>
                    </div>
                    <div className="space-y-3">
                        {appointments.filter(a => a.status === 'pending').slice(0, 3).map((app, i) => (
                            <div key={app.id} className="flex items-center gap-3 p-3 bg-amber-50/60 rounded-2xl border border-amber-100">
                                <div className="w-8 h-8 bg-amber-100 rounded-xl flex items-center justify-center font-black text-amber-700 text-xs">
                                    {i + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-black text-slate-800 truncate">{app.patient_name}</p>
                                    <p className="text-[10px] text-amber-600 font-bold">
                                        {new Date(app.appointment_date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleStatusUpdate(app.id, 'scheduled')}
                                    className="w-7 h-7 bg-teal-600 text-white rounded-lg flex items-center justify-center hover:bg-teal-700 transition-colors shrink-0"
                                >
                                    <ArrowRight size={12} />
                                </button>
                            </div>
                        ))}
                        {appointments.filter(a => a.status === 'pending').length === 0 && (
                            <div className="text-center py-4 text-slate-300">
                                <ShieldCheck size={28} className="mx-auto mb-2" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Semua Tertangani</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sedang Dipanggil */}
                <div className="bg-white rounded-[1.75rem] border border-slate-100 shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                            <UserCheck size={18} />
                        </div>
                        <h4 className="font-black text-slate-800 text-sm uppercase tracking-wider">Dalam Poli</h4>
                    </div>
                    <div className="space-y-3">
                        {appointments.filter(a => a.status === 'scheduled').slice(0, 3).map(app => (
                            <div key={app.id} className="flex items-center gap-3 p-3 bg-blue-50/60 rounded-2xl border border-blue-100">
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-black text-slate-800 truncate">{app.patient_name}</p>
                                    <p className="text-[10px] text-blue-600 font-bold">
                                        {app.doctor_name || 'Dokter ditentukan'} · Poli Umum
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleStatusUpdate(app.id, 'completed')}
                                    className="w-7 h-7 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors shrink-0"
                                >
                                    <CheckCircle2 size={12} />
                                </button>
                            </div>
                        ))}
                        {appointments.filter(a => a.status === 'scheduled').length === 0 && (
                            <div className="text-center py-4 text-slate-300">
                                <CalendarCheck2 size={28} className="mx-auto mb-2" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Kosong</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Catatan Shift */}
                <div className="bg-gradient-to-br from-teal-700 to-cyan-600 rounded-[1.75rem] shadow-xl shadow-teal-100 p-6 text-white relative overflow-hidden">
                    <div className="absolute -bottom-10 -right-10 w-36 h-36 bg-white/5 rounded-full" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                                <StickyNote size={18} />
                            </div>
                            <h4 className="font-black text-sm uppercase tracking-wider">Catatan Shift</h4>
                        </div>
                        <div className="space-y-3 text-sm">
                            <div className="bg-white/10 rounded-2xl p-3 flex gap-3">
                                <Heart size={14} className="text-rose-300 mt-0.5 shrink-0" />
                                <p className="text-white/80 text-xs font-medium">Pasien dengan riwayat hipertensi perlu pemeriksaan tekanan darah sebelum masuk poli.</p>
                            </div>
                            <div className="bg-white/10 rounded-2xl p-3 flex gap-3">
                                <Clock size={14} className="text-amber-300 mt-0.5 shrink-0" />
                                <p className="text-white/80 text-xs font-medium">Shift berikutnya: 14:00 WIB. Pastikan handover antrian selesai.</p>
                            </div>
                        </div>
                        <button className="mt-4 w-full flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 border border-white/20 text-white text-[10px] font-black uppercase tracking-widest py-2.5 rounded-xl transition-all">
                            Tambah Catatan <ChevronRight size={12} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
