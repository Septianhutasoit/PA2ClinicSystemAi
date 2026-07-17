'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
    MapPin, Phone, Award, Smile, Heart,
    Clock, Mail, Sparkles, ArrowRight,
    Play, ShieldCheck, Users, Star, Zap,
    CheckCircle2, Building2, CalendarDays, TrendingUp,
    ChevronRight, Activity, Quote
} from 'lucide-react';
import Link from 'next/link';

const BG_FALLBACK = [
    '/Fasilitas.jpeg',
    '/Ruang Tunggu .jpeg',
    '/Fasilitas 2.jpeg',
];

const features = [
    {
        icon: ShieldCheck,
        title: 'Steril & Aman',
        desc: 'Prosedur sterilisasi ketat demi menjaga kebersihan alat medis setiap hari.',
        detail: 'Setiap alat disterilisasi menggunakan autoclave bersuhu tinggi sebelum digunakan. Ruangan tindakan juga dibersihkan dengan disinfektan medis secara berkala, memastikan lingkungan pengobatan aman bagi seluruh keluarga.',
        color: 'from-emerald-400 to-teal-500'
    },
    {
        icon: Zap,
        title: 'Pemeriksaan Gigi',
        desc: 'Pemeriksaan gigi yang teliti untuk mendeteksi masalah kesehatan mulut sejak dini.',
        detail: 'Kami melakukan pengecekan kondisi gigi secara terperinci agar dapat memberikan rekomendasi pencegahan maupun penanganan gigi yang paling tepat untuk Anda.',
        color: 'from-violet-400 to-purple-500'
    },
    {
        icon: Heart,
        title: 'Ramah Pasien',
        desc: 'Tindakan yang ramah, santai, and penuh perhatian bagi kenyamanan Anda.',
        detail: 'Kami mengutamakan teknik penanganan yang komunikatif dan ramah, terutama untuk anak-anak maupun lansia, untuk membantu mengurangi rasa cemas selama tindakan berlangsung.',
        color: 'from-rose-400 to-pink-500'
    },
    {
        icon: Users,
        title: 'Dokter Gigi Terpercaya',
        desc: 'Didukung oleh 7 dokter spesialis berpengalaman dan berizin resmi.',
        detail: 'Seluruh dokter gigi di klinik kami telah terdaftar resmi secara nasional dan siap melayani berbagai kebutuhan perawatan gigi Anda dari yang ringan hingga perawatan berkala.',
        color: 'from-amber-400 to-orange-500'
    },
];

const gallery = [
    {
        src: '/Fasilitas.jpeg',
        label: 'Ruang Perawatan',
        desc: 'Bersih & Nyaman',
        detail: 'Ruang perawatan kami mengutamakan kebersihan di setiap sudutnya, dilengkapi dengan peralatan yang memadai untuk menjamin kenyamanan Anda.'
    },
    {
        src: '/Dokter .jpeg',
        label: 'Tim Dokter',
        desc: 'Ramah & Komunikatif',
        detail: 'Tim dokter gigi kami yang siap memberikan penjelasan yang jelas dan ramah mengenai setiap keluhan gigi Anda.'
    },
    {
        src: '/Fasilitas 2.jpeg',
        label: 'Peralatan Medis',
        desc: 'Higienis & Steril',
        detail: 'Kami menggunakan peralatan dental yang terjaga kehigienisannya untuk mendukung diagnosis yang akurat dan hasil yang optimal.'
    },
    {
        src: '/Ruang Tunggu .jpeg',
        label: 'Ruang Tunggu',
        desc: 'Santai & Tenang',
        detail: 'Ruang tunggu yang bersih dan tenang disediakan agar Anda dan keluarga dapat menunggu antrean dengan nyaman.'
    },
];

const stats = [
    { val: '2021', lbl: 'Tahun Berdiri', suffix: '' },
    { val: '7', lbl: 'Dokter Spesialis', suffix: '' },
    { val: 'Puas & Aman', lbl: 'Pasien Terlayani', suffix: '' },
    { val: '98', lbl: 'Tingkat Kepuasan', suffix: '%' },
];

