'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, ArrowLeft, Clock } from 'lucide-react';
import Link from 'next/link';

export default function AppointmentCalendar() {
    const [appointments, setAppointments] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());

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

    return (
        <div className="p-8 space-y-6 bg-slate-50 min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4">
                    <Link href="/admin/appointments" className="p-2 hover:bg-slate-50 rounded-xl transition-all">
                        <ArrowLeft size={20} className="text-slate-400" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-black text-slate-900">Kalender Reservasi</h1>
                        <p className="text-xs text-slate-400 font-medium">Pantau kepadatan jadwal praktek</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-200">
                    <button onClick={prevMonth} className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all"><ChevronLeft size={18} /></button>
                    <span className="text-sm font-black text-slate-700 min-w-[120px] text-center uppercase tracking-widest">
                        {currentDate.toLocaleString('id-ID', { month: 'long', year: 'numeric' })}
                    </span>
                    <button onClick={nextMonth} className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all"><ChevronRight size={18} /></button>
                </div>
            </div>

            {/* Grid Kalender */}
            <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm">
                <div className="grid grid-cols-7 gap-4">
                    {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(d => (
                        <div key={d} className="text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">{d}</div>
                    ))}

                    {days.map((day, idx) => {
                        if (!day) return <div key={idx} />;

                        // Cari appointment di tanggal ini
                        const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        const dayApps = appointments.filter(a => a.appointment_date.startsWith(dateString));

                        return (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -2 }}
                                className={`min-h-[120px] p-4 rounded-3xl border transition-all relative overflow-hidden
                                    ${dayApps.length > 0 ? 'border-emerald-100 bg-emerald-50/30' : 'border-slate-50 bg-white'}`}
                            >
                                <span className={`text-sm font-black ${dayApps.length > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                                    {day}
                                </span>

                                {/* List Appointment Kecil di Dalam Kotak Tanggal */}
                                <div className="mt-2 space-y-1.5">
                                    {dayApps.slice(0, 3).map(app => (
                                        <div key={app.id} className="p-2 bg-white rounded-xl border border-emerald-100 shadow-sm">
                                            <p className="text-[9px] font-bold text-slate-700 truncate">{app.patient_name}</p>
                                            <div className="flex items-center gap-1 mt-0.5 text-[8px] text-emerald-500 font-medium">
                                                <Clock size={8} />
                                                <span>{new Date(app.appointment_date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                            {/* Tgl Request */}
                                            <p className="text-[7px] text-slate-300 mt-0.5 italic">
                                                Req: {new Date(app.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit' })}
                                            </p>
                                        </div>
                                    ))}
                                    {dayApps.length > 3 && (
                                        <p className="text-[8px] font-bold text-emerald-500 text-center">+{dayApps.length - 3} lainnya</p>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}