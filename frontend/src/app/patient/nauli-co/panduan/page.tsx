'use client';
import { motion } from 'framer-motion';
import {
    ArrowRight, MapPin, Clock, Stethoscope,
    Instagram, Facebook, CheckCircle2,
    CalendarCheck, Smartphone, Sparkles, MessageCircle,
    Heart, BadgeCheck, Navigation, Info
} from 'lucide-react';
import Link from 'next/link';

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay },
});

const SERVICES = [
    "Pembersihan karang gigi (Scaling)",
    "Penambalan gigi estetis (Sinar/Komposit)",
    "Pemutihan gigi (Bleaching)",
    "Perawatan gigi anak (Topical Fluoride)",
    "Konsultasi Gigi Berlubang & Abses",
    "Kerapian Gigi (Orthodontic Consultation)",
];

const JOURNEY = [
    {
        step: "01",
        title: "Reservasi Online atau via WhatsApp",
        icon: Smartphone,
        color: "#10B981",
        points: [
            "Buka portal pasien Nauli Dental atau hubungi kami via WhatsApp.",
            "Pilih cabang klinik, tanggal kunjungan, dan dokter spesialis yang tersedia.",
            "Isi data diri dan keluhan singkat agar dokter dapat mempersiapkan pemeriksaan.",
            "Reservasi selesai dalam kurang dari 2 menit — tanpa antri, tanpa kerumitan.",
        ],
    },
    {
        step: "02",
        title: "Konfirmasi Jadwal & Persiapan Kunjungan",
        icon: CalendarCheck,
        color: "#059669",
        points: [
            "Tim kami akan mengirimkan konfirmasi jadwal melalui WhatsApp.",
            "Pengingat otomatis dikirim sehari sebelum kunjungan agar Anda tidak lupa.",
            "Hadir 15 menit lebih awal untuk proses registrasi dan pengisian rekam medis.",
            "Pastikan membawa kartu identitas dan, jika ada, dokumen riwayat perawatan gigi sebelumnya.",
        ],
    },
    {
        step: "03",
        title: "Pemeriksaan & Tindakan oleh Dokter Ahli",
        icon: Stethoscope,
        color: "#047857",
        points: [
            "Dokter spesialis melakukan pemeriksaan menyeluruh pada kondisi gigi dan mulut Anda.",
            "Diagnosis disampaikan secara jelas beserta pilihan rencana perawatan yang tersedia.",
            "Tindakan dilakukan dengan peralatan modern dan standar sterilisasi internasional.",
            "Setelah selesai, dokter memberikan panduan perawatan lanjutan yang perlu diikuti di rumah.",
        ],
    },
];

