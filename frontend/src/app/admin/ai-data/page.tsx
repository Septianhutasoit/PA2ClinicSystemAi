'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { motion } from 'framer-motion';
import {
    ThumbsUp, ThumbsDown, MessageSquare, BarChart3,
    RefreshCw, Loader2, Users, Star, Clock, AlertCircle
} from 'lucide-react';

// ── Tipe data ────────────────────────────────────────────────────────────────
interface AiStats {
    total_interactions: number;
    total_sessions: number;
    likes: number;
    dislikes: number;
    rated: number;
    unrated: number;
    accuracy: number;  // 0–100
}

interface ChatHistoryItem {
    id: number;
    session_id: string | null;
    user_message: string;
    bot_response: string;
    feedback: boolean | null;
    feedback_label: string;
    created_at: string | null;
}

const DEFAULT_STATS: AiStats = {
    total_interactions: 0,
    total_sessions: 0,
    likes: 0,
    dislikes: 0,
    rated: 0,
    unrated: 0,
    accuracy: 0,
};

export default function AdminAiDataPage() {
    const [stats, setStats] = useState<AiStats>(DEFAULT_STATS);
    const [history, setHistory] = useState<ChatHistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastSync, setLastSync] = useState<string | null>(null);

    // ── Fetch data dari backend ───────────────────────────────────────────
    const fetchData = async (showSyncIndicator = false) => {
        if (showSyncIndicator) setIsSyncing(true);
        setError(null);
        try {
            const [resStats, resHistory] = await Promise.all([
                api.get('/chatbot/admin/stats'),
                api.get('/chatbot/admin/history?limit=30'),
            ]);
            setStats(resStats.data ?? DEFAULT_STATS);
            setHistory(resHistory.data ?? []);
            setLastSync(new Date().toLocaleTimeString('id-ID'));
        } catch (err: any) {
            console.error('Gagal sinkronisasi data AI:', err);
            setError('Gagal memuat data. Pastikan backend berjalan dan tabel chat_logs tersedia.');
        } finally {
            setIsLoading(false);
            setIsSyncing(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    // ── Warna akurasi ─────────────────────────────────────────────────────
    const accuracyColor = stats.accuracy >= 80
        ? 'text-emerald-600'
        : stats.accuracy >= 60
            ? 'text-amber-500'
            : 'text-red-500';

    const accuracyBg = stats.accuracy >= 80
        ? 'from-emerald-50 to-teal-50 border-emerald-100'
        : stats.accuracy >= 60
            ? 'from-amber-50 to-yellow-50 border-amber-100'
            : 'from-red-50 to-rose-50 border-red-100';

    const statCards = [
        {
            label: 'Total Interaksi',
            value: stats.total_interactions,
            icon: <MessageSquare size={20} />,
            bg: 'bg-blue-50',
            text: 'text-blue-700',
            ring: 'ring-blue-100',
        },
        {
            label: 'Sesi Unik',
            value: stats.total_sessions,
            icon: <Users size={20} />,
            bg: 'bg-violet-50',
            text: 'text-violet-700',
            ring: 'ring-violet-100',
        },
        {
            label: 'Jawaban Dinilai',
            value: stats.rated,
            icon: <Star size={20} />,
            bg: 'bg-amber-50',
            text: 'text-amber-700',
            ring: 'ring-amber-100',
        },
        {
            label: 'Belum Dinilai',
            value: stats.unrated,
            icon: <Clock size={20} />,
            bg: 'bg-slate-50',
            text: 'text-slate-600',
            ring: 'ring-slate-100',
        },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center space-y-3">
                    <Loader2 className="animate-spin text-emerald-500 mx-auto" size={36} />
                    <p className="text-sm text-slate-400">Memuat data AI...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-10">

            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Data & Performa KlinikAI</h1>
                    <p className="text-sm text-slate-400 mt-0.5">
                        Statistik interaksi dan kualitas jawaban chatbot
                        {lastSync && <span className="ml-2 text-xs text-slate-300">· Sinkron: {lastSync}</span>}
                    </p>
                </div>
                <button
                    onClick={() => fetchData(true)}
                    disabled={isSyncing}
                    className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-all disabled:opacity-60"
                >
                    <RefreshCw size={16} className={isSyncing ? 'animate-spin' : ''} />
                    {isSyncing ? 'Menyinkron...' : 'Sync Data'}
                </button>
            </div>

            {/* ── Error banner ── */}
            {error && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 text-sm px-5 py-4 rounded-xl">
                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                    <div>
                        <p className="font-semibold">Gagal memuat data</p>
                        <p className="text-xs text-red-500 mt-0.5">{error}</p>
                    </div>
                </div>
            )}

            {/* ── Akurasi besar ── */}
            <motion.div
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                className={`bg-gradient-to-br ${accuracyBg} border rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6`}
            >
                <div className="text-center sm:text-left">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">
                        Akurasi Jawaban AI
                    </p>
                    <p className={`text-6xl font-black ${accuracyColor} leading-none`}>
                        {stats.accuracy}
                        <span className="text-3xl">%</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-2">
                        Dari {stats.rated} jawaban yang sudah dinilai pengguna
                    </p>
                </div>

                {/* Bar suka vs tidak */}
                <div className="flex-1 w-full">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-2">
                            <ThumbsUp size={14} className="text-emerald-600" />
                            <span className="text-sm font-bold text-slate-700">{stats.likes} Suka</span>
                        </div>
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                                style={{ width: stats.rated > 0 ? `${(stats.likes / stats.rated) * 100}%` : '0%' }}
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <ThumbsDown size={14} className="text-red-500" />
                            <span className="text-sm font-bold text-slate-700">{stats.dislikes} Tidak</span>
                        </div>
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-red-400 rounded-full transition-all duration-700"
                                style={{ width: stats.rated > 0 ? `${(stats.dislikes / stats.rated) * 100}%` : '0%' }}
                            />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* ── Stat cards ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((card, i) => (
                    <motion.div
                        key={card.label}
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className={`bg-white rounded-2xl border shadow-sm p-5 ring-1 ${card.ring} hover:shadow-md transition-all`}
                    >
                        <div className={`w-10 h-10 ${card.bg} ${card.text} rounded-xl flex items-center justify-center mb-4`}>
                            {card.icon}
                        </div>
                        <p className={`text-3xl font-black ${card.text} leading-none`}>{card.value}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1.5">{card.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* ── Riwayat Chat ── */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-50 flex items-center gap-3">
                    <div className="w-9 h-9 bg-emerald-700 text-white rounded-xl flex items-center justify-center">
                        <BarChart3 size={16} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-800">Riwayat Percakapan</h3>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">30 interaksi terbaru</p>
                    </div>
                </div>

                {history.length === 0 ? (
                    <div className="py-16 text-center text-slate-400 text-sm">
                        Belum ada riwayat percakapan tersimpan.
                    </div>
                ) : (
                    <div className="divide-y divide-slate-50">
                        {history.map((item, i) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.02 }}
                                className="px-6 py-4 hover:bg-slate-50/60 transition-colors"
                            >
                                {/* Baris atas: badge feedback + waktu */}
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${item.feedback === true
                                            ? 'bg-emerald-50 text-emerald-700'
                                            : item.feedback === false
                                                ? 'bg-red-50 text-red-600'
                                                : 'bg-slate-100 text-slate-400'
                                        }`}>
                                        {item.feedback_label}
                                    </span>
                                    <span className="text-[10px] text-slate-300">
                                        {item.created_at
                                            ? new Date(item.created_at).toLocaleString('id-ID', {
                                                day: 'numeric', month: 'short',
                                                hour: '2-digit', minute: '2-digit',
                                            })
                                            : '—'}
                                    </span>
                                </div>

                                {/* Pertanyaan user */}
                                <div className="flex items-start gap-2 mb-2">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-300 mt-0.5 shrink-0 w-10">User</span>
                                    <p className="text-xs text-slate-700 font-medium leading-relaxed">
                                        {item.user_message}
                                    </p>
                                </div>

                                {/* Jawaban bot */}
                                <div className="flex items-start gap-2">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400 mt-0.5 shrink-0 w-10">AI</span>
                                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                                        {item.bot_response}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}