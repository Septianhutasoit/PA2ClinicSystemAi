"use client";
import{ motion, AnimatePresence } from 'framer-motion';
import { LogOut, AlertCircle, X } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message }: Props) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    {/* Latar Belakang Blur */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    />

                    {/* Kotak Modal */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-sm bg-white rounded-[3rem] p-10 shadow-2xl border border-white overflow-hidden text-center"
                    >
                        {/* Ikon Melingkar */}
                        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <LogOut size={32} />
                        </div>

                        <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">{title}</h3>
                        <p className="text-slate-500 text-sm font-medium leading-relaxed mb-10">
                            {message}
                        </p>

                        {/* Tombol Aksi */}
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={onClose}
                                className="py-4 rounded-2xl bg-slate-100 text-slate-600 text-[11px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95"
                            >
                                Batal
                            </button>
                            <button
                                onClick={onConfirm}
                                className="py-4 rounded-2xl bg-red-600 text-white text-[11px] font-black uppercase tracking-widest shadow-lg shadow-red-200 hover:bg-red-700 transition-all active:scale-95"
                            >
                                Ya, Keluar
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}