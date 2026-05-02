'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { motion } from 'framer-motion';
import {
    Users2, CheckCircle2, Clock, XCircle,
    HeartPulse, Activity, Loader2, AlertCircle,
    RefreshCw, CalendarDays, PhoneCall
} from 'lucide-react';

interface Appointment {
    id: number;
    patient_name: string;
    patient_phone: string;
    doctor_name: string;
    appointment_date: string;
    status: string;
    notes?: string;
}

interface NurseStats {
    total_today: number;
    waiting: number;
    completed: number;
    cancelled: number;
    total_all_time: number;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; dot: string; icon: React.ReactNode }> = {
    Scheduled: {
        label: 'Menunggu',
        color: 'text-amber-600',
        bg: 'bg-amber-50 border-amber-200',
        dot: 'bg-amber-400',
        icon: <Clock size={12} />,
    },
    Completed: {
        label: 'Selesai',
        color: 'text-emerald-600',
        bg: 'bg-emerald-50 border-emerald-200',
        dot: 'bg-emerald-400',
        icon: <CheckCircle2 size={12} />,
    },
    Cancelled: {
        label: 'Dibatalkan',
        color: 'text-red-500',
        bg: 'bg-red-50 border-red-200',
        dot: 'bg-red-400',
        icon: <XCircle size={12} />,
    },
};

