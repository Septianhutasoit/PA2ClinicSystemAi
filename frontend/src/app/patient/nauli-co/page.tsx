'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    MessageCircle, ArrowRight, Instagram,
    Globe, Phone, Mail, MapPin, CheckCircle2, Clock, ChevronLeft
} from 'lucide-react';

export default function NauliCoPage() {
    const [activeTab, setActiveTab] = useState('About');

    const navItems = ['About', 'What\'s New', 'Register as Partner', 'Contact'];

    return (
        <div className="min-h-screen bg-white font-sans text-slate-800">

            {/* ─── SUB-NAVBAR NAULICO ─── */}
                <nav className="fixed top-[72px] left-0 right-0 z-[80] bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
                    <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            {/* TOMBOL KEMBALI KE BERANDA UTAMA */}
                            <Link href="/patient/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all group">
                                <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                                <span className="text-xs font-bold uppercase tracking-widest">Portal Utama</span>
                            </Link>

                            <div className="h-4 w-px bg-slate-200" /> {/* Divider */}

                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-[10px] font-black italic">N</div>
                                <span className="text-sm font-black tracking-tighter text-blue-900 uppercase">Nauli<span className="text-blue-500">Co</span></span>
                            </div>
                        </div>

                        {/* Menu Navigasi NauliCo */}
                        <div className="hidden md:flex items-center gap-6">
                            {navItems.map((item) => (
                                <button
                                    key={item}
                                    onClick={() => setActiveTab(item)}
                                    className={`text-[10px] font-black uppercase tracking-[0.1em] transition-colors ${activeTab === item ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>
                </nav>

            <main className="pt-40 pb-20 px-6">
                <div className="max-w-7xl mx-auto">

                    {/* ─── HERO SECTION (BIRU MUDA) ─── */}
                    <section className="relative bg-[#E3F2FD] rounded-[3rem] overflow-hidden min-h-[500px] flex items-center">
                        <div className="grid md:grid-cols-2 gap-10 p-10 md:p-20 w-full items-center">

                            {/* Teks Kiri */}
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6 z-10"
                            >
                                <h1 className="text-5xl md:text-6xl font-black text-[#01579B] leading-tight tracking-tighter">
                                    Are You Next?
                                </h1>
                                <p className="text-lg text-blue-700/80 font-medium leading-relaxed max-w-md">
                                    Jadilah bagian dari gerakan yang tidak hanya mendukung passion-mu, tetapi juga mengedukasi masyarakat tentang pentingnya kesehatan gigi yang lebih baik!
                                </p>
                                <p className="text-slate-600 leading-relaxed max-w-md">
                                    Nauli Co. adalah komunitas kreatif yang lahir dari semangat Nauli Dental, sebuah klinik gigi terpercaya yang berkomitmen memberikan layanan terbaik.
                                </p>

                                <div className="flex gap-4 pt-4">
                                    <button className="bg-[#0288D1] text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-900 transition-all active:scale-95">
                                        Join Now!
                                    </button>
                                </div>
                            </motion.div>

                            {/* Gambar Kanan (Gunakan gambar dokter/model Anda) */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative flex justify-center"
                            >
                                <img
                                    src="/images/doctors.jpg" // Ganti dengan path gambar Anda
                                    className="w-full max-w-md md:max-w-lg object-cover rounded-[2rem] shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700"
                                    alt="NauliCo Community"
                                />
                            </motion.div>
                        </div>

                        {/* Floating Decoration */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full -mr-20 -mt-20 blur-3xl" />
                    </section>

                    {/* ─── CONTACT & INFO SECTION ─── */}
                    <section className="grid md:grid-cols-3 gap-10 mt-20">

                        {/* Info Klinik */}
                        <div className="md:col-span-2 space-y-8 bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100">
                            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Informasi <span className="text-blue-600">Klinik</span></h2>
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0"><MapPin className="text-blue-500" size={20} /></div>
                                    <p className="text-sm text-slate-500 leading-relaxed">Jl. Balige No. 12, Toba, Sumatera Utara (Depan Lapangan Sisingamangaraja)</p>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0"><Clock className="text-blue-500" size={20} /></div>
                                    <p className="text-sm text-slate-500 leading-relaxed font-bold">Senin - Sabtu<br /><span className="font-normal text-xs text-blue-600">08:00 - 20:00 WIB</span></p>
                                </div>
                            </div>
                            <div className="h-48 w-full bg-slate-200 rounded-3xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
                                {/* Integrasi Google Maps bisa ditaruh di sini */}
                                <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold italic uppercase tracking-widest text-xs">Peta Lokasi Klinik</div>
                            </div>
                        </div>

                        {/* Hubungi Kami */}
                        <div className="bg-white border border-slate-100 shadow-xl shadow-slate-200/50 p-10 rounded-[2.5rem] flex flex-col justify-between">
                            <div className="space-y-6">
                                <h3 className="text-2xl font-black text-slate-800">Hubungi Kami</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-slate-500 hover:text-blue-600 transition-colors cursor-pointer">
                                        <Instagram size={18} /> <span className="text-sm font-bold">@nauli.dental</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-500 hover:text-blue-600 transition-colors cursor-pointer">
                                        <Globe size={18} /> <span className="text-sm font-bold">www.naulidental.co</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-500 hover:text-blue-600 transition-colors cursor-pointer">
                                        <Mail size={18} /> <span className="text-sm font-bold">halo@naulidental.co</span>
                                    </div>
                                </div>
                            </div>

                            <Link href="https://wa.me/0812345678" target="_blank">
                                <button className="w-full mt-10 bg-[#25D366] text-white py-4 rounded-2xl flex items-center justify-center gap-3 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-green-100 hover:scale-[1.02] transition-all">
                                    <MessageCircle size={18} /> Chat via WhatsApp
                                </button>
                            </Link>
                        </div>
                    </section>
                </div>
            </main>

            {/* ─── FLOATING BUTTONS (PROMO) ─── */}
            <div className="fixed bottom-10 left-10 z-[100] flex flex-col gap-3">
                <button className="bg-[#00BCD4] text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-2xl border-2 border-white/20">
                    Promo!
                </button>
                <button className="bg-blue-900 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-2xl border-2 border-white/20">
                    Join Now!
                </button>
            </div>

            {/* Floating WhatsApp ala gambar */}
            <Link href="#" className="fixed bottom-10 right-10 z-[100]">
                <div className="bg-[#25D366] w-16 h-16 rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-110 transition-transform">
                    <MessageCircle size={32} />
                </div>
            </Link>
        </div>
    );
}