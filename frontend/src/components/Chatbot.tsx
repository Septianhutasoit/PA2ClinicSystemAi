'use client';
import { useState, useEffect, useRef } from 'react';
import api from '@/services/api';
import {
    MessageCircle, Send, X, User, Sparkles,
    Maximize2, Minimize2, Trash2, ChevronRight,
    Plus, Search, Edit2, Menu,
    ThumbsUp, ThumbsDown, Copy, Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
    role: string;
    content: string;
    id: string;
    liked?: boolean | null;
    copied?: boolean;
}

interface Conversation {
    id: string;
    title: string;
    messages: Message[];
    createdAt: number;
}

// ── Custom Dental SVG Icon ──────────────────────────────────────────────────
function DentalIcon({ size = 16, className = '' }: { size?: number; className?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <path
                d="M8.5 3C6.5 3 5 4.5 5 6.5C5 8 5.5 9.5 6 11C6.5 12.5 7 14 7 16C7 17.1 7.9 18 9 18C10.1 18 10.8 17.2 11 16L12 13L13 16C13.2 17.2 13.9 18 15 18C16.1 18 17 17.1 17 16C17 14 17.5 12.5 18 11C18.5 9.5 19 8 19 6.5C19 4.5 17.5 3 15.5 3C14.3 3 13.3 3.6 12.8 4.5C12.5 5 12.3 5 12 5C11.7 5 11.5 5 11.2 4.5C10.7 3.6 9.7 3 8.5 3Z"
                fill="currentColor"
            />
            <circle cx="9.5" cy="7" r="1" fill="white" opacity="0.4" />
        </svg>
    );
}

function MessageDivider() {
    return (
        <div className="flex items-center gap-3 py-1">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <div className="w-1 h-1 rounded-full bg-white/10" />
            <div className="flex-1 h-px bg-white/[0.06]" />
        </div>
    );
}

// ── Konstanta ─────────────────────────────────────────────────────────────
const STORAGE_KEY = 'chatbot_conversations';

const INITIAL_MSG = (suffix = ''): Message => ({
    id: 'init-' + Date.now() + suffix,
    role: 'bot',
    content: 'Horas! Selamat datang di Nauli Dental Care Balige. Saya KlinikAI, asisten cerdas Anda. Ada yang bisa saya bantu hari ini?',
    liked: null,
});

