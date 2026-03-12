'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import api from '@/services/api';
import { usePathname } from 'next/navigation';
import { Menu, X, Bell, Search, ChevronDown, LogOut, Settings, User } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isSyncing, setIsSyncing] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [notifications, setNotifications] = useState(3);
    const pathname = usePathname();

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    const handleSyncAI = async () => {
        const confirmSync = confirm("Perbarui database AI sekarang?");
        if (!confirmSync) return;
        setIsSyncing(true);
        try {
            const res = await api.post('/chatbot/ingest');
            alert(res.data.message);
        } catch (err) {
            alert("Gagal Sync!");
        } finally {
            setIsSyncing(false);
        }
    };

    const navItems = [
        { name: 'Dashboard', href: '/admin', icon: '📊', description: 'Statistik & Analitik' },
        { name: 'Pasien', href: '/admin/patients', icon: '👤', description: 'Data rekam medis' },
        { name: 'Dokter', href: '/admin/doctors', icon: '👨‍⚕️', description: 'Manajemen dokter' },
        { name: 'Jadwal Dokter', href: '/admin/schedules', icon: '⏳', description: 'Atur jam praktek' },
        { name: 'Booking Konsultasi', href: '/admin/appointments', icon: '📅', description: 'Kelola pendaftaran', badge: 5 },
        { name: 'Reminder Monitor', href: '/admin/reminders', icon: '📱', description: 'Status WhatsApp n8n' },
        { name: 'Laporan', href: '/admin/reports', icon: '📈', description: 'Export PDF & Excel' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-sans">
            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-30 px-4 py-3">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-black text-blue-600 tracking-tighter italic">KLINIK.AI</h1>
                        <p className="text-[8px] font-bold text-slate-400 tracking-widest uppercase">Management Suite</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition">
                            <Bell size={20} />
                            {notifications > 0 && (
                                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                                    {notifications}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setIsMobileMenuOpen(false)} />
            )}

            {/* Sidebar - Desktop & Mobile */}
            <aside className={`
                fixed top-0 left-0 h-full w-80 bg-white/90 backdrop-blur-xl border-r border-slate-200 
                transform transition-transform duration-300 ease-in-out z-50
                lg:translate-x-0 shadow-2xl lg:shadow-sm
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="h-full flex flex-col">
                    {/* Logo - Desktop */}
                    <div className="hidden lg:block p-8 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
                                🦷
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-blue-600 tracking-tighter italic">KLINIK.AI</h1>
                                <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Dental Care System</p>
                            </div>
                        </div>
                    </div>

                    {/* User Profile */}
                    <div className="p-6 border-b border-slate-100">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-md">
                                A
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-800">Admin Klinik</h3>
                                <p className="text-xs text-slate-500">admin@klinik.ai</p>
                            </div>
                            <button className="p-2 hover:bg-slate-100 rounded-lg transition">
                                <Settings size={18} className="text-slate-500" />
                            </button>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="px-6 py-4">
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Cari menu..."
                                className="w-full pl-9 pr-4 py-2.5 bg-slate-100 border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto px-4 py-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase px-4 mb-4 tracking-wider">Main Menu</p>
                        <div className="space-y-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`
                                        flex items-center gap-4 px-4 py-3 rounded-xl transition-all relative group
                                        ${pathname === item.href
                                            ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-200"
                                            : "text-slate-600 hover:bg-white hover:shadow-md"
                                        }
                                    `}
                                >
                                    <span className="text-xl">{item.icon}</span>
                                    <div className="flex-1">
                                        <p className="font-semibold text-sm">{item.name}</p>
                                        <p className={`text-[10px] ${pathname === item.href ? 'text-blue-100' : 'text-slate-400'}`}>
                                            {item.description}
                                        </p>
                                    </div>
                                    {item.badge && (
                                        <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                                            {item.badge}
                                        </span>
                                    )}
                                    {pathname !== item.href && (
                                        <div className="absolute right-4 opacity-0 group-hover:opacity-100 transition">
                                            <ChevronDown size={16} className="rotate-[-90deg]" />
                                        </div>
                                    )}
                                </Link>
                            ))}
                        </div>

                        {/* AI Control Section */}
                        <div className="mt-8 pt-6 border-t border-slate-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase px-4 mb-4 tracking-wider">AI Control</p>
                            <button
                                onClick={handleSyncAI}
                                disabled={isSyncing}
                                className={`
                                    w-full flex items-center gap-4 px-4 py-4 rounded-xl font-semibold text-sm transition-all
                                    ${isSyncing
                                        ? "bg-slate-100 text-slate-400"
                                        : "bg-gradient-to-r from-orange-50 to-amber-50 text-orange-600 hover:from-orange-100 hover:to-amber-100 border border-orange-200"
                                    }
                                `}
                            >
                                <div className={`
                                    w-8 h-8 rounded-lg flex items-center justify-center text-lg
                                    ${isSyncing ? 'bg-slate-200' : 'bg-orange-200'}
                                `}>
                                    {isSyncing ? "⏳" : "🤖"}
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="font-bold">{isSyncing ? "Syncing Database..." : "Sync AI Knowledge"}</p>
                                    <p className="text-[10px] text-slate-500">Update pengetahuan AI terbaru</p>
                                </div>
                            </button>
                        </div>
                    </nav>

                    {/* Footer */}
                    <div className="p-6 border-t border-slate-100">
                        <Link
                            href="/"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition group"
                        >
                            <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-white">
                                ←
                            </span>
                            <span>Kembali ke Website</span>
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`
                transition-all duration-300
                lg:ml-80
                ${isMobileMenuOpen ? 'lg:ml-80' : ''}
            `}>
                {/* Top Bar - Desktop */}
                <div className="hidden lg:block sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-20">
                    <div className="flex items-center justify-between px-8 py-4">
                        <div className="flex items-center gap-4">
                            <h2 className="text-lg font-semibold text-slate-800">
                                {navItems.find(item => item.href === pathname)?.name || 'Dashboard'}
                            </h2>
                            <span className="text-xs text-slate-400">
                                {new Date().toLocaleDateString('id-ID', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Notifications */}
                            <button className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition">
                                <Bell size={20} />
                                {notifications > 0 && (
                                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                                        {notifications}
                                    </span>
                                )}
                            </button>

                            {/* Profile Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-3 p-2 hover:bg-slate-100 rounded-lg transition"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                                        A
                                    </div>
                                    <ChevronDown size={16} className="text-slate-400" />
                                </button>

                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-2">
                                        <button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                                            <User size={16} /> Profile
                                        </button>
                                        <button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                                            <Settings size={16} /> Settings
                                        </button>
                                        <hr className="my-2 border-slate-100" />
                                        <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                                            <LogOut size={16} /> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="p-4 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        {/* Mobile Date */}
                        <div className="lg:hidden mb-4 text-xs text-slate-400">
                            {new Date().toLocaleDateString('id-ID', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </div>

                        {children}
                    </div>
                </div>
            </main>

            {/* Click outside to close profile dropdown */}
            {isProfileOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsProfileOpen(false)}
                />
            )}
        </div>
    );
}