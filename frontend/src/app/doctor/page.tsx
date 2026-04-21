'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { motion } from 'framer-motion';
import { 
    Users, Activity, ClipboardList, 
    Calendar, CheckCircle, Clock, 
    ArrowRight, Loader2, Heart,
    Thermometer, Pill
} from 'lucide-react';

export default function DoctorDashboard() {
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const res = await api.get('/clinic/appointments');
                setAppointments(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAppointments();
    }, []);

    const waitingTasks = appointments.filter((a: any) => a.status === 'scheduled');

    return (
        <div className="space-y-8 pb-32">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tighter">
                        Selamat Datang, <span className="text-indigo-600">dr. Pratama</span>
                    </h1>
                    <p className="text-slate-400 font-medium mt-1">
                        Sistem Informasi Medis Klinik.AI — Siap melayani pasien hari ini.
                    </p>
                </div>
                <div className="flex items-center gap-3 bg-indigo-50 px-5 py-3 rounded-2xl border border-indigo-100">
                    <Calendar size={20} className="text-indigo-600" />
                    <span className="text-sm font-black text-indigo-700 uppercase tracking-widest">
                        {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </span>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-[2rem] text-white shadow-xl shadow-indigo-200">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                        <Users size={24} />
                    </div>
                    <p className="text-sm font-bold opacity-80 uppercase tracking-widest">Pasien Hari Ini</p>
                    <h2 className="text-4xl font-black mt-1">{appointments.length}</h2>
                    <p className="text-xs mt-4 opacity-70">↑ 12% dari kemarin</p>
                </div>
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 text-emerald-600">
                        <Activity size={24} />
                    </div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Menunggu Periksa</p>
                    <h2 className="text-4xl font-black text-slate-800 mt-1">{waitingTasks.length}</h2>
                    <div className="flex items-center gap-2 mt-4 text-emerald-600 text-xs font-bold">
                        <Clock size={14} /> Waktu tunggu rata-rata: 15m
                    </div>
                </div>
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 text-indigo-600">
                        <CheckCircle size={24} />
                    </div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Tindakan Selesai</p>
                    <h2 className="text-4xl font-black text-slate-800 mt-1">{appointments.filter((a:any) => a.status === 'completed').length}</h2>
                    <p className="text-xs mt-4 text-slate-400 italic font-medium">Monitoring performa harian</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Antrian Pasien Aktif */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                            <ClipboardList size={22} className="text-indigo-600" /> Antrian Pemeriksaan
                        </h3>
                        <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800">Lihat Semua Antrian</button>
                    </div>

                    <div className="space-y-4">
                        {isLoading ? (
                            <div className="py-20 flex justify-center bg-white rounded-[2rem] border border-slate-100">
                                <Loader2 className="animate-spin text-indigo-600" size={32} />
                            </div>
                        ) : waitingTasks.length === 0 ? (
                            <div className="bg-white p-12 rounded-[2rem] border border-dashed border-slate-200 text-center">
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Tidak ada antrian aktif saat ini</p>
                            </div>
                        ) : (
                            waitingTasks.map((app: any, idx: number) => (
                                <motion.div
                                    key={app.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all duration-300"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-xl">
                                            {app.patient_name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-800 text-lg">{app.patient_name}</h4>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="flex items-center gap-1 text-xs text-slate-400 font-bold">
                                                    <Clock size={12} /> {new Date(app.appointment_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                </span>
                                                <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                                <span className="text-[10px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full font-black uppercase">Urgent</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="h-12 w-32 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all group-hover:bg-indigo-600 flex items-center justify-center gap-2">
                                        Panggil <ArrowRight size={14} />
                                    </button>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>

                {/* Sidebar Info & Tooltips */}
                <div className="space-y-6">
                    {/* Vitals & Monitoring Card */}
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
                        <h3 className="font-black text-slate-800 text-sm mb-6 relative uppercase tracking-wider">Health Insights</h3>
                        <div className="space-y-6 relative">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-500 shadow-sm shadow-red-100">
                                    <Heart size={20} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-end mb-1">
                                        <span className="text-[10px] font-black text-slate-400 uppercase">Tekanan Darah Rata2</span>
                                        <span className="text-sm font-black text-slate-800">120/80</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full w-[80%] bg-red-400 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 shadow-sm shadow-amber-100">
                                    <Thermometer size={20} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-end mb-1">
                                        <span className="text-[10px] font-black text-slate-400 uppercase">Suhu Pasien</span>
                                        <span className="text-sm font-black text-slate-800">36.5°C</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full w-[60%] bg-amber-400 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 shadow-sm shadow-blue-100">
                                    <Pill size={20} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-end mb-1">
                                        <span className="text-[10px] font-black text-slate-400 uppercase">Stok Obat AI</span>
                                        <span className="text-sm font-black text-slate-800">Stabil</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full w-[95%] bg-blue-400 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Access */}
                    <div className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-xl shadow-slate-200">
                        <h4 className="text-xs font-black uppercase tracking-widest opacity-60 mb-5">Menu Cepat Medis</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <button className="bg-white/10 hover:bg-white/20 p-4 rounded-2xl flex flex-col items-center gap-2 transition-all">
                                <FileText size={20} />
                                <span className="text-[10px] font-black uppercase">Resep</span>
                            </button>
                            <button className="bg-white/10 hover:bg-white/20 p-4 rounded-2xl flex flex-col items-center gap-2 transition-all">
                                <Activity size={20} />
                                <span className="text-[10px] font-black uppercase">Lab</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
