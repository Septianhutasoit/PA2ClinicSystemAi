'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { motion } from 'framer-motion';
import { Stethoscope, Loader2, Tag, DollarSign, Clock } from 'lucide-react';

interface Service {
    id: number;
    name: string;
    description?: string;
    price?: number;
    duration?: string;
    category?: string;
}

const COLORS = [
    'from-teal-100 to-cyan-100 text-teal-700',
    'from-indigo-100 to-blue-100 text-indigo-700',
    'from-rose-100 to-pink-100 text-rose-700',
    'from-amber-100 to-yellow-100 text-amber-700',
    'from-emerald-100 to-green-100 text-emerald-700',
    'from-violet-100 to-purple-100 text-violet-700',
];

export default function NurseServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await api.get('/clinic/services');
                setServices(res.data);
            } catch {
                console.error('Gagal memuat data layanan');
            } finally {
                setIsLoading(false);
            }
        };
        fetchServices();
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Layanan Klinik</h1>
                <p className="text-sm text-slate-400 font-medium mt-1">Daftar layanan yang tersedia di Nauli Dental Care</p>
            </div>

            {isLoading ? (
                <div className="py-20 text-center">
                    <Loader2 className="animate-spin text-teal-500 mx-auto" size={32} />
                    <p className="text-xs text-slate-400 mt-3">Memuat layanan...</p>
                </div>
            ) : services.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-2xl border border-slate-100">
                    <Stethoscope size={44} className="mx-auto text-slate-200 mb-3" />
                    <p className="text-slate-400 text-sm font-bold">Belum ada layanan terdaftar</p>
                    <p className="text-xs text-slate-300 mt-1">Admin belum menambahkan layanan ke sistem</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {services.map((svc, i) => (
                        <motion.div key={svc.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-lg hover:border-teal-200 transition-all group">
                            {/* Top color stripe */}
                            <div className={`h-2 bg-gradient-to-r ${COLORS[i % COLORS.length].split(' ').slice(0, 2).join(' ')}`} />
                            <div className="p-6">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${COLORS[i % COLORS.length]} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                        <Stethoscope size={22} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-base font-black text-slate-800 leading-tight">{svc.name}</h3>
                                        {svc.category && (
                                            <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                <Tag size={9} /> {svc.category}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {svc.description && (
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed mb-4 line-clamp-2">{svc.description}</p>
                                )}

                                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                    {svc.price ? (
                                        <span className="flex items-center gap-1.5 text-sm font-black text-teal-600">
                                            <DollarSign size={14} /> Rp {svc.price.toLocaleString('id-ID')}
                                        </span>
                                    ) : (
                                        <span className="text-xs text-slate-300 font-bold">Harga belum diatur</span>
                                    )}
                                    {svc.duration && (
                                        <span className="flex items-center gap-1.5 text-[11px] text-slate-400 font-bold">
                                            <Clock size={11} /> {svc.duration}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
