'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Activity, Menu, X, ArrowRight, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export default function UserNavbar() {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);

        // Cek login status
        const token = Cookies.get('token');
        setIsLoggedIn(!!token);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Doctors', href: '#doctors' },
        { name: 'Services', href: '#services' },
        { name: 'About', href: '#about' },
    ];

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-white/80 backdrop-blur-md border-b border-slate-100 py-3 shadow-sm' : 'bg-transparent py-6'
            }`}>
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">

                {/* LOGO */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black italic shadow-lg shadow-blue-200 group-hover:rotate-6 transition-transform">
                        K
                    </div>
                    <span className="text-xl font-black tracking-tighter text-slate-900 leading-none">
                        Klinik.<span className="text-blue-600">AI</span>
                    </span>
                </Link>

                {/* NAV LINKS (Desktop) */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-blue-600 transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* AUTH BUTTONS */}
                <div className="flex items-center gap-4">
                    {isLoggedIn ? (
                        <Link
                            href="/admin"
                            className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg flex items-center gap-2"
                        >
                            <User size={14} /> My Dashboard
                        </Link>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 px-4 transition-colors">
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="bg-blue-600 text-white px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 group"
                            >
                                Get Started <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    )}
                </div>

            </div>
        </nav>
    );
}