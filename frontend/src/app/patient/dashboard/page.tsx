'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import {
    User, Phone, ShieldCheck, Calendar,
    Activity, MapPin, LogOut, Settings,
    ChevronDown, Bell, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PatientDashboard() {
    const router = useRouter();
    const [doctors, setDoctors] = useState([]);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [formData, setFormData] = useState({
        patient_name: '',
        patient_phone: '',
        doctor_name: '',
        appointment_date: ''
    });
    const [status, setStatus] = useState({ type: '', msg: '' });

    // 1. PROTEKSI HALAMAN & AMBIL DATA
    useEffect(() => {
        const token = localStorage.getItem('token') || Cookies.get('token');
        if (!token) {
            router.push('/login');
            return;
        }

        api.get('/clinic/doctors').then(res => setDoctors(res.data)).catch(() => { });
    }, [router]);

    // 2. FUNGSI LOGOUT
    const handleLogout = () => {
        if (confirm("Apakah Anda ingin keluar dari portal pasien?")) {
            localStorage.removeItem('token');
            localStorage.removeItem('user_role');
            Cookies.remove('token');
            Cookies.remove('role');
            window.location.href = '/'; // Reset total ke halaman welcome
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus({ type: 'loading', msg: 'Mengirim data...' });
        try {
            // Format nomor WA
            let phone = formData.patient_phone;
            if (phone.startsWith('0')) phone = '62' + phone.substring(1);

            await api.post('/clinic/appointments', { ...formData, patient_phone: phone });
            setStatus({ type: 'success', msg: '✅ Janji temu berhasil dibuat! Cek WhatsApp Anda.' });
            setFormData({ ...formData, doctor_name: '', appointment_date: '' });
        } catch (err) {
            setStatus({ type: 'error', msg: '❌ Gagal mendaftar. Silakan coba lagi.' });
        }
    };

    return (
        <div className="bg-[#F8F9FD] min-h-screen font-sans selection:bg-blue-100">

            {/* --- NAVBAR ATAS (Modern) --- */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-3">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black italic text-sm">K</div>
                        <h1 className="text-lg font-black tracking-tighter text-slate-800">Portal Pasien</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-full relative">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full border border-white"></span>
                        </button>

                        <div className="h-6 w-[1px] bg-slate-200 mx-1" />

                        {/* Profile Dropdown Pasien */}
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-3 p-1 hover:bg-slate-50 rounded-xl transition-all"
                            >
                                <img
                                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Patient"
                                    className="w-8 h-8 rounded-lg bg-blue-100 border border-blue-200"
                                    alt="avatar"
                                />
                                <ChevronDown size={14} className={`text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute right-0 mt-3 w-56 bg-white rounded-[1.5rem] shadow-2xl border border-slate-100 py-2 z-50"
                                    >
                                        <div className="px-4 py-3 border-b border-slate-50 mb-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Pasien Terverifikasi</p>
                                            <p className="text-sm font-bold text-slate-800 mt-1">Akun Saya</p>
                                        </div>
                                        <button className="w-full px-4 py-2.5 text-left text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-3"><Settings size={14} /> Pengaturan Profil</button>
                                        <div className="h-[1px] bg-slate-50 my-1 mx-2" />
                                        <button
                                            onClick={handleLogout}
                                            className="w-full px-4 py-2.5 text-left text-xs font-black text-red-600 hover:bg-red-50 flex items-center gap-3"
                                        >
                                            <LogOut size={14} /> Keluar Portal
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </nav>

            {/* --- ISI DASHBOARD --- */}
            <div className="max-w-6xl mx-auto p-6 lg:p-10 space-y-8">

                {/* Header Sambutan */}
                <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 flex justify-between items-center overflow-hidden relative">
                    <div className="relative z-10">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Halo, Selamat Datang!</h1>
                        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-2 flex items-center gap-2">
                            <Sparkles size={12} className="text-blue-600" /> Nauli Dental Patient Suite
                        </p>
                    </div>
                    <div className="w-16 h-16 bg-blue-50 rounded-[1.5rem] flex items-center justify-center text-blue-600 shadow-inner"><Activity size={32} /></div>
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-50/50 rounded-full blur-3xl"></div>
                </div>

                <div className="grid lg:grid-cols-5 gap-8">
                    {/* Sisi Kiri: Form Booking */}
                    <div className="lg:col-span-3">
                        <div className="bg-slate-900 rounded-[3.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-blue-600/20 transition-all duration-700"></div>

                            <h3 className="text-2xl font-black mb-1 italic tracking-tight">Buat Janji Temu Baru</h3>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-10 opacity-60">Instant Online Registration</p>

                            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <input
                                        type="text" placeholder="Nama Lengkap Pasien" required
                                        className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all font-bold text-sm"
                                        value={formData.patient_name} onChange={e => setFormData({ ...formData, patient_name: e.target.value })}
                                    />
                                    <input
                                        type="text" placeholder="WhatsApp (Contoh: 0812...)" required
                                        className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all font-bold text-sm"
                                        value={formData.patient_phone} onChange={e => setFormData({ ...formData, patient_phone: e.target.value })}
                                    />
                                </div>

                                <select
                                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all font-bold text-sm appearance-none cursor-pointer"
                                    value={formData.doctor_name} onChange={e => setFormData({ ...formData, doctor_name: e.target.value })} required
                                >
                                    <option value="" className="text-slate-900">-- Pilih Dokter --</option>
                                    {doctors.map((d: any) => <option key={d.id} value={d.name} className="text-slate-900">{d.name} ({d.specialty})</option>)}
                                </select>

                                <input
                                    type="datetime-local" required
                                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all font-bold text-sm [color-scheme:dark]"
                                    value={formData.appointment_date} onChange={e => setFormData({ ...formData, appointment_date: e.target.value })}
                                />

                                <button className="w-full bg-blue-600 hover:bg-blue-500 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-blue-600/20 transition-all active:scale-[0.98]">
                                    KONFIRMASI PENDAFTARAN
                                </button>

                                {status.msg && <p className="text-center text-[10px] font-black uppercase tracking-widest mt-2 animate-pulse">{status.msg}</p>}
                            </form>
                        </div>
                    </div>

                    {/* Sisi Kanan: Info Klinik */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><MapPin size={100} /></div>
                            <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest mb-6">Lokasi & Kontak</h4>
                            <div className="space-y-4 relative z-10">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600"><MapPin size={18} /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase">Klinik Nauli</p>
                                        <p className="text-sm font-bold text-slate-700 leading-tight">Jl. Balige No. 12, Toba, <br /> Sumatera Utara</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 pt-2">
                                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600"><Phone size={18} /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase">Hubungi Kami</p>
                                        <p className="text-sm font-bold text-slate-700">+62 821 6352 6363</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-[2.5rem] text-white shadow-xl flex items-center gap-4">
                            <ShieldCheck size={40} className="text-blue-200" />
                            <div>
                                <p className="text-lg font-black leading-tight italic">Safe & Secure.</p>
                                <p className="text-[10px] font-bold text-blue-100 opacity-60 uppercase tracking-tighter">Your health data is encrypted by AI</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Click outside backdrop for dropdown */}
            {isProfileOpen && <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>}
        </div>
    );
}