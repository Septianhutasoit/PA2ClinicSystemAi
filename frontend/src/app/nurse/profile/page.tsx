'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import {
    User, Mail, ShieldCheck, Phone, Briefcase,
    Calendar, Award, Lock, Edit3, MapPin,
    CheckCircle, Clock, ChevronRight, Camera,
    Stethoscope, HeartPulse, AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function StaffProfilePage() {
    const [profile, setProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        api.get('/clinic/profile/me')
            .then(res => {
                setProfile(res.data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError("Gagal memuat data profil.");
                setIsLoading(false);
            });
    }, []);

    if (isLoading) return (
        <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-teal-100 border-t-teal-600 rounded-full animate-spin" />
            <p className="text-sm font-bold text-slate-400 animate-pulse uppercase tracking-widest">Sinkronisasi Data...</p>
        </div>
    );

    if (error || !profile) return (
        <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
            <div className="p-4 bg-red-50 rounded-full text-red-500"><AlertCircle size={40} /></div>
            <p className="text-red-500 font-black uppercase tracking-tight">{error || "Profil tidak ditemukan"}</p>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">

            {/* --- TOP HERO SECTION --- */}
            <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-[3rem] blur-xl opacity-10 group-hover:opacity-20 transition-opacity" />
                <div className="relative bg-white rounded-[3rem] p-8 md:p-12 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row items-center gap-10">

                    {/* Avatar with Status */}
                    <div className="relative">
                        <div className="w-40 h-40 rounded-[2.5rem] bg-slate-100 border-4 border-white shadow-2xl overflow-hidden group-hover:scale-105 transition-transform duration-500">
                            {profile.details?.photo_url ? (
                                <img src={profile.details.photo_url} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white text-5xl font-black">
                                    {profile.full_name.charAt(0)}
                                </div>
                            )}
                            <button className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                <Camera size={24} />
                            </button>
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-green-500 border-4 border-white w-8 h-8 rounded-full animate-pulse shadow-lg" />
                    </div>

                    <div className="flex-1 text-center md:text-left space-y-4">
                        <div>
                            <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                                <h1 className="text-4xl font-black text-slate-900 tracking-tight">{profile.full_name}</h1>
                                <CheckCircle className="text-teal-500" size={24} />
                            </div>
                            <p className="text-teal-600 font-black text-xs uppercase tracking-[0.3em] italic">{profile.role} Terverifikasi</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
                            <div className="flex items-center gap-3 text-slate-500 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                <Mail size={18} className="text-teal-500" />
                                <span className="text-xs font-bold truncate">{profile.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-500 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                <Phone size={18} className="text-teal-500" />
                                <span className="text-xs font-bold">{profile.details?.phone || 'Not Set'}</span>
                            </div>
                        </div>
                    </div>

                    <button className="bg-slate-900 text-white p-4 rounded-3xl hover:bg-teal-600 transition-all shadow-xl active:scale-95">
                        <Edit3 size={20} />
                    </button>
                </div>
            </div>

            {/* --- STATS GRID --- */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    {
                        label: 'Total Pasien Selesai',
                        val: profile.stats.total_handled, 
                        icon: Award,
                        color: 'bg-teal-50 text-teal-600'
                    },
                    {
                        label: 'Tahun Pengalaman',
                        val: profile.details?.experience || '0', 
                        icon: Briefcase,
                        color: 'bg-blue-50 text-blue-600'
                    },
                    {
                        label: 'Role Akun',
                        val: profile.role, // DINAMIS (Nurse/Doctor)
                        icon: ShieldCheck,
                        color: 'bg-purple-50 text-purple-600'
                    },
                    {
                        label: 'ID Staff',
                        val: `#${profile.created_at}`, 
                        icon: Clock,
                        color: 'bg-red-50 text-red-600'
                    },
                ].map((s, i) => (
                    <motion.div key={i} whileHover={{ y: -5 }} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                        <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center mb-3`}>
                            <s.icon size={20} />
                        </div>
                        <h4 className="text-xl font-black text-slate-800 leading-none">{s.val}</h4>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-2">{s.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* --- MAIN CONTENT SPLIT --- */}
            <div className="grid md:grid-cols-3 gap-8">

                {/* Information Card */}
                <div className="md:col-span-2 space-y-8">
                    <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-bl-full -mr-10 -mt-10 opacity-50" />

                        <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                            <span className="w-2 h-8 bg-teal-500 rounded-full" />
                            Detail Informasi Profesional
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Spesialisasi Klinis</label>
                                    <div className="flex items-center gap-3 text-slate-700 font-bold">
                                        <div className="w-8 h-8 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center"><Stethoscope size={16} /></div>
                                        {profile.details?.specialty || 'General Medical Staff'}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Lokasi Penugasan</label>
                                    <div className="flex items-center gap-3 text-slate-700 font-bold">
                                        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center"><MapPin size={16} /></div>
                                        Klinik Nauli Dental, Balige
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Nomor Izin Praktik (STR)</label>
                                    <div className="flex items-center gap-3 text-slate-700 font-bold font-mono">
                                        <div className="w-8 h-8 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center"><ShieldCheck size={16} /></div>
                                        {profile.details?.str_number || 'REG-99201-9928'}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Tanggal Bergabung</label>
                                    <div className="flex items-center gap-3 text-slate-700 font-bold">
                                        <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center"><Calendar size={16} /></div>
                                        12 Januari 2024
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Security Section */}
                    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative group overflow-hidden">
                        <div className="absolute bottom-0 right-0 opacity-10 group-hover:rotate-12 transition-transform">
                            <Lock size={150} />
                        </div>
                        <h3 className="text-xl font-black mb-8 flex items-center gap-3">
                            <Lock className="text-teal-400" size={24} />
                            Keamanan Akun
                        </h3>
                        <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                            <input
                                type="password"
                                placeholder="Masukkan password baru"
                                className="flex-1 bg-white/10 border border-white/10 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-teal-400 outline-none backdrop-blur-md"
                            />
                            <button className="bg-teal-500 hover:bg-teal-400 px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all shadow-lg shadow-teal-500/20 whitespace-nowrap">
                                Update Keamanan
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                    {/* Schedule Card */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="font-black text-slate-800 text-xs uppercase tracking-widest">Jadwal Praktik</h4>
                            <span className="p-1.5 bg-slate-50 text-slate-400 rounded-lg"><Clock size={14} /></span>
                        </div>
                        <div className="space-y-3">
                            {(profile.details?.schedules?.length > 0 ? profile.details.schedules : [
                                { day: 'Senin', time: '08:00 - 16:00' },
                                { day: 'Rabu', time: '08:00 - 16:00' },
                                { day: 'Jumat', time: '08:00 - 16:00' },
                            ]).map((s: any, i: number) => (
                                <div key={i} className="group flex items-center justify-between bg-slate-50 hover:bg-teal-50 p-4 rounded-2xl transition-all cursor-default">
                                    <span className="text-xs font-black text-slate-500 group-hover:text-teal-700">{s.day}</span>
                                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-teal-600 bg-white px-3 py-1 rounded-full">{s.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Help */}
                    <div className="bg-indigo-50 p-8 rounded-[2.5rem] border border-indigo-100">
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Bantuan Admin</p>
                        <h5 className="font-black text-indigo-900 text-sm mb-4 leading-snug">Butuh perubahan data yang terkunci?</h5>
                        <button className="flex items-center gap-2 text-[10px] font-black text-indigo-600 hover:gap-4 transition-all">
                            HUBUNGI IT SUPPORT <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}