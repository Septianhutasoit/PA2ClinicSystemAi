'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
    MapPin, Phone, Award, Smile, Heart,
    Clock, Mail, Sparkles, ArrowRight,
    Play, ShieldCheck, Users, Star, Zap,
    CheckCircle2, Building2, CalendarDays, TrendingUp,
    ChevronRight, Activity, Quote, Tooth
} from 'lucide-react';
import Link from 'next/link';

const BG_FALLBACK = [
    'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2070',
    'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=2070',
    'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=2070',
];

const features = [
    {
        icon: ShieldCheck,
        title: 'Steril & Aman',
        desc: 'Alat sterilisasi berstandar internasional WHO dengan protokol kebersihan ketat setiap hari.',
        detail: 'Setiap alat disterilisasi menggunakan autoclave bersuhu tinggi sebelum dan sesudah digunakan. Ruangan dibersihkan dengan disinfektan medis setiap pergantian pasien, memastikan lingkungan bebas kuman dan aman untuk seluruh keluarga.',
        color: 'from-emerald-400 to-teal-500'
    },
    {
        icon: Zap,
        title: 'AI Diagnosis',
        desc: 'Teknologi deteksi dini karies dan kelainan gigi dengan akurasi 96% berbasis kecerdasan buatan.',
        detail: 'Sistem AI kami menganalisis foto rontgen dan scan gigi secara real-time untuk mendeteksi karies, radang gusi, dan kelainan struktur gigi lebih awal — memungkinkan penanganan lebih cepat sebelum kondisi memburuk.',
        color: 'from-violet-400 to-purple-500'
    },
    {
        icon: Heart,
        title: 'Ramah Pasien',
        desc: 'Prosedur minim rasa sakit dengan pendekatan personal, nyaman, dan penuh perhatian.',
        detail: 'Kami menggunakan teknik anestesi terkini dan pendekatan komunikasi yang lembut untuk memastikan setiap pasien — termasuk anak-anak dan lansia — merasa tenang dan nyaman selama perawatan berlangsung.',
        color: 'from-rose-400 to-pink-500'
    },
    {
        icon: Users,
        title: 'Tim Profesional',
        desc: '15+ dokter spesialis berpengalaman dan bersertifikat nasional siap melayani Anda.',
        detail: 'Seluruh dokter kami memiliki sertifikasi dari Konsil Kedokteran Indonesia dan menjalani pelatihan berkelanjutan. Dengan spesialisasi di berbagai bidang dental, kami siap menangani kasus sederhana hingga kompleks.',
        color: 'from-amber-400 to-orange-500'
    },
];

const gallery = [
    {
        src: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=800',
        label: 'Ruang Perawatan',
        desc: 'Ruangan modern & steril',
        detail: 'Ruang perawatan kami dirancang dengan standar sterilisasi internasional WHO. Setiap sudut ruangan dijaga kebersihannya dan dilengkapi peralatan dental terkini untuk memastikan kenyamanan dan keamanan Anda.'
    },
    {
        src: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=800',
        label: 'Tim Dokter',
        desc: 'Spesialis berpengalaman',
        detail: 'Tim dokter kami terdiri dari 15+ spesialis gigi yang bersertifikat nasional. Setiap dokter memiliki pengalaman lebih dari 5 tahun di bidangnya, siap memberikan diagnosis yang akurat dan penanganan terbaik.'
    },
    {
        src: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=800',
        label: 'Peralatan Modern',
        desc: 'Teknologi AI terkini',
        detail: 'Kami menggunakan peralatan dental berteknologi AI terkini, termasuk sistem X-ray digital dan pemindai 3D intraoral, yang memungkinkan diagnosis lebih cepat, akurat, dan minim radiasi.'
    },
    {
        src: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?q=80&w=800',
        label: 'Ruang Tunggu',
        desc: 'Nyaman & bersih',
        detail: 'Ruang tunggu kami didesain dengan konsep modern dan nyaman. Dilengkapi AC, WiFi gratis, dan area bermain anak, kami memastikan pengalaman berkunjung ke klinik menjadi menyenangkan bagi seluruh keluarga.'
    },
];

const stats = [
    { val: '2024', lbl: 'Tahun Berdiri', icon: CalendarDays, suffix: '' },
    { val: '15', lbl: 'Dokter Spesialis', icon: Users, suffix: '+' },
    { val: '2.4K', lbl: 'Pasien Terlayani', icon: Smile, suffix: '+' },
    { val: '96', lbl: 'Tingkat Kepuasan', icon: TrendingUp, suffix: '%' },
];

const values = [
    'Pelayanan berbasis teknologi AI terkini',
    'Sterilisasi berstandar internasional WHO',
    'Konsultasi digital 24 jam via chatbot',
    'Tim dokter spesialis bersertifikat',
    'Booking online mudah & cepat',
    'Fasilitas modern & nyaman',
];

