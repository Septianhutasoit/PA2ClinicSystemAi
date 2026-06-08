'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import {
    Search, ClipboardList, FileText, Activity, X,
    Stethoscope, Pill, MapPin, Loader2,
    Download, Printer, UserCheck, AlertCircle,
    Sparkles, Calendar
} from 'lucide-react';

export default function AdminMedicalRecords() {
    const [records, setRecords] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRecord, setSelectedRecord] = useState<any>(null);

    useEffect(() => {
        api.get('/clinic/medical-records')
            .then(res => setRecords(Array.isArray(res.data) ? res.data : []))
            .catch(err => { console.error('Gagal mengambil data rekam medis:', err); setRecords([]); })
            .finally(() => setIsLoading(false));
    }, []);

    const filteredRecords = records.filter((r: any) => {
        const name = (r.patient_name || '').toLowerCase();
        const diagnosis = (r.diagnosis || '').toLowerCase();
        return name.includes(searchTerm.toLowerCase()) || diagnosis.includes(searchTerm.toLowerCase());
    });

    const formatDate = (dateStr: string) => {
        try {
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return 'Tanggal tidak valid';
            return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        } catch { return 'Format error'; }
    };

    const uniquePatients = [...new Set(records.map(r => r.patient_name))].length;

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">

            {/* ── HEADER CARD ──────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-[#D4EDE5] shadow-sm relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500 rounded-l-2xl" />
                <div className="pl-8 pr-6 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full mb-2">
                            <Sparkles size={11} className="text-emerald-600" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">
                                Rekam Medis Digital
                            </span>
                        </div>
                        <h1 className="text-xl font-black text-slate-900 tracking-tight">
                            Central Medical Records
                        </h1>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">
                            Sistem Informasi Rekam Medis — Nauli Dental Care
                        </p>
                    </div>
                </div>
            </div>

            {/* ── STAT CARDS ───────────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    {
                        icon: FileText, label: 'Total Arsip',
                        value: isLoading ? '—' : `${records.length} Record`,
                        iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600',
                        border: 'border-emerald-100'
                    },
                    {
                        icon: UserCheck, label: 'Pasien Unik',
                        value: isLoading ? '—' : `${uniquePatients} Pasien`,
                        iconBg: 'bg-teal-50', iconColor: 'text-teal-600',
                        border: 'border-teal-100'
                    },
                    {
                        icon: Activity, label: 'Status Database',
                        value: 'Sync Active',
                        iconBg: 'bg-slate-800', iconColor: 'text-emerald-400',
                        border: 'border-slate-700', dark: true
                    },
                ].map((s, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className={`rounded-2xl border shadow-sm p-5 flex items-center gap-4
                            ${s.dark ? 'bg-slate-900' : 'bg-white hover:shadow-md transition-all'} ${s.border}`}
                    >
                        <div className={`w-11 h-11 ${s.iconBg} ${s.iconColor} rounded-xl flex items-center justify-center shrink-0`}>
                            <s.icon size={20} />
                        </div>
                        <div>
                            <p className={`text-[10px] font-black uppercase tracking-widest ${s.dark ? 'text-slate-400' : 'text-slate-400'}`}>
                                {s.label}
                            </p>
                            <p className={`text-lg font-black mt-0.5 ${s.dark ? 'text-emerald-400' : 'text-slate-800'}`}>
                                {s.value}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* ── SEARCH BAR ───────────────────────────────────────────── */}
            <div className="relative">
                <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400
                               peer-focus:text-emerald-500 transition-colors"
                />
                <input
                    type="text"
                    placeholder="Cari nama pasien atau diagnosa..."
                    className="w-full pl-11 pr-5 py-3.5 bg-white border border-slate-200 rounded-2xl
                               text-sm font-medium text-slate-700 placeholder-slate-400
                               focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-300
                               shadow-sm transition-all peer"
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>

            {/* ── TABLE ────────────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

                {/* Table header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                    <div className="w-9 h-9 bg-emerald-600 text-white rounded-xl flex items-center justify-center shrink-0">
                        <ClipboardList size={16} />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-slate-800">Daftar Rekam Medis</h3>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                            {isLoading ? 'Memuat...' : `${filteredRecords.length} dari ${records.length} data`}
                        </p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/60 border-b border-slate-100">
                                {['Identitas Pasien', 'Hasil Diagnosa', 'Tgl Kunjungan', 'Aksi'].map((h, i) => (
                                    <th key={h} className={`px-6 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest
                                                            ${i === 2 ? 'text-center' : i === 3 ? 'text-right' : ''}`}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="py-20 text-center">
                                        <Loader2 className="animate-spin mx-auto text-emerald-500 mb-3" size={28} />
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Memuat rekam medis...</p>
                                    </td>
                                </tr>
                            ) : filteredRecords.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="py-20 text-center">
                                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                            <AlertCircle size={24} className="text-slate-300" />
                                        </div>
                                        <p className="text-sm font-bold text-slate-400">Tidak ada data ditemukan</p>
                                        <p className="text-xs text-slate-300 mt-1">Coba ubah kata kunci pencarian</p>
                                    </td>
                                </tr>
                            ) : filteredRecords.map((r: any, idx: number) => (
                                <motion.tr
                                    key={r.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: idx * 0.03 }}
                                    onClick={() => setSelectedRecord(r)}
                                    className="group hover:bg-[#F5FAF7] transition-colors cursor-pointer"
                                >
                                    {/* Identitas */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600
                                                            rounded-xl flex items-center justify-center font-black text-white text-sm
                                                            shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                                                {(r.patient_name || '?').charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800 text-sm">
                                                    {r.patient_name || 'Tanpa Nama'}
                                                </p>
                                                <p className="text-[10px] text-slate-400 font-bold mt-0.5
                                                               bg-slate-100 px-2 py-0.5 rounded-full w-fit">
                                                    ND-{(r.id || 0).toString().padStart(4, '0')}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Diagnosa */}
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-slate-600 font-medium line-clamp-1">
                                            {r.diagnosis || 'Belum didiagnosa'}
                                        </p>
                                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50
                                                         border border-emerald-100 px-2 py-0.5 rounded-lg mt-1 inline-block">
                                            {r.treatment || 'Umum'}
                                        </span>
                                    </td>

                                    {/* Tanggal */}
                                    <td className="px-6 py-4 text-center">
                                        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600
                                                         bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl">
                                            <Calendar size={11} className="text-emerald-500" />
                                            {formatDate(r.created_at)}
                                        </div>
                                    </td>

                                    {/* Aksi */}
                                    <td className="px-6 py-4 text-right">
                                        <button className="px-4 py-2 bg-white border border-slate-200 text-[11px] font-bold
                                                           text-slate-500 rounded-xl hover:bg-slate-900 hover:text-white
                                                           hover:border-slate-900 transition-all shadow-sm">
                                            Buka Detail
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── MODAL DETAIL — Portal full screen blur ────────────────── */}
            {typeof window !== 'undefined' && createPortal(
                <AnimatePresence>
                    {selectedRecord && (
                        <div
                            className="fixed inset-0 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
                            style={{ zIndex: 99999 }}
                            onClick={() => setSelectedRecord(null)}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.96, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.96, y: 10 }}
                                transition={{ duration: 0.2, ease: 'easeOut' }}
                                onClick={e => e.stopPropagation()}
                                className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl relative overflow-hidden
                                           border border-slate-100 max-h-[90vh] overflow-y-auto"
                            >
                                {/* Accent bar */}
                                <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 w-full" />

                                <div className="p-8">
                                    {/* Modal header */}
                                    <div className="flex justify-between items-start mb-7">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-2xl
                                                            flex items-center justify-center text-emerald-600">
                                                <FileText size={22} />
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-black text-slate-900">Ringkasan Medis</h2>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                                    Arsip Nauli Dental · ND-{selectedRecord.id}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setSelectedRecord(null)}
                                            className="w-8 h-8 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500
                                                       rounded-xl flex items-center justify-center transition-all"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>

                                    {/* Grid 2 kolom */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                        {/* Identitas Pasien */}
                                        <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl">
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                                                Identitas Pasien
                                            </label>
                                            <h3 className="text-lg font-black text-slate-800">
                                                {selectedRecord.patient_name || 'N/A'}
                                            </h3>
                                            <p className="text-xs font-bold text-emerald-600 mt-1">
                                                {formatDate(selectedRecord.created_at)}
                                            </p>
                                        </div>

                                        {/* Dokter Pemeriksa */}
                                        <div className="bg-white border border-slate-100 border-dashed p-5 rounded-2xl">
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-3">
                                                Dokter Pemeriksa
                                            </label>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-teal-50 text-teal-600 rounded-lg flex items-center justify-center">
                                                    <Stethoscope size={15} />
                                                </div>
                                                <p className="text-sm font-bold text-slate-700">
                                                    {selectedRecord.doctor_name || 'dr. Septian Adi'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Analisa Diagnosa */}
                                        <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl">
                                            <label className="text-[9px] font-black text-emerald-600 uppercase tracking-widest block mb-2">
                                                Analisa Diagnosa
                                            </label>
                                            <p className="text-sm font-medium text-slate-700 leading-relaxed italic">
                                                "{selectedRecord.diagnosis || 'Tidak ada data diagnosa'}"
                                            </p>
                                        </div>

                                        {/* Prosedur Medis */}
                                        <div className="bg-white border border-slate-100 p-5 rounded-2xl">
                                            <label className="text-[9px] font-black text-blue-500 uppercase tracking-widest block mb-3">
                                                Prosedur Medis
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <Pill size={15} className="text-blue-500 shrink-0" />
                                                <p className="text-sm font-bold text-slate-800">
                                                    {selectedRecord.treatment || 'Konsultasi Umum'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Instruksi Dokter */}
                                    <div className="mt-4 bg-slate-900 p-6 rounded-2xl text-white">
                                        <label className="text-[9px] font-black text-emerald-400 uppercase tracking-widest block mb-2">
                                            Instruksi Dokter & Catatan Resep
                                        </label>
                                        <p className="text-sm text-slate-300 leading-relaxed font-medium">
                                            {selectedRecord.notes || 'Pasien disarankan untuk menjaga kebersihan gigi dan melakukan kontrol rutin 6 bulan sekali.'}
                                        </p>
                                    </div>

                                    {/* Footer modal */}
                                    <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
                                        <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                                            <MapPin size={10} /> Terverifikasi Digital · Klinik Nauli
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
}