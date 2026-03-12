'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';

export default function AdminAppointments() {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        // Ambil data janji temu dari backend
        api.get('/clinic/appointments/today') 
            .then((res) => setAppointments(res.data))
            .catch((err) => console.error(err));
    }, []);

    return (
        <div className="p-8 bg-white min-h-screen text-black">
            <h1 className="text-3xl font-bold mb-6">Daftar Janji Temu Pasien</h1>
            <div className="overflow-x-auto border rounded-xl">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-4 border-b">Nama Pasien</th>
                            <th className="p-4 border-b">Nomor WA</th>
                            <th className="p-4 border-b">Dokter Tujuan</th>
                            <th className="p-4 border-b">Tanggal & Jam</th>
                            <th className="p-4 border-b">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.length > 0 ? appointments.map((app: any) => (
                            <tr key={app.id} className="hover:bg-gray-50">
                                <td className="p-4 border-b">{app.patient_name}</td>
                                <td className="p-4 border-b">{app.patient_phone}</td>
                                <td className="p-4 border-b">{app.doctor_name}</td>
                                <td className="p-4 border-b">{new Date(app.appointment_date).toLocaleString()}</td>
                                <td className="p-4 border-b">
                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                                        {app.status}
                                    </span>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} className="p-10 text-center text-gray-500">Belum ada pendaftar hari ini.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}