'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mail, Lock, ArrowLeft, CheckCircle2,
    Loader2, ShieldCheck, KeyRound, Sparkles,
    Activity, Shield, Zap
} from 'lucide-react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.post('/auth/reset-password', {
                email: email.toLowerCase().trim(),
                new_password: newPassword,
            });
            setIsSuccess(true);
            setTimeout(() => router.push('/login'), 3000);
        } catch (err: any) {
            alert(err.response?.data?.detail || 'Gagal mereset password');
        } finally {
            setIsLoading(false);
        }
    };

    const features = [
        { icon: ShieldCheck, label: 'Verifikasi Email Terdaftar' },
        { icon: Shield, label: 'Password Terenkripsi Penuh' },
        { icon: Zap, label: 'Sistem Keamanan Berlapis' },
    ];

    return (
        <div className="min-h-screen flex font-sans bg-white overflow-hidden">

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
                        <p className="text-emerald-300 text-xs font-bold uppercase tracking-[0.25em] mb-4">Pemulihan Akses Akun</p>
                        <h2 className="text-white text-6xl font-black leading-[1.05] tracking-tighter mb-8">
                            Keamanan Akun<br />
                            <span className="text-emerald-300">Terjamin Selalu.</span>
                        </h2>
                        <p className="text-emerald-50/70 text-lg leading-relaxed max-w-sm font-medium">
                            Atur ulang kata sandi Anda dengan aman. Identitas dan data kesehatan Anda tetap terlindungi dengan standar enkripsi tertinggi.
                        </p>
                    </motion.div>

                    <div className="mt-12 space-y-5">
                        {features.map(({ icon: Icon, label }, i) => (
                            <div key={i} className="flex items-center gap-4 group">
                                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center transition-all group-hover:bg-emerald-500">
                                    <Icon size={18} className="text-emerald-300 group-hover:text-white" />
                                </div>
                                <span className="text-white/90 text-sm font-semibold tracking-wide">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative z-10">
                    <div className="inline-flex items-center gap-3 bg-white/10 border border-white/10 rounded-full px-5 py-2.5 backdrop-blur-sm">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-white/80 text-[10px] font-bold uppercase tracking-widest">Sistem Aktif & Terlindungi</span>
                    </div>
                </div>
            </motion.div>

            {/* ── RIGHT PANEL (Reset Form) ───────────────────────── */}
            <div className="flex-1 flex items-center justify-center bg-slate-50 p-8">
                <div className="w-full max-w-[420px]">
                    <AnimatePresence mode="wait">
                        {!isSuccess ? (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                {/* Back to Login Link */}
                                <Link
                                    href="/login"
                                    className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 text-[11px] font-black uppercase tracking-widest transition-all group mb-8"
                                >
                                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                                    Kembali ke Login
                                </Link>

                                {/* Centered Logo Squircle */}
                                <div className="mb-10 text-center flex flex-col items-center">
                                    <div className="w-24 h-24 mb-6 p-4 bg-white rounded-[2rem] border-2 border-emerald-500 shadow-xl shadow-emerald-900/10 flex items-center justify-center transition-all duration-300 hover:scale-105 group">
                                        <img
                                            src="/images/Logo.png"
                                            alt="Nauli Dental Logo"
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight uppercase">Atur Ulang Sandi</h2>
                                    <div className="h-1 w-12 bg-emerald-500 rounded-full my-3 mx-auto" />
                                    <p className="text-slate-400 text-sm font-medium">Masukkan email dan buat kata sandi baru Anda</p>
                                </div>

                                <form onSubmit={handleReset} className="space-y-5">
                                    {/* Email */}
                                    <div className="space-y-1.5 group">
                                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Email Terdaftar</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-600 transition-colors" size={17} />
                                            <input
                                                type="email"
                                                placeholder="nama@email.com"
                                                className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all font-semibold text-slate-800 text-sm shadow-sm"
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Password Baru */}
                                    <div className="space-y-1.5 group">
                                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Password Baru</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-600 transition-colors" size={17} />
                                            <input
                                                type="password"
                                                placeholder="Buat sandi baru yang kuat"
                                                className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all font-semibold text-slate-800 text-sm shadow-sm"
                                                value={newPassword}
                                                onChange={e => setNewPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white py-4 rounded-xl font-black shadow-lg shadow-emerald-100 uppercase tracking-widest text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 group mt-4"
                                    >
                                        {isLoading ? (
                                            <><Loader2 className="animate-spin" size={19} /> Memproses...</>
                                        ) : (
                                            <><KeyRound size={17} /> Reset Password Akun</>
                                        )}
                                    </button>
                                </form>
                            </motion.div>
                        ) : (
                            /* ── SUCCESS STATE ───────────────────────── */
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center bg-white p-10 rounded-[2.5rem] shadow-xl border border-emerald-100"
                            >
                                <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 size={40} className="text-emerald-600" />
                                </div>
                                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Berhasil!</h2>
                                <p className="text-slate-500 text-sm mb-8 font-medium">Password Anda telah diperbarui. Mengalihkan ke halaman login...</p>
                                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                    <motion.div
                                        className="bg-emerald-500 h-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 3 }}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <p className="text-center text-[10px] text-slate-300 font-medium mt-10">
                        © {new Date().getFullYear()} Nauli Dental Care · Sistem Klinik Terpadu
                    </p>
                </div>
            </div>
        </div>
    );
}