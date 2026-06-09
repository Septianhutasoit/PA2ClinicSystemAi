'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText, Search, RefreshCw, Loader2,
    User, Stethoscope, Calendar, ClipboardList,
    ChevronDown, CheckCircle2, Clock
} from 'lucide-react';

interface MedicalRecord {
    id: number;
    appointment_id: number;
    patient_name: string;
    doctor_name: string;
    diagnosis: string;
    treatment: string;
    notes?: string;
    created_at: string;
}

export default function DoctorLaporanMedisPage() {
    const [records, setRecords] = useState<MedicalRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [expanded, setExpanded] = useState<number | null>(null);
    const [doctorName, setDoctorName] = useState('');
    const [toast, setToast] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    /* ── fetch ── */
    const fetchData = async (refresh = false) => {
        if (refresh) setIsRefreshing(true);
        try {
            /* get doctor name first */
            const resMe = await api.get('/auth/me');
            const name = resMe.data?.full_name || resMe.data?.name || '';
            setDoctorName(name);

            /* fetch ALL medical records — then filter by this doctor */
            const res = await api.get('/clinic/medical-records');
            const all: MedicalRecord[] = Array.isArray(res.data) ? res.data : [];

            /* filter hanya milik dokter yang login (case-insensitive) */
            const mine = all.filter(r =>
                r.doctor_name?.trim().toLowerCase() === name.trim().toLowerCase()
            );
            setRecords(mine);
        } catch {
            showToast('Gagal memuat rekam medis');
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    /* ── filtered list ── */
    const filtered = records.filter(r =>
        r.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const fmt = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString('id-ID', {
            day: '2-digit', month: 'short', year: 'numeric',
        });

    return (
        <div className="space-y-6 pb-20">

            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                        className="fixed top-6 right-6 z-[99] bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl text-sm font-bold"
                    >{toast}</motion.div>
                )}
            </AnimatePresence>

            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Laporan Medis</h1>
                    <p className="text-sm text-slate-400 font-medium mt-1">
                        {isLoading ? '...' : `${filtered.length} rekam medis`}
                        {doctorName && (
                            <span className="ml-2 text-emerald-600 font-bold">· {doctorName}</span>
                        )}
                    </p>
                </div>
                <button
                    onClick={() => fetchData(true)}
                    disabled={isRefreshing}
                    className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-all disabled:opacity-60"
                >
                    <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} /> Refresh
                </button>
            </div>

            {/* ── Stat cards ── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                    { label: 'Total Rekam', value: records.length, icon: FileText, color: 'bg-emerald-50 text-emerald-600' },
                    {
                        label: 'Bulan Ini', value: records.filter(r => {
                            const d = new Date(r.created_at);
                            const now = new Date();
                            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
                        }).length, icon: Calendar, color: 'bg-teal-50 text-teal-600'
                    },
                    { label: 'Pasien Unik', value: new Set(records.map(r => r.patient_name)).size, icon: User, color: 'bg-blue-50 text-blue-600' },
                ].map((s, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${s.color}`}>
                            <s.icon size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                            <p className="text-3xl font-black text-slate-800 tabular-nums">
                                {isLoading ? <span className="inline-block w-8 h-7 bg-slate-100 rounded animate-pulse" /> : s.value}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Search ── */}
            <div className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                <input
                    type="text"
                    placeholder="Cari nama pasien atau diagnosis..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 outline-none transition-all"
                />
            </div>

            {/* ── Records list ── */}
            {isLoading ? (
                <div className="bg-white rounded-2xl border border-slate-100 py-20 text-center">
                    <Loader2 className="animate-spin mx-auto text-emerald-500 mb-3" size={28} />
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Memuat rekam medis...</p>
                </div>
            ) : filtered.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-slate-200 py-20 text-center">
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <FileText size={24} className="text-slate-300" />
                    </div>
                    <p className="text-sm font-bold text-slate-400">Belum ada rekam medis</p>
                    {doctorName && (
                        <p className="text-xs text-slate-300 mt-1">
                            Terdaftar ke: <span className="font-bold text-emerald-500">{doctorName}</span>
                        </p>
                    )}
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map((rec, idx) => (
                        <motion.div
                            key={rec.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.04 }}
                            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all"
                        >
                            {/* Row header */}
                            <div
                                className="flex items-center gap-4 px-6 py-4 cursor-pointer"
                                onClick={() => setExpanded(expanded === rec.id ? null : rec.id)}
                            >
                                {/* Number */}
                                <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                                    {idx + 1}
                                </div>

                                {/* Avatar initial */}
                                <div className="w-10 h-10 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center font-black text-emerald-700 text-sm flex-shrink-0">
                                    {rec.patient_name?.charAt(0)?.toUpperCase() ?? '?'}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-slate-800 text-sm truncate">{rec.patient_name}</p>
                                    <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                                        <span className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold">
                                            <ClipboardList size={9} className="text-emerald-500" />
                                            {rec.diagnosis || 'Tidak ada diagnosis'}
                                        </span>
                                        <span className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold">
                                            <Clock size={9} className="text-slate-400" />
                                            {fmt(rec.created_at)}
                                        </span>
                                    </div>
                                </div>

                                {/* Status badge */}
                                <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border bg-emerald-50 text-emerald-600 border-emerald-200 flex-shrink-0">
                                    <CheckCircle2 size={10} /> Selesai
                                </span>

                                <ChevronDown size={14} className={`text-slate-300 transition-transform flex-shrink-0 ${expanded === rec.id ? 'rotate-180' : ''}`} />
                            </div>

                            {/* Expandable detail */}
                            <AnimatePresence>
                                {expanded === rec.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="border-t border-slate-50 bg-slate-50/50"
                                    >
                                        <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-3 gap-5">
                                            <div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Diagnosis</p>
                                                <p className="text-sm text-slate-700 font-semibold leading-relaxed">
                                                    {rec.diagnosis || <span className="text-slate-300 italic">Tidak ada data</span>}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Tindakan</p>
                                                <p className="text-sm text-slate-700 font-semibold leading-relaxed">
                                                    {rec.treatment || <span className="text-slate-300 italic">Tidak ada data</span>}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Catatan</p>
                                                <p className="text-sm text-slate-700 font-semibold leading-relaxed">
                                                    {rec.notes || <span className="text-slate-300 italic">Tidak ada catatan</span>}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="px-6 pb-4 flex items-center justify-between border-t border-slate-100 pt-3">
                                            <span className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold">
                                                <Stethoscope size={11} className="text-emerald-500" />
                                                {rec.doctor_name}
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-semibold">
                                                ID Janji: #{rec.appointment_id}
                                            </span>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}