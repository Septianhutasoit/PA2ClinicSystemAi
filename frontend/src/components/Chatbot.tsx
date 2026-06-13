'use client';
import { useState, useEffect, useRef } from 'react';
import api from '@/services/api';
import {
    ArrowUp, X, User, CalendarDays,
    Maximize2, Minimize2, Trash2, ChevronRight,
    Plus, Search, Edit2,
    ThumbsUp, ThumbsDown, Copy, Check,
    RotateCcw, PanelLeftClose, PanelLeftOpen, Sparkles,
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

const STORAGE_KEY = 'chatbot_conversations';

const INITIAL_MSG = (suffix = ''): Message => ({
    id: 'init-' + Date.now() + suffix,
    role: 'bot',
    content: 'Horas! Selamat datang di Nauli Dental Care Balige. Saya KlinikAI, asisten cerdas Anda. Ada yang bisa saya bantu hari ini?',
    liked: null,
});

const SUGGESTIONS = [
    'Bagaimana cara merawat gigi yang benar?',
    'Harga tambal gigi terbaru?',
    'Biaya Scaling di Nauli Dental Care?',
    'Langkah Pendaftaran Nauli Dental Care?',
];

function ClinicLogo({ size = 32, className = '' }: { size?: number; className?: string }) {
    return (
        <img
            src="/images/icon.png"
            alt="Nauli Dental Care"
            width={size}
            height={size}
            className={`object-contain block ${className}`}
            style={{ width: size, height: size, flexShrink: 0 }}
        />
    );
}

function BotAvatar({ size = 32 }: { size?: number }) {
    return (
        <div style={{
            width: size, height: size, flexShrink: 0,
            borderRadius: 10, overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
            <ClinicLogo size={size} />
        </div>
    );
}

function MessageDivider() {
    return <div style={{ height: 1, backgroundColor: '#f1f5f9', margin: '0 24px' }} />;
}

// Efek gelombang teks loading
function WaveText({ text }: { text: string }) {
    return (
        <span style={{ display: 'inline-flex', gap: 1 }}>
            {text.split('').map((char, i) => (
                <span
                    key={i}
                    style={{
                        display: 'inline-block',
                        animation: `wave 1.4s ease-in-out infinite`,
                        animationDelay: `${i * 0.07}s`,
                        color: '#0f766e',
                        fontWeight: 600,
                        fontSize: 14,
                    }}
                >
                    {char === ' ' ? '\u00a0' : char}
                </span>
            ))}
            <style>{`
                @keyframes wave {
                    0%, 60%, 100% { transform: translateY(0); }
                    30% { transform: translateY(-5px); }
                }
            `}</style>
        </span>
    );
}

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [isFull, setIsFull] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [sidebarWidth, setSidebarWidth] = useState(220);
    const [isResizing, setIsResizing] = useState(false);

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [currentConvId, setCurrentConvId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [streamingText, setStreamingText] = useState('');
    const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
    const [editTitleValue, setEditTitleValue] = useState('');
    const [isHovered, setIsHovered] = useState(false);
    const [isBookingHovered, setIsBookingHovered] = useState(false); // State untuk tombol Booking
const [isAiHovered, setIsAiHovered] = useState(false); // State pendukung tombol AI

    const feedbackInFlight = useRef<Set<string>>(new Set());
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored) as Conversation[];
                if (parsed.length > 0) { setConversations(parsed); setCurrentConvId(parsed[0].id); return; }
            } catch { /* corrupt */ }
        }
        const def: Conversation = { id: Date.now().toString(), title: 'Percakapan Baru', messages: [INITIAL_MSG()], createdAt: Date.now() };
        setConversations([def]);
        setCurrentConvId(def.id);
    }, []);

    useEffect(() => {
        if (conversations.length > 0) localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    }, [conversations]);

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, [currentConvId, conversations, streamingText, isLoading]);

    useEffect(() => {
        const onMove = (e: MouseEvent) => { if (isResizing) setSidebarWidth(Math.min(320, Math.max(180, e.clientX))); };
        const onUp = () => setIsResizing(false);
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
        return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    }, [isResizing]);

    useEffect(() => {
        if (isOpen) { document.body.style.overflow = 'hidden'; }
        else { document.body.style.overflow = ''; }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const currentConv = conversations.find(c => c.id === currentConvId);
    const messages = currentConv?.messages ?? [];
    const isNewChat = messages.length === 1 && messages[0].role === 'bot';

    const updateCurrentConversation = (updater: (conv: Conversation) => Conversation) => {
        if (!currentConvId) return;
        setConversations(prev => prev.map(c => c.id === currentConvId ? updater(c) : c));
    };

    const handleReaction = async (msgId: string, reaction: boolean) => {
        if (feedbackInFlight.current.has(msgId)) return;
        const botMsg = messages.find(m => m.id === msgId);
        const botIdx = messages.findIndex(m => m.id === msgId);
        const userMsg = botIdx > 0 ? messages[botIdx - 1] : null;
        if (!botMsg) return;
        const currentLiked = botMsg.liked;
        const newLiked: boolean | null = currentLiked === reaction ? null : reaction;
        updateCurrentConversation(conv => ({ ...conv, messages: conv.messages.map(m => m.id === msgId ? { ...m, liked: newLiked } : m) }));
        if (newLiked !== null) {
            feedbackInFlight.current.add(msgId);
            try {
                await api.post('/chatbot/log-feedback', { session_id: currentConvId, user_message: userMsg?.content ?? '', bot_response: botMsg.content, feedback: newLiked });
            } catch (err) {
                console.warn('Gagal mengirim feedback:', err);
                updateCurrentConversation(conv => ({ ...conv, messages: conv.messages.map(m => m.id === msgId ? { ...m, liked: currentLiked } : m) }));
            } finally { feedbackInFlight.current.delete(msgId); }
        }
    };

    const fallbackCopy = (text: string) => {
        const el = document.createElement('textarea'); el.value = text; el.style.position = 'fixed'; el.style.opacity = '0';
        document.body.appendChild(el); el.focus(); el.select();
        try { document.execCommand('copy'); } catch { /* noop */ }
        document.body.removeChild(el);
    };

    const handleCopy = (msgId: string, text: string) => {
        navigator.clipboard?.writeText(text).catch(() => fallbackCopy(text)) ?? fallbackCopy(text);
        updateCurrentConversation(conv => ({ ...conv, messages: conv.messages.map(m => m.id === msgId ? { ...m, copied: true } : m) }));
        setTimeout(() => updateCurrentConversation(conv => ({ ...conv, messages: conv.messages.map(m => m.id === msgId ? { ...m, copied: false } : m) })), 2000);
    };

    const simulateStreaming = (fullText: string) => {
        const newMsgId = 'bot-' + Date.now();
        let index = 0, current = '';
        const interval = setInterval(() => {
            if (index < fullText.length) { current += fullText[index++]; setStreamingText(current); }
            else {
                clearInterval(interval);
                updateCurrentConversation(conv => ({ ...conv, messages: [...conv.messages, { id: newMsgId, role: 'bot', content: fullText, liked: null }] }));
                setStreamingText('');
            }
        }, 15);
    };

    const getFallbackResponse = (msg: string) => {
        const m = msg.toLowerCase();
        if (m.includes('jadwal') || m.includes('dokter')) return 'Jadwal dokter praktek Senin–Sabtu pukul 09.00–17.00. Untuk jadwal spesifik, hubungi 0852-1234-5678.';
        if (m.includes('lokasi') || m.includes('alamat')) return 'Nauli Dental Care di Jl. Balige No. 12, Toba, Sumatera Utara. Buka 08.00–20.00.';
        if (m.includes('biaya') || m.includes('scaling')) return 'Biaya scaling Rp 250.000–450.000. Info lengkap: WA 0821-6352-6363.';
        if (m.includes('daftar') || m.includes('booking')) return 'Pendaftaran via website atau langsung ke klinik. Bisa juga booking via WhatsApp.';
        if (m.includes('layanan')) return 'Layanan: scaling, tambal, cabut, saluran akar, behel, veneer, dan implant.';
        return 'Maaf, sedang ada gangguan koneksi. Hubungi WA 0821-6352-6363 untuk bantuan cepat.';
    };

    const handleSendMessage = async (text: string = input) => {
        const msg = text.trim();
        if (!msg || isLoading || streamingText) return;

        // 1. Tampilkan pesan user ke UI
        const userMsgId = 'user-' + Date.now();
        updateCurrentConversation(conv => ({
            ...conv,
            messages: [...conv.messages, { id: userMsgId, role: 'user', content: msg }],
            title: conv.title === 'Percakapan Baru' && conv.messages.length === 1
                ? msg.slice(0, 32) + (msg.length > 32 ? '…' : '')
                : conv.title,
        }));

        setInput('');
        setIsLoading(true);

        try {
            // 2. BERSIHKAN HISTORY — hanya kirim role & content (cegah error 422)
            //    Konversi 'bot' → 'assistant' agar backend tidak bingung
            const cleanHistory = messages.slice(-5).map(m => ({
                role: m.role === 'bot' ? 'assistant' : 'user',
                content: m.content,
            }));

            // 3. TIMEOUT 30 DETIK — AI + Pinecone butuh waktu berpikir
            const res = await api.post(
                '/chatbot/chat',
                { message: msg, history: cleanHistory }
            );

            setIsLoading(false);
            simulateStreaming(res.data.reply);

        } catch (err: any) {
            console.error('[Chat Error]', err);
            setIsLoading(false);

            // Bedakan timeout vs error lain
            if (err?.code === 'ECONNABORTED' || err?.message?.includes('timeout')) {
                simulateStreaming(
                    'Horas! Maaf, saya butuh waktu lebih lama untuk mencari informasinya. ' +
                    'Bisa ulangi pertanyaannya? Atau hubungi langsung WA 0821-6352-6363. 🙏'
                );
            } else {
                simulateStreaming(getFallbackResponse(msg));
            }
        }
    };

    const createNewChat = () => {
        const c: Conversation = { id: Date.now().toString(), title: 'Percakapan Baru', messages: [INITIAL_MSG('-new')], createdAt: Date.now() };
        setConversations(prev => [c, ...prev]); setCurrentConvId(c.id); setSearchQuery(''); setEditingTitleId(null);
    };

    const deleteConversation = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const next = conversations.filter(c => c.id !== id);
        if (next.length === 0) {
            const d: Conversation = { id: Date.now().toString(), title: 'Percakapan Baru', messages: [INITIAL_MSG()], createdAt: Date.now() };
            setConversations([d]); setCurrentConvId(d.id);
        } else { setConversations(next); if (currentConvId === id) setCurrentConvId(next[0].id); }
    };

    const renameConversation = (id: string, newTitle: string) => {
        setConversations(prev => prev.map(c => c.id === id ? { ...c, title: newTitle.slice(0, 40) } : c)); setEditingTitleId(null);
    };

    const filteredConversations = conversations.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.messages.some(m => m.content.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (!isOpen) return (
    <>
            {/* --- INI KODE TAMBAHAN UNTUK BOOKING (HANYA TAMBAH, TIDAK UBAH AI) --- */}
            <motion.a
                href="/patient/appointments"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={() => setIsBookingHovered(true)}
                onMouseLeave={() => setIsBookingHovered(false)}
                style={{
                    position: 'fixed',
                    bottom: 116, // Posisinya di atas tombol AI (24 + 80 + 12 gap)
                    right: 24,
                    zIndex: 9999,
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    justifyContent: 'center', gap: 4,
                    width: 80, height: 80,
                    borderRadius: 12,
                    backgroundColor: isBookingHovered ? '#10b981' : '#2e324d',
                    border: isBookingHovered ? '1px solid #34d399' : '1px solid rgba(255,255,255,0.1)',
                    boxShadow: isBookingHovered ? '0 10px 25px rgba(16,185,129,0.3)' : '0 8px 24px rgba(0,0,0,0.2)',
                    cursor: 'pointer', textDecoration: 'none',
                    transition: 'all 0.3s ease',
                }}
            >
                <div style={{ color: isBookingHovered ? '#ffffff' : '#10b981', transition: 'all 0.3s ease' }}>
                    <CalendarDays size={32} />
                </div>
                <span style={{ fontSize: 10, fontWeight: 800, color: '#ffffff', textTransform: 'uppercase' }}>
                    Booking
                </span>
            </motion.a>
        
        <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            // Tambahkan trigger state hover
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                position: 'fixed',
                bottom: 24,
                right: 24,
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                width: 80,
                height: 80,
                borderRadius: 12,
                // WARNA BACKGROUND: Biru Gelap saat diam, Putih saat Hover (agar ikon hijaunya terlihat)
                backgroundColor: isHovered ? '#ffffff' : '#2e324d',
                border: isHovered ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                boxShadow: isHovered ? '0 10px 25px rgba(16,185,129,0.3)' : '0 8px 24px rgba(0,0,0,0.2)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
            }}
        >
            <div style={{
                width: 45,
                height: 45,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',

                // --- LOGIKA BLENDING AGAR KOTAK HILANG TOTAL ---
                // multiply menghapus putih (saat hover), screen menghapus hitam (saat diam)
                mixBlendMode: isHovered ? 'multiply' : 'screen',

                // --- FILTER UNTUK MENYEMBUNYIKAN RESIDU KOTAK ---
                filter: isHovered
                    ? 'contrast(1.1)' // Menampilkan warna asli dengan tajam
                    : 'invert(1) grayscale(1) brightness(2) contrast(9)',
                // contrast(9) akan memaksa area abu-abu disekitar ikon menjadi hitam pekat,
                // sehingga mode 'screen' akan menghapusnya 100% tanpa sisa bayangan.
            }}>
                <img
                    src="/images/icon.png"
                    alt="AI"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        display: 'block',
                    }}
                />
            </div>

            <span style={{
                fontSize: 10,
                fontWeight: 800,
                // WARNA TEKS: Putih saat diam, Hijau saat Hover
                color: isHovered ? '#10b981' : '#ffffff',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                transition: 'all 0.3s ease',
            }}>
                Ask AI
            </span>
        </motion.button>
    </>
    );

    // ── CHATBOT WINDOW ──
    return (
        <AnimatePresence>
            {!isFull && (
                <motion.div
                    key="backdrop"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    style={{ position: 'fixed', inset: 0, zIndex: 9990, backgroundColor: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(2px)', pointerEvents: 'none' }}
                />
            )}

            <motion.div
                key="chatbot"
                initial={{ opacity: 0, scale: 0.97, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: 20 }}
                transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                style={{
                    position: 'fixed', zIndex: 9999,
                    display: 'flex', backgroundColor: '#ffffff',
                    overflow: 'hidden', touchAction: 'none',
                    ...(isFull
                        ? { inset: 0, borderRadius: 0 }
                        : { bottom: 24, right: 24, width: 'min(95vw, 860px)', height: 600, borderRadius: 16, boxShadow: '0 20px 60px rgba(0,0,0,0.15)', border: '1px solid #e2e8f0' }
                    ),
                }}
            >
                {/* SIDEBAR */}
                <AnimatePresence>
                    {isSidebarOpen && (
                        <motion.aside
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: sidebarWidth, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            transition={{ duration: 0.18 }}
                            style={{
                                width: sidebarWidth, minWidth: 0, height: '100%',
                                display: 'flex', flexDirection: 'column', overflow: 'hidden',
                                flexShrink: 0, position: 'relative',
                                backgroundColor: '#f8fafc', borderRight: '1px solid #e2e8f0',
                            }}
                        >
                            <div style={{ padding: 12, borderBottom: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: 8 }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: 11, fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Riwayat</span>
                                    <button onClick={createNewChat} title="Chat baru" style={{ width: 24, height: 24, borderRadius: 8, backgroundColor: '#f0fdfa', color: '#0d9488', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Plus size={13} />
                                    </button>
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <Search size={12} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                    <input
                                        type="text" placeholder="Cari percakapan..." value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        style={{ width: '100%', paddingLeft: 28, paddingRight: 12, paddingTop: 6, paddingBottom: 6, fontSize: 12, color: '#475569', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, outline: 'none', boxSizing: 'border-box' }}
                                    />
                                </div>
                            </div>
                            <div style={{ flex: 1, overflowY: 'auto', padding: 6 }}>
                                {filteredConversations.map(conv => (
                                    <div
                                        key={conv.id}
                                        onClick={() => setCurrentConvId(conv.id)}
                                        style={{
                                            display: 'flex', alignItems: 'flex-start', gap: 8,
                                            padding: '8px 10px', borderRadius: 12, cursor: 'pointer', marginBottom: 2,
                                            backgroundColor: currentConvId === conv.id ? '#f0fdfa' : 'transparent',
                                            border: currentConvId === conv.id ? '1px solid #99f6e4' : '1px solid transparent',
                                        }}
                                        onMouseEnter={e => { if (currentConvId !== conv.id) (e.currentTarget as HTMLDivElement).style.backgroundColor = '#fff'; }}
                                        onMouseLeave={e => { if (currentConvId !== conv.id) (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent'; }}
                                        className="group"
                                    >
                                        <ClinicLogo size={16} style={{ marginTop: 2, opacity: currentConvId === conv.id ? 1 : 0.4 } as React.CSSProperties} />
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            {editingTitleId === conv.id
                                                ? <input type="text" value={editTitleValue} autoFocus
                                                    onChange={e => setEditTitleValue(e.target.value)}
                                                    onBlur={() => renameConversation(conv.id, editTitleValue)}
                                                    onKeyDown={e => e.key === 'Enter' && renameConversation(conv.id, editTitleValue)}
                                                    style={{ width: '100%', fontSize: 12, backgroundColor: '#fff', color: '#334155', border: '1px solid #5eead4', borderRadius: 4, padding: '2px 4px', outline: 'none' }}
                                                />
                                                : <p style={{ fontSize: 12, fontWeight: 600, color: currentConvId === conv.id ? '#134e4a' : '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>{conv.title}</p>
                                            }
                                            <p style={{ fontSize: 10, color: '#94a3b8', margin: '2px 0 0 0' }}>
                                                {new Date(conv.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                            </p>
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100" style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
                                            <button onClick={e => { e.stopPropagation(); setEditingTitleId(conv.id); setEditTitleValue(conv.title); }} style={{ padding: 4, background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><Edit2 size={10} /></button>
                                            <button onClick={e => deleteConversation(conv.id, e)} style={{ padding: 4, background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><Trash2 size={10} /></button>
                                        </div>
                                    </div>
                                ))}
                                {filteredConversations.length === 0 && (
                                    <p style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8', fontSize: 12 }}>Tidak ada percakapan</p>
                                )}
                            </div>
                            <div onMouseDown={() => setIsResizing(true)} style={{ position: 'absolute', top: 0, right: -4, width: 8, height: '100%', cursor: 'ew-resize', zIndex: 50 }} />
                        </motion.aside>
                    )}
                </AnimatePresence>

                {/* AREA CHAT UTAMA */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#fff', flexShrink: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <button onClick={() => setIsSidebarOpen(v => !v)} title={isSidebarOpen ? 'Sembunyikan' : 'Tampilkan'} style={{ padding: 6, borderRadius: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center' }}>
                                {isSidebarOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
                            </button>
                            <ClinicLogo size={36} className="rounded-xl" />
                            <div>
                                <p style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', lineHeight: 1, margin: 0 }}>
                                    {currentConv?.title === 'Percakapan Baru' ? 'Tanyakan pertanyaan Anda' : (currentConv?.title ?? 'KlinikAI')}
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                                    <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }} />
                                    <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 500 }}>KlinikAI · Nauli Dental Care</span>
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <button onClick={createNewChat} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: 12, fontWeight: 600 }}>
                                <RotateCcw size={13} /><span>Chat Baru</span>
                            </button>
                            <button onClick={() => setIsFull(v => !v)} style={{ padding: 6, borderRadius: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center' }}>
                                {isFull ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                            </button>
                            <button onClick={() => { setIsOpen(false); setIsFull(false); }} style={{ padding: 6, borderRadius: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center' }}>
                                <X size={15} />
                            </button>
                        </div>
                    </div>

                    {/* Area Pesan */}
                    <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', backgroundColor: '#fff', scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 transparent' }}>

                        {/* 4 kotak suggestion — hanya tampil saat chat baru */}
                        {isNewChat && !isLoading && !streamingText && (
                            <div style={{ padding: '20px 24px 8px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                    {SUGGESTIONS.map(text => (
                                        <button
                                            key={text}
                                            onClick={() => handleSendMessage(text)}
                                            style={{
                                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                padding: '0 16px', backgroundColor: '#fff',
                                                border: '1px solid #e2e8f0', borderRadius: 10,
                                                fontSize: 13, fontWeight: 500, color: '#334155',
                                                cursor: 'pointer', transition: 'all 0.15s',
                                                minHeight: 52, width: '100%', height: 'auto',
                                                alignItems: 'flex-start', paddingTop: 14, paddingBottom: 14, paddingLeft: 16, paddingRight: 12,
                                            }}
                                            onMouseEnter={e => {
                                                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#f0fdfa';
                                                (e.currentTarget as HTMLButtonElement).style.borderColor = '#5eead4';
                                                (e.currentTarget as HTMLButtonElement).style.color = '#0f766e';
                                            }}
                                            onMouseLeave={e => {
                                                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#fff';
                                                (e.currentTarget as HTMLButtonElement).style.borderColor = '#e2e8f0';
                                                (e.currentTarget as HTMLButtonElement).style.color = '#334155';
                                            }}
                                        >
                                            <span style={{ flex: 1, textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text}</span>
                                            <ChevronRight size={13} style={{ flexShrink: 0, opacity: 0.3 }} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Pesan */}
                        {messages.map((msg, i) => (
                            <div key={msg.id || i}>
                                {i > 0 && <MessageDivider />}
                                {msg.role === 'user' ? (
                                    <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'flex-end' }}>
                                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, maxWidth: '75%' }}>
                                            <div style={{ backgroundColor: '#0d9488', color: '#fff', fontSize: 14, lineHeight: 1.6, padding: '12px 16px', borderRadius: '16px 16px 4px 16px', whiteSpace: 'pre-wrap', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                                                {msg.content}
                                            </div>
                                            <div style={{ width: 28, height: 28, borderRadius: 10, backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginBottom: 2 }}>
                                                <User size={14} color="#64748b" />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ padding: '16px 24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                                            <BotAvatar size={34} />
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                                                    <span style={{ fontSize: 11, fontWeight: 700, color: '#0f766e' }}>KlinikAI</span>
                                                    <span style={{ color: '#cbd5e1' }}>·</span>
                                                    <span style={{ fontSize: 11, color: '#94a3b8' }}>Nauli Dental Care</span>
                                                </div>
                                                <p style={{ fontSize: 14, color: '#334155', lineHeight: 1.6, whiteSpace: 'pre-wrap', margin: '0 0 12px 0' }}>{msg.content}</p>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                                    <button onClick={() => handleReaction(msg.id, true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: 'pointer', backgroundColor: msg.liked === true ? '#f0fdfa' : 'transparent', color: msg.liked === true ? '#0f766e' : '#64748b', border: msg.liked === true ? '1px solid #99f6e4' : '1px solid #e2e8f0' }}>
                                                        <ThumbsUp size={12} style={{ fill: msg.liked === true ? '#0d9488' : 'none' }} /> Jawaban baik
                                                    </button>
                                                    <button onClick={() => handleReaction(msg.id, false)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: 'pointer', backgroundColor: msg.liked === false ? '#fff1f2' : 'transparent', color: msg.liked === false ? '#e11d48' : '#64748b', border: msg.liked === false ? '1px solid #fecdd3' : '1px solid #e2e8f0' }}>
                                                        <ThumbsDown size={12} style={{ fill: msg.liked === false ? '#e11d48' : 'none' }} /> Kurang tepat
                                                    </button>
                                                    <button onClick={() => handleCopy(msg.id, msg.content)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: 'pointer', backgroundColor: 'transparent', color: '#64748b', border: '1px solid #e2e8f0' }}>
                                                        {msg.copied ? <><Check size={12} color="#0d9488" /><span style={{ color: '#0d9488' }}>Tersalin</span></> : <><Copy size={12} /> Salin</>}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Loading — teks bergelombang */}
                        {isLoading && !streamingText && (
                            <>
                                {messages.length > 0 && <div className="h-px bg-slate-50 my-2 mx-6" />}

                                <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: 12 }}>
                                    {/* Ikon Bintang Berputar Warna Hijau */}
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                                        className="text-emerald-500 opacity-70"
                                    >
                                        <Sparkles size={18} />
                                    </motion.div>

                                    {/* Teks dengan Efek Gelombang Hijau */}
                                    <div className="flex items-end gap-1">
                                        <span className="wave-loading-text text-sm tracking-tight">
                                            Gathering sources
                                        </span>

                                        {/* Titik Bouncing Warna Hijau */}
                                        <span className="flex gap-0.5 mb-1 ml-0.5">
                                            <span className="w-0.5 h-0.5 bg-emerald-400 rounded-full animate-bounce"></span>
                                            <span className="w-0.5 h-0.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                            <span className="w-0.5 h-0.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                        </span>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Streaming */}
                        {streamingText && (
                            <>
                                {messages.length > 0 && <MessageDivider />}
                                <div style={{ padding: '16px 24px' }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                                        <BotAvatar size={34} />
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{ fontSize: 11, fontWeight: 700, color: '#0f766e', margin: '0 0 6px 0' }}>KlinikAI</p>
                                            <p style={{ fontSize: 14, color: '#334155', lineHeight: 1.6, whiteSpace: 'pre-wrap', margin: 0 }}>
                                                {streamingText}
                                                <span style={{ display: 'inline-block', width: 4, height: 16, marginLeft: 2, backgroundColor: '#0d9488', borderRadius: 2, verticalAlign: 'middle', animation: 'pulse 1s infinite' }} />
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                        <div style={{ height: 16 }} />
                    </div>

                    {/* Input area */}
                    <div style={{ padding: '12px 20px 16px', borderTop: '1px solid #e2e8f0', backgroundColor: '#fff', flexShrink: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '8px 8px 8px 16px' }}>
                            <input
                                ref={inputRef}
                                type="text" value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                                placeholder={isLoading ? 'Menunggu jawaban...' : 'Tanyakan sesuatu...'}
                                disabled={isLoading || !!streamingText}
                                style={{ flex: 1, fontSize: 14, color: '#334155', backgroundColor: 'transparent', border: 'none', outline: 'none', padding: '4px 0' }}
                            />
                            {/* Tombol kirim / loading box */}
                            {isLoading || !!streamingText ? (
                                <div style={{
                                    width: 36, height: 36, borderRadius: 10,
                                    backgroundColor: '#059669',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0,
                                }}>
                                    <div style={{
                                        width: 14, height: 14,
                                        backgroundColor: 'white',
                                        borderRadius: 3,
                                        animation: 'pulse 1.2s ease-in-out infinite',
                                    }} />
                                </div>
                            ) : (
                                <button
                                    onClick={() => handleSendMessage()}
                                    disabled={!input.trim()}
                                    style={{
                                        width: 36, height: 36, borderRadius: 10,
                                        backgroundColor: input.trim() ? '#059669' : '#e2e8f0',
                                        color: '#fff', border: 'none', cursor: input.trim() ? 'pointer' : 'default',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        flexShrink: 0, transition: 'all 0.15s',
                                    }}
                                >
                                    <ArrowUp size={16} strokeWidth={2.5} />
                                </button>
                            )}
                        </div>

                        {/* Footer */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <ClinicLogo size={14} />
                                <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 500 }}>Nauli Dental Care</span>
                            </div>
                            <span style={{ fontSize: 10, color: '#94a3b8' }}>KlinikAI dapat membuat kesalahan. Verifikasi info penting.</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}