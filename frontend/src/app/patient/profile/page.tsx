'use client';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Mail, Phone, MapPin, Shield,
    Edit3, Save, X, LogOut, Loader2, CheckCircle,
    AlertCircle, Calendar, Users,
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import Cookies from 'js-cookie';

/* ═══ types ═══════════════════════════════════ */
interface UserData {
    full_name: string; email: string; phone: string;
    address: string; gender: string; birth_date: string;
}
type FE = Partial<Record<keyof UserData, string>>;

/* ═══ constants ════════════════════════════════ */
const ITEMS = [
    { key: 'email', label: 'Setup akun', pct: 15, icon: CheckCircle },
    { key: 'full_name', label: 'Nama lengkap', pct: 20, icon: User },
    { key: 'phone', label: 'Nomor telepon', pct: 20, icon: Phone },
    { key: 'address', label: 'Alamat', pct: 20, icon: MapPin },
    { key: 'birth_date', label: 'Tanggal lahir', pct: 15, icon: Calendar },
    { key: 'gender', label: 'Jenis kelamin', pct: 10, icon: Users },
];

const EMPTY: UserData = { full_name: '', email: '', phone: '', address: '', gender: 'Laki-laki', birth_date: '' };

/* ═══ pure helpers ═════════════════════════════ */
const initials = (n: string) => (n || '??').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

const pct = (u: UserData) =>
    ITEMS.reduce((s, i) => { const v = u[i.key as keyof UserData]; return s + (v?.trim() && v !== 'Belum diisi' ? i.pct : 0); }, 0);

const validate = (f: keyof UserData, v: string): string => {
    if (f === 'full_name') {
        if (!v.trim()) return 'Nama tidak boleh kosong.';
        if (/\d/.test(v)) return 'Nama tidak boleh mengandung angka.';
        if (v.trim().length < 2) return 'Nama terlalu pendek.';
    }
    if (f === 'phone' && v.trim() && !/^\+?[0-9\s\-()]{7,15}$/.test(v))
        return 'Nomor tidak valid (7–15 digit).';
    if (f === 'address' && v.length > 200)
        return 'Maks 200 karakter.';
    if (f === 'birth_date' && v && new Date(v) > new Date())
        return 'Tanggal tidak valid.';
    return '';
};

/* ═══ reusable field ═══════════════════════════ */
function Field({ label, icon: Icon, editing, error, children, value }: {
    label: string; icon: any; editing: boolean;
    error?: string; value?: string; children?: React.ReactNode;
}) {
    return (
        <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-1.5 mb-2">
                <Icon size={11} /> {label}
            </label>
            {editing
                ? <>{children}{error && <p className="flex items-center gap-1 mt-1.5 text-[10px] text-red-500 font-semibold"><AlertCircle size={10} />{error}</p>}</>
                : <p className="text-sm font-semibold text-slate-700 py-1">{value || <span className="text-slate-300 italic">Belum diisi</span>}</p>}
        </div>
    );
}

const inputCls = (err?: string) =>
    `w-full px-4 py-2.5 bg-slate-50 border rounded-xl outline-none text-sm font-medium text-slate-700 transition-all focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400 ${err ? 'border-red-300 bg-red-50' : 'border-slate-200 hover:border-emerald-300'}`;

