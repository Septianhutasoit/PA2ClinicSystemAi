'use client';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldCheck, Sparkles, ArrowRight, UserPlus, LogIn,
    Calendar, Clock, Star, Heart, Smile, ChevronRight,
    Activity, ChevronLeft, Menu, X, Phone, User, Stethoscope
} from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '@/services/api';

export default function WelcomePage() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const [formData, setFormData] = useState({
        patient_name: '',
        patient_phone: '',
        doctor_name: '',
        appointment_date: ''
    });
    const [status, setStatus] = useState({ type: '', msg: '' });

    // Background images array
    const bgImages = [
        '/images/bg/dental-bg-1.png',
        '/images/bg/dental-bg-2.png',
        '/images/bg/dental-bg-3.png',
    ];

    // Auto slide background
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % bgImages.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [bgImages.length]);

    // Scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Fetch doctors
    useEffect(() => {
        api.get('/clinic/doctors').then(res => setDoctors(res.data)).catch(() => { });
    }, []);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % bgImages.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + bgImages.length) % bgImages.length);

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

    const navLinks = [
        { name: 'Beranda', href: '#home' },
        { name: 'Layanan', href: '#services' },
        { name: 'Dokter', href: '#doctors' },
        { name: 'Tentang', href: '#about' },
    ];

    return (
        <div className="min-h-screen relative">

            {/* Background Slider Fullscreen */}
            <div className="fixed inset-0 w-full h-full -z-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="absolute inset-0 w-full h-full"
                        style={{
                            backgroundImage: `url(${bgImages[currentSlide]})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                        }}
                    >
                        <div className={`absolute inset-0 transition-all duration-700 ${isScrolled
                                ? 'bg-gradient-to-b from-slate-900/95 via-indigo-900/90 to-slate-900/95'
                                : 'bg-gradient-to-b from-slate-900/80 via-indigo-900/70 to-slate-900/80'
                            }`} />
                    </motion.div>
                </AnimatePresence>

                {/* Slide Controls */}
                <button
                    onClick={prevSlide}
                    className="absolute left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
                >
                    <ChevronLeft size={20} />
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
                >
                    <ChevronRight size={20} />
                </button>

                {/* Slide Indicators */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
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

            {/* Navbar dengan efek blur */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                className={`fixed top-0 w-full z-40 transition-all duration-500 ${isScrolled
                        ? 'bg-white/10 backdrop-blur-xl border-b border-white/10 py-3'
                        : 'bg-transparent py-5'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Sparkles size={16} className="text-white" />
                        </div>
                        <span className="text-lg font-black tracking-tighter text-white">
                            Nauli<span className="text-blue-400">Dental</span>
                        </span>
                    </Link>

                    <div className="hidden lg:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-[12px] font-medium text-white/70 hover:text-white transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href="/login">
                            <button className="text-white/80 hover:text-white text-xs font-medium transition-colors">
                                Login
                            </button>
                        </Link>
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-all"
                        >
                            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>

                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="lg:hidden bg-white/10 backdrop-blur-xl border-t border-white/10 mt-3"
                        >
                            <div className="px-6 py-3 space-y-1">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block py-2 text-white/80 hover:text-white transition-colors text-sm"
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            {/* Hero Section dengan Form Booking */}
            <div className="relative z-10 min-h-screen flex items-center justify-center px-6 pt-20">
                <div className="max-w-6xl mx-auto w-full">

                    {/* Left Side - Info Text */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center lg:text-left mb-8 lg:mb-0"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full mb-4"
                        >
                            <Sparkles size={12} className="text-blue-400" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/90">Nauli Dental AI</span>
                        </motion.div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-[1.1] mb-4">
                            Senyum Sehat,
                            <br />
                            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                                Masa Depan Cerah
                            </span>
                        </h1>

                        <p className="text-white/70 text-base max-w-lg mx-auto lg:mx-0">
                            Sistem manajemen klinik gigi modern dengan teknologi AI untuk pengalaman perawatan yang lebih nyaman dan efisien.
                        </p>
                    </motion.div>

                    {/* Right Side - Form Booking */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl max-w-md mx-auto lg:mx-0 lg:ml-auto"
                    >
                        <div className="flex items-center gap-2 mb-5">
                            <Calendar size={18} className="text-blue-400" />
                            <h3 className="text-white font-bold text-sm uppercase tracking-wider">Pendaftaran Online</h3>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div className="relative">
                                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Nama Lengkap"
                                    className="w-full pl-9 pr-3 py-2.5 bg-white/90 backdrop-blur-sm rounded-xl border border-white/20 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    value={formData.patient_name}
                                    onChange={e => setFormData({ ...formData, patient_name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="relative">
                                <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="WhatsApp (08...)"
                                    className="w-full pl-9 pr-3 py-2.5 bg-white/90 backdrop-blur-sm rounded-xl border border-white/20 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    value={formData.patient_phone}
                                    onChange={e => setFormData({ ...formData, patient_phone: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="relative">
                                <Stethoscope size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
                                <select
                                    className="w-full pl-9 pr-3 py-2.5 bg-white/90 backdrop-blur-sm rounded-xl border border-white/20 text-sm font-medium appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    value={formData.doctor_name}
                                    onChange={e => setFormData({ ...formData, doctor_name: e.target.value })}
                                    required
                                >
                                    <option value="">-- Pilih Dokter --</option>
                                    {doctors.map((d: any) => <option key={d.id} value={d.name}>{d.name} ({d.specialty})</option>)}
                                </select>
                            </div>

                            <div className="relative">
                                <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="datetime-local"
                                    className="w-full pl-9 pr-3 py-2.5 bg-white/90 backdrop-blur-sm rounded-xl border border-white/20 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    value={formData.appointment_date}
                                    onChange={e => setFormData({ ...formData, appointment_date: e.target.value })}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all"
                            >
                                Buat Janji Temu
                            </button>

                            {status.msg && (
                                <p className={`text-center text-[10px] font-bold py-1 rounded-lg ${status.type === 'success' ? 'text-green-400' :
                                        status.type === 'error' ? 'text-red-400' : 'text-blue-400'
                                    }`}>
                                    {status.msg}
                                </p>
                            )}
                        </form>

                        {/* Info Tambahan */}
                        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-center gap-3 text-[10px] text-white/50">
                            <span className="flex items-center gap-1"><ShieldCheck size={10} /> Data Terenkripsi</span>
                            <span className="w-1 h-1 rounded-full bg-white/30" />
                            <span className="flex items-center gap-1"><Heart size={10} /> Gratis Konsultasi</span>
                        </div>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
                >
                    <span className="text-[8px] font-bold text-white/40 uppercase tracking-wider">Scroll</span>
                    <div className="w-5 h-8 border border-white/20 rounded-full flex justify-center">
                        <motion.div
                            animate={{ y: [0, 12, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="w-1 h-2 bg-white/30 rounded-full mt-2"
                        />
                    </div>
                </motion.div>
            </div>

            {/* Content Section Below */}
            <div className="relative z-10 bg-white rounded-t-3xl mt-10 px-6 py-12">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { icon: <Calendar size={20} />, title: 'Booking Mudah', desc: 'Pilih jadwal & dokter favorit online 24/7' },
                            { icon: <Star size={20} />, title: 'Dokter Ahli', desc: 'Tim dokter gigi spesialis berpengalaman' },
                            { icon: <Activity size={20} />, title: 'Teknologi Modern', desc: 'Peralatan canggih untuk perawatan terbaik' },
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className="text-center p-5"
                            >
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white mx-auto mb-3">
                                    {item.icon}
                                </div>
                                <h3 className="text-sm font-black text-slate-800 mb-1">{item.title}</h3>
                                <p className="text-xs text-slate-500">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}