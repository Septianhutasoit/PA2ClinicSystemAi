'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { motion } from 'framer-motion';
import { Users2, Search, Loader2, User, Mail, Calendar } from 'lucide-react';

interface Patient {
    id: number;
    full_name: string;
    email: string;
    created_at?: string;
    total_appointments: number;
}

export default function NursePatientsPage() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const res = await api.get('/clinic/patients');
                setPatients(res.data);
            } catch {
                console.error('Gagal memuat data pasien');
            } finally {
                setIsLoading(false);
            }
        };
        fetchPatients();
    }, []);

    const filtered = patients.filter(p =>
        p.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Daftar Pasien</h1>
                <p className="text-sm text-slate-400 font-medium mt-1">{patients.length} pasien terdaftar di sistem</p>
            </div>

            <div className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                <input type="text" placeholder="Cari nama atau email pasien..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-teal-400 outline-none transition-all shadow-sm" />
            </div>

            {isLoading ? (
                <div className="py-20 text-center">
                    <Loader2 className="animate-spin text-teal-500 mx-auto" size={32} />
                    <p className="text-xs text-slate-400 mt-3">Memuat data pasien...</p>
                </div>
            ) : filtered.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-2xl border border-slate-100">
                    <Users2 size={40} className="mx-auto text-slate-200 mb-3" />
                    <p className="text-slate-400 text-sm font-bold">Tidak ada pasien ditemukan</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((patient, i) => (
                        <motion.div key={patient.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md hover:border-teal-200 transition-all">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center font-black text-teal-700 text-lg">
                                    {patient.full_name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-black text-slate-800 truncate">{patient.full_name}</p>
                                    <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5 mt-0.5 truncate">
                                        <Mail size={10} /> {patient.email}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                    <Calendar size={10} /> {patient.total_appointments} kunjungan
                                </span>
                                <span className="text-[10px] font-black text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">Aktif</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
