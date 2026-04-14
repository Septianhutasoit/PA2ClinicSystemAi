'use client';
import { useState, useEffect } from 'react';
import api from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Lock, LogOut, CheckCircle2,
    Camera, Mail, Smartphone, Calendar,
    MapPin, Loader2, ShieldCheck, Globe,
    Building, Save, RefreshCcw, Info
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
        <div className="min-h-screen bg-[#F8FAFC] pb-20 animate-in fade-in duration-700">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* --- KOLOM KIRI: SIDEBAR PROFILE --- */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white rounded-[3rem] p-10 shadow-xl shadow-emerald-900/5 border border-slate-100 text-center">
                        <div className="relative inline-block mb-6">
                            <div className="w-28 h-28 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl bg-slate-50">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${adminData.full_name}`} className="w-full h-full object-cover" alt="avatar" />
                            </div>
                            <button className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-3 rounded-2xl shadow-lg border-4 border-white hover:bg-emerald-600 transition-all active:scale-90">
                                <Camera size={16} />
                            </button>
                        </div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-none uppercase italic">{adminData.full_name || 'Admin'}</h2>
                        <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em] mt-3 bg-emerald-50 py-1 rounded-full px-4 inline-block">{adminData.role}</p>

                        <div className="mt-12 space-y-2 text-left">
                            {menuItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === item.id
                                            ? "bg-emerald-600 text-white shadow-xl shadow-emerald-200"
                                            : "text-slate-400 hover:bg-emerald-50 hover:text-emerald-600"
                                        }`}
                                >
                                    {item.icon} {item.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* SESI KEAMANAN */}
                    <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                        <div className="relative z-10 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400"><ShieldCheck size={20} /></div>
                                <h4 className="font-black text-xs uppercase tracking-widest">Sesi Aktif</h4>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Login Terakhir</p>
                                <p className="text-sm font-black text-emerald-400 italic">Hari ini, 09:20 AM</p>
                            </div>
                        </div>
                        <Globe size={180} className="absolute -right-16 -bottom-16 opacity-5 text-white rotate-12" />
                    </div>
                </div>

                {/* --- KOLOM KANAN: PANEL FORM --- */}
                <div className="lg:col-span-8">
                    <div className="bg-white rounded-[3.5rem] p-10 lg:p-16 shadow-xl shadow-emerald-900/5 border border-slate-100 min-h-[750px] relative overflow-hidden">
                        <AnimatePresence mode="wait">
                            {activeTab === 'profile' && (
                                <motion.div key="profile" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-10">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Personal Info</h3>
                                            <p className="text-slate-400 text-xs font-bold mt-2 uppercase tracking-widest">Kelola detail informasi profil Anda</p>
                                        </div>
                                        <div className="flex gap-4">
                                            <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                                                <input type="radio" name="g" defaultChecked className="accent-emerald-500 w-4 h-4" />
                                                <span className="text-[10px] font-black text-slate-600 uppercase">Laki-laki</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                                                <input type="radio" name="g" className="accent-emerald-500 w-4 h-4" />
                                                <span className="text-[10px] font-black text-slate-600 uppercase">Perempuan</span>
                                            </label>
                                        </div>
                                    </div>

                                    <form onSubmit={handleSaveProfile} className="space-y-8 pt-6 border-t border-slate-50">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Nama Lengkap</label>
                                                <input type="text" value={adminData.full_name} onChange={e => setAdminData({ ...adminData, full_name: e.target.value })} className="w-full p-4 bg-[#F8FAFF] rounded-2xl border border-slate-100 font-bold text-sm focus:ring-4 focus:ring-emerald-50 outline-none transition-all" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Sistem Email</label>
                                                <div className="relative">
                                                    <input type="email" value={adminData.email} className="w-full p-4 bg-[#F8FAFF] rounded-2xl border border-slate-100 font-bold text-sm text-slate-400" disabled />
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg text-[8px] font-black uppercase flex items-center gap-1 border border-emerald-100"><CheckCircle2 size={10} /> Verified</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Alamat Domisili</label>
                                            <textarea rows={3} value={adminData.address} onChange={e => setAdminData({ ...adminData, address: e.target.value })} className="w-full p-4 bg-[#F8FAFF] rounded-2xl border border-slate-100 font-bold text-sm focus:ring-4 focus:ring-emerald-50 outline-none transition-all resize-none" placeholder="Tulis alamat lengkap..."></textarea>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Nomor Telepon</label>
                                                <input type="text" value={adminData.phone} onChange={e => setAdminData({ ...adminData, phone: e.target.value })} className="w-full p-4 bg-[#F8FAFF] rounded-2xl border border-slate-100 font-bold text-sm focus:ring-4 focus:ring-emerald-50 outline-none transition-all" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">ID Pegawai</label>
                                                <input type="text" value="#ADM-0001" disabled className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 font-bold text-sm text-slate-400" />
                                            </div>
                                        </div>

                                        <div className="pt-10 flex gap-4">
                                            <button type="button" className="flex-1 py-5 rounded-[2rem] bg-white border-2 border-slate-100 text-slate-400 font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2"><RefreshCcw size={16} /> Reset</button>
                                            <button type="submit" disabled={isLoading} className="flex-[2] py-5 rounded-[2rem] bg-emerald-600 text-white font-black text-xs uppercase tracking-widest shadow-2xl shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center gap-2">
                                                {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Simpan Profil
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}

                            {activeTab === 'clinic' && (
                                <motion.div key="clinic" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-10">
                                    <div>
                                        <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Clinic Identity</h3>
                                        <p className="text-slate-400 text-xs font-bold mt-2 uppercase tracking-widest">Informasi global yang tampil di website pasien</p>
                                    </div>

                                    <div className="space-y-6 pt-6 border-t border-slate-50">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Nama Klinik Utama</label>
                                            <input type="text" value={clinicData.clinic_name} onChange={e => setClinicData({ ...clinicData, clinic_name: e.target.value })} className="w-full p-4 bg-emerald-50/30 rounded-2xl border border-emerald-100 font-black text-sm text-emerald-900 focus:ring-4 focus:ring-emerald-50 outline-none transition-all" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Tagline AI</label>
                                            <input type="text" value={clinicData.tagline} onChange={e => setClinicData({ ...clinicData, tagline: e.target.value })} className="w-full p-4 bg-[#F8FAFF] rounded-2xl border border-slate-100 font-bold text-sm outline-none" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Alamat Cabang Balige</label>
                                            <textarea rows={3} value={clinicData.clinic_address} onChange={e => setClinicData({ ...clinicData, clinic_address: e.target.value })} className="w-full p-4 bg-[#F8FAFF] rounded-2xl border border-slate-100 font-bold text-sm outline-none resize-none" />
                                        </div>
                                        <button className="w-full py-5 rounded-[2rem] bg-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"><Globe size={18} /> Update Informasi Publik</button>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'security' && (
                                <motion.div key="security" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-10">
                                    <div>
                                        <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none text-rose-600">Keamanan & Sandi</h3>
                                        <p className="text-slate-400 text-xs font-bold mt-2 uppercase tracking-widest">Atur perlindungan akun administrator Anda</p>
                                    </div>
                                    <div className="p-6 bg-rose-50 border border-rose-100 rounded-3xl flex gap-4 items-center">
                                        <Info className="text-rose-500" size={24} />
                                        <p className="text-xs font-bold text-rose-700 leading-relaxed uppercase tracking-tighter">Perhatian: Gunakan kombinasi simbol dan angka agar akun tidak mudah ditembus.</p>
                                    </div>
                                    <div className="space-y-6 pt-6 border-t border-slate-50">
                                        <input type="password" placeholder="Password Saat Ini" className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 font-bold text-sm outline-none focus:ring-4 focus:ring-rose-50" />
                                        <input type="password" placeholder="Password Baru" className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 font-bold text-sm outline-none focus:ring-4 focus:ring-emerald-50" />
                                        <button className="w-full py-5 rounded-[2rem] bg-rose-600 text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-rose-200 hover:bg-rose-700 transition-all">Ganti Password Sekarang</button>
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