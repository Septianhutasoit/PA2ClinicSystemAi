'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import {
    Users, Clock, ArrowRight, Loader2,
    UserRound, Stethoscope, Sparkles, CalendarDays,
    X, Activity, Pill, FileText, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DoctorSchedulePage() {
    const [todayPatients, setTodayPatients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());

    // --- State untuk Form Rekam Medis ---
    const [selectedAppt, setSelectedAppt] = useState<any>(null);
    const [diagnosis, setDiagnosis] = useState('');
    const [treatment, setTreatment] = useState('');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchQueue = async () => {
        setIsLoading(true);
        try {
            // Ambil data antrean yang statusnya 'confirmed'
            const res = await api.get('/clinic/appointments');
            const filtered = res.data.filter((app: any) => app.status === 'confirmed');
            setTodayPatients(filtered);
        } catch (err) {
            console.error("Gagal memuat antrean");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchQueue();
        const interval = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(interval);
    }, []);

    // --- Fungsi Simpan & Kurangi Antrean ---
    const handleFinishExamination = async () => {
        if (!diagnosis || !treatment) return alert("Mohon isi Diagnosa dan Tindakan");

        setIsSubmitting(true);
        try {
            // 1. Simpan ke tabel medical_records
            // Backend harus otomatis mengubah status appointment menjadi 'completed'
            await api.post('/clinic/medical-records', {
                appointment_id: selectedAppt.id,
                patient_name: selectedAppt.patient_name,
                diagnosis: diagnosis,
                treatment: treatment,
                notes: notes
            });

            alert("Pemeriksaan Selesai!");

            // 2. Reset Form & Tutup Modal
            setSelectedAppt(null);
            setDiagnosis(''); setTreatment(''); setNotes('');

            // 3. Refresh List (Pasien yang tadi akan hilang dari list 'confirmed')
            fetchQueue();
        } catch (err) {
            alert("Gagal menyimpan rekam medis. Pastikan API tersedia.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">

            {/* ── 1. WELCOME BANNER ─────────────────────────────────────── */}
            <div className="bg-white rounded-2xl p-8 border border-[#D4EDE5] shadow-sm relative overflow-hidden text-slate-800">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500 rounded-l-2xl" />
                <div className="relative z-10 pl-5">
                    <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full mb-4">
                        <Sparkles size={11} className="text-emerald-600" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">Sesi Kerja Aktif</span>
                    </div>
                    <h1 className="text-2xl font-bold leading-tight">Selamat Pagi, Dokter</h1>
                    <p className="text-slate-500 text-sm mt-1.5">
                        Anda memiliki <span className="font-bold text-emerald-600">{todayPatients.length} pasien</span> yang menunggu diperiksa.
                    </p>
                </div>
                <Stethoscope size={160} className="absolute -right-8 -bottom-8 text-emerald-50 rotate-[-15deg] pointer-events-none" />
            </div>

            {/* ── 2. STAT CARDS ─────────────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-800">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center justify-between group transition-all hover:border-emerald-200">
                    <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Pasien Antre</p>
                        <h3 className="text-4xl font-bold">{isLoading ? '—' : todayPatients.length}</h3>
                        <p className="text-xs text-slate-400 mt-1 uppercase font-black tracking-tighter">Siap Diperiksa</p>
                    </div>
                    <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100"><Users size={26} /></div>
                </div>

                <div className="bg-slate-900 rounded-2xl p-6 flex items-center justify-between shadow-lg">
                    <div>
                        <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest mb-1">Waktu Sekarang</p>
                        <h3 className="text-2xl font-bold text-white">{currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} <span className="text-emerald-400 text-base font-medium ml-2">WIB</span></h3>
                        <p className="text-slate-400 text-xs mt-1 capitalize">{currentTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                    <div className="w-14 h-14 bg-white/10 text-emerald-400 rounded-2xl flex items-center justify-center"><CalendarDays size={26} /></div>
                </div>
            </div>

            {/* ── 3. DAFTAR ANTREAN ─────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden text-slate-800">
                <div className="px-7 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h3 className="text-base font-bold flex items-center gap-2 italic uppercase tracking-tighter"><Activity size={18} className="text-emerald-500" /> Antrean Pasien</h3>
                    <span className="text-[10px] font-black bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1 rounded-full uppercase italic">Live Queue</span>
                </div>

                <div className="p-5 space-y-3">
                    {isLoading ? (
                        <div className="py-16 text-center"><Loader2 className="animate-spin mx-auto text-emerald-600" /></div>
                    ) : todayPatients.length > 0 ? (
                        todayPatients.map((app: any, i: number) => (
                            <div key={app.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#F5FAF7] rounded-2xl border border-emerald-50 hover:border-emerald-300 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-emerald-600 text-sm shadow-sm border border-slate-100">{i + 1}</div>
                                    <div>
                                        <p className="font-bold text-slate-800 uppercase italic">{app.patient_name}</p>
                                        <p className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-1 font-bold">
                                            <Clock size={10} className="text-emerald-500" />
                                            Registrasi: {new Date(app.appointment_date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedAppt(app)}
                                    className="mt-3 sm:mt-0 bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all flex items-center gap-2 group shadow-lg shadow-emerald-600/20 active:scale-95"
                                >
                                    Mulai Periksa <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="py-16 text-center opacity-30 italic font-bold uppercase text-slate-400 tracking-[0.3em]">Antrean Kosong</div>
                    )}
                </div>
            </div>

            {/* ── 4. MODAL PEMERIKSAAN (DINAMIS) ────────────────────────── */}
            <AnimatePresence>
                {selectedAppt && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9 }} className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative overflow-hidden border-[6px] border-white">
                            <button onClick={() => setSelectedAppt(null)} className="absolute top-6 right-6 p-2 rounded-xl text-slate-300 hover:text-red-500 transition-all"><X size={24} /></button>

                            <div className="p-8 md:p-10 space-y-6">
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center font-black text-xl italic uppercase">{(selectedAppt.patient_name).charAt(0)}</div>
                                    <div>
                                        <h2 className="text-xl font-black italic uppercase text-slate-800 tracking-tighter leading-none">{selectedAppt.patient_name}</h2>
                                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-2">Form Rekam Medis Elektronik</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2"><Activity size={12} className="text-emerald-500" /> Hasil Diagnosa (Analysis)</label>
                                        <textarea
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-emerald-50 italic h-24"
                                            placeholder="Tulis diagnosa penyakit pasien..."
                                            value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2"><Pill size={12} className="text-emerald-500" /> Tindakan / Resep Obat (Treatment)</label>
                                        <textarea
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-emerald-50 italic h-24"
                                            placeholder="Tulis tindakan medis atau resep..."
                                            value={treatment} onChange={(e) => setTreatment(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2"><FileText size={12} className="text-emerald-500" /> Catatan Sampingan</label>
                                        <input
                                            type="text" className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-emerald-50 italic"
                                            placeholder="Saran: Kontrol kembali 2 minggu lagi"
                                            value={notes} onChange={(e) => setNotes(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={handleFinishExamination}
                                    disabled={isSubmitting}
                                    className="w-full bg-emerald-600 hover:bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all shadow-xl shadow-emerald-200 disabled:opacity-50 flex items-center justify-center gap-3"
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin" /> : <><CheckCircle2 size={18} /> Selesaikan Pemeriksaan</>}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}