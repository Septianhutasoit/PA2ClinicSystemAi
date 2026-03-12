'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import Cookies from 'js-cookie';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        params.append('username', email);
        params.append('password', password);

        try {
            const res = await axios.post('http://127.0.0.1:8000/api/v1/auth/login', params);
            localStorage.setItem('token', res.data.access_token);

            Cookies.set('token', res.data.acces_token, { expires: 1 }); // Simpan token di cookie selama 1 hari

            // Logika sederhana untuk routing
            // Di produksi, sebaiknya decode JWT untuk cek role
            if (email.includes('admin')) {
                router.push('/admin');
            } else {
                router.push('/');
            }
        } catch (err) { alert("Login Gagal! Periksa email dan password Anda."); }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 text-black">
            <div className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
                <h2 className="text-3xl font-black text-blue-600 mb-2">Selamat Datang</h2>
                <p className="text-slate-400 mb-8 font-medium">Masuk untuk mengelola kesehatan Anda</p>

                <form onSubmit={handleLogin} className="space-y-4">
                    <input type="email" placeholder="Email" className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600" value={email} onChange={e => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Password" className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600" value={password} onChange={e => setPassword(e.target.value)} required />
                    <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-blue-200 uppercase tracking-widest">Login</button>
                </form>
                <p className="mt-6 text-center text-sm text-slate-500">Belum punya akun? <Link href="/register" className="text-blue-600 font-bold">Daftar</Link></p>
            </div>
        </div>
    );
}