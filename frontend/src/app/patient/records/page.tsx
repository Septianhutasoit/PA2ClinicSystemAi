'use client';
import { motion } from 'framer-motion';
import {
    FileText, Calendar, Stethoscope, Activity, Heart,
    Download, Eye, Search, Filter, Clock,
    CheckCircle, AlertTriangle, Pill, ClipboardList
} from 'lucide-react';
import { useState } from 'react';

interface MedicalRecord {
    id: number;
    date: string;
    doctor: string;
    diagnosis: string;
    treatment: string;
    prescription: string;
    notes: string;
    status: 'completed' | 'follow-up';
}

export default function RecordsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);

    // Sample medical records
    const records: MedicalRecord[] = [
        {
            id: 1,
            date: '2024-12-15',
            doctor: 'Dr. Sarah Manullang',
            diagnosis: 'Karies Gigi (Gigi Berlubang)',
            treatment: 'Penambalan Komposit',
            prescription: 'Amoxicillin 500mg (3x1), Ibuprofen 400mg (jika nyeri)',
            notes: 'Gigi geraham bawah kanan (gigi 46) dilakukan penambalan komposit. Pasien disarankan kontrol 2 minggu lagi.',
            status: 'follow-up'
        },
        {
            id: 2,
            date: '2024-11-20',
            doctor: 'Dr. Budi Siregar',
            diagnosis: 'Gingivitis (Radang Gusi)',
            treatment: 'Scaling & Pembersihan Karang Gigi',
            prescription: 'Chlorhexidine mouthwash (2x sehari), Metronidazole 500mg (3x1)',
            notes: 'Pembersihan karang gigi menyeluruh. Gusi sudah tampak membaik setelah tindakan. Pasien diedukasi tentang cara sikat gigi yang benar.',
            status: 'completed'
        },
        {
            id: 3,
            date: '2024-10-05',
            doctor: 'Dr. Maya Situmorang',
            diagnosis: 'Pemeriksaan Rutin',
            treatment: 'Pembersihan Gigi & Pemeriksaan Panoramik',
            prescription: '-',
            notes: 'Kondisi gigi secara umum baik. Tidak ditemukan karies baru. Saran: kontrol rutin 6 bulan sekali.',
            status: 'completed'
        },
        {
            id: 4,
            date: '2024-08-12',
            doctor: 'Dr. Sarah Manullang',
            diagnosis: 'Pulpitis Reversibel',
            treatment: 'Perawatan Saluran Akar (PSA) Tahap 1',
            prescription: 'Ibuprofen 400mg (3x1 setelah makan), Clindamycin 300mg (3x1)',
            notes: 'Gigi premolar atas kiri mengalami pulpitis. Dilakukan perawatan saluran akar tahap pertama. Dipasang tambalan sementara.',
            status: 'completed'
        },
    ];

    const filteredRecords = records.filter(r =>
        r.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.treatment.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const summaryCards = [
        { icon: <ClipboardList size={20} />, label: 'Total Kunjungan', value: records.length.toString(), color: 'from-blue-500 to-indigo-600' },
        { icon: <Stethoscope size={20} />, label: 'Tindakan', value: records.filter(r => r.treatment !== '-').length.toString(), color: 'from-emerald-500 to-teal-600' },
        { icon: <AlertTriangle size={20} />, label: 'Follow-up', value: records.filter(r => r.status === 'follow-up').length.toString(), color: 'from-amber-500 to-orange-600' },
        { icon: <CheckCircle size={20} />, label: 'Selesai', value: records.filter(r => r.status === 'completed').length.toString(), color: 'from-rose-500 to-pink-600' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 py-12 px-6">
                <div className="max-w-5xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full mb-3">
                            <FileText size={12} className="text-emerald-200" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-white">Rekam Medis Digital</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-white">Rekam Medis Saya</h1>
                        <p className="text-emerald-100 text-sm mt-1">Riwayat perawatan dan diagnosis kesehatan gigi Anda</p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-8">
                {/* Summary Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 -mt-14 mb-8">
                    {summaryCards.map((card, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white rounded-2xl p-5 shadow-lg border border-slate-100 hover:shadow-xl transition-all"
                        >
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white mb-3`}>
                                {card.icon}
                            </div>
                            <p className="text-2xl font-black text-slate-800">{card.value}</p>
                            <p className="text-xs text-slate-500 font-medium">{card.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Search */}
                <div className="relative mb-6">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Cari berdasarkan diagnosis, dokter, atau tindakan..."
                        className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all shadow-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Records List */}
                <div className="space-y-4">
                    {filteredRecords.map((record, idx) => (
                        <motion.div
                            key={record.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all"
                        >
                            {/* Record Header */}
                            <div
                                className="p-5 cursor-pointer"
                                onClick={() => setSelectedRecord(selectedRecord?.id === record.id ? null : record)}
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shrink-0 ${record.status === 'follow-up'
                                                ? 'bg-gradient-to-br from-amber-500 to-orange-500'
                                                : 'bg-gradient-to-br from-emerald-500 to-teal-500'
                                            }`}>
                                            <Activity size={22} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800">{record.diagnosis}</h3>
                                            <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500">
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={12} className="text-emerald-500" />
                                                    {new Date(record.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Stethoscope size={12} className="text-emerald-500" />
                                                    {record.doctor}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {record.status === 'follow-up' ? (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-bold">
                                                <AlertTriangle size={12} /> Perlu Kontrol
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold">
                                                <CheckCircle size={12} /> Selesai
                                            </span>
                                        )}
                                        <button className="p-2 hover:bg-slate-50 rounded-lg transition-all">
                                            <Eye size={16} className="text-slate-400" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Expandable Detail */}
                            {selectedRecord?.id === record.id && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="border-t border-slate-100 bg-slate-50/50 p-5"
                                >
                                    <div className="grid md:grid-cols-2 gap-5">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-1.5">
                                                    <Stethoscope size={12} className="text-emerald-500" /> Tindakan
                                                </label>
                                                <p className="text-sm text-slate-700 bg-white rounded-xl p-3 border border-slate-100">{record.treatment}</p>
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-1.5">
                                                    <Pill size={12} className="text-emerald-500" /> Resep Obat
                                                </label>
                                                <p className="text-sm text-slate-700 bg-white rounded-xl p-3 border border-slate-100">{record.prescription}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-1.5">
                                                <FileText size={12} className="text-emerald-500" /> Catatan Dokter
                                            </label>
                                            <p className="text-sm text-slate-700 bg-white rounded-xl p-3 border border-slate-100 leading-relaxed">{record.notes}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* Health Tips */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100"
                >
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shrink-0">
                            <Heart size={20} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-800 mb-1">💡 Tips Kesehatan Gigi</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Sikat gigi minimal 2 kali sehari (pagi dan malam), gunakan benang gigi, dan lakukan pemeriksaan rutin setiap 6 bulan.
                                Hindari makanan dan minuman yang terlalu manis atau asam untuk menjaga kesehatan email gigi.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
