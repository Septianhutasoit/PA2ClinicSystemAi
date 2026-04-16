'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { Users, Clock, ArrowRight, Loader2, UserRound, Stethoscope, Sparkles } from 'lucide-react';

export default function DoctorDashboard() {
    const [todayPatients, setTodayPatients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        api.get('/clinic/appointments').then(res => {
            const filtered = res.data.filter((app: any) => app.status === 'confirmed');
            setTodayPatients(filtered);
        }).finally(() => setIsLoading(false));
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in duration-700">

            {/* ── 1. WELCOME BANNER ─────────────────────────────────────── */}
            <div className="bg-white rounded-[2rem] p-10 border border-[#D4EDE5] shadow-sm relative overflow-hidden">
                {/* Accent bar kiri — identik dengan admin */}
                <div className="absolute left-0 top-0 bottom-0 w-2 bg-emerald-500 rounded-l-[2rem]" />

                <div className="relative z-10 pl-4">
                    <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-4 py-1.5 rounded-full mb-5">
                        <Sparkles size={12} className="text-emerald-600" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">
                            Sesi Kerja Aktif
                        </span>
                    </div>

                    <h1 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
                        Selamat Pagi, Dokter.
                    </h1>
                    <p className="text-slate-500 text-sm font-medium mt-3">
                        Anda memiliki{' '}
                        <span className="font-black text-emerald-600">{todayPatients.length} pasien</span>
                        {' '}yang sudah dikonfirmasi Admin hari ini.
                    </p>
                </div>

                {/* Ikon dekorasi — sama seperti admin */}
                <Stethoscope
                    size={200}
                    className="absolute -right-10 -bottom-10 text-emerald-50 rotate-[-15deg] pointer-events-none"
                />
            </div>

            {/* ── 2. STAT RINGKAS ──────────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Total Antrean */}
                <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm p-7 flex items-center justify-between hover:border-emerald-300 transition-all group">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                            Pasien Antre
                        </p>
                        <h3 className="text-4xl font-black italic text-slate-800">
                            {isLoading ? '—' : todayPatients.length}
                        </h3>
                    </div>
                    <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Users size={28} />
                    </div>
                </div>

                {/* Waktu Sekarang */}
                <div className="bg-slate-900 rounded-[1.5rem] p-7 flex flex-col justify-center shadow-lg">
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">
                        Waktu Sekarang
                    </p>
                    <h3 className="text-2xl font-black italic text-white">
                        {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                    </h3>
                    <p className="text-slate-400 text-[10px] font-bold uppercase mt-1">
                        {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </p>
                </div>
            </div>

            {/* ── 3. ANTREAN PASIEN ────────────────────────────────────── */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">

                {/* Header — identik pola admin */}
                <div className="flex justify-between items-center mb-7">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100">
                            <Users size={22} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">
                                Antrean Pasien Saat Ini
                            </h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                Pasien yang sudah dikonfirmasi admin
                            </p>
                        </div>
                    </div>
                </div>

                {/* Divider tipis */}
                <div className="border-t border-slate-100 mb-6" />

                {/* List */}
                <div className="space-y-3">
                    {isLoading ? (
                        <div className="py-12 text-center">
                            <Loader2 className="animate-spin mx-auto text-emerald-600" size={32} />
                        </div>
                    ) : todayPatients.length > 0 ? (
                        todayPatients.map((app: any, i: number) => (
                            <div
                                key={app.id}
                                className="flex flex-col md:flex-row items-center justify-between p-5 bg-[#F5FAF7] rounded-[1.5rem] border border-transparent hover:border-emerald-200 hover:bg-emerald-50/40 transition-all group"
                            >
                                <div className="flex items-center gap-5">
                                    {/* Nomor antrean */}
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-lg text-emerald-600 shadow-sm border border-emerald-100">
                                        {i + 1}
                                    </div>

                                    <div>
                                        <p className="font-black text-slate-800 text-base uppercase italic tracking-tight">
                                            {app.patient_name}
                                        </p>
                                        <p className="text-[10px] font-bold text-slate-400 flex items-center gap-2 mt-1 uppercase tracking-widest">
                                            <Clock size={11} className="text-emerald-500" />
                                            Estimasi:{' '}
                                            {new Date(app.appointment_date).toLocaleTimeString('id-ID', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <button className="mt-4 md:mt-0 bg-emerald-600 text-white px-7 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md hover:bg-emerald-700 transition-all flex items-center gap-2 group/btn">
                                    Mulai Periksa
                                    <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="py-20 text-center space-y-3 opacity-30">
                            <UserRound size={44} className="mx-auto text-slate-400" />
                            <p className="font-black text-slate-500 uppercase tracking-[0.3em] text-xs italic">
                                Belum Ada Pasien Yang Siap
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}