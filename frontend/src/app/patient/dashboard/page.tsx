'use client';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldCheck, Sparkles, ArrowRight, Calendar,
    Clock, Star, Heart, Activity, Phone, User,
    Stethoscope, CheckCircle, MapPin, Mail, Play
} from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '@/services/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function WelcomePage() {
    const router = useRouter();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [doctors, setDoctors] = useState([]);
    const [formData, setFormData] = useState({
        patient_name: '',
        patient_phone: '',
        doctor_name: '',
        appointment_date: '',
        patient_address: '',
        patient_gender: ''
    });
    const [status, setStatus] = useState({ type: '', msg: '' });

    const bgImages = [
        '/images/bg/dental-bg-1.png',
        '/images/bg/dental-bg-2.png',
        '/images/bg/dental-bg-3.png',
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % bgImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [bgImages.length]);

    useEffect(() => {
        api.get('/clinic/doctors').then(res => setDoctors(res.data)).catch(() => { });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus({ type: 'loading', msg: 'Memproses...' });
        try {
            await api.post('/clinic/appointments', formData);
            setStatus({ type: 'success', msg: '✅ Berhasil! Jadwal tercatat. Mengalihkan...' });
            setFormData({ patient_name: '', patient_phone: '', doctor_name: '', appointment_date: '', patient_address: '', patient_gender: '' });
            setTimeout(() => {
                setStatus({ type: '', msg: '' });
                router.push('/patient/appointments');
            }, 1500);
        } catch (err) {
            setStatus({ type: 'error', msg: '❌ Gagal mendaftar. Pastikan data sudah benar.' });
            setTimeout(() => setStatus({ type: '', msg: '' }), 3000);
        }
    };

    const features = [
        { icon: <Calendar size={22} />, title: 'Booking Mudah', desc: 'Pilih jadwal & dokter favorit online 24/7' },
        { icon: <Star size={22} />, title: 'Dokter Ahli', desc: 'Tim dokter gigi spesialis berpengalaman' },
        { icon: <Activity size={22} />, title: 'Teknologi Modern', desc: 'Peralatan canggih untuk perawatan terbaik' },
        { icon: <Heart size={22} />, title: 'Perawatan Nyaman', desc: 'Prosedur minim rasa dengan hasil maksimal' },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative h-screen w-full flex flex-col items-start justify-center px-6 sm:px-10 lg:px-20 overflow-hidden">
                <div className="absolute inset-0 w-full h-full">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentSlide}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                            className="absolute inset-0 w-full h-full"
                            style={{
                                backgroundImage: `url(${bgImages[currentSlide]})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                            }}
                        >
                            {/* Overlay Hitam Tipis untuk teks */}
                            <div className="absolute inset-0 bg-black/30" />
                        </motion.div>
                    </AnimatePresence>

                    {/* MODIFIKASI: EFEK BLUR & GRADASI PUTIH DI BAWAH (Seperti Gbr 2) */}
                    <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-white via-white/80 to-transparent z-10" />
                </div>

                {/* Hero Content */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-left max-w-2xl relative z-20"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-md px-4 py-1.5 rounded-full mb-5 border border-emerald-400/30"
                    >
                        <Sparkles size={12} className="text-emerald-400" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">Nauli Dental AI</span>
                    </motion.div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-[1.1] mb-5">
                        Senyum Sehat,
                        <br />
                        <span className="bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
                            Masa Depan Cerah
                        </span>
                    </h1>

                    <p className="text-white/90 text-sm sm:text-base lg:text-lg max-w-lg mb-10 leading-relaxed font-medium">
                        Perawatan gigi modern dengan teknologi terkini untuk hasil akurat, aman, dan nyaman bersama tim dokter spesialis kami.
                    </p>

                    {/* TAMBAHAN TOMBOL (Sesuai Gbr 2) */}
                    <div className="flex flex-wrap gap-4">
                        <button className="bg-[#00C87E] hover:bg-emerald-600 text-white px-7 py-3.5 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-900/20 active:scale-95">
                            <Play size={18} fill="currentColor" />
                            Pilih Layanan
                        </button>
                        <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-7 py-3.5 rounded-2xl font-bold flex items-center gap-2 transition-all active:scale-95">
                            Keunggulan <ArrowRight size={18} />
                        </button>
                    </div>
                </motion.div>

                {/* MODIFIKASI: IKON MOUSE SCROLL (Sesuai Gbr 2) */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 hidden lg:block">
                    <div className="w-[26px] h-[45px] border-2 border-slate-400/50 rounded-full flex justify-center p-1.5">
                        <motion.div
                            animate={{ y: [0, 15, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="w-1.5 h-1.5 bg-emerald-500 rounded-full"
                        />
                    </div>
                </div>

                {/* Slide Indicators */}
                <div className="absolute bottom-10 left-20 z-20 flex gap-2">
                    {bgImages.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentSlide(idx)}
                            className={`transition-all duration-500 rounded-full ${currentSlide === idx
                                ? 'w-8 h-1.5 bg-emerald-500'
                                : 'w-1.5 h-1.5 bg-white/40'
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Features Section */}
            <div className="py-24 px-6 relative z-20 bg-white">
                <div className="max-w-7xl mx-auto">
                    {/* MODIFIKASI: HEADER LAYANAN (Sesuai Gbr 2) */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-14"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-1.5 h-8 bg-[#00C87E] rounded-full" />
                            <span className="text-[#00C87E] font-bold uppercase tracking-widest text-xs">
                                MENGAPA MEMILIH KAMI
                            </span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-5">
                            Keunggulan <span className="text-[#00C87E]">Layanan</span> Kami
                        </h2>
                        <p className="text-slate-500 max-w-xl text-lg font-medium leading-relaxed">
                            Kami menggabungkan teknologi modern dengan sentuhan pelayanan tulus.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-gradient-to-br from-emerald-50 to-white rounded-3xl p-8 shadow-xl shadow-emerald-900/5 hover:shadow-emerald-900/10 transition-all border border-emerald-100 group"
                            >
                                <div className="w-14 h-14 bg-gradient-to-br from-[#00C87E] to-teal-600 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-black text-slate-800 mb-3">{item.title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tentang Section */}
            <div className="py-20 px-6 bg-slate-50">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <div className="inline-flex items-center gap-2 bg-emerald-100 px-4 py-2 rounded-full mb-4">
                                <Heart size={14} className="text-emerald-600" />
                                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Tentang Kami</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-4">
                                Klinik Gigi Modern dengan Teknologi AI
                            </h2>
                            <p className="text-slate-500 mb-4 leading-relaxed">
                                Nauli Dental hadir sebagai solusi kesehatan gigi modern yang menggabungkan teknologi AI dengan pelayanan profesional. Kami berkomitmen memberikan pengalaman perawatan gigi yang nyaman, cepat, dan terjangkau.
                            </p>
                            <p className="text-slate-500 leading-relaxed">
                                Dengan tim dokter spesialis berpengalaman dan peralatan canggih, kami siap membantu Anda mendapatkan senyum sehat dan percaya diri.
                            </p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-8 text-white text-center shadow-2xl"
                        >
                            <ShieldCheck size={48} className="mx-auto mb-4 text-white/80" />
                            <h3 className="text-2xl font-bold mb-2">Terpercaya & Profesional</h3>
                            <p className="text-white/80">Lebih dari 1000+ pasien telah mempercayakan senyum mereka kepada kami</p>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Booking Section */}
            <div className="py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-10"
                    >
                        <div className="inline-flex items-center gap-2 bg-emerald-100 px-4 py-2 rounded-full mb-4">
                            <Calendar size={16} className="text-emerald-600" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Booking Online</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-4">
                            Buat Janji Temu Sekarang
                        </h2>
                        <p className="text-slate-500 max-w-2xl mx-auto">
                            Isi formulir di bawah ini untuk melakukan reservasi. Kami akan menghubungi Anda untuk konfirmasi.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-slate-100"
                    >
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid md:grid-cols-2 gap-5">
                                <div className="relative">
                                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Nama Lengkap"
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                        value={formData.patient_name}
                                        onChange={e => setFormData({ ...formData, patient_name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="relative">
                                    <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Nomor WhatsApp"
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                        value={formData.patient_phone}
                                        onChange={e => setFormData({ ...formData, patient_phone: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Alamat dan Jenis Kelamin */}
                            <div className="grid md:grid-cols-2 gap-5">
                                <div className="relative">
                                    <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Alamat Lengkap"
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                        value={formData.patient_address}
                                        onChange={e => setFormData({ ...formData, patient_address: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        <User size={16} />
                                    </div>
                                    <select
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium appearance-none cursor-pointer focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                        value={formData.patient_gender}
                                        onChange={e => setFormData({ ...formData, patient_gender: e.target.value })}
                                        required
                                    >
                                        <option value="">-- Jenis Kelamin --</option>
                                        <option value="Laki-laki">Laki-laki</option>
                                        <option value="Perempuan">Perempuan</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-5">
                                <div className="relative">
                                    <Stethoscope size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
                                    <select
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium appearance-none cursor-pointer focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                        value={formData.doctor_name}
                                        onChange={e => setFormData({ ...formData, doctor_name: e.target.value })}
                                        required
                                    >
                                        <option value="">-- Pilih Dokter Spesialis --</option>
                                        {doctors.map((d: any) => (
                                            <option key={d.id} value={d.name}>
                                                {d.name} - {d.specialty}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="relative">
                                    <Clock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="datetime-local"
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                        value={formData.appointment_date}
                                        onChange={e => setFormData({ ...formData, appointment_date: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-xl font-bold text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {status.type === 'loading' ? 'Memproses...' : 'Konfirmasi Janji Temu'}
                            </button>

                            {status.msg && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`text-center text-sm font-medium py-3 rounded-xl ${status.type === 'success'
                                        ? 'text-emerald-600 bg-emerald-50'
                                        : status.type === 'error'
                                            ? 'text-red-600 bg-red-50'
                                            : 'text-emerald-600 bg-emerald-50'
                                        }`}
                                >
                                    {status.msg}
                                </motion.p>
                            )}
                        </form>

                        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
                            <span className="flex items-center gap-1"><ShieldCheck size={12} /> Data Terenkripsi</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            <span className="flex items-center gap-1"><Heart size={12} /> Gratis Konsultasi Awal</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            <span className="flex items-center gap-1"><CheckCircle size={12} /> Konfirmasi Cepat</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white border-t border-emerald-100 pt-16 pb-8 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 pb-10 border-b border-emerald-100">
                        {/* Kolom 1: Logo & Tagline */}
                        <div>
                            <Link href="/patient/dashboard" className="flex items-center gap-3 mb-4 group">
                                <div className="w-12 h-12 rounded-[1.2rem] overflow-hidden border-2 border-emerald-100 shadow-sm group-hover:border-emerald-200 transition-all flex-shrink-0 bg-white flex items-center justify-center p-1.5">
                                    <img
                                        src="/images/Logo.png"
                                        alt="Nauli Dental"
                                        className="w-full h-full object-contain"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                            const parent = target.parentElement;
                                            if (parent) {
                                                parent.innerHTML = '<span class="text-emerald-600 font-black text-lg">ND</span>';
                                            }
                                        }}
                                    />
                                </div>
                                <div className="flex flex-col leading-none">
                                    <h2 className="text-slate-800 font-black text-[18px] tracking-tighter leading-tight">
                                        Nauli<span className="text-[#006D44]">Dental</span>
                                    </h2>
                                    <p className="text-[9px] text-emerald-600 font-bold tracking-widest uppercase">
                                        Clinic Care
                                    </p>
                                </div>
                            </Link>
                            <p className="text-slate-500 text-sm leading-relaxed mt-3">
                                Nauli Dental Care adalah klinik perawatan gigi yang berlokasi di Balige, Kabupaten Toba, Sumatera Utara. Klinik ini melayani berbagai macam perawatan gigi umum dan estetika demi menjaga kesehatan mulut serta senyuman Anda.
                            </p>
                        </div>

                        {/* Kolom 2: Company Links */}
                        <div>
                            <h3 className="text-slate-800 font-bold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
                                <div className="w-1 h-5 bg-emerald-500 rounded-full" />
                                Company Links
                            </h3>
                            <ul className="space-y-3">
                                {[
                                    { name: 'Beranda', href: '/patient/dashboard' },
                                    { name: 'Nauli Dental', href: '/patient/about' },
                                    { name: 'Tim Kami', href: '/patient/doctors' },
                                    { name: 'Visi & Misi', href: '/patient/visiMisi' },
                                    { name: 'Layanan', href: '/patient/services' },
                                    { name: 'Cari Jadwal', href: '/patient/appointments' },
                                ].map((link, idx) => (
                                    <li key={idx}>
                                        <Link href={link.href} className="text-slate-500 hover:text-emerald-600 text-sm transition-colors duration-300 flex items-center gap-2 group">
                                            <ArrowRight size={12} className="text-emerald-400 opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" />
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Kolom 3: Office Address */}
                        <div>
                            <h3 className="text-slate-800 font-bold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
                                <div className="w-1 h-5 bg-emerald-500 rounded-full" />
                                Office Address
                            </h3>
                            <div className="space-y-4">
                                <div className="flex gap-3 group text-slate-500 text-sm">
                                    <MapPin size={18} className="text-emerald-500 flex-shrink-0" />
                                    <span>Jl. Raja Paindoan No.20A, Lumban Dolok Haume Bange, Kec. Balige, Toba, Sumatera Utara 22314</span>
                                </div>
                            </div>
                        </div>

                        {/* Kolom 4: Contact Us */}
                        <div>
                            <h3 className="text-slate-800 font-bold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
                                <div className="w-1 h-5 bg-emerald-500 rounded-full" />
                                Contact & Hours
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3">
                                    <Mail size={16} className="text-emerald-500" />
                                    <a href="mailto:booking@naulidental.com" className="text-slate-600 text-sm">booking@naulidental.com</a>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Phone size={16} className="text-emerald-500" />
                                    <span className="text-slate-600 text-sm">0812-6530-965</span>
                                </li>
                                <li className="flex gap-3 text-slate-600 text-sm">
                                    <Clock size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p>Senin - Jumat: 10.00 - 19.00</p>
                                        <p>Sabtu: 10.00 - 17.00</p>
                                        <p className="text-red-500">Minggu: Tutup</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-slate-400 text-xs">
                            © {new Date().getFullYear()} Nauli Dental Care. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}