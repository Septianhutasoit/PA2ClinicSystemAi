'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { motion } from 'framer-motion';
import {
    ClipboardList, Loader2, Search, User,
    Calendar, FileText, Stethoscope, Clock
} from 'lucide-react';

interface Appointment {
    id: number;
    patient_name: string;
    doctor_name?: string;
    appointment_date: string;
    status: string;
    notes?: string;
}

export default function NurseRecordsPage() {
    const [records, setRecords] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const res = await api.get('/clinic/appointments');
                // Filter hanya yang completed untuk catatan medis
                setRecords(res.data.filter((a: Appointment) => a.status?.toLowerCase() === 'completed'));
            } catch {
                console.error('Gagal memuat catatan medis');
            } finally {
                setIsLoading(false);
            }
        };
        fetchRecords();
    }, []);

    const filtered = records.filter(r =>
        r.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.doctor_name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Catatan Medis</h1>
                <p className="text-sm text-slate-400 font-medium mt-1">{records.length} catatan kunjungan selesai</p>
            </div>

            {/* Search */}
            <div className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                <input type="text" placeholder="Cari nama pasien atau dokter..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-rose-400 outline-none transition-all shadow-sm" />
            </div>

            {isLoading ? (
                <div className="py-20 text-center">
                    <Loader2 className="animate-spin text-rose-500 mx-auto" size={32} />
                    <p className="text-xs text-slate-400 mt-3">Memuat catatan medis...</p>
                </div>
            ) : filtered.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-2xl border border-slate-100">
                    <ClipboardList size={40} className="mx-auto text-slate-200 mb-3" />
                    <p className="text-slate-400 text-sm font-bold">Belum ada catatan medis</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/80 border-b border-slate-100">
                            <tr>
                                {['#', 'Pasien', 'Dokter', 'Tanggal', 'Catatan'].map((h, i) => (
                                    <th key={i} className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filtered.map((r, idx) => (
                                <motion.tr key={r.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }} className="hover:bg-slate-50/50">
                                    <td className="px-6 py-4 text-xs font-bold text-slate-400">{idx + 1}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center font-black text-rose-700 text-sm">
                                                {r.patient_name.charAt(0)}
                                            </div>
                                            <p className="text-sm font-black text-slate-800">{r.patient_name}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-xs text-slate-600 font-bold flex items-center gap-1.5">
                                            <Stethoscope size={11} className="text-rose-400" /> {r.doctor_name || '-'}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-xs text-slate-500 font-bold flex items-center gap-1.5">
                                            <Calendar size={11} />
                                            {new Date(r.appointment_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-xs text-slate-500 font-medium max-w-[200px] truncate">
                                            {r.notes || <span className="italic text-slate-300">Tidak ada catatan</span>}
                                        </p>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
