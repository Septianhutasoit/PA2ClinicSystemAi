'use client';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import {
    Sparkles, Activity, Award, Target, Eye,
    ChevronRight, ArrowRight, Calendar,
    TrendingUp, Heart, Quote, Mail, Phone, MapPin, Clock,
    Shield, Smile, Stethoscope, BadgeCheck, Zap, Users,
    CheckCircle, Star
} from 'lucide-react';
import Link from 'next/link';

const BG_IMAGES = [
    '/images/bg/dental-bg-3.png',
    '/images/bg/galery5.png',
];

const FALLBACK_BG = [
    'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2070',
    'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=2070',
];

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
});

export default function VisiMisiPage() {
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
    const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

    const [bgIndex, setBgIndex] = useState(0);
    useEffect(() => {
        const timer = setInterval(() => setBgIndex(p => (p + 1) % BG_IMAGES.length), 5000);
        return () => clearInterval(timer);
    }, []);

    // ── Data ────────────────────────────────────────────────────────────
    const stats = [
        { value: '50+', label: 'Prosedur Harian', icon: Activity },
        { value: '2.4K+', label: 'Pasien Puas', icon: Heart },
        { value: '15+', label: 'Dokter Spesialis', icon: Award },
        { value: '98%', label: 'Kepuasan Pasien', icon: TrendingUp },
    ];

    const misiItems = [
        'Memberikan edukasi gigi berbasis Chatbot RAG 24 jam.',
        'Menerapkan teknologi minimal invasif untuk kenyamanan pasien.',
        'Menjamin keamanan data medis lewat enkripsi cloud berlapis.',
        'Melakukan riset AI untuk diagnosis penyakit gigi mulut.',
    ];

    // ── Informasi klinik (menggantikan berita) ──────────────────────────
    const infoSections = [
        {
            icon: Stethoscope,
            title: 'Pelayanan Komprehensif',
            color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
            points: [
                'Pemeriksaan gigi umum & konsultasi rutin',
                'Scaling, tambal, cabut, dan perawatan saluran akar',
                'Orthodonti (behel) & estetika (veneer, bleaching)',
                'Bedah mulut & implant gigi permanen',
            ],
        },
        {
            icon: Zap,
            title: 'Teknologi & Inovasi',
            color: 'bg-teal-50 text-teal-600 border-teal-100',
            points: [
                'Sistem AI diagnosis karies akurasi 96%',
                'Digital X-Ray dengan radiasi minimal',
                'Rekam medis digital terintegrasi cloud',
                'Chatbot 24/7 untuk konsultasi awal pasien',
            ],
        },
        {
            icon: Shield,
            title: 'Standar & Keamanan',
            color: 'bg-green-50 text-green-600 border-green-100',
            points: [
                'Sterilisasi alat berstandar WHO & Kemenkes RI',
                'Enkripsi end-to-end untuk data pasien',
                'Dokter bersertifikat Konsil Kedokteran Indonesia',
                'Audit mutu internal dilakukan setiap 3 bulan',
            ],
        },
        {
            icon: Users,
            title: 'Layanan Pasien',
            color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
            points: [
                'Reservasi online 24 jam via website & WhatsApp',
                'Estimasi waktu tunggu real-time di antrian',
                'Konsultasi darurat dengan respons cepat',
                'Program loyalitas & diskon untuk pasien rutin',
            ],
        },
        {
            icon: BadgeCheck,
            title: 'Penghargaan & Pengakuan',
            color: 'bg-teal-50 text-teal-600 border-teal-100',
            points: [
                'Klinik Inovatif Sumatera Utara 2024 — Kemenkes RI',
                'Rating 4.9/5 dari 1.000+ ulasan pasien verified',
                'Mitra resmi BPJS Kesehatan & asuransi swasta',
                'Finalist Top Digital Health Startup 2025',
            ],
        },
        {
            icon: Heart,
            title: 'Komitmen Sosial',
            color: 'bg-green-50 text-green-600 border-green-100',
            points: [
                'Program gigi gratis untuk 100 anak kurang mampu/tahun',
                'Kunjungan klinik mobile ke desa-desa terpencil',
                'Edukasi sikat gigi di sekolah dasar se-Kabupaten Toba',
                'Donasi alat gigi ke puskesmas pelosok Sumatera',
            ],
        },
    ];

    return (
        <div className="min-h-screen bg-[#EDF5F2] font-sans overflow-x-hidden">

            {/* ══ HERO ════════════════════════════════════════════════════ */}
            <div ref={heroRef} className="relative h-screen w-full flex items-center overflow-hidden">
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
                            src={BG_IMAGES[bgIndex]}
                            className="w-full h-full object-cover"
                            alt="hero background"
                            onError={(e) => {
                                const t = e.currentTarget;
                                if (t.src !== FALLBACK_BG[bgIndex]) t.src = FALLBACK_BG[bgIndex];
                            }}
                        />
                    </motion.div>
                </AnimatePresence>

                <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/85 via-black/55 to-transparent" />
                <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#EDF5F2] via-transparent to-black/20" />
                <div className="absolute bottom-0 left-0 right-0 h-48 z-[2] bg-gradient-to-t from-[#EDF5F2] to-transparent" />

                {/* Dot indicators */}
                <div className="absolute bottom-16 right-10 z-[10] flex gap-2">
                    {BG_IMAGES.map((_, i) => (
                        <button key={i} onClick={() => setBgIndex(i)}
                            className={`rounded-full transition-all duration-300
                                ${bgIndex === i ? 'w-6 h-2 bg-emerald-500' : 'w-2 h-2 bg-white/30 hover:bg-white/60'}`}
                        />
                    ))}
                </div>

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
                                    Pelajari Selengkapnya <ArrowRight size={14} />
                                </button>
                            </a>
                            <a href="#informasi">
                                <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-2xl font-bold text-sm border border-white/15 transition-all">
                                    Info Klinik
                                </button>
                            </a>
                        </div>
                    </motion.div>
                </div>

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

            {/* ══ STATS — kecil & rapi seperti gambar ════════════════════ */}
            <div className="max-w-7xl mx-auto px-6 sm:px-10 py-14">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((s, i) => (
                        <motion.div
                            key={i}
                            {...fadeUp(i * 0.07)}
                            className="bg-white border border-[#D4EDE5] rounded-2xl px-5 py-6
                                       text-center hover:shadow-md hover:border-emerald-200
                                       transition-all group"
                        >
                            {/* Icon — ukuran pas seperti gambar */}
                            <div className="w-10 h-10 bg-emerald-50 border border-emerald-100 rounded-xl
                                            flex items-center justify-center mx-auto mb-4
                                            group-hover:scale-110 transition-transform">
                                <s.icon size={18} className="text-emerald-600" strokeWidth={1.8} />
                            </div>
                            {/* Nilai */}
                            <h3 className="text-2xl font-black text-slate-800 leading-none">{s.value}</h3>
                            {/* Label kecil */}
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                                {s.label}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* ══ VISI & MISI ═════════════════════════════════════════════ */}
            <div id="visi-misi" className="max-w-7xl mx-auto px-6 sm:px-10 pb-20 space-y-16">

                {/* ── VISI ── */}
                <motion.div
                    {...fadeUp()}
                    className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center"
                >
                    <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[4/3]">
                        <img
                            src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=900"
                            alt="Nauli Dental - Visi"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/20 to-transparent" />
                        {/* Floating badge */}
                        <div className="absolute bottom-5 left-5 bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-2.5 shadow-lg">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Target</p>
                            <p className="text-sm font-black text-emerald-700">Pioneer 2030</p>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div className="flex items-center gap-3">
                            <div className="w-1 h-6 bg-emerald-500 rounded-full" />
                            <span className="text-emerald-600 font-black text-xs uppercase tracking-widest">Visi Utama</span>
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Visi</h2>
                        <blockquote className="text-lg text-slate-700 font-medium leading-relaxed
                                               border-l-4 border-emerald-500 pl-5 italic">
                            "Menjadi pioneer klinik gigi digital di Sumatera Utara yang mengedepankan
                            akurasi diagnosa AI dan kenyamanan pasien kelas dunia pada tahun 2030."
                        </blockquote>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Nauli Dental Care berkomitmen menjadi pusat rujukan kesehatan gigi terdepan
                            di wilayah Sumatera Utara, dengan mengintegrasikan teknologi kecerdasan buatan
                            ke dalam setiap aspek pelayanan — dari diagnosis hingga perawatan pasca-tindakan.
                        </p>
                        <div className="flex items-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-widest pt-1">
                            Target 2030 <ArrowRight size={13} />
                        </div>
                    </div>
                </motion.div>

                {/* ── MISI ── */}
                <motion.div
                    {...fadeUp(0.1)}
                    className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center"
                >
                    <div className="space-y-5 order-2 md:order-1">
                        <div className="flex items-center gap-3">
                            <div className="w-1 h-6 bg-emerald-500 rounded-full" />
                            <span className="text-emerald-600 font-black text-xs uppercase tracking-widest">Misi Strategis</span>
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Misi</h2>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Langkah-langkah nyata yang kami jalani setiap hari untuk mewujudkan visi
                            menjadi klinik gigi digital terbaik di Sumatera Utara:
                        </p>
                        <ol className="space-y-3.5">
                            {misiItems.map((item, i) => (
                                <motion.li
                                    key={i}
                                    initial={{ opacity: 0, x: -12 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.07 }}
                                    className="flex items-start gap-4 group"
                                >
                                    <span className="w-7 h-7 rounded-full bg-emerald-50 border border-emerald-200
                                                     flex items-center justify-center shrink-0 text-emerald-600
                                                     font-black text-xs group-hover:bg-emerald-500 group-hover:text-white
                                                     group-hover:border-emerald-500 transition-all">
                                        {i + 1}
                                    </span>
                                    <p className="text-slate-600 text-sm leading-relaxed pt-1">{item}</p>
                                </motion.li>
                            ))}
                        </ol>
                    </div>

                    <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[4/3] order-1 md:order-2">
                        <img
                            src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=900"
                            alt="Nauli Dental - Misi"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-tl from-emerald-900/20 to-transparent" />
                        <div className="absolute bottom-5 right-5 bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-2.5 shadow-lg">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Komitmen</p>
                            <p className="text-sm font-black text-emerald-700">Kualitas Terbaik</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* ══ INFORMASI KLINIK — ganti berita ═════════════════════════ */}
            <div id="informasi" className="bg-white py-24">
                <div className="max-w-7xl mx-auto px-6 sm:px-10">

                    {/* Header */}
                    <motion.div {...fadeUp()} className="mb-14">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-1 h-6 bg-emerald-500 rounded-full" />
                            <span className="text-emerald-600 font-black text-xs uppercase tracking-widest">
                                Profil Lengkap Klinik
                            </span>
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                            Mengenal <span className="text-emerald-600">Nauli Dental Care</span>
                        </h2>
                        <p className="text-slate-500 text-sm mt-3 max-w-xl leading-relaxed">
                            Segala yang perlu Anda ketahui tentang standar, layanan, teknologi, dan
                            komitmen kami sebagai klinik gigi modern di Balige.
                        </p>
                    </motion.div>

                    {/* Grid 6 kartu info */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {infoSections.map((section, i) => {
                            const Icon = section.icon;
                            return (
                                <motion.div
                                    key={i}
                                    {...fadeUp(i * 0.07)}
                                    className="bg-slate-50 border border-slate-100 rounded-2xl p-6
                                               hover:shadow-md hover:border-emerald-100 hover:-translate-y-1
                                               transition-all group"
                                >
                                    {/* Icon */}
                                    <div className={`w-11 h-11 ${section.color} border rounded-xl
                                                    flex items-center justify-center mb-5
                                                    group-hover:scale-110 transition-transform`}>
                                        <Icon size={20} />
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-sm font-black text-slate-800 mb-4">{section.title}</h3>

                                    {/* Points */}
                                    <ul className="space-y-2.5">
                                        {section.points.map((pt, j) => (
                                            <li key={j} className="flex items-start gap-2.5">
                                                <CheckCircle size={13} className="text-emerald-500 shrink-0 mt-0.5" />
                                                <span className="text-xs text-slate-500 leading-relaxed">{pt}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ══ QUOTE ════════════════════════════════════════════════════ */}
            <div className="bg-[#0A1C14] py-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/8 rounded-full blur-3xl pointer-events-none" />
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <Quote size={36} className="mx-auto text-emerald-500/30 mb-8" />
                    <p className="text-2xl md:text-3xl font-black text-white leading-relaxed">
                        "Kesehatan gigi yang baik adalah cermin dari kebahagiaan hidup.
                        Kami di sini untuk menjamin cermin Anda selalu bersinar."
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30
                                        flex items-center justify-center text-emerald-400 font-black text-lg">N</div>
                        <div className="text-left">
                            <p className="text-sm font-black text-white">Nauli Dental Care</p>
                            <p className="text-xs text-white/35 mt-0.5">Est. 2024 · Balige, Sumatera Utara</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ══ CTA ══════════════════════════════════════════════════════ */}
            <div className="py-24 bg-[#EDF5F2]">
                <div className="max-w-7xl mx-auto px-6 sm:px-10">
                    <motion.div
                        {...fadeUp()}
                        className="bg-white border border-[#D4EDE5] rounded-2xl p-10 md:p-14
                                   flex flex-col md:flex-row items-center justify-between gap-10 shadow-sm"
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
                            <button className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700
                                               text-white px-8 py-4 rounded-2xl font-bold text-sm
                                               transition-all shadow-lg shadow-emerald-100 active:scale-95">
                                Daftar Pasien Baru <ArrowRight size={16} />
                            </button>
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* ══ FOOTER ════════════════════════════════════════════════════ */}
            <footer className="bg-white border-t border-emerald-100 pt-16 pb-8 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-emerald-100">

                        <div>
                            <Link href="/patient/dashboard" className="flex items-center gap-3 mb-4 group">
                                <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-emerald-100 shadow-sm bg-white flex items-center justify-center p-1.5">
                                    <img src="/images/Logo.png" alt="Nauli Dental" className="w-full h-full object-contain"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).parentElement!.innerHTML =
                                                '<span class="text-emerald-600 font-black text-lg">ND</span>';
                                        }} />
                                </div>
                                <div>
                                    <h2 className="text-slate-800 font-black text-[18px] tracking-tighter leading-tight">
                                        Nauli<span className="text-[#006D44]">Dental</span>
                                    </h2>
                                    <p className="text-[9px] text-emerald-600 font-bold tracking-widest uppercase">Clinic Care</p>
                                </div>
                            </Link>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Klinik perawatan gigi modern di Balige, Kabupaten Toba, Sumatera Utara,
                                melayani perawatan gigi umum dan estetika berbasis teknologi AI.
                            </p>
                            <div className="text-slate-500 text-sm leading-relaxed group-hover:text-slate-700 transition">
                                Koordinat: 2°19'58.7"N 99°03'57.8"E
                            </div>
                        </div>

                        <div>
                            <h3 className="text-slate-800 font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                                <div className="w-1 h-5 bg-emerald-500 rounded-full" /> Menu Utama
                            </h3>
                            <ul className="space-y-2.5">
                                {[
                                    { name: 'Beranda', href: '/patient/dashboard' },
                                    { name: 'Tentang', href: '/patient/about' },
                                    { name: 'Tim Dokter', href: '/patient/doctors' },
                                    { name: 'Visi & Misi', href: '/patient/visiMisi' },
                                    { name: 'Layanan', href: '/patient/services' },
                                    { name: 'Reservasi', href: '/patient/appointments' },
                                ].map((l, i) => (
                                    <li key={i}>
                                        <Link href={l.href}
                                            className="text-slate-500 hover:text-emerald-600 text-sm
                                                       transition-colors flex items-center gap-2 group">
                                            <ChevronRight size={11} className="opacity-0 group-hover:opacity-100 text-emerald-400 transition-all -translate-x-1 group-hover:translate-x-0" />
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
                            <div className="flex gap-3 text-slate-500 text-sm leading-relaxed">
                                <MapPin size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                                <span>Jl. Raja Paindoan No.20A, Lumban Dolok Haume Bange, Kec. Balige, Toba, Sumatera Utara 22314</span>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-slate-800 font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                                <div className="w-1 h-5 bg-emerald-500 rounded-full" /> Kontak
                            </h3>
                            <ul className="space-y-3 text-sm text-slate-600">
                                <li className="flex items-center gap-2.5"><Mail size={13} className="text-emerald-500" /> booking@naulidental.com</li>
                                <li className="flex items-center gap-2.5"><Phone size={13} className="text-emerald-500" /> 0812-6530-965</li>
                                <li className="flex items-start gap-2.5">
                                    <Clock size={13} className="text-emerald-500 mt-0.5 shrink-0" />
                                    <div>
                                        <p>Sen–Jum: 10.00 – 19.00</p>
                                        <p>Sabtu: 10.00 – 17.00</p>
                                        <p className="text-red-500">Minggu: Tutup</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-slate-400 text-xs">
                            © {new Date().getFullYear()} Nauli Dental Care · Balige, Toba, Sumatera Utara. All rights reserved.
                        </p>
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