'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Clock, CheckCircle2, Search,
    ArrowRight, Loader2, RefreshCw, TimerReset,
    Bell, ClipboardList, Stethoscope, UserCheck
} from 'lucide-react';

interface Appointment {
    id: number;
    patient_name: string;
    doctor_name?: string;
    appointment_date: string;
    status: string;
    notes?: string;
}

const STATUS_CONFIG: Record<string, { label: string; badge: string; dot: string }> = {
    pending:   { label: 'Menunggu',   badge: 'bg-amber-50 text-amber-600 border-amber-200',     dot: 'bg-amber-400' },
    scheduled: { label: 'Dipanggil',  badge: 'bg-blue-50 text-blue-600 border-blue-200',        dot: 'bg-blue-400' },
    completed: { label: 'Selesai',    badge: 'bg-emerald-50 text-emerald-600 border-emerald-200', dot: 'bg-emerald-400' },
};

export default function NurseQueuePage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<'all' | 'pending' | 'scheduled' | 'completed'>('all');
    const [toast, setToast] = useState<string | null>(null);

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
            // PERBAIKAN: Gunakan endpoint /status agar masuk ke logika validasi backend
            await api.patch(`/clinic/appointments/${id}/status`, {
                status: newStatus
            });

            const msg = newStatus === 'scheduled' ? 'Pasien dipanggil!' : 'Pemeriksaan selesai!';
            showToast(`✅ ${msg}`);

            fetchData(); // Muat ulang data tabel agar status berubah di layar perawat
        } catch (err) {
            showToast('❌ Gagal memperbarui status. Cek koneksi server.');
            console.error(err);
        }
    };

    const total = appointments.length;
    const pending = appointments.filter(a => a.status === 'pending').length;
    const scheduled = appointments.filter(a => a.status === 'scheduled').length;
    const completed = appointments.filter(a => a.status === 'completed').length;

    const filtered = appointments.filter(a => {
        const matchSearch = a.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (a.doctor_name || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchFilter = filter === 'all' || a.status === filter;
        return matchSearch && matchFilter;
    });

    return (
        <div className="space-y-6">
            <AnimatePresence>
                {toast && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                        className="fixed top-6 right-6 z-[99] bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl text-sm font-bold">{toast}</motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Antrian Pasien</h1>
                    <p className="text-sm text-slate-400 font-medium mt-1">{total} pasien terdaftar · {pending} menunggu</p>
                </div>
                <button onClick={() => fetchData(true)} disabled={isRefreshing}
                    className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-teal-700 transition-all">
                    <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} /> Refresh
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total', value: total, icon: <Users size={20} />, color: 'bg-teal-50 text-teal-600' },
                    { label: 'Menunggu', value: pending, icon: <TimerReset size={20} />, color: 'bg-amber-50 text-amber-500' },
                    { label: 'Dipanggil', value: scheduled, icon: <Bell size={20} />, color: 'bg-blue-50 text-blue-500' },
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
                    <input type="text" placeholder="Cari nama pasien..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-teal-400 outline-none transition-all shadow-sm" />
                </div>
                <div className="flex gap-2">
                    {(['all', 'pending', 'scheduled', 'completed'] as const).map(s => (
                        <button key={s} onClick={() => setFilter(s)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${filter === s ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-slate-400 border-slate-200 hover:border-teal-300'}`}>
                            {s === 'all' ? 'Semua' : s === 'pending' ? 'Tunggu' : s === 'scheduled' ? 'Dipanggil' : 'Selesai'}
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
                                {['#', 'Pasien', 'Dokter Tujuan', 'Waktu', 'Status', 'Tindakan'].map((h, i) => (
                                    <th key={i} className={`px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest ${i === 5 ? 'text-right' : ''}`}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <tr><td colSpan={6} className="py-20 text-center">
                                    <Loader2 className="animate-spin text-teal-500 mx-auto" size={32} />
                                </td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={6} className="py-20 text-center">
                                    <Users size={40} className="mx-auto text-slate-200 mb-3" />
                                    <p className="text-slate-400 text-sm font-bold">Tidak ada data</p>
                                </td></tr>
                            ) : filtered.map((app, idx) => {
                                const st = STATUS_CONFIG[app.status] || STATUS_CONFIG.pending;
                                return (
                                    <motion.tr key={app.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }} className="hover:bg-slate-50/50">
                                        <td className="px-6 py-4"><span className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center text-xs font-black text-slate-500">{idx + 1}</span></td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center font-black text-teal-700 text-sm">{app.patient_name.charAt(0)}</div>
                                                <p className="text-sm font-black text-slate-800">{app.patient_name}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4"><p className="text-xs font-bold text-slate-600">{app.doctor_name || 'Belum ditentukan'}</p></td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
                                                <Clock size={11} />
                                                {new Date(app.appointment_date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase border ${st.badge}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />{st.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {app.status === 'pending' && (
                                                <button onClick={() => handleStatusUpdate(app.id, 'scheduled')}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-xl text-[10px] font-black uppercase hover:bg-teal-700 transition-all">
                                                    Panggil <ArrowRight size={12} />
                                                </button>
                                            )}
                                            {app.status === 'scheduled' && (
                                                <button onClick={() => handleStatusUpdate(app.id, 'completed')}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase hover:bg-blue-700 transition-all">
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
