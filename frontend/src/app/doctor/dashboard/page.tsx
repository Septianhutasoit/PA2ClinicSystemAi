'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import {
    Clock, CheckCircle2, UserRound,
    Timer, ClipboardList, Loader2, ArrowRight,
    Stethoscope, CalendarDays, Users, TrendingUp,
    ChevronRight, AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

// ── Live Clock ────────────────────────────────────────────────────────────────
function useLiveClock() {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const t = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(t);
    }, []);
    return time;
}

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, ease: 'easeOut', delay },
});

export default function DoctorDashboard() {
    const [todayPatients, setTodayPatients] = useState<any[]>([]);
    const [doctorName,    setDoctorName]    = useState<string>('');
    const [doctorRole,    setDoctorRole]    = useState<string>('doctor');
    const [stats,         setStats]         = useState({
        todayCount:        0,
        completedCount:    0,
        totalAllPatients:  0,
    });
    const [isLoading,  setIsLoading]  = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const now = useLiveClock();

    // ── Fetch stats + antrian (dipanggil ulang setelah update status) ─────────
    const refreshData = async () => {
        try {
            const [resStats, resToday] = await Promise.all([
                api.get('/clinic/appointments/doctor-stats'),
                api.get('/clinic/appointments/my-today'),
            ]);
            setStats({
                todayCount:       resStats.data.waiting_patients   ?? 0,
                completedCount:   resStats.data.completed_today    ?? 0,
                totalAllPatients: resStats.data.total_all_patients ?? 0,
            });
            setTodayPatients(resToday.data ?? []);
        } catch {
            console.error('refreshData gagal');
        }
    };

    // ── Load awal ─────────────────────────────────────────────────────────────
    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            setFetchError(null);
            try {
                const resMe = await api.get('/auth/me');
                setDoctorName(resMe.data.full_name ?? '');
                setDoctorRole(resMe.data.role      ?? 'doctor');
                await refreshData();
            } catch {
                setFetchError('Gagal memuat data. Pastikan koneksi ke server aktif.');
            } finally {
                setIsLoading(false);
            }
        };
        load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Update status pasien → lalu refresh otomatis ──────────────────────────
    const handleStatusUpdate = async (id: number, newStatus: string) => {
        try {
            await api.patch(`/clinic/appointments/${id}/status`, { status: newStatus });
            await refreshData(); // angka + list langsung berubah
        } catch {
            alert('Gagal memperbarui status pasien.');
        }
    };

    // ── Format waktu ──────────────────────────────────────────────────────────
    const hh      = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const ss      = now.getSeconds().toString().padStart(2, '0');
    const tanggal = now.toLocaleDateString('id-ID', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });

    const roleLabel: Record<string, string> = {
        doctor: 'Dokter',
        nurse:  'Perawat / Staff Medis',
        admin:  'Administrator',
    };

    const totalToday  = stats.todayCount + stats.completedCount;
    const progressPct = totalToday > 0
        ? `${Math.round((stats.completedCount / totalToday) * 100)}%`
        : '0%';
    // ─────────────────────────────────────────────────────────────────────────────
    return (
        <div className="space-y-6">
            {/* ══ 1. WELCOME BANNER + CLOCK ═════════════════════════════════ */}
            <motion.div {...fadeUp(0)} className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* Welcome — 2/3 */}
                <div className="lg:col-span-2 relative overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-800 to-green-900 rounded-2xl p-8 shadow-xl shadow-emerald-900/20">
                    <div className="absolute -top-10 -right-10 w-52 h-52 bg-white/5 rounded-full pointer-events-none" />
                    <div className="absolute -bottom-8  -left-8  w-40 h-40 bg-white/5 rounded-full pointer-events-none" />
                    <Stethoscope size={160} className="absolute right-6 bottom-0 text-white/5 pointer-events-none" />

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full mb-5">
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-100">
                                Sesi Kerja Aktif
                            </span>
                        </div>

                        <h1 className="text-3xl font-black italic uppercase tracking-tight text-white leading-tight">
                            Selamat Datang,<br />
                            <span className="text-emerald-300">
                                {isLoading ? (
                                    <span className="inline-block w-36 h-8 bg-white/10 rounded-lg animate-pulse" />
                                ) : (doctorName || 'Staff')}
                            </span>
                        </h1>

                        {!isLoading && doctorRole && (
                            <span className="inline-block mt-2 text-[9px] font-black uppercase tracking-widest bg-white/10 border border-white/20 text-emerald-200 px-3 py-1 rounded-full">
                                {roleLabel[doctorRole] ?? doctorRole}
                            </span>
                        )}

                        <p className="text-emerald-200/80 text-sm font-medium mt-3 max-w-sm">
                            Hari ini Anda memiliki{' '}
                            <span className="font-black text-white">{stats.todayCount} pasien</span>{' '}
                            yang terdaftar ke nama Anda di antrean.
                        </p>

                        <div className="flex items-center gap-3 mt-6 flex-wrap">
                            <Link href="/doctor/queue">
                                <button className="flex items-center gap-2 bg-white text-emerald-800 text-[11px] font-black uppercase tracking-widest px-5 py-2.5 rounded-xl hover:bg-emerald-50 transition-all shadow-lg shadow-black/10">
                                    Mulai Periksa <ArrowRight size={13} />
                                </button>
                            </Link>
                            <Link href="/doctor/schedule">
                                <button className="flex items-center gap-2 bg-white/10 border border-white/20 text-white text-[11px] font-black uppercase tracking-widest px-5 py-2.5 rounded-xl hover:bg-white/20 transition-all">
                                    Lihat Jadwal
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Live Clock — 1/3 */}
                <div className="relative overflow-hidden bg-white border border-emerald-100 rounded-2xl p-7 shadow-sm flex flex-col justify-between">
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                        style={{
                            backgroundImage:
                                'repeating-linear-gradient(0deg,#059669 0,#059669 1px,transparent 1px,transparent 28px),' +
                                'repeating-linear-gradient(90deg,#059669 0,#059669 1px,transparent 1px,transparent 28px)',
                        }}
                    />
                    <div className="relative z-10">
                        <p className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.25em] mb-4 flex items-center gap-2">
                            <Clock size={11} /> Waktu Sekarang
                        </p>
                        <div className="flex items-end gap-1 leading-none">
                            <span className="text-5xl font-black text-slate-900 tabular-nums tracking-tighter">{hh}</span>
                            <span className="text-xl font-black text-emerald-500 mb-1 tabular-nums">:{ss}</span>
                            <span className="text-sm font-black text-slate-400 mb-1.5 ml-1">WIB</span>
                        </div>
                        <div className="mt-4 h-1 w-full bg-emerald-50 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-1000"
                                style={{ width: `${(now.getSeconds() / 59) * 100}%` }}
                            />
                        </div>
                    </div>
                    <div className="relative z-10 mt-5">
                        <p className="text-[11px] font-black text-slate-700 capitalize">{tanggal}</p>
                        <div className="mt-3 pt-3 border-t border-emerald-50 grid grid-cols-2 gap-2">
                            <div className="bg-emerald-50 rounded-xl p-3 text-center">
                                <p className="text-[9px] font-black text-emerald-600 uppercase tracking-wider">Antre</p>
                                <p className="text-2xl font-black text-emerald-800 mt-0.5 tabular-nums">
                                    {isLoading ? '—' : stats.todayCount}
                                </p>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-3 text-center">
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Selesai</p>
                                <p className="text-2xl font-black text-slate-800 mt-0.5 tabular-nums">
                                    {isLoading ? '—' : stats.completedCount}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* ══ 3. DAFTAR PASIEN HARI INI ════════════════════════════════ */}
            <motion.div {...fadeUp(0.2)} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

                {/* Header tabel */}
                <div className="px-7 py-5 border-b border-emerald-50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-emerald-700 text-white rounded-xl flex items-center justify-center shadow-md shadow-emerald-200">
                            <CalendarDays size={18} />
                        </div>
                        <div>
                            <h3 className="text-[13px] font-black uppercase italic tracking-tight text-slate-900 leading-none">
                                Antrian Pasien Saya
                            </h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                Terdaftar ke:{' '}
                                {isLoading
                                    ? <span className="inline-block w-20 h-3 bg-slate-100 rounded animate-pulse" />
                                    : <span className="text-emerald-600">{doctorName || '—'}</span>
                                }
                            </p>
                        </div>
                    </div>
                    <Link href="/doctor/schedule">
                        <button className="flex items-center gap-1.5 text-[10px] font-black text-emerald-700 uppercase tracking-widest bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-xl hover:bg-emerald-100 transition-all">
                            Lihat Semua <ChevronRight size={12} />
                        </button>
                    </Link>
                </div>

                {/* List pasien */}
                <div className="divide-y divide-slate-50">
                    {isLoading ? (
                        <div className="py-16 text-center">
                            <Loader2 className="animate-spin mx-auto text-emerald-600" size={28} />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-3">
                                Memuat data...
                            </p>
                        </div>

                    ) : todayPatients.length > 0 ? (
                        todayPatients.slice(0, 5).map((app: any, i: number) => (
                            <motion.div
                                key={app.id}
                                initial={{ opacity: 0, x: -12 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + i * 0.06, duration: 0.35 }}
                                className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-7 py-5 hover:bg-emerald-50/40 transition-all group"
                            >
                                {/* Info pasien */}
                                <div className="flex items-center gap-5">
                                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-base shrink-0 shadow-sm border ${
                                        i === 0
                                            ? 'bg-emerald-700 text-white border-emerald-600 shadow-emerald-200'
                                            : 'bg-white text-emerald-700 border-emerald-100'
                                    }`}>
                                        {i + 1}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-black text-slate-800 text-[13px] uppercase italic tracking-tight">
                                                {app.patient_name}
                                            </h4>
                                            {i === 0 && (
                                                <span className="text-[8px] font-black bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full uppercase tracking-widest">
                                                    Berikutnya
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 mt-1">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                                                <Timer size={10} className="text-emerald-500" />
                                                {new Date(app.appointment_date).toLocaleTimeString('id-ID', {
                                                    hour: '2-digit', minute: '2-digit',
                                                })} WIB
                                            </p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                                                <ClipboardList size={10} className="text-emerald-500" />
                                                {app.service_type ?? 'Pemeriksaan Umum'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* ── Tombol aksi — TIDAK dibungkus Link ── */}
                                <div className="mt-3 sm:mt-0 flex items-center gap-2">

                                    {/* confirmed → Panggil ke Ruangan */}
                                    {app.status === 'confirmed' && (
                                        <button
                                            onClick={() => handleStatusUpdate(app.id, 'scheduled')}
                                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-blue-600 text-white shadow-md shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
                                        >
                                            Panggil ke Ruangan <ArrowRight size={12} />
                                        </button>
                                    )}

                                    {/* scheduled → Selesaikan Periksa */}
                                    {app.status === 'scheduled' && (
                                        <button
                                            onClick={() => handleStatusUpdate(app.id, 'completed')}
                                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-emerald-700 text-white shadow-md shadow-emerald-200 hover:bg-emerald-800 animate-pulse transition-all active:scale-95"
                                        >
                                            Selesaikan Periksa <CheckCircle2 size={12} />
                                        </button>
                                    )}

                                    {/* completed → Label saja */}
                                    {app.status === 'completed' && (
                                        <span className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-400">
                                            <CheckCircle2 size={12} /> Telah Selesai
                                        </span>
                                    )}
                                </div>
                            </motion.div>
                        ))

                    ) : (
                        <div className="py-20 text-center space-y-3">
                            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto border border-emerald-100">
                                <UserRound size={28} className="text-emerald-300" />
                            </div>
                            <p className="font-black text-slate-500 text-sm">
                                Tidak ada pasien hari ini
                            </p>
                            <p className="text-[10px] text-slate-400 max-w-xs mx-auto leading-relaxed">
                                Pasien akan muncul di sini jika Admin mendaftarkan mereka ke nama:{' '}
                                <span className="font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                                    {doctorName || '—'}
                                </span>
                            </p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}