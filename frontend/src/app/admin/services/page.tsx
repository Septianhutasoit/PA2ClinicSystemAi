'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { Plus, Trash2, Stethoscope, DollarSign } from 'lucide-react';

export default function ManageServices() {
    const [services, setServices] = useState([]);
    const [newService, setNewService] = useState({ name: '', price: '', description: '' });

    useEffect(() => { fetchServices(); }, []);
    const fetchServices = () => api.get('/clinic/services').then(res => setServices(res.data));

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/clinic/services', newService);
            setNewService({ name: '', price: '', description: '' });
            fetchServices(); // Refresh tabel
            alert("Layanan berhasil ditambahkan & muncul di web pasien!");
        } catch (err) { alert("Gagal menambah layanan"); }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Manajemen Layanan</h1>

            {/* FORM INPUT ADMIN */}
            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
                <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Nama Layanan</label>
                        <input type="text" className="w-full p-3 bg-slate-50 rounded-xl text-sm border-none focus:ring-2 focus:ring-blue-500" placeholder="Contoh: Scaling Gigi" value={newService.name} onChange={e => setNewService({ ...newService, name: e.target.value })} required />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Harga (Rp)</label>
                        <input type="text" className="w-full p-3 bg-slate-50 rounded-xl text-sm border-none focus:ring-2 focus:ring-blue-500" placeholder="Contoh: 250.000" value={newService.price} onChange={e => setNewService({ ...newService, price: e.target.value })} required />
                    </div>
                    <button className="bg-blue-600 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                        <Plus size={16} /> Simpan Layanan
                    </button>
                    <div className="md:col-span-3 space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Deskripsi Singkat</label>
                        <input type="text" className="w-full p-3 bg-slate-50 rounded-xl text-sm border-none focus:ring-2 focus:ring-blue-500" placeholder="Jelaskan prosedur layanan ini..." value={newService.description} onChange={e => setNewService({ ...newService, description: e.target.value })} />
                    </div>
                </form>
            </div>

            {/* TABEL PREVIEW UNTUK ADMIN */}
            <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/50">
                        <tr>
                            <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Nama Layanan</th>
                            <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Harga</th>
                            <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {services.map((s: any) => (
                            <tr key={s.id} className="hover:bg-blue-50/20 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center"><Stethoscope size={16} /></div>
                                        <p className="font-bold text-slate-800 text-[13px]">{s.name}</p>
                                    </div>
                                </td>
                                <td className="p-4 font-bold text-blue-600 text-[13px]">Rp {s.price}</td>
                                <td className="p-4 text-right">
                                    <button className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}