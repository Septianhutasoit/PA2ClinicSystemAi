'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Activity, ClipboardList,
    Calendar, CheckCircle2, Clock,
    ArrowRight, Loader2, Heart,
    Thermometer, Pill, Stethoscope,
    TrendingUp, FileText, AlertTriangle,
    ChevronRight, Star, Zap, BarChart3,
    CircleDot, UserCheck, TimerReset
} from 'lucide-react';
import Link from 'next/link';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const STATUS_MAP: Record<string, { label: string; color: string; bg: string; dot: string }> = {
    pending:   { label: 'Menunggu',    color: 'text-amber-600',   bg: 'bg-amber-50 border-amber-200',   dot: 'bg-amber-400' },
    scheduled: { label: 'Dipanggil',   color: 'text-blue-600',    bg: 'bg-blue-50 border-blue-200',     dot: 'bg-blue-400'  },
    completed: { label: 'Selesai',     color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', dot: 'bg-emerald-400' },
};

function StatCard({ label, value, icon, gradient, sub }: {
    label: string; value: string | number; icon: React.ReactNode;
    gradient?: string; sub?: string;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative p-7 rounded-[1.75rem] overflow-hidden ${gradient || 'bg-white border border-slate-100'} shadow-sm`}
        >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${gradient ? 'bg-white/20' : 'bg-indigo-50'}`}>
                <span className={gradient ? 'text-white' : 'text-indigo-600'}>{icon}</span>
            </div>
            <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${gradient ? 'text-white/70' : 'text-slate-400'}`}>{label}</p>
            <h2 className={`text-4xl font-black italic ${gradient ? 'text-white' : 'text-slate-800'}`}>{value}</h2>
            {sub && <p className={`text-[11px] mt-3 font-bold ${gradient ? 'text-white/60' : 'text-slate-400'}`}>{sub}</p>}
        </motion.div>
    );
}

// ─── Komponen Utama ────────────────────────────────────────────────────────────
export default function DoctorDashboard() {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeQueue, setActiveQueue] = useState<number | null>(null);
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        api.get('/clinic/appointments')
            .then(res => setAppointments(res.data))
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, []);

    const pending   = appointments.filter((a: any) => a.status === 'pending');
    const scheduled = appointments.filter((a: any) => a.status === 'scheduled');
    const completed = appointments.filter((a: any) => a.status === 'completed');
    const total     = appointments.length;

    const vitals = [
        { label: 'Tek. Darah Rata-rata', value: '120/80', unit: 'mmHg', icon: <Heart size={18} />, bar: 75, color: 'bg-rose-400', iconBg: 'bg-rose-50 text-rose-500' },
        { label: 'Suhu Pasien',          value: '36.5',   unit: '°C',   icon: <Thermometer size={18} />, bar: 55, color: 'bg-amber-400', iconBg: 'bg-amber-50 text-amber-500' },
        { label: 'Stok Obat',            value: 'Stabil', unit: '',     icon: <Pill size={18} />,        bar: 90, color: 'bg-blue-400', iconBg: 'bg-blue-50 text-blue-500' },
    ];

    const quickMenus = [
        { label: 'Rekam Medis', icon: <FileText size={22} />, href: '/doctor/medical-records', color: 'from-indigo-500 to-violet-600' },
        { label: 'Jadwal',      icon: <Calendar size={22} />, href: '/doctor/schedule',         color: 'from-teal-500 to-emerald-600' },
        { label: 'Antrian',     icon: <Users size={22} />,    href: '/doctor/queue',            color: 'from-amber-500 to-orange-500' },
        { label: 'Laporan',     icon: <BarChart3 size={22} />,href: '/doctor',                  color: 'from-rose-500 to-pink-600' },
    ];

    return (
        <div className="space-y-8 pb-32">

            {/* ── HERO HEADER ───────────────────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-700 rounded-[2rem] p-10 overflow-hidden shadow-xl shadow-indigo-200"
            >
                {/* Decorative circles */}
                <div className="absolute -top-16 -right-16 w-72 h-72 bg-white/5 rounded-full" />
                <div className="absolute -bottom-24 -left-10 w-56 h-56 bg-white/5 rounded-full" />
                <div className="absolute top-4 right-40 w-8 h-8 bg-white/10 rounded-full" />

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 px-4 py-1.5 rounded-full mb-4">
                            <CircleDot size={10} className="text-green-300 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white">On Duty</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter leading-none">
                            Selamat Datang,<br />
                            <span className="text-indigo-200">dr. Pratama</span>
                        </h1>
                        <p className="text-white/60 font-medium mt-3 text-sm max-w-md">
                            Sistem Informasi Medis Klinik.AI — {total} pasien terdaftar hari ini.
                        </p>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                        {/* Live Clock */}
                        <div className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-4 text-right min-w-[160px]">
                            <p className="text-3xl font-black text-white tabular-nums">
                                {now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </p>
                            <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mt-1">
                                {now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-4 py-2">
                            <Star size={12} className="text-amber-300" />
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Dokter Spesialis Umum</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* ── STATS GRID ────────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard
                    label="Total Pasien"
                    value={total}
                    icon={<Users size={24} />}
                    gradient="bg-gradient-to-br from-indigo-600 to-violet-700"
                    sub="↑ 12% dari kemarin"
                />
                <StatCard
                    label="Menunggu"
                    value={pending.length}
                    icon={<TimerReset size={24} />}
                    sub="Di ruang tunggu"
                />
                <StatCard
                    label="Dalam Periksa"
                    value={scheduled.length}
                    icon={<Activity size={24} />}
                    sub="Sedang ditangani"
                />
                <StatCard
                    label="Selesai"
                    value={completed.length}
                    icon={<CheckCircle2 size={24} />}
                    sub="Tindakan selesai"
                />
            </div>

            {/* ── MAIN CONTENT ──────────────────────────────────────────────── */}
            <div className="grid lg:grid-cols-3 gap-8">

                {/* Antrian Pasien — 2 cols */}
                <div className="lg:col-span-2 space-y-5">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2.5">
                            <div className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center">
                                <ClipboardList size={18} className="text-indigo-600" />
                            </div>
                            Antrian Pasien Aktif
                        </h3>
                        <Link href="/doctor/queue" className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                            Lihat Semua <ChevronRight size={14} />
                        </Link>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center py-20 bg-white rounded-[2rem] border border-slate-100">
                            <Loader2 className="animate-spin text-indigo-600" size={36} />
                        </div>
                    ) : appointments.length === 0 ? (
                        <div className="bg-white p-16 rounded-[2rem] border border-dashed border-slate-200 text-center">
                            <Users size={48} className="mx-auto text-slate-200 mb-4" />
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Tidak ada antrian aktif</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {appointments.slice(0, 6).map((app: any, idx: number) => {
                                const st = STATUS_MAP[app.status] || STATUS_MAP.pending;
                                const isExpanded = activeQueue === app.id;
                                return (
                                    <motion.div
                                        key={app.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.06 }}
                                        className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300"
                                    >
                                        <div
                                            className="flex items-center gap-4 px-6 py-5 cursor-pointer"
                                            onClick={() => setActiveQueue(isExpanded ? null : app.id)}
                                        >
                                            {/* Nomor Antrian */}
                                            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0">
                                                {idx + 1}
                                            </div>

                                            {/* Avatar & Name */}
                                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-2xl flex items-center justify-center font-black text-indigo-600 text-lg shrink-0">
                                                {app.patient_name?.charAt(0) || '?'}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-black text-slate-800 truncate">{app.patient_name}</h4>
                                                <div className="flex items-center gap-3 mt-0.5">
                                                    <span className="flex items-center gap-1 text-[10px] text-slate-400 font-bold">
                                                        <Clock size={10} />
                                                        {new Date(app.appointment_date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    {app.doctor_name && (
                                                        <span className="text-[10px] text-indigo-500 font-bold">• {app.doctor_name}</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Status Badge */}
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${st.bg} ${st.color}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                                                {st.label}
                                            </span>

                                            <ChevronRight size={16} className={`text-slate-300 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                                        </div>

                                        {/* Expandable Detail */}
                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="border-t border-slate-50 bg-slate-50/50 px-6 py-4 flex flex-wrap gap-3"
                                                >
                                                    <div className="flex-1 min-w-[160px]">
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Catatan</p>
                                                        <p className="text-xs text-slate-600 font-medium">{app.notes || 'Tidak ada catatan'}</p>
                                                    </div>
                                                    <div className="flex gap-2 items-end">
                                                        <Link
                                                            href={`/doctor/medical-records`}
                                                            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
                                                        >
                                                            <FileText size={12} /> Buka Rekam Medis
                                                        </Link>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Sidebar Panel — 1 col */}
                <div className="space-y-6">

                    {/* Health Vitals */}
                    <div className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-9 h-9 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500">
                                <Stethoscope size={18} />
                            </div>
                            <h4 className="font-black text-slate-800 text-sm uppercase tracking-wider">Health Insights</h4>
                        </div>
                        <div className="space-y-5">
                            {vitals.map((v, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${v.iconBg}`}>
                                        {v.icon}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-end mb-1.5">
                                            <span className="text-[10px] font-black text-slate-400 uppercase">{v.label}</span>
                                            <span className="text-sm font-black text-slate-700">{v.value}<span className="text-[10px] text-slate-400 ml-0.5">{v.unit}</span></span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${v.bar}%` }}
                                                transition={{ delay: 0.3 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                                                className={`h-full ${v.color} rounded-full`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Progress Harian */}
                    <div className="bg-slate-900 p-7 rounded-[2rem] shadow-xl shadow-slate-200 relative overflow-hidden">
                        <div className="absolute -top-8 -right-8 w-32 h-32 bg-indigo-500/15 rounded-full" />
                        <div className="absolute bottom-0 left-0 w-20 h-20 bg-violet-500/10 rounded-full" />
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-5">
                                <h4 className="text-xs font-black text-white/60 uppercase tracking-widest">Progres Harian</h4>
                                <TrendingUp size={16} className="text-indigo-400" />
                            </div>

                            {/* Donut-style progress */}
                            <div className="flex items-center gap-5">
                                <div className="relative w-20 h-20 shrink-0">
                                    <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                                        <circle cx="18" cy="18" r="15.5" fill="none" stroke="#1e293b" strokeWidth="3" />
                                        <motion.circle
                                            cx="18" cy="18" r="15.5"
                                            fill="none"
                                            stroke="#818cf8"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            strokeDasharray={`${total > 0 ? (completed.length / total) * 97.4 : 0} 97.4`}
                                            initial={{ strokeDasharray: '0 97.4' }}
                                            animate={{ strokeDasharray: `${total > 0 ? (completed.length / total) * 97.4 : 0} 97.4` }}
                                            transition={{ duration: 1.2, ease: 'easeOut' }}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <p className="text-base font-black text-white">
                                            {total > 0 ? Math.round((completed.length / total) * 100) : 0}%
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    {[
                                        { label: 'Selesai',    val: completed.length, color: 'bg-indigo-400' },
                                        { label: 'Menunggu',   val: pending.length,   color: 'bg-amber-400' },
                                        { label: 'Dipanggil',  val: scheduled.length, color: 'bg-blue-400' },
                                    ].map(item => (
                                        <div key={item.label} className="flex items-center gap-2.5">
                                            <span className={`w-2 h-2 rounded-full ${item.color}`} />
                                            <span className="text-[10px] text-white/60 font-bold uppercase">{item.label}</span>
                                            <span className="ml-auto text-[10px] font-black text-white">{item.val}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Access */}
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Menu Cepat</h4>
                        <div className="grid grid-cols-2 gap-3">
                            {quickMenus.map((m, i) => (
                                <Link key={i} href={m.href}>
                                    <motion.div
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        className={`bg-gradient-to-br ${m.color} p-4 rounded-2xl flex flex-col items-center gap-2 shadow-sm cursor-pointer`}
                                    >
                                        <span className="text-white">{m.icon}</span>
                                        <span className="text-[10px] font-black text-white uppercase tracking-wide">{m.label}</span>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── JADWAL HARI INI (Timeline) ────────────────────────────────── */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
                <div className="flex items-center justify-between mb-7">
                    <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-amber-50 rounded-xl flex items-center justify-center">
                            <Calendar size={18} className="text-amber-500" />
                        </div>
                        Jadwal Pemeriksaan Hari Ini
                    </h3>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                        {appointments.length} Total Janji
                    </span>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-10">
                        <Loader2 className="animate-spin text-indigo-400" size={28} />
                    </div>
                ) : (
                    <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-[22px] top-0 bottom-0 w-[2px] bg-slate-100 rounded-full" />

                        <div className="space-y-4 pl-12">
                            {appointments.slice(0, 5).map((app: any, idx: number) => {
                                const st = STATUS_MAP[app.status] || STATUS_MAP.pending;
                                return (
                                    <motion.div
                                        key={app.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.08 }}
                                        className="relative flex items-center gap-4"
                                    >
                                        {/* Dot */}
                                        <div className={`absolute -left-12 w-4 h-4 rounded-full border-2 border-white shadow-md ${st.dot}`} />

                                        <div className={`flex-1 flex items-center gap-4 p-4 rounded-2xl border ${st.bg} group hover:shadow-sm transition-all`}>
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-indigo-600 text-sm shadow-sm">
                                                {app.patient_name?.charAt(0) || '?'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm font-black truncate ${st.color}`}>{app.patient_name}</p>
                                                <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                                                    {new Date(app.appointment_date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                    {app.doctor_name && ` · ${app.doctor_name}`}
                                                </p>
                                            </div>
                                            <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${st.bg} ${st.color} border`}>
                                                {st.label}
                                            </span>
                                        </div>
                                    </motion.div>
                                );
                            })}

                            {appointments.length > 5 && (
                                <div className="relative flex items-center gap-4">
                                    <div className="absolute -left-12 w-4 h-4 rounded-full border-2 border-slate-200 bg-slate-100" />
                                    <Link href="/doctor/queue" className="flex-1 flex items-center justify-center gap-2 p-4 rounded-2xl border border-dashed border-slate-200 text-slate-400 hover:border-indigo-300 hover:text-indigo-600 transition-all group">
                                        <span className="text-[11px] font-black uppercase tracking-widest">+{appointments.length - 5} Pasien Lainnya</span>
                                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
