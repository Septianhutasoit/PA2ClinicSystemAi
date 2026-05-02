'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CalendarCheck2, MessageCircle, Clock, User,
    MoreVertical, CheckCircle2, Search, Edit3,
    Trash2, X, Save, Loader2, MapPin, Users
} from 'lucide-react';

export default function AdminAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // State untuk Modal Edit
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingApp, setEditingApp] = useState<any>(null);

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
        } catch (err) { alert("Gagal update status"); }
    };

    const handleSaveEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.patch(`/clinic/appointments/${editingApp.id}`, editingApp);
            alert("✅ Data berhasil diperbarui!");
            setIsEditModalOpen(false);
            fetchAppointments();
        } catch (err) { alert("❌ Gagal menyimpan perubahan"); }
    };

    const filteredData = appointments.filter((app: any) =>
        app.patient_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-black text-slate-900 tracking-tight">Reservations</h1>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">Operasional Klinik Real-time</p>
                </div>
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                    <input
                        type="text"
                        placeholder="Cari nama pasien..."
                        className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs w-full md:w-64 focus:ring-4 focus:ring-blue-50 outline-none font-bold"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* TABEL DATA */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
                <table className="w-full text-left border-collapse text-[13px] min-w-[800px]">
                    <thead>
                        <tr className="bg-slate-50/50">
                            <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Patient</th>
                            <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Contact</th>
                            <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Address</th>
                            <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Schedule</th>
                            <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Doctor</th>
                            <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">Status</th>
                            <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr>
                                <td colSpan={7} className="p-10 text-center">
                                    <Loader2 className="animate-spin mx-auto text-blue-600" size={32} />
                                </td>
                            </tr>
                        ) : filteredData.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="p-10 text-center text-slate-400">
                                    Tidak ada data reservasi
                                </td>
                            </tr>
                        ) : (
                            filteredData.map((app: any) => (
                                <tr key={app.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="p-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-black text-sm">
                                                {app.patient_name?.charAt(0) || 'P'}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800">{app.patient_name}</p>
                                                <p className="text-[10px] text-slate-400 font-bold italic">{app.patient_gender || '-'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <p className="text-slate-600 font-medium text-sm">{app.patient_phone}</p>
                                    </td>
                                    <td className="p-5">
                                        <p className="text-slate-500 text-xs max-w-[200px] truncate">{app.patient_address || '-'}</p>
                                    </td>
                                    <td className="p-5 text-slate-600 font-medium">
                                        <div className="flex items-center gap-2">
                                            <Clock size={14} className="text-blue-300" />
                                            {new Date(app.appointment_date).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase italic border border-slate-200">
                                            {app.doctor_name}
                                        </span>
                                    </td>
                                    <td className="p-5 text-center">
                                        <StatusBadge status={app.status} />
                                    </td>
                                    <td className="p-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => { setEditingApp(app); setIsEditModalOpen(true); }}
                                                className="p-2 text-slate-300 hover:text-blue-600 transition-colors"
                                            >
                                                <Edit3 size={16} />
                                            </button>
                                            {app.status !== 'confirmed' && (
                                                <button
                                                    onClick={() => handleUpdateStatus(app.id, 'confirmed')}
                                                    className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
                                                >
                                                    Confirm
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* MODAL EDIT PASIEN */}
            <AnimatePresence>
                {isEditModalOpen && editingApp && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white w-full max-w-lg rounded-2xl p-8 shadow-2xl relative"
                        >
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="absolute top-6 right-6 text-slate-300 hover:text-red-500 transition-all"
                            >
                                <X size={22} />
                            </button>
                            <h2 className="text-xl font-black text-slate-900 mb-1">Edit Data Pasien</h2>
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-6 italic">Pembaruan Informasi Reservasi</p>

                            <form onSubmit={handleSaveEdit} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Nama Pasien</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 bg-slate-50 rounded-xl border-none font-bold text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                                        value={editingApp.patient_name || ''}
                                        onChange={e => setEditingApp({ ...editingApp, patient_name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">WhatsApp</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 bg-slate-50 rounded-xl border-none font-bold text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                                        value={editingApp.patient_phone || ''}
                                        onChange={e => setEditingApp({ ...editingApp, patient_phone: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Alamat</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 bg-slate-50 rounded-xl border-none font-bold text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                                        value={editingApp.patient_address || ''}
                                        onChange={e => setEditingApp({ ...editingApp, patient_address: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Jenis Kelamin</label>
                                    <select
                                        className="w-full p-3 bg-slate-50 rounded-xl border-none font-bold text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                                        value={editingApp.patient_gender || ''}
                                        onChange={e => setEditingApp({ ...editingApp, patient_gender: e.target.value })}
                                        required
                                    >
                                        <option value="">-- Pilih --</option>
                                        <option value="Laki-laki">Laki-laki</option>
                                        <option value="Perempuan">Perempuan</option>
                                    </select>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-100 flex items-center justify-center gap-2 hover:bg-blue-700 transition-all mt-4"
                                >
                                    <Save size={16} /> Simpan Perubahan
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const s = status?.toLowerCase();
    if (s === 'confirmed') {
        return (
            <span className="inline-flex items-center justify-center gap-1 text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                <CheckCircle2 size={10} /> Confirmed
            </span>
        );
    }
    return (
        <span className="inline-flex items-center justify-center gap-1 text-[10px] font-black uppercase text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">
            <Clock size={10} /> Pending
        </span>
    );
}