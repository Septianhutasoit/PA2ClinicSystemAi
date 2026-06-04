'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Loader2, Sparkles, ShieldCheck, Calendar, ArrowRight, Activity, Shield, Zap } from 'lucide-react';

export default function RegisterPage() {
    const [form, setForm] = useState({ email: '', full_name: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.post('/auth/register', form);
            alert("✅ Registrasi Berhasil! Silakan Login.");
            router.push('/login');
        } catch (err: any) {
            const errorDetail = err.response?.data?.detail;
            alert("❌ " + (Array.isArray(errorDetail) ? errorDetail[0].msg : (errorDetail || "Gagal Registrasi")));
        } finally {
            setIsLoading(false);
        }
    };

    const features = [
        { icon: ShieldCheck, text: "Sterilisasi Standar Internasional" },
        { icon: Calendar, text: "Booking Online 24/7 Tanpa Ribet" },
        { icon: Sparkles, text: "Teknologi AI & Scanning Modern" }
    ];

    return (
        <div className="flex min-h-screen w-full bg-white overflow-hidden font-sans">
            
            {/* ── LEFT PANEL (Desktop Branding) ─────────────────────── */}
            <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col justify-between p-16"
                style={{ background: 'linear-gradient(135deg, #064e3b 0%, #065f46 40%, #047857 70%, #059669 100%)' }}
            >
                {/* Background Decor */}
                <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)', backgroundSize: '32px 32px' }} />

                {/* Logo Section */}
                <div className="relative z-10 flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg p-1.5 transition-transform hover:scale-105">
                        <img src="/images/Logo.png" alt="Logo" className="w-full h-full object-contain" />
                    </div>
                    <div>
                        <h1 className="text-white text-2xl font-black tracking-tight leading-none uppercase">Klinik Nauli Dental</h1>
                        <p className="text-emerald-300 text-[10px] font-bold uppercase tracking-[0.2em] mt-1.5">Sistem Informasi Terintegrasi</p>
                    </div>
                </div>

                {/* Center Hero Text */}
                <div className="relative z-10 flex-1 flex flex-col justify-center py-12">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>
                        <p className="text-emerald-300 text-xs font-bold uppercase tracking-[0.25em] mb-4">Layanan Pasien Terpadu</p>
                        <h2 className="text-white text-6xl font-black leading-[1.05] tracking-tighter mb-8">
                            Senyum Sehat,<br />
                            <span className="text-emerald-300">Masa Depan Cerah.</span>
                        </h2>
                        <p className="text-emerald-50/70 text-lg leading-relaxed max-w-sm font-medium">
                            Bergabunglah bersama kami untuk mendapatkan pengalaman perawatan gigi premium dengan teknologi AI tercanggih.
                        </p>
                    </motion.div>

                    <div className="mt-12 space-y-5">
                        {features.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4 group">
                                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center transition-all group-hover:bg-emerald-500">
                                    <item.icon size={18} className="text-emerald-300 group-hover:text-white" />
                                </div>
                                <span className="text-white/90 text-sm font-semibold tracking-wide">{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative z-10">
                    <div className="inline-flex items-center gap-3 bg-white/10 border border-white/10 rounded-full px-5 py-2.5 backdrop-blur-sm">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-white/80 text-[10px] font-bold uppercase tracking-widest">Sistem aktif & terlindungi</span>
                    </div>
                </div>
            </motion.div>

            {/* ── RIGHT PANEL (Register Form) ───────────────────────── */}
            <div className="w-full lg:w-[48%] flex items-center justify-center bg-slate-50 p-8">
                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="w-full max-w-[420px]"
                >
                    {/* Centered Logo & Heading */}
                    <div className="mb-10 text-center flex flex-col items-center">

                        {/* Container Logo (Squircle) yang Diperkecil */}
                        <div className="relative w-24 h-24 mb-6 p-3 bg-white rounded-[2rem] border-2 border-emerald-500 shadow-xl shadow-emerald-900/10 flex items-center justify-center transition-all duration-300 hover:scale-105 group">
                            <img
                                src="/images/Logo.png"
                                alt="Nauli Dental Logo"
                                className="w-full h-full object-contain"
                            />
                        </div>

                        {/* Heading Texts */}
                        <div className="space-y-1">
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight uppercase">
                                Buat Akun Baru
                            </h2>

                            {/* Garis Hijau yang Pas dengan Ukuran Logo Baru */}
                            <div className="h-1 w-10 bg-emerald-500 rounded-full my-3 mx-auto" />

                            <p className="text-slate-400 text-sm font-medium">
                                Mulai perjalanan senyum sehat Anda hari ini
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-5">
                        {/* Nama Lengkap */}
                        <div className="space-y-1.5 group">
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Nama Lengkap</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-600 transition-colors" size={17} />
                                <input
                                    type="text"
                                    placeholder="Masukkan nama sesuai KTP"
                                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all font-semibold text-slate-800 text-sm shadow-sm"
                                    onChange={e => setForm({ ...form, full_name: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5 group">
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Alamat Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-600 transition-colors" size={17} />
                                <input
                                    type="email"
                                    placeholder="nama@email.com"
                                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all font-semibold text-slate-800 text-sm shadow-sm"
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5 group">
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Kata Sandi</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-600 transition-colors" size={17} />
                                <input
                                    type="password"
                                    placeholder="Buat kata sandi kuat"
                                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all font-semibold text-slate-800 text-sm shadow-sm"
                                    onChange={e => setForm({ ...form, password: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white py-4 rounded-xl font-black shadow-lg shadow-emerald-100 uppercase tracking-widest text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 group mt-6"
                        >
                            {isLoading ? (
                                <><Loader2 className="animate-spin" size={19} /> Memproses...</>
                            ) : (
                                <>Daftar Akun <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" /></>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-200 text-center">
                        <p className="text-[12px] font-medium text-slate-400">
                            Sudah punya akun?{' '}
                            <Link href="/login" className="text-emerald-600 font-black hover:underline">Login Sekarang</Link>
                        </p>
                    </div>

                    <p className="text-center text-[10px] text-slate-300 font-medium mt-8">
                        © {new Date().getFullYear()} Nauli Dental Care · Sistem terenkripsi & aman
                    </p>
                </motion.div>
            </div>
        </div>
    );
}