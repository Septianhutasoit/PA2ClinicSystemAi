'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    UserPlus, Trash2, Edit3, Save, X,
    UserCog, Camera, Upload, CheckCircle2,
    Search, Stethoscope, BriefcaseMedical, Loader2
} from 'lucide-react';

export default function ManageDoctors() {
    const [doctors, setDoctors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    // State untuk File Upload
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        specialty: '',
        photo_url: '',
        role: 'doctor',
        schedules: [{ day: 'Senin', time: '08:00 - 16:00', loc: 'Nauli Balige' }]
    });

    const addScheduleRow = () => {
        setFormData({
            ...formData,
            schedules: [...formData.schedules, { day: 'Senin', time: '08:00 - 16:00', loc: 'Klinik Balige' }]
        });
    };

    const removeScheduleRow = (index: number) => {
        const updatedSchedules = formData.schedules.filter((_, i) => i !== index);
        setFormData({ ...formData, schedules: updatedSchedules });
    };

    const updateScheduleValue = (index: number, field: string, value: string) => {
        const updatedSchedules = [...formData.schedules];
        updatedSchedules[index] = { ...updatedSchedules[index], [field]: value };
        setFormData({ ...formData, schedules: updatedSchedules });
    };

    useEffect(() => { fetchDoctors(); }, []);

    const fetchDoctors = async () => {
        try {
            const res = await api.get('/clinic/doctors');
            setDoctors(res.data);
        } catch (err) { console.error(err); }
        finally { setIsLoading(false); }
    };

    // Fungsi Menangani Pilih File
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file)); // Buat preview sementara
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.specialty) {
            alert("Nama dan Spesialisasi wajib diisi!");
            return;
        }
        setIsLoading(true);
        try {
            let finalPhotoUrl = formData.photo_url;
            
            if (selectedFile) {
                const uploadData = new FormData();
                uploadData.append('file', selectedFile);

                // Panggil API upload
                const resUpload = await api.post('/clinic/upload-photo', uploadData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                finalPhotoUrl = resUpload.data.url;
            }

            const dataToSave = { ...formData, photo_url: finalPhotoUrl,
            schedule: formData.schedules
        };

            if (editingId) {
                await api.patch(`/clinic/doctors/${editingId}`, dataToSave);
                alert("✅ Perubahan Berhasil Disimpan!");
            } else {
                // Gunakan POST untuk tambah baru
                await api.post('/clinic/doctors', dataToSave);
                alert("✅ Staff Baru Berhasil Ditambahkan!");
            }

            resetForm();
            fetchDoctors();
        } catch (err: any) {
            // Tampilkan error asli agar kita tahu rusaknya di mana
            console.error("Detail Error:", err.response?.data);
            alert("❌ Gagal: " + (err.response?.data?.detail || "Terjadi kesalahan pada server."));
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (doc: any) => {
        setFormData(doc);
        setPreviewUrl(doc.photo_url);
        setEditingId(doc.id);
        setIsFormOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm('Hapus staff ini dari sistem?')) {
            await api.delete(`/clinic/doctors/${id}`);
            fetchDoctors();
        }
    };

    const resetForm = () => {
        setFormData({ name: '', specialty: '', photo_url: '', role: 'doctor', schedules: [{ day: 'Senin', time: '08:00 - 16:00', loc: 'Nauli Balige' }] });
        setSelectedFile(null);
        setPreviewUrl(null);
        setEditingId(null);
        setIsFormOpen(false);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            {/* --- HEADER --- */}
            <div className="flex justify-between items-center bg-white p-6 rounded-[2.5rem] border border-blue-50 shadow-sm">
                <div>
                    <h1 className="text-xl font-black text-slate-900 tracking-tight italic">STAFF MANAGEMENT</h1>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-widest">Update Database Dokter & Perawat</p>
                </div>
                <button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-2xl text-[10px] font-black shadow-xl shadow-blue-100 transition-all hover:scale-105 active:scale-95">
                    <UserPlus size={16} /> REGISTER NEW STAFF
                </button>
            </div>

            {/* --- FORM MODAL --- */}
            <AnimatePresence>
                {isFormOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={resetForm} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white w-full max-w-2xl rounded-[3rem] p-10 shadow-2xl relative max-h-[90vh] overflow-y-auto border border-blue-50">
                            <button onClick={resetForm} className="absolute top-8 right-8 text-slate-300 hover:text-red-500 transition-colors"><X size={24} /></button>
                            <h2 className="text-2xl font-black text-slate-900 mb-8 uppercase italic">{editingId ? 'Edit Sesi Kerja' : 'Registrasi Staff'}</h2>

                            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Preview & Upload Foto */}
                                <div className="md:col-span-2 flex flex-col items-center justify-center p-8 bg-blue-50/50 rounded-[2rem] border-2 border-dashed border-blue-200 group relative overflow-hidden">
                                    {previewUrl ? (
                                        <img src={previewUrl} className="w-32 h-32 rounded-3xl object-cover shadow-lg border-4 border-white mb-4" alt="preview" />
                                    ) : (
                                        <Camera size={40} className="text-blue-300 mb-4" />
                                    )}
                                    {previewUrl && (
                                        <button
                                            type="button"
                                            onClick={() => { setSelectedFile(null); setPreviewUrl(null); setFormData({ ...formData, photo_url: '' }); }}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                                        >
                                            <X size={14} />
                                        </button>
                                    )}
                                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Pilih Foto dari Komputer</p>
                                    <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Nama Lengkap</label>
                                    <input type="text" className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold text-sm focus:ring-2 focus:ring-blue-600" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required placeholder="drg. Septian..." />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Tipe Peran (Role)</label>
                                    <select className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold text-sm appearance-none cursor-pointer" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                                        <option value="doctor">🩺 Dokter Spesialis</option>
                                        <option value="nurse">🚑 Perawat / Staff</option>
                                    </select>
                                </div>

                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Spesialisasi</label>
                                    <input type="text" className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold text-sm focus:ring-2 focus:ring-blue-600" value={formData.specialty} onChange={e => setFormData({ ...formData, specialty: e.target.value })} required placeholder="Bedah Mulut / Orthodontist" />
                                </div>

                                <div className="md:col-span-2 space-y-4 border-t border-slate-100 pt-6">
                                    <div className="flex justify-between items-center">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Pengaturan Jadwal Praktek</label>
                                        <button
                                            type="button"
                                            onClick={addScheduleRow}
                                            className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg hover:bg-blue-100 transition-all"
                                        >
                                            + TAMBAH HARI
                                        </button>
                                    </div>

                                    {formData.schedules.map((sch, index) => (
                                        <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl relative group">
                                            <input
                                                type="text" placeholder="Hari"
                                                className="bg-white p-3 rounded-xl text-xs font-bold border-none outline-none focus:ring-2 focus:ring-blue-600"
                                                value={sch.day} onChange={(e) => updateScheduleValue(index, 'day', e.target.value)}
                                            />
                                            <input
                                                type="text" placeholder="Jam (08:00 - 12:00)"
                                                className="bg-white p-3 rounded-xl text-xs font-bold border-none outline-none focus:ring-2 focus:ring-blue-600"
                                                value={sch.time} onChange={(e) => updateScheduleValue(index, 'time', e.target.value)}
                                            />
                                            <input
                                                type="text" placeholder="Lokasi Ruangan"
                                                className="bg-white p-3 rounded-xl text-xs font-bold border-none outline-none focus:ring-2 focus:ring-blue-600"
                                                value={sch.loc} onChange={(e) => updateScheduleValue(index, 'loc', e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeScheduleRow(index)}
                                                className="p-3 text-red-400 hover:text-red-600 transition-colors flex items-center justify-center"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <button className="md:col-span-2 w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3 mt-4">
                                    <Save size={18} /> {editingId ? 'SIMPAN PERUBAHAN' : 'DAFTARKAN STAFF'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* --- TABEL STAFF --- */}
            <div className="bg-white rounded-[2.5rem] border border-blue-50 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-blue-50/50">
                        <tr>
                            <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-blue-100">Personnel Info</th>
                            <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-blue-100 text-center">System Role</th>
                            <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-blue-100 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-50/50">
                        {isLoading ? <tr><td colSpan={3} className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-blue-600" /></td></tr> :
                            doctors.map((d: any) => (
                                <tr key={d.id} className="hover:bg-blue-50/30 transition-all group">
                                    <td className="p-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-2xl bg-blue-100 border-2 border-white overflow-hidden shadow-sm flex-shrink-0">
                                                <img src={d.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${d.name}`} className="w-full h-full object-cover" alt="avatar" />
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900 text-sm italic">{d.name}</p>
                                                <p className="text-[10px] font-bold text-blue-500 uppercase flex items-center gap-1"><Stethoscope size={10} /> {d.specialty}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5 text-center">
                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${d.role === 'doctor' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                            }`}>
                                            {d.role === 'doctor' ? 'Specialist' : 'Medical Staff'}
                                        </span>
                                    </td>
                                    <td className="p-5 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEdit(d)} className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><Edit3 size={16} /></button>
                                            <button onClick={() => handleDelete(d.id)} className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}