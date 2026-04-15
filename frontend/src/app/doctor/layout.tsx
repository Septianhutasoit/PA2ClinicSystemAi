'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { motion } from 'framer-motion';
import {
    LayoutDashboard, ClipboardList, UserRound,
    LogOut, Bell, Settings, Calendar, ShieldCheck, Loader2
} from 'lucide-react';

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token') || Cookies.get('token');
        const role = localStorage.getItem('user_role') || Cookies.get('role');

        if (!token || role?.toLowerCase() !== 'doctor') {
            alert('Anda harus login sebagai Dokter untuk mengakses halaman ini.');
            router.push('/login');
        } else {
            setIsAuthorized(true);
        }
    }, [pathname]);

    const handleLogout = () => {
        localStorage.clear();
        Cookies.remove('token');
        window.location.href = '/login';
    };

    const navItems = [
        { name: 'Dashboard', href: '/doctor/dashboard', icon: <LayoutDashboard size={18} />, bg: 'bg-blue-50', color: 'text-blue-600' },
        { name: 'Jadwal Pasien', href: '/doctor/schedule', icon: <Calendar size={18} />, bg: 'bg-indigo-50', color: 'text-indigo-600' },
        { name: 'Riwayat Medis', href: '/doctor/medical-records', icon: <ClipboardList size={18} />, bg: 'bg-emerald-50', color: 'text-emerald-600' },
    ];

    if (!isAuthorized) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;

    return (
        <div className="flex min-h-screen bg-[#F4F7FE] font-sans overflow-hidden">
            {/* --- DOCTOR SIDEBAR --- */}
            <aside className="w-64 h-screen bg-white border-r border-blue-50 flex flex-col p-4">
                <div className="p-4 mb-8 flex items-center gap-3">
                    <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg italic font-black">D</div>
                    <h1 className="text-xl font-black tracking-tighter text-slate-800 uppercase italic leading-none">Medical.<span className="text-indigo-600">Pro</span></h1>
                </div>

                <nav className="flex-1 space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 mb-4 opacity-70">Dokter Portal</p>
                    {navItems.map((item) => (
                        <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all relative ${pathname === item.href ? "bg-indigo-600 text-white shadow-xl shadow-indigo-200" : "text-slate-500 hover:bg-slate-50"}`}>
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${pathname === item.href ? 'bg-white/20' : item.bg}`}>{item.icon}</div>
                            <span className="text-[13px] font-bold">{item.name}</span>
                        </Link>
                    ))}
                </nav>

                <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-4 text-slate-400 hover:text-red-600 text-xs font-black uppercase tracking-widest border-t border-slate-50 transition-colors mt-auto">
                    <LogOut size={18} /> Akhiri Sesi
                </button>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white/80 backdrop-blur-md px-8 flex justify-between items-center border-b border-blue-50 sticky top-0 z-40">
                    <h2 className="text-sm font-black uppercase tracking-[0.2em] text-indigo-600 italic">Doctor Workstation</h2>
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-[10px] font-black text-slate-900 uppercase">dr. Septian Adi</p>
                            <p className="text-[8px] text-indigo-500 font-bold tracking-widest italic">Spesialis Gigi Anak</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-black">SA</div>
                    </div>
                </header>
                <div className="flex-1 overflow-y-auto p-8 lg:p-12">
                    {children}
                </div>
            </main>
        </div>
    );
}