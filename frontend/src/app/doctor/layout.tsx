'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import Link from 'next/link';
import {
    LayoutDashboard, Users, Calendar,
    FileText, LogOut, Stethoscope,
    Menu, X, Bell, User, ChevronDown,
    ClipboardList, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token') || Cookies.get('token');
        const role = localStorage.getItem('user_role') || Cookies.get('role');
        if (!token || role?.toLowerCase() !== 'doctor') {
            router.push('/login');
        } else {
            setIsAuthorized(true);
        }
    }, [router]);

    const handleLogout = () => {
        Cookies.remove('token');
        Cookies.remove('role');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('user_role');
        router.push('/login');
    };

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard',     href: '/doctor',                color: 'text-indigo-500', bg: 'bg-indigo-50' },
        { icon: Calendar,        label: 'Jadwal Praktek', href: '/doctor/schedule',       color: 'text-teal-500',   bg: 'bg-teal-50' },
        { icon: Users,           label: 'Antrian Pasien', href: '/doctor/queue',          color: 'text-amber-500',  bg: 'bg-amber-50' },
        { icon: FileText,        label: 'Rekam Medis',    href: '/doctor/medical-records', color: 'text-rose-500',   bg: 'bg-rose-50' },
        { icon: Activity,        label: 'Laporan Medis',  href: '/doctor/dashboard',      color: 'text-violet-500', bg: 'bg-violet-50' },
    ];

    if (!isAuthorized) {
        return (
            <div className="h-screen w-screen bg-white flex flex-col items-center justify-center gap-4">
                <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Memverifikasi Akses Dokter...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F5F7FF] flex font-sans">

            {/* ── SIDEBAR ───────────────────────────────────────────────────── */}
            <aside className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-100 transition-all duration-300 shadow-xl shadow-slate-200/40 flex flex-col ${isSidebarOpen ? 'w-[240px]' : 'w-[72px]'}`}>

                {/* Logo */}
                <div className={`flex items-center gap-3 px-5 py-6 border-b border-slate-50 shrink-0`}>
                    <div className="w-9 h-9 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 shrink-0">
                        <Stethoscope size={20} />
                    </div>
                    <AnimatePresence>
                        {isSidebarOpen && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.15 }}
                            >
                                <p className="text-base font-black tracking-tighter text-slate-800 leading-none">Klinik.<span className="text-indigo-600">AI</span></p>
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Doc System</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Doctor Badge */}
                <AnimatePresence>
                    {isSidebarOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mx-3 mt-4 mb-2 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100/50 overflow-hidden"
                        >
                            <p className="text-[10px] font-black text-indigo-900 uppercase leading-none">Nauli Dental Care</p>
                            <p className="text-[9px] text-indigo-500 font-bold mt-1 italic opacity-70">Sistem Manajemen Dokter</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Navigation */}
                <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto py-2">
                    {!isSidebarOpen && <div className="h-2" />}
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href} title={!isSidebarOpen ? item.label : undefined}>
                                <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative group ${
                                    isActive
                                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'
                                }`}>
                                    {isActive && (
                                        <motion.div
                                            layoutId="doc-sidebar-active"
                                            className="absolute inset-0 bg-indigo-600 rounded-xl -z-10"
                                        />
                                    )}
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                                        isActive ? 'bg-white/20' : item.bg
                                    }`}>
                                        <item.icon size={16} className={isActive ? 'text-white' : item.color} />
                                    </div>
                                    <AnimatePresence>
                                        {isSidebarOpen && (
                                            <motion.span
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className={`text-[12px] font-bold tracking-tight truncate ${isActive ? 'text-white' : ''}`}
                                            >
                                                {item.label}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                    {/* Tooltip saat sidebar kecil */}
                                    {!isSidebarOpen && (
                                        <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-50">
                                            {item.label}
                                        </div>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="p-3 border-t border-slate-100 shrink-0">
                    <button
                        onClick={handleLogout}
                        title={!isSidebarOpen ? 'Logout' : undefined}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 text-[12px] font-bold transition-all group rounded-xl"
                    >
                        <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center shrink-0">
                            <LogOut size={15} className="text-red-400 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                        {isSidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* ── MAIN ──────────────────────────────────────────────────────── */}
            <main className={`flex-1 flex flex-col min-w-0 h-screen overflow-y-auto transition-all duration-300 ${isSidebarOpen ? 'ml-[240px]' : 'ml-[72px]'}`}>

                {/* Header */}
                <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 flex items-center justify-between sticky top-0 z-40 shrink-0">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-all hover:text-indigo-600"
                        >
                            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
                        </button>
                        <div className="h-5 w-px bg-slate-100" />
                        <h2 className="text-[12px] font-black text-slate-800 tracking-widest uppercase italic border-l-2 border-indigo-600 pl-3">
                            {menuItems.find(i => i.href === pathname)?.label || 'Dashboard'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Bell */}
                        <div className="relative">
                            <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                                <Bell size={18} />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
                            </button>
                        </div>

                        <div className="h-5 w-px bg-slate-100" />

                        {/* Profile */}
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(v => !v)}
                                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${isProfileOpen ? 'bg-indigo-700' : 'hover:bg-indigo-700'} group`}
                            >
                                <div className="w-8 h-8 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center shrink-0">
                                    <User size={16} className="text-indigo-600" />
                                </div>
                                <div className="text-left hidden sm:block">
                                    <p className={`text-[11px] font-black uppercase transition-colors ${isProfileOpen ? 'text-white' : 'text-slate-700 group-hover:text-white'}`}>dr. Pratama</p>
                                    <p className={`text-[9px] font-bold tracking-widest uppercase transition-colors ${isProfileOpen ? 'text-indigo-200' : 'text-indigo-500 group-hover:text-indigo-300'}`}>Dokter Spesialis</p>
                                </div>
                                <ChevronDown size={13} className={`transition-all ${isProfileOpen ? 'rotate-180 text-indigo-200' : 'text-slate-400 group-hover:text-indigo-200'}`} />
                            </button>

                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50"
                                    >
                                        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                                    <User size={20} className="text-white" />
                                                </div>
                                                <div>
                                                    <p className="text-[13px] font-black text-white uppercase">dr. Pratama</p>
                                                    <p className="text-[9px] text-indigo-200 font-bold uppercase tracking-widest">Dokter Spesialis</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-2">
                                            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-xl text-[12px] font-bold transition-all">
                                                <LogOut size={14} /> Keluar
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="flex-1 p-6 lg:p-10">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            className="max-w-[1500px] mx-auto"
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>

            {/* Mobile overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
}
