'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft, ChevronRight, ArrowLeft, Clock,
    X, User, Phone, MapPin, Stethoscope,
    Calendar as CalendarIcon, Info, BadgeCheck
} from 'lucide-react';
import Link from 'next/link';

export default function AppointmentCalendar() {
    const [appointments, setAppointments] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedApp, setSelectedApp] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        api.get('/clinic/appointments').then(res => setAppointments(res.data));
    }, []);

    // Logic Kalender
    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
    for (let i = 1; i <= daysInMonth(currentDate.getFullYear(), currentDate.getMonth()); i++) days.push(i);

    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));

    const openDetail = (app: any) => {
        setSelectedApp(app);
        setIsModalOpen(true);
    };

    return (
        <div className="p-6 sm:p-10 space-y-8 min-h-screen bg-[#F8FAFC]">

            {/* ── HEADER ────────────────────────────────────────────────── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <Link href="/admin/appointments" className="p-3 bg-white hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded-2xl shadow-sm transition-all border border-slate-100">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Jadwal Reservasi</h1>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">Manajemen Antrean Klinik</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
                    <button onClick={prevMonth} className="p-2 hover:bg-slate-50 rounded-xl transition-all"><ChevronLeft size={20} className="text-slate-600" /></button>
                    <div className="px-4 py-1 text-center min-w-[160px]">
                        <p className="text-sm font-black text-slate-800 uppercase tracking-tighter">
                            {currentDate.toLocaleString('id-ID', { month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                    <button onClick={nextMonth} className="p-2 hover:bg-slate-50 rounded-xl transition-all"><ChevronRight size={20} className="text-slate-600" /></button>
                </div>
            </div>

            {/* ── GRID KALENDER (Tanpa Container Putih Besar) ────────────── */}
            <div className="grid grid-cols-7 gap-3 sm:gap-4">
                {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((d, i) => (
                    <div key={d} className={`text-center text-[10px] font-black uppercase tracking-[0.2em] pb-2 
                        ${i === 0 || i === 6 ? 'text-red-300' : 'text-slate-300'}`}>
                        {d}
                    </div>
                ))}

                {days.map((day, idx) => {
                    if (!day) return <div key={`empty-${idx}`} className="opacity-0" />;

                    const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const dayApps = appointments.filter(a => a.appointment_date.startsWith(dateString));
                    const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();

                    return (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`min-h-[140px] p-3 rounded-[24px] border transition-all relative group
                                ${dayApps.length > 0 ? 'bg-white border-emerald-100' : 'bg-white/40 border-slate-100 hover:bg-white'}
                                ${isToday ? 'ring-2 ring-emerald-500 border-transparent shadow-emerald-100 shadow-lg' : 'shadow-sm'}`}
                        >
                            <span className={`text-sm font-black ${isToday ? 'text-emerald-600' : dayApps.length > 0 ? 'text-slate-900' : 'text-slate-400'}`}>
                                {day}
                                {isToday && <span className="ml-1.5 text-[8px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-full uppercase">Hari ini</span>}
                            </span>

                            <div className="mt-3 space-y-1.5">
                                {dayApps.slice(0, 3).map(app => (
                                    <button
                                        key={app.id}
                                        onClick={() => openDetail(app)}
                                        className="w-full text-left p-2 rounded-xl border border-slate-50 bg-slate-50/50 hover:bg-emerald-600 hover:text-white transition-all group/item"
                                    >
                                        <p className="text-[10px] font-black truncate leading-tight uppercase tracking-tighter">{app.patient_name}</p>
                                        <div className="flex items-center gap-1 mt-1 opacity-60 text-[8px] font-bold">
                                            <Clock size={8} />
                                            <span>{new Date(app.appointment_date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </button>
                                ))}
                                {dayApps.length > 3 && (
                                    <p className="text-[9px] font-black text-emerald-600 text-center py-1">+{dayApps.length - 3} Lainnya</p>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* ── MODAL RINCIAN JADWAL ────────────────────────────────────── */}
            <AnimatePresence>
                {isModalOpen && selectedApp && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        {/* 1. Backdrop Gelap & Blur (Sesuai Inspector) */}
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />

                        {/* 2. Main Modal Card (Ukuran dikecilkan ke max-w-sm agar proporsional) */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative bg-white w-full max-w-sm rounded-[32px] shadow-2xl overflow-hidden border border-white"
                        >
                            {/* ── HEADER IMAGE ── */}
                            <div className="relative h-52 w-full">
                                <img
                                    src="/images/bg/dental-bg-1.png"
                                    alt="Background"
                                    className="w-full h-full object-cover"
                                />
                                {/* Overlay Gradient agar tombol X terlihat jelas */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

                                {/* Tombol Close (X) - Posisi Absolut di atas gambar */}
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="absolute top-4 right-4 w-9 h-9 bg-black/30 hover:bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all z-10"
                                >
                                    <X size={18} />
                                </button>

                                {/* Badge Status Melayang */}
                                <div className="absolute bottom-4 left-5">
                                    <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[10px] font-black text-slate-800 uppercase tracking-wider">
                                            {selectedApp.status === 'confirmed' ? 'Janji Terverifikasi' : 'Menunggu Admin'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* ── BODY CONTENT ── */}
                            <div className="p-7 space-y-6">
                                {/* Pasien Info */}
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[9px] font-black uppercase tracking-tighter">Pasien Portal</span>
                                        <span className="text-[9px] text-slate-300 font-bold tracking-widest uppercase">ID: #{selectedApp.id}</span>
                                    </div>
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                                        {selectedApp.patient_name}
                                    </h2>
                                    <p className="text-slate-400 font-bold text-[11px] mt-1.5 uppercase tracking-[0.1em]">
                                        Jenis Kelamin: {selectedApp.patient_gender || 'Umum'}
                                    </p>
                                </div>

                                {/* List Detail dengan Ikon (Sesuai Gaya Profil) */}
                                <div className="space-y-3.5">
                                    <div className="flex items-center gap-3.5 group">
                                        <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                                            <Stethoscope size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Dokter Spesialis</p>
                                            <p className="text-sm font-bold text-slate-700">{selectedApp.doctor_name}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3.5 group">
                                        <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                                            <Phone size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">WhatsApp</p>
                                            <p className="text-sm font-bold text-slate-700">{selectedApp.patient_phone || '-'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3.5 group">
                                        <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                                            <MapPin size={16} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Alamat Tinggal</p>
                                            <p className="text-sm font-bold text-slate-700 truncate">{selectedApp.patient_address || '-'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Green Info Box (Waktu Request) */}
                                <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-[20px] flex items-start gap-3">
                                    <BadgeCheck size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-[11px] font-bold text-emerald-900 leading-tight">Data Reservasi Sah</p>
                                        <p className="text-[10px] text-emerald-600/80 font-medium mt-0.5">Didaftarkan pada {new Date(selectedApp.created_at).toLocaleString('id-ID', { dateStyle: 'medium' })}</p>
                                    </div>
                                </div>

                                {/* Highlight Waktu Konsultasi (Card Terpisah) */}
                                <div className="pt-2">
                                    <div className="bg-slate-900 rounded-2xl p-4 flex items-center justify-between shadow-lg shadow-slate-200">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-emerald-400">
                                                <Clock size={20} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none mb-1">Waktu Janji</p>
                                                <p className="text-sm font-black text-white leading-none">
                                                    {new Date(selectedApp.appointment_date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right border-l border-white/10 pl-4">
                                            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none mb-1">Hari</p>
                                            <p className="text-sm font-black text-emerald-400 leading-none">
                                                {new Date(selectedApp.appointment_date).toLocaleDateString('id-ID', { weekday: 'short' })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Komponen Pembantu Detail
function DetailItem({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
    return (
        <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-slate-400">
                <Icon size={12} />
                <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
            </div>
            <p className="text-sm font-bold text-slate-700 pl-5">{value}</p>
        </div>
    );
}