const SUGGESTIONS = ['Jadwal Dokter', 'Lokasi Klinik', 'Biaya Scaling', 'Langkah Pendaftaran', 'Informasi Layanan'];

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [isFull, setIsFull] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [sidebarWidth, setSidebarWidth] = useState(240);
    const [isResizing, setIsResizing] = useState(false);

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [currentConvId, setCurrentConvId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [streamingText, setStreamingText] = useState('');
    const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
    const [editTitleValue, setEditTitleValue] = useState('');

    // FIX: track msgId yang sedang dikirim feedback-nya agar tidak double-send
    const feedbackInFlight = useRef<Set<string>>(new Set());

    const scrollRef = useRef<HTMLDivElement>(null);

    // ── Init conversations dari localStorage ──────────────────────────────
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored) as Conversation[];
                if (parsed.length > 0) {
                    setConversations(parsed);
                    setCurrentConvId(parsed[0].id);
                    return;
                }
            } catch { /* corrupt → buat baru */ }
        }
        const def: Conversation = {
            id: Date.now().toString(),
            title: 'Percakapan Baru',
            messages: [INITIAL_MSG()],
            createdAt: Date.now(),
        };
        setConversations([def]);
        setCurrentConvId(def.id);
    }, []);

    useEffect(() => {
        if (conversations.length > 0)
            localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    }, [conversations]);

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, [currentConvId, conversations, streamingText, isLoading]);

    // ── Resize sidebar ────────────────────────────────────────────────────
    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            if (isResizing) setSidebarWidth(Math.min(500, Math.max(200, e.clientX)));
        };
        const onUp = () => setIsResizing(false);
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
        return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    }, [isResizing]);

    // ── Helpers ───────────────────────────────────────────────────────────
    const currentConv = conversations.find(c => c.id === currentConvId);
    const messages = currentConv?.messages ?? [];

    const updateCurrentConversation = (updater: (conv: Conversation) => Conversation) => {
        if (!currentConvId) return;
        setConversations(prev => prev.map(c => c.id === currentConvId ? updater(c) : c));
    };

    // ── Like / Dislike ────────────────────────────────────────────────────
    const handleReaction = async (msgId: string, reaction: boolean) => {
        // FIX: Cegah double-send (klik cepat dua kali)
        if (feedbackInFlight.current.has(msgId)) return;

        const botMsg = messages.find(m => m.id === msgId);
        const botIdx = messages.findIndex(m => m.id === msgId);
        const userMsg = botIdx > 0 ? messages[botIdx - 1] : null;

        if (!botMsg) return;

        // FIX: Toggle — jika sudah sama, batalkan (null) tanpa kirim ke server
        const currentLiked = botMsg.liked;
        const newLiked: boolean | null = currentLiked === reaction ? null : reaction;

        // Update UI lokal terlebih dahulu (optimistic update)
        updateCurrentConversation(conv => ({
            ...conv,
            messages: conv.messages.map(m =>
                m.id === msgId ? { ...m, liked: newLiked } : m
            ),
        }));

        // FIX: Hanya kirim ke server jika user memilih reaksi (bukan toggle-off / null)
        if (newLiked !== null) {
            feedbackInFlight.current.add(msgId);
            try {
                await api.post('/chatbot/log-feedback', {
                    session_id: currentConvId,
                    user_message: userMsg?.content ?? 'Pertanyaan awal',
                    bot_response: botMsg.content,
                    feedback: newLiked,   // true = suka, false = tidak suka
                });
            } catch (err) {
                console.warn('Gagal mengirim feedback ke server:', err);
                // Rollback UI jika gagal
                updateCurrentConversation(conv => ({
                    ...conv,
                    messages: conv.messages.map(m =>
                        m.id === msgId ? { ...m, liked: currentLiked } : m
                    ),
                }));
            } finally {
                feedbackInFlight.current.delete(msgId);
            }
        }
    };

    // ── Copy ──────────────────────────────────────────────────────────────
    const fallbackCopy = (text: string) => {
        const el = document.createElement('textarea');
        el.value = text; el.style.position = 'fixed'; el.style.opacity = '0';
        document.body.appendChild(el); el.focus(); el.select();
        try { document.execCommand('copy'); } catch { /* noop */ }
        document.body.removeChild(el);
    };

    const handleCopy = (msgId: string, text: string) => {
        if (navigator.clipboard?.writeText) {
            navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
        } else {
            fallbackCopy(text);
        }
        updateCurrentConversation(conv => ({
            ...conv,
            messages: conv.messages.map(m => m.id === msgId ? { ...m, copied: true } : m),
        }));
        setTimeout(() => {
            updateCurrentConversation(conv => ({
                ...conv,
                messages: conv.messages.map(m => m.id === msgId ? { ...m, copied: false } : m),
            }));
        }, 2000);
    };

    // ── Streaming simulasi ────────────────────────────────────────────────
    const simulateStreaming = (fullText: string) => {
        const newMsgId = 'bot-' + Date.now();
        let index = 0, current = '';
        const interval = setInterval(() => {
            if (index < fullText.length) {
                current += fullText[index++];
                setStreamingText(current);
            } else {
                clearInterval(interval);
                updateCurrentConversation(conv => ({
                    ...conv,
                    messages: [...conv.messages, { id: newMsgId, role: 'bot', content: fullText, liked: null }],
                }));
                setStreamingText('');
            }
        }, 15);
    };

    // ── Fallback respons lokal (jika server error) ────────────────────────
    const getFallbackResponse = (msg: string): string => {
        const m = msg.toLowerCase();
        if (m.includes('jadwal') || m.includes('dokter')) return 'Jadwal dokter praktek Senin–Sabtu pukul 09.00–17.00. Untuk jadwal spesifik, hubungi 0852-1234-5678.';
        if (m.includes('lokasi') || m.includes('alamat')) return 'Nauli Dental Care di Jl. Balige No. 12, Toba, Sumatera Utara. Buka 08.00–20.00.';
        if (m.includes('biaya') || m.includes('scaling')) return 'Biaya scaling Rp 250.000–450.000. Info lengkap: WA 0821-6352-6363.';
        if (m.includes('daftar') || m.includes('booking')) return 'Pendaftaran via website atau langsung ke klinik. Bisa juga booking via WhatsApp.';
        if (m.includes('layanan')) return 'Layanan: scaling, tambal, cabut, saluran akar, behel, veneer, dan implant.';
        return 'Maaf, sedang ada gangguan koneksi. Hubungi WA 0821-6352-6363 untuk bantuan cepat.';
    };

    // ── Kirim pesan ───────────────────────────────────────────────────────
    const handleSendMessage = async (text: string = input) => {
        const msg = text.trim();
        if (!msg || isLoading || streamingText) return;

        const userMsgId = 'user-' + Date.now();

        updateCurrentConversation(conv => ({
            ...conv,
            messages: [...conv.messages, { id: userMsgId, role: 'user', content: msg }],
            title: (conv.title === 'Percakapan Baru' && conv.messages.length === 1)
                ? msg.slice(0, 30) + (msg.length > 30 ? '...' : '')
                : conv.title,
        }));

        setInput('');
        setIsLoading(true);

        try {
            // Kirim hanya field yang dibutuhkan backend (role + content)
            const cleanHistory = messages.slice(-6).map(m => ({
                role: m.role === 'bot' ? 'assistant' : 'user',
                content: m.content,
            }));

            const res = await api.post('/chatbot/chat', { message: msg, history: cleanHistory });
            setIsLoading(false);
            simulateStreaming(res.data.reply);
        } catch {
            setIsLoading(false);
            simulateStreaming(getFallbackResponse(msg));
        }
    };

    // ── Manajemen percakapan ──────────────────────────────────────────────
    const createNewChat = () => {
        const c: Conversation = {
            id: Date.now().toString(),
            title: 'Percakapan Baru',
            messages: [INITIAL_MSG('-new')],
            createdAt: Date.now(),
        };
        setConversations(prev => [c, ...prev]);
        setCurrentConvId(c.id);
        setSearchQuery('');
        setEditingTitleId(null);
    };

    const deleteConversation = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const next = conversations.filter(c => c.id !== id);
        if (next.length === 0) {
            const d: Conversation = { id: Date.now().toString(), title: 'Percakapan Baru', messages: [INITIAL_MSG()], createdAt: Date.now() };
            setConversations([d]); setCurrentConvId(d.id);
        } else {
            setConversations(next);
            if (currentConvId === id) setCurrentConvId(next[0].id);
        }
    };

    const renameConversation = (id: string, newTitle: string) => {
        setConversations(prev => prev.map(c => c.id === id ? { ...c, title: newTitle.slice(0, 40) } : c));
        setEditingTitleId(null);
    };

    const filteredConversations = conversations.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.messages.some(m => m.content.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // ─── FAB ─────────────────────────────────────────────────────────────
   if (!isOpen) return (
    <motion.button 
        initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[999] bg-[#1a1c23] text-white pl-2 pr-6 py-2 rounded-2xl shadow-2xl flex items-center gap-3 font-bold border border-white/10"
    >
        {/* Container Logo ala "Ask AI" */}
        <div className="relative w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-lg p-1.5 shrink-0 ring-2 ring-emerald-500/20">
            <img src="/images/Logo.png" className="w-full h-full object-contain" alt="Klinik AI" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
        </div>
        <div className="flex flex-col items-start leading-tight">
            <span className="text-[13px]">Tanya AI</span>
            <span className="text-[9px] text-emerald-400 uppercase tracking-widest">Online</span>
        </div>
    </motion.button>
);

    // ─── CHATBOT WINDOW ───────────────────────────────────────────────────
    return (
        <AnimatePresence>
            <motion.div
                key="chatbot"
                initial={{ opacity: 0, scale: 0.95, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 16 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className={`fixed z-[999] flex overflow-hidden
                    shadow-[0_32px_80px_rgba(0,0,0,0.4)] border border-white/[0.08]
                    ${isFull ? 'inset-0 rounded-none' : 'bottom-6 right-6 w-[95vw] md:w-[900px] h-[640px] rounded-[1.5rem]'}`}
                style={{ background: 'linear-gradient(135deg, #0f1117 0%, #141820 100%)' }}
            >
                {/* ── SIDEBAR ── */}
                <AnimatePresence>
                    {isSidebarOpen && (
                        <motion.div
                            initial={{ width: 0, opacity: 0 }} animate={{ width: sidebarWidth, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                            style={{ width: sidebarWidth, borderRight: '1px solid rgba(255,255,255,0.06)' }}
                            className="h-full flex flex-col overflow-hidden shrink-0 relative bg-white/[0.02]"
                        >
                            <div className="px-4 py-3.5 flex flex-col gap-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/25">Riwayat</span>
                                    <button onClick={createNewChat}
                                        className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition flex items-center justify-center">
                                        <Plus size={13} />
                                    </button>
                                </div>
                                <div className="relative">
                                    <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
                                    <input type="text" placeholder="Cari..." value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        className="w-full pl-8 pr-3 py-1.5 text-xs text-white/60 placeholder-white/20
                                                   bg-white/[0.04] border border-white/[0.07] rounded-lg
                                                   focus:outline-none focus:ring-1 focus:ring-emerald-500/30" />
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
                                {filteredConversations.map(conv => (
                                    <div key={conv.id} onClick={() => setCurrentConvId(conv.id)}
                                        className={`group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all
                                            ${currentConvId === conv.id
                                                ? 'bg-emerald-500/12 border border-emerald-500/20'
                                                : 'hover:bg-white/[0.04] border border-transparent'}`}>
                                        <MessageCircle size={12} className={currentConvId === conv.id ? 'text-emerald-400 shrink-0' : 'text-white/25 shrink-0'} />
                                        <div className="flex-1 min-w-0">
                                            {editingTitleId === conv.id
                                                ? <input type="text" value={editTitleValue} autoFocus
                                                    onChange={e => setEditTitleValue(e.target.value)}
                                                    onBlur={() => renameConversation(conv.id, editTitleValue)}
                                                    onKeyDown={e => e.key === 'Enter' && renameConversation(conv.id, editTitleValue)}
                                                    className="w-full text-xs bg-white/10 text-white border border-emerald-500/40 rounded px-1 py-0.5 outline-none" />
                                                : <p className={`text-xs font-semibold truncate ${currentConvId === conv.id ? 'text-white' : 'text-white/45'}`}>{conv.title}</p>
                                            }
                                            <p className="text-[10px] text-white/18 mt-0.5">
                                                {new Date(conv.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                            </p>
                                        </div>
                                        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition">
                                            <button onClick={e => { e.stopPropagation(); setEditingTitleId(conv.id); setEditTitleValue(conv.title); }}
                                                className="p-1 text-white/25 hover:text-emerald-400"><Edit2 size={10} /></button>
                                            <button onClick={e => deleteConversation(conv.id, e)}
                                                className="p-1 text-white/25 hover:text-red-400"><Trash2 size={10} /></button>
                                        </div>
                                    </div>
                                ))}
                                {filteredConversations.length === 0 && (
                                    <p className="text-center py-10 text-white/18 text-xs">Tidak ada percakapan</p>
                                )}
                            </div>
                            {/* Resize handle */}
                            <div onMouseDown={() => setIsResizing(true)}
                                className="absolute top-0 -right-1 w-2 h-full cursor-ew-resize hover:bg-emerald-500/25 z-50" />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── AREA CHAT ── */}
                <div className="flex-1 flex flex-col overflow-hidden">

                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-2.5 shrink-0"
                        style={{ background: 'rgba(255,255,255,0.025)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <div className="flex items-center gap-3">
                            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="w-7 h-7 rounded-lg hover:bg-white/8 text-white/40 hover:text-white transition flex items-center justify-center">
                                <Menu size={15} />
                            </button>
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow shadow-emerald-900/40">
                                <DentalIcon size={16} className="text-white" />
                            </div>
                            <div>
                                {currentConv && (
                                    <div className="flex items-center gap-1.5">
                                        {editingTitleId === 'current'
                                            ? <input type="text" value={editTitleValue} autoFocus
                                                onChange={e => setEditTitleValue(e.target.value)}
                                                onBlur={() => { renameConversation(currentConvId!, editTitleValue); setEditingTitleId(null); }}
                                                onKeyDown={e => e.key === 'Enter' && renameConversation(currentConvId!, editTitleValue)}
                                                className="bg-white/10 text-white px-2 py-0.5 rounded text-xs font-bold border border-emerald-500/40 outline-none" />
                                            : <>
                                                <h3 className="font-bold text-xs text-white/90">{currentConv.title}</h3>
                                                <button onClick={() => { setEditingTitleId('current'); setEditTitleValue(currentConv.title); }}
                                                    className="p-0.5 text-white/15 hover:text-white/50 transition"><Edit2 size={10} /></button>
                                            </>
                                        }
                                    </div>
                                )}
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                                    <span className="text-[9px] font-semibold uppercase tracking-widest text-white/25">KlinikAI · Online</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button onClick={() => setIsFull(!isFull)}
                                className="w-7 h-7 rounded-lg hover:bg-white/8 text-white/30 hover:text-white transition flex items-center justify-center">
                                {isFull ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                            </button>
                            <button onClick={() => { setIsOpen(false); setIsFull(false); }}
                                className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition flex items-center justify-center">
                                <X size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto scroll-smooth"
                        style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.08) transparent' }}>

                        {messages.map((msg, i) => (
                            <div key={msg.id || i}>
                                {i > 0 && <MessageDivider />}
                                {msg.role === 'user' ? (
                                    <div className="px-6 py-4 flex justify-end">
                                        <div className="flex items-end gap-2.5 max-w-[75%]">
                                            <div className="bg-emerald-600/20 border border-emerald-500/20 text-white/90 text-sm leading-relaxed px-4 py-3 rounded-2xl rounded-br-sm whitespace-pre-wrap">
                                                {msg.content}
                                            </div>
                                            <div className="w-6 h-6 rounded-lg bg-white/8 border border-white/10 flex items-center justify-center shrink-0 mb-0.5">
                                                <User size={12} className="text-white/50" />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="px-6 py-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0 mt-0.5 shadow shadow-emerald-900/30">
                                                <DentalIcon size={15} className="text-white" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap mb-3">
                                                    {msg.content}
                                                </p>
                                                {/* Action bar */}
                                                <div className="flex items-center gap-1">
                                                    <button onClick={() => handleReaction(msg.id, true)}
                                                        className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium transition-all
                                                            ${msg.liked === true
                                                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                                                                : 'text-white/25 hover:text-white/60 hover:bg-white/5 border border-transparent'}`}>
                                                        <ThumbsUp size={12} className={msg.liked === true ? 'fill-emerald-400' : ''} />
                                                        {msg.liked === true && <span className="text-emerald-400">Membantu</span>}
                                                    </button>
                                                    <button onClick={() => handleReaction(msg.id, false)}
                                                        className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium transition-all
                                                            ${msg.liked === false
                                                                ? 'bg-red-500/15 text-red-400 border border-red-500/25'
                                                                : 'text-white/25 hover:text-white/60 hover:bg-white/5 border border-transparent'}`}>
                                                        <ThumbsDown size={12} className={msg.liked === false ? 'fill-red-400' : ''} />
                                                        {msg.liked === false && <span className="text-red-400">Tidak membantu</span>}
                                                    </button>
                                                    <span className="w-1 h-1 rounded-full bg-white/10 mx-1" />
                                                    <button onClick={() => handleCopy(msg.id, msg.content)}
                                                        className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium text-white/25 hover:text-white/60 hover:bg-white/5 border border-transparent transition-all">
                                                        {msg.copied
                                                            ? <><Check size={12} className="text-emerald-400" /><span className="text-emerald-400">Tersalin</span></>
                                                            : <Copy size={12} />}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {streamingText && (
                            <>
                                {messages.length > 0 && <MessageDivider />}
                                <div className="px-6 py-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0 mt-0.5">
                                            <DentalIcon size={15} className="text-white" />
                                        </div>
                                        <p className="flex-1 text-sm text-white/80 leading-relaxed whitespace-pre-wrap pt-0.5">
                                            {streamingText}
                                            <span className="inline-block w-1.5 h-4 ml-0.5 bg-emerald-400 animate-pulse align-middle rounded-sm" />
                                        </p>
                                    </div>
                                </div>
                            </>
                        )}

                        {isLoading && !streamingText && (
                            <>
                                {messages.length > 0 && <MessageDivider />}
                                <div className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0">
                                            <DentalIcon size={15} className="text-white" />
                                        </div>
                                        <div className="flex gap-1.5">
                                            <span className="w-2 h-2 bg-emerald-500/60 rounded-full animate-bounce" />
                                            <span className="w-2 h-2 bg-emerald-500/60 rounded-full animate-bounce [animation-delay:0.15s]" />
                                            <span className="w-2 h-2 bg-emerald-500/60 rounded-full animate-bounce [animation-delay:0.3s]" />
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                        <div className="h-4" />
                    </div>

                    {/* Input area */}
                    <div className="px-4 pb-4 pt-2 shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        {!isLoading && !streamingText && (
                            <div className="flex gap-1.5 overflow-x-auto mb-3 pb-0.5" style={{ scrollbarWidth: 'none' }}>
                                {SUGGESTIONS.map(text => (
                                    <button key={text} onClick={() => handleSendMessage(text)}
                                        className="flex items-center gap-1 whitespace-nowrap px-3 py-1.5
                                                   bg-white/[0.04] hover:bg-emerald-500/10
                                                   border border-white/[0.07] hover:border-emerald-500/25
                                                   text-white/40 hover:text-emerald-300
                                                   text-[11px] font-semibold rounded-full transition-all">
                                        {text}<ChevronRight size={9} />
                                    </button>
                                ))}
                            </div>
                        )}
                        <div className="relative flex items-center"
                            style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.08)' }}>
                            <div className="absolute left-4 text-emerald-500/50"><Sparkles size={15} /></div>
                            <input type="text" value={input} onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Tanyakan jadwal, layanan, atau lokasi klinik..."
                                className="w-full pl-10 pr-14 py-3.5 text-sm text-white/75 placeholder-white/20 bg-transparent outline-none" />
                            <button onClick={() => handleSendMessage()} disabled={isLoading || !!streamingText}
                                className="absolute right-2 w-8 h-8 rounded-xl flex items-center justify-center
                                           bg-gradient-to-br from-emerald-500 to-teal-600 text-white
                                           hover:scale-105 active:scale-95 transition-all
                                           disabled:opacity-30 disabled:cursor-not-allowed disabled:scale-100">
                                <Send size={14} />
                            </button>
                        </div>
                        <p className="text-center text-[10px] text-white/15 mt-2 font-medium">
                            KlinikAI dapat membuat kesalahan. Verifikasi info penting dengan tim medis.
                        </p>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}