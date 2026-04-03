'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { FileText, Database, ShieldCheck, RefreshCw, Loader2 } from 'lucide-react';

// 1. Definisikan Interface agar tidak error 'any'
interface KnowledgeFile {
    name: string;
    category: string;
}

export default function KnowledgePage() {
    const [files, setFiles] = useState<KnowledgeFile[]>([]);
    const [isLoading, setIsLoading] = useState(true); // Gunakan isLoading

    useEffect(() => {
        api.get('/chatbot/knowledge-files')
            .then((res: any) => {
                setFiles(res.data);
                setIsLoading(false); 
            })
            .catch((err: any) => {
                console.error(err);
                setIsLoading(false); 
            });
    }, []);
    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            <header>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight italic">AI KNOWLEDGE CENTER</h1>
                <p className="text-slate-500 text-sm font-medium">Manajemen dokumen pangkalan data kecerdasan buatan.</p>
            </header>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-200 relative overflow-hidden group">
                    <Database size={80} className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform" />
                    <div className="relative z-10">
                        <Database size={32} className="mb-4 opacity-50" />
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Status Database</p>
                        <p className="text-2xl font-black mt-1 uppercase italic">Pinecone Active</p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm md:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                            <FileText className="text-blue-600" /> Dokumen Terdaftar
                        </h3>
                        <span className="text-[10px] font-black bg-slate-100 px-3 py-1 rounded-full text-slate-500 uppercase tracking-widest">
                            {files.length} Files Found
                        </span>
                    </div>

                    <div className="space-y-3">
                        {isLoading ? (
                            <div className="flex flex-col items-center py-10 text-slate-400 gap-2">
                                <Loader2 className="animate-spin" size={24} />
                                <p className="text-xs font-bold uppercase tracking-widest">Membaca Data...</p>
                            </div>
                        ) : (
                            <>
                                {files.map((file, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-blue-50 transition-all border border-transparent hover:border-blue-100 group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm font-black text-xs italic group-hover:rotate-6 transition-transform">
                                                PDF
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-700 text-sm">{file.name}</p>
                                                <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-0.5">{file.category}</p>
                                            </div>
                                        </div>
                                        <ShieldCheck size={20} className="text-emerald-500" />
                                    </div>
                                ))}
                                {files.length === 0 && (
                                    <div className="text-center py-10 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest italic">Folder docs kosong</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-orange-50 p-10 rounded-[3rem] border border-orange-100 text-center relative overflow-hidden">
                <div className="relative z-10">
                    <RefreshCw size={40} className="mx-auto text-orange-400 mb-4" />
                    <h3 className="text-xl font-bold text-orange-900 uppercase tracking-tight">Tambah Pengetahuan?</h3>
                    <p className="text-orange-700/70 text-sm mt-2 max-w-md mx-auto font-medium">
                        Simpan PDF baru di folder <code className="bg-orange-200 px-2 py-0.5 rounded text-orange-900 font-black">backend/docs</code>, lalu tekan tombol <strong className="text-blue-600">Sync AI</strong> di sidebar admin.
                    </p>
                </div>
            </div>
        </div>
    );
}