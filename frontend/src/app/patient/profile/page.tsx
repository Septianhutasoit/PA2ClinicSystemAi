'use client';
import { motion } from 'framer-motion';
import {
    User, Mail, Phone, MapPin, Calendar, Shield,
    Edit3, Save, X, Heart, Activity, Clock,
    CheckCircle, Star, FileText
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
        // Load from localStorage or use defaults
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
        { icon: <Calendar size={20} />, label: 'Kunjungan', value: '12', color: 'from-blue-500 to-indigo-600' },
        { icon: <Heart size={20} />, label: 'Perawatan', value: '5', color: 'from-rose-500 to-pink-600' },
        { icon: <Clock size={20} />, label: 'Bulan Member', value: '8', color: 'from-amber-500 to-orange-600' },
        { icon: <Star size={20} />, label: 'Poin Reward', value: '320', color: 'from-emerald-500 to-teal-600' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
            {/* Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 py-16 px-6">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />
                <div className="max-w-5xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col sm:flex-row items-center gap-6"
                    >
                        <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center ring-4 ring-white/30">
                            <span className="text-white font-black text-3xl">
                                {profile.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </span>
                        </div>
                        <div className="text-center sm:text-left">
                            <h1 className="text-2xl sm:text-3xl font-black text-white mb-1">{profile.name}</h1>
                            <p className="text-emerald-100 text-sm">{profile.email}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold text-white">
                                    <Star size={12} className="text-yellow-300" /> Member Gold
                                </span>
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold text-white">
                                    <Shield size={12} /> Terverifikasi
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Stats */}
            <div className="max-w-5xl mx-auto px-6 -mt-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white rounded-2xl p-5 shadow-lg border border-slate-100 hover:shadow-xl transition-all"
                        >
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-3`}>
                                {stat.icon}
                            </div>
                            <p className="text-2xl font-black text-slate-800">{stat.value}</p>
                            <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Profile Form */}
            <div className="max-w-5xl mx-auto px-6 py-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
                >
                    <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                        <div>
                            <h2 className="text-lg font-black text-slate-800">Informasi Pribadi</h2>
                            <p className="text-sm text-slate-500">Detail profil akun Anda</p>
                        </div>
                        {isEditing ? (
                            <div className="flex gap-2">
                                <button onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-100 transition-all flex items-center gap-1">
                                    <X size={14} /> Batal
                                </button>
                                <button onClick={handleSave} className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-lg transition-all flex items-center gap-1">
                                    <Save size={14} /> Simpan
                                </button>
                            </div>
                        ) : (
                            <button onClick={() => setIsEditing(true)} className="px-4 py-2 rounded-xl text-sm font-semibold text-emerald-600 hover:bg-emerald-50 transition-all flex items-center gap-1">
                                <Edit3 size={14} /> Edit Profil
                            </button>
                        )}
                    </div>

                    <div className="p-6 grid md:grid-cols-2 gap-5">
                        {[
                            { icon: <User size={16} />, label: 'Nama Lengkap', key: 'name' as const },
                            { icon: <Mail size={16} />, label: 'Email', key: 'email' as const },
                            { icon: <Phone size={16} />, label: 'Telepon', key: 'phone' as const },
                            { icon: <MapPin size={16} />, label: 'Alamat', key: 'address' as const },
                            { icon: <Calendar size={16} />, label: 'Tanggal Lahir', key: 'birthdate' as const },
                            { icon: <Activity size={16} />, label: 'Jenis Kelamin', key: 'gender' as const },
                            { icon: <Heart size={16} />, label: 'Golongan Darah', key: 'bloodType' as const },
                            { icon: <FileText size={16} />, label: 'Alergi', key: 'allergies' as const },
                        ].map((field) => (
                            <div key={field.key} className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                                    <span className="text-emerald-500">{field.icon}</span>
                                    {field.label}
                                </label>
                                {isEditing ? (
                                    <input
                                        type={field.key === 'birthdate' ? 'date' : 'text'}
                                        value={profile[field.key]}
                                        onChange={(e) => setProfile({ ...profile, [field.key]: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                    />
                                ) : (
                                    <p className="px-4 py-3 bg-slate-50 rounded-xl text-sm font-medium text-slate-700 border border-slate-100">
                                        {field.key === 'birthdate' ? new Date(profile[field.key]).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : profile[field.key]}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Security Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100"
                >
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shrink-0">
                            <Shield size={20} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-800 mb-1">Keamanan Akun</h3>
                            <p className="text-xs text-slate-500">
                                Data Anda dilindungi dengan enkripsi end-to-end. Kami menjaga kerahasiaan informasi medis Anda sesuai standar HIPAA.
                            </p>
                            <div className="flex flex-wrap gap-3 mt-3">
                                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                                    <CheckCircle size={12} /> Password kuat
                                </span>
                                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                                    <CheckCircle size={12} /> Email terverifikasi
                                </span>
                                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                                    <CheckCircle size={12} /> Nomor HP aktif
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
