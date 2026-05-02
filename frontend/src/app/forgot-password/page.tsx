'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';

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
                new_password: newPassword
            });

            console.log("Respon Reset:", res.data);
            setIsSuccess(true);
            setTimeout(() => router.push('/login'), 3000); // Redirect otomatis setelah 3 detik
        } catch (err: any) {
            alert(err.response?.data?.detail || "Gagal mereset password");
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
                {!isSuccess ? (
                    <>
                        <div className="mb-8">
                            <Link href="/login" className="flex items-center gap-2 text-slate-400 hover:text-blue-600 text-[10px] font-black uppercase tracking-widest transition-colors group">
                                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Kembali ke Login
                            </Link>
                        </div>

                        <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Atur Ulang Sandi</h2>
                        <p className="text-slate-400 mb-8 font-bold text-[10px] uppercase tracking-widest italic">Pemulihan Akun Klinik.AI</p>

                        <form onSubmit={handleReset} className="space-y-5">
                            <div className="space-y-1.5 group">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Konfirmasi Email</label>
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
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Password Baru</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                                    <input
                                        type="password"
                                        placeholder="Minimal 8 karakter"
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white focus:border-blue-600 transition-all font-bold text-slate-800 text-sm"
                                        value={newPassword} onChange={e => setNewPassword(e.target.value)} required
                                    />
                                </div>
                            </div>

                            <button
                                disabled={isLoading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black shadow-xl shadow-blue-100 uppercase tracking-widest text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                {isLoading ? <Loader2 className="animate-spin" size={20} /> : "GANTI PASSWORD SEKARANG"}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="text-center py-10">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6"
                        >
                            <CheckCircle2 size={40} />
                        </motion.div>
                        <h2 className="text-2xl font-black text-slate-900 mb-2">Password Diperbarui!</h2>
                        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Mengarahkan Anda ke halaman login...</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}