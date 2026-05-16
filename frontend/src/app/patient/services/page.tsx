'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import {
    Stethoscope, Sparkles, ShieldCheck,
    ArrowRight, Loader2, Activity,
    Clock, Award, Users, Calendar, Star, Heart,
    Zap, CheckCircle, Phone, X, Info, MapPin,
    DollarSign, ChevronLeft, ChevronRight, Play,
    TrendingUp
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PatientServicesPage() {
    const router = useRouter();
    const [services, setServices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedService, setSelectedService] = useState<any>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
    const [isBooking, setIsBooking] = useState(false);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await api.get(`/clinic/services?t=${Date.now()}`);
                setServices(res.data);
            } catch (err) { console.error(err); }
            finally { setIsLoading(false); }
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
        const g = selectedService?.gallery_urls || [];
        if (g.length > 0) setCurrentGalleryIndex(p => (p + 1) % g.length);
    };
    const prevGalleryImage = () => {
        const g = selectedService?.gallery_urls || [];
        if (g.length > 0) setCurrentGalleryIndex(p => (p - 1 + g.length) % g.length);
    };

    const handleQuickBook = async () => {
        if (!selectedService) return;
        setIsBooking(true);
        let name = 'Pasien Baru', phone = 'Belum diisi';
        try {
            const u = await api.get('/auth/me');
            if (u.data?.full_name) name = u.data.full_name;
            if (u.data?.phone_number) phone = u.data.phone_number;
        } catch { /* silent */ }

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(10, 0, 0, 0);

        try {
            await api.post('/clinic/appointments', {
                patient_name: name,
                patient_phone: phone,
                doctor_name: `Layanan: ${selectedService.name}`,
                appointment_date: tomorrow.toISOString(),
                notes: 'Dokter akan ditentukan pihak klinik.',
            });
            setIsDetailOpen(false);
            router.push('/patient/appointments');
        } catch {
            alert('Gagal booking. Silakan coba menu Janji Temu.');
        } finally {
            setIsBooking(false);
        }
    };

    const features = [
        { icon: Zap, title: 'AI Technology', desc: 'Diagnosis akurat dengan kecerdasan buatan', color: 'bg-emerald-100', iconColor: 'text-emerald-600' },
        { icon: ShieldCheck, title: 'Steril & Aman', desc: 'Alat sterilisasi berstandar internasional', color: 'bg-teal-100', iconColor: 'text-teal-600' },
        { icon: Heart, title: 'Ramah Pasien', desc: 'Perawatan personal dan penuh perhatian', color: 'bg-emerald-100', iconColor: 'text-emerald-600' },
        { icon: Calendar, title: 'Booking Mudah', desc: 'Janji temu online 24 jam kapan saja', color: 'bg-teal-100', iconColor: 'text-teal-600' },
    ];

    return (
        /*
            TEMA: latar putih kehijauan (#EDF5F2 / #f0faf5) seperti gambar referensi.
            Bukan dark. Teks gelap (slate-800/900). Card putih bersih.
            Aksen emerald subtle — bukan dominan.
        */
        <div className="min-h-screen font-sans" style={{ backgroundColor: '#EDF5F2' }}>

            {/* ══ HERO — latar foto klinik dengan overlay terang ══════════ */}
            <div className="relative w-full h-screen min-h-[580px] overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="/images/layanan.jpg"
                        alt="Layanan Nauli Dental"
                        className="w-full h-full object-cover object-center"
                    />
                </div>
                {/* Overlay — kiri gelap, bawah fade ke #EDF5F2 */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#EDF5F2] via-transparent to-transparent opacity-90" />
                <div className="absolute bottom-0 left-0 right-0 h-52 bg-gradient-to-t from-[#EDF5F2] to-transparent" />

                {/* Hero content */}
                <div className="absolute inset-0 flex items-center">
                    <div className="max-w-7xl mx-auto px-6 sm:px-10 w-full pt-20">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="max-w-xl space-y-5"
                        >
                            <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 px-4 py-1.5 rounded-full backdrop-blur-sm">
                                <Sparkles size={12} className="text-emerald-300" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-white">
                                    Nauli Dental Care
                                </span>
                            </div>

                            <h1 className="text-5xl sm:text-6xl font-black text-white leading-none tracking-tighter">
                                Layanan Gigi<br />
                                <span className="text-emerald-300">Terpadu</span> Kami
                            </h1>

                            <p className="text-white/70 text-sm leading-relaxed max-w-sm">
                                Perawatan gigi modern dengan teknologi terkini untuk hasil akurat,
                                aman, dan nyaman bersama tim dokter spesialis kami.
                            </p>

                            <div className="flex items-center gap-3 pt-2">
                                <a href="#services">
                                    <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-emerald-900/20 active:scale-95">
                                        <Play size={14} className="fill-white" />
                                        Pilih Layanan
                                    </button>
                                </a>
                                <a href="#features">
                                    <button className="flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white px-6 py-3 rounded-2xl font-bold text-sm border border-white/20 transition-all">
                                        Keunggulan
                                        <ArrowRight size={14} />
                                    </button>
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2"
                >
                    <div className="w-6 h-10 border-2 border-slate-400/40 rounded-full flex justify-center">
                        <div className="w-1 h-2 bg-emerald-500/60 rounded-full mt-2 animate-bounce" />
                    </div>
                </motion.div>
            </div>

            {/* ══ FEATURES ═════════════════════════════════════════════════ */}
            <section id="features" className="max-w-7xl mx-auto px-6 sm:px-10 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-10"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-1 h-6 bg-emerald-500 rounded-full" />
                        <span className="text-emerald-600 font-black text-xs uppercase tracking-widest">
                            Mengapa Memilih Kami
                        </span>
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                        Keunggulan <span className="text-emerald-600">Layanan</span> Kami
                    </h2>
                    <p className="text-slate-500 text-sm mt-2 max-w-lg">
                        Kami menggabungkan teknologi modern dengan sentuhan pelayanan tulus.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08 }}
                            className="bg-white border border-emerald-100 rounded-2xl p-6
                                       hover:shadow-md hover:border-emerald-200 transition-all group"
                        >
                            <div className={`w-11 h-11 ${f.color} ${f.iconColor} rounded-xl
                                            flex items-center justify-center mb-4
                                            group-hover:scale-110 transition-transform`}>
                                <f.icon size={20} />
                            </div>
                            <h3 className="font-bold text-slate-800 text-sm mb-1">{f.title}</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ══ SERVICES GRID ════════════════════════════════════════════ */}
            <section id="services" className="max-w-7xl mx-auto px-6 sm:px-10 pb-24">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-10"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-1 h-6 bg-emerald-500 rounded-full" />
                        <span className="text-emerald-600 font-black text-xs uppercase tracking-widest">
                            Daftar Perawatan
                        </span>
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                        Pilih <span className="text-emerald-600">Perawatan</span> Terbaik
                    </h2>
                </motion.div>

                {isLoading ? (
                    <div className="py-20 flex flex-col items-center gap-4">
                        <Loader2 className="animate-spin text-emerald-500" size={36} />
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                            Memuat layanan...
                        </p>
                    </div>
                ) : services.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {services.map((item: any, idx: number) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.07 }}
                                whileHover={{ y: -5 }}
                                onClick={() => handleViewDetail(item)}
                                className="group bg-white border border-emerald-100 rounded-2xl overflow-hidden
                                           hover:shadow-xl hover:border-emerald-200 transition-all duration-300 cursor-pointer"
                            >
                                {/* Foto */}
                                <div className="relative h-52 overflow-hidden bg-slate-100">
                                    <img
                                        src={item.image_url || 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=800'}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        alt={item.name}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />

                                    {/* Harga badge */}
                                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-sm">
                                        <p className="text-xs font-black text-emerald-700">
                                            Rp {item.price?.toLocaleString()}
                                        </p>
                                    </div>

                                    {/* AI badge */}
                                    <div className="absolute top-3 left-3 bg-emerald-500/90 backdrop-blur-sm rounded-lg px-2.5 py-1">
                                        <p className="text-[10px] font-black text-white flex items-center gap-1">
                                            <CheckCircle size={9} /> AI Verified
                                        </p>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-5">
                                    <h3 className="text-base font-black text-slate-800 leading-tight mb-1">
                                        {item.name}
                                    </h3>
                                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-4">
                                        {item.description}
                                    </p>

                                    <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                                        <div className="flex items-center gap-1.5">
                                            <Clock size={12} className="text-emerald-500" />
                                            <span className="text-xs text-slate-500">30-60 menit</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <ShieldCheck size={12} className="text-emerald-500" />
                                            <span className="text-xs text-slate-500">Garansi 1 bulan</span>
                                        </div>
                                    </div>

                                    <button className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white
                                                       py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider
                                                       transition-all flex items-center justify-center gap-2
                                                       shadow-sm shadow-emerald-200 active:scale-95">
                                        Booking Sekarang
                                        <ArrowRight size={13} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center space-y-3">
                        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto">
                            <Stethoscope size={28} className="text-emerald-300" />
                        </div>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                            Belum ada layanan tersedia
                        </p>
                    </div>
                )}
            </section>

            {/* ══ CTA SECTION ══════════════════════════════════════════════ */}
            <section className="max-w-7xl mx-auto px-6 sm:px-10 pb-24">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-3xl px-8 md:px-12 py-12
                               flex flex-col md:flex-row items-center justify-between gap-8
                               shadow-xl shadow-emerald-900/15 relative overflow-hidden"
                >
                    {/* Dekorasi */}
                    <div className="absolute -top-16 -right-16 w-56 h-56 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                    <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-teal-400/15 rounded-full blur-2xl pointer-events-none" />

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 bg-white/15 px-3 py-1.5 rounded-full mb-4">
                            <Activity size={12} className="text-white/80" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/80">
                                AI Assistant 24/7
                            </span>
                        </div>
                        <h3 className="text-2xl font-black text-white tracking-tight">
                            Punya Pertanyaan Medis?
                        </h3>
                        <p className="text-white/65 text-sm mt-2 max-w-md leading-relaxed">
                            Tanyakan langsung pada asisten AI kami yang siap membantu Anda kapan saja, gratis!
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 shrink-0 relative z-10">
                        <button className="flex items-center gap-2 bg-white text-emerald-700 hover:bg-emerald-50
                                           px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-md active:scale-95">
                            <Sparkles size={15} /> Buka Chatbot AI
                        </button>
                        <button className="flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/25
                                           text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all">
                            <Phone size={15} /> Call Center
                        </button>
                    </div>
                </motion.div>
            </section>

            {/* ══ DETAIL MODAL — Portal agar blur full screen ═════════════ */}
            {typeof window !== 'undefined' && createPortal(
                <AnimatePresence>
                    {isDetailOpen && selectedService && (
                        <div
                            className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md p-4"
                            style={{ zIndex: 99999 }}
                            onClick={() => setIsDetailOpen(false)}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.96 }}
                                transition={{ duration: 0.2 }}
                                className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl relative
                                           overflow-hidden max-h-[90vh] overflow-y-auto border border-emerald-100"
                                onClick={e => e.stopPropagation()}
                            >
                                {/* Gallery */}
                                <div className="relative h-64 overflow-hidden bg-slate-100">
                                    {selectedService.gallery_urls?.length > 0 ? (
                                        <>
                                            <img
                                                src={selectedService.gallery_urls[currentGalleryIndex]}
                                                className="w-full h-full object-cover"
                                                alt={`Gallery ${currentGalleryIndex + 1}`}
                                            />
                                            {selectedService.gallery_urls.length > 1 && (
                                                <>
                                                    <button onClick={prevGalleryImage}
                                                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-700 p-2 rounded-full transition-all shadow">
                                                        <ChevronLeft size={18} />
                                                    </button>
                                                    <button onClick={nextGalleryImage}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-700 p-2 rounded-full transition-all shadow">
                                                        <ChevronRight size={18} />
                                                    </button>
                                                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                                                        {selectedService.gallery_urls.map((_: string, i: number) => (
                                                            <button key={i} onClick={() => setCurrentGalleryIndex(i)}
                                                                className={`h-1.5 rounded-full transition-all ${i === currentGalleryIndex ? 'w-4 bg-emerald-500' : 'w-1.5 bg-slate-300'}`}
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
                                        className="absolute top-4 right-4 bg-white/90 hover:bg-white p-2 rounded-xl
                                                   text-slate-500 hover:text-red-500 transition-all shadow z-10"
                                    >
                                        <X size={17} />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="p-6 space-y-5">
                                    <div className="flex justify-between items-start gap-3 flex-wrap">
                                        <div>
                                            <h2 className="text-xl font-black text-slate-800">{selectedService.name}</h2>
                                            <p className="text-xs text-emerald-600 font-bold mt-1 flex items-center gap-1">
                                                <CheckCircle size={12} /> AI Verified Service
                                            </p>
                                        </div>
                                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2">
                                            <p className="text-base font-black text-emerald-700">
                                                Rp {selectedService.price?.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                                            Deskripsi Layanan
                                        </p>
                                        <p className="text-sm text-slate-600 leading-relaxed">{selectedService.description}</p>
                                    </div>

                                    {selectedService.detail_info && (
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                                                <Info size={11} /> Detail Informasi
                                            </p>
                                            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                                                {selectedService.detail_info}
                                            </p>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { icon: Clock, label: 'Durasi', value: '30-60 menit' },
                                            { icon: ShieldCheck, label: 'Garansi', value: '1 bulan pasca perawatan' },
                                            { icon: MapPin, label: 'Lokasi', value: 'Nauli Dental Care' },
                                            { icon: DollarSign, label: 'Pembayaran', value: 'Cash / Transfer / BPJS' },
                                        ].map(({ icon: Icon, label, value }, i) => (
                                            <div key={i} className="flex items-center gap-3 bg-slate-50 border border-slate-100 p-3 rounded-xl">
                                                <Icon size={15} className="text-emerald-500 flex-shrink-0" />
                                                <div>
                                                    <p className="text-[10px] text-slate-400">{label}</p>
                                                    <p className="text-xs font-bold text-slate-700">{value}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex gap-3 pt-4 border-t border-slate-100">
                                        <button
                                            onClick={handleQuickBook}
                                            disabled={isBooking}
                                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-600
                                                       hover:bg-emerald-700 text-white rounded-xl text-sm font-bold
                                                       transition-all disabled:opacity-60 shadow-md shadow-emerald-200 active:scale-95"
                                        >
                                            {isBooking
                                                ? <Loader2 size={15} className="animate-spin" />
                                                : <>Booking Sekarang <ArrowRight size={14} /></>
                                            }
                                        </button>
                                        <button
                                            onClick={() => setIsDetailOpen(false)}
                                            className="flex-1 flex items-center justify-center py-3 bg-slate-100
                                                       text-slate-600 hover:bg-slate-200 rounded-xl text-sm font-bold transition-all"
                                        >
                                            Tutup
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
}