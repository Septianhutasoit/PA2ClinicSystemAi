'use client';
import { useState, useEffect } from 'react';
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

    // 1. Fungsi pusat untuk pengalihan berdasarkan Role (Gunakan ini saja)
    const redirectUser = (role: string) => {
        if (!role) return;
        const lowerRole = role.toLowerCase(); // Pastikan huruf kecil semua
        console.log("Mengalihkan ke dashboard:", lowerRole);

        switch (lowerRole) {
            case 'admin':
                router.push('/admin');
                break;
            case 'doctor':
                router.push('/doctor/dashboard');
                break;
            case 'nurse':
                router.push('/nurse/dashboard');
                break;
            case 'patient':
                router.push('/patient/dashboard');
                break;
            default:
                router.push('/');
        }
    };

    // 2. Proteksi: Cek sesi saat halaman dimuat
    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('user_role');

        if (token && role) {
            // Pindahkan logika redirect langsung ke sini atau panggil fungsinya
            const lowerRole = role.toLowerCase();
            if (lowerRole === 'admin') router.push('/admin');
            else if (lowerRole === 'doctor') router.push('/doctor/dashboard');
            else if (lowerRole === 'nurse') router.push('/nurse/dashboard');
            else router.push('/patient/dashboard');
        }
    }, [router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const params = new URLSearchParams();
        params.append('username', email.toLowerCase().trim()); // Bersihkan email
        params.append('password', password);

        try {
            const res = await axios.post('http://127.0.0.1:8000/api/v1/auth/login', params);

            const { access_token, role } = res.data;

            console.log("Data diterima dari server:", { access_token: "TERSEDIA", role });

            // Simpan Data Keamanan
            localStorage.setItem('token', access_token);
            localStorage.setItem('user_role', role);
            Cookies.set('token', access_token, { expires: 1 });
            Cookies.set('role', role, { expires: 1 });

            // Jalankan Pengalihan
            redirectUser(role);

        } catch (err: any) {
            const msg = err.response?.data?.detail || "Email atau password salah!";
            alert(`❌ Login Gagal: ${msg}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8F9FD] p-6 font-sans">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-blue-900/5 border border-slate-100"
            >
                {/* Logo & Header */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200 font-black italic">K</div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 tracking-tighter italic leading-none">Klinik.AI</h1>
                        <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest mt-1">Integrated Health System</p>
                    </div>
                </div>

                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">Selamat Datang</h2>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1 italic">Silakan login ke akun Anda</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-1.5 group">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                            <input
                                type="email"
                                placeholder="admin@klinik.ai"
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white focus:border-blue-600 transition-all font-bold text-slate-800 text-sm"
                                value={email} onChange={e => setEmail(e.target.value)} required
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5 group">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
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
                            <Link href="/forgot-password" className="text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors">
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

                <div className="mt-8 pt-6 border-t border-slate-50 text-center">
                    <p className="text-[11px] font-bold text-slate-400">
                        Belum punya akun? <Link href="/register" className="text-blue-600 font-black hover:underline">Daftar Pasien</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}