'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { motion } from 'framer-motion';
import { 
    Settings, Shield, User, Lock, 
    Mail, Save, Loader2, AlertCircle,
    CheckCircle2
} from 'lucide-react';

export default function SettingsPage() {
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [passwords, setPasswords] = useState({
        new: '',
        confirm: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/auth/me');
            setUser(res.data);
        } catch (err: any) {
            console.error(err);
            if (err.response?.status === 401) {
                window.location.href = '/login';
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            return alert("Konfirmasi password tidak cocok!");
        }
        if (passwords.new.length < 8) {
            return alert("Password baru minimal 8 karakter!");
        }

        setIsSaving(true);
        try {
            await api.post('/auth/reset-password', { new_password: passwords.new });
            alert("✅ Password berhasil diperbarui!");
            setPasswords({ new: '', confirm: '' });
        } catch (err: any) {
            alert(err.response?.data?.detail || "Gagal memperbarui password");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return (
        <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-slate-400" size={40} />
        </div>
    );

    return (
        <div className="max-w-4xl space-y-8 pb-32">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
                    <Settings className="text-slate-600" /> System Settings
                </h1>
                <p className="text-sm text-slate-400 mt-0.5">
                    Kelola profil admin dan pengaturan keamanan sistem
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Profile Info */}
                <div className="md:col-span-1 space-y-4">
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-md">
                            <User size={40} className="text-slate-400" />
                        </div>
                        <h2 className="font-bold text-slate-800">{user?.full_name}</h2>
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-wider mt-2 inline-block">
                            {user?.role}
                        </span>
                        
                        <div className="mt-6 space-y-3 text-left">
                            <div className="flex items-center gap-3 text-xs text-slate-500">
                                <Mail size={14} className="text-slate-300" />
                                <span className="truncate">{user?.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-slate-500">
                                <Shield size={14} className="text-slate-300" />
                                <span>Level Akses Tinggi</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
                        <h4 className="flex items-center gap-2 text-amber-800 font-bold text-xs mb-2">
                            <AlertCircle size={14} /> Keamanan Data
                        </h4>
                        <p className="text-[10px] text-amber-700 leading-relaxed font-medium">
                            Pastikan Anda tidak membagikan kredensial Admin kepada siapapun untuk menjaga kerahasiaan data pasien.
                        </p>
                    </div>
                </div>

                {/* Forms Section */}
                <div className="md:col-span-2 space-y-6">
                    {/* Keamanan Akun */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-50 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
                                <Lock size={16} />
                            </div>
                            <h3 className="font-bold text-slate-800 text-sm">Ubah Password Keamanan</h3>
                        </div>
                        <form onSubmit={handlePasswordReset} className="p-6 space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Password Baru</label>
                                <input 
                                    type="password"
                                    placeholder="Minimal 8 karakter"
                                    value={passwords.new}
                                    onChange={e => setPasswords({...passwords, new: e.target.value})}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all"
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Konfirmasi Password Baru</label>
                                <input 
                                    type="password"
                                    placeholder="Ulangi password"
                                    value={passwords.confirm}
                                    onChange={e => setPasswords({...passwords, confirm: e.target.value})}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all"
                                    required
                                />
                            </div>
                            <button 
                                disabled={isSaving}
                                className="w-full md:w-auto px-10 py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg flex items-center justify-center gap-2"
                            >
                                {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                                Update Password
                            </button>
                        </form>
                    </div>

                    {/* Fitur Lainnya (Placeholder) */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center py-12">
                        <CheckCircle2 size={32} className="text-slate-100 mx-auto mb-3" />
                        <h3 className="font-bold text-slate-400 text-sm italic">Pengaturan sistem lainnya dikonfigurasi melalui .env</h3>
                    </div>
                </div>
            </div>
        </div>
    );
}
