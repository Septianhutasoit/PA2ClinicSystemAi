'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Activity, ClipboardList,
    Calendar, CheckCircle2, Clock,
    ArrowRight, Loader2, FileText,
    BarChart3, ChevronRight,
    CircleDot, TimerReset, Sparkles
} from 'lucide-react';
import Link from 'next/link';

/* ─── status map ─────────────────────────────────── */
const STATUS_MAP: Record<string, { label: string; color: string; bg: string; dot: string }> = {
    pending: { label: 'Menunggu', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200', dot: 'bg-amber-400' },
    confirmed: { label: 'Terkonfirmasi', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200', dot: 'bg-blue-400' },
    scheduled: { label: 'Dipanggil', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' },
    completed: { label: 'Selesai', color: 'text-teal-600', bg: 'bg-teal-50 border-teal-200', dot: 'bg-teal-400' },
};

const ROLE_LABEL: Record<string, string> = {
    doctor: 'Dokter Spesialis',
    nurse: 'Perawat / Staff',
    admin: 'Administrator',
};

const QUICK = [
    { label: 'Rekam Medis', icon: FileText, href: '/doctor/medical-records', bg: 'bg-emerald-50', color: 'text-emerald-600', border: 'border-emerald-100' },
    { label: 'Jadwal', icon: Calendar, href: '/doctor/schedule', bg: 'bg-teal-50', color: 'text-teal-600', border: 'border-teal-100' },
    { label: 'Antrian', icon: Users, href: '/doctor/queue', bg: 'bg-amber-50', color: 'text-amber-600', border: 'border-amber-100' },
    { label: 'Laporan', icon: BarChart3, href: '/doctor/dashboard', bg: 'bg-blue-50', color: 'text-blue-600', border: 'border-blue-100' },
];

/* ─── component ──────────────────────────────────── */
export default function DoctorDashboard() {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [doctorName, setDoctorName] = useState('');
    const [doctorRole, setDoctorRole] = useState('doctor');
    const [isNameLoaded, setIsNameLoaded] = useState(false);   // ← FIX: state ini sekarang ada
    const [isLoading, setIsLoading] = useState(true);
    const [activeQueue, setActiveQueue] = useState<number | null>(null);
    const [stats, setStats] = useState<any>({});
    const [now, setNow] = useState(new Date());

    /* live clock */
    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    /* ── refreshData: bisa dipanggil ulang setelah update status ── */
    const refreshData = async () => {
        try {
            const [resStats, resToday] = await Promise.all([
                api.get('/clinic/appointments/doctor-stats'),
                api.get('/clinic/appointments/my-today'),
            ]);
            setStats(resStats.data ?? {});
            setAppointments(Array.isArray(resToday.data) ? resToday.data : []);
        } catch (err) {
            console.error('refreshData gagal:', err);
        }
    };

    /* ── load awal ── */
    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            try {
                const resMe = await api.get('/auth/me');
                const name = resMe.data?.full_name || resMe.data?.name || '';
                const role = resMe.data?.role || 'doctor';
                setDoctorName(name);
                setDoctorRole(role);
                setIsNameLoaded(true);        // ← FIX: sekarang bisa dipanggil
                await refreshData();
            } catch (err) {
                console.error('Gagal memuat dashboard:', err);
                const fallback = localStorage.getItem('user_name') || '';
                setDoctorName(fallback);
                setIsNameLoaded(true);
            } finally {
                setIsLoading(false);
            }
        };
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* ── update status → refresh otomatis ── */
    const handleStatus = async (id: number, newStatus: string) => {
        try {
            await api.patch(`/clinic/appointments/${id}/status`, { status: newStatus });
            await refreshData();
        } catch {
            alert('Gagal memperbarui status pasien.');
        }
    };

    /* ── derived values dari stats API ── */
    const totalAll = stats?.total_all_patients ?? 0;
    const waiting = (stats?.waiting_patients ?? 0) + (stats?.scheduled_patients ?? 0);
    const todayPat = stats?.today_patients ?? 0;
    const completed = stats?.completed_today ?? 0;
    const queueAntre = stats?.waiting_patients ?? 0;  // confirmed = belum dipanggil

    const statCards = [
        { label: 'Total Pasien', value: isLoading ? '—' : totalAll, icon: Users, iconBg: 'bg-emerald-600', iconColor: 'text-white', dark: true, desc: 'Semua pasien terdaftar' },
        { label: 'Menunggu', value: isLoading ? '—' : waiting, icon: TimerReset, iconBg: 'bg-amber-50', iconColor: 'text-amber-600', dark: false, desc: 'Antrian hari ini' },
        { label: 'Hari Ini', value: isLoading ? '—' : todayPat, icon: Activity, iconBg: 'bg-teal-50', iconColor: 'text-teal-600', dark: false, desc: 'Total jadwal hari ini' },
        { label: 'Selesai', value: isLoading ? '—' : completed, icon: CheckCircle2, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', dark: false, desc: 'Tindakan selesai' },
    ];

    /* ── format ── */
    const clockStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const dateStr = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const displayName = doctorName
        ? (doctorName.toLowerCase().startsWith('dr') ? doctorName : `dr. ${doctorName}`)
        : 'Dokter';

    return (
        <div className="space-y-6 pb-20">

            {/* ══ WELCOME BANNER ══════════════════════════════════════ */}
            <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative bg-gradient-to-br from-emerald-700 via-emerald-700 to-teal-700 rounded-2xl p-8 overflow-hidden shadow-lg shadow-emerald-900/15"
            >
                <div className="absolute -top-12 -right-12 w-56 h-56 bg-white/5 rounded-full pointer-events-none" />
                <div className="absolute -bottom-16 -left-8  w-44 h-44 bg-white/5 rounded-full pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    {/* Kiri */}
                    <div>
                        <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 px-3 py-1.5 rounded-full mb-4">
                            <CircleDot size={10} className="text-green-300 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white">On Duty</span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                            Selamat Datang,<br />
                            {!isNameLoaded ? (
                                <span className="inline-block w-48 h-9 bg-white/15 rounded-xl animate-pulse mt-1" />
                            ) : (
                                <span className="text-emerald-200 italic">{displayName}</span>
                            )}
                        </h1>

                        {isNameLoaded && (
                            <div className="flex items-center gap-2 mt-2.5">
                                <span className="text-[9px] font-black uppercase tracking-widest bg-white/10 border border-white/20 text-emerald-200 px-3 py-1 rounded-full">
                                    {ROLE_LABEL[doctorRole] ?? doctorRole}
                                </span>
                                <span className="text-[9px] font-bold text-white/50">·</span>
                                <span className="text-[9px] font-bold text-white/50">
                                    {appointments.length} pasien terdaftar hari ini
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Kanan — live clock */}
                    <div className="shrink-0">
                        <div className="bg-white/12 backdrop-blur-sm border border-white/15 rounded-2xl px-6 py-4 text-right">
                            <p className="text-4xl font-black text-white tabular-nums tracking-tighter">{clockStr}</p>
                            <p className="text-[10px] font-bold text-white/55 mt-1 capitalize">{dateStr}</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* ══ STAT CARDS ══════════════════════════════════════════ */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((s, i) => {
                    const Icon = s.icon;
                    return (
                        <motion.div key={s.label}
                            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.07, duration: 0.4 }}
                            className={`rounded-2xl border shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition-all
                                ${s.dark
                                    ? 'bg-gradient-to-br from-emerald-700 to-teal-700 border-emerald-600'
                                    : 'bg-white border-slate-100'}`}
                        >
                            <div className={`w-10 h-10 ${s.iconBg} ${s.iconColor} rounded-xl flex items-center justify-center mb-4`}>
                                <Icon size={20} />
                            </div>
                            <p className={`text-3xl font-black leading-none tabular-nums ${s.dark ? 'text-white' : 'text-slate-800'}`}>
                                {s.value}
                            </p>
                            <p className={`text-[10px] font-bold uppercase tracking-wider mt-1.5 ${s.dark ? 'text-emerald-200' : 'text-slate-500'}`}>
                                {s.label}
                            </p>
                            <p className={`text-[9px] mt-0.5 font-medium ${s.dark ? 'text-white/50' : 'text-slate-400'}`}>
                                {s.desc}
                            </p>
                        </motion.div>
                    );
                })}
            </div>

            {/* ══ MAIN GRID ═══════════════════════════════════════════ */}
            <div className="grid lg:grid-cols-3 gap-6">

                {/* ── Antrian Pasien Aktif ── */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 bg-emerald-600 text-white rounded-xl flex items-center justify-center">
                                <ClipboardList size={16} />
                            </div>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Antrian Pasien Aktif</h3>
                        </div>
                        <Link href="/doctor/queue" className="flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-800 transition-colors">
                            Lihat Semua <ChevronRight size={13} />
                        </Link>
                    </div>

                    {isLoading ? (
                        <div className="bg-white rounded-2xl border border-slate-100 py-16 text-center">
                            <Loader2 className="animate-spin mx-auto text-emerald-500 mb-3" size={26} />
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Memuat antrian...</p>
                        </div>
                    ) : appointments.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-dashed border-slate-200 py-16 text-center">
                            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                <Users size={24} className="text-slate-300" />
                            </div>
                            <p className="text-sm font-bold text-slate-400">Tidak ada antrian aktif</p>
                            <p className="text-xs text-slate-300 mt-1">
                                Terdaftar ke: <span className="font-bold text-emerald-500">{doctorName || '—'}</span>
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2.5">
                            {appointments.slice(0, 6).map((app: any, idx: number) => {
                                const st = STATUS_MAP[app.status?.toLowerCase()] ?? STATUS_MAP.pending;
                                const expanded = activeQueue === app.id;
                                return (
                                    <motion.div key={app.id}
                                        initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.06 }}
                                        className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden"
                                    >
                                        {/* Row */}
                                        <div className="flex items-center gap-4 px-5 py-4 cursor-pointer"
                                            onClick={() => setActiveQueue(expanded ? null : app.id)}>
                                            <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0">
                                                {idx + 1}
                                            </div>
                                            <div className="w-10 h-10 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center font-black text-emerald-600 shrink-0">
                                                {app.patient_name?.charAt(0)?.toUpperCase() ?? '?'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-slate-800 text-sm truncate">{app.patient_name}</p>
                                                <div className="flex items-center gap-3 mt-0.5">
                                                    <span className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold">
                                                        <Clock size={9} className="text-emerald-500" />
                                                        {new Date(app.appointment_date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                                                    </span>
                                                    {app.service_type && (
                                                        <span className="text-[10px] text-slate-400 font-semibold truncate">· {app.service_type}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shrink-0 ${st.bg} ${st.color}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                                                {st.label}
                                            </span>
                                            <ChevronRight size={14} className={`text-slate-300 transition-transform shrink-0 ${expanded ? 'rotate-90' : ''}`} />
                                        </div>

                                        {/* Expandable */}
                                        <AnimatePresence>
                                            {expanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.18 }}
                                                    className="border-t border-slate-50 bg-slate-50/50 px-5 py-4 flex flex-wrap items-end gap-3"
                                                >
                                                    <div className="flex-1 min-w-[160px]">
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Catatan</p>
                                                        <p className="text-xs text-slate-600 font-medium">{app.notes || 'Tidak ada catatan'}</p>
                                                    </div>
                                                    <Link href="/doctor/medical-records">
                                                        <button className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-sm shadow-emerald-200">
                                                            <FileText size={11} /> Rekam Medis
                                                        </button>
                                                    </Link>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Action buttons — selalu terlihat */}
                                        {(app.status === 'confirmed' || app.status === 'scheduled') && (
                                            <div className="px-5 pb-4 flex gap-2 justify-end">
                                                {app.status === 'confirmed' && (
                                                    <button
                                                        onClick={e => { e.stopPropagation(); handleStatus(app.id, 'scheduled'); }}
                                                        className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm shadow-blue-200 active:scale-95"
                                                    >
                                                        Panggil ke Ruangan <ArrowRight size={11} />
                                                    </button>
                                                )}
                                                {app.status === 'scheduled' && (
                                                    <button
                                                        onClick={e => { e.stopPropagation(); handleStatus(app.id, 'completed'); }}
                                                        className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm shadow-emerald-200 animate-pulse active:scale-95"
                                                    >
                                                        Selesaikan Periksa <CheckCircle2 size={11} />
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* ── Sidebar ── */}
                <div className="space-y-4">

                    {/* Quick access */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Menu Cepat</p>
                        <div className="grid grid-cols-2 gap-3">
                            {QUICK.map((m, i) => {
                                const Icon = m.icon;
                                return (
                                    <Link key={i} href={m.href}>
                                        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                            className={`${m.bg} ${m.border} border rounded-2xl p-4 flex flex-col items-center gap-2 cursor-pointer hover:shadow-sm transition-all`}>
                                            <Icon size={20} className={m.color} />
                                            <span className={`text-[10px] font-black uppercase tracking-wide ${m.color}`}>{m.label}</span>
                                        </motion.div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Dokter info chip */}
                    <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-5 text-white shadow-md shadow-emerald-900/15 relative overflow-hidden">
                        <div className="absolute -top-6 -right-6 w-20 h-20 bg-white/10 rounded-full pointer-events-none" />
                        <div className="relative z-10">
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                                <Sparkles size={18} className="text-white" />
                            </div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-emerald-200 mb-1">Akun Aktif</p>
                            <p className="font-black text-white text-sm leading-snug">
                                {isNameLoaded
                                    ? (doctorName || 'Dokter')
                                    : <span className="inline-block w-24 h-4 bg-white/20 rounded animate-pulse" />}
                            </p>
                            <p className="text-[10px] text-emerald-200 mt-1 font-semibold">
                                {ROLE_LABEL[doctorRole] ?? 'Staff Medis'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}