const testimonials = [
    { name: 'Rina Simanjuntak', role: 'Pasien Scaling', rating: 5, text: 'Pelayanan sangat profesional, dokternya ramah dan hasilnya memuaskan. Chatbot AI-nya sangat membantu untuk booking online.', avatar: 'R' },
    { name: 'Budi Tambunan', role: 'Pasien Behel', rating: 5, text: 'Fasilitas modern dan sangat bersih. Proses pemasangan behel sangat nyaman, tidak terasa sakit sama sekali. Sangat direkomendasikan!', avatar: 'B' },
    { name: 'Sari Hutabarat', role: 'Pasien Implan', rating: 5, text: 'Awalnya takut implan, tapi tim dokter sangat sabar menjelaskan seluruh prosedurnya. Hasilnya luar biasa, sangat puas!', avatar: 'S' },
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
                            Klinik gigi modern berbasis AI di Balige — menghadirkan perawatan
                            akurat, aman, dan nyaman untuk seluruh keluarga Anda sejak 2024.
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
                            className="bg-white rounded-2xl p-5 shadow-lg shadow-emerald-900/5 border border-emerald-100/80 hover:border-emerald-300/60 hover:shadow-xl transition-all duration-300 cursor-default"
                        >
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 flex items-center justify-center mb-4">
                                <s.icon size={18} className="text-emerald-600" />
                            </div>
                            <div className="text-2xl font-black text-slate-800 tabular-nums">
                                <AnimatedCounter target={s.val === '2024' ? 2024 : parseInt(s.val.replace('K', '000').replace('+', ''))} suffix={s.suffix} />
                            </div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{s.lbl}</div>
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
                                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=700"
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
                                    <p className="text-xs font-black text-slate-800">Standar WHO</p>
                                    <p className="text-[10px] text-slate-400">Sterilisasi Internasional</p>
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
                            <p className="text-white text-xs font-black">Est. 2024</p>
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
                                Kami menggabungkan teknologi AI mutakhir dengan sentuhan perawatan manusiawi
                                untuk pengalaman dental terbaik yang pernah Anda rasakan.
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
                                Fasilitas <span className="text-emerald-600">Premium</span> Kami
                            </h2>
                            <p className="text-slate-500 text-sm mt-2 max-w-sm leading-relaxed">
                                Didesain untuk kenyamanan dan keamanan pasien dengan standar internasional.
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
                                    <span className="text-emerald-600 font-black">Nauli Dental Care</span> adalah klinik gigi modern berbasis kecerdasan buatan (AI) yang berlokasi di Balige, Sumatera Utara.
                                </p>
                            </div>

                            <p className="text-slate-500 text-base leading-relaxed">
                                Didirikan pada 2024, kami berkomitmen menghadirkan layanan kesehatan gigi berkualitas tinggi dengan teknologi terkini untuk masyarakat Toba dan sekitarnya. Dengan dukungan lebih dari 15 dokter spesialis dan sistem booking digital 24 jam, kami memastikan setiap pasien mendapatkan pelayanan terbaik — cepat, aman, dan nyaman.
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

            {/* ══ TESTIMONI ══════════════════════════════════════════════════════ */}
            <div className="py-28 bg-white border-t border-emerald-100">
                <div className="max-w-7xl mx-auto px-6 sm:px-10">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-14 text-center"
                    >
                        <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 px-4 py-2 rounded-full mb-4">
                            <Star size={12} className="text-amber-500 fill-amber-500" />
                            <span className="text-amber-600 font-black text-xs uppercase tracking-widest">Testimoni Pasien</span>
                        </div>
                        <h2 className="text-4xl font-black text-slate-800 tracking-tight">
                            Apa Kata <span className="text-emerald-600">Pasien</span> Kami
                        </h2>
                        <p className="text-slate-400 text-sm mt-2">Kepuasan pasien adalah prioritas utama kami</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {testimonials.map((t, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.12, duration: 0.6 }}
                                whileHover={{ y: -5 }}
                                className="group bg-[#f4f9f6] rounded-3xl p-7 border border-emerald-100 hover:border-emerald-300 hover:bg-white hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-400 cursor-default"
                            >
                                {/* Stars */}
                                <div className="flex gap-1 mb-5">
                                    {Array(t.rating).fill(0).map((_, s) => (
                                        <Star key={s} size={14} className="text-amber-400 fill-amber-400" />
                                    ))}
                                </div>

                                {/* Quote */}
                                <div className="relative mb-6">
                                    <Quote size={20} className="text-emerald-200 mb-2" />
                                    <p className="text-slate-600 text-sm leading-relaxed">"{t.text}"</p>
                                </div>

                                {/* Profile */}
                                <div className="flex items-center gap-3 pt-5 border-t border-emerald-100">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-black text-base shadow-md">
                                        {t.avatar}
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-slate-800">{t.name}</p>
                                        <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wide">{t.role}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Trust bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-12 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-center gap-6 text-center sm:text-left"
                    >
                        {[
                            { val: '4.9/5', lbl: 'Rating Google', icon: Star },
                            { val: '2.4K+', lbl: 'Pasien Puas', icon: Smile },
                            { val: '96%', lbl: 'Rekomendasikan', icon: Heart },
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