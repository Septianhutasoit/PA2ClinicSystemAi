'use client';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Mail, Phone, MapPin, Calendar, Shield,
    Edit3, Save, X, Heart, Activity, Clock,
    CheckCircle, Star, FileText, Award, TrendingUp,
    Lock, Bell, Wallet, Search, LogOut, Key,
    Globe, MessageCircle, CreditCard, Smartphone
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        title: '',
        firstName: '',
        lastName: '',
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
        const nameParts = savedName.split(' ');
        setProfile({
            title: 'Dr.',
            firstName: nameParts[0] || 'Septian',
            lastName: nameParts.slice(1).join(' ') || 'Adi',
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
        const fullName = `${profile.firstName} ${profile.lastName}`;
        localStorage.setItem('user_name', fullName);
        localStorage.setItem('user_email', profile.email);
        setIsEditing(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_name');
        localStorage.removeItem('user_email');
        router.push('/login');
    };

    const stats = [
        { icon: <Calendar size={20} />, label: 'Total Kunjungan', value: '12', color: 'from-blue-500 to-indigo-600', bg: 'bg-blue-50' },
        { icon: <Heart size={20} />, label: 'Perawatan Aktif', value: '5', color: 'from-rose-500 to-pink-600', bg: 'bg-rose-50' },
        { icon: <Clock size={20} />, label: 'Bulan Member', value: '8', color: 'from-amber-500 to-orange-600', bg: 'bg-amber-50' },
        { icon: <Star size={20} />, label: 'Poin Reward', value: '320', color: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-50' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
            
            {/* Hero Header */}
            <div className="relative bg-gradient-to-r from-emerald-600 to-teal-600 pt-10 pb-16 px-6">
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
                            <div className="w-24 h-24 rounded-2xl bg-white/15 backdrop-blur-xl flex items-center justify-center ring-4 ring-white/25 shadow-2xl">
                                <span className="text-white font-black text-3xl tracking-tight">
                                    {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                                </span>
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-400 rounded-xl flex items-center justify-center ring-4 ring-emerald-700 shadow-lg">
                                <CheckCircle size={14} className="text-white" />
                            </div>
                        </div>

                        {/* Info */}
                        <div className="text-center md:text-left flex-1">
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1">
                                <span className="text-emerald-200 text-sm font-medium">{profile.title}</span>
                                <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                                    {profile.firstName} {profile.lastName}
                                </h1>
                            </div>
                            <p className="text-emerald-100 text-sm font-medium mb-3">Clinical Specialist</p>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-lg text-xs font-bold text-white/90 border border-white/20">
                                    <Award size={12} /> Member Gold
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-lg text-xs font-bold text-white/90 border border-white/20">
                                    <Shield size={12} /> Terverifikasi
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-6 py-8">
                
                {/* Page Title */}
                <div className="mb-8">
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">Settings</h1>
                    <p className="text-sm text-slate-500">Kelola pengaturan akun dan preferensi Anda</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* ========== KOLOM KIRI ========== */}
                    <div className="space-y-6">
                        
                        {/* Account Settings Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden"
                        >
                            <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
                                            <User size={16} className="text-emerald-600" />
                                        </div>
                                        <h2 className="font-bold text-slate-800">Account Settings</h2>
                                    </div>
                                    {isEditing ? (
                                        <div className="flex gap-2">
                                            <button onClick={() => setIsEditing(false)} className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition">
                                                Batal
                                            </button>
                                            <button onClick={handleSave} className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition">
                                                Simpan
                                            </button>
                                        </div>
                                    ) : (
                                        <button onClick={() => setIsEditing(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition">
                                            <Edit3 size={12} /> Edit
                                        </button>
                                    )}
                                </div>
                            </div>
                            
                            <div className="p-6 space-y-4">
                                {/* Title */}
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Title</label>
                                    {isEditing ? (
                                        <select
                                            value={profile.title}
                                            onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                                            className="w-full mt-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                                        >
                                            <option value="Dr.">Dr.</option>
                                            <option value="Prof.">Prof.</option>
                                            <option value="Mr.">Mr.</option>
                                            <option value="Mrs.">Mrs.</option>
                                        </select>
                                    ) : (
                                        <p className="text-sm font-semibold text-slate-700 mt-1">{profile.title}</p>
                                    )}
                                </div>

                                {/* First Name */}
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">First Name</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={profile.firstName}
                                            onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                                            className="w-full mt-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                                        />
                                    ) : (
                                        <p className="text-sm font-semibold text-slate-700 mt-1">{profile.firstName}</p>
                                    )}
                                </div>

                                {/* Last Name */}
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Last Name</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={profile.lastName}
                                            onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                                            className="w-full mt-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                                        />
                                    ) : (
                                        <p className="text-sm font-semibold text-slate-700 mt-1">{profile.lastName}</p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Registered Email</label>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            value={profile.email}
                                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                            className="w-full mt-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                                        />
                                    ) : (
                                        <p className="text-sm font-semibold text-slate-700 mt-1">{profile.email}</p>
                                    )}
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Registered Phone Number</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={profile.phone}
                                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                            className="w-full mt-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                                        />
                                    ) : (
                                        <p className="text-sm font-semibold text-slate-700 mt-1">{profile.phone}</p>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-4 border-t border-slate-100">
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition"
                                    >
                                        <Edit3 size={14} /> Edit
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 transition"
                                    >
                                        <LogOut size={14} /> Log Out
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Notification Settings Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden"
                        >
                            <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
                                        <Bell size={16} className="text-emerald-600" />
                                    </div>
                                    <h2 className="font-bold text-slate-800">Notification Settings</h2>
                                </div>
                            </div>
                            <div className="p-6 space-y-3">
                                {[
                                    { icon: MessageCircle, label: 'R-DEE Connect', value: 'Settle' },
                                    { icon: Globe, label: 'Marketplace', value: 'Other Notifications' },
                                    { icon: Mail, label: 'Email Alerts', value: 'Active' },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between py-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                                                <item.icon size={14} className="text-slate-500" />
                                            </div>
                                            <span className="text-sm font-medium text-slate-700">{item.label}</span>
                                        </div>
                                        <span className="text-xs text-slate-400">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* ========== KOLOM KANAN ========== */}
                    <div className="space-y-6">

                        {/* Authentication Settings Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden"
                        >
                            <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
                                        <Lock size={16} className="text-emerald-600" />
                                    </div>
                                    <h2 className="font-bold text-slate-800">Authentication Settings</h2>
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-700">Change your account password</p>
                                    </div>
                                    <button className="px-4 py-2 rounded-lg text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition">
                                        Change Password
                                    </button>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-700">Enable Secure Login</p>
                                        <p className="text-xs text-slate-400 mt-0.5">Nauli Dental offers fast and secure login through our novel authentication technology</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" />
                                        <div className="w-10 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-emerald-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                                    </label>
                                </div>
                            </div>
                        </motion.div>

                        {/* Wallet Settings Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden"
                        >
                            <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
                                        <Wallet size={16} className="text-emerald-600" />
                                    </div>
                                    <h2 className="font-bold text-slate-800">Wallet Settings</h2>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-700">Change Settle PIN</p>
                                    </div>
                                    <button className="px-4 py-2 rounded-lg text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition">
                                        Change Pin
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Search Settings Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 }}
                            className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden"
                        >
                            <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
                                        <Search size={16} className="text-emerald-600" />
                                    </div>
                                    <h2 className="font-bold text-slate-800">Search Settings</h2>
                                </div>
                            </div>
                            <div className="p-6">
                                <p className="text-sm text-slate-600">
                                    Choose how you wanted to be found on Connect contact search
                                </p>
                                <div className="mt-4 flex gap-3">
                                    <label className="flex items-center gap-2">
                                        <input type="radio" name="search" className="w-3 h-3 text-emerald-600" defaultChecked />
                                        <span className="text-xs text-slate-600">Visible</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input type="radio" name="search" className="w-3 h-3 text-emerald-600" />
                                        <span className="text-xs text-slate-600">Hidden</span>
                                    </label>
                                </div>
                            </div>
                        </motion.div>

                        {/* Stats Cards Ringkas */}
                        <div className="grid grid-cols-2 gap-3">
                            {stats.map((stat, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 + idx * 0.05 }}
                                    className="bg-white rounded-xl p-3 shadow-sm border border-emerald-100"
                                >
                                    <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center mb-2`}>
                                        <div className={`bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}>
                                            {stat.icon}
                                        </div>
                                    </div>
                                    <p className="text-lg font-black text-slate-800">{stat.value}</p>
                                    <p className="text-[9px] font-medium text-slate-400">{stat.label}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}