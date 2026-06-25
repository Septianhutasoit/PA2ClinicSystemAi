'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import {
    CalendarCheck2, Clock, Search, Edit3,
    X, Save, Loader2, Users,
    CheckCircle2, AlertCircle, Sparkles,
    Phone, MapPin, UserRound, Calendar
} from 'lucide-react';

export default function AdminAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingApp, setEditingApp] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => { fetchAppointments(); }, []);

    const fetchAppointments = async () => {
        try {
            const res = await api.get('/clinic/appointments');
            setAppointments(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleUpdateStatus = async (id: number, newStatus: string) => {
        try {
            await api.patch(`/clinic/appointments/${id}`, { status: newStatus });
            fetchAppointments();
        } catch (err) { alert('Gagal update status'); }
    };

    const handleSaveEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await api.patch(`/clinic/appointments/${editingApp.id}`, editingApp);
            setIsEditModalOpen(false);
            fetchAppointments();
        } catch (err) {
            alert('❌ Gagal menyimpan perubahan');
        } finally {
            setIsSaving(false);
        }
    };

    const filteredData = appointments
        .filter((app: any) => {
            // 1. Filter Pencarian Nama
            const matchesName = app.patient_name?.toLowerCase().includes(searchTerm.toLowerCase());
            // 2. Filter Pilihan Status
            const matchesStatus = filterStatus === 'all' ? true : app.status === filterStatus;

            return matchesName && matchesStatus;
        })
        .sort((a: any, b: any) => {
            const dateA = new Date(a.appointment_date).getTime();
            const dateB = new Date(b.appointment_date).getTime();

            // JIKA TANGGAL/JAM KONSULTASI BERBEDA:
            // Urutkan dari yang paling dekat dengan waktu sekarang (Ascending)
            if (dateA !== dateB) {
                return dateA - dateB;
            }

            // JIKA TANGGAL/JAM KONSULTASI SAMA (TIE-BREAKER):
            // Bandingkan waktu Request (siapa yang klik daftar duluan dia di atas)
            const reqA = new Date(a.created_at || a.createdAt).getTime();
            const reqB = new Date(b.created_at || b.createdAt).getTime();
            return reqA - reqB;
        });

    
    // Hitung stats
    const totalConfirmed = appointments.filter((a: any) => a.status === 'confirmed').length;
    const totalPending = appointments.filter((a: any) => a.status === 'pending').length;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            {/* ── HEADER CARD ───────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-[#D4EDE5] shadow-sm relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500 rounded-l-2xl" />
                <div className="pl-8 pr-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full mb-2">
                            <Sparkles size={11} className="text-emerald-600" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">
                                Operasional Klinik Real-time
                            </span>
                        </div>
                        <h1 className="text-xl font-black text-slate-900 tracking-tight">
                            Manajemen Reservasi
                        </h1>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">
                            Kelola dan konfirmasi janji temu pasien
                        </p>
                    </div>

                    {/* Filter & Search */}
                    <div className="flex items-center gap-3 shrink-0">
                        {/* Dropdown Filter Status */}
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-black 
                   text-emerald-700 uppercase tracking-tight outline-none focus:ring-2 
                   focus:ring-emerald-400/30 transition-all cursor-pointer shadow-sm"
                        >
                            <option value="all">Semua Status</option>
                            <option value="pending">⏳ Menunggu</option>
                            <option value="confirmed">✅ Dikonfirmasi</option>
                            <option value="completed">✔️ Selesai</option>
                        </select>

                        {/* Input Pencarian */}
                        <div className="relative">
                            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Cari nama pasien..."
                                className="pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl
                       text-xs w-48 font-medium text-slate-700 placeholder-slate-400
                       focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-300
                       transition-all shadow-sm"
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── STAT MINI CARDS ───────────────────────────────────────── */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: 'Total Reservasi', value: appointments.length, icon: CalendarCheck2, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', border: 'border-emerald-100' },
                    { label: 'Dikonfirmasi', value: totalConfirmed, icon: CheckCircle2, iconBg: 'bg-teal-50', iconColor: 'text-teal-600', border: 'border-teal-100' },
                    { label: 'Menunggu', value: totalPending, icon: Clock, iconBg: 'bg-amber-50', iconColor: 'text-amber-600', border: 'border-amber-100' },
                ].map((s, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className={`bg-white rounded-2xl border ${s.border} shadow-sm p-4 flex items-center gap-3`}
                    >
                        <div className={`w-10 h-10 ${s.iconBg} ${s.iconColor} rounded-xl flex items-center justify-center shrink-0`}>
                            <s.icon size={18} />
                        </div>
                        <div>
                            <p className="text-xl font-black text-slate-800 leading-none">
                                {loading ? '—' : s.value}
                            </p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                                {s.label}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* ── TABEL ─────────────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

                {/* Table header bar */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                    <div className="w-9 h-9 bg-emerald-600 text-white rounded-xl flex items-center justify-center shrink-0">
                        <Users size={16} />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-slate-800">Daftar Reservasi</h3>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                            {loading ? 'Memuat...' : `${filteredData.length} dari ${appointments.length} data`}
                        </p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[860px]">
                        <thead>
                            <tr className="bg-slate-50/60 border-b border-slate-100">
                                {['Pasien', 'Kontak', 'Alamat', 'Jadwal Konsultasi', 'Dokter', 'Status', 'Aksi'].map((h, i) => (
                                    <th key={h} className={`px-5 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest
                                                            ${i === 5 ? 'text-center' : i === 6 ? 'text-right' : ''}`}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="py-20 text-center">
                                        <Loader2 className="animate-spin mx-auto text-emerald-500 mb-3" size={26} />
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                            Memuat data...
                                        </p>
                                    </td>
                                </tr>
                            ) : filteredData.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-20 text-center">
                                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                            <UserRound size={24} className="text-slate-300" />
                                        </div>
                                        <p className="text-sm font-bold text-slate-400">Tidak ada data reservasi</p>
                                        <p className="text-xs text-slate-300 mt-1">
                                            {searchTerm ? 'Coba ubah kata kunci pencarian' : 'Belum ada pasien yang mendaftar'}
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                filteredData.map((app: any, idx: number) => (
                                    <motion.tr
                                        key={app.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: idx * 0.03 }}
                                        className="hover:bg-[#F5FAF7] transition-colors group"
                                    >
                                        {/* Pasien */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600
                                                                rounded-xl flex items-center justify-center font-black text-white text-sm
                                                                shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                                                    {app.patient_name?.charAt(0)?.toUpperCase() || 'P'}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 text-sm">{app.patient_name}</p>
                                                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                                                        {app.patient_gender || '—'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Kontak */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-1.5 text-sm text-slate-600 font-medium">
                                                <Phone size={11} className="text-emerald-500 shrink-0" />
                                                {app.patient_phone || '—'}
                                            </div>
                                        </td>

                                        {/* Alamat */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-start gap-1.5">
                                                <MapPin size={11} className="text-emerald-500 shrink-0 mt-0.5" />
                                                <p className="text-xs text-slate-500 max-w-[160px] truncate">
                                                    {app.patient_address || '—'}
                                                </p>
                                            </div>
                                        </td>

                                        {/* Kolom Jadwal Konsultasi & Waktu Request */}
                                        <td className="px-5 py-4">
                                            <div className="flex flex-col gap-1.5">

                                                {/* 1. Baris Atas: Jadwal yang dipilih pasien */}
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar size={11} className="text-emerald-500 shrink-0" />
                                                    <span className="text-xs font-bold text-slate-700">
                                                        {app.appointment_date ? new Date(app.appointment_date).toLocaleString('id-ID', {
                                                            dateStyle: 'short',
                                                            timeStyle: 'short'
                                                        }) : '—'}
                                                    </span>
                                                </div>

                                                {/* 2. Baris Bawah: Info kapan dia klik daftar (Antrean Sistem) */}
                                                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-md w-fit">
                                                    <Clock size={9} className="text-slate-400" />
                                                    <span className="text-[9px] font-medium text-slate-400">
                                                        Req: {(app.created_at || app.createdAt) ?
                                                            new Date(app.created_at || app.createdAt).toLocaleString('id-ID', {
                                                                day: '2-digit',
                                                                month: '2-digit',
                                                                year: '2-digit',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            }) : 'Tanggal tidak tersedia'
                                                        }
                                                    </span>
                                                </div>

                                            </div>
                                        </td>

                                        {/* Dokter */}
                                        <td className="px-5 py-4">
                                            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100
                                                             rounded-lg text-[10px] font-bold uppercase">
                                                {app.doctor_name}
                                            </span>
                                        </td>

                                        {/* Status */}
                                        <td className="px-5 py-4 text-center">
                                            <StatusBadge status={app.status} />
                                        </td>

                                        {/* Aksi */}
                                        <td className="px-5 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => { setEditingApp(app); setIsEditModalOpen(true); }}
                                                    className="p-2 rounded-lg text-slate-400 hover:text-emerald-600
                                                               hover:bg-emerald-50 transition-all"
                                                    title="Edit data"
                                                >
                                                    <Edit3 size={15} />
                                                </button>
                                                {app.status !== 'confirmed' && (
                                                    <button
                                                        onClick={() => handleUpdateStatus(app.id, 'confirmed')}
                                                        className="bg-emerald-600 hover:bg-emerald-700 text-white
                                                                   px-4 py-1.5 rounded-xl text-[10px] font-black uppercase
                                                                   tracking-widest shadow-sm shadow-emerald-200 transition-all
                                                                   active:scale-95"
                                                    >
                                                        Konfirmasi
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── MODAL EDIT — Portal full screen blur ─────────────────── */}
            {typeof window !== 'undefined' && createPortal(
                <AnimatePresence>
                    {isEditModalOpen && editingApp && (
                        <div
                            className="fixed inset-0 flex items-center justify-center p-6 bg-slate-900/50 backdrop-blur-sm"
                            style={{ zIndex: 99999 }}
                        >
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                                transition={{ duration: 0.2, ease: 'easeOut' }}
                                className="bg-white w-full max-w-md rounded-3xl shadow-2xl relative border border-slate-100 overflow-hidden"
                            >
                                {/* Accent bar */}
                                <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400" />

                                <div className="p-7">
                                    {/* Modal header */}
                                    <div className="flex items-start justify-between mb-6">
                                        <div>
                                            <h2 className="text-lg font-black text-slate-900">Edit Data Pasien</h2>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                                Pembaruan Informasi Reservasi
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setIsEditModalOpen(false)}
                                            className="w-8 h-8 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500
                                                       rounded-xl flex items-center justify-center transition-all"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>

                                    <form onSubmit={handleSaveEdit} className="space-y-4">
                                        {[
                                            { label: 'Nama Pasien', field: 'patient_name', type: 'text', placeholder: 'Nama lengkap pasien' },
                                            { label: 'WhatsApp', field: 'patient_phone', type: 'text', placeholder: '08xx-xxxx-xxxx' },
                                            { label: 'Alamat', field: 'patient_address', type: 'text', placeholder: 'Alamat lengkap' },
                                        ].map(({ label, field, type, placeholder }) => (
                                            <div key={field} className="space-y-1.5">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">
                                                    {label}
                                                </label>
                                                <input
                                                    type={type}
                                                    placeholder={placeholder}
                                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl
                                                               font-medium text-sm text-slate-700
                                                               focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-300
                                                               transition-all"
                                                    value={editingApp[field] || ''}
                                                    onChange={e => setEditingApp({ ...editingApp, [field]: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        ))}

                                        {/* Jenis Kelamin */}
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">
                                                Jenis Kelamin
                                            </label>
                                            <select
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl
                                                           font-medium text-sm text-slate-700
                                                           focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-300
                                                           transition-all"
                                                value={editingApp.patient_gender || ''}
                                                onChange={e => setEditingApp({ ...editingApp, patient_gender: e.target.value })}
                                                required
                                            >
                                                <option value="">-- Pilih Jenis Kelamin --</option>
                                                <option value="Laki-laki">Laki-laki</option>
                                                <option value="Perempuan">Perempuan</option>
                                            </select>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-3 pt-2">
                                            <button
                                                type="button"
                                                onClick={() => setIsEditModalOpen(false)}
                                                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600
                                                           text-sm font-bold hover:bg-slate-50 transition-all"
                                            >
                                                Batal
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isSaving}
                                                className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700
                                                           text-white text-sm font-black flex items-center justify-center gap-2
                                                           transition-all shadow-sm shadow-emerald-200 active:scale-95
                                                           disabled:opacity-60 disabled:cursor-not-allowed"
                                            >
                                                {isSaving
                                                    ? <><Loader2 size={15} className="animate-spin" /> Menyimpan...</>
                                                    : <><Save size={15} /> Simpan Perubahan</>
                                                }
                                            </button>
                                        </div>
                                    </form>
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

// ── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
    const s = status?.toLowerCase();

    if (s === 'confirmed') return (
        <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase
                         text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
            <CheckCircle2 size={10} /> Terkonfirmasi
        </span>
    );

    if (s === 'completed') return (
        <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase
                         text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-xl">
            <CheckCircle2 size={10} /> Selesai
        </span>
    );

    return (
        <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase
                         text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
            <Clock size={10} /> Menunggu
        </span>
    );
}