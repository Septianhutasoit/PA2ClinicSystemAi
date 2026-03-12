'use client';
import { useState, useEffect, useRef } from 'react';
import api from '@/services/api';
import {
    MessageCircle, Send, X, Bot, User, Sparkles,
    Maximize2, Minimize2, Trash2, ChevronRight
} from 'lucide-react';

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [isFull, setIsFull] = useState(false);
    const [messages, setMessages] = useState<{ role: string; content: string }[]>([
        {
            role: 'bot',
            content: 'Horas! Selamat datang di Nauli Dental Care Balige. Saya KlinikAIChatbot, asisten cerdas Anda. Ada yang bisa saya bantu hari ini?'
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [streamingText, setStreamingText] = useState(''); // Untuk efek mengetik
    const scrollRef = useRef<HTMLDivElement>(null);

    // 1. AUTO SCROLL LEMBUT KE BAWAH
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages, streamingText, isLoading]);

    // 2. EFEK MENGETIK (Typewriter Effect)
    const simulateStreaming = (fullText: string) => {
        let currentText = "";
        let index = 0;
        const interval = setInterval(() => {
            if (index < fullText.length) {
                currentText += fullText[index];
                setStreamingText(currentText);
                index++;
            } else {
                clearInterval(interval);
                setMessages((prev) => [...prev, { role: 'bot', content: fullText }]);
                setStreamingText('');
            }
        }, 15); // Kecepatan mengetik (semakin kecil semakin cepat)
    };

    const handleSendMessage = async (text: string = input) => {
        const msg = text.trim();
        if (!msg) return;

        const userMessage = { role: 'user', content: msg };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await api.post('/chatbot/chat', {
                message: msg,
                history: messages.slice(-6)
            });

            setIsLoading(false);
            // Jalankan efek mengetik daripada langsung muncul
            simulateStreaming(response.data.reply);

        } catch (error) {
            setIsLoading(false);
            setMessages((prev) => [...prev, { role: 'bot', content: 'Mohon Maaf, Saya sedang mengalami gangguan koneksi saya pada jaringan. Coba sapa lagi ya.' }]);
        }
    };

    const suggestions = [
        "Jadwal Dokter",
        "Lokasi Klinik",
        "Biaya Scaling",
        "Langkah Pendaftaran",
        "Informasi Layanan"
    ];

    if (!isOpen) return (
        <button
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 p-4 bg-blue-600 text-white rounded-2xl shadow-2xl hover:scale-110 transition-all z-[999] flex items-center gap-3 font-bold group"
        >
            <div className="relative">
                <MessageCircle size={24} />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-blue-600 animate-ping"></span>
            </div>
            <span>Tanya KlinikAI</span>
        </button>
    );

    return (
        <div className={`fixed transition-all duration-500 z-[999] flex flex-col bg-white shadow-2xl border border-slate-200 overflow-hidden
            ${isFull
                ? "inset-0 w-full h-full rounded-0"
                : "bottom-6 right-6 w-[95vw] md:w-[450px] h-[650px] rounded-[2.5rem]"
            }`}>

            {/* HEADER MODERN */}
            <div className="bg-slate-900 p-6 text-white flex justify-between items-center shadow-lg">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <Bot size={28} className="text-white" />
                    </div>
                    <div>
                        <h3 className="font-black text-lg tracking-tight leading-none uppercase">KlinikChatbotAI <span className="text-blue-500 text-xs ml-1">v2.0</span></h3>
                        <div className="flex items-center gap-1.5 mt-1.5">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Assistant ChabotAi</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={() => setIsFull(!isFull)} className="p-2 hover:bg-white/10 rounded-xl transition text-slate-400">
                        {isFull ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                    </button>
                    <button onClick={() => { setIsOpen(false); setIsFull(false); }} className="p-2 hover:bg-red-500/20 rounded-xl transition text-red-400">
                        <X size={24} />
                    </button>
                </div>
            </div>

            {/* AREA CHAT */}
            <div ref={scrollRef} className={`flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 scroll-smooth ${isFull ? "max-w-5xl mx-auto w-full px-10" : ""}`}>
                {messages.map((msg, i) => (
                    <div key={i} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'bot' && (
                            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-1 shadow-md">
                                <Bot size={16} />
                            </div>
                        )}
                        <div className={`max-w-[85%] p-4 rounded-3xl text-sm font-medium leading-relaxed whitespace-pre-wrap
                            ${msg.role === 'user'
                                ? "bg-slate-800 text-white rounded-br-none shadow-xl"
                                : "bg-white text-slate-700 border border-slate-200 rounded-bl-none shadow-sm"
                            }`}>
                            {msg.content}
                        </div>
                    </div>
                ))}

                {/* EFEK MENGETIK RUNNING */}
                {streamingText && (
                    <div className="flex items-end gap-2 justify-start animate-in fade-in duration-300">
                        <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-1 shadow-md">
                            <Bot size={16} />
                        </div>
                        <div className="max-w-[85%] p-4 rounded-3xl rounded-bl-none text-sm font-medium leading-relaxed bg-white text-slate-700 border border-slate-200 shadow-sm whitespace-pre-wrap">
                            {streamingText}
                            <span className="inline-block w-2 h-4 ml-1 bg-blue-600 animate-pulse align-middle"></span>
                        </div>
                    </div>
                )}

                {isLoading && (
                    <div className="flex items-center gap-3">
                        <div className="bg-white border border-slate-100 px-5 py-4 rounded-3xl rounded-bl-none shadow-sm flex gap-1.5">
                            <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                            <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                        </div>
                    </div>
                )}
            </div>

            {/* FOOTER & INPUT */}
            <div className={`p-6 bg-white border-t border-slate-100 ${isFull ? "pb-10" : ""}`}>
                <div className={`max-w-5xl mx-auto w-full space-y-4`}>

                    {/* SUGGESTION CHIPS */}
                    {!isLoading && !streamingText && (
                        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                            {suggestions.map((text) => (
                                <button
                                    key={text}
                                    onClick={() => handleSendMessage(text)}
                                    className="flex items-center gap-1.5 whitespace-nowrap px-4 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-full hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm"
                                >
                                    {text} <ChevronRight size={12} />
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="relative flex items-center">
                        <div className="absolute left-4 text-blue-600">
                            <Sparkles size={20} />
                        </div>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Tanyakan jadwal dokter atau layanan..."
                            className="w-full pl-12 pr-16 py-5 bg-slate-100 border-none rounded-[2rem] text-sm focus:ring-2 focus:ring-blue-600 outline-none transition text-slate-800 font-semibold"
                        />
                        <button
                            onClick={() => handleSendMessage()}
                            disabled={isLoading || !!streamingText}
                            className="absolute right-2 p-3.5 bg-blue-600 text-white rounded-full hover:bg-slate-800 transition-all shadow-lg hover:rotate-12 active:scale-90 disabled:bg-slate-300"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}