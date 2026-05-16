'use client';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Clock, Activity } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// ── Data (sama seperti aslinya) ──────────────────────────────────────────
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
  { num: '2.4K+', label: 'Pasien Puas' },
  { num: '15+', label: 'Dokter Spesialis' },
  { num: '98%', label: 'Tingkat Kepuasan' },
];

// Foto klinik untuk floating badges & gallery kanan
// Ganti src dengan foto klinik Anda di /public/images/
const FLOAT_BADGES = [
  { icon: '❤️', title: 'Pasien Puas', sub: '2,400+ pasien', pos: 'top-4 -right-6' },
  { icon: '🏅', title: 'Bersertifikat', sub: 'Standar ISO', pos: '-bottom-4 -left-6' },
  { icon: '✦', title: 'AI Powered', sub: 'Diagnosis cepat', pos: 'top-1/2 -left-16 -translate-y-1/2' },
];

// Partikel statis (sama seperti aslinya — aman dari hydration error)
const PARTICLES = Array.from({ length: 14 }).map((_, i) => ({
  left: (i * 7.14) % 100,
  w: (i % 4) + 2,
  h: (i % 4) + 2,
  dur: (i % 10) + 8,
  delay: -(i * 1.5),
  bg: i % 2 === 0 ? 'rgba(16,185,129,0.30)' : 'rgba(20,184,166,0.25)',
}));

// ── Foto klinik yang ditampilkan di kolom kanan ──────────────────────────
// GANTI src-nya dengan foto klinik Anda: '/images/klinik-1.jpg' dst.
const CLINIC_PHOTOS = [
  'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=800',
  'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=800',
  'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=800',
];

