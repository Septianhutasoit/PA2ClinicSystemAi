'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import {
    MapPin, Phone, Clock, Mail, ArrowRight,
    CheckCircle, ExternalLink, Copy, Navigation,
    MessageCircle, Instagram, Globe
} from 'lucide-react';

/* ── Fade helper ── */
const FadeUp = ({ children, delay = 0, className = '' }: {
    children: React.ReactNode; delay?: number; className?: string;
}) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
        className={className}
    >
        {children}
    </motion.div>
);

/* ── Jam operasional ── */
const JAM_BUKA = [
    { hari: 'Senin', jam: '10.00 – 19.00', buka: true },
    { hari: 'Selasa', jam: '10.00 – 19.00', buka: true },
    { hari: 'Rabu', jam: '10.00 – 19.00', buka: true },
    { hari: 'Kamis', jam: '10.00 – 19.00', buka: true },
    { hari: 'Jumat', jam: '10.00 – 19.00', buka: true },
    { hari: 'Sabtu', jam: '10.00 – 17.00', buka: true },
    { hari: 'Minggu', jam: 'Tutup', buka: false },
];

const hariIni = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][new Date().getDay()];

export default function NauliCoContactPage() {
    const [copied, setCopied] = useState(false);
    const [form, setForm] = useState({ name: '', phone: '', message: '' });
    const [sent, setSent] = useState(false);

    const alamat = 'Jl. Raja Paindoan No.20A, Lumban Dolok Haume Bange, Kec. Balige, Toba, Sumatera Utara 22314';

    const copyAlamat = () => {
        navigator.clipboard.writeText(alamat);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        setSent(true);
        setTimeout(() => setSent(false), 4000);
        setForm({ name: '', phone: '', message: '' });
    };

    return (
        <div className="bg-white min-h-[calc(100vh-80px)]">

            {/* ══════════════════════════════════════════
                HERO HEADER
            ══════════════════════════════════════════ */}
            <section className="bg-gradient-to-br from-[#006D44] via-[#00897B] to-[#006D44] px-6 py-16 md:py-20">
                <div className="max-w-4xl mx-auto text-center">
                    <FadeUp>
                        <span className="inline-block text-[10px] font-black uppercase tracking-[0.25em] text-emerald-300 mb-4">
                            Hubungi Kami
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
                            Kami Siap <span className="text-emerald-300">Melayani</span> Anda
                        </h1>
                        <p className="text-white/60 text-base max-w-md mx-auto">
                            Kunjungi klinik kami atau hubungi langsung — tim kami siap membantu kebutuhan kesehatan gigi Anda.
                        </p>
                    </FadeUp>

                    {/* Quick contact pills */}
                    <FadeUp delay={0.1} className="flex flex-wrap gap-3 justify-center mt-8">
                        <a href="tel:+6281265309659"
                            className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/20 text-white text-sm font-bold px-5 py-2.5 rounded-full transition-all">
                            <Phone size={14} /> 0812-6530-965
                        </a>
                        <a href={`https://wa.me/6281265309659`} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20b558] text-white text-sm font-bold px-5 py-2.5 rounded-full transition-all shadow-lg shadow-green-900/30">
                            <MessageCircle size={14} /> Chat WhatsApp
                        </a>
                    </FadeUp>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                MAIN CONTENT
            ══════════════════════════════════════════ */}
            <section className="max-w-6xl mx-auto px-6 py-14 grid lg:grid-cols-[1fr_1.1fr] gap-10">

                {/* ── KOLOM KIRI: Info + Jam ── */}
                <div className="space-y-5">

                    {/* Alamat */}
                    <FadeUp>
                        <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 hover:shadow-md transition-all">
                            <div className="flex items-start gap-4">
                                <div className="w-11 h-11 rounded-2xl bg-[#006D44] flex items-center justify-center shrink-0 shadow-md shadow-emerald-200/50">
                                    <MapPin size={18} className="text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Alamat Klinik</p>
                                    <p className="text-sm font-bold text-slate-800 leading-relaxed">{alamat}</p>
                                    <div className="flex gap-2 mt-3 flex-wrap">
                                        {/* Buka di Maps */}
                                        <a
                                            href="https://maps.google.com/maps?q=2.3331763,99.0659975"
                                            target="_blank" rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 bg-[#006D44] hover:bg-emerald-700 text-white text-[11px] font-black px-3.5 py-2 rounded-xl transition-all shadow-sm"
                                        >
                                            <Navigation size={11} /> Buka di Maps
                                        </a>
                                        {/* Salin alamat */}
                                        <button onClick={copyAlamat}
                                            className={`inline-flex items-center gap-1.5 text-[11px] font-black px-3.5 py-2 rounded-xl transition-all border
                                                ${copied
                                                    ? 'bg-emerald-50 border-emerald-300 text-emerald-600'
                                                    : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700'}`}>
                                            {copied ? <><CheckCircle size={11} /> Tersalin!</> : <><Copy size={11} /> Salin Alamat</>}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FadeUp>

                    {/* Telepon */}
                    <FadeUp delay={0.06}>
                        <a href="tel:+6281265309659"
                            className="flex items-center gap-4 bg-slate-50 border border-slate-100 hover:border-emerald-200 hover:shadow-md rounded-3xl p-5 transition-all group">
                            <div className="w-11 h-11 rounded-2xl bg-[#006D44] flex items-center justify-center shrink-0 shadow-md shadow-emerald-200/50">
                                <Phone size={18} className="text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-0.5">Telepon</p>
                                <p className="text-lg font-black text-slate-800 tracking-tight">0812-6530-965</p>
                            </div>
                            <ExternalLink size={15} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
                        </a>
                    </FadeUp>

                    {/* WhatsApp */}
                    <FadeUp delay={0.09}>
                        <a href="https://wa.me/6281265309659" target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-4 bg-[#E8F5E9] border border-green-200 hover:border-green-400 hover:shadow-md rounded-3xl p-5 transition-all group">
                            <div className="w-11 h-11 rounded-2xl bg-[#25D366] flex items-center justify-center shrink-0 shadow-md shadow-green-200/60">
                                <MessageCircle size={18} className="text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] font-black text-green-700 uppercase tracking-widest mb-0.5">WhatsApp</p>
                                <p className="text-sm font-bold text-slate-700">Klik untuk chat langsung</p>
                            </div>
                            <ExternalLink size={15} className="text-green-300 group-hover:text-green-500 transition-colors" />
                        </a>
                    </FadeUp>

                    {/* Plus Code */}
                    <FadeUp delay={0.11}>
                        <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 rounded-3xl p-5">
                            <div className="w-11 h-11 rounded-2xl bg-slate-700 flex items-center justify-center shrink-0">
                                <Globe size={18} className="text-white" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Plus Code</p>
                                <p className="text-sm font-bold text-slate-700">83M8+69 Balige, Toba, Sumatera Utara</p>
                            </div>
                        </div>
                    </FadeUp>

                    {/* Jam Operasional */}
                    <FadeUp delay={0.13}>
                        <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-11 h-11 rounded-2xl bg-[#006D44] flex items-center justify-center shrink-0 shadow-md shadow-emerald-200/50">
                                    <Clock size={18} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Jam Operasional</p>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-xs font-bold text-emerald-600">Buka Sekarang</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                {JAM_BUKA.map((item) => {
                                    const isToday = item.hari === hariIni;
                                    return (
                                        <div key={item.hari}
                                            className={`flex items-center justify-between px-4 py-2.5 rounded-xl transition-all
                                                ${isToday ? 'bg-emerald-50 border border-emerald-200' : 'hover:bg-white'}`}>
                                            <span className={`text-sm font-bold ${isToday ? 'text-emerald-700' : 'text-slate-600'}`}>
                                                {item.hari}
                                                {isToday && <span className="ml-2 text-[9px] font-black bg-emerald-500 text-white px-1.5 py-0.5 rounded-full uppercase tracking-wide">Hari ini</span>}
                                            </span>
                                            <span className={`text-sm font-black ${item.buka ? isToday ? 'text-emerald-600' : 'text-slate-700' : 'text-red-400'}`}>
                                                {item.jam}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </FadeUp>
                </div>

                {/* ── KOLOM KANAN: Maps + Form ── */}
                <div className="space-y-5">

                    {/* Google Maps Embed */}
                    <FadeUp delay={0.08}>
                        <div className="rounded-3xl overflow-hidden border border-slate-100 shadow-lg shadow-slate-100/80 bg-slate-100">
                            {/* Maps header */}
                            <div className="bg-white px-5 py-3.5 flex items-center justify-between border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-400" />
                                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                                    <div className="w-3 h-3 rounded-full bg-green-400" />
                                </div>
                                <p className="text-xs font-bold text-slate-400">Nauli Dental Care — Balige</p>
                                <a href="https://maps.google.com/maps?q=2.3331763,99.0659975" target="_blank" rel="noopener noreferrer"
                                    className="text-[10px] font-black text-emerald-600 hover:underline flex items-center gap-1">
                                    Buka <ExternalLink size={10} />
                                </a>
                            </div>

                            {/* Iframe */}
                            <div className="relative w-full h-[320px]">
                                <iframe
                                    src="https://maps.google.com/maps?q=2.3331763,99.0659975&z=17&output=embed"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Nauli Dental Care Location"
                                    className="w-full h-full"
                                />
                            </div>

                            {/* Maps footer */}
                            <div className="bg-white px-5 py-3 flex items-center justify-between">
                                <p className="text-[11px] text-slate-400 font-medium">
                                    Jl. Raja Paindoan No.20A, Balige
                                </p>
                                <a href="https://maps.google.com/maps?q=2.3331763,99.0659975" target="_blank" rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 bg-[#006D44] hover:bg-emerald-700 text-white text-[11px] font-black px-4 py-2 rounded-xl transition-all shadow-sm">
                                    <Navigation size={11} /> Petunjuk Arah
                                </a>
                            </div>
                        </div>
                    </FadeUp>

                    {/* Form kirim pesan */}
                    <FadeUp delay={0.14}>
                        <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6">
                            <h3 className="text-base font-black text-slate-800 mb-1">Kirim Pesan</h3>
                            <p className="text-xs text-slate-400 mb-5">Kami akan membalas melalui WhatsApp dalam 1×24 jam.</p>

                            {sent ? (
                                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center justify-center py-10 gap-3">
                                    <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
                                        <CheckCircle size={28} className="text-emerald-500" />
                                    </div>
                                    <p className="text-sm font-black text-slate-700">Pesan Terkirim!</p>
                                    <p className="text-xs text-slate-400">Kami akan menghubungi Anda segera.</p>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSend} className="space-y-3">
                                    <div className="grid sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Nama</label>
                                            <input type="text" placeholder="Nama lengkap" required
                                                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">WhatsApp</label>
                                            <input type="text" placeholder="08xx-xxxx-xxxx" required
                                                value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Pesan</label>
                                        <textarea rows={3} placeholder="Pertanyaan atau keluhan Anda..." required
                                            value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all resize-none" />
                                    </div>
                                    <button type="submit"
                                        className="w-full bg-[#006D44] hover:bg-emerald-700 text-white font-black text-sm py-3.5 rounded-xl shadow-md shadow-emerald-200/50 hover:shadow-lg transition-all flex items-center justify-center gap-2">
                                        Kirim Pesan <ArrowRight size={15} />
                                    </button>
                                </form>
                            )}
                        </div>
                    </FadeUp>
                </div>
            </section>
        </div>
    );
}