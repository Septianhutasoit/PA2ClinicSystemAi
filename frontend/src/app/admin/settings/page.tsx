'use client';
import { useState, useEffect } from 'react';
import api from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Lock, LogOut, CheckCircle2,
    Camera, Mail, Smartphone, Calendar,
    MapPin, Loader2, ShieldCheck, Globe,
    Building, Save, RefreshCcw, Info,
    ChevronRight, Award, Clock, Phone
} from 'lucide-react';

export default function AdminSettings() {
    const [activeTab, setActiveTab] = useState('profile');
    const [isLoading, setIsLoading] = useState(false);

    // State untuk Data Profil (Tabel Users)
    const [adminData, setAdminData] = useState({
        full_name: '',
        email: '',
        phone: '',
        address: '',
        gender: 'Laki-laki',
        role: 'Administrator',
        last_login: 'Loading...'
    });

    // State untuk Data Klinik (Global Settings)
    const [clinicData, setClinicData] = useState({
        clinic_name: 'Nauli Dental Care',
        clinic_address: 'Jl. Balige No. 12, Toba',
        clinic_phone: '+62 821 6352 6363',
        tagline: 'Excellence in Intelligence Dental Care'
    });

    useEffect(() => {
        // Ambil data profil dari backend
        api.get('/auth/me').then(res => {
            setAdminData(prev => ({ ...prev, ...res.data }));
        }).catch(() => console.error("Gagal load profile"));
    }, []);

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.patch('/auth/update-me', adminData);
            alert("✅ Profil Berhasil Diperbarui!");
        } catch (err) { alert("❌ Gagal simpan profil"); }
        finally { setIsLoading(false); }
    };

    const menuItems = [
        { id: 'profile', label: 'Informasi Akun', icon: <User size={18} /> },
        { id: 'clinic', label: 'Informasi Klinik', icon: <Building size={18} /> },
        { id: 'security', label: 'Keamanan & Sandi', icon: <Lock size={18} /> },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/20 pb-20 animate-in fade-in duration-700">
            <div className="max-w-7xl mx-auto px-4 lg:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* --- KOLOM KIRI: SIDEBAR PROFILE --- */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 text-center">
                        <div className="relative inline-block mb-5">
                            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-emerald-500 shadow-lg bg-slate-100">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${adminData.full_name}`} className="w-full h-full object-cover" alt="avatar" />
                            </div>
                            <button className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-2.5 rounded-full shadow-lg border-2 border-white hover:bg-emerald-700 transition-all active:scale-90">
                                <Camera size={14} />
                            </button>
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">{adminData.full_name || 'Administrator'}</h2>
                        <p className="text-[11px] font-semibold text-emerald-600 mt-2 bg-emerald-50 py-1.5 rounded-full px-4 inline-block">{adminData.role}</p>

                        <div className="mt-8 space-y-1 text-left">
                            {menuItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === item.id
                                        ? "bg-emerald-600 text-white shadow-md"
                                        : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-600"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </div>
                                    {activeTab === item.id && <ChevronRight size={16} />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* SESI KEAMANAN - Card Info */}
                    <div className="bg-emerald-600 p-6 rounded-2xl text-white shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                        <div className="relative z-10 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                    <ShieldCheck size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm">Sesi Aktif</h4>
                                    <p className="text-white/70 text-xs">Akun Anda aman</p>
                                </div>
                            </div>
                            <div className="pt-2">
                                <p className="text-[10px] font-semibold text-white/70 uppercase tracking-wider">Login Terakhir</p>
                                <p className="text-sm font-bold text-white">Hari ini, {new Date().toLocaleTimeString()}</p>
                            </div>
                            <div className="pt-2 border-t border-white/20">
                                <p className="text-[10px] font-semibold text-white/70 uppercase tracking-wider">IP Address</p>
                                <p className="text-xs font-mono text-white/80">192.168.1.1</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- KOLOM KANAN: PANEL FORM --- */}
                <div className="lg:col-span-8">
                    <div className="bg-white rounded-2xl p-8 lg:p-10 shadow-lg border border-slate-100 min-h-[600px]">
                        <AnimatePresence mode="wait">
                            {activeTab === 'profile' && (
                                <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                                    <div>
                                        <h3 className="text-2xl font-bold text-slate-800">Informasi Pribadi</h3>
                                        <p className="text-slate-400 text-sm mt-1">Kelola detail informasi profil Anda</p>
                                    </div>

                                    <form onSubmit={handleSaveProfile} className="space-y-5">
                                        <div className="flex gap-6">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="radio" name="gender" checked={adminData.gender === 'Laki-laki'} onChange={() => setAdminData({ ...adminData, gender: 'Laki-laki' })} className="accent-emerald-600 w-4 h-4" />
                                                <span className="text-sm text-slate-700">Laki-laki</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="radio" name="gender" checked={adminData.gender === 'Perempuan'} onChange={() => setAdminData({ ...adminData, gender: 'Perempuan' })} className="accent-emerald-600 w-4 h-4" />
                                                <span className="text-sm text-slate-700">Perempuan</span>
                                            </label>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-5">
                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold text-slate-600">Nama Lengkap</label>
                                                <input
                                                    type="text"
                                                    value={adminData.full_name}
                                                    onChange={e => setAdminData({ ...adminData, full_name: e.target.value })}
                                                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold text-slate-600">Email</label>
                                                <div className="relative">
                                                    <input
                                                        type="email"
                                                        value={adminData.email}
                                                        className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-500"
                                                        disabled
                                                    />
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-lg text-[9px] font-semibold flex items-center gap-1">
                                                        <CheckCircle2 size={10} /> Verified
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-slate-600">Alamat</label>
                                            <textarea
                                                rows={2}
                                                value={adminData.address}
                                                onChange={e => setAdminData({ ...adminData, address: e.target.value })}
                                                className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none"
                                                placeholder="Masukkan alamat lengkap..."
                                            />
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-5">
                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold text-slate-600">Nomor Telepon</label>
                                                <input
                                                    type="text"
                                                    value={adminData.phone}
                                                    onChange={e => setAdminData({ ...adminData, phone: e.target.value })}
                                                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold text-slate-600">ID Pegawai</label>
                                                <input
                                                    type="text"
                                                    value="#ADM-0001"
                                                    disabled
                                                    className="w-full px-4 py-3 bg-slate-100 rounded-xl border border-slate-200 text-sm text-slate-400"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex gap-3 pt-4">
                                            <button
                                                type="button"
                                                className="flex-1 py-3 rounded-xl bg-white border border-slate-200 text-slate-500 text-sm font-semibold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                                            >
                                                <RefreshCcw size={14} /> Reset
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                className="flex-[2] py-3 rounded-xl bg-emerald-600 text-white text-sm font-semibold shadow-md hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                                            >
                                                {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                                                Simpan Profil
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}

                            {activeTab === 'clinic' && (
                                <motion.div key="clinic" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                                    <div>
                                        <h3 className="text-2xl font-bold text-slate-800">Informasi Klinik</h3>
                                        <p className="text-slate-400 text-sm mt-1">Informasi yang tampil di website pasien</p>
                                    </div>

                                    <div className="space-y-5">
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-slate-600">Nama Klinik</label>
                                            <input
                                                type="text"
                                                value={clinicData.clinic_name}
                                                onChange={e => setClinicData({ ...clinicData, clinic_name: e.target.value })}
                                                className="w-full px-4 py-3 bg-emerald-50/50 rounded-xl border border-emerald-200 font-semibold text-sm text-emerald-800 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-slate-600">Tagline</label>
                                            <input
                                                type="text"
                                                value={clinicData.tagline}
                                                onChange={e => setClinicData({ ...clinicData, tagline: e.target.value })}
                                                className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-slate-600">Alamat Klinik</label>
                                            <textarea
                                                rows={2}
                                                value={clinicData.clinic_address}
                                                onChange={e => setClinicData({ ...clinicData, clinic_address: e.target.value })}
                                                className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-slate-600">Nomor Telepon Klinik</label>
                                            <input
                                                type="text"
                                                value={clinicData.clinic_phone}
                                                onChange={e => setClinicData({ ...clinicData, clinic_phone: e.target.value })}
                                                className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                            />
                                        </div>
                                        <button className="w-full py-3 rounded-xl bg-emerald-600 text-white text-sm font-semibold shadow-md hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
                                            <Globe size={16} /> Update Informasi Publik
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'security' && (
                                <motion.div key="security" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                                    <div>
                                        <h3 className="text-2xl font-bold text-slate-800">Keamanan & Sandi</h3>
                                        <p className="text-slate-400 text-sm mt-1">Atur perlindungan akun administrator Anda</p>
                                    </div>

                                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-3 items-start">
                                        <Info size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                                        <p className="text-xs text-amber-700 leading-relaxed">Gunakan kombinasi huruf besar, angka, dan simbol untuk password yang lebih aman.</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-slate-600">Password Saat Ini</label>
                                            <input
                                                type="password"
                                                placeholder="Masukkan password saat ini"
                                                className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-slate-600">Password Baru</label>
                                            <input
                                                type="password"
                                                placeholder="Masukkan password baru"
                                                className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-slate-600">Konfirmasi Password Baru</label>
                                            <input
                                                type="password"
                                                placeholder="Konfirmasi password baru"
                                                className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                            />
                                        </div>
                                        <button className="w-full py-3 rounded-xl bg-emerald-600 text-white text-sm font-semibold shadow-md hover:bg-emerald-700 transition-all">
                                            Ganti Password Sekarang
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

            </div>
        </div>
    );
}