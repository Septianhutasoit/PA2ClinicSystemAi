'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { motion } from 'framer-motion';
import { Users, Clock, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

export default function DoctorDashboard() {
    const [todayPatients, setTodayPatients] = useState([]);

    useEffect(() => {
        // Ambil data pasien yang statusnya 'confirmed' dan menuju ke dokter ini
        api.get('/clinic/appointments').then(res => {
            const filtered = res.data.filter((app: any) => app.status === 'confirmed');
            setTodayPatients(filtered);
        });
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* WELCOME BANNER */}
            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-3xl font-black italic tracking-tighter">Selamat Pagi, Dokter.</h1>
                    <p className="text-indigo-100 text-sm font-medium mt-2">Anda memiliki {todayPatients.length} pasien yang sudah dikonfirmasi Admin hari ini.</p>
                </div>
                <div className="absolute top-0 right-0 p-8 opacity-10"><Users size={150} /></div>
            </div>

            {/* QUEUE LIST (Daftar Antrean) */}
            <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-blue-900/5">
                <h3 className="text-lg font-black text-slate-800 uppercase italic mb-8 border-b border-slate-50 pb-4">Antrean Pasien Saat Ini</h3>
                <div className="space-y-4">
                    {todayPatients.length > 0 ? todayPatients.map((app: any, i: number) => (
                        <div key={app.id} className="flex items-center justify-between p-5 bg-[#F8FAFF] rounded-3xl border border-blue-50 group hover:border-indigo-300 transition-all">
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-indigo-600 shadow-sm">{i + 1}</div>
                                <div>
                                    <p className="font-black text-slate-800 text-base uppercase italic">{app.patient_name}</p>
                                    <p className="text-xs font-bold text-slate-400 flex items-center gap-2 mt-1 uppercase tracking-widest"><Clock size={12} /> Estimasi: {new Date(app.appointment_date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                            </div>
                            <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center gap-2 group">
                                Mulai Periksa <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    )) : (
                        <div className="text-center py-20 opacity-30 italic font-black text-slate-400 uppercase tracking-widest">Belum ada pasien yang siap</div>
                    )}
                </div>
            </div>
        </div>
    );
}