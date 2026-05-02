'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import {
    ThumbsUp, ThumbsDown, History, Zap,
    Loader2, Sparkles, Brain, MessageCircle,
    TrendingUp, AlertCircle, CalendarDays, User
} from 'lucide-react';
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';

// ── Helpers ───────────────────────────────────────────────────────────────────

function groupByDate(history: any[]) {
    const groups: Record<string, any[]> = {};
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    history.forEach((chat) => {
        const d = new Date(chat.created_at);
        let label: string;
        if (d.toDateString() === today.toDateString()) {
            label = 'Hari Ini';
        } else if (d.toDateString() === yesterday.toDateString()) {
            label = 'Kemarin';
        } else {
            label = d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
        }
        if (!groups[label]) groups[label] = [];
        groups[label].push(chat);
    });

    return groups;
}

function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'Baru saja';
    if (m < 60) return `${m} menit lalu`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h} jam lalu`;
    return `${Math.floor(h / 24)} hari lalu`;
}

// ── Komponen Utama ────────────────────────────────────────────────────────────

export default function AIAndScheduleHub() {
    const [chatHistory, setChatHistory] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'history' | 'schedule'>('history');

    useEffect(() => {
        api.get('/chatbot/chat/history')
            .then(res => setChatHistory(res.data))
            .catch(() => { })
            .finally(() => setIsLoading(false));
    }, []);

    const totalLike = chatHistory.filter((c: any) => c.rating === true).length;
    const totalDislike = chatHistory.filter((c: any) => c.rating === false).length;
    const totalChat = chatHistory.length;
    const accuracy = totalChat > 0 ? Math.round((totalLike / totalChat) * 100) : 0;

    const feedbackStats = [
        { name: 'Suka', value: totalLike, color: '#10b981' },
        { name: 'Tidak Suka', value: totalDislike, color: '#f43f5e' },
    ];

    const grouped = groupByDate(chatHistory);

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">

            {/* ── 1. PAGE HEADER ──────────────────────────────────────────── */}
            <div className="bg-white rounded-[2rem] p-10 border border-[#D4EDE5] shadow-sm relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-2 bg-emerald-500 rounded-l-[2rem]" />
                <div className="relative z-10 pl-4">
                    <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-4 py-1.5 rounded-full mb-5">
                        <Sparkles size={12} className="text-emerald-600" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">
                            Monitoring Aktif
                        </span>
                    </div>
                    <h1 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
                        Intelligence Hub
                    </h1>
                    <p className="text-slate-500 text-sm font-medium mt-3">
                        Monitoring kualitas jawaban AI &amp; riwayat interaksi pengguna secara real-time.
                    </p>
                </div>
                <Brain size={200} className="absolute -right-10 -bottom-10 text-emerald-50 rotate-[-15deg] pointer-events-none" />
            </div>

            {/* ── 2. TAB SWITCHER ─────────────────────────────────────────── */}
            <div className="bg-white rounded-[1.5rem] border border-slate-100 p-2 flex gap-2 shadow-sm w-fit">
                {(['history', 'schedule'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-7 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab
                                ? 'bg-emerald-600 text-white shadow-md'
                                : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        {tab === 'history' ? 'AI Feedback' : 'Jadwal Slot'}
                    </button>
                ))}
            </div>

            {/* ── 3. KONTEN UTAMA ─────────────────────────────────────────── */}
            <div className="grid lg:grid-cols-12 gap-6">

                {/* ── KIRI: STATS (4 Cols) ──────────────────────────────── */}
                <div className="lg:col-span-4 space-y-5">

                    {/* Stat Ringkas */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm p-5 hover:border-emerald-200 transition-all group">
                            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <ThumbsUp size={18} />
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Suka</p>
                            <h3 className="text-3xl font-black italic text-slate-800">{totalLike}</h3>
                        </div>
                        <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm p-5 hover:border-rose-200 transition-all group">
                            <div className="w-10 h-10 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <ThumbsDown size={18} />
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tidak Suka</p>
                            <h3 className="text-3xl font-black italic text-slate-800">{totalDislike}</h3>
                        </div>
                        <div className="bg-slate-900 rounded-[1.5rem] p-5 col-span-2 flex items-center justify-between shadow-lg">
                            <div>
                                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Akurasi AI</p>
                                <h3 className="text-4xl font-black italic text-white">{accuracy}<span className="text-lg text-emerald-400">%</span></h3>
                            </div>
                            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
                                <TrendingUp size={26} className="text-emerald-400" />
                            </div>
                        </div>
                    </div>

                    {/* Bar Chart Feedback */}
                    <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center border border-emerald-100">
                                <TrendingUp size={18} />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-slate-800 uppercase italic leading-none">AI Performance</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Distribusi feedback</p>
                            </div>
                        </div>

                        <div className="h-44 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={feedbackStats} barCategoryGap="40%">
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }} />
                                    <Tooltip
                                        contentStyle={{ background: '#0f172a', border: 'none', borderRadius: 12, color: '#fff', fontSize: 11, fontWeight: 800 }}
                                        cursor={{ fill: '#f1f5f9' }}
                                    />
                                    <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={44}>
                                        {feedbackStats.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Training Tip */}
                    <div className="bg-emerald-50 rounded-[1.5rem] border border-emerald-200 p-6 flex gap-4">
                        <div className="w-10 h-10 bg-white text-emerald-600 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0 border border-emerald-100">
                            <Zap size={18} />
                        </div>
                        <div>
                            <h4 className="text-sm font-black italic uppercase text-slate-800 leading-none mb-2">Training Tip</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Jika banyak user memberikan <strong className="text-rose-500">&quot;Tidak Suka&quot;</strong>, segera perbarui dokumen PDF Anda di menu{' '}
                                <strong className="text-emerald-700">Knowledge Base</strong>.
                            </p>
                        </div>
                    </div>

                    {/* Alert jika dislike tinggi */}
                    {totalDislike > totalLike && (
                        <div className="bg-rose-50 rounded-[1.5rem] border border-rose-200 p-5 flex gap-3 items-start">
                            <AlertCircle size={18} className="text-rose-500 flex-shrink-0 mt-0.5" />
                            <p className="text-xs font-bold text-rose-600 leading-relaxed">
                                Perhatian! Feedback negatif lebih tinggi. Segera tinjau dokumen Knowledge Base.
                            </p>
                        </div>
                    )}
                </div>

                {/* ── KANAN: CHAT HISTORY (8 Cols) ─────────────────────── */}
                <div className="lg:col-span-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">

                    {/* Header */}
                    <div className="p-7 border-b border-slate-100 flex justify-between items-center flex-shrink-0">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100">
                                <History size={22} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">
                                    Riwayat Interaksi AI
                                </h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                    {totalChat} percakapan tercatat
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Live</span>
                        </div>
                    </div>

                    {/* List */}
                    <div className="overflow-y-auto flex-1 max-h-[680px]">
                        {isLoading ? (
                            <div className="p-20 text-center">
                                <Loader2 className="animate-spin mx-auto text-emerald-600" size={32} />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-3">Memuat riwayat...</p>
                            </div>
                        ) : totalChat === 0 ? (
                            <div className="p-20 text-center space-y-3 opacity-30">
                                <MessageCircle size={44} className="mx-auto text-slate-300" />
                                <p className="font-black text-slate-400 uppercase tracking-[0.3em] text-xs italic">Belum ada riwayat chat</p>
                            </div>
                        ) : (
                            Object.entries(grouped).map(([dateLabel, chats]) => (
                                <div key={dateLabel}>
                                    {/* ── Date Group Label ── */}
                                    <div className="sticky top-0 z-10 bg-slate-50 px-7 py-3 border-b border-t border-slate-100 flex items-center gap-3">
                                        <CalendarDays size={13} className="text-emerald-500" />
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                            {dateLabel}
                                        </span>
                                        <span className="ml-auto text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full uppercase tracking-widest">
                                            {chats.length} chat
                                        </span>
                                    </div>

                                    {/* ── Chats dalam group ── */}
                                    <div className="divide-y divide-slate-50">
                                        {chats.map((chat: any) => (
                                            <div key={chat.id} className="p-6 hover:bg-[#F5FAF7] transition-all group">
                                                {/* User info row */}
                                                <div className="flex justify-between items-center mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-100">
                                                            <User size={14} className="text-emerald-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-black text-slate-700 uppercase tracking-tight">
                                                                {chat.user_email || 'Anonymous Patient'}
                                                            </p>
                                                            <p className="text-[10px] font-bold text-slate-400">
                                                                {timeAgo(chat.created_at)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {/* Rating Badge */}
                                                    {chat.rating === true && (
                                                        <span className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                                                            <ThumbsUp size={10} /> Suka
                                                        </span>
                                                    )}
                                                    {chat.rating === false && (
                                                        <span className="inline-flex items-center gap-1.5 bg-rose-50 border border-rose-200 text-rose-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                                                            <ThumbsDown size={10} /> Tidak Suka
                                                        </span>
                                                    )}
                                                    {chat.rating === null && (
                                                        <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                                                            Belum dinilai
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Bubble percakapan */}
                                                <div className="space-y-2 ml-11">
                                                    {/* User message */}
                                                    <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl rounded-tl-none">
                                                        <p className="text-xs font-medium text-slate-500 italic leading-relaxed">
                                                            &quot;{chat.user_message}&quot;
                                                        </p>
                                                    </div>
                                                    {/* AI response */}
                                                    <div className="bg-[#F0FBF6] border border-emerald-100 p-4 rounded-2xl rounded-tl-none shadow-sm relative">
                                                        <div className="absolute -top-0.5 left-3 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shadow-sm">
                                                            <Brain size={10} className="text-white" />
                                                        </div>
                                                        <p className="text-[12px] font-bold text-emerald-900 leading-relaxed pt-3">
                                                            {chat.ai_response}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