export default function WelcomePage() {
  const [isMounted, setIsMounted] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState(0);

  useEffect(() => { setIsMounted(true); }, []);

  // Auto-rotate foto klinik di kolom kanan
  useEffect(() => {
    const t = setInterval(() => setCurrentPhoto(p => (p + 1) % CLINIC_PHOTOS.length), 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className="min-h-screen overflow-hidden relative font-sans"
      style={{ backgroundColor: '#f0faf5' }}
      suppressHydrationWarning
    >
      {/* ── BACKGROUND MESH (sama seperti aslinya, warna emerald) ── */}
      <div className="fixed inset-0 z-0 pointer-events-none" suppressHydrationWarning>
        <div className="absolute inset-0" style={{
          background: `
                        radial-gradient(ellipse 60% 50% at 10% 20%, rgba(16,185,129,0.10) 0%, transparent 60%),
                        radial-gradient(ellipse 50% 60% at 90% 80%, rgba(20,184,166,0.08) 0%, transparent 60%),
                        radial-gradient(ellipse 40% 40% at 50% 50%, rgba(5,150,105,0.05) 0%, transparent 70%)
                    `
        }} />

        {/* Floating orbs */}
        <motion.div
          className="absolute w-80 h-80 -top-20 -left-20 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.13), transparent)' }}
          animate={{ x: [0, 20, 0], y: [0, -15, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-64 h-64 bottom-[10%] -right-16 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.10), transparent)' }}
          animate={{ x: [0, -15, 0], y: [0, 10, 0], scale: [1, 0.97, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: -3 }}
        />

        {/* Partikel — hanya setelah mount */}
        {isMounted && PARTICLES.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{ left: `${p.left}%`, width: `${p.w}px`, height: `${p.h}px`, background: p.bg }}
            initial={{ y: '100vh', opacity: 0 }}
            animate={{ y: '-20px', opacity: [0, 0.6, 0.6, 0] }}
            transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: 'linear' }}
          />
        ))}
      </div>

      {/* ── KONTEN UTAMA ─────────────────────────────────────────── */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-8 min-h-screen flex flex-col">

        {/* ── NAVBAR ──────────────────────────────────────────── */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between py-8 mb-4"
        >
          {/* Logo dari /images/logo1.png */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center
                                        bg-gradient-to-br from-emerald-500 to-teal-600 shadow-md shadow-emerald-200 shrink-0">
              {!logoError ? (
                <Image
                  src="/images/Logo1.png"
                  alt="Nauli Dental Logo"
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                  onError={() => setLogoError(true)}
                />
              ) : (
                /* Fallback huruf N jika gambar belum ada */
                <span className="text-white font-black text-xl">N</span>
              )}
            </div>
            <div>
              <div className="text-[15px] font-black text-slate-900 tracking-tight leading-tight">
                Nauli <span className="text-emerald-600">Dental</span> Care
              </div>
              <div className="text-[10px] font-semibold text-slate-400 tracking-[0.12em] uppercase">
                Klinik Balige · Jln. Horas Damn
              </div>
            </div>
          </div>

          {/* Status buka */}
          <div className="flex items-center gap-2 bg-white border border-emerald-100 rounded-full
                                    px-4 py-[7px] shadow-sm text-[12px] font-semibold text-slate-500">
            <span className="w-[7px] h-[7px] rounded-full bg-emerald-500
                                         shadow-[0_0_0_3px_rgba(16,185,129,0.20)] animate-pulse" />
            Buka Sekarang • 08.00–21.00
          </div>
        </motion.nav>

        {/* ── HERO GRID (layout asli: 2 kolom) ───────────────── */}
        <div className="grid lg:grid-cols-2 gap-14 items-center flex-1 pb-8">

          {/* ── KOLOM KIRI (sama seperti aslinya) ──────────── */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-6"
          >
            {/* Pill tag */}
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-[7px]
                                        text-[11px] font-bold tracking-[0.12em] uppercase
                                        text-emerald-700 border border-emerald-200/60"
              style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.10), rgba(20,184,166,0.08))' }}>
              <span className="text-emerald-500">✦</span> Nauli Dental Care System
            </div>

            {/* Judul utama */}
            <h1 className="text-[54px] sm:text-[58px] font-black leading-[1.05] tracking-[-2px] text-slate-900">
              Nauli Dental Care,<br />
              <span
                className="italic font-semibold"
                style={{
                  fontFamily: "'Georgia', serif",
                  background: 'linear-gradient(135deg, #059669 20%, #0d9488 80%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Masa Depan
              </span><br />
              Cerah
            </h1>

            <p className="text-[16px] leading-[1.75] text-slate-500 max-w-[420px]">
              Sistem manajemen klinik gigi modern untuk pengalaman perawatan yang lebih nyaman, cepat, dan efisien bersama tim dokter spesialis kami.
            </p>

            {/* Scrolling feature strip */}
            <div className="bg-white border border-emerald-100 rounded-2xl px-5 py-[14px] shadow-sm overflow-hidden">
              <div
                className="flex gap-4 items-center"
                style={{ animation: 'scrollTrack 14s linear infinite', width: 'max-content' }}
              >
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
                  {i > 0 && <div className="w-px h-9 bg-emerald-100" />}
                  <div>
                    <div className="text-[26px] font-black text-emerald-600 leading-none tracking-tight">
                      {s.num}
                    </div>
                    <div className="text-[11px] font-semibold text-slate-400 tracking-[0.08em] uppercase mt-1">
                      {s.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── KOLOM KANAN ─────────────────────────────────── */}
          {/*
                        JAWABAN PERTANYAAN ANDA:
                        Foto klinik paling profesional ditempatkan di kolom KANAN
                        sebagai card rounded dengan overlay — bukan full bg halaman.
                        Alasan: layout 2 kolom tetap terjaga, foto klinik jadi
                        "visual anchor" yang kuat tanpa mengorbankan keterbacaan teks kiri.
                        Full-bg hanya cocok untuk landing page 1 kolom / tanpa sidebar teks.
                    */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-5"
          >
            {/* Foto klinik utama — rotating dengan floating badges */}
            <div className="relative flex items-center justify-center h-[240px]">

              {/* Rings dekoratif (sama seperti aslinya) */}
              {[220, 260, 300].map((size, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full border border-emerald-500/12"
                  style={{ width: size, height: size }}
                  animate={{ scale: [1, 1.02, 1], opacity: [0.4, 0.15, 0.4] }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.8, ease: 'easeInOut' }}
                />
              ))}

              {/* ── Foto klinik rotating (pengganti ilustrasi SVG) ── */}
              <motion.div
                className="relative w-[180px] h-[180px] rounded-[2rem] overflow-hidden z-10
                                           shadow-2xl shadow-emerald-900/25 border-4 border-white"
                animate={{
                  scale: [1, 1.02, 1],
                  boxShadow: [
                    '0 24px 64px rgba(5,150,105,0.25)',
                    '0 32px 72px rgba(5,150,105,0.35)',
                    '0 24px 64px rgba(5,150,105,0.25)',
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
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                  /*
                      GANTI src CLINIC_PHOTOS di atas dengan foto klinik Anda:
                      '/images/klinik-ruangan.jpg'
                      '/images/klinik-dokter.jpg'
                      '/images/klinik-eksterior.jpg'
                  */
                  />
                </AnimatePresence>
                {/* Overlay tipis brand */}
                <div className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(5,150,105,0.3) 0%, transparent 50%)' }} />
              </motion.div>

              {/* Foto dots indicator */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                {CLINIC_PHOTOS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPhoto(i)}
                    className={`rounded-full transition-all duration-300
                                            ${currentPhoto === i
                        ? 'w-5 h-1.5 bg-emerald-500'
                        : 'w-1.5 h-1.5 bg-emerald-200 hover:bg-emerald-400'}`}
                  />
                ))}
              </div>

              {/* Floating badges (sama posisi seperti aslinya) */}
              {FLOAT_BADGES.map((b, i) => (
                <motion.div
                  key={i}
                  className={`absolute ${b.pos} bg-white rounded-2xl px-3 py-2
                                                flex items-center gap-2 shadow-xl border border-emerald-100/60
                                                whitespace-nowrap z-20`}
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

            {/* ── Action cards (sama seperti aslinya) ────── */}
            <div className="flex flex-col gap-3 mt-8">

              {/* Daftar Pasien Baru */}
              <motion.div
                whileHover={{ y: -4, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <Link
                  href="/register"
                  className="flex items-center gap-5 rounded-[22px] p-6 relative overflow-hidden group"
                  style={{
                    background: 'linear-gradient(135deg, #059669, #0d9488)',
                    boxShadow: '0 8px 32px rgba(5,150,105,0.35)',
                  }}
                >
                  <div className="absolute top-0 right-0 w-28 h-28 rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.15), transparent)', transform: 'translate(20px,-30px)' }} />
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
                  <motion.div
                    className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0"
                    whileHover={{ x: 3 }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.div>
                </Link>
              </motion.div>

              {/* Masuk ke Sistem */}
              <motion.div
                whileHover={{ y: -4, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <Link
                  href="/login"
                  className="flex items-center gap-5 rounded-[22px] p-6 relative overflow-hidden group"
                  style={{
                    background: 'linear-gradient(135deg, #0f172a, #1e293b)',
                    boxShadow: '0 8px 32px rgba(15,23,42,0.30)',
                  }}
                >
                  <div className="absolute top-0 right-0 w-28 h-28 rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.08), transparent)', transform: 'translate(20px,-30px)' }} />
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
                  <motion.div
                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0"
                    whileHover={{ x: 3 }}
                  >
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
                <Clock size={13} className="text-emerald-400" /> 24/7 Support
              </div>
              <div className="w-[3px] h-[3px] rounded-full bg-slate-200" />
              <div className="flex items-center gap-[6px] text-[11px] font-semibold text-slate-400">
                <Activity size={13} className="text-teal-500" /> Dokter Spesialis
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* ── FOOTER ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="border-t border-emerald-100 py-5 flex flex-col sm:flex-row items-center
                               justify-between gap-2 text-[11px] text-slate-400"
        >
          <div className="flex items-center gap-2">
            {/* Logo mini di footer */}
            <div className="w-6 h-6 rounded-lg overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              {!logoError ? (
                <Image
                  src="/images/logo1.png"
                  alt="Logo"
                  width={24} height={24}
                  className="object-cover w-full h-full"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <span className="text-white font-black text-xs">N</span>
              )}
            </div>
            <span className="font-semibold text-slate-500">Nauli Dental Care</span>
          </div>
          <span>© 2024 Nauli Dental Care · Sistem Informasi Klinik Gigi Modern</span>
          <span className="text-emerald-500 font-semibold">Jl. Balige No. 12, Toba, Sumatera Utara</span>
        </motion.div>
      </div>

      {/* ── CSS scrolling animation ──────────────────────────────── */}
      <style>{`
                @keyframes scrollTrack {
                    0%   { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>
    </div>
  );
}