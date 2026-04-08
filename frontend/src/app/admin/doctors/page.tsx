'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    UserPlus, Trash2, Edit3, Save, X,
    UserCog, Camera, Upload, CheckCircle2,
    Search, Stethoscope, BriefcaseMedical, Loader2,
    MapPin, Clock, CalendarDays
} from 'lucide-react';

export default function ManageDoctors() {
    const [doctors, setDoctors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false); // State untuk loading tombol simpan
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        specialty: '',
        photo_url: '',
        role: 'doctor',
        schedules: [{ day: 'Senin', time: '08:00 - 16:00', loc: 'Nauli Balige' }]
    });

    // --- LOGIKA JADWAL DYNAMIS ---
    const addScheduleRow = () => {
        setFormData({
            ...formData,
            schedules: [...formData.schedules, { day: 'Senin', time: '08:00 - 16:00', loc: 'Nauli Balige' }]
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

    // --- FETCH DATA ---
    useEffect(() => { fetchDoctors(); }, []);

    const fetchDoctors = async () => {
        try {
            const res = await api.get('/clinic/doctors');
            setDoctors(res.data);
        } catch (err) { console.error(err); }
        finally { setIsLoading(false); }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    // --- LOGIKA SIMPAN (POST/PATCH) ---
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.specialty) return alert("Nama dan Spesialisasi wajib diisi!");

        setIsSaving(true);
        try {
            let finalPhotoUrl = formData.photo_url;

            // 1. Proses Upload Foto jika ada file baru
            if (selectedFile) {
                const uploadData = new FormData();
                uploadData.append('file', selectedFile);
                const resUpload = await api.post('/clinic/upload-photo', uploadData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                finalPhotoUrl = resUpload.data.url;
            }

            // 2. Siapkan data (Pastikan nama field 'schedules' plural sesuai Backend)
            const dataToSave = {
                ...formData,
                photo_url: finalPhotoUrl,
                schedules: formData.schedules
            };

            if (editingId) {
                await api.patch(`/clinic/doctors/${editingId}`, dataToSave);
                alert("✅ Data Berhasil Diperbarui!");
            } else {
                await api.post('/clinic/doctors', dataToSave);
                alert("✅ Staff Baru Berhasil Didaftarkan!");
            }

            resetForm();
            fetchDoctors();
        } catch (err: any) {
            console.error("Error Detail:", err.response?.data);
            alert("❌ Gagal: " + (err.response?.data?.detail || "Koneksi Bermasalah"));
        } finally {
            setIsSaving(false);
        }
    };

    const handleEdit = (doc: any) => {
        setFormData({
            ...doc,
            schedules: doc.schedules || []
        });
        setPreviewUrl(doc.photo_url);
        setEditingId(doc.id);
        setIsFormOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm('Hapus staff ini secara permanen dari sistem?')) {
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
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            {/* --- HEADER --- */}
            <div className="flex justify-between items-center bg-white p-6 rounded-[2.5rem] border border-blue-50 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200"><UserCog size={24} /></div>
                    <div>
                        <h1 className="text-xl font-black text-slate-900 tracking-tight italic uppercase">Staff Directory</h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1 italic">Authorized Personnel Only</p>
                    </div>
                </div>
                <button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl text-[10px] font-black shadow-xl shadow-blue-100 hover:scale-105 active:scale-95 transition-all">
                    <UserPlus size={16} /> REGISTER NEW STAFF
                </button>
            </div>

            {/* --- FORM MODAL --- */}
            <AnimatePresence>
                {isFormOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white w-full max-w-2xl rounded-[3rem] p-10 shadow-2xl relative max-h-[90vh] overflow-y-auto border border-blue-50">
                            <button onClick={resetForm} className="absolute top-8 right-8 text-slate-300 hover:text-red-500 transition-colors"><X size={28} /></button>
                            <h2 className="text-2xl font-black text-slate-900 mb-8 uppercase italic">{editingId ? 'Edit Profile Staff' : 'Registrasi Staff Baru'}</h2>

                            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Upload Foto */}
                                <div className="md:col-span-2 flex flex-col items-center justify-center p-8 bg-blue-50/50 rounded-[2.5rem] border-2 border-dashed border-blue-200 group relative">
                                    {previewUrl ? (
                                        <div className="relative group">
                                            <img src={previewUrl} className="w-32 h-32 rounded-3xl object-cover shadow-xl border-4 border-white" alt="preview" />
                                            <button type="button" onClick={() => { setSelectedFile(null); setPreviewUrl(null); }} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"><X size={14} /></button>
                                        </div>
                                    ) : (
                                        <Camera size={40} className="text-blue-300" />
                                    )}
                                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-4 italic">Klik untuk Upload Foto Lokal</p>
                                    <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Nama Lengkap</label>
                                    <input type="text" className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold text-sm focus:ring-2 focus:ring-blue-600 outline-none" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Tipe Jabatan</label>
                                    <select className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold text-sm appearance-none cursor-pointer" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                                        <option value="doctor">🩺 Dokter Spesialis</option>
                                        <option value="nurse">🚑 Perawat / Staff Medis</option>
                                    </select>
                                </div>

                                <div className="md:col-span-2 space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Spesialisasi</label>
                                    <input type="text" className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold text-sm focus:ring-2 focus:ring-blue-600 outline-none" value={formData.specialty} onChange={e => setFormData({ ...formData, specialty: e.target.value })} required />
                                </div>

                                {/* Bagian Input Jadwal */}
                                <div className="md:col-span-2 space-y-4 border-t border-slate-100 pt-6 mt-4">
                                    <div className="flex justify-between items-center">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Detail Jadwal Praktek</h4>
                                        <button type="button" onClick={addScheduleRow} className="text-[9px] font-black bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-all">+ TAMBAH BARIS</button>
                                    </div>
                                    {(formData.schedules || []).map((sch, index) => (
                                        <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-50/50 p-4 rounded-3xl border border-slate-100 relative group">
                                            <input type="text" placeholder="Hari" className="bg-white p-3 rounded-xl text-xs font-bold border-none outline-none focus:ring-2 focus:ring-blue-600 shadow-sm" value={sch.day} onChange={(e) => updateScheduleValue(index, 'day', e.target.value)} />
                                            <input type="text" placeholder="Jam" className="bg-white p-3 rounded-xl text-xs font-bold border-none outline-none focus:ring-2 focus:ring-blue-600 shadow-sm" value={sch.time} onChange={(e) => updateScheduleValue(index, 'time', e.target.value)} />
                                            <input type="text" placeholder="Lokasi" className="bg-white p-3 rounded-xl text-xs font-bold border-none outline-none focus:ring-2 focus:ring-blue-600 shadow-sm" value={sch.loc} onChange={(e) => updateScheduleValue(index, 'loc', e.target.value)} />
                                            <button type="button" onClick={() => removeScheduleRow(index)} className="p-3 text-red-400 hover:text-red-600 transition-colors flex items-center justify-center"><Trash2 size={18} /></button>
                                        </div>
                                    ))}
                                </div>

                                <button disabled={isSaving} className="md:col-span-2 w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3 mt-6">
                                    {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} {editingId ? 'UPDATE DATA STAFF' : 'SAVE TO DATABASE'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* --- TABEL STAFF (CLEAN) --- */}
            <div className="bg-white rounded-[2.5rem] border border-blue-50 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-blue-50/50">
                        <tr>
                            <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-blue-100">Personnel Info</th>
                            <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-blue-100 text-center">Status Role</th>
                            <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-blue-100 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-50/50">
                        {isLoading ? <tr><td colSpan={3} className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-blue-600" /></td></tr> :
                            doctors.map((d: any) => (
                                <tr key={d.id} className="hover:bg-blue-50/20 transition-all group">
                                    <td className="p-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-2xl bg-white border border-blue-100 overflow-hidden shadow-sm flex-shrink-0">
                                                <img src={d.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${d.name}`} className="w-full h-full object-cover" alt="avatar" />
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900 text-sm italic tracking-tight">{d.name}</p>
                                                <p className="text-[10px] font-black text-blue-500 uppercase flex items-center gap-1"><Stethoscope size={10} /> {d.specialty}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5 text-center">
                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${d.role === 'doctor' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                                            {d.role === 'doctor' ? 'Specialist' : 'Medical Staff'}
                                        </span>
                                    </td>
                                    <td className="p-5 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEdit(d)} className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"><Edit3 size={18} /></button>
                                            <button onClick={() => handleDelete(d.id)} className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"><Trash2 size={18} /></button>
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