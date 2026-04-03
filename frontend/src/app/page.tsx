'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldCheck, Sparkles, ArrowRight, UserPlus, LogIn } from 'lucide-react';

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-[#F8F9FD] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Dekorasi Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-3xl -mr-64 -mt-64 animate-pulse"></div>

      <div className="max-w-4xl w-full relative z-10 grid md:grid-cols-2 gap-12 items-center">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
            <Sparkles size={16} className="text-blue-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Nauli Dental AI</span>
          </div>
          <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-[0.95]">
            Digital Care.<br /><span className="text-blue-600 italic">Smarter</span> System.
          </h1>
          <p className="text-slate-500 font-medium text-lg leading-relaxed italic">Sistem Informasi Terintegrasi untuk masa depan klinik Anda.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
          <Link href="/register" className="group block bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl hover:border-blue-200 transition-all active:scale-95">
            <div className="flex justify-between items-center">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg"><UserPlus size={20} /></div>
              <ArrowRight className="text-slate-200 group-hover:text-blue-600 group-hover:translate-x-2 transition-all" />
            </div>
            <h3 className="mt-6 text-xl font-black text-slate-800">Daftar Pasien Baru</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Start your medical journey</p>
          </Link>

          <Link href="/login" className="group block bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl hover:bg-slate-800 transition-all active:scale-95">
            <div className="flex justify-between items-center">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white backdrop-blur-md"><LogIn size={20} /></div>
              <ArrowRight className="text-white/20 group-hover:text-blue-400 group-hover:translate-x-2 transition-all" />
            </div>
            <h3 className="mt-6 text-xl font-black text-white">Masuk ke Sistem</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Access Member Dashboard</p>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}