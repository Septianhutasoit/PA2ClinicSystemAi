'use client';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Clock, Activity } from 'lucide-react';
import { useEffect, useState } from 'react';

/* ─── Data (tidak diubah) ───────────────────────────────────────────────── */
const FEATURES = [
  { icon: '📅', text: 'Booking Online' },
  { icon: '⏱', text: 'Antrian Real-time' },
  { icon: '⭐', text: 'Dokter Spesialis' },
  { icon: '🩺', text: 'Rekam Medis Digital' },
  { icon: '💊', text: 'Perawatan Modern' },
  { icon: '🦷', text: 'Scaling & Polishing' },
  { icon: '✨', text: 'Pemutihan Gigi' },
];

const STATS = [
  { num: '1,3k+', label: 'Pasien Puas' },
  { num: '5+', label: 'Dokter Spesialis' },
  { num: '98%', label: 'Tingkat Kepuasan' },
];

const FLOAT_BADGES = [
  { icon: '❤️', title: 'Pasien Puas', sub: '2,400+ pasien', pos: 'top-5 -right-6' },
  { icon: '✦', title: 'AI Chatbot & Automation', sub: 'Diagnosis cepat', pos: 'top-1/2 -left-16 -translate-y-1/2' },
];

/* ── Foto klinik lokal — ganti dengan foto asli jika ada ─────────────────
   Sekarang menggunakan gambar dari /public/images/bg/               */
const CLINIC_PHOTOS = [
  '/images/bg/dental-bg-1.png',
  '/images/bg/dental-bg-3.png',
  '/images/bg/dental-bg-2.png',
  '/images/bg/galery5.png',
];

const PARTICLES = Array.from({ length: 14 }).map((_, i) => ({
  left: (i * 7.14) % 100,
  w: (i % 4) + 2,
  h: (i % 4) + 2,
  dur: (i % 10) + 8,
  delay: -(i * 1.5),
  bg: i % 2 === 0 ? 'rgba(52,211,153,0.35)' : 'rgba(20,184,166,0.28)',
}));

