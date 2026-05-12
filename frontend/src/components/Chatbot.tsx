'use client';
import { useState, useEffect, useRef } from 'react';
import api from '@/services/api';
import {
    MessageCircle, Send, X, Bot, User, Sparkles,
    Maximize2, Minimize2, Trash2, ChevronRight,
    Plus, Search, Edit2, Menu, GripVertical,
    Stethoscope
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Conversation {
    id: string;
    title: string;
    messages: { role: string; content: string }[];
    createdAt: number;
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

    const saveConversations = (newConvs: Conversation[]) => {
        localStorage.setItem('chatbot_conversations', JSON.stringify(newConvs));
        setConversations(newConvs);
    };

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
                    role: 'bot',
                    content: 'Horas! Selamat datang di Nauli Dental Care Balige. Saya KlinikAIChatbot, asisten cerdas Anda. Ada yang bisa saya bantu hari ini?'
                }],
                createdAt: Date.now()
            };
            setConversations([defaultConv]);
            setCurrentConvId(defaultConv.id);
        }
    }, []);

    useEffect(() => {
        if (conversations.length > 0) {
            localStorage.setItem('chatbot_conversations', JSON.stringify(conversations));
        }
    }, [conversations]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [currentConvId, conversations, streamingText, isLoading]);

    const currentConv = conversations.find(c => c.id === currentConvId);
    const messages = currentConv?.messages || [];

    const updateCurrentConversation = (updater: (conv: Conversation) => Conversation) => {
        if (!currentConvId) return;
        setConversations(prev => prev.map(conv =>
            conv.id === currentConvId ? updater(conv) : conv
        ));
    };

    const simulateStreaming = (fullText: string, onFinish?: () => void) => {
        let index = 0;
        let current = "";
        const interval = setInterval(() => {
            if (index < fullText.length) {
                current += fullText[index];
                setStreamingText(current);
                index++;
            } else {
                clearInterval(interval);
                updateCurrentConversation(conv => ({
                    ...conv,
                    messages: [...conv.messages, { role: 'bot', content: fullText }]
                }));
                setStreamingText('');
                onFinish?.();
            }
        }, 15);
    };

    const getFallbackResponse = (userMessage: string): string => {
        const msg = userMessage.toLowerCase();
        if (msg.includes('jadwal') || msg.includes('dokter') || msg.includes('praktik')) {
            return "Jadwal dokter praktek setiap Senin–Sabtu pukul 09.00–17.00. Untuk jadwal spesifik dokter, silakan hubungi reception kami di 0852-1234-5678.";
        } else if (msg.includes('lokasi') || msg.includes('alamat')) {
            return "Klinik Nauli Dental Care berada di Jl. Balige No. 12, Toba, Sumatera Utara. Buka pukul 08.00–20.00.";
        } else if (msg.includes('biaya') || msg.includes('harga') || msg.includes('scaling')) {
            return "Biaya scaling gigi mulai dari Rp 250.000 – Rp 450.000 tergantung kondisi. Untuk informasi lengkap, hubungi WA 0821-6352-6363.";
        } else if (msg.includes('daftar') || msg.includes('pendaftaran')) {
            return "Pendaftaran bisa dilakukan langsung lewat website kami atau datang ke klinik. Bisa juga booking via WhatsApp kami.";
        } else if (msg.includes('layanan') || msg.includes('service')) {
            return "Kami menyediakan: scaling, tambal gigi, cabut gigi, perawatan saluran akar, behel, veneer, dan implant.";
        } else {
            return "Maaf, saya sedang terputus dari server pusat. Namun silakan sampaikan pertanyaan Anda, nanti akan saya teruskan ke admin. Atau Anda bisa langsung menghubungi nomor WA kami 0821-6352-6363 untuk bantuan cepat.";
        }
    };

    const handleSendMessage = async (text: string = input) => {
        const msg = text.trim();
        if (!msg || isLoading || streamingText) return;

        updateCurrentConversation(conv => ({
            ...conv,
            messages: [...conv.messages, { role: 'user', content: msg }],
            title: (conv.title === 'Percakapan Baru' && conv.messages.length === 1)
                ? msg.slice(0, 30) + (msg.length > 30 ? '...' : '')
                : conv.title
        }));
        setInput('');
        setIsLoading(true);

        const historyForApi = messages.slice(-6).map(m => ({ role: m.role, content: m.content }));

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);
            const response = await api.post('/chatbot/chat', {
                message: msg,
                history: historyForApi
            }, { signal: controller.signal });
            clearTimeout(timeoutId);
            setIsLoading(false);
            simulateStreaming(response.data.reply);
        } catch (error: any) {
            setIsLoading(false);
            simulateStreaming(getFallbackResponse(msg));
        }
    };

    const createNewChat = () => {
        const newConv: Conversation = {
            id: Date.now().toString(),
            title: 'Percakapan Baru',
            messages: [{
                role: 'bot',
                content: 'Horas! Selamat datang di Nauli Dental Care Balige. Saya KlinikAIChatbot, asisten cerdas Anda. Ada yang bisa saya bantu hari ini?'
            }],
            createdAt: Date.now()
        };
        setConversations(prev => [newConv, ...prev]);
        setCurrentConvId(newConv.id);
        setSearchQuery('');
        setEditingTitleId(null);
    };

    const deleteConversation = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const newConvs = conversations.filter(c => c.id !== id);
        if (newConvs.length === 0) {
            const defaultConv: Conversation = {
                id: Date.now().toString(),
                title: 'Percakapan Baru',
                messages: [{
                    role: 'bot',
                    content: 'Horas! Selamat datang di Nauli Dental Care Balige. Saya KlinikAIChatbot, asisten cerdas Anda. Ada yang bisa saya bantu hari ini?'
                }],
                createdAt: Date.now()
            };
            setConversations([defaultConv]);
            setCurrentConvId(defaultConv.id);
        } else {
            setConversations(newConvs);
            if (currentConvId === id) setCurrentConvId(newConvs[0].id);
        }
    };

    const renameConversation = (id: string, newTitle: string) => {
        setConversations(prev => prev.map(conv =>
            conv.id === id ? { ...conv, title: newTitle.slice(0, 40) } : conv
        ));
        setEditingTitleId(null);
    };

    const filteredConversations = conversations.filter(conv =>
        conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.messages.some(m => m.content.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing) return;
            const newWidth = Math.min(500, Math.max(200, e.clientX));
            setSidebarWidth(newWidth);
        };
        const handleMouseUp = () => setIsResizing(false);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing]);

    const suggestions = [
        "Jadwal Dokter",
        "Lokasi Klinik",
        "Biaya Scaling",
        "Langkah Pendaftaran",
        "Informasi Layanan"
    ];

    // ── FAB (Floating Action Button) saat chatbot tertutup ──
    if (!isOpen) {
        return (
            <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-[999] flex items-center gap-3 px-5 py-3.5
                           bg-gradient-to-r from-emerald-600 to-teal-600
                           text-white rounded-2xl shadow-2xl shadow-emerald-900/40
                           font-bold text-sm tracking-wide"
            >
                <div className="relative">
                    <Stethoscope size={20} />
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-400 rounded-full border-2 border-emerald-600 animate-ping" />
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-400 rounded-full border-2 border-emerald-600" />
                </div>
                <span>Tanya KlinikAI</span>
            </motion.button>
        );
    }

    // ── Chatbot Window ──
    return (
        <AnimatePresence>
            <motion.div
                key="chatbot-window"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className={`fixed z-[999] flex overflow-hidden
                    shadow-[0_32px_80px_rgba(0,0,0,0.35)]
                    border border-white/10
                    ${isFull
                        ? 'inset-0 w-full h-full rounded-none'
                        : 'bottom-6 right-6 w-[95vw] md:w-[900px] h-[640px] rounded-[1.5rem]'
                    }`}
                style={{ background: 'linear-gradient(135deg, #0f1117 0%, #141820 100%)' }}
            >

                {/* ── SIDEBAR ── */}
                <AnimatePresence>
                    {isSidebarOpen && (
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: sidebarWidth, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            transition={{ duration: 0.22, ease: 'easeInOut' }}
                            className="h-full flex flex-col overflow-hidden shrink-0 relative"
                            style={{
                                width: sidebarWidth,
                                background: 'rgba(255,255,255,0.03)',
                                borderRight: '1px solid rgba(255,255,255,0.07)'
                            }}
                        >
                            {/* Sidebar Header */}
                            <div className="p-4 flex flex-col gap-3"
                                style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/30">
                                        Riwayat
                                    </span>
                                    <button
                                        onClick={createNewChat}
                                        className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400
                                                   hover:bg-emerald-500/20 transition flex items-center justify-center"
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>
                                {/* Search */}
                                <div className="relative">
                                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
                                    <input
                                        type="text"
                                        placeholder="Cari..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-8 pr-3 py-2 text-xs text-white/70 placeholder-white/25
                                                   bg-white/5 border border-white/8 rounded-xl
                                                   focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                                    />
                                </div>
                            </div>

                            {/* Conversation List */}
                            <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
                                {filteredConversations.map(conv => (
                                    <div
                                        key={conv.id}
                                        onClick={() => setCurrentConvId(conv.id)}
                                        className={`group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all
                                            ${currentConvId === conv.id
                                                ? 'bg-emerald-500/15 border border-emerald-500/20'
                                                : 'hover:bg-white/5 border border-transparent'
                                            }`}
                                    >
                                        <MessageCircle size={13} className={currentConvId === conv.id ? 'text-emerald-400' : 'text-white/30'} />
                                        <div className="flex-1 min-w-0">
                                            {editingTitleId === conv.id ? (
                                                <input
                                                    type="text"
                                                    value={editTitleValue}
                                                    onChange={(e) => setEditTitleValue(e.target.value)}
                                                    onBlur={() => renameConversation(conv.id, editTitleValue)}
                                                    onKeyPress={(e) => e.key === 'Enter' && renameConversation(conv.id, editTitleValue)}
                                                    autoFocus
                                                    className="w-full text-xs bg-white/10 text-white border border-emerald-500/40 rounded px-1 py-0.5"
                                                />
                                            ) : (
                                                <p className={`text-xs font-semibold truncate ${currentConvId === conv.id ? 'text-white' : 'text-white/50'}`}>
                                                    {conv.title}
                                                </p>
                                            )}
                                            <p className="text-[10px] text-white/20 mt-0.5">
                                                {new Date(conv.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                            </p>
                                        </div>
                                        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setEditingTitleId(conv.id); setEditTitleValue(conv.title); }}
                                                className="p-1 text-white/30 hover:text-emerald-400 transition"
                                            >
                                                <Edit2 size={11} />
                                            </button>
                                            <button
                                                onClick={(e) => deleteConversation(conv.id, e)}
                                                className="p-1 text-white/30 hover:text-red-400 transition"
                                            >
                                                <Trash2 size={11} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {filteredConversations.length === 0 && (
                                    <div className="text-center py-10 text-white/20 text-xs">Tidak ada percakapan</div>
                                )}
                            </div>

                            {/* Resize Handle */}
                            <div
                                ref={resizeRef}
                                onMouseDown={() => setIsResizing(true)}
                                className="absolute top-0 -right-1 w-2 h-full cursor-ew-resize hover:bg-emerald-500/30 transition bg-transparent z-50"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── CHAT AREA ── */}
                <div className="flex-1 flex flex-col overflow-hidden">

                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 shrink-0"
                        style={{
                            background: 'rgba(255,255,255,0.03)',
                            borderBottom: '1px solid rgba(255,255,255,0.07)'
                        }}>

                        {/* Kiri: toggle sidebar + brand */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="w-8 h-8 rounded-xl hover:bg-white/8 text-white/50 hover:text-white transition flex items-center justify-center"
                            >
                                <Menu size={16} />
                            </button>

                            {/* Avatar */}
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600
                                            flex items-center justify-center shadow-lg shadow-emerald-900/30">
                                <Bot size={16} className="text-white" />
                            </div>

                            <div>
                                {currentConv && (
                                    <div className="flex items-center gap-1.5">
                                        {editingTitleId === 'current' ? (
                                            <input
                                                type="text"
                                                value={editTitleValue}
                                                onChange={(e) => setEditTitleValue(e.target.value)}
                                                onBlur={() => { renameConversation(currentConvId!, editTitleValue); setEditingTitleId(null); }}
                                                onKeyPress={(e) => e.key === 'Enter' && renameConversation(currentConvId!, editTitleValue)}
                                                autoFocus
                                                className="bg-white/10 text-white px-2 py-0.5 rounded text-sm font-bold border border-emerald-500/40 outline-none"
                                            />
                                        ) : (
                                            <>
                                                <h3 className="font-bold text-sm text-white leading-tight">{currentConv.title}</h3>
                                                <button
                                                    onClick={() => { setEditingTitleId('current'); setEditTitleValue(currentConv.title); }}
                                                    className="p-0.5 text-white/20 hover:text-white/60 transition"
                                                >
                                                    <Edit2 size={11} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}
                                <div className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                                    <span className="text-[10px] font-semibold uppercase tracking-widest text-white/30">
                                        KlinikAI · Online
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Kanan: maximize + CLOSE */}
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setIsFull(!isFull)}
                                className="w-8 h-8 rounded-xl hover:bg-white/8 text-white/40 hover:text-white transition flex items-center justify-center"
                                title={isFull ? 'Perkecil' : 'Perbesar'}
                            >
                                {isFull ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                            </button>

                            {/* Tombol Close — jelas dan mudah ditemukan */}
                            <button
                                onClick={() => { setIsOpen(false); setIsFull(false); }}
                                className="w-8 h-8 rounded-xl bg-red-500/10 hover:bg-red-500/25
                                           text-red-400 hover:text-red-300 transition flex items-center justify-center"
                                title="Tutup"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto px-5 py-5 space-y-4 scroll-smooth"
                        style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}
                    >
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex items-end gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'bot' && (
                                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600
                                                    flex items-center justify-center shrink-0 mb-0.5 shadow-md shadow-emerald-900/30">
                                        <Bot size={14} className="text-white" />
                                    </div>
                                )}
                                <div className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap
                                    ${msg.role === 'user'
                                        ? 'bg-gradient-to-br from-emerald-600 to-teal-600 text-white rounded-2xl rounded-br-sm shadow-lg shadow-emerald-900/30'
                                        : 'bg-white/8 text-white/85 rounded-2xl rounded-bl-sm border border-white/8'
                                    }`}>
                                    {msg.content}
                                </div>
                                {msg.role === 'user' && (
                                    <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/15
                                                    flex items-center justify-center shrink-0 mb-0.5">
                                        <User size={13} className="text-white/60" />
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Streaming */}
                        {streamingText && (
                            <div className="flex items-end gap-2.5 justify-start">
                                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600
                                                flex items-center justify-center shrink-0 mb-0.5 shadow-md shadow-emerald-900/30">
                                    <Bot size={14} className="text-white" />
                                </div>
                                <div className="max-w-[80%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap
                                                bg-white/8 text-white/85 rounded-2xl rounded-bl-sm border border-white/8">
                                    {streamingText}
                                    <span className="inline-block w-1.5 h-4 ml-1 bg-emerald-400 animate-pulse align-middle rounded-sm" />
                                </div>
                            </div>
                        )}

                        {/* Loading dots */}
                        {isLoading && !streamingText && (
                            <div className="flex items-end gap-2.5 justify-start">
                                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600
                                                flex items-center justify-center shrink-0 shadow-md shadow-emerald-900/30">
                                    <Bot size={14} className="text-white" />
                                </div>
                                <div className="px-5 py-3.5 bg-white/8 rounded-2xl rounded-bl-sm border border-white/8 flex gap-1.5">
                                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" />
                                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.15s]" />
                                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.3s]" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="px-4 pb-4 pt-3 shrink-0"
                        style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>

                        {/* Suggestion chips */}
                        {!isLoading && !streamingText && (
                            <div className="flex gap-2 overflow-x-auto mb-3 pb-0.5" style={{ scrollbarWidth: 'none' }}>
                                {suggestions.map((text) => (
                                    <button
                                        key={text}
                                        onClick={() => handleSendMessage(text)}
                                        className="flex items-center gap-1 whitespace-nowrap px-3 py-1.5
                                                   bg-white/5 hover:bg-emerald-500/15
                                                   border border-white/8 hover:border-emerald-500/30
                                                   text-white/50 hover:text-emerald-300
                                                   text-[11px] font-semibold rounded-full transition-all"
                                    >
                                        {text}
                                        <ChevronRight size={10} />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Input box */}
                        <div className="relative flex items-center gap-2">
                            <div className="absolute left-4 text-emerald-500/60">
                                <Sparkles size={16} />
                            </div>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Tanyakan jadwal, layanan, atau lokasi klinik..."
                                className="w-full pl-10 pr-14 py-3.5 text-sm text-white/80 placeholder-white/25
                                           bg-white/6 border border-white/10 rounded-2xl
                                           focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/30
                                           transition-all"
                            />
                            <button
                                onClick={() => handleSendMessage()}
                                disabled={isLoading || !!streamingText}
                                className="absolute right-2 w-9 h-9 rounded-xl flex items-center justify-center
                                           bg-gradient-to-br from-emerald-500 to-teal-600
                                           text-white shadow-lg shadow-emerald-900/40
                                           hover:shadow-emerald-900/60 hover:scale-105
                                           active:scale-95 transition-all
                                           disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
                            >
                                <Send size={15} />
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}