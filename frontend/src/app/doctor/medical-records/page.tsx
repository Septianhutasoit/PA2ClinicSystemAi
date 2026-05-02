'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, ClipboardList, User, Calendar,
    ChevronRight, FileText, Activity, X,
    Stethoscope, Pill, MapPin, Loader2
} from 'lucide-react';

export default function MedicalRecords() {
    const [records, setRecords] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRecord, setSelectedRecord] = useState<any>(null);

    useEffect(() => {
        // Mengambil data rekam medis yang tersimpan di Neon Cloud
        api.get('/clinic/medical-records')
            .then(res => setRecords(res.data))
            .catch(err => console.error(err))
            .finally(() => setIsLoading(false));
    }, []);

    const filteredRecords = records.filter((r: any) =>
        r.patient_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* --- HEADER & SEARCH --- */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-8 rounded-[2.5rem] border border-blue-50 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase italic flex items-center gap-3">
                        <ClipboardList className="text-emerald-500" /> Rekam Medis Elektronik
                    </h1>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Arsip Data Klinis Pasien Nauli Dental</p>
                </div>
                <div className="relative group w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Cari nama pasien atau ID..."
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold shadow-inner focus:ring-4 focus:ring-emerald-50 outline-none transition-all italic"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* --- LIST REKAM MEDIS --- */}
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-blue-900/5 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#F5FDF9]">
                        <tr>
                            <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-emerald-50">Data Pasien</th>
                            <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-emerald-50">Diagnosa Terakhir</th>
                            <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-emerald-50 text-center">Tgl Kunjungan</th>
                            <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-emerald-50 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {isLoading ? (
                            <tr><td colSpan={4} className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-emerald-600" /></td></tr>
                        ) : filteredRecords.map((r: any) => (
                            <tr key={r.id} className="group hover:bg-emerald-50/30 transition-all cursor-pointer" onClick={() => setSelectedRecord(r)}>
                                <td className="p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white border border-emerald-100 rounded-2xl flex items-center justify-center font-black text-emerald-600 shadow-sm uppercase italic">
                                            {r.patient_name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-800 text-[15px] uppercase italic leading-none">{r.patient_name}</p>
                                            <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase flex items-center gap-1"><User size={10} className="text-emerald-400" /> Pasien Member</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <p className="text-sm font-bold text-slate-600 line-clamp-1 italic">{r.diagnosis}</p>
                                    <p className="text-[10px] font-black text-emerald-500 uppercase mt-1 tracking-tighter">Tindakan: {r.treatment}</p>
                                </td>
                                <td className="p-6 text-center">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg border border-slate-100 text-[10px] font-bold text-slate-500 italic">
                                        <Calendar size={12} /> {new Date(r.created_at).toLocaleDateString('id-ID')}
                                    </div>
                                </td>
                                <td className="p-6 text-right">
                                    <button className="p-2.5 bg-white border border-slate-100 text-slate-400 group-hover:text-emerald-600 group-hover:border-emerald-200 rounded-xl transition-all shadow-sm">
                                        <ChevronRight size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- MODAL DETAIL REKAM MEDIS --- */}
            <AnimatePresence>
                {selectedRecord && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9 }} className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl relative border-[6px] border-white overflow-hidden">
                            <button onClick={() => setSelectedRecord(null)} className="absolute top-6 right-6 bg-slate-50 p-2 rounded-xl text-slate-300 hover:text-red-500 transition-all"><X size={24} /></button>

                            <div className="p-10 bg-[#F5FDF9]">
                                <div className="flex items-center gap-6 mb-8">
                                    <div className="w-20 h-20 bg-emerald-500 rounded-[2rem] flex items-center justify-center text-white text-3xl font-black shadow-xl italic">
                                        {selectedRecord.patient_name.charAt(0)}
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black italic uppercase text-slate-800 tracking-tighter leading-none">{selectedRecord.patient_name}</h2>
                                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mt-3">Detail Konsultasi Medis</p>
                                    </div>
                                </div>

                                <div className="grid gap-6">
                                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-emerald-50">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase mb-2 flex items-center gap-2"><Stethoscope size={14} className="text-emerald-500" /> Diagnosa Dokter</h4>
                                        <p className="text-sm font-bold text-slate-700 leading-relaxed italic">&quot;{selectedRecord.diagnosis}&quot;</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-emerald-50">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase mb-2 flex items-center gap-2"><Activity size={14} className="text-emerald-500" /> Tindakan Medis (Treatment)</h4>
                                        <p className="text-sm font-black text-emerald-600">{selectedRecord.treatment}</p>
                                    </div>
                                    <div className="bg-slate-900 p-6 rounded-3xl shadow-xl text-white">
                                        <h4 className="text-[10px] font-black text-emerald-400 uppercase mb-2 flex items-center gap-2"><Pill size={14} /> Catatan & Saran Medis</h4>
                                        <p className="text-sm font-medium leading-relaxed italic text-slate-300">{selectedRecord.notes || "Tidak ada catatan tambahan."}</p>
                                    </div>
                                </div>

                                <div className="mt-10 flex justify-between items-center text-slate-400">
                                    <p className="text-[9px] font-black uppercase tracking-widest flex items-center gap-2"><MapPin size={12} /> Klinik Nauli Dental Care</p>
                                    <p className="text-[9px] font-black uppercase tracking-widest italic">{new Date(selectedRecord.created_at).toLocaleString('id-ID')}</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}