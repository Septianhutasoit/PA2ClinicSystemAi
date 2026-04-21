'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { motion } from 'framer-motion';
import { 
    CalendarClock, Clock, MapPin, 
    Loader2, UserCircle, Search, 
    CalendarCheck, AlertCircle
} from 'lucide-react';

export default function SchedulesPage() {
    const [doctors, setDoctors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const res = await api.get('/clinic/doctors');
            setDoctors(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredDoctors = doctors.filter(doc => 
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
                    <CalendarClock className="text-blue-500" /> Manajemen Jadwal
                </h1>
                <p className="text-sm text-slate-400 mt-0.5">
                    Lihat dan atur jadwal praktek seluruh dokter aktif
                </p>
            </div>

            {/* Search */}
            <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    placeholder="Cari dokter atau spesialisasi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-blue-500" size={40} />
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDoctors.map((doctor: any, idx: number) => (
                        <motion.div
                            key={doctor.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
                        >
                            {/* Doctor Info Header */}
                            <div className="p-5 border-b border-slate-50 bg-gradient-to-r from-blue-50/30 to-transparent flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm">
                                    <img 
                                        src={doctor.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${doctor.name}`} 
                                        className="w-full h-full object-cover"
                                        alt={doctor.name}
                                    />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-800 leading-tight">{doctor.name}</h3>
                                    <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mt-0.5">{doctor.specialty}</p>
                                </div>
                            </div>

                            {/* Schedule Content */}
                            <div className="p-5 space-y-4">
                                {!doctor.schedules || doctor.schedules.length === 0 ? (
                                    <div className="flex flex-col items-center py-4 text-slate-300">
                                        <AlertCircle size={20} />
                                        <p className="text-[10px] font-bold mt-1 uppercase">Belum ada jadwal</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {doctor.schedules.map((sch: any, sIdx: number) => (
                                            <div key={sIdx} className="bg-slate-50/50 rounded-xl p-3 border border-slate-50">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="px-2 py-0.5 bg-white border border-slate-100 rounded text-[10px] font-black text-slate-600 uppercase">
                                                        {sch.day}
                                                    </span>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center gap-2 text-xs text-slate-600">
                                                        <Clock size={12} className="text-blue-500" />
                                                        <span className="font-medium">{sch.time}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                                        <MapPin size={12} />
                                                        <span className="truncate">{sch.loc}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Action Footer */}
                            <div className="p-3 bg-slate-50/30 border-t border-slate-50 flex justify-center">
                                <button 
                                    className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-800 transition-colors"
                                    onClick={() => window.location.href = '/admin/doctors'}
                                >
                                    Edit di Manajemen Staff
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {!isLoading && filteredDoctors.length === 0 && (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
                    <CalendarCheck size={40} className="mx-auto text-slate-200 mb-3" />
                    <p className="text-slate-400 text-sm font-medium">Dokter tidak ditemukan</p>
                </div>
            )}
        </div>
    );
}