export default function GuideAndHistoryPage() {
    return (
        <div className="min-h-screen bg-[#ECFDF5]">

            {/* ══════════════════════════
                HERO
            ══════════════════════════ */}
            <section className="relative w-full min-h-screen flex items-start overflow-hidden -mt-24 pt-24 bg-[#ECFDF5]">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-200/40 rounded-full blur-[120px] pointer-events-none -translate-y-1/4 translate-x-1/4" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-200/30 rounded-full blur-[120px] pointer-events-none translate-y-1/3 -translate-x-1/3" />

                <div className="max-w-7xl mx-auto px-6 sm:px-10 w-full pt-32 pb-20 relative z-10">
                    <div className="grid md:grid-cols-2 gap-12 items-center">

                        {/* Left */}
                        <motion.div
                            initial={{ opacity: 0, y: 28 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                            className="space-y-6"
                        >
                            <div className="inline-flex items-center gap-2 bg-emerald-100 border border-emerald-200 px-4 py-2 rounded-full">
                                <Sparkles size={13} className="text-emerald-700" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Profil & Panduan Klinik</span>
                            </div>

                            <h1 className="text-6xl sm:text-7xl lg:text-[5.5rem] font-black leading-[0.9] tracking-tighter text-[#005A32]">
                                Nauli<br />
                                <span className="text-emerald-500">Dental Care</span>
                            </h1>

                            <div className="space-y-3 max-w-md pt-1">
                                <p className="text-emerald-900/75 text-lg font-bold leading-relaxed">
                                    Penyedia layanan kesehatan gigi dan mulut terpercaya di Sumatera Utara.
                                </p>
                                <p className="text-slate-500 text-[15px] leading-relaxed">
                                    Kami hadir untuk membantu Anda mendapatkan senyum sehat dengan teknologi
                                    modern, tim dokter berpengalaman, dan proses yang mudah dari awal hingga akhir.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3 pt-2">
                                <Link href="/patient/appointments">
                                    <button className="group bg-[#006D44] text-white px-7 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-emerald-500/25 flex items-center gap-2 hover:bg-emerald-700 transition-all">
                                        Buat Janji Sekarang
                                        <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                                    </button>
                                </Link>
                                <a href="https://wa.me/628126530965" target="_blank" rel="noopener noreferrer">
                                    <button className="bg-white text-[#006D44] px-7 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest border border-emerald-200 hover:border-emerald-400 transition-all shadow-sm">
                                        Chat WhatsApp
                                    </button>
                                </a>
                            </div>
                        </motion.div>

                        {/* Right */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.75, delay: 0.2 }}
                            className="relative flex justify-center"
                        >
                            <div className="absolute inset-0 bg-emerald-300/20 rounded-full blur-[80px] pointer-events-none" />
                            <img
                                src="/images/doctors.jpg"
                                alt="Nauli Dental"
                                className="w-full max-w-[460px] rounded-[2.5rem] shadow-2xl border-8 border-white/70 relative z-10"
                            />
                            <div className="absolute bottom-6 left-4 z-20 bg-white rounded-2xl shadow-lg border border-emerald-100 px-4 py-3 flex items-center gap-3">
                                <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center">
                                    <BadgeCheck size={18} className="text-emerald-500" />
                                </div>
                                <div>
                                    <p className="text-slate-800 font-black text-sm leading-none">Terdaftar & Tersertifikasi</p>
                                    <p className="text-slate-400 text-[10px] mt-0.5">IDI · PDGI · Est. 2024</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════
                PANDUAN KUNJUNGAN
            ══════════════════════════ */}
            <section id="panduan" className="px-6 sm:px-10 py-20">
                <div className="max-w-4xl mx-auto">

                    <motion.div {...fadeUp()} className="text-center mb-14">
                        <div className="inline-flex items-center gap-2 bg-emerald-100 border border-emerald-200 px-4 py-2 rounded-full mb-4">
                            <CalendarCheck size={13} className="text-emerald-700" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Cara Berobat</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-[#005A32]">
                            Panduan <span className="text-emerald-500">Kunjungan</span>
                        </h2>
                        <p className="text-slate-500 text-sm mt-3 max-w-md mx-auto leading-relaxed">
                            Ikuti langkah berikut untuk mendapatkan perawatan gigi terbaik.
                            Prosesnya mudah, cepat, dan nyaman untuk Anda.
                        </p>
                    </motion.div>

                    <div className="space-y-5">
                        {JOURNEY.map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <motion.div key={i} {...fadeUp(i * 0.08)}>
                                    <div className="bg-white border border-emerald-100 rounded-3xl p-7 hover:border-emerald-300 hover:shadow-md transition-all">
                                        {/* Header */}
                                        <div className="flex items-center gap-4 mb-5">
                                            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white flex-shrink-0"
                                                style={{ backgroundColor: item.color }}>
                                                <Icon size={20} />
                                            </div>
                                            <div>
                                                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">
                                                    Langkah {item.step}
                                                </span>
                                                <h4 className="text-base font-black text-slate-800 leading-snug">{item.title}</h4>
                                            </div>
                                        </div>

                                        {/* Bullet points as plain text */}
                                        <div className="space-y-2.5 pl-1">
                                            {item.points.map((pt, j) => (
                                                <div key={j} className="flex items-start gap-3">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0 mt-2" />
                                                    <p className="text-sm text-slate-600 leading-relaxed">{pt}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Info note */}
                    <motion.div {...fadeUp(0.3)} className="mt-6 flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                        <Info size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-emerald-800 leading-relaxed">
                            <span className="font-bold">Catatan:</span> Untuk kunjungan pertama, disarankan datang tanpa makan berat minimal 1 jam sebelumnya.
                            Konsultasi pertama di Nauli Dental Care <span className="font-bold">GRATIS</span> tanpa biaya tambahan.
                        </p>
                    </motion.div>
                </div>
            </section>



            {/* ══════════════════════════
                LAYANAN
            ══════════════════════════ */}
            <section id="layanan" className="px-6 sm:px-10 py-16">
                <div className="max-w-5xl mx-auto">

                    <motion.div {...fadeUp()} className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 bg-emerald-100 border border-emerald-200 px-4 py-2 rounded-full mb-4">
                            <Heart size={13} className="text-emerald-700" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Layanan Kami</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-[#005A32]">
                            Layanan Medis <span className="text-emerald-500">Unggulan</span>
                        </h2>
                        <p className="text-slate-500 text-sm mt-3 max-w-md mx-auto">
                            Dari perawatan rutin hingga estetika, semua tersedia dalam satu klinik modern.
                        </p>
                        <div className="h-1 w-10 bg-emerald-500 rounded-full mx-auto mt-4" />
                    </motion.div>

                    <div className="grid sm:grid-cols-2 gap-3">
                        {SERVICES.map((service, i) => (
                            <motion.div key={i} {...fadeUp(i * 0.04)}
                                className="flex items-center gap-3.5 bg-white p-4 rounded-2xl border border-emerald-50 shadow-sm hover:border-emerald-300 hover:bg-emerald-50/30 transition-all group">
                                <div className="w-7 h-7 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-all">
                                    <CheckCircle2 className="text-emerald-500 group-hover:text-white transition-colors" size={15} />
                                </div>
                                <span className="text-sm font-semibold text-slate-700">{service}</span>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div {...fadeUp(0.3)} className="mt-8 text-center">
                        <Link href="/patient/services">
                            <button className="inline-flex items-center gap-2 text-emerald-600 font-bold text-sm border border-emerald-200 bg-white hover:border-emerald-400 hover:bg-emerald-50 px-6 py-3 rounded-2xl transition-all">
                                Lihat Semua Layanan
                                <ArrowRight size={14} />
                            </button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* ══════════════════════════
                CTA FINAL
            ══════════════════════════ */}
            <section className="px-6 sm:px-10 pb-32 pt-8">
                <div className="max-w-6xl mx-auto">
                    <motion.div {...fadeUp()}
                        className="bg-[#005A32] rounded-[2.5rem] p-10 md:p-16 text-white relative overflow-hidden text-center">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
                        <Sparkles className="absolute top-8 right-8 text-emerald-400/15" size={72} />

                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 bg-emerald-400/15 border border-emerald-400/25 px-4 py-1.5 rounded-full mb-6">
                                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-300">Konsultasi Gratis Hari Ini</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black mb-5 tracking-tight leading-tight">
                                Siap Mendapatkan<br />Senyum Impian Anda?
                            </h2>
                            <p className="text-emerald-100/60 max-w-lg mx-auto mb-10 text-[15px] leading-relaxed">
                                Jangan tunda kesehatan gigi Anda. Konsultasikan dengan tim ahli kami
                                secara gratis — tanpa antri, tanpa ribet.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <Link href="/patient/appointments">
                                    <button className="group bg-emerald-400 text-[#005A32] px-9 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-black/20 flex items-center gap-2 hover:bg-emerald-300 transition-all">
                                        Buat Janji Online
                                        <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                                    </button>
                                </Link>
                                <a href="https://wa.me/628126530965" target="_blank" rel="noopener noreferrer">
                                    <button className="bg-white/10 text-white px-9 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest border border-white/20 hover:bg-white/20 transition-all flex items-center gap-2">
                                        <MessageCircle size={13} /> WhatsApp
                                    </button>
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}