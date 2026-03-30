'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, Mail, Lock, UserPlus, Loader2 } from 'lucide-react';

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

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8F9FD] p-6 font-sans">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-blue-900/5 border border-slate-100"
            >
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200 font-black italic">K</div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tighter italic">Klinik.AI</h1>
                </div>

                <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight text-center">Bergabung Sekarang</h2>
                <p className="text-slate-400 mb-8 font-bold text-[10px] uppercase tracking-[0.2em] text-center italic">Digital Healthcare Membership</p>

                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                        <input type="text" placeholder="Nama Lengkap" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white focus:border-blue-600 transition-all font-bold text-slate-800 text-sm" onChange={e => setForm({ ...form, full_name: e.target.value })} required />
                    </div>

                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                        <input type="email" placeholder="Email Aktif" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white focus:border-blue-600 transition-all font-bold text-slate-800 text-sm" onChange={e => setForm({ ...form, email: e.target.value })} required />
                    </div>

                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                        <input type="password" placeholder="Kata Sandi Baru" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white focus:border-blue-600 transition-all font-bold text-slate-800 text-sm" onChange={e => setForm({ ...form, password: e.target.value })} required />
                    </div>

                    <button
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black shadow-xl shadow-blue-100 uppercase tracking-widest text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : "DAFTAR SEKARANG"}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm font-bold text-slate-400">
                    Sudah punya akun? <Link href="/login" className="text-blue-600 hover:underline font-black">Login</Link>
                </p>
            </motion.div>
        </div>
    );
}