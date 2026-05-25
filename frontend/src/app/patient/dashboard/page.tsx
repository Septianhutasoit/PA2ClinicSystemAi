'use client';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldCheck, Sparkles, ArrowRight, Calendar,
    Clock, Star, Heart, Activity, Phone, User,
    Stethoscope, CheckCircle, MapPin, Home, Layers,
    Building2, Users, Target, ChevronDown, Menu, X,
    PlayCircle, Award, Smile, Zap, Bell,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import api from '@/services/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

/* ─── Navbar ─────────────────────────────────────────────────── */
function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeNav, setActiveNav] = useState('Beranda');

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const navLinks = [
        { label: 'Beranda', icon: Home, href: '#hero' },
        { label: 'Layanan', icon: Stethoscope, href: '#layanan' },
        { label: 'Nauli Dental', icon: Building2, href: '#tentang' },
        { label: 'Tim Kami', icon: Users, href: '#tim' },
        { label: 'Visi & Misi', icon: Target, href: '#visi' },
    ];

    const scrollTo = (href: string, label: string) => {
        setActiveNav(label);
        setMobileOpen(false);
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-white/95 backdrop-blur-md shadow-md shadow-emerald-900/5 border-b border-emerald-100/60'
                : 'bg-black/30 backdrop-blur-sm'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 shrink-0">
                        <div className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center
                                        shadow-lg shadow-emerald-500/20 border border-emerald-100 overflow-hidden">
                            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600
                                            rounded-xl flex items-center justify-center">
                                <Smile size={18} className="text-white" />
                            </div>
                        </div>
                        <div className="leading-none">
                            <p className={`text-base font-black tracking-tighter ${scrolled ? 'text-slate-800' : 'text-white'}`}>
                                Nauli<span className="text-emerald-400">Dental</span>
                            </p>
                            <p className={`text-[9px] font-bold uppercase tracking-[0.2em] ${scrolled ? 'text-slate-400' : 'text-white/60'}`}>
                                Patient Portal
                            </p>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            const isActive = activeNav === link.label;
                            return (
                                <button
                                    key={link.label}
                                    onClick={() => scrollTo(link.href, link.label)}
                                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-bold
                                        transition-all relative group
                                        ${isActive
                                            ? scrolled ? 'text-emerald-600' : 'text-emerald-300'
                                            : scrolled ? 'text-slate-600 hover:text-emerald-600' : 'text-white/80 hover:text-white'
                                        }`}
                                >
                                    <Icon size={13} />
                                    {link.label}
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-underline"
                                            className={`absolute bottom-0 left-4 right-4 h-0.5 rounded-full ${scrolled ? 'bg-emerald-500' : 'bg-emerald-400'}`}
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </nav>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-3">
                        {/* Notif */}
                        <button className={`relative p-2 rounded-xl transition-all ${scrolled
                                ? 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                                : 'text-white/70 hover:text-white hover:bg-white/10'
                            }`}>
                            <Bell size={17} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2
                                             border-white" />
                        </button>

                        {/* Booking CTA */}
                        <button
                            onClick={() => scrollTo('#booking', 'Booking')}
                            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700
                                        text-white text-[11px] font-black uppercase tracking-widest rounded-xl
                                        transition-all shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/50"
                        >
                            <Calendar size={13} /> Booking
                        </button>

                        {/* Profile */}
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl cursor-pointer transition-all
                                        bg-emerald-600 text-white">
                            <div className="w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center
                                            font-black text-xs border border-emerald-400">
                                SA
                            </div>
                            <div className="hidden sm:block leading-none pr-1">
                                <p className="text-[11px] font-black">Septian Adi</p>
                                <p className="text-[8px] text-emerald-200 font-bold">Member Gold</p>
                            </div>
                            <ChevronDown size={12} className="text-emerald-200" />
                        </div>

                        {/* Mobile menu */}
                        <button
                            onClick={() => setMobileOpen(v => !v)}
                            className={`lg:hidden p-2 rounded-xl transition-all ${scrolled ? 'text-slate-600' : 'text-white'}`}
                        >
                            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-white border-t border-emerald-100 shadow-xl"
                    >
                        <div className="px-4 py-3 space-y-1">
                            {navLinks.map(link => {
                                const Icon = link.icon;
                                return (
                                    <button
                                        key={link.label}
                                        onClick={() => scrollTo(link.href, link.label)}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
                                                   text-sm font-bold text-slate-700 hover:bg-emerald-50
                                                   hover:text-emerald-700 transition-all"
                                    >
                                        <Icon size={16} className="text-emerald-600" /> {link.label}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}

/* ─── Stat Badge ─────────────────────────────────────────────── */
function StatBadge({ value, label }: { value: string; label: string }) {
    return (
        <div className="flex flex-col items-center px-5 py-3 bg-white/10 backdrop-blur-sm
                         border border-white/20 rounded-2xl">
            <p className="text-2xl font-black text-white leading-none">{value}</p>
            <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest mt-1">{label}</p>
        </div>
    );
}

/* ─── Main Page ──────────────────────────────────────────────── */
export default function WelcomePage() {
    const router = useRouter();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [doctors, setDoctors] = useState([]);
    const formRef = useRef<HTMLDivElement>(null);

    const [formData, setFormData] = useState({
        patient_name: '',
        patient_phone: '',
        doctor_name: '',
        appointment_date: '',
        patient_address: '',
        patient_gender: '',
    });
    const [status, setStatus] = useState({ type: '', msg: '' });

    const bgImages = [
        '/images/bg/dental-bg-1.png',
        '/images/bg/dental-bg-2.png',
        '/images/bg/dental-bg-3.png',
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % bgImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [bgImages.length]);

    useEffect(() => {
        api.get('/clinic/doctors').then(res => setDoctors(res.data)).catch(() => { });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus({ type: 'loading', msg: 'Memproses pendaftaran...' });
        try {
            await api.post('/clinic/appointments', formData);
            setStatus({ type: 'success', msg: '✅ Berhasil! Jadwal tercatat. Mengalihkan...' });
            setFormData({ patient_name: '', patient_phone: '', doctor_name: '', appointment_date: '', patient_address: '', patient_gender: '' });
            setTimeout(() => {
                setStatus({ type: '', msg: '' });
                router.push('/patient/appointments');
            }, 1500);
        } catch {
            setStatus({ type: 'error', msg: '❌ Gagal mendaftar. Pastikan data sudah benar.' });
            setTimeout(() => setStatus({ type: '', msg: '' }), 3000);
        }
    };

    const features = [
        { icon: Calendar, title: 'Booking Mudah', desc: 'Pilih jadwal & dokter favorit online 24/7', color: '#059669', bg: '#ecfdf5' },
        { icon: Star, title: 'Dokter Ahli', desc: 'Tim dokter gigi spesialis berpengalaman', color: '#0891b2', bg: '#ecfeff' },
        { icon: Activity, title: 'Teknologi Modern', desc: 'Peralatan canggih untuk perawatan terbaik', color: '#7c3aed', bg: '#f5f3ff' },
        { icon: Heart, title: 'Perawatan Nyaman', desc: 'Prosedur minim rasa sakit dengan hasil maksimal', color: '#e11d48', bg: '#fff1f2' },
    ];

    const services = [
        { title: 'Scaling & Pembersihan', desc: 'Bersihkan karang gigi untuk gusi sehat', icon: Sparkles, price: 'Mulai 150k' },
        { title: 'Cabut Gigi', desc: 'Prosedur aman & minim nyeri oleh spesialis', icon: Zap, price: 'Mulai 200k' },
        { title: 'Konsultasi Ortodonti', desc: 'Pemasangan behel gigi & perawatan estetik', icon: Award, price: 'Mulai 500k' },
        { title: 'Tambal & Restorasi', desc: 'Perbaiki gigi rusak dengan material premium', icon: ShieldCheck, price: 'Mulai 300k' },
        { title: 'Veneer & Bleaching', desc: 'Cerahkan & percantik senyum Anda', icon: Smile, price: 'Mulai 1.2jt' },
        { title: 'Perawatan Anak', desc: 'Klinik ramah anak, dokter gigi pediatri', icon: Heart, price: 'Mulai 100k' },
    ];

    return (
        <div className="min-h-screen bg-white font-sans">
            <Navbar />

            {/* ══════════════════════════════════════════
                HERO — fullscreen dengan background slider
            ══════════════════════════════════════════ */}
            <section id="hero" className="relative h-screen w-full flex items-end pb-24 overflow-hidden">

                {/* Background slider */}
                <div className="absolute inset-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentSlide}
                            initial={{ opacity: 0, scale: 1.04 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.2, ease: 'easeInOut' }}
                            className="absolute inset-0 w-full h-full"
                            style={{
                                backgroundImage: `url(${bgImages[currentSlide]})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        />
                    </AnimatePresence>
                    {/* Gradient overlay — gelap di kiri, terang ke kanan */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
                    {/* Bottom fade */}
                    <div className="absolute bottom-0 left-0 right-0 h-40
                                    bg-gradient-to-t from-white/15 to-transparent" />
                </div>

                {/* Hero content */}
                <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 pb-10">
                    <div className="max-w-xl">
                        {/* Brand pill */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="inline-flex items-center gap-2 bg-black/40 backdrop-blur-md
                                        border border-white/20 px-4 py-2 rounded-full mb-6"
                        >
                            <Smile size={13} className="text-emerald-400" />
                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white">
                                Nauli Dental Care
                            </span>
                        </motion.div>

                        {/* Heading */}
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.45, duration: 0.7 }}
                            className="text-4xl sm:text-5xl lg:text-6xl font-black text-white
                                        tracking-tighter leading-[1.1] mb-5"
                        >
                            Senyum Sehat,
                            <br />
                            <span className="text-emerald-400">Masa Depan</span> Cerah
                        </motion.h1>

                        {/* Desc */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="text-white/75 text-sm sm:text-base leading-relaxed mb-8 max-w-md"
                        >
                            Sistem manajemen klinik gigi modern dengan teknologi terkini
                            untuk hasil akurat, aman, dan nyaman bersama tim dokter spesialis kami.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.75 }}
                            className="flex flex-wrap gap-3 mb-10"
                        >
                            <button
                                onClick={() => {
                                    formRef.current?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="flex items-center gap-2 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600
                                            text-white font-black text-sm rounded-2xl transition-all
                                            shadow-xl shadow-emerald-600/40 hover:shadow-emerald-600/60
                                            hover:scale-105 active:scale-95"
                            >
                                <PlayCircle size={18} /> Pilih Layanan
                            </button>
                            <button
                                onClick={() => {
                                    document.querySelector('#layanan')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="flex items-center gap-2 px-6 py-3.5 bg-white/15 hover:bg-white/25
                                            text-white font-bold text-sm rounded-2xl border border-white/30
                                            backdrop-blur-sm transition-all"
                            >
                                Keunggulan <ArrowRight size={16} />
                            </button>
                        </motion.div>

                        {/* Stats row */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9 }}
                            className="flex flex-wrap gap-3"
                        >
                            <StatBadge value="1000+" label="Pasien" />
                            <StatBadge value="8+" label="Dokter Ahli" />
                            <StatBadge value="5★" label="Rating" />
                        </motion.div>
                    </div>
                </div>

                {/* Slide indicators */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                    {bgImages.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentSlide(idx)}
                            className={`transition-all duration-300 rounded-full ${currentSlide === idx ? 'w-8 h-1.5 bg-emerald-400' : 'w-1.5 h-1.5 bg-white/40'
                                }`}
                        />
                    ))}
                </div>

                {/* Scroll indicator */}
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute bottom-8 right-8 z-20 flex flex-col items-center gap-1"
                >
                    <div className="w-5 h-8 border-2 border-white/40 rounded-full flex justify-center pt-1.5">
                        <div className="w-1 h-2 bg-white/70 rounded-full" />
                    </div>
                </motion.div>
            </section>

            {/* ══════════════════════════════════════════
                KEUNGGULAN / FEATURES
            ══════════════════════════════════════════ */}
            <section id="layanan" className="py-24 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-14"
                    >
                        <span className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700
                                          px-4 py-1.5 rounded-full text-[10px] font-black uppercase
                                          tracking-widest border border-emerald-100 mb-4">
                            <Sparkles size={11} /> Keunggulan Kami
                        </span>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter mb-4">
                            Layanan Unggulan Kami
                        </h2>
                        <p className="text-slate-500 max-w-2xl mx-auto text-sm leading-relaxed">
                            Kami menyediakan layanan dental terbaik dengan teknologi modern
                            dan tim dokter berpengalaman
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((item, idx) => {
                            const Icon = item.icon;
                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                                    viewport={{ once: true }}
                                    whileHover={{ y: -6 }}
                                    className="group bg-white rounded-3xl p-7 border border-slate-100
                                                shadow-sm hover:shadow-xl transition-all cursor-default"
                                    style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}
                                >
                                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5
                                                    group-hover:scale-110 transition-transform"
                                        style={{ background: item.bg }}>
                                        <Icon size={24} style={{ color: item.color }} />
                                    </div>
                                    <h3 className="text-base font-black text-slate-800 mb-2">{item.title}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Services Grid */}
                    <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {services.map((svc, idx) => {
                            const Icon = svc.icon;
                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.07 }}
                                    viewport={{ once: true }}
                                    className="flex items-start gap-4 p-5 bg-slate-50/70 rounded-2xl
                                                border border-slate-100 hover:border-emerald-200
                                                hover:bg-emerald-50/40 transition-all group"
                                >
                                    <div className="w-11 h-11 bg-emerald-100 rounded-xl flex items-center
                                                    justify-center shrink-0 group-hover:bg-emerald-600
                                                    group-hover:text-white transition-all">
                                        <Icon size={19} className="text-emerald-600 group-hover:text-white transition-colors" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-black text-slate-800 text-sm mb-0.5">{svc.title}</p>
                                        <p className="text-[11px] text-slate-500 leading-snug mb-2">{svc.desc}</p>
                                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50
                                                          px-2 py-0.5 rounded-full border border-emerald-100">
                                            {svc.price}
                                        </span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                TENTANG / ABOUT
            ══════════════════════════════════════════ */}
            <section id="tentang" className="py-24 px-6 bg-slate-50">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <span className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700
                                              px-4 py-1.5 rounded-full text-[10px] font-black uppercase
                                              tracking-widest mb-5">
                                <Heart size={11} /> Tentang Kami
                            </span>
                            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter mb-5 leading-tight">
                                Klinik Gigi Modern<br />
                                dengan <span className="text-emerald-600">Teknologi AI</span>
                            </h2>
                            <p className="text-slate-500 mb-4 leading-relaxed text-sm">
                                Nauli Dental hadir sebagai solusi kesehatan gigi modern yang menggabungkan
                                teknologi AI dengan pelayanan profesional. Kami berkomitmen memberikan
                                pengalaman perawatan gigi yang nyaman, cepat, dan terjangkau.
                            </p>
                            <p className="text-slate-500 leading-relaxed text-sm mb-8">
                                Dengan tim dokter spesialis berpengalaman dan peralatan canggih,
                                kami siap membantu Anda mendapatkan senyum sehat dan percaya diri.
                            </p>

                            {/* Trust badges */}
                            <div className="flex flex-wrap gap-3">
                                {[
                                    { icon: ShieldCheck, text: 'Berlisensi Resmi' },
                                    { icon: Award, text: 'Dokter Bersertifikat' },
                                    { icon: CheckCircle, text: 'ISO Certified' },
                                ].map((badge, i) => {
                                    const Icon = badge.icon;
                                    return (
                                        <div key={i} className="flex items-center gap-2 px-3 py-2 bg-white
                                                                   rounded-xl border border-slate-100 shadow-sm">
                                            <Icon size={14} className="text-emerald-600" />
                                            <span className="text-[11px] font-bold text-slate-700">{badge.text}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            {/* Main card */}
                            <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800
                                             rounded-[2rem] p-10 text-white text-center relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full
                                                 -translate-y-1/2 translate-x-1/2" />
                                <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-400/20 rounded-full
                                                 translate-y-1/2 -translate-x-1/2" />
                                <div className="relative z-10">
                                    <ShieldCheck size={52} className="mx-auto mb-5 text-emerald-300" />
                                    <h3 className="text-2xl font-black mb-3 tracking-tight">
                                        Terpercaya & Profesional
                                    </h3>
                                    <p className="text-emerald-100 text-sm leading-relaxed mb-6">
                                        Lebih dari 1000+ pasien telah mempercayakan senyum mereka kepada kami
                                    </p>
                                    <div className="grid grid-cols-3 gap-4">
                                        {[
                                            { v: '1000+', l: 'Pasien' },
                                            { v: '8+', l: 'Dokter' },
                                            { v: '10thn', l: 'Pengalaman' },
                                        ].map((s, i) => (
                                            <div key={i} className="bg-white/15 rounded-2xl p-3 border border-white/20">
                                                <p className="text-xl font-black text-white">{s.v}</p>
                                                <p className="text-[9px] text-emerald-200 font-bold uppercase tracking-widest">
                                                    {s.l}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                BOOKING FORM
            ══════════════════════════════════════════ */}
            <section id="booking" className="py-24 px-6 bg-white">
                <div className="max-w-4xl mx-auto" ref={formRef}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <span className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700
                                          px-4 py-1.5 rounded-full text-[10px] font-black uppercase
                                          tracking-widest border border-emerald-100 mb-4">
                            <Calendar size={11} /> Booking Online
                        </span>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter mb-4">
                            Buat Janji Temu Sekarang
                        </h2>
                        <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
                            Isi formulir di bawah untuk melakukan reservasi. Kami akan menghubungi Anda
                            untuk konfirmasi dalam waktu singkat.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/80
                                    border border-slate-100 p-8 md:p-10"
                    >
                        {/* Form header */}
                        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
                            <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center
                                             justify-center shadow-lg shadow-emerald-600/30">
                                <Calendar size={22} className="text-white" />
                            </div>
                            <div>
                                <p className="font-black text-slate-800 text-base">Form Pendaftaran Pasien</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                                    Semua data dienkripsi & aman
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Nama + Telepon */}
                            <div className="grid md:grid-cols-2 gap-5">
                                <div className="relative">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">
                                        Nama Lengkap
                                    </label>
                                    <div className="relative">
                                        <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Nama pasien"
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200
                                                        text-sm font-medium focus:ring-2 focus:ring-emerald-500
                                                        focus:border-emerald-400 outline-none transition-all"
                                            value={formData.patient_name}
                                            onChange={e => setFormData({ ...formData, patient_name: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="relative">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">
                                        Nomor WhatsApp
                                    </label>
                                    <div className="relative">
                                        <Phone size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="08xxxxxxxxxx"
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200
                                                        text-sm font-medium focus:ring-2 focus:ring-emerald-500
                                                        focus:border-emerald-400 outline-none transition-all"
                                            value={formData.patient_phone}
                                            onChange={e => setFormData({ ...formData, patient_phone: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Alamat + Gender */}
                            <div className="grid md:grid-cols-2 gap-5">
                                <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">
                                        Alamat Lengkap
                                    </label>
                                    <div className="relative">
                                        <MapPin size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Jl. ..."
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200
                                                        text-sm font-medium focus:ring-2 focus:ring-emerald-500
                                                        focus:border-emerald-400 outline-none transition-all"
                                            value={formData.patient_address}
                                            onChange={e => setFormData({ ...formData, patient_address: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">
                                        Jenis Kelamin
                                    </label>
                                    <div className="relative">
                                        <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
                                        <select
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200
                                                        text-sm font-medium appearance-none cursor-pointer focus:ring-2
                                                        focus:ring-emerald-500 focus:border-emerald-400 outline-none transition-all"
                                            value={formData.patient_gender}
                                            onChange={e => setFormData({ ...formData, patient_gender: e.target.value })}
                                            required
                                        >
                                            <option value="">-- Pilih Jenis Kelamin --</option>
                                            <option value="Laki-laki">Laki-laki</option>
                                            <option value="Perempuan">Perempuan</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Dokter + Jadwal */}
                            <div className="grid md:grid-cols-2 gap-5">
                                <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">
                                        Pilih Dokter
                                    </label>
                                    <div className="relative">
                                        <Stethoscope size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
                                        <select
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200
                                                        text-sm font-medium appearance-none cursor-pointer focus:ring-2
                                                        focus:ring-emerald-500 focus:border-emerald-400 outline-none transition-all"
                                            value={formData.doctor_name}
                                            onChange={e => setFormData({ ...formData, doctor_name: e.target.value })}
                                            required
                                        >
                                            <option value="">-- Pilih Dokter Spesialis --</option>
                                            {doctors.map((d: any) => (
                                                <option key={d.id} value={d.name}>{d.name} - {d.specialty}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">
                                        Tanggal & Waktu
                                    </label>
                                    <div className="relative">
                                        <Clock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="datetime-local"
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200
                                                        text-sm font-medium focus:ring-2 focus:ring-emerald-500
                                                        focus:border-emerald-400 outline-none transition-all"
                                            value={formData.appointment_date}
                                            onChange={e => setFormData({ ...formData, appointment_date: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={status.type === 'loading'}
                                className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl
                                            font-black text-sm uppercase tracking-widest text-white
                                            bg-gradient-to-r from-emerald-600 to-teal-600
                                            hover:from-emerald-700 hover:to-teal-700
                                            transition-all shadow-xl shadow-emerald-600/30
                                            hover:shadow-emerald-600/50 hover:scale-[1.01]
                                            active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {status.type === 'loading' ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Memproses...
                                    </>
                                ) : (
                                    <>
                                        <Calendar size={17} /> Konfirmasi Janji Temu
                                    </>
                                )}
                            </button>

                            {/* Status message */}
                            <AnimatePresence>
                                {status.msg && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -8 }}
                                        className={`text-center text-sm font-bold py-3.5 rounded-2xl ${status.type === 'success'
                                                ? 'text-emerald-700 bg-emerald-50 border border-emerald-100'
                                                : status.type === 'error'
                                                    ? 'text-red-600 bg-red-50 border border-red-100'
                                                    : 'text-emerald-700 bg-emerald-50'
                                            }`}
                                    >
                                        {status.msg}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </form>

                        {/* Trust footer */}
                        <div className="mt-7 pt-6 border-t border-slate-100 flex flex-wrap items-center
                                         justify-center gap-5 text-[11px] text-slate-400 font-bold">
                            <span className="flex items-center gap-1.5"><ShieldCheck size={13} className="text-emerald-500" /> Data Terenkripsi</span>
                            <span className="w-1 h-1 rounded-full bg-slate-200" />
                            <span className="flex items-center gap-1.5"><Heart size={13} className="text-rose-400" /> Gratis Konsultasi Awal</span>
                            <span className="w-1 h-1 rounded-full bg-slate-200" />
                            <span className="flex items-center gap-1.5"><CheckCircle size={13} className="text-emerald-500" /> Konfirmasi Cepat</span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                FOOTER
            ══════════════════════════════════════════ */}
            <footer className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 pt-16 pb-8 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-12 mb-12">
                        {/* Brand */}
                        <div>
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-11 h-11 bg-emerald-600 rounded-2xl flex items-center
                                                 justify-center shadow-lg shadow-emerald-600/40">
                                    <Smile size={20} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-white font-black text-lg tracking-tighter">
                                        Nauli<span className="text-emerald-400">Dental</span>
                                    </p>
                                    <p className="text-[9px] text-emerald-400/70 font-bold uppercase tracking-widest">
                                        Patient Portal
                                    </p>
                                </div>
                            </div>
                            <p className="text-slate-400 text-sm leading-relaxed mb-5">
                                Klinik gigi modern dengan teknologi AI Automation untuk pengalaman
                                perawatan yang lebih nyaman dan efisien.
                            </p>
                            <div className="flex gap-2">
                                {['FB', 'IG', 'TW', 'YT'].map(s => (
                                    <div key={s} className="w-9 h-9 bg-white/5 hover:bg-emerald-600
                                                             border border-white/10 rounded-xl flex items-center
                                                             justify-center text-[10px] font-black text-slate-400
                                                             hover:text-white cursor-pointer transition-all">
                                        {s}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-5">
                                Navigasi
                            </p>
                            <div className="space-y-2.5">
                                {[
                                    { label: 'Beranda', href: '#hero' },
                                    { label: 'Layanan', href: '#layanan' },
                                    { label: 'Tentang Kami', href: '#tentang' },
                                    { label: 'Booking', href: '#booking' },
                                ].map(link => (
                                    <button
                                        key={link.label}
                                        onClick={() => document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' })}
                                        className="flex items-center gap-2 text-slate-400 hover:text-emerald-400
                                                    text-sm font-medium transition-colors group"
                                    >
                                        <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-2
                                                                           group-hover:translate-x-0 transition-all" />
                                        {link.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Contact */}
                        <div>
                            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-5">
                                Kontak
                            </p>
                            <div className="space-y-3">
                                {[
                                    { icon: MapPin, text: 'Jl. Contoh No. 123, Medan, Sumatera Utara' },
                                    { icon: Phone, text: '+62 812-3456-7890' },
                                    { icon: Clock, text: 'Senin – Sabtu, 08.00 – 21.00 WIB' },
                                ].map((c, i) => {
                                    const Icon = c.icon;
                                    return (
                                        <div key={i} className="flex items-start gap-3 text-slate-400 text-sm">
                                            <Icon size={15} className="text-emerald-500 mt-0.5 shrink-0" />
                                            <span className="leading-snug">{c.text}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Bottom bar */}
                    <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center
                                     justify-between gap-4">
                        <p className="text-slate-500 text-xs">
                            © 2024 Nauli Dental Care. All rights reserved.
                        </p>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                            <button className="hover:text-emerald-400 transition-colors">Kebijakan Privasi</button>
                            <span>·</span>
                            <button className="hover:text-emerald-400 transition-colors">Syarat & Ketentuan</button>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}