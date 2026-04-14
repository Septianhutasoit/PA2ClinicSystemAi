'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Search, Mail, Phone, MapPin,
    ShieldCheck, Eye, Trash2, X,
    Loader2, MessageCircle, UserCheck, Star
} from 'lucide-react';

export default function PatientsManagement() {
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPatient, setSelectedPatient] = useState<any>(null);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const res = await api.get('/clinic/patients');
                setPatients(res.data);
            } catch (err) {
                console.error("Gagal memuat data pasien");
            } finally {
                setIsLoading(false);
            }
        };
        fetchPatients();
    }, []);

    const filteredPatients = patients.filter((p: any) =>
        p.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-10">

            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-8 rounded-[2.5rem] border border-blue-50 shadow-sm">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl shadow-indigo-200">
                        <Users size={32} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight italic uppercase leading-none">Database Pasien</h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2">Total {patients.length} Pasien Terdaftar</p>
                    </div>
                </div>

                <div className="relative group w-full md:w-96">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Cari nama atau email..."
                        className="w-full pl-14 pr-6 py-4 bg-[#F8FAFF] border border-slate-100 rounded-[2rem] text-sm font-bold shadow-inner focus:ring-4 focus:ring-indigo-50 outline-none transition-all italic"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* --- TABLE AREA --- */}
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-blue-900/5 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#F5F9FF]">
                            <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-blue-50">Identitas Pasien</th>
                            <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-blue-50">Kontak Aktif</th>
                            <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-blue-50 text-center">Membership</th>
                            <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-blue-50 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {isLoading ? (
                            <tr><td colSpan={4} className="p-24 text-center"><Loader2 className="animate-spin mx-auto text-indigo-600" size={40} /></td></tr>
                        ) : filteredPatients.map((p: any) => (
                            <tr key={p.id} className="group hover:bg-blue-50/40 transition-all">
                                <td className="p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center font-black text-indigo-600 shadow-sm uppercase italic">
                                            {p.first_name?.charAt(0)}{p.last_name?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-800 text-[15px] uppercase italic leading-none">{p.first_name} {p.last_name}</p>
                                            <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase flex items-center gap-1"><MapPin size={10} className="text-blue-400" /> {p.address?.slice(0, 30) || "Alamat belum diatur"}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold text-slate-700 flex items-center gap-2 tracking-tight"><Mail size={14} className="text-blue-300" /> {p.email}</p>
                                        {/* FIX: Nama variabel disesuaikan ke phone_number sesuai Neon */}
                                        <p className="text-xs font-black text-indigo-500 flex items-center gap-2"><Phone size={14} className="text-blue-300" /> {p.phone_number}</p>
                                    </div>
                                </td>
                                <td className="p-6 text-center">
                                    {/* Fitur Tambahan: Badge Membership */}
                                    <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border flex items-center justify-center gap-1 w-fit mx-auto shadow-sm ${p.id % 2 === 0 ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-slate-50 text-slate-400 border-slate-100'
                                        }`}>
                                        <Star size={10} className={p.id % 2 === 0 ? 'fill-amber-500' : ''} /> {p.id % 2 === 0 ? 'Member Gold' : 'Reguler'}
                                    </span>
                                </td>
                                <td className="p-6 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <a href={`https://wa.me/${p.phone_number}`} target="_blank" className="p-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm"><MessageCircle size={18} /></a>
                                        <button onClick={() => setSelectedPatient(p)} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"><Eye size={18} /></button>
                                    </div>
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

                            <div className="p-8 bg-gradient-to-br from-indigo-600 to-blue-700 text-white">
                                <h2 className="text-3xl font-black italic uppercase tracking-tighter leading-none">{selectedPatient.first_name} {selectedPatient.last_name}</h2>
                                <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Personal Identity Record</p>
                            </div>

                            <div className="p-8 space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-blue-50">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Gender</p>
                                        <p className="font-bold text-slate-700 text-sm uppercase">{selectedPatient.gender || 'Tidak diisi'}</p>
                                    </div>
                                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-blue-50">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Status Pasien</p>
                                        <p className="font-bold text-emerald-500 text-sm uppercase flex items-center gap-1"><UserCheck size={14} /> Aktif</p>
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-50">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1"><MapPin size={10} className="text-blue-500" /> Alamat Domisili</p>
                                    <p className="font-bold text-slate-700 text-sm leading-relaxed italic">{selectedPatient.address || 'Data alamat belum diperbarui oleh staff.'}</p>
                                </div>
                                <button onClick={() => setSelectedPatient(null)} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 shadow-xl transition-all">Tutup Catatan</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}