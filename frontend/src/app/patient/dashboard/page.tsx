'use client';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
    ShieldCheck, Sparkles, ArrowRight, Calendar,
    Clock, Star, Heart, Activity, Phone, User,
    Stethoscope, CheckCircle, MapPin, Mail, Play,
    Award, Users, Zap, Shield, ChevronRight,
    Quote, BadgeCheck, Microscope, Smile, HeartPulse
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import api from '@/services/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// ── Fade-up helper ────────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 32 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay },
});
const fadeLeft = (delay = 0) => ({
    initial: { opacity: 0, x: -32 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true },
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay },
});
const fadeRight = (delay = 0) => ({
    initial: { opacity: 0, x: 32 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true },
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay },
});

export default function WelcomePage() {
    const router = useRouter();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [doctors, setDoctors] = useState([]);
    const [formData, setFormData] = useState({
        patient_name: '', patient_phone: '', doctor_name: '',
        appointment_date: '', patient_address: '', patient_gender: ''
    });
    const [status, setStatus] = useState({ type: '', msg: '' });
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
    const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

    const bgImages = [
        '/images/bg/dental-bg-1.png',
        '/images/bg/dental-bg-2.png',
        '/images/bg/dental-bg-3.png',
    ];

    useEffect(() => {
        const t = setInterval(() => setCurrentSlide(p => (p + 1) % bgImages.length), 5000);
        return () => clearInterval(t);
    }, []);

    useEffect(() => {
        api.get('/clinic/doctors').then(r => setDoctors(r.data)).catch(() => { });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus({ type: 'loading', msg: 'Memproses...' });
        try {
            await api.post('/clinic/appointments', formData);
            setStatus({ type: 'success', msg: '✅ Berhasil! Jadwal tercatat. Mengalihkan...' });
            setFormData({ patient_name: '', patient_phone: '', doctor_name: '', appointment_date: '', patient_address: '', patient_gender: '' });
            setTimeout(() => { setStatus({ type: '', msg: '' }); router.push('/patient/appointments'); }, 1500);
        } catch {
            setStatus({ type: 'error', msg: '❌ Gagal mendaftar. Pastikan data sudah benar.' });
            setTimeout(() => setStatus({ type: '', msg: '' }), 3000);
        }
    };

    const features = [
        { icon: Zap, title: 'Teknologi AI', desc: 'Diagnosis akurat berbasis kecerdasan buatan terdepan untuk hasil perawatan optimal', color: 'from-emerald-500 to-teal-600' },
        { icon: Star, title: 'Dokter Spesialis', desc: 'Tim dokter gigi berpengalaman dan bersertifikat siap memberikan yang terbaik', color: 'from-teal-500 to-emerald-600' },
        { icon: Shield, title: 'Steril & Aman', desc: 'Alat sterilisasi berstandar internasional dengan prosedur keamanan ketat', color: 'from-emerald-600 to-green-600' },
        { icon: Heart, title: 'Perawatan Nyaman', desc: 'Prosedur minim rasa sakit dengan pengalaman yang menyenangkan bagi semua usia', color: 'from-green-500 to-teal-500' },
        { icon: Calendar, title: 'Booking 24/7', desc: 'Reservasi kapan saja dan dari mana saja lewat website atau WhatsApp kami', color: 'from-teal-600 to-emerald-500' },
        { icon: Award, title: 'Bersertifikat', desc: 'Diakui secara resmi dan memenuhi standar pelayanan kesehatan gigi nasional', color: 'from-emerald-500 to-green-500' },
    ];

    const services = [
        { title: 'Scaling & Pembersihan', img: '/images/layanan.jpg', desc: 'Bersihkan karang gigi dan noda membandel secara menyeluruh' },
        { title: 'Tambal Gigi', img: '/images/doctors.jpg', desc: 'Restorasi gigi berlubang dengan material berkualitas tinggi' },
        { title: 'Behel Gigi', img: '/images/about.jpg', desc: 'Rapikan gigi dengan teknologi orthodonti terkini' },
        { title: 'Cabut Gigi', img: '/images/layanan.jpg', desc: 'Pencabutan nyaman dan minim rasa sakit oleh dokter ahli' },
        { title: 'Veneer Gigi', img: '/images/doctors.jpg', desc: 'Tampilan gigi putih bersih dan senyum sempurna impian Anda' },
        { title: 'Implant Gigi', img: '/images/about.jpg', desc: 'Solusi permanen pengganti gigi yang hilang dan nyaman' },
    ];

    const testimonials = [
        { name: 'Rina Simatupang', role: 'Guru, Balige', rating: 5, text: 'Pelayanannya sangat ramah dan profesional. Dokternya sabar menjelaskan setiap prosedur. Saya tidak merasa takut sama sekali!' },
        { name: 'Budi Manullang', role: 'Pengusaha, Toba', rating: 5, text: 'Sudah 3 tahun jadi pasien di sini. Scaling rutin tiap 6 bulan, hasilnya selalu memuaskan. Recommended banget!' },
        { name: 'Sari Situmorang', role: 'Mahasiswa, Medan', rating: 5, text: 'Pasang behel di sini proses cepatnya luar biasa. Dokternya teliti dan hasil akhirnya melebihi ekspektasi saya.' },
    ];

    const stats = [
        { value: '1.500+', label: 'Pasien Puas', icon: Users },
        { value: '15+', label: 'Dokter Spesialis', icon: Stethoscope },
        { value: '24/7', label: 'Layanan Darurat', icon: HeartPulse },
        { value: '98%', label: 'Tingkat Kepuasan', icon: Smile },
    ];

    const schedules = [
        { day: 'Senin – Kamis', time: '10.00 – 19.00' },
        { day: 'Jumat', time: '10.00 – 19.00' },
        { day: 'Sabtu', time: '10.00 – 17.00' },
        { day: 'Minggu', time: 'Tutup', closed: true },
    ];

    return (
        <div className="min-h-screen bg-white overflow-x-hidden">

            {/* ══ HERO ══════════════════════════════════════════════════════ */}
            <div ref={heroRef} className="relative h-screen w-full overflow-hidden">
                {/* Parallax bg */}
                <motion.div style={{ y: heroY }} className="absolute inset-0 w-full h-[120%]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentSlide}
                            initial={{ opacity: 0, scale: 1.05 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.5, ease: 'easeInOut' }}
                            className="absolute inset-0 w-full h-full"
                            style={{
                                backgroundImage: `url(${bgImages[currentSlide]})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        />
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/10" />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-90" />
                    <div className="absolute bottom-0 left-0 right-0 h-56 bg-gradient-to-t from-white to-transparent" />
                </motion.div>

                {/* Hero content */}
                <motion.div style={{ opacity: heroOpacity }}
                    className="relative z-10 h-full flex items-center px-6 sm:px-10 lg:px-20">
                    <div className="max-w-7xl mx-auto w-full">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                            className="max-w-2xl space-y-6"
                        >
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-md
                                           border border-emerald-400/30 px-4 py-2 rounded-full"
                            >
                                <Sparkles size={12} className="text-emerald-400" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-white">
                                    Nauli Dental Care · Est. 2024
                                </span>
                            </motion.div>

                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white
                                           tracking-tighter leading-[0.95]">
                                Senyum Sehat,<br />
                                <span className="bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
                                    Masa Depan<br />Cerah
                                </span>
                            </h1>

                            <p className="text-white/80 text-base sm:text-lg max-w-lg leading-relaxed font-medium">
                                Klinik gigi modern berbasis AI di Balige — menghadirkan perawatan
                                akurat, aman, dan nyaman untuk seluruh keluarga Anda.
                            </p>

                            <div className="flex flex-wrap gap-3 pt-2">
                                <Link href="/patient/services">
                                    <motion.button
                                        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                                        className="flex items-center gap-2.5 bg-emerald-500 hover:bg-emerald-600
                                                   text-white px-7 py-3.5 rounded-2xl font-bold text-sm
                                                   shadow-xl shadow-emerald-900/25 transition-all active:scale-95"
                                    >
                                        <Play size={16} fill="currentColor" /> Pilih Layanan
                                    </motion.button>
                                </Link>
                                <a href="#keunggulan">
                                    <motion.button
                                        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                                        className="flex items-center gap-2 bg-white/12 hover:bg-white/22
                                                   backdrop-blur-md text-white border border-white/25
                                                   px-7 py-3.5 rounded-2xl font-bold text-sm transition-all"
                                    >
                                        Keunggulan Kami <ArrowRight size={16} />
                                    </motion.button>
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Scroll indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 hidden lg:block">
                    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1.5">
                        <motion.div
                            animate={{ y: [0, 14, 0] }}
                            transition={{ repeat: Infinity, duration: 1.6 }}
                            className="w-1.5 h-1.5 bg-emerald-400 rounded-full"
                        />
                    </div>
                </div>

                {/* Slide dots */}
                <div className="absolute bottom-10 left-10 z-20 flex gap-2">
                    {bgImages.map((_, i) => (
                        <button key={i} onClick={() => setCurrentSlide(i)}
                            className={`transition-all duration-500 rounded-full
                                ${i === currentSlide ? 'w-8 h-1.5 bg-emerald-500' : 'w-1.5 h-1.5 bg-white/40'}`}
                        />
                    ))}
                </div>
            </div>

            {/* ══ STATS STRIP ═══════════════════════════════════════════════ */}
            <div className="relative z-10 -mt-12 px-6 sm:px-10 max-w-7xl mx-auto pb-16">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((s, i) => {
                        const Icon = s.icon;
                        return (
                            <motion.div
                                key={i}
                                {...fadeUp(i * 0.08)}
                                className="bg-white rounded-2xl border border-emerald-100 shadow-xl
                                           shadow-emerald-900/8 p-5 text-center hover:shadow-2xl
                                           hover:-translate-y-1 transition-all group"
                            >
                                <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-xl
                                                flex items-center justify-center mx-auto mb-3
                                                group-hover:scale-110 transition-transform">
                                    <Icon size={20} />
                                </div>
                                <p className="text-2xl font-black text-slate-900">{s.value}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                                    {s.label}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* ══ KEUNGGULAN ════════════════════════════════════════════════ */}
            <section id="keunggulan" className="py-24 px-6 sm:px-10 bg-white">
                <div className="max-w-7xl mx-auto">
                    <motion.div {...fadeLeft()} className="mb-14">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-1.5 h-7 bg-emerald-500 rounded-full" />
                            <span className="text-emerald-600 font-black text-xs uppercase tracking-widest">
                                Mengapa Memilih Kami
                            </span>
                        </div>
                        <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                            Keunggulan <span className="text-emerald-600">Layanan</span> Kami
                        </h2>
                        <p className="text-slate-500 mt-3 text-lg max-w-xl leading-relaxed">
                            Kami menggabungkan teknologi terdepan dengan sentuhan pelayanan penuh ketulusan
                            untuk memberikan pengalaman terbaik bagi setiap pasien.
                        </p>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((f, i) => {
                            const Icon = f.icon;
                            return (
                                <motion.div
                                    key={i}
                                    {...fadeUp(i * 0.07)}
                                    className="bg-gradient-to-br from-slate-50 to-white rounded-3xl p-7
                                               border border-emerald-100 hover:shadow-xl hover:border-emerald-200
                                               hover:-translate-y-1.5 transition-all group"
                                >
                                    <div className={`w-14 h-14 bg-gradient-to-br ${f.color} rounded-2xl
                                                    flex items-center justify-center text-white mb-5
                                                    group-hover:scale-110 transition-transform shadow-lg`}>
                                        <Icon size={24} />
                                    </div>
                                    <h3 className="text-lg font-black text-slate-800 mb-2">{f.title}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ══ TENTANG — 2 KOLOM ═════════════════════════════════════════ */}
            <section className="py-24 px-6 sm:px-10 bg-slate-50">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">

                        {/* Kiri: gambar grid */}
                        <motion.div {...fadeLeft()} className="relative">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <div className="rounded-3xl overflow-hidden h-52 shadow-xl">
                                        <img src="/images/layanan.jpg" alt="Klinik" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                                    </div>
                                    <div className="rounded-3xl overflow-hidden h-36 shadow-lg">
                                        <img src="/images/about.jpg" alt="Perawatan" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                                    </div>
                                </div>
                                <div className="space-y-4 pt-8">
                                    <div className="rounded-3xl overflow-hidden h-36 shadow-lg">
                                        <img src="/images/doctors.jpg" alt="Dokter" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                                    </div>
                                    <div className="rounded-3xl overflow-hidden h-52 shadow-xl">
                                        <img src="/images/layanan.jpg" alt="Fasilitas" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                                    </div>
                                </div>
                            </div>
                            {/* Floating badge */}
                            <motion.div
                                animate={{ y: [0, -8, 0] }}
                                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                                className="absolute -bottom-4 -right-4 bg-emerald-600 text-white
                                           rounded-2xl px-5 py-3 shadow-xl border-4 border-white"
                            >
                                <p className="text-xs font-black uppercase tracking-wider">Est. 2024</p>
                                <p className="text-2xl font-black">Balige</p>
                            </motion.div>
                        </motion.div>

                        {/* Kanan: teks */}
                        <motion.div {...fadeRight()} className="space-y-6">
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-1.5 h-7 bg-emerald-500 rounded-full" />
                                    <span className="text-emerald-600 font-black text-xs uppercase tracking-widest">Tentang Kami</span>
                                </div>
                                <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
                                    Klinik Gigi Modern<br />
                                    <span className="text-emerald-600">Berbasis Teknologi AI</span>
                                </h2>
                            </div>

                            <p className="text-slate-500 leading-relaxed">
                                Nauli Dental Care hadir sebagai solusi perawatan gigi modern di Balige, Kabupaten Toba.
                                Kami menggabungkan kecerdasan buatan dengan keahlian dokter spesialis untuk menghadirkan
                                diagnosis yang akurat dan perawatan yang efektif.
                            </p>
                            <p className="text-slate-500 leading-relaxed">
                                Berlokasi strategis di jantung kota Balige, kami melayani pasien dari berbagai penjuru
                                Sumatera Utara dengan dedikasi penuh dan standar internasional. Setiap kunjungan Anda
                                adalah prioritas utama kami.
                            </p>

                            <div className="grid grid-cols-2 gap-3 pt-2">
                                {[
                                    'Tim dokter bersertifikat nasional',
                                    'Peralatan canggih & steril',
                                    'Layanan darurat 24 jam',
                                    'BPJS Kesehatan diterima',
                                    'Konsultasi gratis pertama',
                                    'Garansi kepuasan pasien',
                                ].map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -8 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.05 }}
                                        className="flex items-center gap-2.5"
                                    >
                                        <CheckCircle size={14} className="text-emerald-500 shrink-0" />
                                        <span className="text-sm font-medium text-slate-700">{item}</span>
                                    </motion.div>
                                ))}
                            </div>

                            <Link href="/patient/about">
                                <motion.button
                                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700
                                               text-white px-7 py-3.5 rounded-2xl font-bold text-sm
                                               shadow-lg shadow-emerald-200 transition-all mt-2"
                                >
                                    Pelajari Lebih Lanjut <ArrowRight size={15} />
                                </motion.button>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ══ BOOKING SECTION ═══════════════════════════════════════════ */}
            <section id="booking" className="py-24 px-6 sm:px-10 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-start">

                        {/* Kiri: Info + Jadwal */}
                        <motion.div {...fadeLeft()} className="space-y-8">
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-1.5 h-7 bg-emerald-500 rounded-full" />
                                    <span className="text-emerald-600 font-black text-xs uppercase tracking-widest">Booking Online</span>
                                </div>
                                <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
                                    Reservasi Online<br />
                                    <span className="text-emerald-600">Cepat & Mudah</span>
                                </h2>
                                <p className="text-slate-500 mt-3 leading-relaxed">
                                    Isi formulir di sebelah kanan dan kami akan mengkonfirmasi jadwal Anda
                                    melalui WhatsApp dalam waktu singkat. Tanggal dan waktu reservasi
                                    menyesuaikan dengan jadwal dokter yang masih tersedia.
                                </p>
                            </div>

                            {/* Waktu Praktek */}
                            <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-7">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                                        <Clock size={18} />
                                    </div>
                                    <h3 className="font-black text-emerald-900 text-base">Waktu Praktek</h3>
                                </div>
                                <div className="space-y-0 divide-y divide-emerald-100">
                                    {schedules.map((s, i) => (
                                        <div key={i} className="flex items-center justify-between py-3">
                                            <span className="text-sm font-semibold text-slate-700">{s.day}</span>
                                            <span className={`text-sm font-bold ${s.closed ? 'text-red-500' : 'text-emerald-700'}`}>
                                                {s.time}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs text-slate-400 mt-4 leading-relaxed">
                                    Kami akan mengkonfirmasi ulang terkait jadwal reservasi pasien.
                                </p>
                            </div>

                            {/* Kontak */}
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { icon: Phone, label: 'WhatsApp', value: '0812-6530-965', color: 'text-emerald-600 bg-emerald-50' },
                                    { icon: MapPin, label: 'Lokasi', value: 'Balige, Kab. Toba, Sumut', color: 'text-teal-600 bg-teal-50' },
                                ].map((c, i) => {
                                    const Icon = c.icon;
                                    return (
                                        <div key={i} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                                            <div className={`w-9 h-9 ${c.color} rounded-xl flex items-center justify-center mb-3`}>
                                                <Icon size={15} />
                                            </div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{c.label}</p>
                                            <p className="text-sm font-bold text-slate-700 mt-0.5">{c.value}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>

                        {/* Kanan: Form */}
                        <motion.div {...fadeRight()}>
                            <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/60
                                            border border-slate-100 overflow-hidden">
                                {/* Form header */}
                                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                            <Calendar size={18} className="text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-black text-base">Buat Janji Temu</h3>
                                            <p className="text-emerald-200 text-xs font-medium">Isi formulir di bawah ini</p>
                                        </div>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="p-8 space-y-4">
                                    {/* Nama + Telepon */}
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
                                                Nama <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <User size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    type="text" placeholder="Nama Lengkap Pasien" required
                                                    value={formData.patient_name}
                                                    onChange={e => setFormData({ ...formData, patient_name: e.target.value })}
                                                    className="w-full pl-9 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl
                                                               text-sm font-medium focus:ring-2 focus:ring-emerald-400/30
                                                               focus:border-emerald-400 outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
                                                Telepon <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <Phone size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    type="text" placeholder="No. Hp / WhatsApp" required
                                                    value={formData.patient_phone}
                                                    onChange={e => setFormData({ ...formData, patient_phone: e.target.value })}
                                                    className="w-full pl-9 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl
                                                               text-sm font-medium focus:ring-2 focus:ring-emerald-400/30
                                                               focus:border-emerald-400 outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Alamat + Jenis Kelamin */}
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
                                                Alamat <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <MapPin size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    type="text" placeholder="Alamat Lengkap" required
                                                    value={formData.patient_address}
                                                    onChange={e => setFormData({ ...formData, patient_address: e.target.value })}
                                                    className="w-full pl-9 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl
                                                               text-sm font-medium focus:ring-2 focus:ring-emerald-400/30
                                                               focus:border-emerald-400 outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
                                                Jenis Kelamin <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <User size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <select required
                                                    value={formData.patient_gender}
                                                    onChange={e => setFormData({ ...formData, patient_gender: e.target.value })}
                                                    className="w-full pl-9 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl
                                                               text-sm font-medium appearance-none focus:ring-2 focus:ring-emerald-400/30
                                                               focus:border-emerald-400 outline-none transition-all cursor-pointer"
                                                >
                                                    <option value="">-- Pilih --</option>
                                                    <option value="Laki-laki">Laki-laki</option>
                                                    <option value="Perempuan">Perempuan</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Dokter + Tanggal */}
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
                                                Dokter <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <Stethoscope size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
                                                <select required
                                                    value={formData.doctor_name}
                                                    onChange={e => setFormData({ ...formData, doctor_name: e.target.value })}
                                                    className="w-full pl-9 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl
                                                               text-sm font-medium appearance-none focus:ring-2 focus:ring-emerald-400/30
                                                               focus:border-emerald-400 outline-none transition-all cursor-pointer"
                                                >
                                                    <option value="">-- Pilih Dokter --</option>
                                                    {doctors.map((d: any) => (
                                                        <option key={d.id} value={d.name}>{d.name} — {d.specialty}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
                                                Tanggal Kunjungan <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <Clock size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    type="datetime-local" required
                                                    value={formData.appointment_date}
                                                    onChange={e => setFormData({ ...formData, appointment_date: e.target.value })}
                                                    className="w-full pl-9 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl
                                                               text-sm font-medium focus:ring-2 focus:ring-emerald-400/30
                                                               focus:border-emerald-400 outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Submit */}
                                    <motion.button
                                        type="submit"
                                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl
                                                   font-black text-sm uppercase tracking-widest shadow-lg
                                                   shadow-emerald-200 transition-all mt-2"
                                    >
                                        {status.type === 'loading' ? 'Memproses...' : 'Submit Reservasi'}
                                    </motion.button>

                                    {status.msg && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`text-center text-sm font-medium py-3 rounded-xl
                                                ${status.type === 'success' ? 'text-emerald-600 bg-emerald-50 border border-emerald-200'
                                                    : 'text-red-600 bg-red-50 border border-red-200'}`}
                                        >
                                            {status.msg}
                                        </motion.p>
                                    )}

                                    {/* Trust badges */}
                                    <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs text-slate-400">
                                        <span className="flex items-center gap-1"><ShieldCheck size={12} className="text-emerald-500" /> Data Aman</span>
                                        <span className="w-px h-3 bg-slate-200" />
                                        <span className="flex items-center gap-1"><BadgeCheck size={12} className="text-emerald-500" /> Dokter Terverifikasi</span>
                                        <span className="w-px h-3 bg-slate-200" />
                                        <span className="flex items-center gap-1"><CheckCircle size={12} className="text-emerald-500" /> Konfirmasi Cepat</span>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ══ FOOTER ════════════════════════════════════════════════════ */}
            <footer className="bg-white border-t border-emerald-100 pt-16 pb-8 px-6 sm:px-10">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-emerald-100">

                        <div>
                            <Link href="/patient/dashboard" className="flex items-center gap-3 mb-4 group">
                                <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-emerald-100 shadow-sm bg-white flex items-center justify-center p-1.5">
                                    <img src="/images/Logo.png" alt="Nauli Dental" className="w-full h-full object-contain"
                                        onError={(e) => { (e.target as HTMLImageElement).parentElement!.innerHTML = '<span class="text-emerald-600 font-black text-lg">ND</span>'; }} />
                                </div>
                                <div>
                                    <h2 className="text-slate-800 font-black text-[18px] tracking-tighter leading-tight">
                                        Nauli<span className="text-emerald-600">Dental</span>
                                    </h2>
                                    <p className="text-[9px] text-emerald-600 font-bold tracking-widest uppercase">Clinic Care</p>
                                </div>
                            </Link>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Klinik gigi modern di Balige, Kabupaten Toba, melayani perawatan gigi umum dan estetika untuk menjaga kesehatan senyuman Anda.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-slate-800 font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                                <div className="w-1 h-5 bg-emerald-500 rounded-full" /> Menu Utama
                            </h3>
                            <ul className="space-y-2.5">
                                {[
                                    { name: 'Beranda', href: '/patient/dashboard' },
                                    { name: 'Tentang Kami', href: '/patient/about' },
                                    { name: 'Tim Dokter', href: '/patient/doctors' },
                                    { name: 'Layanan', href: '/patient/services' },
                                    { name: 'Reservasi', href: '/patient/appointments' },
                                ].map((l, i) => (
                                    <li key={i}>
                                        <Link href={l.href} className="text-slate-500 hover:text-emerald-600 text-sm
                                                                         transition-colors flex items-center gap-2 group">
                                            <ArrowRight size={11} className="text-emerald-400 opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" />
                                            {l.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-slate-800 font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                                <div className="w-1 h-5 bg-emerald-500 rounded-full" /> Alamat
                            </h3>
                            <div className="flex gap-3 text-slate-500 text-sm">
                                <MapPin size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                                <span>Jl. Raja Paindoan No.20A, Lumban Dolok Haume Bange, Kec. Balige, Toba, Sumatera Utara 22314</span>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-slate-800 font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                                <div className="w-1 h-5 bg-emerald-500 rounded-full" /> Kontak & Jam
                            </h3>
                            <ul className="space-y-3 text-sm text-slate-600">
                                <li className="flex items-center gap-2.5"><Mail size={14} className="text-emerald-500" /> booking@naulidental.com</li>
                                <li className="flex items-center gap-2.5"><Phone size={14} className="text-emerald-500" /> 0812-6530-965</li>
                                <li className="flex items-start gap-2.5">
                                    <Clock size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                                    <div className="space-y-0.5">
                                        <p>Sen–Jum: 10.00 – 19.00</p>
                                        <p>Sabtu: 10.00 – 17.00</p>
                                        <p className="text-red-500">Minggu: Tutup</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-slate-400 text-xs">© {new Date().getFullYear()} Nauli Dental Care · Balige, Toba, Sumatera Utara. All rights reserved.</p>
                        <div className="flex gap-5 text-xs">
                            {['Privacy Policy', 'Terms of Use', 'Accessibility'].map(t => (
                                <Link key={t} href="#" className="text-slate-400 hover:text-emerald-600 transition-colors">{t}</Link>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}