/* ═══ page ══════════════════════════════════════ */
export default function ProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(false);
    const [saved, setSaved] = useState(false);
    const [errors, setErrors] = useState<FE>({});
    const [user, setUser] = useState<UserData>(EMPTY);
    const [draft, setDraft] = useState<UserData>(EMPTY);

    /* fetch */
    useEffect(() => {
        api.get('/auth/me').then(r => {
            const d = r.data;
            const u: UserData = {
                full_name: d.full_name || '',
                email: d.email || '',
                phone: d.phone || '',
                address: d.address || '',
                gender: d.gender || 'Laki-laki',
                birth_date: d.birth_date ? d.birth_date.split('T')[0] : '',
            };
            setUser(u); setDraft(u);
        }).catch(() => router.push('/login'))
            .finally(() => setLoading(false));
    }, [router]);

    /* field change */
    const onChange = useCallback((f: keyof UserData, v: string) => {
        setDraft(p => ({ ...p, [f]: v }));
        setErrors(p => ({ ...p, [f]: validate(f, v) }));
    }, []);

    /* save */
    const save = async () => {
        const errs: FE = {};
        (['full_name', 'phone', 'address', 'birth_date'] as (keyof UserData)[])
            .forEach(f => { const e = validate(f, draft[f] || ''); if (e) errs[f] = e; });
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setSaving(true);
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
            setEditing(false); setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch { alert('Gagal memperbarui profil.'); }
        finally { setSaving(false); }
    };

    const logout = () => { localStorage.clear(); Cookies.remove('token'); router.push('/login'); };
    const completion = pct(user);
    const r = 44, circ = 2 * Math.PI * r, dash = (completion / 100) * circ;

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <Loader2 className="animate-spin text-emerald-500" size={32} />
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 pb-24">

            {/* ── HEADER ─────────────────────────── */}
            <div className="bg-white border-b border-slate-100 shadow-sm">
                <div className="max-w-5xl mx-auto px-6 pt-8 pb-7">

                    {/* Breadcrumb */}
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">
                        Beranda <span className="mx-1.5 text-slate-200">/</span> Profil Saya
                    </p>

                    <div className="flex flex-col sm:flex-row items-start gap-6">
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-200/60">
                                <span className="text-white font-black text-2xl">{initials(user.full_name)}</span>
                            </div>
                            <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-white rounded-lg flex items-center justify-center shadow border border-slate-100">
                                <CheckCircle size={12} className="text-emerald-500" />
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
                                    <CheckCircle size={9} /> Pasien Terverifikasi
                                </span>
                                <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
                                    ✦ Member Gold
                                </span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none mb-1.5">
                                {user.full_name || 'Pengguna Baru'}
                            </h1>
                            <p className="text-slate-400 text-sm">{user.email}</p>
                        </div>

                        {/* Donut mini — desktop */}
                        <div className="hidden sm:flex flex-shrink-0 items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5">
                            <div className="relative w-11 h-11">
                                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                                    <circle cx="18" cy="18" r="15" fill="none" stroke="#e2e8f0" strokeWidth="3.5" />
                                    <circle cx="18" cy="18" r="15" fill="none" stroke="#10b981" strokeWidth="3.5"
                                        strokeDasharray={`${(completion / 100) * (2 * Math.PI * 15)} ${2 * Math.PI * 15}`}
                                        strokeLinecap="round" style={{ transition: 'stroke-dasharray 0.6s ease' }} />
                                </svg>
                                <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-slate-700">{completion}%</span>
                            </div>
                            <div>
                                <p className="text-xs font-black text-slate-800">Profil</p>
                                <p className="text-[10px] text-slate-400 mt-0.5">Kelengkapan</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── BODY ───────────────────────────── */}
            <div className="max-w-5xl mx-auto px-6 pt-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                    {/* LEFT — form */}
                    <div className="lg:col-span-2 space-y-4">

                        {/* Toast */}
                        <AnimatePresence>
                            {saved && (
                                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                    className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-3">
                                    <CheckCircle size={15} className="text-emerald-500" />
                                    <span className="text-sm font-bold text-emerald-700">Profil berhasil diperbarui!</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Card */}
                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">

                            {/* Card header */}
                            <div className="px-7 py-5 border-b border-slate-50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                                        <User size={15} className="text-emerald-600" />
                                    </div>
                                    <h2 className="font-black text-sm text-slate-800 uppercase tracking-wide">Informasi Personal</h2>
                                </div>

                                {editing ? (
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => { setDraft({ ...user }); setErrors({}); setEditing(false); }}
                                            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-all flex items-center gap-1.5">
                                            <X size={12} /> Batal
                                        </button>
                                        <button onClick={save} disabled={saving}
                                            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20 disabled:opacity-60">
                                            {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />} Simpan
                                        </button>
                                    </div>
                                ) : (
                                    <button onClick={() => { setDraft({ ...user }); setErrors({}); setEditing(true); }}
                                        className="px-5 py-2 rounded-xl text-xs font-black text-slate-600 uppercase tracking-wider bg-slate-50 hover:bg-emerald-50 hover:text-emerald-600 border border-slate-100 hover:border-emerald-200 transition-all flex items-center gap-1.5">
                                        <Edit3 size={12} /> Edit
                                    </button>
                                )}
                            </div>

                            {/* Fields grid */}
                            <div className="p-7 grid grid-cols-1 md:grid-cols-2 gap-6">

                                {/* Name */}
                                <Field label="Nama Lengkap" icon={User} editing={editing} error={errors.full_name} value={user.full_name}>
                                    <input value={draft.full_name} onChange={e => onChange('full_name', e.target.value)}
                                        className={inputCls(errors.full_name)} placeholder="Nama lengkap Anda" />
                                </Field>

                                {/* Email — read only */}
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-1.5 mb-2">
                                        <Mail size={11} /> Email
                                    </label>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <p className="text-sm font-semibold text-slate-500">{user.email}</p>
                                        <span className="text-[9px] bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full font-bold uppercase">Tidak dapat diubah</span>
                                    </div>
                                </div>

                                {/* Phone */}
                                <Field label="Nomor Telepon" icon={Phone} editing={editing} error={errors.phone} value={user.phone}>
                                    <input type="tel" inputMode="numeric" value={draft.phone}
                                        onChange={e => onChange('phone', e.target.value.replace(/[^0-9+\-\s()]/g, ''))}
                                        placeholder="contoh: 08123456789" className={inputCls(errors.phone)} />
                                </Field>

                                {/* Gender */}
                                <Field label="Jenis Kelamin" icon={Users} editing={editing} value={user.gender}>
                                    <select value={draft.gender} onChange={e => onChange('gender', e.target.value)} className={inputCls()}>
                                        <option value="Laki-laki">Laki-laki</option>
                                        <option value="Perempuan">Perempuan</option>
                                    </select>
                                </Field>

                                {/* Birth date */}
                                <Field label="Tanggal Lahir" icon={Calendar} editing={editing} error={errors.birth_date} value={user.birth_date}>
                                    <input type="date" value={draft.birth_date} onChange={e => onChange('birth_date', e.target.value)} className={inputCls(errors.birth_date)} />
                                </Field>

                                {/* Address */}
                                <div className="md:col-span-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-1.5 mb-2">
                                        <MapPin size={11} /> Alamat Tinggal
                                    </label>
                                    {editing ? (
                                        <div>
                                            <textarea rows={2} value={draft.address}
                                                onChange={e => onChange('address', e.target.value)}
                                                placeholder="Masukkan alamat lengkap..."
                                                className={inputCls(errors.address) + ' resize-none'} />
                                            <div className="flex items-center justify-between mt-1">
                                                {errors.address
                                                    ? <p className="flex items-center gap-1 text-[10px] text-red-500 font-semibold"><AlertCircle size={10} />{errors.address}</p>
                                                    : <span />}
                                                <span className={`text-[10px] ${draft.address.length > 180 ? 'text-red-400' : 'text-slate-300'}`}>{draft.address.length}/200</span>
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

                    {/* RIGHT — sidebar */}
                    <div className="space-y-5">

                        {/* Completion card */}
                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
                            className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
                            <h3 className="font-black text-sm text-slate-800 uppercase tracking-wide mb-5">Kelengkapan Profil</h3>

                            {/* Donut */}
                            <div className="flex justify-center mb-5">
                                <div className="relative w-28 h-28">
                                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                                        <circle cx="50" cy="50" r={r} fill="none" stroke="#f1f5f9" strokeWidth="10" />
                                        <circle cx="50" cy="50" r={r} fill="none" stroke="#10b981" strokeWidth="10"
                                            strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
                                            style={{ transition: 'stroke-dasharray 0.6s ease' }} />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-2xl font-black text-slate-800">{completion}%</span>
                                        <span className="text-[9px] text-slate-400 font-bold uppercase">Lengkap</span>
                                    </div>
                                </div>
                            </div>

                            {/* Checklist */}
                            <div className="space-y-2.5">
                                {ITEMS.map(({ key, label, pct: p }) => {
                                    const v = user[key as keyof UserData];
                                    const ok = !!(v?.trim() && v !== 'Belum diisi');
                                    return (
                                        <div key={key} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                {ok
                                                    ? <CheckCircle size={12} className="text-emerald-500 flex-shrink-0" />
                                                    : <X size={12} className="text-slate-300 flex-shrink-0" />}
                                                <span className={`text-xs font-semibold ${ok ? 'text-slate-600' : 'text-slate-400'}`}>{label}</span>
                                            </div>
                                            <span className={`text-[10px] font-black ${ok ? 'text-emerald-500' : 'text-slate-300'}`}>
                                                {ok ? `${p}%` : `+${p}%`}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>

                                <button onClick={logout}
                                    className="w-full py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 font-black text-[11px] uppercase tracking-wider hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2">
                                    <LogOut size={14} /> Keluar
                                </button>
                            </div>
                        
                    </div>

                </div>
            </div>
    );
}