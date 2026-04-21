'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { 
    LayoutDashboard, Users, Calendar, 
    FileText, LogOut, Stethoscope, 
    Menu, X, Bell, User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);

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
        router.push('/login');
    };

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/doctor' },
        { icon: Calendar, label: 'Jadwal Praktek', href: '/doctor/schedule' },
        { icon: Users, label: 'Antrian Pasien', href: '/doctor/queue' },
        { icon: FileText, label: 'Rekam Medis', href: '/doctor/medical-records' },
    ];

    if (!isAuthorized) return null;

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex">
            {/* Sidebar Desktop */}
            <aside className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-100 transition-all duration-300 shadow-xl shadow-slate-200/50 ${isSidebarOpen ? 'w-72' : 'w-20'}`}>
                <div className="h-full flex flex-col p-4">
                    {/* Logo */}
                    <div className="flex items-center gap-3 px-3 py-6 mb-4">
                        <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                            <Stethoscope size={24} />
                        </div>
                        {isSidebarOpen && (
                            <span className="text-xl font-black text-slate-800 tracking-tighter">DOC.SYSTEM</span>
                        )}
                    </div>

                    {/* Menu Items */}
                    <nav className="flex-1 space-y-1">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 group ${
                                        isActive 
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                                        : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                                    }`}
                                >
                                    <item.icon size={20} className={isActive ? 'text-white' : 'group-hover:text-indigo-600'} />
                                    {isSidebarOpen && <span className="font-bold text-sm">{item.label}</span>}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-red-400 hover:bg-red-50 hover:text-red-500 transition-all mt-auto"
                    >
                        <LogOut size={20} />
                        {isSidebarOpen && <span className="font-bold text-sm">Log Out</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-72' : 'ml-20'}`}>
                {/* Navbar Desktop */}
                <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-4 flex justify-between items-center">
                    <button 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all"
                    >
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                    <div className="flex items-center gap-5">
                        <div className="relative group cursor-pointer">
                            <Bell size={20} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
                        </div>
                        <div className="flex items-center gap-3 pl-5 border-l border-slate-100">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-black text-slate-800 uppercase tracking-tighter">dr. Pratama</p>
                                <p className="text-[10px] text-indigo-500 font-bold">Dokter Spesialis</p>
                            </div>
                            <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-sm">
                                <User size={20} />
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
