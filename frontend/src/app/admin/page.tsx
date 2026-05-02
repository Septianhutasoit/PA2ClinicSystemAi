'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { motion } from 'framer-motion';
import {
    Users, Calendar, Zap, MessageSquare,
    ArrowRight, Search, Bell, Clock, CheckCircle2,
    ShieldCheck, TrendingUp, UserCheck, Activity, ArrowUpRight,
    ChevronLeft, ChevronRight, MoreHorizontal, Star, Award, BookOpen, Stethoscope
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell, Legend,
    LineChart, Line
} from 'recharts';

export default function AdminDashboard() {
    const [viewMode, setViewMode] = useState('Weekly');
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [statsData, setStatsData] = useState({
        total_patients: 0, total_appointments: 0, total_doctors: 0, today_bookings: 0
    });
    const [analytics, setAnalytics] = useState([]);
    const [recentBookings, setRecentBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadAllData = async () => {
            try {
                const mode = viewMode.toLowerCase();
                const [summary, chart, recent] = await Promise.all([
                    api.get('/clinic/stats/summary'),
                    api.get(`/clinic/stats/analytics?period=${mode}`),
                    api.get('/clinic/stats/recent-bookings')
                ]);
                setStatsData(summary.data);

                // Transform data untuk grafik
                const chartData = chart.data.map((item: any) => ({
                    name: item.name,
                    online: item.online || item.ai || item.total || 0
                }));
                setAnalytics(chartData);
                setRecentBookings(recent.data);
            } catch (err) {
                console.error("Gagal sinkronisasi dashboard");
                // Data dummy untuk testing
                setAnalytics([
                    { name: 'Sen', online: 45 },
                    { name: 'Sel', online: 62 },
                    { name: 'Rab', online: 38 },
                    { name: 'Kam', online: 71 },
                    { name: 'Jum', online: 54 },
                    { name: 'Sab', online: 33 },
                    { name: 'Min', online: 28 },
                ]);
            } finally {
                setIsLoading(false);
            }
        };
        loadAllData();
    }, [viewMode]);

    // Data kalender statis
    const weekDays = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const events = [
        { date: 5, title: 'Scaling Gigi', time: '09:00', patient: 'Budi', type: 'dental' },
        { date: 12, title: 'Cabut Gigi', time: '10:30', patient: 'Siti', type: 'surgery' },
        { date: 15, title: 'Konsultasi', time: '14:00', patient: 'Andi', type: 'consult' },
        { date: 20, title: 'Behel Gigi', time: '11:00', patient: 'Rina', type: 'ortho' },
        { date: 25, title: 'Scaling', time: '08:30', patient: 'Doni', type: 'dental' },
    ];

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const days = [];
        const startOffset = firstDay.getDay();

        for (let i = 0; i < startOffset; i++) {
            days.push(null);
        }
        for (let i = 1; i <= lastDay.getDate(); i++) {
            days.push(i);
        }
        return days;
    };

    const days = getDaysInMonth(currentMonth);
    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    const getEventForDate = (date: number) => {
        return events.find(e => e.date === date);
    };

    // Custom Tooltip untuk grafik
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 rounded-xl shadow-lg border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{label}</p>
                    <p className="text-lg font-black text-emerald-600">
                        {payload[0].value} Reservasi
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-10">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white/50 p-6 rounded-2xl border border-emerald-50 backdrop-blur-md">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Pusat Kendali Admin</h1>
                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.3em] mt-2">Nauli Dental Care • Monitoring Real-time</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative group hidden md:block">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-600 transition-colors" size={16} />
                        <input type="text" placeholder="Cari data pasien atau dokter..." className="pl-11 pr-6 py-2.5 bg-white border border-slate-100 rounded-xl text-xs w-72 focus:ring-4 focus:ring-emerald-50 transition-all font-bold outline-none" />
                    </div>
                    <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
                        <div className="text-right hidden sm:block">
                            <p className="text-[11px] font-black text-slate-900 uppercase leading-none">Administrator</p>
                            <p className="text-[9px] text-emerald-600 font-bold tracking-widest uppercase italic">Terverifikasi</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black italic shadow-lg">K</div>
                    </div>
                </div>
            </div>

            {/* STATISTIK CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Pasien', val: statsData.total_patients, icon: <Users />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Staff Medis', val: statsData.total_doctors, icon: <UserCheck />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Booking Hari Ini', val: statsData.today_bookings, icon: <Calendar />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Total Reservasi', val: statsData.total_appointments, icon: <ShieldCheck />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                ].map((card, i) => (
                    <motion.div key={i} whileHover={{ y: -5 }} className="bg-white p-6 rounded-2xl border border-emerald-50 shadow-xl shadow-emerald-900/5 flex items-center justify-between group transition-all">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{card.label}</p>
                            <h3 className="text-3xl font-black text-slate-800 italic leading-none">{card.val}</h3>
                        </div>
                        <div className={`w-12 h-12 ${card.bg} ${card.color} rounded-xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                            {card.icon}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* GRAFIK ANALITIK + KALENDER */}
            <div className="grid lg:grid-cols-12 gap-8">

                {/* Tren Reservasi - Bar Chart dengan Tooltip */}
                <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Tren Reservasi Online</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Jumlah pendaftaran via website</p>
                        </div>
                        <div className="flex bg-slate-50 p-1 rounded-lg gap-1">
                            {['Weekly', 'Monthly'].map(m => (
                                <button key={m} onClick={() => setViewMode(m)} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${viewMode === m ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400'}`}>{m === 'Weekly' ? 'MINGGUAN' : 'BULANAN'}</button>
                            ))}
                        </div>
                    </div>

                    <div className="h-[340px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={analytics}
                                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                                barGap={8}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fontWeight: 600, fill: '#64748b' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fontWeight: 600, fill: '#64748b' }}
                                    domain={[0, 'auto']}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
                                <Bar
                                    dataKey="online"
                                    name="Pendaftaran Online"
                                    fill="#059669"
                                    radius={[6, 6, 0, 0]}
                                    barSize={40}
                                    animationDuration={1000}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Summary */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-emerald-600" />
                            <span className="text-[10px] font-bold text-slate-500">Total Reservasi Online</span>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-bold text-slate-400">Total</p>
                            <p className="text-lg font-black text-emerald-600">
                                {analytics.reduce((sum, item) => sum + (item.online || 0), 0)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* KALENDER JADWAL */}
                <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                                <Calendar size={18} className="text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="font-black text-slate-800 text-sm uppercase tracking-wider">Jadwal Dokter</h3>
                                <p className="text-[9px] text-slate-400">Kalender praktik harian</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={prevMonth} className="p-1.5 hover:bg-slate-100 rounded-lg transition-all"><ChevronLeft size={16} className="text-slate-500" /></button>
                            <span className="text-sm font-bold text-slate-700 min-w-[100px] text-center">{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</span>
                            <button onClick={nextMonth} className="p-1.5 hover:bg-slate-100 rounded-lg transition-all"><ChevronRight size={16} className="text-slate-500" /></button>
                        </div>
                    </div>

                    {/* Grid Kalender */}
                    <div className="grid grid-cols-7 gap-1 mb-3">
                        {weekDays.map(day => (
                            <div key={day} className="text-center py-2 text-[10px] font-black text-slate-400 uppercase tracking-wider">{day}</div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                        {days.map((day, idx) => {
                            const event = day ? getEventForDate(day) : null;
                            const isToday = day === new Date().getDate() &&
                                currentMonth.getMonth() === new Date().getMonth() &&
                                currentMonth.getFullYear() === new Date().getFullYear();
                            return (
                                <div key={idx} className="min-h-[65px] p-1 border border-slate-50 rounded-lg bg-white">
                                    {day ? (
                                        <div className={`text-right text-[10px] font-bold p-1 rounded-full w-6 h-6 flex items-center justify-center ${isToday ? 'bg-emerald-600 text-white' : 'text-slate-500'}`}>
                                            {day}
                                        </div>
                                    ) : (
                                        <div className="h-6" />
                                    )}
                                    {event && (
                                        <div className="mt-1 p-1 rounded-md border-l-2 bg-emerald-50 text-emerald-700 border-emerald-200 text-[7px] font-bold truncate">
                                            {event.title}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Legend Events */}
                    <div className="mt-5 pt-4 border-t border-slate-100">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-3">Jadwal Hari Ini</p>
                        <div className="space-y-2">
                            {events.slice(0, 3).map((event, idx) => (
                                <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 rounded-xl">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                        <span className="text-[11px] font-bold text-slate-700">{event.title}</span>
                                        <span className="text-[9px] text-slate-400">- {event.patient}</span>
                                    </div>
                                    <span className="text-[9px] font-bold text-slate-500">{event.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* DAFTAR RESERVASI TERBARU */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter leading-none">Reservasi Terbaru</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-widest">Data pendaftar hari ini via website</p>
                    </div>
                    <button className="flex items-center gap-2 px-5 py-2 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all shadow-sm group">Lihat Semua <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /></button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] border-b border-slate-50">
                                <th className="pb-3">Nama Pasien</th>
                                <th className="pb-3">Dokter Tujuan</th>
                                <th className="pb-3">Waktu Booking</th>
                                <th className="pb-3 text-center">Status</th>
                                <th className="pb-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {recentBookings.map((app: any) => (
                                <tr key={app.id} className="group hover:bg-emerald-50/30 transition-colors">
                                    <td className="py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-emerald-600 shadow-sm italic text-xs">
                                                {app.patient_name?.charAt(0) || 'P'}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800 text-[13px]">{app.patient_name}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">{app.patient_phone}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4">
                                        <p className="font-bold text-slate-700 text-xs italic">{app.doctor_name}</p>
                                        <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Gigi & Mulut</p>
                                    </td>
                                    <td className="py-4 font-bold text-slate-500 text-xs">
                                        <div className="flex items-center gap-2">
                                            <Clock size={12} className="text-emerald-400" />
                                            {new Date(app.appointment_date).toLocaleString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </td>
                                    <td className="py-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${app.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                            {app.status === 'confirmed' ? 'Terkonfirmasi' : 'Menunggu'}
                                        </span>
                                    </td>
                                    <td className="py-4 text-right">
                                        <button className="p-2 text-slate-300 hover:text-emerald-600 transition-colors"><ArrowUpRight size={18} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}