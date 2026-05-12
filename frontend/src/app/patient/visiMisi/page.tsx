'use client';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import {
    Sparkles, Activity, Award, Target, Eye,
    ChevronRight, ArrowRight, Calendar,
    TrendingUp, Heart, Quote
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
        // Karena Next.js Image tidak bisa mendeteksi keberadaan file secara realtime di client,
        // kita akan langsung mencoba memuat gambar lokal. Jika error, kita bisa fallback di tag img.
        // Untuk kemudahan, kita gunakan tag img biasa dengan onError handler.
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
                                // Jika gambar lokal gagal dimuat, ganti dengan fallback
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

            {/* ══ VISI & MISI ══════════════════════════════════════════════ */}
            <div id="visi-misi" className="max-w-7xl mx-auto px-6 sm:px-10 pb-24">
                <div className="grid md:grid-cols-2 gap-6">
                    {/* VISI */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white border border-[#D4EDE5] rounded-2xl p-10 hover:shadow-lg transition-all"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center">
                                <Eye size={18} className="text-emerald-600" />
                            </div>
                            <span className="text-emerald-600 font-black text-xs uppercase tracking-widest">Visi Utama</span>
                        </div>

                        <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight mb-5">
                            Menjadi Pioneer<br />
                            <span className="text-emerald-600">Klinik Digital</span><br />
                            Sumatera Utara
                        </h2>

                        <p className="text-slate-500 text-sm leading-relaxed mb-8">
                            Menjadi pionir klinik gigi digital di Sumatera Utara yang mengedepankan
                            akurasi diagnosa AI dan kenyamanan pasien kelas dunia pada tahun 2030.
                        </p>

                        <div className="flex items-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-widest border-t border-slate-100 pt-6">
                            Target 2030 <ArrowRight size={13} />
                        </div>
                    </motion.div>

                    {/* MISI */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-[#0A1C14] rounded-2xl p-10 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-center">
                                    <Target size={18} className="text-emerald-400" />
                                </div>
                                <span className="text-emerald-400 font-black text-xs uppercase tracking-widest">Misi Strategis</span>
                            </div>

                            <h2 className="text-3xl font-black text-white tracking-tight leading-tight mb-8">
                                Langkah<br />
                                <span className="text-emerald-400">Nyata</span> Kami
                            </h2>

                            <div className="space-y-5">
                                {misiItems.map((item, i) => (
                                    <div key={i} className="flex items-start gap-4">
                                        <div className="w-5 h-5 rounded-full border border-emerald-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                        </div>
                                        <p className="text-white/55 text-sm leading-relaxed">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ══ MILESTONE ════════════════════════════════════════════════ */}
            <div className="bg-white border-y border-[#D4EDE5] py-24">
                <div className="max-w-7xl mx-auto px-6 sm:px-10">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-16"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-1 h-6 bg-emerald-500 rounded-full" />
                            <span className="text-emerald-600 font-black text-xs uppercase tracking-widest">Perjalanan Kami</span>
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                            Tonggak <span className="text-emerald-600">Pencapaian</span>
                        </h2>
                    </motion.div>

                    <div className="relative">
                        <div className="hidden md:block absolute top-5 left-0 right-0 h-px bg-slate-100" />
                        <div className="grid md:grid-cols-3 gap-12">
                            {achievements.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 16 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <div className="hidden md:flex w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 items-center justify-center mb-8">
                                        <div className="w-3 h-3 rounded-full bg-emerald-500" />
                                    </div>
                                    <div className="text-5xl font-black text-emerald-100">{item.year}</div>
                                    <h3 className="text-lg font-black text-slate-800 mt-3">{item.title}</h3>
                                    <p className="text-sm text-slate-400 mt-2 leading-relaxed">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
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
                                            // Fallback jika gambar lokal tidak ada
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
        </div>
    );
}