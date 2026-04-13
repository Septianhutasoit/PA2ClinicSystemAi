'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Search, Mail, Phone, MapPin,
    ShieldCheck, Eye, Trash2, X, Fingerprint,
    UserCheck, Loader2, ArrowRight
} from 'lucide-react';

export default function PatientsList() {
    const [patients, setPatients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPatient, setSelectedPatient] = useState<any>(null);

    useEffect(() => {
        api.get('/clinic/patients')
            .then(res => setPatients(res.data))
            .catch(err => console.error(err))
            .finally(() => setIsLoading(false));
    }, []);

    const filteredPatients = patients.filter((p: any) =>
        p.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.nik?.includes(searchTerm)
    );

return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-[2rem] border border-blue-50 shadow-sm">
                <div>
                    <h1 className="text-xl font-black text-slate-800 tracking-tight italic uppercase">Database Pasien</h1>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total: {patients.length} Pasien Terdaftar</p>
                </div>
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={16} />
                    <input
                        type="text"
                        placeholder="Cari Nama atau NIK..."
                        className="pl-11 pr-6 py-3 bg-[#F8FAFF] border border-slate-100 rounded-2xl text-xs font-bold w-full md:w-80 focus:ring-4 focus:ring-blue-50 outline-none transition-all italic"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* --- TABLE --- */}
            <div className="bg-white rounded-[2.5rem] border border-blue-50 shadow-xl shadow-blue-900/5 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#F5F9FF]">
                        <tr>
                            <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-blue-50">Data Pasien</th>
                            <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-blue-50">Kontak & NIK</th>
                            <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-blue-50 text-center">Gender</th>
                            <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-blue-50 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-50/50">
                        {isLoading ? (
                            <tr><td colSpan={4} className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-blue-600" /></td></tr>
                        ) : filteredPatients.map((p: any) => (
                            <tr key={p.id} className="group hover:bg-blue-50/30 transition-colors">
                                <td className="p-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black text-xs">
                                            {p.first_name?.charAt(0)}{p.last_name?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-800 text-[14px] uppercase italic">
                                                {p.first_name} {p.last_name}
                                            </p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                {p.gender || 'Pasien'}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-5 text-slate-600">
                                    <p className="text-[11px] font-bold">{p.email}</p>
                                    <p className="text-[10px] font-black text-blue-500 mt-1 italic">{p.phone_number}</p>
                                </td>
                                <td className="p-5">
                                    <p className="text-[11px] text-slate-500 font-medium italic leading-tight">
                                        {p.address || "Alamat belum dilengkapi."}
                                    </p>
                                </td>
                                <td className="p-5 text-right">
                                    <button onClick={() => setSelectedPatient(p)} className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
                                        <Eye size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- MODAL DETAIL PASIEN --- */}
            <AnimatePresence>
                {selectedPatient && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9 }} className="bg-[#F5F9FF] w-full max-w-lg rounded-[3rem] shadow-2xl relative border-[6px] border-white overflow-hidden">
                            <button onClick={() => setSelectedPatient(null)} className="absolute top-6 right-6 bg-white p-2 rounded-xl text-slate-300 hover:text-red-500 shadow-md"><X size={20} /></button>

                            {/* Card Header */}
                            <div className="p-8 bg-gradient-to-br from-indigo-600 to-blue-700 text-white">
                                <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-[2rem] flex items-center justify-center text-3xl font-black mb-4 shadow-xl">
                                    {selectedPatient.first_name.charAt(0)}
                                </div>
                                <h2 className="text-3xl font-black italic uppercase tracking-tighter leading-none">{selectedPatient.first_name} {selectedPatient.last_name}</h2>
                                <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest mt-2 flex items-center gap-2"><ShieldCheck size={14} /> Pasien Terverifikasi</p>
                            </div>

                            {/* Card Info Body */}
                            <div className="p-8 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-blue-50">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Nomor Identitas (NIK)</p>
                                        <p className="font-bold text-slate-700 text-sm mt-1">{selectedPatient.nik || 'Belum diisi'}</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-blue-50">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Jenis Kelamin</p>
                                        <p className="font-bold text-slate-700 text-sm mt-1">{selectedPatient.gender || '-'}</p>
                                    </div>
                                </div>

                                <div className="bg-white p-5 rounded-2xl shadow-sm border border-blue-50">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><MapPin size={10} /> Alamat Domisili</p>
                                    <p className="font-bold text-slate-700 text-sm mt-1 leading-relaxed italic">{selectedPatient.address || 'Alamat belum dilengkapi oleh pasien.'}</p>
                                </div>

                                <button onClick={() => setSelectedPatient(null)} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all active:scale-95 flex items-center justify-center gap-2">
                                    <ArrowRight size={16} /> Selesai Meninjau
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