export default function NurseDashboard() {
    const [stats, setStats] = useState<NurseStats | null>(null);
    const [queue, setQueue] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<number | null>(null);
    const [filter, setFilter] = useState<'all' | 'Scheduled' | 'Completed' | 'Cancelled'>('all');
    const [nurseName, setNurseName] = useState('');

    const today = new Date().toLocaleDateString('id-ID', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    const loadData = async () => {
        try {
            const [statsRes, queueRes] = await Promise.all([
                api.get('/clinic/appointments/nurse-stats'),
                api.get('/clinic/appointments/queue'),
            ]);
            setStats(statsRes.data);
            setQueue(queueRes.data);
            setNurseName(localStorage.getItem('user_name') || 'Perawat');
        } catch (err) {
            console.error('Gagal memuat data perawat:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
        // Auto-refresh setiap 30 detik
        const interval = setInterval(loadData, 30000);
        return () => clearInterval(interval);
    }, []);

    const updateStatus = async (id: number, status: string) => {
        setUpdatingId(id);
        try {
            await api.patch(`/clinic/appointments/${id}/status`, { status });
            await loadData();
        } catch (err) {
            alert('❌ Gagal mengubah status. Coba lagi.');
        } finally {
            setUpdatingId(null);
        }
    };

    const filteredQueue = filter === 'all' ? queue : queue.filter(a => a.status === filter);

    const statCards = stats ? [
        {
            label: 'Total Hari Ini',
            value: stats.total_today,
            icon: <CalendarDays size={20} />,
            gradient: 'from-rose-500 to-pink-600',
            bg: 'bg-rose-50',
            color: 'text-rose-600',
        },
        {
            label: 'Sedang Menunggu',
            value: stats.waiting,
            icon: <Clock size={20} />,
            gradient: 'from-amber-500 to-orange-500',
            bg: 'bg-amber-50',
            color: 'text-amber-600',
        },
        {
            label: 'Selesai',
            value: stats.completed,
            icon: <CheckCircle2 size={20} />,
            gradient: 'from-emerald-500 to-teal-600',
            bg: 'bg-emerald-50',
            color: 'text-emerald-600',
        },
        {
            label: 'Dibatalkan',
            value: stats.cancelled,
            icon: <XCircle size={20} />,
            gradient: 'from-red-500 to-rose-600',
            bg: 'bg-red-50',
            color: 'text-red-500',
        },
    ] : [];

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-80 gap-4">
                <Loader2 className="animate-spin text-rose-500" size={32} />
                <p className="text-sm font-bold text-slate-400">Memuat data antrian...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Greeting Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-[#1A0D2A] to-[#3d1545] rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl" />
                <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-pink-500/10 rounded-full translate-y-1/2 blur-2xl" />
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <p className="text-rose-400 text-[11px] font-black uppercase tracking-[0.25em] mb-2">
                            Selamat Bertugas
                        </p>
                        <h1 className="text-3xl font-black tracking-tight leading-tight">
                            {nurseName} 💊
                        </h1>
                        <p className="text-slate-400 text-sm font-medium mt-2 flex items-center gap-2">
                            <CalendarDays size={14} /> {today}
                        </p>
                    </div>
                    <div className="hidden md:flex flex-col items-end gap-3">
                        <div className="flex items-center gap-2 bg-rose-500/20 border border-rose-500/30 px-4 py-2 rounded-full">
                            <span className="w-2 h-2 bg-rose-400 rounded-full animate-pulse" />
                            <p className="text-rose-400 text-[11px] font-black uppercase tracking-wider">
                                {stats?.waiting ?? 0} Menunggu
                            </p>
                        </div>
                        <button
                            onClick={() => { setIsLoading(true); loadData(); }}
                            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-full text-white text-[11px] font-black transition-all"
                        >
                            <RefreshCw size={12} />
                            Refresh Data
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((card, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-lg transition-all group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`${card.bg} ${card.color} p-2.5 rounded-xl group-hover:scale-110 transition-transform`}>
                                {card.icon}
                            </div>
                            <Activity size={12} className="text-slate-200" />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{card.label}</p>
                        <p className="text-3xl font-black text-slate-800">{card.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Antrian Pasien Hari Ini */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-base font-black text-slate-800 tracking-tight">Antrian Pasien Hari Ini</h2>
                            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                                {queue.length} total · {stats?.waiting} menunggu
                            </p>
                        </div>
                        <button
                            onClick={() => { setIsLoading(true); loadData(); }}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                        >
                            <RefreshCw size={16} />
                        </button>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-2 flex-wrap">
                        {(['all', 'Scheduled', 'Completed', 'Cancelled'] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider transition-all border ${
                                    filter === f
                                        ? 'bg-rose-600 text-white border-rose-600 shadow-lg shadow-rose-200'
                                        : 'bg-white text-slate-500 border-slate-200 hover:border-rose-300 hover:text-rose-600'
                                }`}
                            >
                                {f === 'all' ? 'Semua' : STATUS_CONFIG[f]?.label}
                                {f !== 'all' && (
                                    <span className="ml-1.5 opacity-70">
                                        ({f === 'Scheduled' ? stats?.waiting : f === 'Completed' ? stats?.completed : stats?.cancelled})
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {filteredQueue.length === 0 ? (
                    <div className="py-16 flex flex-col items-center gap-4 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center">
                            <CheckCircle2 size={32} className="text-slate-300" />
                        </div>
                        <div>
                            <p className="font-black text-slate-700">Tidak ada data</p>
                            <p className="text-sm text-slate-400 mt-1 font-medium">
                                {filter === 'all' ? 'Belum ada pasien hari ini' : `Tidak ada pasien dengan status "${STATUS_CONFIG[filter]?.label}"`}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-50">
                        {filteredQueue.map((appt, i) => {
                            const cfg = STATUS_CONFIG[appt.status] || STATUS_CONFIG['Scheduled'];
                            const time = new Date(appt.appointment_date).toLocaleTimeString('id-ID', {
                                hour: '2-digit', minute: '2-digit'
                            });

                            // Format nomor WA untuk link
                            const waNumber = appt.patient_phone.startsWith('0')
                                ? '62' + appt.patient_phone.slice(1)
                                : appt.patient_phone;

                            return (
                                <motion.div
                                    key={appt.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.04 }}
                                    className={`flex items-center gap-4 px-6 py-4 hover:bg-slate-50/80 transition-colors ${
                                        appt.status === 'Scheduled' ? 'border-l-2 border-amber-400' : ''
                                    }`}
                                >
                                    {/* Queue Number */}
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0 ${
                                        appt.status === 'Scheduled' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'
                                    }`}>
                                        {i + 1}
                                    </div>

                                    {/* Avatar */}
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center text-rose-600 font-black text-sm flex-shrink-0">
                                        {appt.patient_name.charAt(0).toUpperCase()}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-black text-slate-800 text-sm truncate">{appt.patient_name}</p>
                                        <div className="flex items-center gap-3 mt-0.5">
                                            <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                                                <Clock size={10} /> {time}
                                            </p>
                                            <p className="text-[11px] text-slate-400 font-medium truncate hidden sm:block">
                                                Dr. {appt.doctor_name}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <div className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-wider flex-shrink-0 ${cfg.bg} ${cfg.color}`}>
                                        {cfg.icon}
                                        {cfg.label}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        {/* Tombol WA */}
                                        <a
                                            href={`https://wa.me/${waNumber}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 rounded-xl bg-green-50 hover:bg-green-100 text-green-600 border border-green-200 transition-all"
                                            title="Hubungi via WhatsApp"
                                        >
                                            <PhoneCall size={14} />
                                        </a>

                                        {appt.status === 'Scheduled' && (
                                            <>
                                                <button
                                                    onClick={() => updateStatus(appt.id, 'Completed')}
                                                    disabled={updatingId === appt.id}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-black transition-all active:scale-95 disabled:opacity-50"
                                                >
                                                    {updatingId === appt.id ? (
                                                        <Loader2 size={12} className="animate-spin" />
                                                    ) : (
                                                        <CheckCircle2 size={12} />
                                                    )}
                                                    Selesai
                                                </button>
                                                <button
                                                    onClick={() => updateStatus(appt.id, 'Cancelled')}
                                                    disabled={updatingId === appt.id}
                                                    className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-400 border border-red-200 transition-all"
                                                    title="Batalkan"
                                                >
                                                    <AlertCircle size={14} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Stats Summary Card */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-r from-rose-600 to-pink-700 rounded-3xl p-6 text-white flex items-center justify-between shadow-xl shadow-rose-500/20"
            >
                <div>
                    <p className="text-rose-200 text-[10px] font-black uppercase tracking-widest mb-1">Ringkasan Total</p>
                    <h3 className="font-black text-xl tracking-tight">{stats?.total_all_time ?? 0} Total Appointment</h3>
                    <p className="text-rose-200 text-xs font-medium mt-1">
                        Sejak sistem mulai dioperasikan
                    </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <div className="w-14 h-14 bg-white/15 rounded-2xl border border-white/20 flex items-center justify-center flex-shrink-0">
                        <HeartPulse size={28} className="text-white" />
                    </div>
                    <p className="text-rose-200 text-[10px] font-bold">Auto-refresh 30s</p>
                </div>
            </motion.div>
        </div>
    );
}
