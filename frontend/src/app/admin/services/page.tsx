'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Trash2, Edit3, Save, X, Camera,
    Stethoscope, DollarSign, FileText, Loader2, Image as ImageIcon
} from 'lucide-react';

export default function ManageServices() {
    const [services, setServices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        image_url: ''
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

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            let finalImageUrl = formData.image_url;

            if (selectedFile) {
                const uploadData = new FormData();
                uploadData.append('file', selectedFile);
                const resUpload = await api.post('/clinic/upload-photo', uploadData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                finalImageUrl = resUpload.data.url;
            }

            const dataToSave = { ...formData, image_url: finalImageUrl };

            if (editingId) {
                await api.patch(`/clinic/services/${editingId}`, dataToSave);
                alert("✅ Layanan Berhasil Diperbarui!");
            } else {
                await api.post('/clinic/services', dataToSave);
                alert("✅ Layanan Baru Berhasil Ditambahkan!");
            }

            resetForm();
            fetchServices();
        } catch (err) { alert("❌ Gagal menyimpan data"); }
        finally { setIsSaving(false); }
    };

    const handleEdit = (item: any) => {
        setFormData(item);
        setPreviewUrl(item.image_url);
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
        setFormData({ name: '', description: '', price: '', image_url: '' });
        setSelectedFile(null);
        setPreviewUrl(null);
        setEditingId(null);
        setIsFormOpen(false);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            {/* --- HEADER --- */}
            <div className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] border border-blue-100 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                        <Stethoscope size={28} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 tracking-tighter uppercase italic">Clinic Services</h1>
                        <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest italic">Katalog Perawatan & Estimasi Biaya</p>
                    </div>
                </div>
                <button onClick={() => setIsFormOpen(true)} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-2xl">
                    + Add New Service
                </button>
            </div>

            {/* --- SERVICES GRID --- */}
            {isLoading ? (
                <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-blue-600" size={40} /></div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((item: any) => (
                        <motion.div key={item.id} whileHover={{ y: -10 }} className="group bg-white rounded-[3rem] p-8 border border-slate-100 shadow-xl shadow-blue-900/5 transition-all relative overflow-hidden">
                            <div className="aspect-video mb-6 rounded-[2rem] overflow-hidden bg-slate-100 border border-slate-50 shadow-inner relative">
                                {item.image_url ? (
                                    <img src={item.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.name} />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={40} /></div>
                                )}
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black text-blue-600 shadow-sm border border-white uppercase">Premium Service</div>
                            </div>

                            <h3 className="text-xl font-black text-slate-800 leading-tight mb-2 uppercase italic">{item.name}</h3>
                            <p className="text-xs text-slate-400 font-medium leading-relaxed mb-6 line-clamp-3 italic">{item.description}</p>

                            <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
                                <div>
                                    <p className="text-[9px] font-black text-slate-300 uppercase">Estimasi Biaya</p>
                                    <p className="text-lg font-black text-blue-600">Rp {item.price}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEdit(item)} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"><Edit3 size={16} /></button>
                                    <button onClick={() => handleDelete(item.id)} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"><Trash2 size={16} /></button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* --- MODAL FORM --- */}
            <AnimatePresence>
                {isFormOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-xl rounded-[3rem] p-10 shadow-2xl relative border border-blue-50">
                            <button onClick={resetForm} className="absolute top-8 right-8 text-slate-300 hover:text-red-500"><X size={24} /></button>
                            <h2 className="text-2xl font-black text-slate-900 mb-8 uppercase italic">{editingId ? 'Edit Data Layanan' : 'Layanan Baru'}</h2>

                            <form onSubmit={handleSave} className="space-y-5">
                                {/* Upload Cover Layanan */}
                                <div className="flex flex-col items-center justify-center p-8 bg-blue-50/50 rounded-[2.5rem] border-2 border-dashed border-blue-200 group relative overflow-hidden">
                                    {previewUrl ? (
                                        <img src={previewUrl} className="w-full aspect-video rounded-3xl object-cover shadow-lg border-4 border-white mb-4" alt="preview" />
                                    ) : (
                                        <Camera size={40} className="text-blue-300 mb-4" />
                                    )}
                                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest italic">Upload Cover Layanan (.JPG/.PNG)</p>
                                    <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest italic">Nama Layanan</label>
                                    <input type="text" className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold text-sm focus:ring-2 focus:ring-blue-600 outline-none" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required placeholder="Misal: Scaling Gigi Premium" />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest italic">Harga Estimasi (Rp)</label>
                                    <input type="text" className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold text-sm focus:ring-2 focus:ring-blue-600 outline-none" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required placeholder="Misal: 250.000" />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest italic">Deskripsi Singkat</label>
                                    <textarea rows={3} className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold text-sm focus:ring-2 focus:ring-blue-600 outline-none resize-none" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required placeholder="Jelaskan keunggulan layanan ini..." />
                                </div>

                                <button disabled={isSaving} className="w-full bg-slate-900 text-white py-5 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3">
                                    {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} SIMPAN LAYANAN
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}