'use client';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldCheck, Sparkles, ArrowRight, Calendar,
    Clock, Star, Heart, Activity, Phone, User,
    Stethoscope, CheckCircle, MapPin
} from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '@/services/api';
import Link from 'next/link';

export default function WelcomePage() {
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

    // Auto slide background
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % bgImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [bgImages.length]);

    // Fetch doctors
    useEffect(() => {
        api.get('/clinic/doctors').then(res => setDoctors(res.data)).catch(() => { });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus({ type: 'loading', msg: 'Mengirim...' });
        try {
            await api.post('/clinic/appointments', formData);
            setStatus({ type: 'success', msg: '✅ Berhasil! Jadwal tercatat.' });
            setFormData({ ...formData, doctor_name: '', appointment_date: '' });
            setTimeout(() => setStatus({ type: '', msg: '' }), 3000);
        } catch (err) {
            setStatus({ type: 'error', msg: '❌ Gagal mendaftar.' });
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
            {/* Hero Section - Fullscreen dengan Background Slider */}
            <div className="relative h-screen w-full flex flex-col items-start justify-center px-6 sm:px-10 lg:px-20">
                {/* Background Slider - TANPA TOMBOL NAVIGASI */}
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentSlide}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1, ease: "easeInOut" }}
                            className="absolute inset-0 w-full h-full"
                            style={{
                                backgroundImage: `url(${bgImages[currentSlide]})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                            }}
                        >
                            <div className="absolute inset-0 bg-black/50" />
                        </motion.div>
                    </AnimatePresence>

                    {/* Slide Indicators - TETAP ADA */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                        {bgImages.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentSlide(idx)}
                                className={`transition-all duration-300 rounded-full ${currentSlide === idx
                                        ? 'w-8 h-1.5 bg-white'
                                        : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Hero Content */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-left max-w-2xl relative z-10"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full mb-5"
                    >
                        <Sparkles size={12} className="text-yellow-400" />
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white">Nauli Dental AI</span>
                    </motion.div>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tighter leading-[1.2] mb-4">
                        Senyum Sehat,
                        <br />
                        <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                            Masa Depan Cerah
                        </span>
                    </h1>

                    <p className="text-white/80 text-sm sm:text-base lg:text-lg max-w-lg mb-8">
                        Sistem manajemen klinik gigi modern dengan teknologi AI Automation untuk pengalaman perawatan yang lebih nyaman dan efisien.
                    </p>
                </motion.div>
            </div>

            {/* Features Section - SAMA SEPERTI SEBELUMNYA */}
            <div className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-4">
                            Layanan Unggulan Kami
                        </h2>
                        <p className="text-slate-500 max-w-2xl mx-auto">
                            Kami menyediakan layanan dental terbaik dengan teknologi modern dan tim dokter berpengalaman
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
                                className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-slate-100 group"
                            >
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                                    {item.icon}
                                </div>
                                <h3 className="text-lg font-black text-slate-800 mb-2">{item.title}</h3>
                                <p className="text-sm text-slate-500">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tentang Section - SAMA SEPERTI SEBELUMNYA */}
            <div className="py-20 px-6 bg-slate-50">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <div className="inline-flex items-center gap-2 bg-indigo-100 px-4 py-2 rounded-full mb-4">
                                <Heart size={14} className="text-indigo-600" />
                                <span className="text-[10px] font-bold text-indigo-600">Tentang Kami</span>
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
                            className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white text-center"
                        >
                            <ShieldCheck size={48} className="mx-auto mb-4 text-white/80" />
                            <h3 className="text-2xl font-bold mb-2">Terpercaya & Profesional</h3>
                            <p className="text-white/80">Lebih dari 1000+ pasien telah mempercayakan senyum mereka kepada kami</p>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Booking Section - SAMA SEPERTI SEBELUMNYA */}
            <div className="py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-10"
                    >
                        <div className="inline-flex items-center gap-2 bg-indigo-100 px-4 py-2 rounded-full mb-4">
                            <Calendar size={16} className="text-indigo-600" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Booking Online</span>
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
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
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
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                        value={formData.patient_phone}
                                        onChange={e => setFormData({ ...formData, patient_phone: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            {/* TAMBAHKAN: Alamat dan Jenis Kelamin */}
                            <div className="grid md:grid-cols-2 gap-5">
                                <div className="relative">
                                    <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Alamat Lengkap"
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
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
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium appearance-none cursor-pointer focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
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
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium appearance-none cursor-pointer focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
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
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                        value={formData.appointment_date}
                                        onChange={e => setFormData({ ...formData, appointment_date: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-4 rounded-xl font-bold text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {status.type === 'loading' ? 'Memproses...' : 'Konfirmasi Janji Temu'}
                            </button>

                            {status.msg && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`text-center text-sm font-medium py-3 rounded-xl ${status.type === 'success'
                                        ? 'text-green-600 bg-green-50'
                                        : status.type === 'error'
                                            ? 'text-red-600 bg-red-50'
                                            : 'text-indigo-600 bg-indigo-50'
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
            <div className="bg-slate-900 py-10 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Sparkles size={20} className="text-blue-400" />
                        <span className="text-white font-black text-lg">Nauli<span className="text-blue-400">Dental</span></span>
                    </div>
                    <p className="text-slate-400 text-sm mb-4">
                        Klinik Gigi Modern dengan Teknologi AI • Profesional • Terpercaya
                    </p>
                    <p className="text-slate-500 text-xs">
                        © 2024 Nauli Dental Care. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}