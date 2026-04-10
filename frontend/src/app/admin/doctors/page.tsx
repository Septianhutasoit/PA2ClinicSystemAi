'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    UserPlus, Trash2, Edit3, Save, X,
    UserCog, Camera, Upload, CheckCircle2,
    Search, Stethoscope, BriefcaseMedical, Loader2,
    MapPin, Clock, CalendarDays, Sparkles, ShieldCheck,
    Phone, Mail, ChevronRight
} from 'lucide-react';
import Link from 'next/link';

export default function ManageDoctors() {
    const [doctors, setDoctors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        specialty: '',
        photo_url: '',
        role: 'doctor',
        phone: '',
        email: '',
        experience: '',
        schedules: [{ day: 'Senin', time: '08:00 - 16:00', loc: 'Nauli Balige' }]
    });

    // Filter doctors based on search
    const filteredDoctors = doctors.filter(doc =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.specialty) return alert("Nama dan Spesialisasi wajib diisi!");

        setIsSaving(true);
        try {
            let finalPhotoUrl = formData.photo_url;

            if (selectedFile) {
                const uploadData = new FormData();
                uploadData.append('file', selectedFile);
                const resUpload = await api.post('/clinic/upload-photo', uploadData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                finalPhotoUrl = resUpload.data.url;
            }

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
            // Gunakan log ini agar pesan error asli dari terminal Python muncul di browser
            console.error("DEBUG ERROR LENGKAP:", err);
            const detail = err.response?.data?.detail;
            alert("❌ Gagal Simpan: " + (typeof detail === 'string' ? detail : "Cek terminal Backend (Uvicorn)"));
        } finally {
            setIsSaving(false);
        }
    };

    const handleEdit = (doc: any) => {
        setFormData({
            ...doc,
            phone: doc.phone || '',
            email: doc.email || '',
            experience: doc.experience || '',
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
        setFormData({
            name: '',
            specialty: '',
            photo_url: '',
            role: 'doctor',
            phone: '',
            email: '',
            experience: '',
            schedules: [{ day: 'Senin', time: '08:00 - 16:00', loc: 'Nauli Balige' }]
        });
        setSelectedFile(null);
        setPreviewUrl(null);
        setEditingId(null);
        setIsFormOpen(false);
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                        <Stethoscope size={28} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                            Medical Team
                        </h1>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Kelola data dokter dan staff medis
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-lg shadow-emerald-200 hover:scale-105 active:scale-95 transition-all duration-200"
                >
                    <UserPlus size={18} /> Tambah Staff
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    placeholder="Cari dokter atau spesialisasi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                />
            </div>

            {/* FORM MODAL - MODERN */}
            <AnimatePresence>
                {isFormOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl relative max-h-[90vh] overflow-y-auto"
                        >
                            <div className="sticky top-0 bg-white border-b border-slate-100 px-8 py-6 flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-black text-slate-800">
                                        {editingId ? 'Edit Staff Medis' : 'Tambah Staff Baru'}
                                    </h2>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        Isi informasi lengkap staff medis
                                    </p>
                                </div>
                                <button
                                    onClick={resetForm}
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSave} className="p-8 space-y-6">
                                {/* Upload Foto */}
                                <div className="flex flex-col items-center">
                                    <div className="relative group cursor-pointer">
                                        <div className="w-28 h-28 rounded-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center shadow-md">
                                            {previewUrl ? (
                                                <img src={previewUrl} className="w-full h-full object-cover" alt="preview" />
                                            ) : (
                                                <Camera size={32} className="text-slate-400" />
                                            )}
                                        </div>
                                        <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                            <Upload size={20} className="text-white" />
                                        </div>
                                        <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer rounded-full" />
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-2">Klik untuk upload foto</p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-600">Nama Lengkap</label>
                                        <input
                                            type="text"
                                            placeholder="Dr. John Doe"
                                            className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-600">Tipe Jabatan</label>
                                        <select
                                            className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                            value={formData.role}
                                            onChange={e => setFormData({ ...formData, role: e.target.value })}
                                        >
                                            <option value="doctor">🩺 Dokter Spesialis</option>
                                            <option value="nurse">🚑 Perawat / Staff Medis</option>
                                        </select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-600">Spesialisasi</label>
                                        <input
                                            type="text"
                                            placeholder="Spesialis Gigi Anak"
                                            className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                            value={formData.specialty}
                                            onChange={e => setFormData({ ...formData, specialty: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-600">Pengalaman (Tahun)</label>
                                        <input
                                            type="text"
                                            placeholder="5+ tahun"
                                            className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                            value={formData.experience}
                                            onChange={e => setFormData({ ...formData, experience: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-600">Nomor Telepon</label>
                                        <input
                                            type="text"
                                            placeholder="+62 812 3456 7890"
                                            className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-600">Email</label>
                                        <input
                                            type="email"
                                            placeholder="doctor@nauli.com"
                                            className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Jadwal Section */}
                                <div className="border-t border-slate-100 pt-5">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                            <CalendarDays size={16} /> Jadwal Praktek
                                        </h4>
                                        <button
                                            type="button"
                                            onClick={addScheduleRow}
                                            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                                        >
                                            + Tambah Jadwal
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        {(formData.schedules || []).map((sch, index) => (
                                            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                                <input
                                                    type="text"
                                                    placeholder="Hari"
                                                    className="bg-white px-3 py-2 rounded-lg text-sm border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                                                    value={sch.day}
                                                    onChange={(e) => updateScheduleValue(index, 'day', e.target.value)}
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Jam"
                                                    className="bg-white px-3 py-2 rounded-lg text-sm border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                                                    value={sch.time}
                                                    onChange={(e) => updateScheduleValue(index, 'time', e.target.value)}
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Lokasi"
                                                    className="bg-white px-3 py-2 rounded-lg text-sm border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                                                    value={sch.loc}
                                                    onChange={(e) => updateScheduleValue(index, 'loc', e.target.value)}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeScheduleRow(index)}
                                                    className="text-red-400 hover:text-red-600 transition-colors p-2"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    disabled={isSaving}
                                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                                >
                                    {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                    {editingId ? 'Update Data Staff' : 'Simpan Staff'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Doctors Grid - Modern Card Layout */}
            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-emerald-500" size={40} />
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDoctors.map((doctor: any, idx: number) => (
                        <motion.div
                            key={doctor.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                        >
                            {/* Card Header with Photo */}
                            <div className="relative h-32 bg-gradient-to-r from-emerald-500 to-teal-600">
                                <div className="absolute -bottom-10 left-6">
                                    <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-white">
                                        <img
                                            src={doctor.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${doctor.name}`}
                                            className="w-full h-full object-cover"
                                            alt={doctor.name}
                                        />
                                    </div>
                                </div>
                                <div className="absolute top-4 right-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${doctor.role === 'doctor'
                                            ? 'bg-white/20 text-white backdrop-blur-sm'
                                            : 'bg-white/20 text-white backdrop-blur-sm'
                                        }`}>
                                        {doctor.role === 'doctor' ? 'Dokter' : 'Staff Medis'}
                                    </span>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="pt-14 pb-5 px-6">
                                <h3 className="text-lg font-bold text-slate-800">{doctor.name}</h3>
                                <p className="text-sm text-emerald-600 font-semibold mt-0.5">{doctor.specialty}</p>

                                {doctor.experience && (
                                    <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                                        <BriefcaseMedical size={12} /> {doctor.experience} tahun pengalaman
                                    </p>
                                )}

                                {/* Schedule Preview */}
                                {doctor.schedules && doctor.schedules.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-slate-100">
                                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Jadwal Praktek</p>
                                        <div className="space-y-1.5">
                                            {doctor.schedules.slice(0, 2).map((schedule: any, sIdx: number) => (
                                                <div key={sIdx} className="flex items-center gap-2 text-xs text-slate-600">
                                                    <Clock size={12} className="text-slate-400" />
                                                    <span>{schedule.day}, {schedule.time}</span>
                                                </div>
                                            ))}
                                            {doctor.schedules.length > 2 && (
                                                <p className="text-[10px] text-slate-400">+{doctor.schedules.length - 2} jadwal lainnya</p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex items-center gap-2 mt-5 pt-3">
                                    <button
                                        onClick={() => handleEdit(doctor)}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-xs font-semibold hover:bg-emerald-50 hover:text-emerald-600 transition-all"
                                    >
                                        <Edit3 size={14} /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(doctor.id)}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 text-red-500 rounded-xl text-xs font-semibold hover:bg-red-50 transition-all"
                                    >
                                        <Trash2 size={14} /> Hapus
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!isLoading && filteredDoctors.length === 0 && (
                <div className="text-center py-20">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Stethoscope size={32} className="text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-600">Belum ada data staff</h3>
                    <p className="text-sm text-slate-400 mt-1">Klik tombol "Tambah Staff" untuk menambahkan</p>
                </div>
            )}
        </div>
    );
}