'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { motion } from 'framer-motion';
import { Activity, Users, Calendar,  ArrowUpRight, CheckCircle2, Zap } from 'lucide-react';

export default function AdminDashboard() {
    const [statsData, setStatsData] = useState({
        total_patients: 0,
        total_appointments: 0,
        total_doctors: 0,
        today_bookings: 0,
        reminder_success_rate: '0%'
    });

    useEffect(() => {
        // Ambil data asli dari backend
        api.get('/clinic/stats/summary')
            .then(res => setStatsData(res.data))
            .catch(err => console.error("Gagal load statistik:", err));
    }, []);

    const cards = [
        { label: 'Total Pasien', val: statsData.total_patients, icon: <Users size={18}/>, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Total Booking', val: statsData.total_appointments, icon: <Calendar size={18}/>, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Dokter Aktif', val: statsData.total_doctors, icon: <Zap size={18}/>, color: 'text-rose-600', bg: 'bg-rose-50' },
        { label: 'Akurasi Notif', val: statsData.reminder_success_rate, icon: <Activity size={18}/>, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-xl font-black text-slate-900 tracking-tight">System Overview</h1>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time Cloud Monitoring</p>
                </div>
                <div className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                    DB STATUS: CONNECTED
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {cards.map((s, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-5 rounded-[1.5rem] border border-slate-200 shadow-sm hover:shadow-md transition-all group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`${s.bg} ${s.color} p-2.5 rounded-xl transition-transform group-hover:scale-110`}>
                                {s.icon}
                            </div>
                            <ArrowUpRight size={14} className="text-slate-300" />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1">{s.label}</p>
                        <p className="text-2xl font-black text-slate-800 italic leading-none">{s.val}</p>
                    </motion.div>
                ))}
            </div>

            {/* AI & Integration Monitoring Section */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* n8n Status Card */}
                <div className="lg:col-span-2 bg-slate-900 p-8 rounded-[2rem] text-white relative overflow-hidden shadow-xl">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-500/30">
                                <Activity size={16} className="text-blue-400" />
                            </div>
                            <h2 className="text-sm font-black uppercase tracking-widest text-blue-400 italic">n8n Automation Engine</h2>
                        </div>
                        <p className="text-2xl font-black mb-2 tracking-tight">System is Healthy.</p>
                        <p className="text-slate-400 text-xs font-medium max-w-md leading-relaxed">
                            Integrasi WhatsApp Gateway dan Chatbot AI berjalan normal. Log notifikasi terakhir dikirim 5 menit yang lalu.
                        </p>
                        <button className="mt-8 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all">
                            View Integration Logs
                        </button>
                    </div>
                    {/* Background Decorative Icon */}
                    <CheckCircle2 size={200} className="absolute -right-10 -bottom-10 text-white/5 rotate-[-15deg]" />
                </div>

                {/* Today Summary */}
                <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center">
                    <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-4 shadow-inner">
                        <Calendar size={28} />
                    </div>
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-tighter">Today's Booking</h3>
                    <p className="text-4xl font-black text-slate-900 mt-2 italic">{statsData.today_bookings}</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase">Pasien menunggu hari ini</p>
                </div>
            </div>
        </div>
    );
}