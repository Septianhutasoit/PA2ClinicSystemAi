'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Trash2, Edit3, Save, X, Camera,
    Stethoscope, Loader2, Image as ImageIcon,
    Clock, Info, Sparkles, Tag, FileText
} from 'lucide-react';

export default function ManageServices() {
    const [services, setServices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        image_url: '',
        detail_info: '',
        gallery_urls: [] as string[]
    });

    useEffect(() => { fetchServices(); }, []);

    const fetchServices = async () => {
        try {
            const res = await api.get('/clinic/services');
            setServices(res.data);
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

    const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setGalleryFiles(prev => [...prev, ...files]);
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setGalleryPreviews(prev => [...prev, ...newPreviews]);
    };

    const removeGalleryImage = (index: number) => {
        setGalleryFiles(prev => prev.filter((_, i) => i !== index));
        setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            let finalImageUrl = formData.image_url;
            let finalGalleryUrls = formData.gallery_urls || [];

            if (selectedFile) {
                const uploadData = new FormData();
                uploadData.append('file', selectedFile);
                const resUpload = await api.post('/clinic/upload-photo', uploadData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                finalImageUrl = resUpload.data.url;
            }

            if (galleryFiles.length > 0) {
                for (const file of galleryFiles) {
                    const uploadData = new FormData();
                    uploadData.append('file', file);
                    const resUpload = await api.post('/clinic/upload-photo', uploadData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                    finalGalleryUrls.push(resUpload.data.url);
                }
            }

            const dataToSave = {
                ...formData,
                image_url: finalImageUrl,
                gallery_urls: finalGalleryUrls
            };

            if (editingId) {
                await api.patch(`/clinic/services/${editingId}`, dataToSave);
                alert("✅ Layanan Berhasil Diperbarui!");
            } else {
                await api.post('/clinic/services', dataToSave);
                alert("✅ Layanan Baru Berhasil Ditambahkan!");
            }
            
            await fetchServices();
            resetForm();
            alert("✅ Berhasil Sinkron ke Database Cloud!");

            resetForm();
            fetchServices();
        } catch (err) { alert("❌ Gagal menyimpan data"); }
        finally { setIsSaving(false); }
    };

    const handleEdit = (item: any) => {
        setFormData({
            name: item.name,
            description: item.description || '',
            price: item.price,
            image_url: item.image_url || '',
            detail_info: item.detail_info || '',
            gallery_urls: item.gallery_urls || []
        });
        setPreviewUrl(item.image_url);
        setGalleryPreviews(item.gallery_urls || []);
        setEditingId(item.id);
        setIsFormOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm('Hapus layanan ini dari daftar?')) {
            await api.delete(`/clinic/services/${id}`);
            fetchServices();
        }
    };

    const resetForm = () => {
        setFormData({ name: '', description: '', price: '', image_url: '', detail_info: '', gallery_urls: [] });
        setSelectedFile(null);
        setPreviewUrl(null);
        setGalleryFiles([]);
        setGalleryPreviews([]);
        setEditingId(null);
        setIsFormOpen(false);
    };

    return (
        <div className="space-y-6 pb-20">
            {/* HEADER - Modern */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white shadow-md">
                        <Stethoscope size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">Layanan Klinik</h1>
                        <p className="text-xs text-slate-400 mt-0.5">Kelola daftar layanan dan perawatan gigi</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-all shadow-md"
                >
                    <Plus size={18} /> Tambah Layanan
                </button>
            </div>

            {/* SERVICES GRID - 3 Kolom Rapi */}
            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-emerald-500" size={40} />
                </div>
            ) : services.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Stethoscope size={32} className="text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-600">Belum Ada Layanan</h3>
                    <p className="text-sm text-slate-400 mt-1">Klik tombol "Tambah Layanan" untuk memulai</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((item: any) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -4 }}
                            className="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                        >
                            {/* Image */}
                            <div className="relative h-48 overflow-hidden bg-slate-100">
                                {item.image_url ? (
                                    <img
                                        src={item.image_url}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                        alt={item.name}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <ImageIcon size={48} className="text-slate-300" />
                                    </div>
                                )}
                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 shadow-sm">
                                    <p className="text-xs font-bold text-emerald-600">Rp {item.price?.toLocaleString()}</p>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <h3 className="text-lg font-bold text-slate-800 mb-1 line-clamp-1">{item.name}</h3>
                                <p className="text-xs text-slate-500 line-clamp-2 mb-3">{item.description || 'Tidak ada deskripsi'}</p>

                                {/* Info tambahan */}
                                <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
                                    <span className="flex items-center gap-1"><Clock size={12} /> 30-60 menit</span>
                                    <span className="flex items-center gap-1"><Tag size={12} /> Premium</span>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2 pt-3 border-t border-slate-100">
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-slate-50 text-slate-600 rounded-lg text-xs font-medium hover:bg-emerald-50 hover:text-emerald-600 transition-all"
                                    >
                                        <Edit3 size={12} /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-slate-50 text-red-500 rounded-lg text-xs font-medium hover:bg-red-50 transition-all"
                                    >
                                        <Trash2 size={12} /> Hapus
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* FORM MODAL - Modern & Rapi */}
            <AnimatePresence>
                {isFormOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl relative my-8"
                        >
                            {/* Header Modal */}
                            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex justify-between items-center rounded-t-2xl">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800">
                                        {editingId ? 'Edit Layanan' : 'Tambah Layanan Baru'}
                                    </h2>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        Isi informasi lengkap layanan klinik
                                    </p>
                                </div>
                                <button
                                    onClick={resetForm}
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Form Body */}
                            <form onSubmit={handleSave} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                                {/* Cover Image Upload */}
                                <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center cursor-pointer hover:border-emerald-300 hover:bg-emerald-50/20 transition-all" onClick={() => document.getElementById('coverInput')?.click()}>
                                    {previewUrl ? (
                                        <div className="relative">
                                            <img src={previewUrl} className="w-full h-40 object-cover rounded-lg" />
                                            <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                <Camera size={24} className="text-white" />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="py-8">
                                            <Camera size={40} className="mx-auto text-slate-300 mb-2" />
                                            <p className="text-sm text-slate-500">Upload Gambar Layanan</p>
                                            <p className="text-xs text-slate-400 mt-1">JPG, PNG, atau WEBP (Max 2MB)</p>
                                        </div>
                                    )}
                                    <input id="coverInput" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-semibold text-slate-600 block mb-1">Nama Layanan</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2.5 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            required
                                            placeholder="Contoh: Scaling Gigi"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-slate-600 block mb-1">Harga (Rp)</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2.5 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                            value={formData.price}
                                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                                            required
                                            placeholder="Contoh: 250000"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-slate-600 block mb-1">Deskripsi Singkat</label>
                                    <textarea
                                        rows={2}
                                        className="w-full px-4 py-2.5 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all resize-none"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        required
                                        placeholder="Jelaskan secara singkat layanan ini..."
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-slate-600 block mb-1 flex items-center gap-1">
                                        <Info size={12} /> Detail Informasi Layanan
                                    </label>
                                    <textarea
                                        rows={3}
                                        className="w-full px-4 py-2.5 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all resize-none"
                                        placeholder="Manfaat, prosedur, persiapan, dan informasi lengkap lainnya..."
                                        value={formData.detail_info}
                                        onChange={e => setFormData({ ...formData, detail_info: e.target.value })}
                                    />
                                </div>

                                {/* Gallery Upload */}
                                <div className="border rounded-xl p-4">
                                    <label className="text-xs font-semibold text-slate-600 block mb-2 flex items-center gap-1">
                                        <ImageIcon size={12} /> Galeri Foto (Opsional)
                                    </label>
                                    <div className="flex flex-wrap gap-3">
                                        {galleryPreviews.map((url, idx) => (
                                            <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200">
                                                <img src={url} className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeGalleryImage(idx)}
                                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-all"
                                                >
                                                    <X size={10} />
                                                </button>
                                            </div>
                                        ))}
                                        <label className="w-20 h-20 border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-emerald-300 hover:bg-emerald-50/20 transition-all">
                                            <Plus size={16} className="text-slate-400" />
                                            <span className="text-[9px] text-slate-400 mt-1">Tambah</span>
                                            <input type="file" accept="image/*" multiple onChange={handleGalleryChange} className="hidden" />
                                        </label>
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-2">Upload multiple foto untuk galeri layanan</p>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                                >
                                    {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                    {editingId ? 'Update Layanan' : 'Simpan Layanan'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}