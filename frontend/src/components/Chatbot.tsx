'use client';
import { useState, useEffect, useRef } from 'react';
import api from '@/services/api';
import {
    MessageCircle, Send, X, Bot, User, Sparkles,
    Maximize2, Minimize2, Trash2, ChevronRight,
    Plus, Search, Edit2, Menu,
    ThumbsUp, ThumbsDown, Copy, Check,
    RotateCcw, Stethoscope
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
    role: string;
    content: string;
    id: string;
    liked?: boolean | null; // null = belum, true = like, false = dislike
    copied?: boolean;
}

interface Conversation {
    id: string;
    title: string;
    messages: Message[];
    createdAt: number;
}

// ── Custom Dental SVG Icon ──
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

// ── Divider tipis bergaya Google AI Studio ──
function MessageDivider() {
    return (
        <div className="flex items-center gap-3 py-1">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <div className="w-1 h-1 rounded-full bg-white/10" />
            <div className="flex-1 h-px bg-white/[0.06]" />
        </div>
    );
}

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

    const scrollRef = useRef<HTMLDivElement>(null);
    const resizeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const stored = localStorage.getItem('chatbot_conversations');
        if (stored) {
            const parsed = JSON.parse(stored) as Conversation[];
            setConversations(parsed);
            if (parsed.length > 0) setCurrentConvId(parsed[0].id);
        } else {
            const defaultConv: Conversation = {
                id: Date.now().toString(),
                title: 'Percakapan Baru',
                messages: [{
                    id: 'init',
                    role: 'bot',
                    content: 'Horas! Selamat datang di Nauli Dental Care Balige. Saya KlinikAIChatbot, asisten cerdas Anda. Ada yang bisa saya bantu hari ini?',
                    liked: null
                }],
                createdAt: Date.now()
            };
            setConversations([defaultConv]);
            setCurrentConvId(defaultConv.id);
        }
    }, []);

    useEffect(() => {
        if (conversations.length > 0) localStorage.setItem('chatbot_conversations', JSON.stringify(conversations));
    }, [conversations]);

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, [currentConvId, conversations, streamingText, isLoading]);

    const currentConv = conversations.find(c => c.id === currentConvId);
    const messages = currentConv?.messages || [];

    const updateCurrentConversation = (updater: (conv: Conversation) => Conversation) => {
        if (!currentConvId) return;
        setConversations(prev => prev.map(conv => conv.id === currentConvId ? updater(conv) : conv));
    };

    // ── Like / Dislike per pesan ──
    const handleReaction = async (msgId: string, reaction: boolean) => {
        // Cari pesan bot dan pesan user sebelumnya
        const botMsg = messages.find(m => m.id === msgId);
        const botIdx = messages.findIndex(m => m.id === msgId);
        const userMsg = botIdx > 0 ? messages[botIdx - 1] : null;

        // Update UI lokal
        updateCurrentConversation(conv => ({
            ...conv,
            messages: conv.messages.map(m =>
                m.id === msgId ? { ...m, liked: m.liked === reaction ? null : reaction } : m
            )
        }));

        // Kirim ke backend
        if (botMsg) {
            try {
                await api.post('/chatbot/log-feedback', {
                    user_message: userMsg?.content || '',
                    bot_response: botMsg.content,
                    feedback: reaction,
                    session_id: currentConvId
                });
            } catch {
                console.warn('Gagal kirim feedback ke server');
            }
        }
    };

    // fallback copy
    const fallbackCopy = (text: string) => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        try {
            document.execCommand('copy');
        } catch (e) {
            console.warn('Copy gagal:', e);
        }
        document.body.removeChild(textarea);
    };

    // ── Copy teks ──
   const handleCopy = (msgId: string, text: string) => {
    // Fallback untuk HTTP / clipboard tidak tersedia
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).catch(() => {
            fallbackCopy(text);
        });
    } else {
        fallbackCopy(text);
    }
    updateCurrentConversation(conv => ({
            ...conv,
            messages: conv.messages.map(m => m.id === msgId ? { ...m, copied: true } : m)
        }));
        setTimeout(() => {
            updateCurrentConversation(conv => ({
                ...conv,
                messages: conv.messages.map(m => m.id === msgId ? { ...m, copied: false } : m)
            }));
        }, 2000);
    };

    const simulateStreaming = (fullText: string) => {
        let index = 0, current = '';
        const newMsgId = Date.now().toString();
        const interval = setInterval(() => {
            if (index < fullText.length) {
                current += fullText[index];
                setStreamingText(current);
                index++;
            } else {
                clearInterval(interval);
                updateCurrentConversation(conv => ({
                    ...conv,
                    messages: [...conv.messages, { id: newMsgId, role: 'bot', content: fullText, liked: null }]
                }));
                setStreamingText('');
            }
        }, 15);
    };

    const getFallbackResponse = (msg: string): string => {
        const m = msg.toLowerCase();
        if (m.includes('jadwal') || m.includes('dokter')) return 'Jadwal dokter praktek Senin–Sabtu pukul 09.00–17.00. Untuk jadwal spesifik, hubungi 0852-1234-5678.';
        if (m.includes('lokasi') || m.includes('alamat')) return 'Nauli Dental Care di Jl. Balige No. 12, Toba, Sumatera Utara. Buka 08.00–20.00.';
        if (m.includes('biaya') || m.includes('scaling')) return 'Biaya scaling Rp 250.000–450.000. Info lengkap: WA 0821-6352-6363.';
        if (m.includes('daftar') || m.includes('pendaftaran')) return 'Pendaftaran via website atau langsung ke klinik. Bisa juga booking via WhatsApp.';
        if (m.includes('layanan')) return 'Layanan: scaling, tambal, cabut, saluran akar, behel, veneer, dan implant.';
        return 'Maaf, sedang ada gangguan koneksi. Hubungi WA 0821-6352-6363 untuk bantuan cepat.';
    };

    const handleSendMessage = async (text: string = input) => {
        const msg = text.trim();
        if (!msg || isLoading || streamingText) return;
        const userMsgId = Date.now().toString();
        updateCurrentConversation(conv => ({
            ...conv,
            messages: [...conv.messages, { id: userMsgId, role: 'user', content: msg }],
            title: (conv.title === 'Percakapan Baru' && conv.messages.length === 1)
                ? msg.slice(0, 30) + (msg.length > 30 ? '...' : '') : conv.title
        }));
        setInput('');
        setIsLoading(true);
        try {
            const controller = new AbortController();
            setTimeout(() => controller.abort(), 10000);
            const response = await api.post('/chatbot/chat', { message: msg, history: messages.slice(-6) }, { signal: controller.signal });
            setIsLoading(false);
            simulateStreaming(response.data.reply);
        } catch {
            setIsLoading(false);
            simulateStreaming(getFallbackResponse(msg));
        }
    };

    const createNewChat = () => {
        const newConv: Conversation = {
            id: Date.now().toString(), title: 'Percakapan Baru',
            messages: [{ id: 'init-' + Date.now(), role: 'bot', content: 'Horas! Saya KlinikAIChatbot. Ada yang bisa saya bantu hari ini?', liked: null }],
            createdAt: Date.now()
        };
        setConversations(prev => [newConv, ...prev]);
        setCurrentConvId(newConv.id);
        setSearchQuery(''); setEditingTitleId(null);
    };

    const deleteConversation = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const newConvs = conversations.filter(c => c.id !== id);
        if (newConvs.length === 0) {
            const d: Conversation = { id: Date.now().toString(), title: 'Percakapan Baru', messages: [{ id: 'init', role: 'bot', content: 'Horas! Saya KlinikAIChatbot. Ada yang bisa saya bantu?', liked: null }], createdAt: Date.now() };
            setConversations([d]); setCurrentConvId(d.id);
        } else {
            setConversations(newConvs);
            if (currentConvId === id) setCurrentConvId(newConvs[0].id);
        }
    };

    const renameConversation = (id: string, newTitle: string) => {
        setConversations(prev => prev.map(conv => conv.id === id ? { ...conv, title: newTitle.slice(0, 40) } : conv));
        setEditingTitleId(null);
    };

    const filteredConversations = conversations.filter(conv =>
        conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.messages.some(m => m.content.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    useEffect(() => {
        const onMove = (e: MouseEvent) => { if (isResizing) setSidebarWidth(Math.min(500, Math.max(200, e.clientX))); };
        const onUp = () => setIsResizing(false);
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
        return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    }, [isResizing]);

    const suggestions = ['Jadwal Dokter', 'Lokasi Klinik', 'Biaya Scaling', 'Langkah Pendaftaran', 'Informasi Layanan'];

    // ─── FAB ────────────────────────────────────────────────────────
    if (!isOpen) {
        return (
            <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-[999] flex items-center gap-2.5 pl-2 pr-5 py-2
                           bg-gradient-to-r from-emerald-500 to-teal-500
                           text-white rounded-2xl shadow-2xl shadow-emerald-600/25 font-bold text-sm"
            >
                <div className="relative w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow flex-shrink-0">
                    <DentalIcon size={22} className="text-emerald-600" />
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-400 rounded-full border-2 border-white animate-ping" />
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-400 rounded-full border-2 border-white" />
                </div>
                <span>Tanya KlinikAI</span>
            </motion.button>
        );
    }

    // ─── CHATBOT WINDOW ─────────────────────────────────────────────
    return (
        <AnimatePresence>
            <motion.div
                key="chatbot"
                initial={{ opacity: 0, scale: 0.95, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 16 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className={`fixed z-[999] flex overflow-hidden
                    shadow-[0_32px_80px_rgba(0,0,0,0.4)]
                    border border-white/[0.08]
                    ${isFull ? 'inset-0 rounded-none' : 'bottom-6 right-6 w-[95vw] md:w-[900px] h-[640px] rounded-[1.5rem]'}`}
                style={{ background: 'linear-gradient(135deg, #0f1117 0%, #141820 100%)' }}
            >

                {/* ── SIDEBAR ── */}
                <AnimatePresence>
                    {isSidebarOpen && (
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: sidebarWidth, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
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
                                                    onKeyPress={e => e.key === 'Enter' && renameConversation(conv.id, editTitleValue)}
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

                            <div ref={resizeRef} onMouseDown={() => setIsResizing(true)}
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
                                                onKeyPress={e => e.key === 'Enter' && renameConversation(currentConvId!, editTitleValue)}
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

                    {/* ── MESSAGES — Google AI Studio style ── */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto scroll-smooth"
                        style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.08) transparent' }}>

                        {messages.map((msg, i) => (
                            <div key={msg.id || i}>
                                {/* Divider tipis antara setiap pesan (kecuali pertama) */}
                                {i > 0 && <MessageDivider />}

                                {msg.role === 'user' ? (
                                    /* ── User message ── */
                                    <div className="px-6 py-4 flex justify-end">
                                        <div className="flex items-end gap-2.5 max-w-[75%]">
                                            <div className="bg-emerald-600/20 border border-emerald-500/20
                                                            text-white/90 text-sm leading-relaxed px-4 py-3
                                                            rounded-2xl rounded-br-sm whitespace-pre-wrap">
                                                {msg.content}
                                            </div>
                                            <div className="w-6 h-6 rounded-lg bg-white/8 border border-white/10
                                                            flex items-center justify-center shrink-0 mb-0.5">
                                                <User size={12} className="text-white/50" />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    /* ── Bot message — dengan action bar ── */
                                    <div className="px-6 py-4">
                                        <div className="flex items-start gap-3">
                                            {/* Avatar */}
                                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600
                                                            flex items-center justify-center shrink-0 mt-0.5 shadow shadow-emerald-900/30">
                                                <DentalIcon size={15} className="text-white" />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                {/* Teks jawaban */}
                                                <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap mb-3">
                                                    {msg.content}
                                                </p>

                                                {/* ── Action bar: like, dislike, copy — Google AI Studio style ── */}
                                                <div className="flex items-center gap-1">
                                                    {/* Like */}
                                                    <button
                                                        onClick={() => handleReaction(msg.id, true)}
                                                        className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium transition-all
                                                            ${msg.liked === true
                                                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                                                                : 'text-white/25 hover:text-white/60 hover:bg-white/5 border border-transparent'}`}
                                                        title="Jawaban membantu"
                                                    >
                                                        <ThumbsUp size={12} className={msg.liked === true ? 'fill-emerald-400' : ''} />
                                                        {msg.liked === true && <span className="text-emerald-400">Membantu</span>}
                                                    </button>

                                                    {/* Dislike */}
                                                    <button
                                                        onClick={() => handleReaction(msg.id, false)}
                                                        className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium transition-all
                                                            ${msg.liked === false
                                                                ? 'bg-red-500/15 text-red-400 border border-red-500/25'
                                                                : 'text-white/25 hover:text-white/60 hover:bg-white/5 border border-transparent'}`}
                                                        title="Jawaban tidak membantu"
                                                    >
                                                        <ThumbsDown size={12} className={msg.liked === false ? 'fill-red-400' : ''} />
                                                        {msg.liked === false && <span className="text-red-400">Tidak membantu</span>}
                                                    </button>

                                                    {/* Divider dot */}
                                                    <span className="w-1 h-1 rounded-full bg-white/10 mx-1" />

                                                    {/* Copy */}
                                                    <button
                                                        onClick={() => handleCopy(msg.id, msg.content)}
                                                        className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium
                                                                   text-white/25 hover:text-white/60 hover:bg-white/5 border border-transparent transition-all"
                                                        title="Salin teks"
                                                    >
                                                        {msg.copied
                                                            ? <><Check size={12} className="text-emerald-400" /><span className="text-emerald-400">Tersalin</span></>
                                                            : <><Copy size={12} /></>
                                                        }
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Streaming text */}
                        {streamingText && (
                            <>
                                {messages.length > 0 && <MessageDivider />}
                                <div className="px-6 py-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600
                                                        flex items-center justify-center shrink-0 mt-0.5 shadow shadow-emerald-900/30">
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

                        {/* Loading dots */}
                        {isLoading && !streamingText && (
                            <>
                                {messages.length > 0 && <MessageDivider />}
                                <div className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600
                                                        flex items-center justify-center shrink-0 shadow shadow-emerald-900/30">
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

                        {/* Spacer bawah */}
                        <div className="h-4" />
                    </div>

                    {/* ── INPUT AREA ── */}
                    <div className="px-4 pb-4 pt-2 shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>

                        {/* Suggestions */}
                        {!isLoading && !streamingText && (
                            <div className="flex gap-1.5 overflow-x-auto mb-3 pb-0.5" style={{ scrollbarWidth: 'none' }}>
                                {suggestions.map(text => (
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

                        {/* Input */}
                        <div className="relative flex items-center"
                            style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.08)' }}>
                            <div className="absolute left-4 text-emerald-500/50"><Sparkles size={15} /></div>
                            <input
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Tanyakan jadwal, layanan, atau lokasi klinik..."
                                className="w-full pl-10 pr-14 py-3.5 text-sm text-white/75 placeholder-white/20
                                           bg-transparent outline-none"
                            />
                            <button onClick={() => handleSendMessage()} disabled={isLoading || !!streamingText}
                                className="absolute right-2 w-8 h-8 rounded-xl flex items-center justify-center
                                           bg-gradient-to-br from-emerald-500 to-teal-600 text-white
                                           hover:scale-105 active:scale-95 transition-all
                                           disabled:opacity-30 disabled:cursor-not-allowed disabled:scale-100
                                           shadow shadow-emerald-900/40">
                                <Send size={14} />
                            </button>
                        </div>

                        {/* Footer note */}
                        <p className="text-center text-[10px] text-white/15 mt-2 font-medium">
                            KlinikAI dapat membuat kesalahan. Verifikasi info penting dengan tim medis.
                        </p>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}