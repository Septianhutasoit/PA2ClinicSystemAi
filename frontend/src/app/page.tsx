'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldCheck, Clock, Star, Activity } from 'lucide-react';
import { useEffect, useRef } from 'react';

const FEATURES = [
  { icon: '📅', text: 'Booking Online' },
  { icon: '⏱', text: 'Antrian Real-time' },
  { icon: '⭐', text: 'Dokter Spesialis' },
  { icon: '🩺', text: 'Rekam Medis Digital' },
  { icon: '💊', text: 'Perawatan Modern' },
];

const STATS = [
  { num: '2.4K+', label: 'Pasien Puas' },
  { num: '15+', label: 'Dokter Spesialis' },
  { num: '98%', label: 'Tingkat Kepuasan' },
];

const FLOAT_BADGES = [
  { icon: '❤️', title: 'Pasien Puas', sub: '2,400+ pasien', pos: 'top-2 -right-4' },
  { icon: '⚡', title: 'AI Powered', sub: 'Diagnosis cepat', pos: '-bottom-2 -left-8' },
  { icon: '🏅', title: 'Bersertifikat', sub: 'Standar ISO', pos: 'top-1/2 -left-14 -translate-y-1/2' },
];

export default function WelcomePage() {
  const trackRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-[#f8fffe] overflow-hidden relative font-sans">

      {/* Background mesh */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 60% 50% at 10% 20%, rgba(20,184,166,0.08) 0%, transparent 60%),
              radial-gradient(ellipse 50% 60% at 90% 80%, rgba(14,165,233,0.07) 0%, transparent 60%),
              radial-gradient(ellipse 40% 40% at 50% 50%, rgba(16,185,129,0.04) 0%, transparent 70%)
            `
          }}
        />
        {/* Floating orbs */}
        <motion.div
          className="absolute w-80 h-80 -top-20 -left-20 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.12), transparent)' }}
          animate={{ x: [0, 20, 0], y: [0, -15, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-64 h-64 bottom-[10%] -right-16 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.10), transparent)' }}
          animate={{ x: [0, -15, 0], y: [0, 10, 0], scale: [1, 0.97, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: -3 }}
        />
        {/* Floating particles */}
        {Array.from({ length: 14 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              background: i % 2 === 0 ? 'rgba(20,184,166,0.35)' : 'rgba(14,165,233,0.3)',
            }}
            initial={{ y: '100vh', opacity: 0 }}
            animate={{ y: '-20px', opacity: [0, 0.6, 0.6, 0] }}
            transition={{
              duration: 8 + Math.random() * 12,
              repeat: Infinity,
              delay: Math.random() * -20,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Main layout */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-8 min-h-screen flex flex-col">

        {/* Nav */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between py-8 mb-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #0d9488, #0891b2)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C9 2 7 4 7 7c0 2 1 3.5 1 5.5 0 2.5-1 4.5-1 7.5 0 1.1.9 2 2 2s2-.9 2-2V17h2v3c0 1.1.9 2 2 2s2-.9 2-2c0-3-1-5-1-7.5 0-2 1-3.5 1-5.5 0-3-2-5-5-5z"
                  fill="white" opacity="0.9" />
              </svg>
            </div>
            <div>
              <div className="text-[15px] font-black text-slate-900 tracking-tight">Clinic Nauli Dental Care</div>
              <div className="text-[10px] font-semibold text-slate-400 tracking-[0.12em] uppercase">Klinik Balige,Jln Horas Damn</div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white border border-slate-100 rounded-full px-4 py-[7px] shadow-sm text-[12px] font-semibold text-slate-500">
            <span className="w-[7px] h-[7px] rounded-full bg-emerald-400 shadow-[0_0_0_3px_rgba(52,211,153,0.2)] animate-pulse" />
            Buka Sekarang • 24/7
          </div>
        </motion.nav>

        {/* Hero grid */}
        <div className="grid lg:grid-cols-2 gap-14 items-center flex-1 pb-8">

          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-6"
          >
            {/* Pill tag */}
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-[7px] text-[11px] font-bold tracking-[0.12em] uppercase text-teal-700 border border-teal-200/60"
              style={{ background: 'linear-gradient(135deg, rgba(20,184,166,0.1), rgba(14,165,233,0.08))' }}>
              <span>✦</span> Nauli Dental AI System
            </div>

            {/* Title */}
            <h1 className="text-[58px] font-black leading-[1.05] tracking-[-2px] text-slate-900">
              Nauli Dental Care,<br />
              <span className="font-['Playfair_Display',serif] italic font-semibold"
                style={{ background: 'linear-gradient(135deg, #0d9488 20%, #0891b2 80%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Masa Depan
              </span><br />Cerah
            </h1>

            <p className="text-[16px] leading-[1.75] text-slate-500 max-w-[420px]">
              Sistem manajemen klinik gigi modern dengan teknologi AI Chatbot & n8n Automation untuk pengalaman perawatan yang lebih nyaman, cepat, dan efisien.
            </p>

            {/* Scrolling strip */}
            <div className="bg-white border border-[#e8f5f3] rounded-2xl px-5 py-[14px] shadow-sm overflow-hidden">
              <div className="flex gap-4 items-center" style={{ animation: 'scrollTrack 12s linear infinite', width: 'max-content' }}>
                {[...FEATURES, ...FEATURES].map((f, i) => (
                  <span key={i} className="flex items-center gap-2 text-[12px] font-semibold text-slate-500 whitespace-nowrap">
                    {i > 0 && <span className="text-slate-200 mr-1">·</span>}
                    <span>{f.icon}</span> {f.text}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-7">
              {STATS.map((s, i) => (
                <div key={i} className="flex items-center gap-7">
                  {i > 0 && <div className="w-px h-9 bg-slate-200" />}
                  <div>
                    <div className="text-[26px] font-black text-teal-600 leading-none tracking-tight">{s.num}</div>
                    <div className="text-[11px] font-semibold text-slate-400 tracking-[0.08em] uppercase mt-1">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-5"
          >
            {/* Central illustration */}
            <div className="relative flex items-center justify-center h-[210px]">
              {/* Rings */}
              {[210, 250, 290].map((size, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full border border-teal-500/15"
                  style={{ width: size, height: size }}
                  animate={{ scale: [1, 1.02, 1], opacity: [0.4, 0.15, 0.4] }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.8, ease: 'easeInOut' }}
                />
              ))}
              {/* Main circle */}
              <motion.div
                className="w-[170px] h-[170px] rounded-full flex items-center justify-center relative z-10"
                style={{ background: 'linear-gradient(135deg, #0d9488, #0891b2)', boxShadow: '0 20px 60px rgba(13,148,136,0.35)' }}
                animate={{ scale: [1, 1.03, 1], boxShadow: ['0 20px 60px rgba(13,148,136,0.3)', '0 28px 70px rgba(13,148,136,0.4)', '0 20px 60px rgba(13,148,136,0.3)'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                  <path d="M40 8C32 8 26 13 26 20c0 4 2 7 2 11 0 5-2 9-2 15 0 2.2 1.8 4 4 4s4-1.8 4-4v-6h12v6c0 2.2 1.8 4 4 4s4-1.8 4-4c0-6-2-10-2-15 0-4 2-7 2-11 0-7-6-12-14-12z"
                    fill="white" opacity="0.95" />
                  <ellipse cx="33" cy="18" rx="4" ry="7" fill="white" opacity="0.3" transform="rotate(-15 33 18)" />
                  <rect x="37" y="30" width="6" height="16" rx="3" fill="rgba(13,148,136,0.4)" />
                  <rect x="32" y="35" width="16" height="6" rx="3" fill="rgba(13,148,136,0.4)" />
                </svg>
              </motion.div>
              {/* Float badges */}
              {FLOAT_BADGES.map((b, i) => (
                <motion.div
                  key={i}
                  className={`absolute ${b.pos} bg-white rounded-2xl px-3 py-2 flex items-center gap-2 shadow-xl border border-slate-100 whitespace-nowrap z-20`}
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: -i * 1.2, ease: 'easeInOut' }}
                >
                  <span className="text-[18px]">{b.icon}</span>
                  <div>
                    <div className="text-[11px] font-bold text-slate-700">{b.title}</div>
                    <div className="text-[10px] text-slate-400">{b.sub}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Action cards */}
            <div className="flex flex-col gap-3">
              {/* Register */}
              <motion.div whileHover={{ y: -4, scale: 1.01 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
                <Link href="/register" className="flex items-center gap-5 rounded-[22px] p-6 relative overflow-hidden group"
                  style={{ background: 'linear-gradient(135deg, #0d9488, #0891b2)', boxShadow: '0 8px 32px rgba(13,148,136,0.35)' }}>
                  <div className="absolute top-0 right-0 w-28 h-28 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.15), transparent)', transform: 'translate(20px,-30px)' }} />
                  <div className="w-[50px] h-[50px] rounded-[15px] bg-white/20 flex items-center justify-center flex-shrink-0">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zM4 20c0-3.3 3.6-6 8-6s8 2.7 8 6" stroke="white" strokeWidth="2" strokeLinecap="round" />
                      <path d="M19 8v6M22 11h-6" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-[17px] font-black text-white tracking-tight">Daftar Pasien Baru</div>
                    <div className="text-[12px] text-white/75 mt-0.5">Registrasi dan nikmati layanan kesehatan gigi terbaik</div>
                  </div>
                  <motion.div className="w-9 h-9 rounded-full bg-white/12 flex items-center justify-center flex-shrink-0"
                    whileHover={{ x: 3 }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.div>
                </Link>
              </motion.div>

              {/* Login */}
              <motion.div whileHover={{ y: -4, scale: 1.01 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
                <Link href="/login" className="flex items-center gap-5 rounded-[22px] p-6 relative overflow-hidden group"
                  style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', boxShadow: '0 8px 32px rgba(15,23,42,0.3)' }}>
                  <div className="absolute top-0 right-0 w-28 h-28 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.08), transparent)', transform: 'translate(20px,-30px)' }} />
                  <div className="w-[50px] h-[50px] rounded-[15px] bg-white/10 flex items-center justify-center flex-shrink-0">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="3" width="18" height="18" rx="4" stroke="white" strokeWidth="2" />
                      <path d="M15 12H9M12 9l3 3-3 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-[17px] font-black text-white tracking-tight">Masuk ke Sistem</div>
                    <div className="text-[12px] text-white/55 mt-0.5">Akses jadwal, rekam medis & kelola akun Anda</div>
                  </div>
                  <motion.div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0"
                    whileHover={{ x: 3 }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.div>
                </Link>
              </motion.div>
            </div>

            {/* Trust bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center justify-center gap-5 pt-1"
            >
              <div className="flex items-center gap-[6px] text-[11px] font-semibold text-slate-400">
                <ShieldCheck size={13} className="text-emerald-500" /> Data Terenkripsi
              </div>
              <div className="w-[3px] h-[3px] rounded-full bg-slate-200" />
              <div className="flex items-center gap-[6px] text-[11px] font-semibold text-slate-400">
                <Clock size={13} className="text-amber-400" /> 24/7 Support
              </div>
              <div className="w-[3px] h-[3px] rounded-full bg-slate-200" />
              <div className="flex items-center gap-[6px] text-[11px] font-semibold text-slate-400">
                <Activity size={13} className="text-sky-500" /> Dokter Spesialis
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="border-t border-slate-100 py-5 text-center text-[11px] text-slate-400"
        >
          © 2024 Nauli Dental Care. All rights reserved. | Sistem Informasi Klinik Gigi Modern
        </motion.div>
      </div>

      {/* Keyframe for scrolling strip */}
      <style>{`
        @keyframes scrollTrack {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}