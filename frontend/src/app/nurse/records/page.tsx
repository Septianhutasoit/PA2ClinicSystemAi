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
                                    {filtered.map((r: any, idx: number) => (
                                        <motion.tr key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 text-xs font-bold text-slate-400">#{r.id}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center font-black text-emerald-700 uppercase">
                                                        {r.patient_name.charAt(0)}
                                                    </div>
                                                    <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{r.patient_name}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-xs font-bold text-slate-600 flex items-center gap-1">
                                                    <Stethoscope size={12} className="text-emerald-500" /> {r.doctor_name || '-'}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="bg-slate-100 px-3 py-1 rounded-lg w-fit">
                                                    <p className="text-[10px] font-black text-slate-500 uppercase">
                                                        {new Date(r.appointment_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 min-w-[300px]">
                                                {r.doctor_diagnosis ? (
                                                    <div className="bg-white border border-emerald-100 p-3 rounded-2xl shadow-sm space-y-2 relative overflow-hidden">
                                                        <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[8px] px-2 py-0.5 rounded-bl-lg font-black uppercase">Selesai</div>
                                                        <div>
                                                            <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest block">Diagnosa Dokter:</span>
                                                            <p className="text-xs font-bold text-slate-700 italic">"{r.doctor_diagnosis}"</p>
                                                        </div>
                                                        <div className="pt-2 border-t border-slate-50">
                                                            <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest block">Tindakan Medis:</span>
                                                            <p className="text-[11px] font-medium text-slate-500">{r.treatment}</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="p-3 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                                                        <span className="text-[9px] font-black text-slate-400 uppercase block mb-1">Catatan Pendaftaran:</span>
                                                        <p className="text-xs text-slate-400 italic">{r.notes || "Tidak ada catatan khusus"}</p>
                                                    </div>
                                                )}
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
