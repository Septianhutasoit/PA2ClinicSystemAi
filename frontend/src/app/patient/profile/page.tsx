'use client';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Mail, Phone, MapPin, Shield,
    Edit3, Save, X, Activity, LogOut,
    Lock, Loader2, CheckCircle, AlertCircle,
    Calendar, Users
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import Cookies from 'js-cookie';

/* ─── types ─────────────────────────────────── */
interface UserData {
    full_name: string;
    email: string;
    phone: string;
    address: string;
    gender: string;
    birth_date: string;
}

interface FieldErrors {
    full_name?: string;
    phone?: string;
    address?: string;
    birth_date?: string;
}

/* ─── completion config ──────────────────────── */
const COMPLETION_ITEMS = [
    { key: 'email', label: 'Setup akun', pct: 15, icon: CheckCircle },
    { key: 'full_name', label: 'Nama lengkap', pct: 20, icon: User },
    { key: 'phone', label: 'Nomor telepon', pct: 20, icon: Phone },
    { key: 'address', label: 'Alamat', pct: 20, icon: MapPin },
    { key: 'birth_date', label: 'Tanggal lahir', pct: 15, icon: Calendar },
    { key: 'gender', label: 'Jenis kelamin', pct: 10, icon: Users },
];

/* ─── helpers ────────────────────────────────── */
const getInitials = (name: string) =>
    (name || '??').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

const calcCompletion = (u: UserData) =>
    COMPLETION_ITEMS.reduce((acc, item) => {
        const val = u[item.key as keyof UserData];
        return acc + (val && val.trim() !== '' && val !== 'Belum diisi' ? item.pct : 0);
    }, 0);

/* ─── validation ─────────────────────────────── */
const validate = (field: keyof UserData, value: string): string => {
    switch (field) {
        case 'full_name':
            if (!value.trim()) return 'Nama tidak boleh kosong.';
            if (/\d/.test(value)) return 'Nama tidak boleh mengandung angka.';
            if (value.trim().length < 2) return 'Nama terlalu pendek.';
            return '';
        case 'phone':
            if (!value.trim()) return '';
            if (!/^\+?[0-9\s\-()]{7,15}$/.test(value))
                return 'Nomor tidak valid. Gunakan angka saja (7–15 digit).';
            return '';
        case 'address':
            if (value.length > 200) return 'Alamat terlalu panjang (maks 200 karakter).';
            return '';
        case 'birth_date':
            if (!value) return '';
            if (new Date(value) > new Date()) return 'Tanggal lahir tidak valid.';
            return '';
        default:
            return '';
    }
};