const values = [
    'Pelayanan profesional, ramah, dan tepercaya',
    'Prosedur sterilisasi peralatan medis yang higienis',
    'Konsultasi dan kemudahan pendaftaran via WhatsApp',
    'Tim dokter spesialis berpengalaman dan berizin resmi',
    'Pendaftaran online yang praktis & cepat',
    'Fasilitas klinik yang bersih & nyaman',
];


function AnimatedCounter({ target, suffix }: { target: number, suffix: string }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !started) {
                setStarted(true);
                let start = 0;
                const duration = 1500;
                const step = target / (duration / 16);
                const timer = setInterval(() => {
                    start += step;
                    if (start >= target) { setCount(target); clearInterval(timer); }
                    else setCount(Math.floor(start));
                }, 16);
            }
        }, { threshold: 0.5 });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [target, started]);

    return <div ref={ref}>{count}{suffix}</div>;
}

export default function AboutPage() {
    const [currentBg, setCurrentBg] = useState(0);
    const [hoveredGallery, setHoveredGallery] = useState<number | null>(null);
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
    const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    useEffect(() => {
        const t = setInterval(() => setCurrentBg(p => (p + 1) % BG_FALLBACK.length), 5000);
        return () => clearInterval(t);
    }, []);

    return (
        <div className="min-h-screen font-sans overflow-x-hidden bg-[#f4f9f6]">

            {/* ══ HERO — CINEMATIC FULL SCREEN ══════════════════════════════════ */}
            <div ref={heroRef} className="relative h-screen w-full overflow-hidden flex items-end pb-24">
                {/* Parallax background */}
                <motion.div style={{ y: heroY }} className="absolute inset-0 z-0 scale-110">
                    <AnimatePresence mode="sync">
                        <motion.div
                            key={currentBg}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.8, ease: 'easeInOut' }}
                            className="absolute inset-0"
                        >
                            <img src={BG_FALLBACK[currentBg]} className="w-full h-full object-cover" alt="bg" />
                        </motion.div>
                    </AnimatePresence>
                </motion.div>

                {/* Gradient overlays */}
                <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
                <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-64 z-[2] bg-gradient-to-t from-[#f4f9f6] to-transparent" />

                {/* Floating badge */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="absolute top-32 right-8 z-10 hidden md:block"
                >
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-right">
                        <div className="flex items-center gap-2 justify-end mb-1">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                            <span className="text-emerald-300 text-[10px] font-black uppercase tracking-widest">Now Open</span>
                        </div>
                        <p className="text-white text-sm font-bold">Sen–Sab: 10.00–19.00</p>
                        <p className="text-white/50 text-xs">Balige, Toba</p>
                    </div>
                </motion.div>

                {/* Hero content */}
                <motion.div style={{ opacity: heroOpacity }} className="relative z-[5] max-w-7xl mx-auto px-6 sm:px-10 w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, delay: 0.2 }}
                        className="max-w-2xl space-y-6"
                    >
                        {/* Tag pill */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/40 px-4 py-2 rounded-full backdrop-blur-sm"
                        >
                            <Sparkles size={12} className="text-emerald-300" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-300">
                                Nauli Dental Care · Est. 2024 · Balige
                            </span>
                        </motion.div>

                        <h1 className="text-6xl sm:text-7xl font-black leading-[0.9] tracking-tighter">
                            <span className="text-white">Tentang</span><br />
                            <span className="bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">Nauli</span>
                            <span className="text-white"> Dental</span>
                        </h1>

                        <p className="text-white/60 text-base leading-relaxed max-w-md">
                            Klinik gigi modern di Balige — menghadirkan perawatan
                            aman, ramah, dan nyaman untuk seluruh keluarga Anda sejak 2021.
                        </p>

                        <div className="flex items-center gap-3 pt-2 flex-wrap">
                            <Link href="/patient/services">
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white px-7 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-xl shadow-emerald-900/30"
                                >
                                    <Play size={13} className="fill-white" /> Pilih Layanan
                                </motion.button>
                            </Link>
                            <a href="#keunggulan">
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-7 py-3.5 rounded-2xl font-bold text-sm border border-white/20 transition-all"
                                >
                                    Keunggulan Kami <ArrowRight size={13} />
                                </motion.button>
                            </a>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Slide dots */}
                <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-[10] flex gap-2">
                    {BG_FALLBACK.map((_, i) => (
                        <button key={i} onClick={() => setCurrentBg(i)}
                            className={`rounded-full transition-all duration-500 ${currentBg === i ? 'w-8 h-2 bg-emerald-400' : 'w-2 h-2 bg-white/30 hover:bg-white/60'}`} />
                    ))}
                </div>
            </div>

            {/* ══ STATS — GLASS CARDS ════════════════════════════════════════════ */}
            <div className="max-w-7xl mx-auto px-6 sm:px-10 -mt-8 mb-28 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((s, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.6 }}
                            whileHover={{ y: -4 }}
                            className="bg-white rounded-2xl p-6 shadow-lg shadow-emerald-900/5 border border-emerald-100/80 hover:border-emerald-300/60 hover:shadow-xl transition-all duration-300 cursor-default flex flex-col items-center justify-center min-h-[120px] text-center"
                        >
                            <div className="text-2xl font-black text-slate-800 leading-tight">
                                {s.val === 'Puas & Aman' ? (
                                    s.val
                                ) : (
                                    <AnimatedCounter target={parseInt(s.val)} suffix={s.suffix} />
                                )}
                            </div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">{s.lbl}</div>
                        </motion.div>
                    ))}
                </div>
            </div>


            {/* ══ KEUNGGULAN — SPLIT LAYOUT (gambar kiri + konten kanan) ══════════ */}
            <div id="keunggulan" className="max-w-7xl mx-auto px-6 sm:px-10 pb-28">
                <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* KIRI — Foto klinik (lebih kecil) */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative flex justify-center"
                    >
                        {/* Gambar — lebih kecil dengan max-w */}
                        <div className="relative rounded-3xl overflow-hidden shadow-xl shadow-emerald-900/10 aspect-[3/4] w-full max-w-xs">
                             <img
                                 src="/Ruang Tunggu 2.jpeg"
                                 alt="Fasilitas Nauli Dental Care"
                                 className="w-full h-full object-cover"
                             />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                        </div>

                        {/* Badge mengambang di sudut kiri bawah */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="absolute -bottom-4 left-2 bg-white rounded-2xl p-3 shadow-xl border border-emerald-100"
                        >
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <ShieldCheck size={16} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-800">Higienis</p>
                                    <p className="text-[10px] text-slate-400">Steril & Bersih</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Badge kecil mengambang di kanan atas */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 }}
                            className="absolute -top-3 right-2 bg-emerald-500 rounded-xl px-3 py-2 shadow-lg"
                        >
                            <p className="text-white text-xs font-black">Est. 2021</p>
                            <p className="text-emerald-100 text-[9px] font-bold uppercase tracking-wide">Balige, Toba</p>
                        </motion.div>
                    </motion.div>

                    {/* KANAN — Judul + daftar fitur */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8"
                    >
                        {/* Header */}
                        <div>
                            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-full mb-4">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                <span className="text-emerald-600 font-black text-xs uppercase tracking-widest">Mengapa Memilih Kami</span>
                            </div>
                            <h2 className="text-4xl font-black text-slate-800 tracking-tight leading-tight">
                                Keunggulan <span className="text-emerald-600">Layanan</span> Kami
                            </h2>
                            <p className="text-slate-500 text-sm mt-4 leading-relaxed">
                                Kami mengutamakan pelayanan yang ramah, peralatan yang memadai, serta kebersihan yang terjaga demi memberikan perawatan gigi terbaik untuk Anda di Balige.
                            </p>
                        </div>

                        {/* Daftar fitur — tanpa icon, langsung teks + penjelasan */}
                        <div className="space-y-6 divide-y divide-slate-100">
                            {features.map((f, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1, duration: 0.5 }}
                                    className={`group ${i > 0 ? 'pt-6' : ''}`}
                                >
                                    {/* Nomor + Judul */}
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">0{i + 1}</span>
                                        <h3 className="text-sm font-black text-slate-800 group-hover:text-emerald-600 transition-colors">{f.title}</h3>
                                    </div>
                                    {/* Deskripsi singkat */}
                                    <p className="text-xs font-semibold text-slate-600 mb-1.5 leading-relaxed">{f.desc}</p>
                                    {/* Penjelasan panjang */}
                                    <p className="text-xs text-slate-400 leading-relaxed">{f.detail}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* CTA kecil */}
                        <Link href="/patient/services">
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-900/20"
                            >
                                Lihat Semua Layanan <ArrowRight size={14} />
                            </motion.button>
                        </Link>
                    </motion.div>

                </div>
            </div>



            {/* ══ GALERI — MASONRY IMMERSIVE ════════════════════════════════════ */}
            <div className="border-t border-emerald-100/80 py-28 bg-white">
                <div className="max-w-7xl mx-auto px-6 sm:px-10">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-4"
                    >
                        <div>
                            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-full mb-4">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                <span className="text-emerald-600 font-black text-xs uppercase tracking-widest">Galeri Klinik</span>
                            </div>
                            <h2 className="text-4xl font-black text-slate-800 tracking-tight">
                                Fasilitas <span className="text-emerald-600">Klinik</span> Kami
                            </h2>
                            <p className="text-slate-500 text-sm mt-2 max-w-sm leading-relaxed">
                                Disediakan untuk kenyamanan dan kebersihan pasien selama menjalani perawatan.
                            </p>
                        </div>
                        <Link href="/patient/services">
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className="flex items-center gap-2 border border-emerald-200 text-emerald-600 hover:bg-emerald-50 px-5 py-2.5 rounded-xl font-bold text-sm transition-all"
                            >
                                Lihat Semua Layanan <ArrowRight size={13} />
                            </motion.button>
                        </Link>
                    </motion.div>

                    {/* Gallery grid dengan teks di bawah */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {gallery.map((g, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.6 }}
                                onHoverStart={() => setHoveredGallery(i)}
                                onHoverEnd={() => setHoveredGallery(null)}
                                className="flex flex-col group cursor-pointer"
                            >
                                {/* Gambar */}
                                <div className="relative rounded-2xl overflow-hidden shadow-md aspect-[4/3]">
                                    <motion.img
                                        src={g.src}
                                        className="w-full h-full object-cover"
                                        alt={g.label}
                                        animate={{ scale: hoveredGallery === i ? 1.08 : 1 }}
                                        transition={{ duration: 0.6, ease: 'easeOut' }}
                                    />

                                    {/* Gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                                    {/* Emerald shine on hover */}
                                    <motion.div
                                        className="absolute inset-0 bg-emerald-500/15"
                                        animate={{ opacity: hoveredGallery === i ? 1 : 0 }}
                                        transition={{ duration: 0.3 }}
                                    />

                                    {/* Label di dalam gambar */}
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <p className="text-[9px] font-black text-white/60 uppercase tracking-widest mb-0.5">{g.desc}</p>
                                        <p className="text-sm font-black text-white uppercase tracking-wide">{g.label}</p>
                                    </div>

                                    {/* Corner badge on hover */}
                                    <motion.div
                                        className="absolute top-3 right-3"
                                        animate={{ opacity: hoveredGallery === i ? 1 : 0, scale: hoveredGallery === i ? 1 : 0.8 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
                                            Klinik Nauli
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Teks deskripsi di BAWAH gambar */}
                                <motion.div
                                    className="pt-4 px-1"
                                    animate={{ opacity: 1 }}
                                >
                                    {/* Judul */}
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-1 h-4 bg-emerald-500 rounded-full flex-shrink-0" />
                                        <h4 className="text-sm font-black text-slate-800 uppercase tracking-wide group-hover:text-emerald-600 transition-colors">{g.label}</h4>
                                    </div>
                                    {/* Sub-label */}
                                    <span className="inline-block bg-emerald-50 border border-emerald-100 text-emerald-600 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full mb-2">
                                        {g.desc}
                                    </span>
                                    {/* Detail teks */}
                                    <p className="text-xs text-slate-500 leading-relaxed">
                                        {g.detail}
                                    </p>
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ══ INFO KLINIK — SPLIT LAYOUT ════════════════════════════════════ */}
            <div className="py-28 bg-[#f4f9f6] border-t border-emerald-100">
                <div className="max-w-7xl mx-auto px-6 sm:px-10">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-16 text-center"
                    >
                        <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-full mb-4">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                            <span className="text-emerald-600 font-black text-xs uppercase tracking-widest">Tentang Klinik</span>
                        </div>
                        <h2 className="text-4xl font-black text-slate-800 tracking-tight">
                            Informasi <span className="text-emerald-600">Klinik</span> Kami
                        </h2>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-16 items-start mb-20">
                        {/* Kiri — narasi */}
                        <motion.div
                            initial={{ opacity: 0, x: -24 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                            className="space-y-7"
                        >
                            {/* Quote block */}
                            <div className="relative pl-6 border-l-4 border-emerald-500">
                                <Quote size={28} className="text-emerald-200 absolute -top-2 -left-2" />
                                <p className="text-slate-700 text-lg leading-relaxed font-medium">
                                    <span className="text-emerald-600 font-black">Nauli Dental Care</span> adalah klinik gigi modern yang berlokasi di Balige, Sumatera Utara.
                                </p>
                            </div>

                            <p className="text-slate-500 text-base leading-relaxed">
                                Didirikan pada 2012, kami berkomitmen menghadirkan layanan kesehatan gigi berkualitas tinggi untuk masyarakat Toba dan sekitarnya. Dengan dukungan lebih dari 7 dokter spesialis dan sistem booking online yang praktis, kami memastikan setiap pasien mendapatkan pelayanan terbaik — cepat, aman, dan nyaman.
                            </p>

                            {/* Komitmen checklist */}
                            <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm">
                                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-5">Komitmen Kami</p>
                                <div className="grid grid-cols-1 gap-3">
                                    {values.map((v, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.07 }}
                                            className="flex items-center gap-3 group"
                                        >
                                            <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-all">
                                                <CheckCircle2 size={13} className="text-emerald-500 group-hover:text-white transition-colors" />
                                            </div>
                                            <span className="text-sm text-slate-600 group-hover:text-slate-800 transition-colors">{v}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Kanan — kontak + jam */}
                        <motion.div
                            initial={{ opacity: 0, x: 24 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                            className="space-y-5"
                        >
                            {/* Kontak card */}
                            <div className="bg-white rounded-3xl p-7 border border-emerald-100 shadow-sm hover:shadow-lg transition-shadow">
                                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Kontak & Lokasi</p>
                                <div className="space-y-5">
                                    {[
                                        { icon: MapPin, label: 'Lokasi', val: 'Jl. Raja Paindoan No.20A, Balige, Toba, Sumatera Utara 22314', color: 'bg-emerald-50 text-emerald-600' },
                                        { icon: Phone, label: 'WhatsApp', val: '0812-6530-965', color: 'bg-green-50 text-green-600' },
                                        { icon: Mail, label: 'Email', val: 'booking@naulidental.com', color: 'bg-blue-50 text-blue-600' },
                                    ].map(({ icon: Icon, label, val, color }, i) => (
                                        <div key={i} className="flex items-start gap-4 group">
                                            <div className={`w-10 h-10 ${color} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                                                <Icon size={16} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
                                                <p className="text-slate-700 text-sm mt-0.5 font-semibold leading-snug">{val}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Jam operasional card */}
                            <div className="bg-white rounded-3xl p-7 border border-emerald-100 shadow-sm hover:shadow-lg transition-shadow">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center">
                                        <Clock size={16} className="text-emerald-600" />
                                    </div>
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Jam Operasional</p>
                                </div>
                                <div className="space-y-0">
                                    {[
                                        { day: 'Senin – Kamis', time: '10:00 – 19:00', status: 'open' },
                                        { day: 'Jumat', time: '10:00 – 19:00', status: 'open' },
                                        { day: 'Sabtu', time: '10:00 – 17:00', status: 'open' },
                                        { day: 'Minggu', time: 'Tutup', status: 'closed' },
                                    ].map((h, i) => (
                                        <div key={i} className={`flex items-center justify-between py-3 ${i < 3 ? 'border-b border-slate-50' : ''}`}>
                                            <span className="text-sm text-slate-600 font-medium">{h.day}</span>
                                            <span className={`text-xs font-bold px-3 py-1 rounded-full
                                                ${h.status === 'open' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-500 border border-red-100'}`}>
                                                {h.time}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 flex items-center gap-2 bg-emerald-50 rounded-2xl px-4 py-3">
                                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                    <span className="text-emerald-700 text-xs font-bold">Saat ini klinik sedang buka</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* ══ TRUST BAR ══════════════════════════════════════════════════════ */}
            <div className="py-16 bg-white border-t border-emerald-100">
                <div className="max-w-7xl mx-auto px-6 sm:px-10">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-center gap-8 text-center sm:text-left shadow-sm"
                    >
                        {[
                            { val: '4.0/5', lbl: 'Rating Google', icon: Star },
                            { val: '24', lbl: 'Ulasan Di google', icon: Smile },
                            { val: '98%', lbl: 'Rekomendasikan', icon: Heart },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white rounded-2xl border border-emerald-100 flex items-center justify-center shadow-sm">
                                    <item.icon size={16} className="text-emerald-600 fill-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-lg font-black text-slate-800">{item.val}</p>
                                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">{item.lbl}</p>
                                </div>
                                {i < 2 && <div className="hidden sm:block w-px h-10 bg-emerald-200 mx-4" />}
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* ══ CTA — IMMERSIVE BANNER ════════════════════════════════════════ */}
            <div className="py-24 bg-[#f4f9f6] border-t border-emerald-100">
                <div className="max-w-7xl mx-auto px-6 sm:px-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700 rounded-[2rem] px-10 py-16 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl shadow-emerald-900/30"
                    >
                        {/* Decorative circles */}
                        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full" />
                        <div className="absolute -bottom-16 -left-16 w-60 h-60 bg-white/5 rounded-full" />
                        <div className="absolute top-8 right-1/3 w-3 h-3 bg-emerald-300/40 rounded-full animate-pulse" />
                        <div className="absolute bottom-8 right-1/4 w-2 h-2 bg-teal-300/40 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />

                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 px-3 py-1.5 rounded-full mb-5 backdrop-blur-sm">
                                <Sparkles size={11} className="text-emerald-200" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-200">Konsultasi Pertama Gratis</span>
                            </div>
                            <h3 className="text-4xl font-black text-white tracking-tight leading-tight">
                                Siap memulai perjalanan<br />
                                <span className="text-emerald-200">senyum sehat</span> Anda?
                            </h3>
                            <p className="text-white/60 text-sm mt-4 max-w-sm leading-relaxed">
                                Daftarkan diri dan nikmati konsultasi pertama gratis bersama dokter spesialis kami. Booking mudah, cepat, dan online.
                            </p>
                        </div>

                        <div className="flex gap-3 flex-shrink-0 flex-wrap relative z-10">
                            <Link href="/patient/services">
                                <motion.button
                                    whileHover={{ scale: 1.04 }}
                                    whileTap={{ scale: 0.96 }}
                                    className="flex items-center gap-2 bg-white text-emerald-700 hover:bg-emerald-50 px-8 py-4 rounded-2xl font-black text-sm transition-all shadow-xl"
                                >
                                    Lihat Layanan <ArrowRight size={14} />
                                </motion.button>
                            </Link>
                            <Link href="/register">
                                <motion.button
                                    whileHover={{ scale: 1.04 }}
                                    whileTap={{ scale: 0.96 }}
                                    className="flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white px-8 py-4 rounded-2xl font-black text-sm transition-all backdrop-blur-sm"
                                >
                                    Daftar Gratis
                                </motion.button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ══ FOOTER ════════════════════════════════════════════════════════ */}
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

                        {/* Kolom 3: Office Address */}
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
                                <li className="flex items-center gap-3 group">
                                    <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-100 transition">
                                        <Activity size={13} className="text-emerald-500" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Status</p>
                                        <p className="text-slate-600 text-sm flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                            Buka (Senin - Sabtu)
                                        </p>
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