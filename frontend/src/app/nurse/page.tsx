'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { motion } from 'framer-motion';
import { 
    Users, Clock, CheckCircle2, 
    AlertCircle, Search, Bell,
    ArrowRight, Loader2
} from 'lucide-react';

export default function NurseDashboard() {
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchTodayAppointments();
    }, []);

    const fetchTodayAppointments = async () => {
        try {
            const res = await api.get('/clinic/appointments');
            // Mock filter untuk hari ini (asumsikan data dari backend)
            setAppointments(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusUpdate = async (id: number, newStatus: string) => {
        try {
            await api.patch(`/clinic/appointments/${id}`, { status: newStatus });
            alert(`Pasien berhasil diperbarui ke: ${newStatus}`);
            fetchTodayAppointments();
        } catch (err) {
            alert("Gagal memperbarui status");
        }
    };

    const filtered = appointments.filter((a: any) => 
        a.patient_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 pb-20">
            {/* Upper Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                        Nurse Information System
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">
                        Manajemen antrian dan pelayanan pasien hari ini
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="hidden md:block text-right">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Status Tugas</p>
                        <p className="text-sm font-bold text-emerald-600">Aktif / On Duty</p>
                    </div>
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                        <Bell size={20} />
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Pasien</p>
                    <p className="text-2xl font-black text-slate-800">{appointments.length}</p>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Menunggu</p>
                    <p className="text-2xl font-black text-amber-500">{appointments.filter((a:any) => a.status === 'pending').length}</p>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Dalam Periksa</p>
                    <p className="text-2xl font-black text-blue-500">{appointments.filter((a:any) => a.status === 'scheduled').length}</p>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Selesai</p>
                    <p className="text-2xl font-black text-emerald-500">{appointments.filter((a:any) => a.status === 'completed').length}</p>
                </div>
            </div>

            {/* Search & Action */}
            <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                    type="text"
                    placeholder="Cari nama pasien di antrian..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all shadow-sm"
                />
            </div>

            {/* Antiue Table */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pasien & Waktu</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Dokter Tujuan</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Tindakan Perawat</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="py-20 text-center">
                                        <Loader2 className="animate-spin text-emerald-500 mx-auto" size={32} />
                                    </td>
                                </tr>
                            ) : filtered.map((app: any, idx: number) => (
                                <motion.tr 
                                    key={app.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="hover:bg-slate-50/50 transition-colors"
                                >
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs">
                                                {app.patient_name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">{app.patient_name}</p>
                                                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                                                    <Clock size={10} /> {new Date(app.appointment_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <p className="text-xs font-semibold text-slate-600">{app.doctor_name}</p>
                                        <p className="text-[10px] text-slate-400">Poli Umum</p>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                            app.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                                            app.status === 'scheduled' ? 'bg-blue-50 text-blue-600' :
                                            'bg-amber-50 text-amber-600'
                                        }`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        {app.status === 'pending' ? (
                                            <button 
                                                onClick={() => handleStatusUpdate(app.id, 'scheduled')}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-md shadow-emerald-100"
                                            >
                                                Panggil Ke Poli <ArrowRight size={12} />
                                            </button>
                                        ) : app.status === 'scheduled' ? (
                                            <button 
                                                onClick={() => handleStatusUpdate(app.id, 'completed')}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all"
                                            >
                                                Selesaikan <CheckCircle2 size={12} />
                                            </button>
                                        ) : (
                                            <span className="text-[10px] font-black text-slate-300 uppercase italic">Tindakan Selesai</span>
                                        )}
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Empty State */}
            {!isLoading && filtered.length === 0 && (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                    <Users size={40} className="mx-auto text-slate-200 mb-3" />
                    <p className="text-slate-400 text-sm font-medium">Tidak ada antrian pasien saat ini</p>
                </div>
            )}
        </div>
    );
}
