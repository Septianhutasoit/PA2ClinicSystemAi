'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2, ArrowRight, Activity, Shield, Zap } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    // Redirect jika sudah login — hanya cek sekali (bukan setiap render)
    useEffect(() => {
        const token = Cookies.get('token');
        const role = Cookies.get('role')?.toLowerCase();
        if (!token || !role) return;

        const routes: Record<string, string> = {
            admin: '/admin',
            doctor: '/doctor',
            nurse: '/nurse',
            patient: '/patient/dashboard',
        };
        const dest = routes[role];
        if (dest) router.replace(dest);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const redirectUser = (role: string) => {
        const lowerRole = role.toLowerCase();
        const routes: Record<string, string> = {
            admin: '/admin',
            doctor: '/doctor',
            nurse: '/nurse',
            patient: '/patient/dashboard',
        };
        router.replace(routes[lowerRole] || '/');
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const params = new URLSearchParams();
        params.append('username', email.toLowerCase().trim());
        params.append('password', password);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
            const res = await axios.post(
                `${apiUrl}/api/v1/auth/login`,
                params,
                { timeout: 10000 }
            );

            const { access_token, role } = res.data;

            const expires = 1 / 24;
            Cookies.set('token', access_token, { expires, sameSite: 'strict' });
            Cookies.set('role', role, { expires, sameSite: 'strict' });
            localStorage.setItem('token', access_token);
            localStorage.setItem('user_role', role);

            // Simpan nama user jika tersedia
            if (res.data.full_name) {
                localStorage.setItem('user_name', res.data.full_name);
            }

            redirectUser(role);

        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { detail?: string } }; code?: string };
            if (axiosErr.code === 'ECONNABORTED') {
                setError('Server tidak merespons. Pastikan backend sudah berjalan.');
            } else {
                setError(axiosErr.response?.data?.detail || 'Email atau password salah!');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const features = [
        { icon: Activity, label: 'Rekam Medis Real-time' },
        { icon: Shield, label: 'Data Terenkripsi Penuh' },
        { icon: Zap, label: 'Respon Instan & Akurat' },
    ];

    return (
        <div className="min-h-screen flex font-sans">

            {/* ── LEFT PANEL ─────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col justify-between p-14"
                style={{ background: 'linear-gradient(135deg, #064e3b 0%, #065f46 40%, #047857 70%, #059669 100%)' }}
            >
                {/* Decorative circles */}
                <div className="absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full opacity-10"
                    style={{ background: 'radial-gradient(circle, #a7f3d0, transparent)' }} />
                <div className="absolute -bottom-20 -right-20 w-[320px] h-[320px] rounded-full opacity-10"
                    style={{ background: 'radial-gradient(circle, #6ee7b7, transparent)' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-5"
                    style={{ background: 'radial-gradient(circle, #fff, transparent)' }} />

                {/* Grid pattern overlay */}
                <div className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }} />

                {/* Logo */}
                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-11 h-11 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 shadow-lg">
                        <span className="text-white font-black italic text-xl">K</span>
                    </div>
                    <div>
                        <h1 className="text-white text-2xl font-black tracking-tighter italic leading-none">Klinik.AI</h1>
                        <p className="text-emerald-300 text-[9px] font-bold uppercase tracking-widest mt-0.5">Sistem Informasi Terintegrasi</p>
                    </div>
                </div>

                {/* Center hero text */}
                <div className="relative z-10 flex-1 flex flex-col justify-center py-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                    >
                        <p className="text-emerald-300 text-xs font-bold uppercase tracking-[0.25em] mb-4">Platform Klinik Terpadu</p>
                        <h2 className="text-white text-5xl font-black leading-[1.1] tracking-tight mb-6">
                            Kelola Klinik<br />
                            <span className="text-emerald-300">Lebih Cerdas.</span>
                        </h2>
                        <p className="text-emerald-100/70 text-base leading-relaxed max-w-sm font-medium">
                            Sistem manajemen klinik berbasis AI yang mengintegrasikan rekam medis, jadwal, dan laporan dalam satu platform terpadu.
                        </p>
                    </motion.div>

                    {/* Feature list */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="mt-10 space-y-4"
                    >
                        {features.map(({ icon: Icon, label }, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center flex-shrink-0">
                                    <Icon size={16} className="text-emerald-300" />
                                </div>
                                <span className="text-white/80 text-sm font-semibold">{label}</span>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Bottom badge */}
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-2 backdrop-blur-sm">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-white/80 text-xs font-semibold">Sistem aktif & terlindungi</span>
                    </div>
                </div>
            </motion.div>

            {/* ── RIGHT PANEL ─────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="flex-1 flex items-center justify-center bg-slate-50 p-8"
            >
                <div className="w-full max-w-[420px]">

                    {/* Mobile logo (shown only on small screens) */}
                    <div className="flex lg:hidden items-center gap-3 mb-10 justify-center">
                        <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200 font-black italic">K</div>
                        <div>
                            <h1 className="text-2xl font-black text-slate-800 tracking-tighter italic leading-none">Klinik.AI</h1>
                            <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest mt-1">Sistem Informasi Terintegrasi</p>
                        </div>
                    </div>

                    {/* Heading */}
                    <div className="mb-10">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">Selamat Datang</h2>
                        <p className="text-slate-400 text-sm font-medium mt-2">Masuk untuk mengakses dashboard Anda</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-1.5 group">
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Email Terdaftar</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-600 transition-colors" size={17} />
                                <input
                                    id="login-email"
                                    type="email"
                                    placeholder="nama@klinik.ai"
                                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-emerald-100 focus:bg-white focus:border-emerald-500 transition-all font-semibold text-slate-800 text-sm shadow-sm"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5 group">
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Kata Sandi</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-600 transition-colors" size={17} />
                                <input
                                    id="login-password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-emerald-100 focus:bg-white focus:border-emerald-500 transition-all font-semibold text-slate-800 text-sm shadow-sm"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="flex justify-end pt-1">
                                <Link href="/forgot-password" className="text-[11px] font-bold text-slate-400 hover:text-emerald-600 transition-colors">
                                    Lupa Password?
                                </Link>
                            </div>
                        </div>

                        {/* Error message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-50 text-red-600 text-[11px] font-bold px-4 py-3 rounded-xl border border-red-100 flex items-center gap-2"
                            >
                                <span>❌</span> {error}
                            </motion.div>
                        )}

                        <button
                            id="login-btn"
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white py-3.5 rounded-xl font-black shadow-lg shadow-emerald-100 uppercase tracking-widest text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 group mt-2"
                        >
                            {isLoading
                                ? <><Loader2 className="animate-spin" size={19} /> Sedang Masuk...</>
                                : <>Mulai Sesi Kerja <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" /></>
                            }
                        </button>
                    </form>

                    {/* Divider & register link */}
                    <div className="mt-8 pt-6 border-t border-slate-200 text-center">
                        <p className="text-[12px] font-medium text-slate-400">
                            Belum punya akun?{' '}
                            <Link href="/register" className="text-emerald-600 font-black hover:underline">
                                Daftar Pasien Baru
                            </Link>
                        </p>
                    </div>

                    {/* Footer note */}
                    <p className="text-center text-[10px] text-slate-300 font-medium mt-8">
                        © {new Date().getFullYear()} Klinik.AI · Sistem terlindungi & terenkripsi
                    </p>
                </div>
            </motion.div>
        </div>
    );
}