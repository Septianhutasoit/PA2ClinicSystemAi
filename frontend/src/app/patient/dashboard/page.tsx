'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import {
    ShieldCheck, User, Calendar, Clock, Activity,
    LogOut, Phone, Bell, ChevronDown, Sparkles, MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PatientDashboard() {
    const router = useRouter();
    const [doctors, setDoctors] = useState([]);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [formData, setFormData] = useState({
        patient_name: '',
        patient_phone: '',
        doctor_name: '',
        appointment_date: ''
    });
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [isLoading, setIsLoading] = useState(true);

    // 1. Proteksi Halaman & Ambil Data
    useEffect(() => {
        const token = localStorage.getItem('token') || Cookies.get('token');
        if (!token) {
            router.push('/login');
            return;
        }

        const loadDoctors = async () => {
            try {
                const res = await api.get('/clinic/doctors');
                setDoctors(res.data);
            } catch (err) {
                console.error("Gagal sinkronisasi data dokter");
            } finally {
                setIsLoading(false);
            }
        };
        loadDoctors();
    }, [router]);

    // 2. Fungsi Logout Total
    const handleLogout = () => {
        if (confirm("Keluar dari Portal Pasien?")) {
            localStorage.clear();
            Cookies.remove('token');
            Cookies.remove('user_role');
            window.location.href = '/'; // Redirect ke Welcome Page
        }
    };

    // 3. Handle Submit dengan Format WhatsApp
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus({ type: 'loading', msg: 'Mengirim data...' });

        let phone = formData.patient_phone;
        if (phone.startsWith('0')) phone = '62' + phone.substring(1);

        try {
            await api.post('/clinic/appointments', { ...formData, patient_phone: phone });
            setStatus({ type: 'success', msg: '✅ Berhasil! Jadwal Anda telah tercatat.' });
            setFormData({ patient_name: '', patient_phone: '', doctor_name: '', appointment_date: '' });
        } catch (err) {
            setStatus({ type: 'error', msg: '❌ Gagal mendaftar. Silakan coba lagi.' });
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FD] font-sans selection:bg-blue-100">

            {/* --- NAVBAR MODERN --- */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-3">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black italic shadow-lg shadow-blue-200">K</div>
                        <h1 className="text-lg font-black tracking-tighter text-slate-800 italic">Nauli Patient Suite</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-full relative">
                            <Bell size={18} />
                            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full border border-white"></span>
                        </button>
                        <div className="h-6 w-[1px] bg-slate-200" />

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-2 p-1 hover:bg-slate-50 rounded-xl transition-all"
                            >
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Patient" className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100" alt="avatar" />
                                <ChevronDown size={14} className={`text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                        className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 overflow-hidden"
                                    >
                                        <button onClick={handleLogout} className="w-full px-4 py-2.5 text-left text-xs font-black text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors">
                                            <LogOut size={16} /> Keluar Sistem
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto p-6 lg:p-10 space-y-8">

                {/* --- HEADER SAMBUTAN --- */}
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 flex justify-between items-center relative overflow-hidden">
                    <div className="relative z-10">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Halo, Selamat Datang!</h1>
                        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-2 flex items-center gap-2">
                            <Sparkles size={14} className="text-blue-600" /> Nauli Dental Portal — Connected to Cloud
                        </p>
                    </div>
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner"><Activity size={32} /></div>
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-50/40 rounded-full blur-3xl"></div>
                </motion.div>

                <div className="grid lg:grid-cols-5 gap-8">
                    {/* --- SISI KIRI: FORM BOOKING (DIPERLENGKAP) --- */}
                    <div className="lg:col-span-3">
                        <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-32 -mt-32"></div>

                            <h3 className="text-2xl font-black mb-1 italic tracking-tight">Buat Janji Temu Baru</h3>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-10 opacity-60 italic">Instant Online Registration</p>

                            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase text-blue-400 ml-2">Nama Pasien</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                            <input type="text" placeholder="Septian" required className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all font-bold text-sm" value={formData.patient_name} onChange={e => setFormData({ ...formData, patient_name: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase text-blue-400 ml-2">WhatsApp</label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                            <input type="text" placeholder="0812..." required className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all font-bold text-sm" value={formData.patient_phone} onChange={e => setFormData({ ...formData, patient_phone: e.target.value })} />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase text-blue-400 ml-2">Pilih Dokter (Data dari Admin)</label>
                                    <div className="relative">
                                        <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <select
                                            className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all font-bold text-sm appearance-none cursor-pointer"
                                            value={formData.doctor_name} onChange={e => setFormData({ ...formData, doctor_name: e.target.value })} required
                                        >
                                            <option value="" className="text-slate-900">-- Pilih Dokter Spesialis --</option>
                                            {doctors.map((d: any) => (
                                                <option key={d.id} value={d.name} className="text-slate-900">{d.name} ({d.specialty})</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase text-blue-400 ml-2">Waktu Kedatangan</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                        <input type="datetime-local" required className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all font-bold text-sm [color-scheme:dark]" value={formData.appointment_date} onChange={e => setFormData({ ...formData, appointment_date: e.target.value })} />
                                    </div>
                                </div>

                                <button className="w-full bg-blue-600 hover:bg-blue-500 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl transition-all active:scale-95">
                                    {status.type === 'loading' ? 'Memproses...' : 'KONFIRMASI SEKARANG'}
                                </button>

                                {status.msg && <p className="text-center text-[10px] font-black uppercase mt-4 animate-pulse">{status.msg}</p>}
                            </form>
                        </div>
                    </div>

                    {/* --- SISI KANAN: DAFTAR DOKTER (VISUAL) --- */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                            <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest mb-6 flex items-center gap-2">
                                <Clock className="text-blue-600" size={16} /> Dokter Siaga Hari Ini
                            </h4>
                            <div className="space-y-4">
                                {doctors.map((d: any) => (
                                    <div key={d.id} className="flex items-center gap-4 p-3 hover:bg-blue-50 transition-colors rounded-2xl">
                                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-xs">DR</div>
                                        <div>
                                            <p className="font-bold text-slate-800 text-sm">{d.name}</p>
                                            <p className="text-[10px] font-black text-blue-500 uppercase">{d.specialty}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Lokasi Klinik */}
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600"><MapPin size={18} /></div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase">Lokasi</p>
                                    <p className="text-sm font-bold text-slate-800">Jl. Balige No. 12, Toba</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Tutup Dropdown jika klik di luar */}
            {isProfileOpen && <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>}
        </div>
    );
}