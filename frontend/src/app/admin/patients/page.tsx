'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { motion } from 'framer-motion';
import { 
    Users, Search, Mail, Calendar, 
    ChevronRight, Loader2, UserCircle 
} from 'lucide-react';

export default function PatientsPage() {
    const [patients, setPatients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const res = await api.get('/clinic/patients');
                setPatients(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPatients();
    }, []);

    const filteredPatients = patients.filter(p => 
        p.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
                    <Users className="text-emerald-500" /> Daftar Pasien
                </h1>
                <p className="text-sm text-slate-400 mt-0.5">
                    Lihat dan kelola data pasien yang terdaftar di sistem
                </p>
            </div>

            {/* Stats & Search */}
            <div className="grid md:grid-cols-3 gap-4">
                <div className="md:col-span-2 relative">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Cari nama atau email pasien..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    />
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-100 flex items-center justify-between px-6 shadow-sm">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Pasien</span>
                    <span className="text-xl font-black text-emerald-600">{patients.length}</span>
                </div>
            </div>

            {/* List Pasien */}
            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-emerald-500" size={40} />
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Informasi Pasien</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Kontak</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Janji Temu</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredPatients.map((patient: any, idx: number) => (
                                    <motion.tr 
                                        key={patient.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.03 }}
                                        className="hover:bg-slate-50/50 transition-colors group"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                                                    <UserCircle size={24} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800">{patient.full_name}</p>
                                                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">ID: #{patient.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-xs text-slate-600">
                                                    <Mail size={12} className="text-slate-400" />
                                                    {patient.email}
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                                    <Calendar size={12} />
                                                    Terdaftar: {patient.created_at ? new Date(patient.created_at).toLocaleDateString() : '-'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black">
                                                {patient.total_appointments} JANJI
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all">
                                                <ChevronRight size={18} />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {!isLoading && filteredPatients.length === 0 && (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
                    <UserCircle size={40} className="mx-auto text-slate-200 mb-3" />
                    <p className="text-slate-400 text-sm font-medium">Tidak ada pasien yang ditemukan</p>
                </div>
            )}
        </div>
    );
}