/* ─── field input component ──────────────────── */
function FieldInput({
    label, value, name, type = 'text',
    isEditing, error, icon: Icon,
    onChange,
    children,
}: {
    label: string; value: string; name: keyof UserData;
    type?: string; isEditing: boolean; error?: string;
    icon: any; onChange: (n: keyof UserData, v: string) => void;
    children?: React.ReactNode;
}) {
    return (
        <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-1.5 mb-2">
                <Icon size={11} className="text-slate-400" />
                {label}
            </label>
            {isEditing ? (
                children ? children : (
                    <div className="relative">
                        <input
                            type={type}
                            value={value}
                            onChange={e => onChange(name, e.target.value)}
                            className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl outline-none text-sm font-medium text-slate-700 transition-all
                                focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400
                                ${error ? 'border-red-300 bg-red-50' : 'border-slate-200 hover:border-emerald-300'}`}
                        />
                        {error && (
                            <p className="flex items-center gap-1 mt-1.5 text-[10px] text-red-500 font-semibold">
                                <AlertCircle size={10} /> {error}
                            </p>
                        )}
                    </div>
                )
            ) : (
                <p className="text-sm font-semibold text-slate-700 py-1">
                    {value || <span className="text-slate-300 italic">Belum diisi</span>}
                </p>
            )}
        </div>
    );
}

/* ─── main page ──────────────────────────────── */
export default function ProfilePage() {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [saved, setSaved] = useState(false);
    const [errors, setErrors] = useState<FieldErrors>({});

    const [user, setUser] = useState<UserData>({
        full_name: '', email: '', phone: '',
        address: '', gender: 'Laki-laki', birth_date: '',
    });
    const [draft, setDraft] = useState<UserData>({ ...user });

    /* fetch */
    useEffect(() => {
        (async () => {
            try {
                const res = await api.get('/auth/me');
                const d = res.data;
                const loaded: UserData = {
                    full_name: d.full_name || '',
                    email: d.email || '',
                    phone: d.phone || '',
                    address: d.address || '',
                    gender: d.gender || 'Laki-laki',
                    birth_date: d.birth_date ? d.birth_date.split('T')[0] : '',
                };
                setUser(loaded);
                setDraft(loaded);
            } catch {
                router.push('/login');
            } finally {
                setIsLoading(false);
            }
        })();
    }, [router]);

    /* live validate on change */
    const handleChange = useCallback((field: keyof UserData, value: string) => {
        setDraft(prev => ({ ...prev, [field]: value }));
        const err = validate(field, value);
        setErrors(prev => ({ ...prev, [field]: err }));
    }, []);

    /* start editing */
    const startEdit = () => {
        setDraft({ ...user });
        setErrors({});
        setIsEditing(true);
    };

    /* cancel */
    const cancelEdit = () => {
        setDraft({ ...user });
        setErrors({});
        setIsEditing(false);
    };

    /* save */
    const handleSave = async () => {
        // run all validations
        const newErrors: FieldErrors = {};
        (['full_name', 'phone', 'address', 'birth_date'] as (keyof FieldErrors)[])
            .forEach(f => {
                const e = validate(f, draft[f] || '');
                if (e) newErrors[f] = e;
            });
        if (Object.keys(newErrors).length) {
            setErrors(newErrors);
            return;
        }

        setSubmitLoading(true);
        try {
            await api.patch('/auth/update-me', {
                full_name: draft.full_name.trim(),
                phone: draft.phone.trim(),
                address: draft.address.trim(),
                gender: draft.gender,
                birth_date: draft.birth_date || null,
            });
            setUser({ ...draft });
            localStorage.setItem('user_name', draft.full_name.trim());
            setIsEditing(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch {
            alert('Gagal memperbarui profil. Silakan coba lagi.');
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        Cookies.remove('token');
        router.push('/login');
    };

    const completion = calcCompletion(user);

    /* donut svg */
    const r = 44, circ = 2 * Math.PI * r;
    const dash = (completion / 100) * circ;

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <Loader2 className="animate-spin text-emerald-600" size={36} />
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 pb-24">

            {/* ── HERO HEADER ─────────────────────── */}
            <div className="relative bg-[#064e3b] pt-12 pb-24 px-6 overflow-hidden">
                <div className="absolute inset-0 opacity-[0.06]"
                    style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)', backgroundSize: '28px 28px' }} />
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-50 to-transparent" />

                <div className="max-w-5xl mx-auto relative z-10">
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                            <div className="w-24 h-24 rounded-[1.5rem] bg-white flex items-center justify-center shadow-2xl border-4 border-white/20">
                                <span className="text-[#064e3b] font-black text-3xl">{getInitials(user.full_name)}</span>
                            </div>
                            <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-emerald-500 rounded-xl flex items-center justify-center ring-4 ring-[#064e3b]">
                                <CheckCircle size={14} className="text-white" />
                            </div>
                        </div>
                        {/* Info */}
                        <div className="text-center md:text-left pb-1">
                            <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-1.5">Pasien Terverifikasi</p>
                            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter leading-none mb-3">
                                {user.full_name || 'Pengguna Baru'}
                            </h1>
                            <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold text-white border border-white/10 uppercase tracking-wider">
                                    Member Gold
                                </span>
                                <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold text-white/70 border border-white/10">
                                    {user.email}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── MAIN CONTENT ───────────────────── */}
            <div className="max-w-5xl mx-auto px-6 -mt-6 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                    {/* ── LEFT: PERSONAL INFO ── */}
                    <div className="lg:col-span-2 space-y-5">

                        {/* Save success toast */}
                        <AnimatePresence>
                            {saved && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                    className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-3"
                                >
                                    <CheckCircle size={16} className="text-emerald-500" />
                                    <span className="text-sm font-bold text-emerald-700">Profil berhasil diperbarui!</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Personal Info Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden"
                        >
                            {/* Card header */}
                            <div className="px-7 py-5 border-b border-slate-50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                                        <User size={16} className="text-emerald-600" />
                                    </div>
                                    <h2 className="font-black text-sm text-slate-800 uppercase tracking-wide">Informasi Personal</h2>
                                </div>
                                {isEditing ? (
                                    <div className="flex items-center gap-2">
                                        <button onClick={cancelEdit}
                                            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-all flex items-center gap-1.5">
                                            <X size={13} /> Batal
                                        </button>
                                        <button onClick={handleSave} disabled={submitLoading}
                                            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20 disabled:opacity-60">
                                            {submitLoading ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                                            Simpan
                                        </button>
                                    </div>
                                ) : (
                                    <button onClick={startEdit}
                                        className="px-5 py-2 rounded-xl text-xs font-black text-slate-600 uppercase tracking-wider bg-slate-50 hover:bg-emerald-50 hover:text-emerald-600 border border-slate-100 hover:border-emerald-200 transition-all flex items-center gap-1.5">
                                        <Edit3 size={13} /> Edit
                                    </button>
                                )}
                            </div>

                            {/* Fields */}
                            <div className="p-7 grid grid-cols-1 md:grid-cols-2 gap-6">

                                {/* Full name */}
                                <FieldInput label="Nama Lengkap" name="full_name" value={isEditing ? draft.full_name : user.full_name}
                                    isEditing={isEditing} error={errors.full_name} icon={User} onChange={handleChange} />

                                {/* Email — always read-only */}
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-1.5 mb-2">
                                        <Mail size={11} /> Email
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-semibold text-slate-500">{user.email}</p>
                                        <span className="text-[9px] bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full font-bold uppercase">Tidak dapat diubah</span>
                                    </div>
                                </div>

                                {/* Phone */}
                                <FieldInput label="Nomor Telepon" name="phone" value={isEditing ? draft.phone : user.phone}
                                    isEditing={isEditing} error={errors.phone} icon={Phone} onChange={handleChange}>
                                    {isEditing && (
                                        <div>
                                            <input
                                                type="tel"
                                                value={draft.phone}
                                                inputMode="numeric"
                                                onChange={e => {
                                                    // allow only digits, +, -, space, ()
                                                    const v = e.target.value.replace(/[^0-9+\-\s()]/g, '');
                                                    handleChange('phone', v);
                                                }}
                                                placeholder="contoh: 08123456789"
                                                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl outline-none text-sm font-medium text-slate-700 transition-all
                                                    focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400
                                                    ${errors.phone ? 'border-red-300 bg-red-50' : 'border-slate-200 hover:border-emerald-300'}`}
                                            />
                                            {errors.phone && (
                                                <p className="flex items-center gap-1 mt-1.5 text-[10px] text-red-500 font-semibold">
                                                    <AlertCircle size={10} /> {errors.phone}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </FieldInput>

                                {/* Gender */}
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-1.5 mb-2">
                                        <Users size={11} /> Jenis Kelamin
                                    </label>
                                    {isEditing ? (
                                        <select value={draft.gender} onChange={e => handleChange('gender', e.target.value)}
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 hover:border-emerald-300 rounded-xl outline-none text-sm font-medium text-slate-700 focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400 transition-all">
                                            <option value="Laki-laki">Laki-laki</option>
                                            <option value="Perempuan">Perempuan</option>
                                        </select>
                                    ) : (
                                        <p className="text-sm font-semibold text-slate-700 py-1">
                                            {user.gender || <span className="text-slate-300 italic">Belum diisi</span>}
                                        </p>
                                    )}
                                </div>

                                {/* Birth date */}
                                <FieldInput label="Tanggal Lahir" name="birth_date" type="date"
                                    value={isEditing ? draft.birth_date : user.birth_date}
                                    isEditing={isEditing} error={errors.birth_date} icon={Calendar} onChange={handleChange} />

                                {/* Address — full width */}
                                <div className="md:col-span-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-1.5 mb-2">
                                        <MapPin size={11} /> Alamat Tinggal
                                    </label>
                                    {isEditing ? (
                                        <div>
                                            <textarea rows={2} value={draft.address}
                                                onChange={e => handleChange('address', e.target.value)}
                                                placeholder="Masukkan alamat lengkap..."
                                                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl outline-none text-sm font-medium text-slate-700 resize-none transition-all
                                                    focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400
                                                    ${errors.address ? 'border-red-300 bg-red-50' : 'border-slate-200 hover:border-emerald-300'}`}
                                            />
                                            <div className="flex items-center justify-between mt-1">
                                                {errors.address
                                                    ? <p className="flex items-center gap-1 text-[10px] text-red-500 font-semibold"><AlertCircle size={10} /> {errors.address}</p>
                                                    : <span />}
                                                <span className={`text-[10px] ${draft.address.length > 180 ? 'text-red-400' : 'text-slate-300'}`}>
                                                    {draft.address.length}/200
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-sm font-semibold text-slate-700 py-1">
                                            {user.address || <span className="text-slate-300 italic">Belum diisi</span>}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* ── RIGHT COLUMN ── */}
                    <div className="space-y-5">

                        {/* Profile Completion Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6"
                        >
                            <h3 className="font-black text-sm text-slate-800 uppercase tracking-wide mb-5">Kelengkapan Profil</h3>

                            {/* Donut chart */}
                            <div className="flex justify-center mb-5">
                                <div className="relative w-28 h-28">
                                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                                        <circle cx="50" cy="50" r={r} fill="none" stroke="#f1f5f9" strokeWidth="10" />
                                        <circle cx="50" cy="50" r={r} fill="none" stroke="#10b981" strokeWidth="10"
                                            strokeDasharray={`${dash} ${circ}`}
                                            strokeLinecap="round"
                                            style={{ transition: 'stroke-dasharray 0.6s ease' }}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-2xl font-black text-slate-800">{completion}%</span>
                                        <span className="text-[9px] text-slate-400 font-bold uppercase">Lengkap</span>
                                    </div>
                                </div>
                            </div>

                            {/* Checklist */}
                            <div className="space-y-2.5">
                                {COMPLETION_ITEMS.map(({ key, label, pct, icon: Icon }) => {
                                    const val = user[key as keyof UserData];
                                    const done = !!(val && val.trim() !== '' && val !== 'Belum diisi');
                                    return (
                                        <div key={key} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                {done
                                                    ? <CheckCircle size={13} className="text-emerald-500 flex-shrink-0" />
                                                    : <X size={13} className="text-slate-300 flex-shrink-0" />}
                                                <span className={`text-xs font-semibold ${done ? 'text-slate-600' : 'text-slate-400'}`}>{label}</span>
                                            </div>
                                            <span className={`text-[10px] font-black ${done ? 'text-emerald-500' : 'text-slate-300'}`}>
                                                {done ? `${pct}%` : `+${pct}%`}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>

                        {/* Security card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="bg-[#0A1C14] rounded-[2rem] p-6 text-white relative overflow-hidden"
                        >
                            <div className="absolute -bottom-8 -right-8 w-28 h-28 bg-emerald-500/15 rounded-full blur-2xl" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                                        <Shield size={16} className="text-emerald-400" />
                                    </div>
                                    <h3 className="font-black text-sm uppercase tracking-wide">Keamanan Akun</h3>
                                </div>

                                <div className="space-y-4">
                                    <button className="w-full flex items-center justify-between group px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/8 hover:border-white/20 transition-all">
                                        <div className="flex items-center gap-2.5">
                                            <Lock size={14} className="text-emerald-400" />
                                            <span className="text-xs font-bold text-white/70">Ganti Kata Sandi</span>
                                        </div>
                                        <span className="text-white/30 group-hover:text-white/60 text-sm transition-colors">›</span>
                                    </button>

                                    <div className="h-px bg-white/5" />

                                    {/* Status */}
                                    <div className="flex items-center justify-between px-1">
                                        <div className="flex items-center gap-2">
                                            <Activity size={13} className="text-emerald-400" />
                                            <span className="text-xs text-white/50 font-medium">Status Sistem</span>
                                        </div>
                                        <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-400 uppercase">
                                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                                            Online
                                        </span>
                                    </div>

                                    <div className="h-px bg-white/5" />

                                    <button onClick={handleLogout}
                                        className="w-full py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 font-black text-[11px] uppercase tracking-wider hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2">
                                        <LogOut size={14} /> Keluar Portal
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}