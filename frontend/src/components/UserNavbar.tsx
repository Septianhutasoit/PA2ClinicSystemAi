'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function UserNavbar() {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // HILANGKAN NAVBAR DI HALAMAN WELCOME
    if (pathname === '/') {
        return null;
    }

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
            className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled
                    ? 'bg-white/90 backdrop-blur-xl border-b border-slate-100 py-3 shadow-lg'
                    : 'bg-white/80 backdrop-blur-md py-5'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-center items-center">

                    {/* LOGO ONLY - Tanpa Menu Navigasi */}
                    <Link href="/" className="group">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-3"
                        >
                            {/* Logo Container dengan Animasi */}
                            <motion.div
                                animate={{
                                    rotate: [0, 5, -5, 0],
                                }}
                                transition={{
                                    duration: 0.5,
                                    delay: 0.3,
                                }}
                                className="relative"
                            >
                                <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:shadow-xl transition-all">
                                    <Sparkles size={22} className="text-white" strokeWidth={2} />
                                </div>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"
                                />
                            </motion.div>

                            {/* Text Logo */}
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="flex flex-col leading-tight"
                            >
                                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-800">
                                    Nauli<span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Dental</span>
                                </span>
                                <span className="text-[8px] sm:text-[9px] font-semibold text-slate-400 tracking-wider">
                                    KLINIK GIGI MODERN
                                </span>
                            </motion.div>

                            {/* Decorative Line */}
                            <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ delay: 0.4 }}
                                className="hidden lg:block w-px h-8 bg-gradient-to-b from-transparent via-slate-300 to-transparent mx-2"
                            />
                        </motion.div>
                    </Link>

                </div>
            </div>

            {/* Bottom Gradient Border saat scroll */}
            {isScrolled && (
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent"
                />
            )}
        </motion.nav>
    );
}