'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ShieldCheck, Sparkles, ArrowRight, UserPlus, LogIn,
  Calendar, Clock, Star, Heart, Smile, ChevronRight,
  Activity, Award, BadgeCheck, Gem
} from 'lucide-react';

export default function WelcomePage() {
  const features = [
    { icon: <Calendar size={16} />, text: "Booking Online 24/7" },
    { icon: <Clock size={16} />, text: "Antrian Real-time" },
    { icon: <Star size={16} />, text: "Dokter Spesialis" },
    { icon: <Heart size={16} />, text: "Perawatan Modern" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden relative font-sans">

      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-100/10 to-indigo-100/10 rounded-full blur-3xl" />

        {/* Medical Pattern */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 min-h-screen flex flex-col justify-center">

        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-slate-100"
            >
              <Sparkles size={16} className="text-blue-500" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-600">Nauli Dental AI</span>
            </motion.div>

            {/* Main Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter leading-[1.1]">
                Senyum Sehat,
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Masa Depan Cerah
                </span>
              </h1>
              <p className="text-slate-500 text-lg lg:text-xl font-medium leading-relaxed max-w-lg">
                Sistem manajemen klinik gigi modern dengan teknologi AI untuk pengalaman perawatan yang lebih nyaman dan efisien.
              </p>
            </motion.div>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 gap-4 pt-4"
            >
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                  className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-xl px-4 py-3 border border-slate-100"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                    {feature.icon}
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Register Card */}
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Link href="/register" className="block group">
                <div className="relative bg-gradient-to-br from-white to-blue-50/30 rounded-3xl p-8 border border-slate-100 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-2xl" />

                  <div className="flex justify-between items-start relative">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                      <UserPlus size={24} />
                    </div>
                    <motion.div
                      initial={{ x: 0 }}
                      whileHover={{ x: 10 }}
                      className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-500 group-hover:text-white transition-all"
                    >
                      <ChevronRight size={18} />
                    </motion.div>
                  </div>

                  <div className="mt-6 relative">
                    <h3 className="text-2xl font-black text-slate-800">Daftar Pasien Baru</h3>
                    <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                      Daftarkan diri Anda sebagai pasien baru dan nikmati kemudahan akses layanan kesehatan gigi terbaik.
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                      <div className="h-px flex-1 bg-gradient-to-r from-blue-200 to-transparent" />
                      <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Mulai Sekarang</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Login Card */}
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17, delay: 0.1 }}
            >
              <Link href="/login" className="block group">
                <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-2xl" />
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-2xl" />

                  <div className="flex justify-between items-start relative">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white shadow-lg">
                      <LogIn size={24} />
                    </div>
                    <motion.div
                      initial={{ x: 0 }}
                      whileHover={{ x: 10 }}
                      className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60 group-hover:bg-blue-500 group-hover:text-white transition-all"
                    >
                      <ChevronRight size={18} />
                    </motion.div>
                  </div>

                  <div className="mt-6 relative">
                    <h3 className="text-2xl font-black text-white">Masuk ke Sistem</h3>
                    <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                      Akses dashboard pasien, lihat jadwal, rekam medis, dan kelola informasi kesehatan Anda.
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                      <div className="h-px flex-1 bg-gradient-to-r from-slate-600 to-transparent" />
                      <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Member Area</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center justify-center gap-4 pt-4"
            >
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <ShieldCheck size={14} className="text-emerald-500" />
                <span>Data Terenkripsi</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-slate-300" />
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Smile size={14} className="text-amber-500" />
                <span>24/7 Support</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-slate-300" />
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Activity size={14} className="text-blue-500" />
                <span>Dokter Spesialis</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-20 pt-8 border-t border-slate-200/50 text-center"
        >
          <p className="text-xs text-slate-400">
            © 2024 Nauli Dental Care. All rights reserved. | Sistem Informasi Klinik Gigi Modern
          </p>
        </motion.div>
      </div>
    </div>
  );
}