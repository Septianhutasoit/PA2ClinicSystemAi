'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Loader2, ArrowRight } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const params = new URLSearchParams();
        params.append('username', email);
        params.append('password', password);

        try {
            const res = await axios.post('http://127.0.0.1:8000/api/v1/auth/login', params);

            // Simpan Token di LocalStorage & Cookies (untuk proteksi route)
            localStorage.setItem('token', res.data.access_token);
            Cookies.set('token', res.data.access_token, { expires: 1 });

            // Toast sukses sederhana
            if (email.includes('admin')) {
                router.push('/admin');
            } else {
                router.push('/');
            }
        } catch (err) {
            alert("❌ Login Gagal! Periksa kembali email dan password Anda.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8F9FD] p-6 font-sans selection:bg-blue-100 selection:text-blue-600">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-blue-900/5 border border-slate-100"
            >
                {/* Brand Logo */}
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200 font-black italic">K</div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tighter italic">Klinik.AI</h1>
                </div>

                <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Selamat Datang</h2>
                <p className="text-slate-400 mb-8 font-bold text-xs uppercase tracking-widest italic">Management Suite Login</p>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-1.5 group">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Alamat Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                            <input
                                type="email"
                                placeholder="nama@email.com"
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white focus:border-blue-600 transition-all font-bold text-slate-800 text-sm"
                                value={email} onChange={e => setEmail(e.target.value)} required
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5 group">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Kata Sandi</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white focus:border-blue-600 transition-all font-bold text-slate-800 text-sm"
                                value={password} onChange={e => setPassword(e.target.value)} required
                            />
                        </div>
                        <div className="flex justify-end pr-2">
                            <Link href="/forgot-password" size="sm" className="text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors">
                                Lupa Password?
                            </Link>
                        </div>
                    </div>

                    <button
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black shadow-xl shadow-blue-100 uppercase tracking-widest text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
                            <>MASUK SEKARANG <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
                        )}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm font-bold text-slate-400">
                    Belum punya akun? <Link href="/register" className="text-blue-600 hover:underline decoration-2 underline-offset-4 decoration-blue-200 transition-all">Daftar Akun Gratis</Link>
                </p>
            </motion.div>
        </div>
    );
}