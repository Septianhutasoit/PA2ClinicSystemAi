'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mail, Lock, ArrowLeft, CheckCircle2,
    Loader2, ShieldCheck, KeyRound, Sparkles,
    Stethoscope, Brain, Heart, Smile, Activity
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
            const res = await api.post('/auth/reset-password', {
                email: email.toLowerCase().trim(),
                new_password: newPassword,
            });
            console.log('Respon Reset:', res.data);
            setIsSuccess(true);
            setTimeout(() => router.push('/login'), 3000);
        } catch (err: any) {
            alert(err.response?.data?.detail || 'Gagal mereset password');
        } finally {
            setIsLoading(false);
        }
    };

    // Array ikon melayang untuk panel kiri
    const floatingIcons = [
        { Icon: Heart, size: 24, top: '12%', left: '8%', delay: 0, duration: 14, color: '#f472b6' },
        { Icon: Smile, size: 28, top: '75%', left: '85%', delay: 2, duration: 17, color: '#6ee7b7' },
        { Icon: Stethoscope, size: 22, top: '82%', left: '12%', delay: 4, duration: 19, color: '#c084fc' },
        { Icon: Activity, size: 26, top: '25%', left: '88%', delay: 1, duration: 16, color: '#60a5fa' },
        { Icon: Sparkles, size: 20, top: '45%', left: '18%', delay: 3, duration: 22, color: '#fcd34d' },
    ];

    return (
        <div className="min-h-screen flex font-sans overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50">

            {/* ── KIRI: PANEL BRANDING MODERN DENGAN ANIMASI ───────────────────── */}
            <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-14 overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, #064e3b 0%, #065f46 35%, #047857 70%, #10b981 100%)',
                    backgroundSize: '200% 200%',
                    animation: 'gradientShift 15s ease infinite'
                }}
            >
                <style jsx>{`
                    @keyframes gradientShift {
                        0% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                        100% { background-position: 0% 50%; }
                    }
                    @keyframes float {
                        0% { transform: translateY(0px) rotate(0deg); }
                        50% { transform: translateY(-20px) rotate(6deg); }
                        100% { transform: translateY(0px) rotate(0deg); }
                    }
                    @keyframes pulseRing {
                        0% { transform: scale(0.8); opacity: 0.4; }
                        100% { transform: scale(2.5); opacity: 0; }
                    }
                    @keyframes shimmer {
                        0% { transform: translateX(-100%) skewX(-20deg); }
                        100% { transform: translateX(200%) skewX(-20deg); }
                    }
                `}</style>

                {/* Decorative pulsing rings */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-white/20 animate-[pulseRing_6s_ease-out_infinite] pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full border border-white/30 animate-[pulseRing_6s_ease-out_infinite_0.8s] pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[260px] rounded-full border border-white/40 animate-[pulseRing_6s_ease-out_infinite_1.6s] pointer-events-none" />

                {/* Floating animated medical icons */}
                {floatingIcons.map(({ Icon, size, top, left, delay, duration, color }, idx) => (
                    <motion.div
                        key={idx}
                        className="absolute pointer-events-none"
                        style={{ top, left }}
                        animate={{
                            y: [0, -25, 0],
                            rotate: [0, 10, -10, 0],
                        }}
                        transition={{
                            duration: duration,
                            delay: delay,
                            repeat: Infinity,
                            repeatType: 'reverse',
                            ease: 'easeInOut'
                        }}
                    >
                        <Icon size={size} style={{ color, opacity: 0.7 }} strokeWidth={1.5} />
                    </motion.div>
                ))}

                {/* Efek shimmer */}
                <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
                    <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white to-transparent skew-x-[-20deg] animate-[shimmer_7s_infinite]" />
                </div>

                {/* Logo / Brand */}
                <div className="relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-2.5 shadow-lg"
                    >
                        <div className="w-7 h-7 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center shadow-md">
                            <Stethoscope size={14} className="text-white" />
                        </div>
                        <span className="text-white text-xs font-black uppercase tracking-widest">
                            Nauli Dental Care
                        </span>
                    </motion.div>
                </div>

                {/* Konten Tengah */}
                <div className="relative z-10 space-y-8">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                        className="w-20 h-20 bg-gradient-to-br from-emerald-500/30 to-teal-500/30 border border-emerald-400/40 rounded-3xl flex items-center justify-center backdrop-blur-sm shadow-xl"
                    >
                        <KeyRound size={38} className="text-emerald-300 drop-shadow-md" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                    >
                        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white leading-none mb-4">
                            Pemulihan<br />Akses Akun
                        </h1>
                        <p className="text-emerald-100/80 text-sm font-medium leading-relaxed max-w-xs">
                            Atur ulang kata sandi Anda dengan aman. Identitas dan data klinik Anda tetap terlindungi.
                        </p>
                    </motion.div>

                    {/* Feature pills with hover effect */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="space-y-3"
                    >
                        {[
                            { icon: ShieldCheck, text: 'Verifikasi email terdaftar' },
                            { icon: Lock, text: 'Password terenkripsi penuh' },
                            { icon: Brain, text: 'Sistem keamanan berlapis' },
                        ].map(({ icon: Icon, text }, i) => (
                            <motion.div
                                key={text}
                                className="flex items-center gap-3 group cursor-default"
                                whileHover={{ x: 5 }}
                                transition={{ type: 'spring', stiffness: 400 }}
                            >
                                <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-colors">
                                    <Icon size={14} className="text-emerald-300 group-hover:scale-110 transition-transform" />
                                </div>
                                <p className="text-[11px] font-bold text-white/70 uppercase tracking-widest group-hover:text-white transition-colors">
                                    {text}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Footer panel */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="relative z-10 text-[10px] font-bold text-emerald-300/60 uppercase tracking-widest"
                >
                    © 2025 Nauli Dental Care · Sistem Klinik Terpadu
                </motion.p>
            </div>

            {/* ── KANAN: FORM AREA MODERN DENGAN ANIMASI ───────────────────── */}
            <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
                <div className="w-full max-w-md">

                    <AnimatePresence mode="wait">
                        {!isSuccess ? (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                                transition={{ duration: 0.4, ease: 'easeOut' }}
                            >
                                {/* Kembali ke Login */}
                                <Link
                                    href="/login"
                                    className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 text-[10px] font-black uppercase tracking-widest transition-all group mb-10"
                                >
                                    <ArrowLeft size={13} className="group-hover:-translate-x-1 transition-transform" />
                                    Kembali ke Login
                                </Link>

                                {/* Heading dengan efek sparkle */}
                                <div className="mb-10">
                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.1 }}
                                        className="inline-flex items-center gap-2 bg-emerald-100 border border-emerald-200 px-4 py-1.5 rounded-full mb-5 shadow-sm"
                                    >
                                        <Sparkles size={12} className="text-emerald-600" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">
                                            Pemulihan Akun
                                        </span>
                                    </motion.div>
                                    <h2 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
                                        Atur Ulang Sandi
                                    </h2>
                                    <p className="text-slate-400 text-sm font-medium mt-3">
                                        Masukkan email terdaftar dan buat kata sandi baru Anda.
                                    </p>
                                </div>

                                {/* Form Card dengan efek glassmorphism ringan */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2, duration: 0.5 }}
                                    className="bg-white/90 backdrop-blur-sm rounded-[2rem] border border-emerald-100 shadow-xl p-8 space-y-5"
                                >
                                    {/* Email Field */}
                                    <div className="space-y-1.5 group">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                                            Konfirmasi Email
                                        </label>
                                        <div className="relative">
                                            <Mail
                                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors"
                                                size={17}
                                            />
                                            <input
                                                type="email"
                                                placeholder="nama@email.com"
                                                className="w-full pl-12 pr-4 py-4 bg-emerald-50/30 border border-emerald-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-200 focus:bg-white focus:border-emerald-400 transition-all font-bold text-slate-800 text-sm placeholder:text-slate-300"
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* New Password Field */}
                                    <div className="space-y-1.5 group">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                                            Password Baru
                                        </label>
                                        <div className="relative">
                                            <Lock
                                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors"
                                                size={17}
                                            />
                                            <input
                                                type="password"
                                                placeholder="Minimal 8 karakter"
                                                className="w-full pl-12 pr-4 py-4 bg-emerald-50/30 border border-emerald-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-200 focus:bg-white focus:border-emerald-400 transition-all font-bold text-slate-800 text-sm placeholder:text-slate-300"
                                                value={newPassword}
                                                onChange={e => setNewPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Submit Button dengan efek tap */}
                                    <motion.button
                                        onClick={handleReset}
                                        disabled={isLoading}
                                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-70 text-white py-4 rounded-2xl font-black shadow-lg shadow-emerald-200 uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-2 mt-2"
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {isLoading
                                            ? <><Loader2 className="animate-spin" size={18} /> Memproses...</>
                                            : <><KeyRound size={16} /> Ganti Password Sekarang</>
                                        }
                                    </motion.button>

                                    {/* Info tambahan */}
                                    <p className="text-center text-[9px] text-slate-400 font-medium pt-2">
                                        Password baru akan langsung aktif setelah reset.
                                    </p>
                                </motion.div>
                            </motion.div>
                        ) : (
                            /* ── SUCCESS STATE DENGAN ANIMASI PREMIUM ─────────────────── */
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.92 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
                                className="bg-white/90 backdrop-blur-sm rounded-[2rem] border border-emerald-100 shadow-xl p-12 text-center"
                            >
                                {/* Lingkaran berdenyut di belakang */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <motion.div
                                        className="w-36 h-36 rounded-full bg-emerald-200/30"
                                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />
                                </div>

                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
                                    className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-100 border border-emerald-200 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg relative z-10"
                                >
                                    <CheckCircle2 size={48} className="text-emerald-600" strokeWidth={1.5} />
                                </motion.div>

                                <div className="inline-flex items-center gap-2 bg-emerald-100 border border-emerald-200 px-4 py-1.5 rounded-full mb-5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">
                                        Berhasil
                                    </span>
                                </div>

                                <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-900 mb-3">
                                    Password Diperbarui!
                                </h2>
                                <p className="text-slate-400 text-sm font-medium">
                                    Anda akan diarahkan ke halaman login secara otomatis dalam beberapa detik.
                                </p>

                                {/* Progress Bar Animasi */}
                                <div className="mt-8 w-full bg-emerald-100 rounded-full h-2 overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                                        initial={{ width: '0%' }}
                                        animate={{ width: '100%' }}
                                        transition={{ duration: 3, ease: 'linear' }}
                                    />
                                </div>
                                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-3 flex items-center justify-center gap-1">
                                    <Loader2 size={10} className="animate-spin" /> Mengarahkan ke Login...
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}