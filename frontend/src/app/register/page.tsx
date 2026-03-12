'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import Link from 'next/link';

export default function RegisterPage() {
    const [form, setForm] = useState({ email: '', full_name: '', password: '' });
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Kita kirim data secara eksplisit agar bersih
            const response = await api.post('/auth/register', {
                email: form.email,
                full_name: form.full_name,
                password: form.password
            });

            console.log("Sukses:", response.data);
            alert("✅ Registrasi Berhasil! Silakan Login.");
            router.push('/login');
        } catch (err: any) {
            // Ambil pesan detail dari backend jika ada
            const errorDetail = err.response?.data?.detail;
            console.error("Error pendaftaran:", err.response?.data);

            if (Array.isArray(errorDetail)) {
                // Jika error dari validasi Pydantic (biasanya array)
                alert("❌ Gagal: " + errorDetail[0].msg);
            } else {
                alert("❌ Gagal Registrasi: " + (errorDetail || "Server tidak merespon"));
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 text-black">
            <div className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
                <h2 className="text-3xl font-black text-blue-600 mb-2">Daftar Akun</h2>
                <p className="text-slate-400 mb-8 font-medium">Bergabung dengan ekosistem Klinik.AI</p>

                <form onSubmit={handleRegister} className="space-y-4">
                    <input type="text" placeholder="Nama Lengkap" className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600" onChange={e => setForm({ ...form, full_name: e.target.value })} required />
                    <input type="email" placeholder="Email" className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600" onChange={e => setForm({ ...form, email: e.target.value })} required />
                    <input type="password" placeholder="Password" className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600" onChange={e => setForm({ ...form, password: e.target.value })} required />
                    <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-blue-200">DAFTAR SEKARANG</button>
                </form>
                <p className="mt-6 text-center text-sm text-slate-500">Sudah punya akun? <Link href="/login" className="text-blue-600 font-bold">Login</Link></p>
            </div>
        </div>
    );
}