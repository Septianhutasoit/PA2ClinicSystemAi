'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';

export default function ManageDoctors() {
    const [doctors, setDoctors] = useState([]);
    const [newDoc, setNewDoc] = useState({ name: '', specialty: '', schedule: '' });

    useEffect(() => { fetchDoctors(); }, []);
    const fetchDoctors = () => api.get('/clinic/doctors').then(res => setDoctors(res.data));

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/clinic/doctors', newDoc);
            setNewDoc({ name: '', specialty: '', schedule: '' });
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
        <div className="space-y-10">
            <header>
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Kelola Dokter</h1>
                <p className="text-slate-500 mt-2 font-medium">Tambah atau hapus data praktisi klinik Anda.</p>
            </header>

            {/* Card Form Tambah */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <h2 className="text-sm font-bold text-slate-400 uppercase mb-6 tracking-widest">Tambah Dokter Baru</h2>
                <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                    <div className="md:col-span-1">
                        <label className="block text-xs font-bold text-slate-700 mb-2">NAMA LENGKAP</label>
                        <input type="text" className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Contoh: dr. Septian" value={newDoc.name} onChange={e => setNewDoc({ ...newDoc, name: e.target.value })} required />
                    </div>
                    <div className="md:col-span-1">
                        <label className="block text-xs font-bold text-slate-700 mb-2">SPESIALISASI</label>
                        <input type="text" className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Contoh: Gigi" value={newDoc.specialty} onChange={e => setNewDoc({ ...newDoc, specialty: e.target.value })} required />
                    </div>
                    <div className="md:col-span-1">
                        <label className="block text-xs font-bold text-slate-700 mb-2">JADWAL</label>
                        <input type="text" className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Senin - Jumat" value={newDoc.schedule} onChange={e => setNewDoc({ ...newDoc, schedule: e.target.value })} required />
                    </div>
                    <button className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-blue-600 transition-all shadow-lg shadow-slate-200">
                        SIMPAN DATA
                    </button>
                </form>
            </div>

            {/* Table Area */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50">
                            <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Nama Dokter</th>
                            <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Spesialisasi</th>
                            <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {doctors.map((d: any) => (
                            <tr key={d.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                                            {d.name.charAt(0)}
                                        </div>
                                        <span className="font-bold text-slate-700">{d.name}</span>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[11px] font-black uppercase italic">
                                        {d.specialty}
                                    </span>
                                </td>
                                <td className="p-6">
                                    <button
                                        onClick={() => handleDelete(d.id)}
                                        className="text-slate-300 hover:text-red-500 font-bold text-xs uppercase tracking-tighter transition-colors"
                                    >
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
