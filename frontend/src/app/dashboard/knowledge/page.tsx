'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { FileText, Database, ShieldCheck, RefreshCw } from 'lucide-react';

export default function KnowledgePage() {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/chatbot/knowledge-files').then(res => {
            setFiles(res.data);
            setLoading(false);
        });
    }, []);

    return (
        <div className="space-y-10">
            <header>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">AI KNOWLEDGE CENTER</h1>
                <p className="text-slate-500 font-medium">Manajemen dokumen pengetahuan yang dipelajari oleh KlinikAI.</p>
            </header>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-200">
                    <Database size={32} className="mb-4 opacity-50" />
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Status Database</p>
                    <p className="text-2xl font-black mt-1 uppercase italic text-white">Pinecone Active</p>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm md:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                            <FileText className="text-blue-600" /> Dokumen Terdaftar
                        </h3>
                        <span className="text-xs font-bold bg-slate-100 px-3 py-1 rounded-full text-slate-500">
                            {files.length} Files Found
                        </span>
                    </div>

                    <div className="space-y-3">
                        {files.map((file: any, i: number) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm font-bold text-xs italic">
                                        PDF
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-700 text-sm">{file.name}</p>
                                        <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-0.5">{file.category}</p>
                                    </div>
                                </div>
                                <ShieldCheck size={20} className="text-green-500" />
                            </div>
                        ))}
                        {files.length === 0 && <p className="text-center py-10 text-slate-400 italic">Belum ada dokumen di folder docs.</p>}
                    </div>
                </div>
            </div>

            <div className="bg-orange-50 p-10 rounded-[3rem] border border-orange-100 text-center">
                <RefreshCw size={40} className="mx-auto text-orange-400 mb-4" />
                <h3 className="text-xl font-bold text-orange-900">Ingin Menambah Pengetahuan?</h3>
                <p className="text-orange-700/70 text-sm mt-2 max-w-md mx-auto">
                    Silakan masukkan file PDF baru ke folder <code className="bg-orange-200 px-2 py-0.5 rounded text-orange-900 font-bold">docs</code> di komputer kamu, lalu gunakan tombol <strong>Sync AI Knowledge</strong> di sidebar.
                </p>
            </div>
        </div>
    );
}