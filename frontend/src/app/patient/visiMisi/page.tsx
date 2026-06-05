'use client';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import {
    Sparkles, Activity, Award, Target, Eye,
    ChevronRight, ArrowRight, Calendar,
    TrendingUp, Heart, Quote, Mail, Phone, MapPin, Clock
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// ── Gunakan gambar dari folder /public/images/bg/ ────────────────────
const BG_IMAGES = [
    '/images/bg/dental-bg-3.png',
    '/images/bg/galery5.png',
];

// ── Gunakan gambar galeri dari folder /public/images/gallery/ ─────────
const GALLERY_IMAGES = [
    '/images/gallery/news-1.jpg',
    '/images/gallery/news-2.jpg',
    '/images/gallery/news-3.jpg',
];

// Fallback jika gambar tidak ditemukan (tetap pakai Unsplash)
const FALLBACK_BG = [
    'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2070',
    'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=2070',
    'https://images.unsplash.com/photo-1559839734-2b71f1e59850?q=80&w=2070',
];

const FALLBACK_GALLERY = [
    'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=800',
    'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?q=80&w=800',
    'https://images.unsplash.com/photo-1559839734-2b71f1e59850?q=80&w=800',
];

export default function VisiMisiPage() {
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
    const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

    // Auto-rotate hero background
    const [bgIndex, setBgIndex] = useState(0);
    useEffect(() => {
        const timer = setInterval(() => {
            setBgIndex(p => (p + 1) % BG_IMAGES.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    // Fungsi untuk mengecek apakah gambar lokal ada, jika tidak pakai fallback
    const getBgImage = (index: number) => {
        return BG_IMAGES[index];
    };

    const getGalleryImage = (index: number) => {
        return GALLERY_IMAGES[index];
    };

    const stats = [
        { value: '50+', label: 'Prosedur Harian', icon: Activity },
        { value: '2.4K+', label: 'Pasien Puas', icon: Heart },
        { value: '15+', label: 'Dokter Spesialis', icon: Award },
        { value: '98%', label: 'Kepuasan Pasien', icon: TrendingUp },
    ];

    const achievements = [
        { year: '2024', title: 'AI Diagnosis Launch', desc: 'Pendeteksian dini karies dengan akurasi 96%' },
        { year: '2025', title: 'Ekspansi Cabang', desc: 'Pembukaan klinik digital di 5 kota Sumatra' },
        { year: '2026', title: 'Telemedicine 24/7', desc: 'Konsultasi jarak jauh dengan dokter gigi' },
    ];

    const misiItems = [
        'Memberikan edukasi gigi berbasis Chatbot RAG 24 jam.',
        'Menerapkan teknologi minimal invasif untuk kenyamanan pasien.',
        'Menjamin keamanan data medis lewat enkripsi cloud berlapis.',
        'Melakukan riset AI untuk diagnosis penyakit gigi mulut.',
    ];

    const news = [
        {
            title: 'Implementasi AI Vision v2.0',
            desc: 'Nauli Dental mendukung scan X-Ray otomatis akurasi 96%',
            img: getGalleryImage(0),
            fallbackImg: FALLBACK_GALLERY[0],
            tag: 'AI UPDATE',
            date: '12 Mei 2025'
        },
        {
            title: 'Promo Bulan Bakti Sosial',
            desc: 'Gratis scaling untuk 50 pendaftar pertama bulan Mei',
            img: getGalleryImage(1),
            fallbackImg: FALLBACK_GALLERY[1],
            tag: 'PROMO',
            date: '5 Mei 2025'
        },
        {
            title: 'Dokter Baru: Spesialis Bedah',
            desc: 'Selamat bergabung drg. Maya, ahli bedah mulut dari UI',
            img: getGalleryImage(2),
            fallbackImg: FALLBACK_GALLERY[2],
            tag: 'STAFF',
            date: '1 Mei 2025'
        },
    ];

    return (
        <div className="min-h-screen bg-[#EDF5F2] font-sans overflow-x-hidden">

            {/* ══ HERO FULLSCREEN — AUTO ROTATE BG (LOKAL) ══════════════════════ */}
            <div ref={heroRef} className="relative h-screen w-full flex items-center overflow-hidden">

                {/* Auto-rotating background dengan fallback */}
                <AnimatePresence mode="sync">
                    <motion.div
                        key={bgIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.2, ease: 'easeInOut' }}
                        className="absolute inset-0 z-0"
                        style={{ scale: heroScale }}
                    >
                        <img
                            src={getBgImage(bgIndex)}
                            className="w-full h-full object-cover"
                            alt="hero background"
                            onError={(e) => {
                                const target = e.currentTarget;
                                if (target.src !== FALLBACK_BG[bgIndex]) {
                                    target.src = FALLBACK_BG[bgIndex];
                                }
                            }}
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Overlay gradien */}
                <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/85 via-black/55 to-transparent" />
                <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#EDF5F2] via-transparent to-black/20" />
                <div className="absolute bottom-0 left-0 right-0 h-48 z-[2] bg-gradient-to-t from-[#EDF5F2] to-transparent" />

                {/* Dot indicators */}
                <div className="absolute bottom-16 right-10 z-[10] flex gap-2 items-center">
                    {BG_IMAGES.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setBgIndex(i)}
                            className={`rounded-full transition-all duration-300 ${bgIndex === i
                                ? 'w-6 h-2 bg-emerald-500'
                                : 'w-2 h-2 bg-white/30 hover:bg-white/60'
                                }`}
                        />
                    ))}
                </div>

                {/* Hero Content */}
                <div className="relative z-[5] max-w-7xl mx-auto px-6 sm:px-10 w-full pt-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="max-w-xl space-y-6"
                    >
                        <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 px-5 py-2 rounded-full backdrop-blur-sm">
                            <Sparkles size={12} className="text-emerald-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                                Nauli Dental AI · Est. 2024
                            </span>
                        </div>

                        <h1 className="text-6xl md:text-7xl font-black text-white tracking-tighter leading-none">
                            Visi &<br />
                            <span className="text-emerald-400">Misi</span>
                            <span className="text-white/40 text-4xl font-bold ml-3">Kami.</span>
                        </h1>

                        <p className="text-white/60 text-base leading-relaxed max-w-sm">
                            Membangun masa depan kesehatan gigi di Balige melalui integrasi
                            Kecerdasan Buatan dan pelayanan tulus sepenuh hati.
                        </p>

                        <div className="flex items-center gap-3 pt-2">
                            <a href="#visi-misi">
                                <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-emerald-900/20 active:scale-95">
                                    Pelajari Selengkapnya
                                    <ArrowRight size={14} />
                                </button>
                            </a>
                            <a href="#berita">
                                <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-2xl font-bold text-sm border border-white/15 transition-all">
                                    Berita Terkini
                                </button>
                            </a>
                        </div>
                    </motion.div>
                </div>

                {/* Scroll indicator */}
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[5] flex flex-col items-center gap-2"
                >
                    <div className="w-5 h-8 border-2 border-white/20 rounded-full flex justify-center">
                        <div className="w-1 h-2 bg-emerald-400/50 rounded-full mt-2" />
                    </div>
                </motion.div>
            </div>

            {/* ══ STATS ════════════════════════════════════════════════════ */}
            <div className="max-w-7xl mx-auto px-6 sm:px-10 py-20">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((s, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08 }}
                            className="bg-white border border-[#D4EDE5] rounded-2xl p-7 text-center hover:shadow-md hover:border-emerald-300 transition-all group"
                        >
                            <div className="w-11 h-11 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <s.icon size={20} className="text-emerald-600" />
                            </div>
                            <h3 className="text-3xl font-black text-slate-800">{s.value}</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">{s.label}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* ══ VISI & MISI — SPLIT LAYOUT (referensi Gambar 3&4) ═══════════ */}
            <div id="visi-misi" className="max-w-7xl mx-auto px-6 sm:px-10 pb-24 space-y-20">

                {/* ── VISI: foto kiri, teks kanan ── */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center"
                >
                    {/* Foto kiri */}
                    <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[4/3]">
                        <img
                            src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=900"
                            alt="Nauli Dental - Visi"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/20 to-transparent" />
                    </div>

                    {/* Teks Visi kanan */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-1 h-6 bg-emerald-500 rounded-full" />
                            <span className="text-emerald-600 font-black text-xs uppercase tracking-widest">Visi Utama</span>
                        </div>

                        <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
                            Visi
                        </h2>

                        <blockquote className="text-xl md:text-2xl text-slate-700 font-medium leading-relaxed border-l-4 border-emerald-500 pl-5">
                            "Menjadi pioneer klinik gigi digital di Sumatera Utara yang mengedepankan
                            akurasi diagnosa AI dan kenyamanan pasien kelas dunia pada tahun 2030."
                        </blockquote>

                        <p className="text-slate-500 text-sm leading-relaxed">
                            Nauli Dental Care berkomitmen menjadi pusat rujukan kesehatan gigi terdepan
                            di wilayah Sumatera Utara, dengan mengintegrasikan teknologi kecerdasan buatan
                            ke dalam setiap aspek pelayanan — dari diagnosis hingga perawatan pasca-tindakan.
                        </p>

                        <div className="flex items-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-widest pt-2">
                            Target 2030 <ArrowRight size={13} />
                        </div>
                    </div>
                </motion.div>

                {/* ── MISI: teks kiri, foto kanan ── */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center"
                >
                    {/* Teks Misi kiri */}
                    <div className="space-y-6 order-2 md:order-1">
                        <div className="flex items-center gap-3">
                            <div className="w-1 h-6 bg-emerald-500 rounded-full" />
                            <span className="text-emerald-600 font-black text-xs uppercase tracking-widest">Misi Strategis</span>
                        </div>

                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                            Misi
                        </h2>

                        <p className="text-slate-500 text-sm leading-relaxed">
                            Langkah-langkah nyata yang kami jalani setiap hari untuk mewujudkan visi
                            menjadi klinik gigi digital terbaik di Sumatera Utara:
                        </p>

                        <ol className="space-y-4">
                            {misiItems.map((item, i) => (
                                <li key={i} className="flex items-start gap-4 group">
                                    <span className="w-7 h-7 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center flex-shrink-0 text-emerald-600 font-black text-xs group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-500 transition-all">
                                        {i + 1}
                                    </span>
                                    <p className="text-slate-600 text-sm leading-relaxed pt-1">{item}</p>
                                </li>
                            ))}
                        </ol>
                    </div>

                    {/* Foto kanan */}
                    <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[4/3] order-1 md:order-2">
                        <img
                            src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=900"
                            alt="Nauli Dental - Misi"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-tl from-emerald-900/20 to-transparent" />
                    </div>
                </motion.div>

            </div>



            {/* ══ BERITA ═══════════════════════════════════════════════════ */}
            <div id="berita" className="py-24">
                <div className="max-w-7xl mx-auto px-6 sm:px-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-14">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-1 h-6 bg-emerald-500 rounded-full" />
                                <span className="text-emerald-600 font-black text-xs uppercase tracking-widest">Berita & Update</span>
                            </div>
                            <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                                Kabar Klinik <span className="text-emerald-600">Terkini</span>
                            </h2>
                        </div>
                        <button className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-emerald-600 transition-all uppercase tracking-widest">
                            Lihat Semua <ChevronRight size={13} />
                        </button>
                    </div>

                    <div className="grid md:grid-cols-3 gap-5">
                        {news.map((n, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -4 }}
                                className="bg-white border border-[#D4EDE5] rounded-2xl overflow-hidden hover:shadow-lg hover:border-emerald-200 transition-all group cursor-pointer"
                            >
                                <div className="relative h-44 overflow-hidden">
                                    <img
                                        src={n.img}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        alt={n.title}
                                        onError={(e) => {
                                            const target = e.currentTarget;
                                            if (target.src !== n.fallbackImg) {
                                                target.src = n.fallbackImg;
                                            }
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                    <div className="absolute top-4 left-4 bg-emerald-500/90 backdrop-blur-sm px-2.5 py-1 rounded-full">
                                        <span className="text-[9px] font-black text-white uppercase tracking-wider">{n.tag}</span>
                                    </div>
                                    <div className="absolute bottom-4 left-4 flex items-center gap-1.5">
                                        <Calendar size={11} className="text-white/70" />
                                        <span className="text-[10px] text-white/70 font-medium">{n.date}</span>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h4 className="text-sm font-black text-slate-800 leading-tight group-hover:text-emerald-700 transition-colors">{n.title}</h4>
                                    <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-2">{n.desc}</p>
                                    <div className="flex items-center gap-2 text-emerald-600 font-bold text-[10px] uppercase tracking-widest mt-4 group-hover:gap-3 transition-all">
                                        Baca Selengkapnya <ArrowRight size={11} />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ══ QUOTE ════════════════════════════════════════════════════ */}
            <div className="bg-[#0A1C14] py-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/8 rounded-full blur-3xl pointer-events-none" />
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <Quote size={40} className="mx-auto text-emerald-500/30 mb-8" />
                    <p className="text-2xl md:text-3xl font-black text-white leading-relaxed">
                        "Kesehatan gigi yang baik adalah cermin dari kebahagiaan hidup.
                        Kami di sini untuk menjamin cermin Anda selalu bersinar."
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-lg">N</div>
                        <div className="text-left">
                            <p className="text-sm font-black text-white">Nauli Dental Care</p>
                            <p className="text-xs text-white/35 mt-0.5">Est. 2024 · Balige, Sumatera Utara</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ══ CTA ══════════════════════════════════════════════════════ */}
            <div className="py-24">
                <div className="max-w-7xl mx-auto px-6 sm:px-10">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white border border-[#D4EDE5] rounded-2xl p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-10 shadow-sm"
                    >
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-1 h-6 bg-emerald-500 rounded-full" />
                                <span className="text-emerald-600 font-black text-xs uppercase tracking-widest">Mulai Sekarang</span>
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                                Siap memulai perjalanan<br />
                                <span className="text-emerald-600">senyum sehat</span> Anda?
                            </h3>
                            <p className="text-slate-400 text-sm mt-3">
                                Daftarkan diri Anda sekarang dan nikmati konsultasi pertama gratis.
                            </p>
                        </div>
                        <Link href="/register" className="flex-shrink-0">
                            <button className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-emerald-100 active:scale-95">
                                Daftar Pasien Baru
                                <ArrowRight size={16} />
                            </button>
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* ══ FOOTER ════════════════════════════════════════════════════ */}
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
                                Nauli Dental Care adalah klinik perawatan gigi yang berlokasi di Balige, Kabupaten Toba, Sumatera Utara.
                                Klinik ini melayani berbagai macam perawatan gigi umum dan estetika.
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
                                            <ChevronRight size={12} className="text-emerald-400 opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" />
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Kolom 3: Office Address - Data Baru Balige */}
                        <div>
                            <h3 className="text-slate-800 font-bold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
                                <div className="w-1 h-5 bg-emerald-500 rounded-full" />
                                Office Address
                            </h3>
                            <div className="space-y-4">
                                <div className="flex gap-3 group">
                                    <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-100 transition">
                                        <MapPin size={13} className="text-emerald-500" />
                                    </div>
                                    <div className="text-slate-500 text-sm leading-relaxed group-hover:text-slate-700 transition">
                                        Jl. Raja Paindoan No.20A, Lumban Dolok Haume Bange,<br />
                                        Kec. Balige, Toba, Sumatera Utara 22314
                                    </div>
                                </div>
                                <div className="flex gap-3 group">
                                    <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-100 transition">
                                        <MapPin size={13} className="text-emerald-500" />
                                    </div>
                                    <div className="text-slate-500 text-sm leading-relaxed group-hover:text-slate-700 transition">
                                        Koordinat: 2°19'58.7"N 99°03'57.8"E
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Kolom 4: Contact & Hours */}
                        <div>
                            <h3 className="text-slate-800 font-bold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
                                <div className="w-1 h-5 bg-emerald-500 rounded-full" />
                                Contact & Hours
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 group">
                                    <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-100 transition">
                                        <Mail size={13} className="text-emerald-500" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Email</p>
                                        <a href="mailto:booking@naulidental.com" className="text-slate-600 text-sm hover:text-emerald-600 transition">
                                            booking@naulidental.com
                                        </a>
                                    </div>
                                </li>
                                <li className="flex items-center gap-3 group">
                                    <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-100 transition">
                                        <Phone size={13} className="text-emerald-500" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Telepon</p>
                                        <a href="tel:+628126530965" className="text-slate-600 text-sm hover:text-emerald-600 transition">
                                            0812-6530-965
                                        </a>
                                    </div>
                                </li>
                                <li className="flex gap-3 group">
                                    <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-100 transition">
                                        <Clock size={13} className="text-emerald-500" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Jam Operasional</p>
                                        <div className="text-slate-600 text-sm space-y-0.5">
                                            <p>Senin - Sabtu: 10.00 - 19.00</p>
                                            <p className="text-red-500">Minggu: Tutup</p>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-slate-400 text-xs">
                            © {new Date().getFullYear()} Nauli Dental Care - Balige, Toba, Sumatera Utara. All rights reserved.
                        </p>
                        <div className="flex gap-6 text-xs">
                            <Link href="/patient/privacy" className="text-slate-400 hover:text-emerald-600 transition-colors">Privacy Policy</Link>
                            <Link href="/patient/terms" className="text-slate-400 hover:text-emerald-600 transition-colors">Terms of Use</Link>
                            <Link href="/patient/accessibility" className="text-slate-400 hover:text-emerald-600 transition-colors">Accessibility</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}