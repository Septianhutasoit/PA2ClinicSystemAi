'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { motion } from 'framer-motion';
import { UserPlus, Trash2, MoreVertical, Star, UserCog, CalendarDays } from 'lucide-react';

export default function ManageDoctors() {
    const [doctors, setDoctors] = useState([]);
    const [newDoc, setNewDoc] = useState({ name: '', specialty: '', schedule: '' });
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => { fetchDoctors(); }, []);
    const fetchDoctors = () => api.get('/clinic/doctors').then(res => setDoctors(res.data));

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/clinic/doctors', newDoc);
            setNewDoc({ name: '', specialty: '', schedule: '' });
            setIsAdding(false);
            fetchDoctors();
        } catch (err) { alert("Gagal menambah dokter"); }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Yakin ingin menghapus data dokter ini?')) {
            await api.delete(`/clinic/doctors/${id}`);
            fetchDoctors();
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Area - Zendenta Style */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-800 tracking-tight">Staff List</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                            {doctors.length} Doctors
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium italic">Active Personnel</span>
                    </div>
                </div>

                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="flex items-center justify-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white px-5 py-2.5 rounded-xl text-[12px] font-bold shadow-lg shadow-indigo-100 transition-all active:scale-95"
                >
                    <UserPlus size={16} />
                    {isAdding ? "Cancel Adding" : "Add Staff Member"}
                </button>
            </div>

            {/* Form Input - Collapsible (Hanya muncul jika klik Add) */}
            {isAdding && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
                >
                    <h2 className="text-[11px] font-black text-slate-400 uppercase mb-4 tracking-widest">Register New Doctor</h2>
                    <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-tight">Full Name</label>
                            <input type="text" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:bg-white text-xs outline-none transition-all" placeholder="dr. Septian Sp.G" value={newDoc.name} onChange={e => setNewDoc({ ...newDoc, name: e.target.value })} required />
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-tight">Specialization</label>
                            <input type="text" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:bg-white text-xs outline-none transition-all" placeholder="Dental Surgeon" value={newDoc.specialty} onChange={e => setNewDoc({ ...newDoc, specialty: e.target.value })} required />
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-tight">Schedule</label>
                            <input type="text" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:bg-white text-xs outline-none transition-all" placeholder="Mon - Fri" value={newDoc.schedule} onChange={e => setNewDoc({ ...newDoc, schedule: e.target.value })} required />
                        </div>
                        <button className="w-full bg-slate-900 text-white py-2.5 rounded-xl font-bold text-[11px] hover:bg-slate-800 transition-all uppercase tracking-widest">
                            Save Member
                        </button>
                    </form>
                </motion.div>
            )}

            {/* Table Area - Modern Zendenta UI */}
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50">
                            <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Doctor Name</th>
                            <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Specialization</th>
                            <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">Schedule</th>
                            <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {doctors.map((d: any) => (
                            <tr key={d.id} className="hover:bg-[#F8F9FF] transition-colors group">
                                <td className="p-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-sm border border-indigo-100">
                                            {d.name.charAt(4) || d.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-[13px] text-slate-800">{d.name}</p>
                                            <div className="flex items-center gap-1 mt-0.5">
                                                <Star size={10} className="fill-yellow-400 text-yellow-400" />
                                                <span className="text-[10px] text-slate-400 font-bold tracking-tight">4.9 (High Rating)</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-5">
                                    <span className="px-2.5 py-1 bg-cyan-50 text-cyan-600 rounded-lg text-[10px] font-black uppercase italic tracking-tighter">
                                        {d.specialty}
                                    </span>
                                </td>
                                <td className="p-5 text-center">
                                    <div className="flex items-center justify-center gap-2 text-slate-500">
                                        <CalendarDays size={14} className="text-slate-300" />
                                        <span className="text-[11px] font-medium">{d.schedule || 'Regular Visit'}</span>
                                    </div>
                                </td>
                                <td className="p-5 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => handleDelete(d.id)}
                                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                            title="Delete Doctor"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                        <button className="p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                                            <MoreVertical size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {doctors.length === 0 && (
                    <div className="p-20 text-center space-y-3 opacity-40">
                        <UserCog size={48} className="mx-auto text-slate-300" />
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest italic">No Doctor Data Found</p>
                    </div>
                )}
            </div>
        </div>
    );
}