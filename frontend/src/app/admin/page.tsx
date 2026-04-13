'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { motion } from 'framer-motion';
import {
    Activity, Users, Calendar, ArrowUpRight, CheckCircle2,
    Zap, ArrowRight, User, Clock, MessageSquare
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer
} from 'recharts';

export default function AdminDashboard() {
    const [statsData, setStatsData] = useState({
        total_patients: 0, total_appointments: 0, total_doctors: 0,
        today_bookings: 0, reminder_success_rate: '0%'
    });
    const [chartData, setChartData] = useState([]);
    const [recentBookings, setRecentBookings] = useState([]);

    useEffect(() => {
        // Panggil semua data secara paralel
        Promise.all([
            api.get('/clinic/stats/summary'),
            api.get('/clinic/stats/weekly-bookings'),
            api.get('/clinic/stats/recent-bookings')
        ]).then(([summary, weekly, recent]) => {
            setStatsData(summary.data);
            setChartData(weekly.data);
            setRecentBookings(recent.data);
        }).catch(err => console.error("Gagal load data dashboard:", err));
    }, []);

    const cards = [
        { label: 'Total Pasien', val: statsData.total_patients, icon: <Users size={18} />, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Total Booking', val: statsData.total_appointments, icon: <Calendar size={18} />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Dokter Aktif', val: statsData.total_doctors, icon: <Zap size={18} />, color: 'text-rose-600', bg: 'bg-rose-50' },
        { label: 'Akurasi Notif', val: statsData.reminder_success_rate, icon: <Activity size={18} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* --- HEADER --- */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">Operations Overview</h1>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1">Real-time Neon Cloud Monitoring</p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 bg-blue-50 px-4 py-2 rounded-full border border-blue-100 shadow-sm">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span> SYSTEM LIVE
                </div>
            </div>

            {/* --- TOP CARDS --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((s, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                        className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-blue-900/5 hover:shadow-blue-200 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`${s.bg} ${s.color} p-3 rounded-2xl transition-transform group-hover:scale-110`}>{s.icon}</div>
                            <ArrowUpRight size={16} className="text-slate-200 group-hover:text-blue-500 transition-colors" />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{s.label}</p>
                        <p className="text-3xl font-black text-slate-800 italic leading-none">{s.val}</p>
                    </motion.div>
                ))}
            </div>

            {/* --- MIDDLE ROW: CHART & RECENT BOOKINGS --- */}
            <div className="grid lg:grid-cols-12 gap-8">
                {/* 1. WEEKLY CHART (8 Cols) */}
                <div className="lg:col-span-8 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest italic">Weekly Booking Trends</h3>
                        <div className="flex gap-2">
                            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Reservations</span>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }} dy={10} />
                                <YAxis hide />
                                <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }} />
                                <Area type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorTotal)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 2. RECENT BOOKINGS (4 Cols) */}
                <div className="lg:col-span-4 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest italic mb-6">Recent Bookings</h3>
                    <div className="space-y-5">
                        {recentBookings.length > 0 ? recentBookings.map((app: any) => (
                            <div key={app.id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl border border-transparent hover:border-blue-100 transition-all group">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm font-black text-xs">
                                    {app.patient_name.charAt(0)}
                                </div>
                                <div className="flex-1 overflow-hidden text-ellipsis">
                                    <p className="font-bold text-slate-800 text-sm truncate">{app.patient_name}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase truncate">{app.doctor_name}</p>
                                </div>
                                <div className={`w-2 h-2 rounded-full ${app.status === 'confirmed' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-amber-500'}`} />
                            </div>
                        )) : (
                            <p className="text-center py-10 text-xs font-bold text-slate-300 uppercase italic">No recent bookings</p>
                        )}
                    </div>
                    <button className="w-full mt-8 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-2 group">
                        Manage All <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>

            {/* --- BOTTOM ROW: n8n & TODAY SUMMARY --- */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* n8n Status Card */}
                <div className="lg:col-span-2 bg-slate-900 p-10 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center border border-blue-500/30">
                                <Activity size={20} className="text-blue-400" />
                            </div>
                            <h2 className="text-sm font-black uppercase tracking-widest text-blue-400 italic">n8n Automation Engine</h2>
                        </div>
                        <p className="text-2xl font-black mb-2 tracking-tight italic">Systems Operational.</p>
                        <p className="text-slate-400 text-xs font-medium max-w-md leading-relaxed italic">
                            Semua notifikasi WhatsApp dan sinkronisasi Chatbot AI berjalan normal melalui infrastruktur cloud n8n.
                        </p>
                    </div>
                    <CheckCircle2 size={250} className="absolute -right-16 -bottom-16 text-white/5 rotate-[-15deg]" />
                </div>

                {/* Today Summary */}
                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center group">
                    <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-[2rem] flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform">
                        <Calendar size={32} />
                    </div>
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-tighter italic">Today's Booking</h3>
                    <p className="text-5xl font-black text-slate-900 mt-2 italic">{statsData.today_bookings}</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-3 uppercase tracking-widest leading-none">Menunggu konfirmasi admin</p>
                </div>
            </div>
        </div>
    );
}