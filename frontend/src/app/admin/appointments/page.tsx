'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CalendarCheck2,
    MessageCircle,
    Clock,
    User,
    MoreVertical,
    CheckCircle2,
    AlertCircle,
    Search,
    ExternalLink
} from 'lucide-react';

export default function AdminAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            // Ambil semua janji temu agar admin bisa melihat riwayat lengkap
            const res = await api.get('/clinic/appointments');
            setAppointments(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id: number, newStatus: string) => {
        try {
            await api.patch(`/clinic/appointments/${id}`, { status: newStatus });
            fetchAppointments(); // Refresh data
            alert(`Sesi berhasil diubah ke ${newStatus}`);
        } catch (err) {
            alert("Gagal memperbarui status");
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-black text-slate-900 tracking-tight">Reservations</h1>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        Monitoring Antrean & Konfirmasi Pasien
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                        <input
                            type="text"
                            placeholder="Cari pasien..."
                            className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs w-full md:w-64 focus:outline-none focus:ring-4 focus:ring-indigo-50 transition-all font-bold"
                        />
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50">
                            <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Patient</th>
                            <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Schedule</th>
                            <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Doctor</th>
                            <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">Status</th>
                            <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {appointments.length > 0 ? appointments.map((app: any) => (
                            <tr key={app.id} className="hover:bg-indigo-50/30 transition-colors group">
                                <td className="p-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center font-black text-sm border border-slate-200">
                                            {app.patient_name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-black text-[13px] text-slate-800 leading-tight">{app.patient_name}</p>
                                            <div className="flex items-center gap-1 mt-1">
                                                <MessageCircle size={10} className="text-emerald-500" />
                                                <span className="text-[10px] text-slate-400 font-bold tracking-tighter italic">{app.patient_phone}</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-5">
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Clock size={14} className="text-indigo-300" />
                                        <span className="text-[12px] font-bold">
                                            {new Date(app.appointment_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                                            <span className="text-slate-300 mx-1">•</span>
                                            {new Date(app.appointment_date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </td>
                                <td className="p-5">
                                    <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-tight italic border border-blue-100">
                                        {app.doctor_name}
                                    </span>
                                </td>
                                <td className="p-5 text-center">
                                    <StatusBadge status={app.status} />
                                </td>
                                <td className="p-5 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        {app.status === 'scheduled' || app.status === 'pending' ? (
                                            <button
                                                onClick={() => handleUpdateStatus(app.id, 'confirmed')}
                                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100 transition-all active:scale-95"
                                            >
                                                Confirm
                                            </button>
                                        ) : (
                                            <button className="p-2 text-slate-300 hover:text-indigo-600 transition-colors">
                                                <ExternalLink size={16} />
                                            </button>
                                        )}
                                        <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                                            <MoreVertical size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} className="p-20 text-center">
                                    <div className="flex flex-col items-center gap-2 opacity-30">
                                        <CalendarCheck2 size={48} />
                                        <p className="text-sm font-black uppercase tracking-[0.2em]">No Reservations Today</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// Komponen Kecil untuk Badge Status agar rapi
function StatusBadge({ status }: { status: string }) {
    const s = status?.toLowerCase();
    if (s === 'confirmed') return <span className="flex items-center justify-center gap-1 text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100"><CheckCircle2 size={10} /> Confirmed</span>;
    if (s === 'pending') return <span className="flex items-center justify-center gap-1 text-[10px] font-black uppercase text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-100"><Clock size={10} /> Pending</span>;
    return <span className="text-[10px] font-black uppercase text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">{status}</span>;
}