'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { FileText, Database, ShieldCheck, RefreshCw, Loader2, Sparkles } from 'lucide-react';

interface KnowledgeFile {
    name: string;
    category: string;
}

export default function KnowledgePage() {
    const [files, setFiles] = useState<KnowledgeFile[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        api.get('/chatbot/knowledge-files')
            .then((res: any) => {
                setFiles(res.data);
                setIsLoading(false);
            })
            .catch((err: any) => {
                console.error("Gagal memuat file:", err);
                setIsLoading(false);
            });
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            {/* ── 1. PAGE HEADER ───────────────────────────────────────────── */}
            <div className="bg-white rounded-[2rem] p-10 border border-[#D4EDE5] shadow-sm relative overflow-hidden">
                {/* Accent bar kiri */}
                <div className="absolute left-0 top-0 bottom-0 w-2 bg-emerald-500 rounded-l-[2rem]" />

                <div className="relative z-10 pl-4">
                    <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-4 py-1.5 rounded-full mb-5">
                        <Sparkles size={12} className="text-emerald-600" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">
                            Sistem Aktif
                        </span>
                    </div>

                    <h1 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
                        AI Knowledge Center
                    </h1>
                    <p className="text-slate-500 text-sm font-medium mt-3">
                        Pusat kendali dokumen pangkalan data kecerdasan buatan.
                    </p>
                </div>

                {/* Dekorasi ikon */}
                <Database
                    size={200}
                    className="absolute -right-10 -bottom-10 text-emerald-50 rotate-[-15deg] pointer-events-none"
                />
            </div>

            {/* ── 2. STAT + FILE LIST ──────────────────────────────────────── */}
            <div className="grid md:grid-cols-3 gap-5">

                {/* Status Database */}
                <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm p-7 flex flex-col justify-between hover:border-emerald-300 transition-all group">
                    <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100 group-hover:scale-110 transition-transform mb-6">
                        <Database size={28} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                            Status Database
                        </p>
                        <p className="text-xl font-black italic uppercase text-slate-800">
                            Pinecone Active
                        </p>
                        <span className="inline-flex items-center gap-1.5 mt-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Terhubung
                        </span>
                    </div>
                </div>

                {/* File Count */}
                <div className="bg-slate-900 rounded-[1.5rem] p-7 flex flex-col justify-between shadow-lg">
                    <div className="w-14 h-14 bg-white/10 text-emerald-400 rounded-2xl flex items-center justify-center mb-6">
                        <FileText size={28} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">
                            File Terdeteksi
                        </p>
                        <p className="text-4xl font-black italic text-white">
                            {isLoading ? '—' : files.length}
                        </p>
                        <p className="text-slate-400 text-[10px] font-bold uppercase mt-1">
                            Dokumen PDF Aktif
                        </p>
                    </div>
                </div>

                {/* Hint Update */}
                <div className="bg-emerald-50 rounded-[1.5rem] border border-emerald-200 p-7 flex flex-col justify-between hover:border-emerald-400 transition-all group">
                    <div className="w-14 h-14 bg-white text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100 group-hover:scale-110 transition-transform mb-6 shadow-sm">
                        <RefreshCw size={26} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">
                            Update Ingatan AI
                        </p>
                        <p className="text-slate-600 text-xs font-medium leading-relaxed">
                            Masukkan PDF ke folder{' '}
                            <code className="bg-emerald-100 px-1.5 py-0.5 rounded text-emerald-800 font-black text-[10px]">
                                clinic-system/docs
                            </code>
                            , lalu tekan <strong className="text-emerald-700">Sync AI</strong> di sidebar.
                        </p>
                    </div>
                </div>
            </div>

            {/* ── 3. DAFTAR DOKUMEN ────────────────────────────────────────── */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">

                {/* Header */}
                <div className="flex justify-between items-center mb-7">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100">
                            <FileText size={22} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">
                                Dokumen Terdeteksi
                            </h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                Pangkalan data file PDF aktif
                            </p>
                        </div>
                    </div>

                    <span className="text-[10px] font-black bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2 rounded-xl uppercase tracking-widest">
                        {files.length} Files Found
                    </span>
                </div>

                {/* Divider */}
                <div className="border-t border-slate-100 mb-6" />

                {/* List */}
                <div className="space-y-3">
                    {isLoading ? (
                        <div className="flex flex-col items-center py-12 text-slate-400 gap-3">
                            <Loader2 className="animate-spin text-emerald-600" size={32} />
                            <p className="text-[10px] font-black uppercase tracking-widest">
                                Membaca Folder docs...
                            </p>
                        </div>
                    ) : files.length > 0 ? (
                        files.map((file, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between p-5 bg-[#F5FAF7] rounded-[1.5rem] border border-transparent hover:border-emerald-200 hover:bg-emerald-50/40 transition-all group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100 font-black text-[10px] italic">
                                        PDF
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-700 text-sm">{file.name}</p>
                                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-0.5">
                                            {file.category}
                                        </p>
                                    </div>
                                </div>
                                <ShieldCheck size={20} className="text-emerald-500" />
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-16 rounded-[1.5rem] border-2 border-dashed border-slate-200 bg-slate-50 space-y-2">
                            <FileText size={36} className="mx-auto text-slate-300" />
                            <p className="font-black text-slate-400 uppercase tracking-[0.3em] text-xs italic">
                                Tidak ada file PDF di folder docs
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}