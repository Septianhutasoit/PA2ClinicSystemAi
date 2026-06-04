'use client';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Clock, CheckCircle, AlertCircle, Calendar, User, Phone, MapPin, Stethoscope
} from 'lucide-react';
import { useState, useEffect, Suspense } from 'react';
import api from '@/services/api';

function AppointmentsContent() {
    const [doctors, setDoctors] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        patient_name: '',
        patient_gender: 'Laki-laki',
        patient_phone: '',
        patient_address: '',
        medical_history: '',
        additional_notes: '',
        doctor_name: '',
        visit_date: '',
        visit_time: ''
    });
    const [submitStatus, setSubmitStatus] = useState({ type: '', msg: '' });

    useEffect(() => {
        api.get('/clinic/doctors').then(res => setDoctors(res.data)).catch(() => setDoctors([]));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitStatus({ type: 'loading', msg: 'Mengirim reservasi...' });

        const combinedNotes = `Riwayat: ${formData.medical_history || '-'} | Keperluan: ${formData.additional_notes || '-'}`;
        const fullDateTime = `${formData.visit_date}T${formData.visit_time}:00`;

        const payload = {
            patient_name: formData.patient_name,
            patient_phone: formData.patient_phone,
            patient_gender: formData.patient_gender,
            patient_address: formData.patient_address,
            doctor_name: formData.doctor_name,
            appointment_date: fullDateTime,
            notes: combinedNotes,
            status: 'pending'
        };

        try {
            await api.post('/clinic/appointments', payload);
            setSubmitStatus({ type: 'success', msg: 'Reservasi Berhasil! Kami akan menghubungi Anda segera.' });
            setFormData({
                patient_name: '', patient_gender: 'Laki-laki', patient_phone: '',
                patient_address: '', medical_history: '', additional_notes: '',
                doctor_name: '', visit_date: '', visit_time: ''
            });
            setTimeout(() => setSubmitStatus({ type: '', msg: '' }), 5000);
        } catch {
            setSubmitStatus({ type: 'error', msg: 'Gagal mengirim. Pastikan data sudah benar.' });
            setTimeout(() => setSubmitStatus({ type: '', msg: '' }), 4000);
        }
    };

    const inputClass = "w-full px-4 py-2.5 bg-emerald-50/40 border border-emerald-100 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:border-transparent outline-none transition-all text-slate-700 placeholder:text-slate-400 text-sm";
    const labelClass = "block text-[11px] font-black text-emerald-900 uppercase tracking-widest mb-1.5 ml-1";

    return (
        /* MODIFIKASI: bg-[#F0FAF7] memberikan kesan kehijauan yang bersih dan profesional */
        <div className="min-h-screen bg-[#F0FAF7] pt-24 pb-20 px-4">

            <div className="max-w-5xl mx-auto mb-20">
                <div className="mb-10 flex flex-col items-center sm:items-start">
                    <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                        Online Booking
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
                        Reservasi <span className="text-emerald-600">Online</span>
                    </h1>
                </div>

                {/* KARTU UTAMA: Warna Putih Bersih (bg-white) agar nampak jelas di atas background hijau */}
                <div className="bg-white rounded-[0.8rem] shadow-2xl shadow-emerald-900/10 border border-emerald-500 overflow-hidden flex flex-col lg:flex-row transition-all">

                    {/* PANEL KIRI: INFO WAKTU PRAKTEK (Tetap Putih/Light) */}
                    <div className="lg:w-[35%] p-10 bg-white border-b lg:border-b-0 lg:border-r border-emerald-50">
                        <div className="flex items-center gap-3 mb-10">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-xl shadow-emerald-200">
                                <Clock size={24} />
                            </div>
                            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter leading-none">Waktu<br />Praktek</h2>
                        </div>

                        <div className="space-y-4 mb-12">
                            {[
                                { d: 'Senin', t: '09:00 – 21:00' },
                                { d: 'Selasa', t: '09:00 – 21:00' },
                                { d: 'Rabu', t: '09:00 – 21:00' },
                                { d: 'Kamis', t: '09:00 – 21:00' },
                                { d: 'Jumat', t: '09:00 – 21:00' },
                                { d: 'Sabtu', t: '09:00 – 21:00' },
                                { d: 'Minggu', t: 'By Appointment', s: true },
                            ].map((item) => (
                                <div key={item.d} className="flex justify-between items-center text-slate-600 text-xs py-2.5 border-b border-emerald-50/50 last:border-0">
                                    <span className="font-bold">{item.d}</span>
                                    <span className={item.s ? "font-black text-emerald-600" : "font-semibold"}>{item.t}</span>
                                </div>
                            ))}
                        </div>

                        <div className="p-5 bg-emerald-50/50 border border-emerald-100 rounded-[1.5rem]">
                            <p className="text-[11px] text-emerald-800 leading-relaxed font-medium">
                                <span className="font-black uppercase block mb-1">Catatan:</span>
                                Jadwal menyesuaikan kuota harian. Konfirmasi akan dikirim melalui WhatsApp.
                            </p>
                        </div>
                    </div>

                    {/* PANEL KANAN: FORMULIR (Warna Putih) */}
                    <div className="lg:w-[65%] p-8 lg:p-12">
                        <form onSubmit={handleSubmit} className="space-y-7">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelClass}>Nama Lengkap Pasien</label>
                                    <input type="text" placeholder="Masukkan nama" required className={inputClass}
                                        value={formData.patient_name} onChange={e => setFormData({ ...formData, patient_name: e.target.value })} />
                                </div>
                                <div>
                                    <label className={labelClass}>Jenis Kelamin</label>
                                    <select className={inputClass} value={formData.patient_gender} onChange={e => setFormData({ ...formData, patient_gender: e.target.value })}>
                                        <option value="Laki-laki">Laki-laki</option>
                                        <option value="Perempuan">Perempuan</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelClass}>Nomor WhatsApp</label>
                                    <input type="tel" placeholder="0812..." required className={inputClass}
                                        value={formData.patient_phone} onChange={e => setFormData({ ...formData, patient_phone: e.target.value })} />
                                </div>
                                <div>
                                    <label className={labelClass}>Alamat Tinggal</label>
                                    <input type="text" placeholder="Kota / Alamat lengkap" required className={inputClass}
                                        value={formData.patient_address} onChange={e => setFormData({ ...formData, patient_address: e.target.value })} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelClass}>Riwayat Medis (Opsional)</label>
                                    <textarea rows={2} placeholder="Alergi obat atau penyakit bawaan..." className={inputClass}
                                        value={formData.medical_history} onChange={e => setFormData({ ...formData, medical_history: e.target.value })} />
                                </div>
                                <div>
                                    <label className={labelClass}>Keluhan Gigi</label>
                                    <textarea rows={2} required placeholder="Jelaskan masalah gigi Anda" className={inputClass}
                                        value={formData.additional_notes} onChange={e => setFormData({ ...formData, additional_notes: e.target.value })} />
                                </div>
                            </div>

                            {/* Section Detail Kunjungan */}
                            <div className="p-6 bg-slate-50/80 rounded-[2rem] border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-5 shadow-inner">
                                <div className="md:col-span-1">
                                    <label className={labelClass}>Dokter Ahli</label>
                                    <select required className={inputClass} value={formData.doctor_name} onChange={e => setFormData({ ...formData, doctor_name: e.target.value })}>
                                        <option value="">-- pilih --</option>
                                        {doctors.map((d: any) => (
                                            <option key={d.id} value={d.name}>{d.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Pilih Tanggal</label>
                                    <input type="date" required className={inputClass}
                                        value={formData.visit_date} onChange={e => setFormData({ ...formData, visit_date: e.target.value })} />
                                </div>
                                <div>
                                    <label className={labelClass}>Pilih Waktu</label>
                                    <input type="time" required className={inputClass}
                                        value={formData.visit_time} onChange={e => setFormData({ ...formData, visit_time: e.target.value })} />
                                </div>
                            </div>

                            <div className="pt-4 flex flex-col gap-5">
                                <button
                                    type="submit"
                                    disabled={submitStatus.type === 'loading'}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-[0.2em] py-4 rounded-2xl shadow-xl shadow-emerald-200 transition-all active:scale-[0.98] disabled:opacity-50"
                                >
                                    {submitStatus.type === 'loading' ? 'Memproses Reservasi...' : 'Kirim Reservasi Sekarang'}
                                </button>

                                <AnimatePresence>
                                    {submitStatus.msg && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                            className={`w-full p-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 ${submitStatus.type === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-50 text-red-700'
                                                }`}
                                        >
                                            {submitStatus.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                                            {submitStatus.msg}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AppointmentsPage() {
    return (
        <Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-emerald-50 text-emerald-600 font-bold uppercase tracking-widest text-xs animate-pulse">Menyiapkan Formulir...</div>}>
            <AppointmentsContent />
        </Suspense>
    );
}