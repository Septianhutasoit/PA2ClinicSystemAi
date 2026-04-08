'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Clock, ArrowLeft, X, Stethoscope, ChevronRight } from 'lucide-react';

export default function DoctorsPage() {
    const [doctors, setDoctors] = useState([]);
    const [selectedDoc, setSelectedDoc] = useState<any>(null); // State untuk detail
    const [filter, setFilter] = useState('Semua');
    const [search, setSearch] = useState('');

    const categories = ['Semua', 'Bedah Mulut', 'Endodontist', 'General Practitioner', 'Orthodontist', 'Perawat'];

    useEffect(() => {
        api.get('/clinic/doctors').then(res => setDoctors(res.data));
    }, []);

    const filteredDocs = doctors.filter(d =>
        (filter === 'Semua' || d.specialty === filter || d.role === filter) &&
        d.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#F8FBFF] pb-20 font-sans">
            {/* --- HEADER --- */}
            <header className="pt-20 pb-10 text-center space-y-2">
                <h1 className="text-4xl font-bold text-[#00609C]">Tim Dokter</h1>
                <p className="text-xl font-medium text-[#00609C]/80">Nauli Dental Care</p>
            </header>

            {/* --- FILTER & SEARCH --- */}
            <div className="max-w-7xl mx-auto px-6 space-y-6 mb-12">
                <div className="flex flex-wrap justify-center gap-2">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${filter === cat ? "bg-[#00609C] text-white border-[#00609C]" : "bg-white text-slate-600 border-slate-200 hover:border-[#00609C]"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="flex flex-col md:flex-row gap-4 justify-center">
                    <select className="p-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#00609C]/20 w-full md:w-64">
                        <option>Lokasi Dokter</option>
                        <option>Dentes Balige</option>
                        <option>Dentes Porsea</option>
                    </select>
                    <div className="relative w-full md:w-96">
                        <input
                            type="text"
                            placeholder="Cari Dokter..."
                            className="w-full p-3 pl-4 pr-10 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#00609C]/20"
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    </div>
                </div>
            </div>

            {/* --- GRID 4 COLUMN --- */}
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {filteredDocs.map((doc: any) => (
                    <motion.div
                        key={doc.id}
                        layoutId={`card-${doc.id}`}
                        onClick={() => setSelectedDoc(doc)}
                        className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden cursor-pointer group hover:shadow-xl transition-all"
                    >
                        <div className="aspect-[4/5] bg-blue-100 relative overflow-hidden">
                            <img
                                src={doc.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${doc.name}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                alt={doc.name}
                            />
                        </div>
                        <div className="p-5 space-y-2">
                            <div className="flex items-center gap-2 text-[#00609C]">
                                <Stethoscope size={14} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">{doc.specialty}</span>
                            </div>
                            <h3 className="font-bold text-slate-800 group-hover:text-[#00609C] transition-colors">{doc.name}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* --- DETAIL MODAL (Dentes Style) --- */}
            <AnimatePresence>
                {selectedDoc && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setSelectedDoc(null)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />

                        <motion.div
                            layoutId={`card-${selectedDoc.id}`}
                            className="relative w-full max-w-5xl bg-[#E6F4F9] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border-4 border-white"
                        >
                            {/* Tombol Back */}
                            <button
                                onClick={() => setSelectedDoc(null)}
                                className="absolute top-6 left-6 z-10 bg-white p-2 rounded-full shadow-md text-slate-400 hover:text-slate-900 transition-colors"
                            >
                                <ArrowLeft size={20} />
                            </button>

                            {/* Sisi Kiri: Foto */}
                            <div className="w-full md:w-2/5 p-8 flex items-center justify-center">
                                <div className="w-full aspect-[4/5] bg-white rounded-[2rem] p-2 shadow-sm border border-white">
                                    <img
                                        src={selectedDoc.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedDoc.name}`}
                                        className="w-full h-full object-cover rounded-[1.8rem]"
                                        alt={selectedDoc.name}
                                    />
                                </div>
                            </div>

                            {/* Sisi Kanan: Jadwal & Info */}
                            <div className="w-full md:w-3/5 p-8 md:p-12 space-y-6">
                                <div>
                                    <div className="flex items-center gap-2 text-[#00609C] mb-2">
                                        <Stethoscope size={18} />
                                        <span className="text-sm font-bold uppercase tracking-widest">{selectedDoc.specialty}</span>
                                    </div>
                                    <h2 className="text-4xl font-black text-[#00609C] leading-tight">{selectedDoc.name}</h2>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="font-bold text-[#00609C] text-lg border-b-2 border-[#00609C]/20 pb-2">Jadwal Praktek</h4>

                                    {/* Grid Jadwal Sesuai Gambar 2 */}
                                    <div className="space-y-3">
                                        {(selectedDoc.schedules || [
                                            { day: 'Senin', time: '16:00 - 21:00', loc: 'Dentes HOS Cokroaminoto' },
                                            { day: 'Selasa', time: '16:00 - 21:00', loc: 'Dentes Mrican' }
                                        ]).map((sch: any, i: number) => (
                                            <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-4 text-slate-700 text-sm py-1">
                                                <div className="flex items-center gap-2 w-28 font-bold">
                                                    <CalendarClock size={16} className="text-slate-400" /> {sch.day}
                                                </div>
                                                <div className="flex items-center gap-2 w-32 font-medium">
                                                    <Clock size={16} className="text-slate-400" /> {sch.time}
                                                </div>
                                                <div className="flex items-center gap-2 font-medium italic">
                                                    <MapPin size={16} className="text-slate-400" /> {sch.loc}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <button className="bg-[#00609C] text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-[#00609C]/20 hover:scale-105 transition-all">
                                        Daftar Sekarang
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Icon Helper
function CalendarClock({ size, className }: any) {
    return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>;
}