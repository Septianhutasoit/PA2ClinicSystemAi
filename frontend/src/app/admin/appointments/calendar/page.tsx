'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
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
    const [selectedDayApps, setSelectedDayApps] = useState<any[]>([]);
    const [selectedDayLabel, setSelectedDayLabel] = useState('');
    const [isDayModalOpen, setIsDayModalOpen] = useState(false);

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
    const openDayList = (apps: any[], day: number) => {
        setSelectedDayApps(apps);
        setSelectedDayLabel(
            `${day} ${currentDate.toLocaleString('id-ID', { month: 'long', year: 'numeric' })}`
        );
        setIsDayModalOpen(true);
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

            {/* ── GRID KALENDER ────────────── */}
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
                    const dayApps = appointments.filter((a: any) => a.appointment_date.startsWith(dateString));
                    const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();

                    return (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`min-h-[100px] p-2 rounded-xl border transition-all relative group
        ${dayApps.length > 0 ? 'bg-white border-emerald-100 shadow-sm' : 'bg-white/40 border-slate-100 hover:bg-white'}
        ${isToday ? 'ring-2 ring-emerald-500 border-transparent shadow-md' : ''}`}
                        >
                            <span className={`text-sm font-black ${isToday ? 'text-emerald-600' : dayApps.length > 0 ? 'text-slate-900' : 'text-slate-400'}`}>
                                {day}
                            </span>

                            <div className="mt-3 space-y-1.5">
                                {dayApps.slice(0, 3).map((app: any) => (
                                    <button
                                        key={app.id}
                                        onClick={() => openDetail(app)}
                                        className="w-full text-left p-1.5 rounded-lg border border-slate-50 bg-slate-50/50 hover:bg-emerald-600 hover:text-white transition-all"
                                    >
                                        <p className="text-[9px] font-black truncate leading-tight uppercase">{app.patient_name}</p>
                                        <div className="flex items-center gap-1 mt-0.5 opacity-60 text-[7px] font-bold">
                                            <Clock size={7} />
                                            <span>{new Date(app.appointment_date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </button>
                                ))}
                                {dayApps.length > 3 && (
                                    <button
                                        onClick={() => openDayList(dayApps, day)}
                                        className="w-full text-[9px] font-black text-emerald-600 hover:text-white text-center py-1.5 rounded-lg hover:bg-emerald-600 transition-all uppercase tracking-wide"
                                    >
                                        +{dayApps.length - 3} Lainnya
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* ── MODAL RINCIAN JADWAL ────────────────────────────────────── */}
            {typeof window !== 'undefined' && createPortal(
                <AnimatePresence>
                    {isModalOpen && selectedApp && (
                        <div
                            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/10 backdrop-blur-[2px]"
                            onClick={() => setIsModalOpen(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.95, opacity: 0, y: 15 }}
                                onClick={(e) => e.stopPropagation()}
                                className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
                            >
                                {/* Header */}
                                <div className="px-6 py-4 flex justify-between items-center border-b border-slate-100 bg-slate-50/50">
                                    <div>
                                        <h2 className="text-base font-black text-slate-800 tracking-tight">Rincian Jadwal</h2>
                                        <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mt-0.5">Nauli Dental System</p>
                                    </div>
                                    <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 hover:bg-white text-slate-400 rounded-lg flex items-center justify-center border border-slate-200 transition-colors">
                                        <X size={16} />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="p-2">
                                    <div className="divide-y divide-slate-50 bg-slate-50/50 rounded-lg overflow-hidden border border-slate-100">
                                        <DetailRow label="Pasien" value={selectedApp.patient_name} />
                                        <DetailRow label="Dokter" value={selectedApp.doctor_name} isHighlight />
                                        <DetailRow label="Waktu" value={new Date(selectedApp.appointment_date).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })} />
                                        <DetailRow label="Kontak" value={selectedApp.patient_phone || '-'} isLast />
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="px-6 py-3.5 flex items-center justify-between bg-white border-t border-slate-50">
                                    <div className="flex flex-col">
                                        <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em] leading-none mb-1">
                                            Waktu Pendaftaran (Req)
                                        </p>
                                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-tight">
                                            {selectedApp.created_at ? new Date(selectedApp.created_at).toLocaleString('id-ID', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            }) : '—'} WIB
                                        </span>
                                    </div>

                                    <div className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase border 
${selectedApp.status === 'confirmed'
                                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                            : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                        {selectedApp.status === 'confirmed' ? 'Terkonfirmasi' : 'Menunggu'}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}

            {/* ── MODAL DAFTAR LENGKAP PER HARI ──────────────────────────── */}
            {typeof window !== 'undefined' && createPortal(
                <AnimatePresence>
                    {isDayModalOpen && (
                        <div
                            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/30 backdrop-blur-sm"
                            onClick={() => setIsDayModalOpen(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.95, opacity: 0, y: 15 }}
                                onClick={(e) => e.stopPropagation()}
                                className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200 max-h-[80vh] flex flex-col"
                            >
                                {/* Header */}
                                <div className="px-6 py-4 flex justify-between items-center border-b border-slate-100 bg-slate-50/50 shrink-0">
                                    <div>
                                        <h2 className="text-base font-black text-slate-800 tracking-tight">Semua Jadwal</h2>
                                        <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mt-0.5">
                                            {selectedDayLabel} · {selectedDayApps.length} Pasien
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setIsDayModalOpen(false)}
                                        className="w-8 h-8 hover:bg-white text-slate-400 rounded-lg flex items-center justify-center border border-slate-200 transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>

                                {/* List — scrollable */}
                                <div className="p-3 space-y-2 overflow-y-auto flex-1">
                                    {selectedDayApps.map((app: any) => (
                                        <button
                                            key={app.id}
                                            onClick={() => {
                                                setIsDayModalOpen(false);
                                                openDetail(app);
                                            }}
                                            className="w-full text-left p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-emerald-50 hover:border-emerald-200 transition-all flex items-center justify-between gap-3 group"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center font-black text-white text-sm shrink-0">
                                                    {app.patient_name?.charAt(0)?.toUpperCase() || 'P'}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-xs font-black text-slate-800 truncate uppercase tracking-tight">
                                                        {app.patient_name}
                                                    </p>
                                                    <p className="text-[10px] text-slate-400 font-bold truncate mt-0.5">
                                                        {app.doctor_name}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 shrink-0">
                                                <Clock size={11} />
                                                {new Date(app.appointment_date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
}

function DetailRow({ label, value, isHighlight = false, isLast = false }: any) {
    return (
        <div className={`flex items-center px-5 py-3 transition-colors hover:bg-white
            ${isLast ? '' : 'border-b border-slate-100/50'}`}>
            <div className="w-1/3 shrink-0">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">
                    {label}
                </p>
            </div>
            <div className="flex-1">
                <p className={`text-xs font-bold ${isHighlight ? 'text-emerald-600' : 'text-slate-700'}`}>
                    {value}
                </p>
            </div>
        </div>
    );
}
