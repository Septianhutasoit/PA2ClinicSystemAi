'use client';
import { motion } from 'framer-motion';
import {
    User, Mail, Phone, MapPin, Calendar, Shield,
    Edit3, Save, X, Heart, Activity, Clock,
    CheckCircle, Star, FileText, Award, TrendingUp
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        birthdate: '',
        gender: '',
        bloodType: '',
        allergies: '',
    });

    useEffect(() => {
        const savedName = localStorage.getItem('user_name') || 'Septian Adi';
        const savedEmail = localStorage.getItem('user_email') || 'septian@email.com';
        setProfile({
            name: savedName,
            email: savedEmail,
            phone: '081234567890',
            address: 'Jl. Sisingamangaraja No. 10, Balige',
            birthdate: '1998-05-15',
            gender: 'Laki-laki',
            bloodType: 'O+',
            allergies: 'Tidak ada',
        });
    }, []);

    const handleSave = () => {
        localStorage.setItem('user_name', profile.name);
        localStorage.setItem('user_email', profile.email);
        setIsEditing(false);
    };

    const stats = [
        { icon: <Calendar size={22} />, label: 'Total Kunjungan', value: '12', color: 'from-blue-500 to-indigo-600', bg: 'bg-blue-50' },
        { icon: <Heart size={22} />, label: 'Perawatan Aktif', value: '5', color: 'from-rose-500 to-pink-600', bg: 'bg-rose-50' },
        { icon: <Clock size={22} />, label: 'Bulan Member', value: '8', color: 'from-amber-500 to-orange-600', bg: 'bg-amber-50' },
        { icon: <Star size={22} />, label: 'Poin Reward', value: '320', color: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-50' },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Header */}
            <div className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 pb-32 pt-10 px-6">
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl" />
                <div className="absolute bottom-0 left-0 w-56 h-56 bg-teal-400/10 rounded-full translate-y-1/3 -translate-x-1/4 blur-2xl" />

                <div className="max-w-6xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col md:flex-row items-center md:items-end gap-6"
                    >
                        {/* Avatar */}
                        <div className="relative">
                            <div className="w-28 h-28 rounded-3xl bg-white/15 backdrop-blur-xl flex items-center justify-center ring-4 ring-white/25 shadow-2xl">
                                <span className="text-white font-black text-4xl tracking-tight">
                                    {profile.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </span>
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-400 rounded-xl flex items-center justify-center ring-4 ring-emerald-700 shadow-lg">
                                <CheckCircle size={16} className="text-white" />
                            </div>
                        </div>

                        {/* Info */}
                        <div className="text-center md:text-left flex-1">
                            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-1">{profile.name}</h1>
                            <p className="text-emerald-200 text-sm font-medium mb-3">{profile.email}</p>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-400/20 backdrop-blur-sm rounded-lg text-xs font-bold text-yellow-200 border border-yellow-400/20">
                                    <Award size={13} /> Member Gold
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-lg text-xs font-bold text-white/90 border border-white/10">
                                    <Shield size={13} /> Terverifikasi
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-400/20 backdrop-blur-sm rounded-lg text-xs font-bold text-emerald-200 border border-emerald-400/20">
                                    <TrendingUp size={13} /> Aktif sejak 2024
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Main Content - overlap with header */}
            <div className="max-w-6xl mx-auto px-6 -mt-24 relative z-10 pb-12">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + idx * 0.08, type: 'spring', stiffness: 100 }}
                            whileHover={{ y: -4, scale: 1.02 }}
                            className="bg-white rounded-2xl p-5 shadow-lg shadow-slate-200/60 border border-slate-100/80 cursor-default"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-md`}>
                                    {stat.icon}
                                </div>
                            </div>
                            <p className="text-3xl font-black text-slate-800 tracking-tight">{stat.value}</p>
                            <p className="text-xs text-slate-400 font-semibold mt-0.5">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Profile Form Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden"
                >
                    {/* Card Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-7 py-5 border-b border-slate-100 bg-slate-50/50">
                        <div>
                            <h2 className="text-xl font-black text-slate-800 tracking-tight">📋 Informasi Pribadi</h2>
                            <p className="text-sm text-slate-400 mt-0.5">Data profil dan informasi medis Anda</p>
                        </div>
                        {isEditing ? (
                            <div className="flex gap-2 mt-3 sm:mt-0">
                                <motion.button whileTap={{ scale: 0.95 }} onClick={() => setIsEditing(false)} className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all flex items-center gap-1.5">
                                    <X size={15} /> Batal
                                </motion.button>
                                <motion.button whileTap={{ scale: 0.95 }} onClick={handleSave} className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center gap-1.5">
                                    <Save size={15} /> Simpan
                                </motion.button>
                            </div>
                        ) : (
                            <motion.button whileTap={{ scale: 0.95 }} onClick={() => setIsEditing(true)} className="mt-3 sm:mt-0 px-5 py-2.5 rounded-xl text-sm font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-all flex items-center gap-1.5 border border-emerald-200">
                                <Edit3 size={15} /> Edit Profil
                            </motion.button>
                        )}
                    </div>

                    {/* Form Fields */}
                    <div className="p-7 grid md:grid-cols-2 gap-x-6 gap-y-5">
                        {[
                            { icon: <User size={16} />, label: 'Nama Lengkap', key: 'name' as const, color: 'text-blue-500' },
                            { icon: <Mail size={16} />, label: 'Email', key: 'email' as const, color: 'text-purple-500' },
                            { icon: <Phone size={16} />, label: 'Telepon', key: 'phone' as const, color: 'text-green-500' },
                            { icon: <MapPin size={16} />, label: 'Alamat', key: 'address' as const, color: 'text-red-500' },
                            { icon: <Calendar size={16} />, label: 'Tanggal Lahir', key: 'birthdate' as const, color: 'text-orange-500' },
                            { icon: <Activity size={16} />, label: 'Jenis Kelamin', key: 'gender' as const, color: 'text-indigo-500' },
                            { icon: <Heart size={16} />, label: 'Golongan Darah', key: 'bloodType' as const, color: 'text-rose-500' },
                            { icon: <FileText size={16} />, label: 'Alergi', key: 'allergies' as const, color: 'text-teal-500' },
                        ].map((field, idx) => (
                            <motion.div
                                key={field.key}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.45 + idx * 0.04 }}
                                className="space-y-2"
                            >
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                    <span className={field.color}>{field.icon}</span>
                                    {field.label}
                                </label>
                                {isEditing ? (
                                    <input
                                        type={field.key === 'birthdate' ? 'date' : 'text'}
                                        value={profile[field.key]}
                                        onChange={(e) => setProfile({ ...profile, [field.key]: e.target.value })}
                                        className="w-full px-4 py-3.5 bg-white rounded-xl border-2 border-slate-200 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 outline-none transition-all hover:border-slate-300"
                                    />
                                ) : (
                                    <div className="px-4 py-3.5 bg-slate-50/80 rounded-xl text-sm font-semibold text-slate-700 border border-slate-100 hover:bg-slate-50 transition-all">
                                        {field.key === 'birthdate'
                                            ? new Date(profile[field.key]).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                                            : profile[field.key]
                                        }
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Security Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-6 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 shadow-lg shadow-emerald-600/20 text-white"
                >
                    <div className="flex flex-col sm:flex-row items-start gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center shrink-0">
                            <Shield size={24} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-base font-bold mb-1.5">🔒 Keamanan Akun Terjamin</h3>
                            <p className="text-sm text-emerald-100 leading-relaxed mb-4">
                                Semua data pribadi dan informasi medis Anda dilindungi dengan enkripsi end-to-end. Kami menjaga kerahasiaan informasi Anda sesuai standar keamanan data kesehatan.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/90">
                                    <CheckCircle size={14} className="text-emerald-300" /> Password kuat
                                </span>
                                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/90">
                                    <CheckCircle size={14} className="text-emerald-300" /> Email terverifikasi
                                </span>
                                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/90">
                                    <CheckCircle size={14} className="text-emerald-300" /> Nomor HP aktif
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
