'use client';
import { useEffect, useState, useRef } from 'react';
import api from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Stethoscope, Sparkles, ShieldCheck,
    ArrowRight, Loader2, Activity,
    Clock, Award, Users, Calendar, Star, Heart,
    Zap, CheckCircle, Phone, X, Info, MapPin,
    DollarSign, Image as ImageIcon, ChevronLeft, ChevronRight
} from 'lucide-react';
import Link from 'next/link';

export default function PatientServicesPage() {
    const [services, setServices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isHovering, setIsHovering] = useState(false);
    const [selectedService, setSelectedService] = useState<any>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
    const sectionRef = useRef(null);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await api.get(`/clinic/services?t=${new Date().getTime()}`);
                setServices(res.data);
                console.log("Data layanan diperbarui dari cloud");
            } catch (err) {
                console.error("Gagal sinkronisasi:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchServices();
        window.addEventListener('focus', fetchServices);
        return () => window.removeEventListener('focus', fetchServices);
    }, []);

    const handleViewDetail = (service: any) => {
        setSelectedService(service);
        setCurrentGalleryIndex(0);
        setIsDetailOpen(true);
    };

    const nextGalleryImage = () => {
        const gallery = selectedService?.gallery_urls || [];
        if (gallery.length > 0) {
            setCurrentGalleryIndex((prev) => (prev + 1) % gallery.length);
        }
    };

    const prevGalleryImage = () => {
        const gallery = selectedService?.gallery_urls || [];
        if (gallery.length > 0) {
            setCurrentGalleryIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
        }
    };

    const stats = [
        { icon: Users, value: "10K+", label: "Pasien Puas", color: "text-blue-600", bg: "bg-blue-50" },
        { icon: Award, value: "15+", label: "Tahun Pengalaman", color: "text-emerald-600", bg: "bg-emerald-50" },
        { icon: Clock, value: "24/7", label: "Layanan Darurat", color: "text-purple-600", bg: "bg-purple-50" },
        { icon: Star, value: "4.9", label: "Rating Pasien", color: "text-amber-600", bg: "bg-amber-50" }
    ];

    const features = [
        { icon: Zap, title: "AI Technology", desc: "Diagnosis akurat dengan kecerdasan buatan", color: "blue" },
        { icon: ShieldCheck, title: "Steril & Aman", desc: "Alat sterilisasi berstandar internasional", color: "emerald" },
        { icon: Heart, title: "Ramah Lansia", desc: "Perawatan khusus untuk pasien lansia", color: "rose" },
        { icon: Calendar, title: "Booking Mudah", desc: "Janji temu online 24 jam", color: "purple" }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 font-sans selection:bg-blue-100">

            {/* HERO SECTION */}
            <section
                ref={sectionRef}
                className="relative min-h-screen w-full flex items-center overflow-hidden"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        className="absolute inset-0 w-full h-full"
                        animate={{ scale: isHovering ? 1.05 : 1 }}
                        transition={{ duration: 4, ease: [0.25, 0.1, 0.25, 1], repeat: isHovering ? Infinity : 0, repeatType: "reverse" }}
                        style={{ backgroundImage: "url('/images/layanan.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-12 lg:px-16">
                    <div className="max-w-md">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 mb-3">
                            <Sparkles size={8} className="text-blue-400" />
                            <span className="text-[7px] font-bold uppercase tracking-[0.15em] text-white/80">Nauli Dental Care</span>
                        </motion.div>
                        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
                            Layanan <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">Gigi Terpadu</span>
                        </motion.h1>
                        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-white/50 text-[11px] leading-relaxed mb-4 max-w-sm">
                            Inovasi perawatan gigi modern berbasis AI untuk hasil akurat, aman, dan tanpa rasa sakit.
                        </motion.p>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="flex gap-2">
                            <Link href="/patient/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-full font-bold text-[8px] uppercase tracking-wider transition-all flex items-center gap-1 shadow-lg shadow-blue-500/30">
                                Pesan Sekarang <ArrowRight size={8} />
                            </Link>
                            <a href="#services" className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white px-3 py-1.5 rounded-full font-bold text-[8px] uppercase tracking-wider transition-all flex items-center gap-1">
                                <Stethoscope size={8} /> Lihat Katalog
                            </a>
                        </motion.div>
                    </div>
                </div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
                    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                        <div className="w-1 h-2 bg-white/50 rounded-full mt-2 animate-bounce" />
                    </div>
                </motion.div>
            </section>

            {/* STATS SECTION */}
            <div className="relative z-20 -mt-16 max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                    {stats.map((stat, idx) => (
                        <motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} whileHover={{ y: -8 }} className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl shadow-black/5 border border-white/50 text-center group transition-all duration-300">
                            <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                <stat.icon size={28} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-800">{stat.value}</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* FEATURES SECTION */}
            <section className="max-w-7xl mx-auto px-6 py-24">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
                    <span className="text-blue-600 font-black text-xs uppercase tracking-[0.2em] bg-blue-50 px-4 py-2 rounded-full inline-block">Mengapa Memilih Kami</span>
                    <h2 className="text-3xl md:text-5xl font-black text-slate-800 mt-4 italic tracking-tight">Keunggulan <span className="text-blue-600">Layanan</span> Kami</h2>
                </motion.div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, idx) => {
                        const colorClasses = { blue: "from-blue-500 to-blue-600", emerald: "from-emerald-500 to-emerald-600", rose: "from-rose-500 to-rose-600", purple: "from-purple-500 to-purple-600" };
                        return (
                            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} whileHover={{ y: -8 }} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-lg hover:shadow-xl transition-all group">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[feature.color]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                    <feature.icon className="text-white" size={22} />
                                </div>
                                <h3 className="font-bold text-slate-800 text-lg">{feature.title}</h3>
                                <p className="text-sm text-slate-500 mt-2 leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </section>

            {/* SERVICES GRID */}
            <section id="services" className="py-16 px-6 max-w-7xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16 space-y-4">
                    <span className="text-emerald-600 font-black text-xs uppercase tracking-[0.3em] bg-emerald-50 px-4 py-2 rounded-full inline-block">Daftar Perawatan</span>
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter italic">Pilih <span className="text-emerald-600">Perawatan</span> Terbaik</h2>
                </motion.div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4"><Loader2 className="animate-spin text-blue-600" size={48} /><p className="font-black text-slate-400 uppercase tracking-widest text-xs">Memuat layanan...</p></div>
                ) : services.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((item: any, idx: number) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                whileHover={{ y: -10 }}
                                onClick={() => handleViewDetail(item)}
                                className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer"
                            >
                                <div className="relative h-56 overflow-hidden">
                                    <img src={item.image_url || 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=1974&auto=format&fit=crop'} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={item.name} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-lg">
                                        <p className="text-xs font-black text-emerald-600">Rp {item.price?.toLocaleString()}</p>
                                    </div>
                                    <div className="absolute bottom-4 left-4 bg-blue-600/90 backdrop-blur-sm rounded-lg px-3 py-1">
                                        <p className="text-[10px] font-black text-white uppercase tracking-wider flex items-center gap-1"><CheckCircle size={10} /> AI Verified</p>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-black text-slate-800 leading-tight mb-2">{item.name}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-4">{item.description}</p>
                                    <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                                        <div className="flex items-center gap-1.5"><Clock size={14} className="text-slate-400" /><span className="text-xs text-slate-500">30-60 menit</span></div>
                                        <div className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-500" /><span className="text-xs text-slate-500">Garansi</span></div>
                                    </div>
                                    <button className="w-full mt-5 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 group/btn shadow-lg">
                                        Booking Sekarang <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20"><Stethoscope size={60} className="mx-auto text-slate-200 mb-4" /><h3 className="text-xl font-black text-slate-400 uppercase tracking-widest">Belum Ada Layanan Tersedia</h3></div>
                )}
            </section>

            {/* DETAIL MODAL - Dengan Galeri Slider */}
            <AnimatePresence>
                {isDetailOpen && selectedService && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setIsDetailOpen(false)}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Gallery Slider */}
                            <div className="relative h-64 w-full overflow-hidden bg-slate-900">
                                {selectedService.gallery_urls && selectedService.gallery_urls.length > 0 ? (
                                    <>
                                        <img
                                            src={selectedService.gallery_urls[currentGalleryIndex]}
                                            className="w-full h-full object-contain bg-slate-900"
                                            alt={`Gallery ${currentGalleryIndex + 1}`}
                                        />
                                        {selectedService.gallery_urls.length > 1 && (
                                            <>
                                                <button
                                                    onClick={prevGalleryImage}
                                                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
                                                >
                                                    <ChevronLeft size={20} />
                                                </button>
                                                <button
                                                    onClick={nextGalleryImage}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
                                                >
                                                    <ChevronRight size={20} />
                                                </button>
                                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                                                    {selectedService.gallery_urls.map((_: string, idx: number) => (
                                                        <button
                                                            key={idx}
                                                            onClick={() => setCurrentGalleryIndex(idx)}
                                                            className={`w-1.5 h-1.5 rounded-full transition-all ${currentGalleryIndex === idx ? 'bg-white w-3' : 'bg-white/50'}`}
                                                        />
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <img
                                        src={selectedService.image_url || 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95'}
                                        className="w-full h-full object-cover"
                                        alt={selectedService.name}
                                    />
                                )}
                                <button
                                    onClick={() => setIsDetailOpen(false)}
                                    className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-all z-10"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <div className="flex justify-between items-start flex-wrap gap-3">
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-800">{selectedService.name}</h2>
                                        <p className="text-sm text-emerald-600 font-medium mt-1 flex items-center gap-1">
                                            <CheckCircle size={14} /> AI Verified Service
                                        </p>
                                    </div>
                                    <div className="bg-emerald-50 rounded-xl px-4 py-2">
                                        <p className="text-lg font-black text-emerald-600">Rp {selectedService.price?.toLocaleString()}</p>
                                    </div>
                                </div>

                                {/* Deskripsi */}
                                <div className="mt-5">
                                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Deskripsi Layanan</h4>
                                    <p className="text-sm text-slate-600 leading-relaxed">{selectedService.description}</p>
                                </div>

                                {/* Detail Info */}
                                {selectedService.detail_info && (
                                    <div className="mt-5">
                                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                                            <Info size={12} /> Detail Informasi
                                        </h4>
                                        <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{selectedService.detail_info}</p>
                                    </div>
                                )}

                                {/* Informasi Tambahan */}
                                <div className="mt-5 grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3 text-sm bg-slate-50 p-3 rounded-xl">
                                        <Clock size={16} className="text-emerald-500" />
                                        <div>
                                            <p className="text-[10px] text-slate-400">Durasi</p>
                                            <p className="font-medium text-slate-700">30-60 menit</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm bg-slate-50 p-3 rounded-xl">
                                        <ShieldCheck size={16} className="text-emerald-500" />
                                        <div>
                                            <p className="text-[10px] text-slate-400">Garansi</p>
                                            <p className="font-medium text-slate-700">1 bulan pasca perawatan</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm bg-slate-50 p-3 rounded-xl">
                                        <MapPin size={16} className="text-emerald-500" />
                                        <div>
                                            <p className="text-[10px] text-slate-400">Lokasi</p>
                                            <p className="font-medium text-slate-700">Nauli Dental Care</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm bg-slate-50 p-3 rounded-xl">
                                        <DollarSign size={16} className="text-emerald-500" />
                                        <div>
                                            <p className="text-[10px] text-slate-400">Pembayaran</p>
                                            <p className="font-medium text-slate-700">Cash / Transfer / BPJS</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Tombol Aksi */}
                                <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100">
                                    <Link href="/patient/dashboard" className="flex-1">
                                        <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-all">
                                            Booking Sekarang <ArrowRight size={16} />
                                        </button>
                                    </Link>
                                    <button
                                        onClick={() => setIsDetailOpen(false)}
                                        className="flex-1 flex items-center justify-center px-4 py-3 bg-slate-100 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-all"
                                    >
                                        Tutup
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* CTA SECTION */}
            <section className="max-w-7xl mx-auto mt-10 mb-20 px-6">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl">
                    <div className="absolute inset-0 opacity-10"><div className="absolute top-0 right-0 w-80 h-80 bg-blue-500 rounded-full blur-3xl" /><div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500 rounded-full blur-3xl" /></div>
                    <div className="relative z-10 p-10 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="text-center md:text-left"><div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4"><Activity size={16} className="text-blue-400" /><span className="text-[10px] font-black uppercase tracking-wider text-white">AI Assistant 24/7</span></div><h3 className="text-2xl md:text-3xl font-black text-white italic tracking-tight">Punya Pertanyaan Medis?</h3><p className="text-slate-300 text-sm mt-2 max-w-md">Tanyakan langsung pada asisten AI kami yang siap membantu Anda kapan saja, gratis!</p></div>
                        <div className="flex flex-col sm:flex-row gap-4"><button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-wider shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2"><Sparkles size={16} /> Buka Chatbot AI</button><button className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"><Phone size={16} /> Call Center</button></div>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}