/* ═══════════════════════════════════════════════════════════════════════ */
export default function WelcomePage() {
  const [isMounted, setIsMounted] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState(0);

  useEffect(() => { setIsMounted(true); }, []);

  useEffect(() => {
    const t = setInterval(() => setCurrentPhoto(p => (p + 1) % CLINIC_PHOTOS.length), 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className="min-h-screen overflow-hidden relative font-sans"
      suppressHydrationWarning
    >

      {/* ════════════════════════════════════════════════════════
          LAYER 1 — foto klinik sebagai background halaman
          dental-bg-1.png dipasang full-cover
      ════════════════════════════════════════════════════════ */}
      <div className="fixed inset-0 z-0">
        <img
          src="/images/bg/dental-bg-1.png"
          alt=""
          className="w-full h-full object-cover object-center"
          aria-hidden
        />
        {/* Overlay hijau gelap pekat agar teks terbaca sempurna */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(135deg,
                rgba(2,44,24,0.91) 0%,
                rgba(5,46,22,0.87) 40%,
                rgba(4,55,35,0.80) 70%,
                rgba(2,44,24,0.88) 100%)
            `,
          }}
        />
        {/* Vignette bawah */}
        <div className="absolute inset-x-0 bottom-0 h-40"
          style={{ background: 'linear-gradient(to top, rgba(2,44,24,0.6), transparent)' }} />
      </div>

      {/* ════════════════════════════════════════════════════════
          LAYER 2 — noise texture + orb + partikel
      ════════════════════════════════════════════════════════ */}
      <div className="fixed inset-0 z-[1] pointer-events-none" suppressHydrationWarning>

        {/* Subtle noise grain */}
        <div className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '180px',
          }}
        />

        {/* Dot-grid */}
        <div className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(52,211,153,1) 1px, transparent 0)', backgroundSize: '36px 36px' }} />

        {/* Glowing orbs */}
        <motion.div className="absolute w-[500px] h-[500px] -top-32 -left-32 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.18), transparent)' }}
          animate={{ x: [0, 20, 0], y: [0, -15, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div className="absolute w-96 h-96 bottom-[8%] -right-20 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.14), transparent)' }}
          animate={{ x: [0, -15, 0], y: [0, 12, 0], scale: [1, 0.97, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: -3 }}
        />
        <motion.div className="absolute w-72 h-72 top-1/3 left-1/2 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(52,211,153,0.08), transparent)' }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: -1 }}
        />

        {/* Partikel */}
        {isMounted && PARTICLES.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{ left: `${p.left}%`, width: `${p.w}px`, height: `${p.h}px`, background: p.bg }}
            initial={{ y: '100vh', opacity: 0 }}
            animate={{ y: '-20px', opacity: [0, 0.7, 0.7, 0] }}
            transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: 'linear' }}
          />
        ))}
      </div>

      {/* ════════════════════════════════════════════════════════
          KONTEN UTAMA
      ════════════════════════════════════════════════════════ */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-8 min-h-screen flex flex-col">

        {/* ── NAVBAR ─────────────────────────────────────────── */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between py-8 mb-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-[1.3rem] overflow-hidden flex items-center justify-center
                bg-white border-2 border-emerald-400/70 shadow-lg shadow-emerald-900/50 shrink-0 p-1.5">
              <img src="/images/Logo.png" alt="Nauli Dental Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col leading-none">
              <div className="text-[19px] font-black tracking-tighter uppercase italic"
                style={{ color: '#fff', textShadow: '0 1px 12px rgba(0,0,0,0.4)' }}>
                Nauli<span className="text-emerald-400">Dental</span> Care
              </div>
              <div className="text-[9px] font-bold tracking-[0.2em] uppercase mt-1 text-emerald-300/70">
                Klinik Balige <span className="text-white/20 mx-1">·</span> Jln.Raja Paindoan No.20A
              </div>
            </div>
          </div>

          {/* Status buka */}
          <div className="hidden sm:flex items-center gap-2 bg-white/10 backdrop-blur-md border border-emerald-400/30 rounded-full
              px-4 py-2 shadow-md text-[11px] font-black uppercase tracking-widest text-white">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)] animate-pulse" />
            Buka Sekarang
          </div>
        </motion.nav>

        {/* ── HERO GRID ──────────────────────────────────────── */}
        <div className="grid lg:grid-cols-2 gap-14 items-center flex-1 pb-8">

          {/* ── KOLOM KIRI ─────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-6"
          >
            {/* Pill */}
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-[7px]
                text-[11px] font-bold tracking-[0.12em] uppercase
                text-emerald-300 border border-emerald-400/30 bg-white/8 backdrop-blur-sm">
              <span className="text-emerald-400">✦</span> Nauli Dental Care System
            </div>

            {/* Judul */}
            <h1 className="text-[52px] sm:text-[56px] font-black leading-[1.05] tracking-[-2px] text-white"
              style={{ textShadow: '0 2px 24px rgba(0,0,0,0.3)' }}>
              Nauli Dental Care,<br />
              <span
                className="italic font-semibold"
                style={{
                  fontFamily: "'Georgia', serif",
                  background: 'linear-gradient(135deg, #34d399 20%, #2dd4bf 80%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Masa Depan
              </span><br />
              Cerah
            </h1>

            <p className="text-[15px] leading-[1.75] text-white/65 max-w-[420px]">
              Sistem manajemen klinik gigi modern untuk pengalaman perawatan yang lebih nyaman, cepat, dan efisien bersama tim dokter spesialis kami.
            </p>

            {/* Feature strip */}
            <div className="bg-white/8 backdrop-blur-md border border-white/12 rounded-2xl px-5 py-[14px] shadow-md overflow-hidden">
              <div
                className="flex gap-4 items-center"
                style={{ animation: 'scrollTrack 14s linear infinite', width: 'max-content' }}
              >
                {[...FEATURES, ...FEATURES].map((f, i) => (
                  <span key={i} className="flex items-center gap-2 text-[12px] font-semibold text-white/60 whitespace-nowrap">
                    {i > 0 && <span className="text-white/20 mr-1">·</span>}
                    <span>{f.icon}</span> {f.text}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-7">
              {STATS.map((s, i) => (
                <div key={i} className="flex items-center gap-7">
                  {i > 0 && <div className="w-px h-9 bg-emerald-500/30" />}
                  <div>
                    <div className="text-[26px] font-black text-emerald-400 leading-none tracking-tight"
                      style={{ textShadow: '0 0 20px rgba(52,211,153,0.4)' }}>
                      {s.num}
                    </div>
                    <div className="text-[11px] font-semibold text-white/45 tracking-[0.08em] uppercase mt-1">
                      {s.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── KOLOM KANAN ────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-5"
          >
            {/* Foto klinik rotating */}
            <div className="relative flex items-center justify-center h-[260px]">

              {/* Rings */}
              {[220, 265, 310].map((size, i) => (
                <motion.div key={i}
                  className="absolute rounded-full border border-emerald-400/15"
                  style={{ width: size, height: size }}
                  animate={{ scale: [1, 1.02, 1], opacity: [0.5, 0.2, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.8, ease: 'easeInOut' }}
                />
              ))}

              {/* Foto utama */}
              <motion.div
                className="relative w-[196px] h-[196px] rounded-[2.2rem] overflow-hidden z-10
                    shadow-2xl border-4 border-white/20"
                style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.45), 0 0 0 1px rgba(52,211,153,0.2)' }}
                animate={{
                  scale: [1, 1.02, 1],
                  boxShadow: [
                    '0 24px 64px rgba(0,0,0,0.45), 0 0 48px rgba(52,211,153,0.15)',
                    '0 32px 72px rgba(0,0,0,0.50), 0 0 64px rgba(52,211,153,0.25)',
                    '0 24px 64px rgba(0,0,0,0.45), 0 0 48px rgba(52,211,153,0.15)',
                  ]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <AnimatePresence mode="sync">
                  <motion.img
                    key={currentPhoto}
                    src={CLINIC_PHOTOS[currentPhoto]}
                    alt="Nauli Dental Care"
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.06 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                  />
                </AnimatePresence>
                {/* Brand overlay */}
                <div className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(2,44,24,0.55) 0%, transparent 50%)' }} />
                {/* Label klinik */}
                <div className="absolute bottom-3 left-0 right-0 text-center">
                  <span className="text-[10px] font-black text-white/90 tracking-widest uppercase">
                    Nauli Dental
                  </span>
                </div>
              </motion.div>

              {/* Dots indicator */}
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                {CLINIC_PHOTOS.map((_, i) => (
                  <button key={i} onClick={() => setCurrentPhoto(i)}
                    className={`rounded-full transition-all duration-300
                      ${currentPhoto === i
                        ? 'w-5 h-1.5 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                        : 'w-1.5 h-1.5 bg-white/25 hover:bg-emerald-400/60'}`}
                  />
                ))}
              </div>

              {/* Floating badges */}
              {FLOAT_BADGES.map((b, i) => (
                <motion.div key={i}
                  className={`absolute ${b.pos} bg-white/10 backdrop-blur-xl rounded-2xl px-3 py-2
                      flex items-center gap-2 border border-white/20 whitespace-nowrap z-20
                      shadow-xl shadow-black/30`}
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: -i * 1.2, ease: 'easeInOut' }}
                >
                  <span className="text-[18px]">{b.icon}</span>
                  <div>
                    <div className="text-[11px] font-bold text-white">{b.title}</div>
                    <div className="text-[10px] text-white/55">{b.sub}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* ── Action cards ─────────────────────────────── */}
            <div className="flex flex-col gap-3 mt-8">

              {/* Daftar Pasien Baru */}
              <motion.div whileHover={{ y: -4, scale: 1.01 }} whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
                <Link href="/register"
                  className="flex items-center gap-5 rounded-[22px] p-6 relative overflow-hidden group"
                  style={{
                    background: 'linear-gradient(135deg, #059669, #0d9488)',
                    boxShadow: '0 8px 32px rgba(5,150,105,0.45)',
                  }}
                >
                  <div className="absolute top-0 right-0 w-28 h-28 rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.18), transparent)', transform: 'translate(20px,-30px)' }} />
                  <div className="w-[50px] h-[50px] rounded-[15px] bg-white/20 flex items-center justify-center flex-shrink-0">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zM4 20c0-3.3 3.6-6 8-6s8 2.7 8 6"
                        stroke="white" strokeWidth="2" strokeLinecap="round" />
                      <path d="M19 8v6M22 11h-6" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-[17px] font-black text-white tracking-tight">Daftar Pasien Baru</div>
                    <div className="text-[12px] text-white/75 mt-0.5">Registrasi dan nikmati layanan kesehatan gigi terbaik</div>
                  </div>
                  <motion.div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0"
                    whileHover={{ x: 3 }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.div>
                </Link>
              </motion.div>

              {/* Masuk ke Sistem */}
              <motion.div whileHover={{ y: -4, scale: 1.01 }} whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
                <Link href="/login"
                  className="flex items-center gap-5 rounded-[22px] p-6 relative overflow-hidden group"
                  style={{
                    background: 'rgba(255,255,255,0.07)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.30)',
                  }}
                >
                  <div className="absolute top-0 right-0 w-28 h-28 rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.06), transparent)', transform: 'translate(20px,-30px)' }} />
                  <div className="w-[50px] h-[50px] rounded-[15px] bg-white/10 flex items-center justify-center flex-shrink-0">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="3" width="18" height="18" rx="4" stroke="white" strokeWidth="2" />
                      <path d="M15 12H9M12 9l3 3-3 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-[17px] font-black text-white tracking-tight">Masuk ke Sistem</div>
                    <div className="text-[12px] text-white/50 mt-0.5">Akses jadwal, rekam medis & kelola akun Anda</div>
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
              className="flex items-center justify-center gap-5 pt-1">
              {[
                { icon: ShieldCheck, label: 'Data Terenkripsi', color: 'text-emerald-400' },
                { icon: Clock, label: '24/7 Support', color: 'text-emerald-300' },
                { icon: Activity, label: 'Dokter Gigi & Perawat', color: 'text-teal-400' },
              ].map(({ icon: Icon, label, color }, i) => (
                <span key={i} className="flex items-center gap-[6px] text-[11px] font-semibold text-white/45">
                  {i > 0 && <span className="w-[3px] h-[3px] rounded-full bg-white/20 -ml-2 mr-1" />}
                  <Icon size={13} className={color} /> {label}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* ── FOOTER ─────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
          className="border-t border-white/10 py-5 flex flex-col sm:flex-row items-center
              justify-between gap-2 text-[11px] text-white/35">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-white/10 border border-white/15 flex items-center justify-center p-1">
              <img src="/images/Logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-semibold text-white/55 italic uppercase">Nauli Dental Care</span>
          </div>
          <span>© 2024 Nauli Dental Care · Sistem Informasi Klinik Gigi Modern</span>
          <span className="text-emerald-400/70 font-semibold">Jl. Balige No. 12, Toba, Sumatera Utara</span>
        </motion.div>
      </div>

      <style>{`
        @keyframes scrollTrack {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}