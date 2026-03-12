'use client';
import { Activity, Users, Calendar, MessageSquare } from 'lucide-react';

export default function AdminDashboard() {
    const stats = [
        { label: 'Total Pasien', val: '120', icon: <Users />, color: 'bg-blue-500' },
        { label: 'Janji Temu', val: '12', icon: <Calendar />, color: 'bg-green-500' },
        { label: 'Chatbot Query', val: '45', icon: <MessageSquare />, color: 'bg-orange-500' },
        { label: 'Kesehatan Sistem', val: '100%', icon: <Activity />, color: 'bg-purple-500' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black text-slate-900">Dashboard Utama</h1>
                <p className="text-slate-500 font-medium text-sm">Selamat datang kembali, Admin.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((s, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className={`${s.color} p-3 rounded-2xl text-white`}>
                            {s.icon}
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
                            <p className="text-2xl font-black text-slate-800">{s.val}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
                <h3 className="text-xl font-bold text-slate-800 mb-2">Statistik AI & n8n</h3>
                <p className="text-slate-400 text-sm">Grafik analitik akan muncul di sini setelah integrasi n8n selesai.</p>
            </div>
        </div>
    );
}