'use client';
import { useState, useEffect } from 'react';
import api from '@/services/api';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    User, Mail, ShieldCheck, Key,
    Camera, Clock, Calendar, CheckCircle,
    Activity, ChevronRight, Award, Zap
} from 'lucide-react';

export default function AdminProfile() {
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        api.get('/auth/me').then(res => setUserData(res.data));
    }, []);

    if (!userData) return <div className="p-10 text-center font-bold text-slate-400 animate-pulse uppercase tracking-widest">Memverifikasi Identitas...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            {/* --- 1. HERO PROFILE CARD --- */}
            <div className="bg-white rounded-[3rem] p-10 shadow-xl shadow-blue-900/5 border border-slate-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-blue-50 transition-colors duration-1000"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                    {/* Foto Profil dengan Ring Status */}
                    <div className="relative">
                        <div className="w-40 h-40 rounded-[3rem] overflow-hidden border-4 border-white shadow-2xl bg-slate-50">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.full_name}`} className="w-full h-full object-cover" alt="p" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-3 rounded-2xl shadow-lg border-4 border-white animate-bounce">
                            <ShieldCheck size={20} />
                        </div>
                    </div>

                    {/* Info Nama & Role */}
                    <div className="text-center md:text-left space-y-2">
                        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full border border-blue-100 mb-2">
                            <Award size={14} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Verified System Owner</span>
                        </div>
                        <h1 className="text-4xl font-black text-slate-800 tracking-tighter uppercase italic leading-none">{userData.full_name}</h1>
                        <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-xs italic">{userData.email}</p>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase bg-slate-50 px-4 py-2 rounded-xl">
                                <Clock size={14} className="text-emerald-500" /> Terdaftar: {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                            </div>
                            <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase bg-slate-50 px-4 py-2 rounded-xl">
                                <Zap size={14} className="text-amber-500" /> Level: Super Admin
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- 2. GRID INFO --- */}
            <div className="grid lg:grid-cols-3 gap-8">

                {/* AKTIVITAS TERAKHIR */}
                <div className="lg:col-span-2 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-black text-slate-800 uppercase italic mb-8 flex items-center gap-3">
                        <Activity className="text-blue-600" size={20} /> Log Aktivitas Anda
                    </h3>
                    <div className="space-y-6">
                        {[
                            { action: "Menambahkan Dokter Baru", time: "2 jam yang lalu", icon: <User className="text-blue-500" />, color: "bg-blue-50" },
                            { action: "Sinkronisasi AI Knowledge", time: "Hari ini, 09:00 AM", icon: <Zap className="text-amber-500" />, color: "bg-amber-50" },
                            { action: "Konfirmasi Janji Temu #234", time: "Kemarin", icon: <CheckCircle className="text-emerald-500" />, color: "bg-emerald-50" },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between group cursor-default">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                                        {item.icon}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-700">{item.action}</p>
                                        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{item.time}</p>
                                    </div>
                                </div>
                                <ChevronRight size={16} className="text-slate-200 group-hover:text-blue-500 transition-colors" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* PRIVACY BOX */}
                <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl flex flex-col justify-between">
                    <div>
                        <ShieldCheck size={40} className="text-emerald-400 mb-6" />
                        <h3 className="text-xl font-black italic tracking-tight">Privasi Data</h3>
                        <p className="text-slate-400 text-sm mt-3 leading-relaxed font-medium">
                            Akun Anda dilindungi dengan enkripsi SHA-256. Semua aktivitas dicatat untuk memantau keamanan database klinik.
                        </p>
                    </div>
                    <Link href="/admin/settings" className="w-full bg-white/10 hover:bg-white/20 text-white py-4 rounded-2xl text-center text-[10px] font-black uppercase tracking-widest transition-all mt-10">
                        Update Keamanan
                    </Link>
                </div>

            </div>
        </div>
    );
}