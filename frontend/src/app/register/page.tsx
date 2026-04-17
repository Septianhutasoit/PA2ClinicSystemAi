'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Loader2, Sparkles, ShieldCheck, Calendar, ArrowRight } from 'lucide-react';

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

    // Variants untuk animasi staggered children
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    return (
        <div className="flex min-h-screen w-full bg-white overflow-hidden font-sans">
            {/* ==================== BAGIAN KIRI: BRANDING & TEKSTUR HIJAU TUA ==================== */}
            <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 relative bg-[#0A1C14] overflow-hidden">
                {/* Tekstur / Pattern Overlay */}
                <div
                    className="absolute inset-0 opacity-20 mix-blend-overlay"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        backgroundSize: '80px 80px'
                    }}
                />

                {/* Gradient Overlay untuk kedalaman */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 via-[#0A1C14] to-[#05100A]" />

                {/* Konten Kiri */}
                <div className="relative z-10 flex flex-col justify-between h-full w-full p-10 xl:p-14">
                    {/* Logo */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex items-center gap-3"
                    >
                        <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 shadow-xl">
                            <Sparkles className="text-emerald-300" size={22} />
                        </div>
                        <span className="text-white font-bold text-xl tracking-tight">Dentiva<span className="text-emerald-300">.</span></span>
                    </motion.div>

                    {/* Middle Quote & Features */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="space-y-10"
                    >
                        <motion.h2 variants={itemVariants} className="text-5xl xl:text-6xl font-black text-white leading-[1.2] tracking-tight">
                            Senyum Sehat, <br />
                            <span className="text-emerald-300 italic">Percaya Diri</span>
                        </motion.h2>

                        <motion.p variants={itemVariants} className="text-emerald-50/70 text-lg font-medium max-w-md">
                            Bergabunglah dengan ribuan pasien yang telah mempercayakan kesehatan gigi mereka pada teknologi dan perawatan premium kami.
                        </motion.p>

                        <motion.div variants={containerVariants} className="space-y-6 pt-6">
                            {[
                                { icon: ShieldCheck, text: "Sterilisasi Standar Internasional" },
                                { icon: Calendar, text: "Booking Online 24/7 Tanpa Ribet" },
                                { icon: Sparkles, text: "Teknologi 3D Scanning Modern" }
                            ].map((item, idx) => (
                                <motion.div key={idx} variants={itemVariants} className="flex items-center gap-4 text-white/90">
                                    <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
                                        <item.icon size={16} className="text-emerald-300" />
                                    </div>
                                    <span className="font-semibold tracking-wide">{item.text}</span>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Footer Testimonial */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="border-t border-white/10 pt-8"
                    >
                        <p className="text-emerald-200/60 text-sm italic font-medium">
                            "Pelayanan sangat profesional dan nyaman. Rasanya seperti dirawat keluarga sendiri."
                        </p>
                        <div className="flex items-center gap-3 mt-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-800 border border-emerald-600 flex items-center justify-center text-white text-xs font-bold">R</div>
                            <span className="text-white/80 text-sm font-semibold">— drg. Ratna, Sp. KG</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ==================== BAGIAN KANAN: FORM REGISTRASI ==================== */}
            <div className="w-full lg:w-7/12 xl:w-1/2 flex items-center justify-center p-6 md:p-12 bg-[#FCFCFC]">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="w-full max-w-md"
                >
                    {/* Header Mobile (Hanya muncul di layar kecil) */}
                    <div className="lg:hidden mb-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 bg-emerald-800 rounded-xl flex items-center justify-center">
                                <Sparkles className="text-emerald-300" size={18} />
                            </div>
                            <span className="text-xl font-black text-slate-800">Nauli Dental Care.</span>
                        </div>
                        <h2 className="text-3xl font-black text-slate-900">Buat Akun</h2>
                        <p className="text-slate-500 text-sm mt-1">Mulai perjalanan senyum sehat Anda</p>
                    </div>

                    {/* Header Desktop */}
                    <div className="hidden lg:block mb-10">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Daftar Akun</h1>
                        <p className="text-slate-500 mt-2 font-medium flex items-center gap-2">
                            Sudah punya akun?
                            <Link href="/login" className="text-emerald-700 font-bold hover:text-emerald-900 transition-colors inline-flex items-center gap-1 group">
                                Login disini
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleRegister} className="space-y-5">
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-700 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Nama Lengkap"
                                className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-600 transition-all font-medium text-slate-800 placeholder:text-slate-400 shadow-sm"
                                onChange={e => setForm({ ...form, full_name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-700 transition-colors" size={18} />
                            <input
                                type="email"
                                placeholder="Email Aktif"
                                className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-600 transition-all font-medium text-slate-800 placeholder:text-slate-400 shadow-sm"
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                required
                            />
                        </div>

                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-700 transition-colors" size={18} />
                            <input
                                type="password"
                                placeholder="Kata Sandi"
                                className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-600 transition-all font-medium text-slate-800 placeholder:text-slate-400 shadow-sm"
                                onChange={e => setForm({ ...form, password: e.target.value })}
                                required
                            />
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            disabled={isLoading}
                            className="w-full bg-emerald-800 hover:bg-emerald-900 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-900/10 transition-all flex items-center justify-center gap-2 mt-6 text-base"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    <span>Memproses...</span>
                                </>
                            ) : (
                                <>
                                    <span>Daftar Sekarang</span>
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </motion.button>
                    </form>

                    <p className="mt-6 text-center text-xs text-slate-400 font-medium">
                        Dengan mendaftar, Anda menyetujui <Link href="#" className="text-emerald-700 hover:underline">Syarat & Ketentuan</Link> kami.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}