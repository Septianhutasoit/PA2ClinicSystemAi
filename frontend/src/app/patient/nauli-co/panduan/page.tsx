'use client';
import { motion } from 'framer-motion';
import {
    ArrowRight, MapPin, Clock, Stethoscope,
    Phone, Instagram, Facebook, CheckCircle2,
    CalendarCheck, Smartphone, Sparkles, MessageCircle,
    Users, Award, Star, Heart
} from 'lucide-react';
import Link from 'next/link';

/* ── Animation Helper ── */
const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
});

export default function GuideAndHistoryPage() {

    const services = [
        "Pembersihan karang gigi (Scaling)",
        "Penambalan gigi estetis (Sinar/Komposit)",
        "Pemutihan gigi (Bleaching)",
        "Perawatan gigi anak (Topical Fluoride)",
        "Konsultasi Gigi Berlubang & Abses",
        "Kerapian Gigi (Orthodontic Consultation)"
    ];

    const patientJourney = [
        {
            step: "01",
            title: "Reservasi Online",
            desc: "Daftar melalui portal atau WhatsApp kami untuk memilih jadwal dokter spesialis.",
            icon: Smartphone,
            color: "#10B981"
        },
        {
            step: "02",
            title: "Konfirmasi & Datang",
            desc: "Tim kami akan mengirimkan pengingat. Harap datang 15 menit sebelum jadwal.",
            icon: MapPin,
            color: "#059669"
        },
        {
            step: "03",
            title: "Pemeriksaan & Tindakan",
            desc: "Perawatan dilakukan oleh tim dokter ahli dengan standar sterilisasi internasional.",
            icon: Stethoscope,
            color: "#047857"
        }
    ];

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#ECFDF5' }}>

            {/* ══ HERO SECTION ── Sejarah & Profil ══ */}
            <section
                className="relative w-full min-h-screen flex items-start overflow-hidden -mt-24 pt-24"
                style={{ backgroundColor: '#ECFDF5' }}
            >
                {/* Orbs dekorasi */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-200/40 rounded-full blur-[100px] pointer-events-none -translate-y-1/4 translate-x-1/4" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-200/30 rounded-full blur-[100px] pointer-events-none translate-y-1/3 -translate-x-1/3" />

                <div className="max-w-7xl mx-auto px-6 sm:px-10 w-full pt-32 pb-20 relative z-10">
                    <div className="grid md:grid-cols-2 gap-10 items-center">

                        {/* ── Kiri: Teks ── */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                            className="space-y-6"
                        >
                            <div className="inline-flex items-center gap-2 bg-emerald-100 px-4 py-2 rounded-full">
                                <Sparkles size={14} className="text-emerald-700" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Profil & Panduan</span>
                            </div>
                            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter" style={{ color: '#005A32' }}>
                                Nauli<br />
                                <span className="text-emerald-500">Dental Care</span>
                            </h1>
                            <div className="space-y-4 max-w-md pt-2">
                                <p className="text-emerald-900/75 text-lg font-bold leading-relaxed italic">
                                    Penyedia layanan kesehatan gigi dan mulut terpercaya di Sumatera Utara.
                                </p>
                                <p className="text-slate-500 text-[15px] leading-relaxed">
                                    Mengedukasi masyarakat melalui perawatan estetika dan medis yang berkualitas,
                                    dengan dukungan teknologi modern untuk hasil yang lebih presisi.
                                </p>
                            </div>
                        </motion.div>

                        {/* ── Kanan: Foto ── */}
                        <motion.div {...fadeUp(0.2)} className="relative flex justify-center">
                            <div className="absolute inset-0 bg-emerald-300/20 rounded-full blur-[80px] pointer-events-none" />
                            <img
                                src="/images/doctors.jpg"
                                alt="Nauli Dental"
                                className="w-full max-w-[460px] rounded-[2.5rem] shadow-2xl border-8 border-white/70"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ══ STATS ══ */}
            <section className="px-6 sm:px-10 pb-16">
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { v: '1.500+', l: 'Pasien Terlayani', i: Users },
                            { v: '5 Th', l: 'Pengalaman', i: Award },
                            { v: '98%', l: 'Kepuasan', i: Star },
                        ].map((s, i) => (
                            <motion.div key={i} {...fadeUp(i * 0.05)} className="bg-white border border-emerald-100 rounded-2xl p-6 text-center shadow-sm">
                                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                                    <s.i size={18} />
                                </div>
                                <p className="text-2xl font-black text-emerald-700">{s.v}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{s.l}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ JARINGAN KLINIK (2 Kolom Bento Style) ══ */}
            <section className="px-6 sm:px-10 pb-24">
                <div className="max-w-6xl mx-auto">
                    <motion.div {...fadeUp()} className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 bg-emerald-100 px-4 py-2 rounded-full mb-4">
                            <MapPin size={14} className="text-emerald-700" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Jaringan Klinik</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight" style={{ color: '#005A32' }}>
                            Lokasi <span className="text-emerald-500">Kami</span>
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* CABANG BALIGE */}
                        <motion.div {...fadeUp(0.3)} className="bg-white rounded-[2.5rem] shadow-2xl shadow-emerald-900/10 border border-emerald-100 overflow-hidden group hover:shadow-xl transition-all">
                            <div className="p-8 md:p-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                                        <MapPin size={28} />
                                    </div>
                                    <span className="bg-emerald-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase">Pusat - Toba</span>
                                </div>
                                <h3 className="text-2xl font-black text-slate-800 mb-3 uppercase tracking-tight">Cabang Balige</h3>
                                <p className="text-slate-500 text-sm leading-relaxed mb-6 font-medium">
                                    Melayani pemeriksaan gigi umum hingga perawatan estetika wajah dan gigi di jantung Kabupaten Toba.
                                </p>
                                <div className="space-y-3 border-t border-slate-100 pt-5">
                                    <div className="flex gap-3 text-xs">
                                        <Clock size={16} className="text-emerald-500 shrink-0" />
                                        <span className="text-slate-600 font-semibold">Senin – Jumat: 10.00 – 20.00 WIB | Sabtu: 10.00 – 18.00 WIB</span>
                                    </div>
                                    <div className="flex gap-3 text-xs">
                                        <Stethoscope size={16} className="text-emerald-500 shrink-0" />
                                        <span className="text-slate-600">drg. Yetti M, drg. Sere S, drg. Domdom P.</span>
                                    </div>
                                </div>
                                <div className="mt-6 flex gap-3">
                                    <a href="https://wa.me/628126530965" className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold text-[11px] uppercase tracking-wider text-center hover:bg-emerald-700 transition shadow-lg shadow-emerald-200 flex items-center justify-center gap-2">
                                        <MessageCircle size={14} /> WhatsApp
                                    </a>
                                    <a href="https://instagram.com/dentalcare.nauli" className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-pink-500 transition border border-slate-100">
                                        <Instagram size={18} />
                                    </a>
                                </div>
                            </div>
                        </motion.div>

                        {/* CABANG TANAH JAWA */}
                        <motion.div {...fadeUp(0.4)} className="bg-white rounded-[2.5rem] shadow-2xl shadow-emerald-900/10 border border-emerald-100 overflow-hidden group hover:shadow-xl transition-all">
                            <div className="p-8 md:p-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                                        <MapPin size={28} />
                                    </div>
                                    <span className="bg-slate-800 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase">Cabang - Simalungun</span>
                                </div>
                                <h3 className="text-2xl font-black text-slate-800 mb-3 uppercase tracking-tight">Tanah Jawa</h3>
                                <p className="text-slate-500 text-sm leading-relaxed mb-6 font-medium">
                                    Klinik alternatif strategis yang berada di wilayah Simalungun, samping Kantor Pos Tanah Jawa.
                                </p>
                                <div className="space-y-3 border-t border-slate-100 pt-5">
                                    <div className="flex gap-3 text-xs">
                                        <Clock size={16} className="text-emerald-500 shrink-0" />
                                        <span className="text-slate-600 font-semibold">Senin – Sabtu: 13.00 – 20.00 WIB (Reservasi)</span>
                                    </div>
                                    <div className="flex gap-3 text-xs">
                                        <MapPin size={16} className="text-emerald-500 shrink-0" />
                                        <span className="text-slate-600">Ruko Putih, Samping Kantor Pos Tanah Jawa, Pematang-Tanahdjawah.</span>
                                    </div>
                                </div>
                                <div className="mt-6 flex gap-3">
                                    <a href="https://wa.me/6282276075793" className="flex-1 bg-slate-800 text-white py-3 rounded-xl font-bold text-[11px] uppercase tracking-wider text-center hover:bg-slate-900 transition shadow-lg shadow-slate-200 flex items-center justify-center gap-2">
                                        <MessageCircle size={14} /> WhatsApp
                                    </a>
                                    <a href="#" className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-blue-600 transition border border-slate-100">
                                        <Facebook size={18} />
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ══ LAYANAN KOMPREHENSIF ══ */}
            <section className="px-6 sm:px-10 py-16">
                <div className="max-w-5xl mx-auto">
                    <motion.div {...fadeUp()} className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 bg-emerald-100 px-4 py-2 rounded-full mb-4">
                            <Heart size={14} className="text-emerald-700" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Layanan Kami</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight" style={{ color: '#005A32' }}>
                            Layanan Medis <span className="text-emerald-500">Unggulan</span>
                        </h2>
                        <div className="h-1.5 w-12 bg-emerald-500 rounded-full mx-auto mt-4" />
                    </motion.div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        {services.map((service, i) => (
                            <motion.div key={i} {...fadeUp(i * 0.05)} className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-emerald-50 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all">
                                <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />
                                <span className="text-sm font-bold text-slate-700">{service}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ PANDUAN KUNJUNGAN (ALUR PASIEN) ══ */}
            <section className="px-6 sm:px-10 py-20 relative overflow-hidden">
                <div className="max-w-5xl mx-auto">
                    <motion.div {...fadeUp()} className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-emerald-100 px-4 py-2 rounded-full mb-4">
                            <CalendarCheck size={14} className="text-emerald-700" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Langkah Berobat</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight" style={{ color: '#005A32' }}>
                            Panduan <span className="text-emerald-500">Kunjungan</span>
                        </h2>
                        <p className="text-slate-500 text-sm mt-3 max-w-md mx-auto">Ikuti langkah mudah berikut untuk mendapatkan perawatan terbaik</p>
                    </motion.div>

                    <div className="relative">
                        {/* Garis Tengah Grafik */}
                        <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-1 bg-emerald-200/50 md:-translate-x-1/2 rounded-full" />

                        <div className="space-y-12">
                            {patientJourney.map((item, i) => {
                                const Icon = item.icon;
                                return (
                                    <motion.div
                                        key={i}
                                        {...fadeUp(i * 0.1)}
                                        className={`relative flex items-center justify-between md:justify-normal w-full group ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
                                    >
                                        {/* Point di tengah garis */}
                                        <div className="absolute left-[20px] md:left-1/2 w-4 h-4 bg-emerald-500 rounded-full border-4 border-[#ECFDF5] z-10 md:-translate-x-1/2 shadow-sm" />

                                        {/* Konten Card */}
                                        <div className="w-full md:w-[45%] ml-12 md:ml-0">
                                            <div className="bg-white p-6 rounded-3xl shadow-xl shadow-emerald-900/5 border border-white group-hover:border-emerald-200 transition-all">
                                                <div className="flex items-center gap-4 mb-3">
                                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white" style={{ backgroundColor: item.color }}>
                                                        <Icon size={22} />
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Step {item.step}</span>
                                                        <h4 className="text-lg font-black text-slate-800 leading-none">{item.title}</h4>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* ══ CTA SECTION ══ */}
            <section className="px-6 sm:px-10 pb-32">
                <div className="max-w-6xl mx-auto">
                    <motion.div {...fadeUp()} className="bg-[#005A32] rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden text-center">
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
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}