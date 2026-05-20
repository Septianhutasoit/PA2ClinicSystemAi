'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { BellRing, Calendar, Clock, User, ArrowRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminNotificationsPage() {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchNotifs = async () => {
            try {
                const res = await api.get('/clinic/admin/notifications/reservations');
                setNotifications(res.data);
            } catch (err) {
                console.error("Gagal memuat notifikasi", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchNotifs();
    }, []);

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                    <BellRing size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase italic">Pusat Notifikasi</h1>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pantau semua aktivitas masuk dari pasien</p>
                </div>
            </div>

            {isLoading ? (
                <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-emerald-500" /></div>
            ) : notifications.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
                    <p className="text-slate-400 font-bold italic">Belum ada aktivitas reservasi masuk.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {notifications.map((notif: any) => (
                        <motion.div
                            key={notif.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-all group"
                        >
                            <div className="flex items-center gap-5">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner ${notif.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                                    }`}>
                                    {notif.patient_name.charAt(0)}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-black text-slate-800 uppercase tracking-tight">{notif.patient_name}</h3>
                                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${notif.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                                            }`}>
                                            {notif.status}
                                        </span>
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 italic">
                                        <Clock size={10} className="text-emerald-500" /> {notif.consultation_time} WIB
                                        <span className="text-slate-200">|</span>
                                        <Calendar size={10} className="text-emerald-500" /> {notif.consultation_date}
                                    </p>
                                </div>
                            </div>

                            <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center gap-2 shadow-lg active:scale-95">
                                Cek Detail <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}   