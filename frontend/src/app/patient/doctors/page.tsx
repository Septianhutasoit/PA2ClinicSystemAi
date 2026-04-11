'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Clock, ArrowLeft, X, Stethoscope, ChevronRight, Loader2, UserRound, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function DoctorsPage() {
    const [doctors, setDoctors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDoc, setSelectedDoc] = useState<any>(null);
    const [filter, setFilter] = useState('Semua');
    const [search, setSearch] = useState('');

    // Kategori disesuaikan dengan data yang mungkin diinput Admin
    const categories = ['Semua', 'Bedah Mulut', 'Orthodontist', 'Gigi Anak', 'Perawat'];

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await api.get('/clinic/doctors');
                setDoctors(res.data);
            } catch (err) {
                console.error("Gagal mengambil data dari database");
            } finally {
                setIsLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    // Logika Filter: Mengecek berdasarkan Spesialisasi ATAU Role (Nurse)
    const filteredDocs = doctors.filter((d: any) => {
        const matchFilter = filter === 'Semua' ||
            d.specialty.toLowerCase().includes(filter.toLowerCase()) ||
            d.role.toLowerCase() === filter.toLowerCase();
        const matchSearch = d.name.toLowerCase().includes(search.toLowerCase());
        return matchFilter && matchSearch;
    });

    return (
        <div className="min-h-screen bg-[#F8FBFF] pb-20 font-sans">
            {/* --- HEADER --- */}
            <header className="pt-20 pb-10 text-center space-y-2">
                <h1 className="text-4xl font-black text-[#00609C] tracking-tighter uppercase italic">Tim Medis Kami</h1>
                <p className="text-lg font-bold text-[#00609C]/60 uppercase tracking-widest">Nauli Dental Care Portal</p>
            </header>

            {/* --- FILTER & SEARCH --- */}
            <div className="max-w-7xl mx-auto px-6 space-y-6 mb-12">
                <div className="flex flex-wrap justify-center gap-3">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest border transition-all ${filter === cat
                                    ? "bg-[#00609C] text-white border-[#00609C] shadow-lg shadow-blue-200"
                                    : "bg-white text-slate-400 border-slate-200 hover:border-[#00609C] hover:text-[#00609C]"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="flex justify-center">
                    <div className="relative w-full max-w-xl group">
                        <input
                            type="text"
                            placeholder="Cari nama dokter atau spesialisasi..."
                            className="w-full p-4 pl-6 pr-12 bg-white border border-slate-100 rounded-2xl text-sm font-bold shadow-sm outline-none focus:ring-4 focus:ring-blue-50 transition-all italic"
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#00609C]" size={20} />
                    </div>
                </div>
            </div>

            {/* --- GRID 4 COLUMN (SESUAI PERMINTAAN) --- */}
            <div className="max-w-7xl mx-auto px-6">
                {isLoading ? (
                    <div className="py-20 text-center flex flex-col items-center gap-4">
                        <Loader2 className="animate-spin text-[#00609C]" size={40} />
                        <p className="font-black text-slate-300 uppercase tracking-widest">Sinkronisasi Data...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredDocs.map((doc: any) => (
                            <motion.div
                                key={doc.id}
                                layoutId={`card-${doc.id}`}
                                onClick={() => setSelectedDoc(doc)}
                                whileHover={{ y: -8 }}
                                className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-slate-50 overflow-hidden cursor-pointer group transition-all"
                            >
                                <div className="aspect-[4/5] bg-slate-100 relative overflow-hidden">
                                    <img
                                        src={doc.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${doc.name}`}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        alt={doc.name}
                                    />
                                    <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black text-[#00609C] uppercase tracking-tighter border border-white">
                                        {doc.role}
                                    </div>
                                </div>
                                <div className="p-6 space-y-1 text-center">
                                    <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest">{doc.specialty}</p>
                                    <h3 className="font-black text-slate-800 text-base leading-tight uppercase italic group-hover:text-[#00609C] transition-colors">{doc.name}</h3>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {!isLoading && filteredDocs.length === 0 && (
                    <div className="py-20 text-center opacity-30 italic font-bold text-slate-400">
                        Tidak ada data ditemukan untuk kategori ini.
                    </div>
                )}
            </div>

            {/* --- DETAIL MODAL (ANIMASI TERBANG) --- */}
            <AnimatePresence>
                {selectedDoc && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setSelectedDoc(null)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                        />

                        <motion.div
                            layoutId={`card-${selectedDoc.id}`}
                            className="relative w-full max-w-5xl bg-[#E6F4F9] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border-[6px] border-white"
                        >
                            {/* Tombol Close */}
                            <button
                                onClick={() => setSelectedDoc(null)}
                                className="absolute top-6 right-6 z-10 bg-white p-3 rounded-2xl shadow-lg text-slate-400 hover:text-red-500 transition-all active:scale-90"
                            >
                                <X size={20} />
                            </button>

                            {/* Sisi Kiri: Foto Profil */}
                            <div className="w-full md:w-2/5 p-8">
                                <div className="w-full aspect-[4/5] bg-white rounded-[2.5rem] p-3 shadow-2xl border border-white overflow-hidden">
                                    <img
                                        src={selectedDoc.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedDoc.name}`}
                                        className="w-full h-full object-cover rounded-[2rem]"
                                        alt={selectedDoc.name}
                                    />
                                </div>
                            </div>

                            {/* Sisi Kanan: Jadwal dari Database Admin */}
                            <div className="w-full md:w-3/5 p-8 md:p-12 flex flex-col">
                                <div className="mb-8">
                                    <div className="inline-flex items-center gap-2 text-[#00609C] bg-white px-3 py-1 rounded-full mb-4 border border-blue-100 shadow-sm">
                                        <Stethoscope size={14} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{selectedDoc.specialty}</span>
                                    </div>
                                    <h2 className="text-4xl font-black text-[#00609C] leading-[0.9] tracking-tighter italic uppercase">{selectedDoc.name}</h2>
                                    <p className="text-slate-400 font-bold text-xs mt-3 uppercase tracking-widest">{selectedDoc.experience || '3+'} Tahun Pengalaman Medis</p>
                                </div>

                                <div className="flex-1">
                                    <h4 className="font-black text-[#00609C] text-xs uppercase tracking-[0.3em] mb-6 border-b-2 border-white pb-2 inline-block">Jadwal Praktik Mingguan</h4>

                                    <div className="space-y-4">
                                        {/* Mengambil data schedules (JSONB) yang diinput Admin */}
                                        {(selectedDoc.schedules && selectedDoc.schedules.length > 0) ? (
                                            selectedDoc.schedules.map((sch: any, i: number) => (
                                                <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white/40 p-4 rounded-2xl border border-white/60">
                                                    <div className="flex items-center gap-3 w-32 font-black text-[#00609C] text-sm italic">
                                                        <CalendarClock size={18} className="text-blue-400" /> {sch.day}
                                                    </div>
                                                    <div className="flex items-center gap-3 w-40 font-bold text-slate-700 text-sm">
                                                        <Clock size={18} className="text-blue-400" /> {sch.time}
                                                    </div>
                                                    <div className="flex items-center gap-3 font-bold text-slate-500 text-xs uppercase tracking-tighter">
                                                        <MapPin size={16} className="text-blue-400" /> {sch.loc}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="italic text-slate-400 text-sm font-bold uppercase tracking-widest">Jadwal belum dikonfigurasi admin.</p>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-10">
                                    <Link href="/patient/dashboard">
                                        <button className="w-full md:w-auto bg-[#00609C] text-white px-12 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-blue-900/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 group">
                                            Booking Sekarang <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Icon Helper untuk Tampilan Rapi
function CalendarClock({ size, className }: any) {
    return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>;
}