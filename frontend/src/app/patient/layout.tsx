'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Cookies from 'js-cookie';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, CalendarDays, ClipboardList,
    Bell, ChevronDown, LogOut, Settings, User, Sparkles,
    Menu, X, Activity, Stethoscope
} from 'lucide-react';

export default function PatientLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [logoError, setLogoError] = useState(false);

    // 1. PROTEKSI ROLE PASIEN
    useEffect(() => {
        const token = localStorage.getItem('token') || Cookies.get('token');
        const role = localStorage.getItem('user_role') || Cookies.get('role');

        if (!token || role?.toLowerCase() !== 'patient') {
            router.push('/login');
        } else {
            setIsAuthorized(true);
        }
    }, [router, pathname]);

    // 2. SCROLL EFFECT
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        if (confirm("Keluar dari Portal Pasien?")) {
            localStorage.clear();
            Cookies.remove('token');
            Cookies.remove('role');
            window.location.href = '/';
        }
    };

    const navItems = [
        { name: 'Dashboard', href: '/patient/dashboard', icon: <LayoutDashboard size={18} /> },
        { name: 'Janji Temu', href: '/patient/appointments', icon: <CalendarDays size={18} /> },
        { name: 'Rekam Medis', href: '/patient/records', icon: <ClipboardList size={18} /> },
        { name: 'Layanan', href: '/patient/services', icon: <Activity size={18} /> },
        { name: 'Tim Kami', href: '/patient/doctors', icon: <Stethoscope size={18} /> },
        { name: 'Profil', href: '/patient/profile', icon: <User size={18} /> },
    ];

    if (!isAuthorized) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 font-sans">

            {/* --- GLASSMORPHISM NAVBAR --- */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled
                        ? 'bg-white/95 backdrop-blur-xl border-b border-slate-100/50 shadow-lg'
                        : 'bg-white/10 backdrop-blur-md border-b border-white/20'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="h-16 flex justify-between items-center gap-4">

                        {/* Brand Section with Logo */}
                        <Link href="/patient/dashboard" className="flex items-center gap-3 group">
                            <motion.div
                                whileHover={{ scale: 1.05, rotate: 0 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative"
                            >
                                <div className={`w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center shadow-lg transition-all duration-300 ${isScrolled
                                        ? 'bg-gradient-to-br from-indigo-500 to-blue-600 shadow-indigo-200'
                                        : 'bg-gradient-to-br from-indigo-600 to-blue-700 shadow-indigo-300'
                                    }`}>
                                    {!logoError ? (
                                        <Image
                                            src="/images/logo1.png"
                                            alt="Nauli Dental Logo"
                                            width={40}
                                            height={40}
                                            className="object-cover w-full h-full"
                                            priority
                                            onError={() => setLogoError(true)}
                                        />
                                    ) : (
                                        <div className="w-full h-full rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center">
                                            <span className="text-white font-bold text-xl">N</span>
                                        </div>
                                    )}
                                </div>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-sm"
                                />
                            </motion.div>

                            <div className="flex flex-col leading-tight">
                                <span className={`text-lg font-black tracking-tight transition-colors duration-300 ${isScrolled ? 'text-slate-800' : 'text-white'
                                    }`}>
                                    Nauli<span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent"> Dental</span>
                                </span>
                                <span className={`text-[10px] font-semibold tracking-wider transition-colors duration-300 ${isScrolled ? 'text-slate-400' : 'text-white/70'
                                    }`}>
                                    PATIENT PORTAL
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-1">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link key={item.href} href={item.href}>
                                        <motion.div
                                            whileHover={{ y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                            className={`relative px-4 py-2 rounded-xl text-[13px] font-semibold transition-all duration-200 flex items-center gap-2 cursor-pointer
                                                ${isActive
                                                    ? isScrolled
                                                        ? 'text-indigo-600 bg-indigo-50/80'
                                                        : 'text-white bg-white/20'
                                                    : isScrolled
                                                        ? 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                                                }`}
                                        >
                                            <span className={`${isActive ? (isScrolled ? 'text-indigo-600' : 'text-white') : (isScrolled ? 'text-slate-400' : 'text-white/60')}`}>
                                                {item.icon}
                                            </span>
                                            <span>{item.name}</span>
                                            {isActive && (
                                                <motion.div
                                                    layoutId="activeNav"
                                                    className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full mx-2 ${isScrolled
                                                            ? 'bg-gradient-to-r from-indigo-600 to-blue-500'
                                                            : 'bg-gradient-to-r from-white to-indigo-200'
                                                        }`}
                                                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                                />
                                            )}
                                        </motion.div>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Action Section */}
                        <div className="flex items-center gap-2 sm:gap-3">
                            {/* Notification Bell */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`relative p-2 rounded-full transition-all duration-200 ${isScrolled
                                        ? 'text-slate-500 hover:bg-slate-100'
                                        : 'text-white/80 hover:bg-white/10'
                                    }`}
                            >
                                <Bell size={20} />
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"
                                />
                            </motion.button>

                            <div className={`h-6 w-px transition-colors duration-300 ${isScrolled ? 'bg-slate-200' : 'bg-white/20'
                                } hidden sm:block`} />

                            {/* Profile Dropdown */}
                            <div className="relative">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className={`flex items-center gap-3 p-1 pl-3 rounded-full transition-all duration-200 shadow-sm ${isScrolled
                                            ? 'bg-gradient-to-r from-slate-50 to-white border border-slate-200 hover:border-indigo-300'
                                            : 'bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20'
                                        }`}
                                >
                                    <div className="text-right hidden sm:block leading-tight">
                                        <p className={`text-[11px] font-bold transition-colors duration-300 ${isScrolled ? 'text-slate-700' : 'text-white'
                                            }`}>
                                            Septian Adi
                                        </p>
                                        <p className="text-[9px] font-semibold text-indigo-600 flex items-center gap-1">
                                            <Sparkles size={10} className="fill-indigo-200" />
                                            Member Gold
                                        </p>
                                    </div>
                                    <div className="relative">
                                        <div className={`w-9 h-9 rounded-full ring-2 overflow-hidden flex items-center justify-center transition-all duration-300 ${isScrolled
                                                ? 'ring-indigo-100 bg-gradient-to-br from-indigo-500 to-blue-500'
                                                : 'ring-white/30 bg-gradient-to-br from-indigo-600 to-blue-600'
                                            }`}>
                                            <span className="text-white font-bold text-sm">SA</span>
                                        </div>
                                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
                                    </div>
                                    <ChevronDown size={14} className={`transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''} ${isScrolled ? 'text-slate-400' : 'text-white/60'
                                        }`} />
                                </motion.button>

                                <AnimatePresence>
                                    {isProfileOpen && (
                                        <>
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                transition={{ type: "spring", damping: 20 }}
                                                className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50"
                                            >
                                                {/* Profile Header */}
                                                <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-4 text-white">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                                                            <span className="text-white font-bold text-lg">SA</span>
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-sm">Septian Adi Nugroho</p>
                                                            <p className="text-xs text-indigo-100">septian@email.com</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Menu Items */}
                                                <div className="p-2">
                                                    <Link href="/patient/profile">
                                                        <button className="w-full px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-3 transition-all">
                                                            <User size={16} className="text-indigo-500" />
                                                            <span>My Profile</span>
                                                        </button>
                                                    </Link>
                                                    <Link href="/patient/settings">
                                                        <button className="w-full px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-3 transition-all">
                                                            <Settings size={16} className="text-indigo-500" />
                                                            <span>Settings</span>
                                                        </button>
                                                    </Link>
                                                    <div className="h-px bg-slate-100 my-2" />
                                                    <button onClick={handleLogout} className="w-full px-3 py-2.5 text-left text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-3 transition-all">
                                                        <LogOut size={16} />
                                                        <span>Keluar Portal</span>
                                                    </button>
                                                </div>
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Mobile Menu Button */}
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className={`md:hidden p-2 rounded-lg transition-all ${isScrolled
                                        ? 'text-slate-600 hover:bg-slate-100'
                                        : 'text-white hover:bg-white/10'
                                    }`}
                            >
                                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-100 shadow-lg"
                        >
                            <div className="px-4 py-3 space-y-1">
                                {navItems.map((item, idx) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <motion.div
                                            key={item.href}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                        >
                                            <Link
                                                href={item.href}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all
                                                    ${isActive
                                                        ? 'bg-indigo-50 text-indigo-600'
                                                        : 'text-slate-600 hover:bg-slate-50'
                                                    }`}
                                            >
                                                <span className={isActive ? 'text-indigo-600' : 'text-slate-400'}>
                                                    {item.icon}
                                                </span>
                                                <span>{item.name}</span>
                                                {isActive && (
                                                    <motion.div
                                                        layoutId="mobileActive"
                                                        className="ml-auto w-1 h-6 bg-gradient-to-b from-indigo-600 to-blue-600 rounded-full"
                                                    />
                                                )}
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            {/* Backdrop for dropdowns */}
            {isProfileOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-40"
                    onClick={() => setIsProfileOpen(false)}
                />
            )}

            {/* --- AREA KONTEN (PAGES) --- */}
            <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={pathname}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}