'use client';
import { motion } from 'framer-motion';
import { Calendar, Clock, User } from 'lucide-react';

export default function PatientDashboard() {
    return (
        <div className="p-10 max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h1 className="text-3xl font-black text-slate-900">Halo, Selamat Datang!</h1>
                <p className="text-slate-500 font-bold mt-2 uppercase tracking-widest text-xs">Panel Informasi Pasien</p>

                <div className="mt-10 bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-blue-200">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Janji Temu Berikutnya</p>
                    <h2 className="text-2xl font-black mt-2 italic">Belum ada jadwal aktif.</h2>
                    <button className="mt-6 bg-white text-blue-600 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-transform active:scale-95">
                        Buat Janji Temu Sekarang
                    </button>
                </div>
            </motion.div>
        </div>
    );
}