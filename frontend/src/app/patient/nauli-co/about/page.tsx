'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    ArrowRight, CheckCircle, Users, Star, Award,
    Heart, Sparkles, MapPin, Search, CalendarCheck,
    Stethoscope, Smartphone, MousePointer2, Shield,
    Clock, Phone, Mail, Quote, ThumbsUp, TrendingUp,
    Smile, Activity
} from 'lucide-react';

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const, delay },
});

const slideInLeft = (delay = 0) => ({
    initial: { opacity: 0, x: -60 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const, delay },
});

const slideInRight = (delay = 0) => ({
    initial: { opacity: 0, x: 60 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const, delay },
});

export default function NauliCoAboutPage() {

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#ECFDF5' }}>

            {/* ══ HERO — Fullscreen Mint ══ */}
            <section
                className="relative w-full min-h-screen flex items-start overflow-hidden -mt-24 pt-24"
                style={{ backgroundColor: '#ECFDF5' }}
            >
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-200/40 rounded-full blur-[100px] pointer-events-none -translate-y-1/4 translate-x-1/4" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-200/30 rounded-full blur-[100px] pointer-events-none translate-y-1/3 -translate-x-1/3" />

                <div className="max-w-7xl mx-auto px-6 sm:px-10 w-full pt-32 pb-20 relative z-10">
                    <div className="grid md:grid-cols-2 gap-10 items-center">

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                            className="space-y-6"
                        >
                            <div className="inline-flex items-center gap-2 bg-emerald-100 px-4 py-2 rounded-full">
                                <Sparkles size={14} className="text-emerald-700" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Nauli Dental Care</span>
                            </div>
                            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter" style={{ color: '#005A32' }}>
                                Senyum Sehat<br />
                                <span className="text-emerald-500">Masa Depan Cerah</span>
                            </h1>
                            <div className="space-y-4 max-w-md pt-2">
                                <p className="text-emerald-900/75 text-lg font-bold leading-relaxed">
                                    Klinik gigi modern berbasis AI di Balige, Sumatera Utara.
                                </p>
                                <p className="text-slate-500 text-[15px] leading-relaxed">
                                    Kami berkomitmen memberikan layanan kesehatan gigi terbaik dengan dukungan teknologi AI modern
                                    untuk hasil yang lebih presisi dan pengalaman perawatan yang nyaman.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-3 pt-4">
                                <Link href="/patient/appointments">
                                    <button className="bg-[#006D44] text-white px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-emerald-400/30 flex items-center gap-2">
                                        Buat Janji <ArrowRight size={14} />
                                    </button>
                                </Link>
                                <Link href="/patient/contact">
                                    <button className="bg-white text-[#006D44] px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-md border border-emerald-200">
                                        Hubungi Kami
                                    </button>
                                </Link>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="relative flex justify-center"
                        >
                            <div className="absolute inset-0 bg-emerald-300/20 rounded-full blur-[80px] pointer-events-none" />
                            <img src="/images/doctors.jpg" alt="Nauli Dental" className="w-full max-w-[460px] rounded-[2.5rem] shadow-2xl border-8 border-white/70" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ══ TEKS AJAKAN DENGAN KARTU YANG SAMA ══ */}
            <section className="px-6 sm:px-10 py-20">
                <div className="max-w-6xl mx-auto">

                    {/* Header Section - Tengah */}
                    <motion.div {...fadeUp()} className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-emerald-100 px-4 py-2 rounded-full mb-4">
                            <Heart size={14} className="text-emerald-700" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Mengapa Memilih Nauli Dental</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight" style={{ color: '#005A32' }}>
                            Percayakan Kesehatan Gigi Anda<br />
                            <span className="text-emerald-500">Kepada Ahlinya</span>
                        </h2>
                    </motion.div>

                    <div className="space-y-16">

                        {/* Block 1: Quote - Kiri (Sama dengan gaya kartu manfaat) */}
                        <motion.div {...slideInLeft()} className="grid md:grid-cols-2 gap-8 items-center">
                            <div className="bg-white rounded-2xl p-8 shadow-lg border border-emerald-100">
                                <div className="flex items-start gap-4">
                                    <Quote size={40} className="text-emerald-400 shrink-0" />
                                    <div>
                                        <p className="text-slate-700 leading-relaxed mb-4">
                                            "Kesehatan gigi adalah cerminan dari kesehatan tubuh secara keseluruhan.
                                            Di Nauli Dental Care, kami percaya bahwa setiap orang berhak mendapatkan senyum sehat
                                            dan percaya diri tanpa harus khawatir dengan biaya atau rasa sakit."
                                        </p>
                                        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-emerald-100">
                                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                                <span className="text-emerald-600 font-black text-lg">N</span>
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800">Nauli Dental Care</p>
                                                <p className="text-xs text-slate-400">Est. 2024 · Balige, Sumatera Utara</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="hidden md:block"></div>
                        </motion.div>

                        {/* Block 2: Teks Ajakan - Kanan (Sama dengan gaya kartu manfaat) */}
                        <motion.div {...slideInRight()} className="grid md:grid-cols-2 gap-8 items-center">
                            <div className="hidden md:block"></div>
                            <div className="bg-white rounded-2xl p-8 shadow-lg border border-emerald-100">
                                <div className="space-y-4">
                                    <p className="text-slate-600 leading-relaxed">
                                        Dengan memilih <span className="font-bold text-emerald-600">Nauli Dental Care</span>, Anda tidak hanya mendapatkan perawatan gigi berkualitas,
                                        tetapi juga menjadi bagian dari gerakan masyarakat yang peduli terhadap pentingnya kesehatan gigi dan mulut.
                                        Kami menghadirkan pengalaman perawatan yang nyaman, modern, dan terjangkau untuk seluruh lapisan masyarakat di Balige dan sekitarnya.
                                    </p>
                                    <p className="text-slate-600 leading-relaxed pt-4 border-t border-emerald-100">
                                        Bersama <span className="font-bold text-emerald-600">Nauli Dental Care</span>, Anda akan merasakan perbedaan nyata dalam setiap kunjungan.
                                        Tim dokter spesialis kami tidak hanya ahli dalam bidangnya, tetapi juga memiliki kepedulian tinggi
                                        terhadap kenyamanan dan kebutuhan setiap pasien.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Block 3: Manfaat - Kiri (Sesuai dengan referensi gambar) */}
                        <motion.div {...slideInLeft()} className="grid md:grid-cols-2 gap-8 items-center">
                            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-100">
                                <h3 className="text-xl font-black text-emerald-800 mb-5 flex items-center gap-2">
                                    <TrendingUp size={22} className="text-emerald-600" />
                                    Manfaat Memilih Nauli Dental Care:
                                </h3>
                                <div className="space-y-4">
                                    {[
                                        { num: "1", title: "Konsultasi Pertama GRATIS", desc: "Tanpa biaya, tanpa komitmen." },
                                        { num: "2", title: "Teknologi AI Modern", desc: "Diagnosis lebih akurat dengan kecerdasan buatan." },
                                        { num: "3", title: "Booking Online 24/7", desc: "Mudah, cepat, kapan saja." },
                                        { num: "4", title: "Tim Dokter Spesialis", desc: "Berpengalaman di bidangnya." },
                                        { num: "5", title: "Harga Transparan & Terjangkau", desc: "Tanpa biaya tersembunyi." },
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-start gap-3">
                                            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center mt-0.5 shrink-0">
                                                <span className="text-white text-[10px] font-black">{item.num}</span>
                                            </div>
                                            <p className="text-sm text-slate-700">
                                                <span className="font-bold text-emerald-700">{item.title}</span> — {item.desc}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="hidden md:block"></div>
                        </motion.div>

                        {/* Block 4: Testimoni - Kanan (Sama dengan gaya kartu manfaat) */}
                        <motion.div {...slideInRight()} className="grid md:grid-cols-2 gap-8 items-center">
                            <div className="hidden md:block"></div>
                            <div className="bg-white rounded-2xl p-8 shadow-lg border border-emerald-100 text-center">
                                <div className="flex justify-center mb-4">
                                    <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={18} className="fill-amber-400 text-amber-400" />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-slate-600 italic leading-relaxed">
                                    "Pelayanan sangat memuaskan, dokter ramah dan profesional.
                                    Klinik bersih dan nyaman. Sangat rekomended untuk perawatan gigi di Balige!"
                                </p>
                                <p className="mt-3 font-bold text-slate-800">— Rina Simanjuntak, Pasien Nauli Dental</p>
                                <p className="text-xs text-slate-400 mt-1">⭐ 4.9/5 · 500+ ulasan Google Maps</p>
                            </div>
                        </motion.div>

                        {/* Block 5: Ajakan Penutup - Kiri (Sama dengan gaya kartu manfaat) */}
                        <motion.div {...slideInLeft()} className="grid md:grid-cols-2 gap-8 items-center">
                            <div className="bg-white rounded-2xl p-8 shadow-lg border border-emerald-100 text-center md:text-left">
                                <div className="flex items-center justify-center md:justify-start mb-4">
                                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                                        <Smile size={24} className="text-emerald-600" />
                                    </div>
                                </div>
                                <p className="text-slate-700 text-lg leading-relaxed mb-3">
                                    Jangan tunda lagi! Kesehatan gigi yang baik adalah investasi untuk masa depan Anda.
                                </p>
                                <p className="text-emerald-600 font-bold text-xl">
                                    Daftar sekarang dan rasakan pengalaman perawatan gigi modern!
                                </p>
                                <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-6">
                                    <Link href="/patient/appointments">
                                        <button className="bg-[#006D44] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-emerald-700 transition shadow-md flex items-center gap-2">
                                            Buat Janji Sekarang <ArrowRight size={14} />
                                        </button>
                                    </Link>
                                    <a href="https://wa.me/628126530965" target="_blank">
                                        <button className="bg-[#25D366] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#20b558] transition shadow-md flex items-center gap-2">
                                            Chat WhatsApp
                                        </button>
                                    </a>
                                </div>
                            </div>
                            <div className="hidden md:block"></div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ══ CTA SECTION FINAL ══ */}
            <section className="px-6 sm:px-10 pb-32">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="bg-[#005A32] rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden text-center"
                    >
                        <Sparkles className="absolute top-10 right-10 text-emerald-400/20" size={80} />
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">Siap Mendapatkan<br />Senyum Impian Anda?</h2>
                            <p className="text-emerald-100/60 max-w-xl mx-auto mb-10 font-medium">Jangan tunda kesehatan gigi Anda. Konsultasikan dengan tim ahli kami secara gratis hari ini.</p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <Link href="/patient/appointments">
                                    <button className="bg-emerald-400 text-[#005A32] px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-black/20 flex items-center gap-2">
                                        Buat Janji Online <ArrowRight size={14} />
                                    </button>
                                </Link>
                                <Link href="/patient/contact">
                                    <button className="bg-white/20 text-white px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest border border-white/30 hover:bg-white/30 transition-all">
                                        Hubungi Kami
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}