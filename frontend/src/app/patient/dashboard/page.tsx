'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { User, Phone, ShieldCheck, Calendar, Activity, MapPin, Star, Clock } from 'lucide-react';

export default function PatientDashboard() {
    const [doctors, setDoctors] = useState([]);
    const [formData, setFormData] = useState({ patient_name: '', patient_phone: '', doctor_name: '', appointment_date: '' });
    const [status, setStatus] = useState({ type: '', msg: '' });

    useEffect(() => {
        api.get('/clinic/doctors').then(res => setDoctors(res.data)).catch(() => { });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus({ type: 'loading', msg: 'Mengirim...' });
        try {
            await api.post('/clinic/appointments', formData);
            setStatus({ type: 'success', msg: '✅ Berhasil! Jadwal tercatat.' });
            setFormData({ ...formData, doctor_name: '', appointment_date: '' });
        } catch (err) { setStatus({ type: 'error', msg: '❌ Gagal mendaftar.' }); }
    };

    return (
        <div className="space-y-8">
            {/* Banner Utama */}
            <div className="bg-indigo-600 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden flex justify-between items-center group">
                <div className="relative z-10">
                    <h1 className="text-3xl font-black italic tracking-tighter">Reservasi Gigi Sekarang.</h1>
                    <p className="text-indigo-100 text-sm font-medium mt-2 max-w-md">Pilih dokter spesialis terbaik di Balige dan buat janji temu dalam hitungan detik secara otomatis.</p>
                </div>
                <Activity size={100} className="text-white/10 group-hover:scale-110 transition-transform" />
            </div>

            <div className="grid lg:grid-cols-12 gap-8">
                {/* Form Booking */}
                <div className="lg:col-span-7 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                    <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter mb-8 italic">Pendaftaran Online</h3>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid md:grid-cols-2 gap-5">
                            <input type="text" placeholder="Nama Lengkap" className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none font-bold text-sm focus:ring-2 focus:ring-indigo-600" value={formData.patient_name} onChange={e => setFormData({ ...formData, patient_name: e.target.value })} required />
                            <input type="text" placeholder="WhatsApp (08...)" className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none font-bold text-sm focus:ring-2 focus:ring-indigo-600" value={formData.patient_phone} onChange={e => setFormData({ ...formData, patient_phone: e.target.value })} required />
                        </div>
                        <select className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none font-bold text-sm focus:ring-2 focus:ring-indigo-600 appearance-none cursor-pointer" value={formData.doctor_name} onChange={e => setFormData({ ...formData, doctor_name: e.target.value })} required>
                            <option value="">-- Pilih Dokter Spesialis --</option>
                            {doctors.map((d: any) => <option key={d.id} value={d.name}>{d.name} ({d.specialty})</option>)}
                        </select>
                        <input type="datetime-local" className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none font-bold text-sm focus:ring-2 focus:ring-indigo-600" value={formData.appointment_date} onChange={e => setFormData({ ...formData, appointment_date: e.target.value })} required />

                        <button className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-indigo-600 transition-all active:scale-95">
                            Konfirmasi Janji Temu
                        </button>
                        {status.msg && <p className="text-center text-[10px] font-black uppercase text-indigo-600 animate-pulse">{status.msg}</p>}
                    </form>
                </div>

                {/* Sisi Kanan: Info Card */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-5">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600"><MapPin size={18} /></div>
                            <div><p className="text-[10px] font-black text-slate-400 uppercase">Lokasi Klinik</p><p className="text-sm font-bold text-slate-800">Jl. Balige No. 12, Toba</p></div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600"><Clock size={18} /></div>
                            <div><p className="text-[10px] font-black text-slate-400 uppercase">Jam Operasional</p><p className="text-sm font-bold text-slate-800">08:00 AM - 09:00 PM</p></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}