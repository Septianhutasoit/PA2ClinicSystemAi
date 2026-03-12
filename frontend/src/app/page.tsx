'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import {
  Activity,
  Calendar,
  Phone,
  User,
  ArrowRight,
  CheckCircle2,
  Clock,
  ShieldCheck,
  MapPin
} from 'lucide-react';

export default function Home() {
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    patient_name: '',
    patient_phone: '',
    doctor_name: '',
    appointment_date: ''
  });
  const [status, setStatus] = useState({ type: '', msg: '' });

  useEffect(() => {
    api.get('/clinic/doctors').then((res) => setDoctors(res.data)).catch(err => console.error(err));
    api.get('/clinic/services').then((res) => setServices(res.data)).catch(err => console.error(err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: 'loading', msg: 'Memproses pendaftaran...' });

    // LOGIKA PENTING: Format nomor WA untuk n8n
    let formattedPhone = formData.patient_phone;
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '62' + formattedPhone.substring(1);
    }

    try {
      await api.post('/clinic/appointments', {
        ...formData,
        patient_phone: formattedPhone
      });
      setStatus({ type: 'success', msg: '✅ Berhasil! Pengingat akan dikirim ke WhatsApp Anda.' });
      setFormData({ patient_name: '', patient_phone: '', doctor_name: '', appointment_date: '' });
    } catch (error) {
      setStatus({ type: 'error', msg: '❌ Terjadi kesalahan. Silakan coba lagi.' });
    }
  };

  return (
    <div className="bg-white min-h-screen text-slate-900 scroll-smooth">
      {/* Navbar Modern */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-200 italic">
              K
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-blue-600 italic">KLINIK.AI</h1>
          </div>
          <div className="hidden md:flex items-center gap-10 text-sm font-bold uppercase tracking-widest text-slate-500">
            <a href="#services" className="hover:text-blue-600 transition">Layanan</a>
            <a href="#doctors" className="hover:text-blue-600 transition">Dokter</a>
            <a href="#appointment" className="bg-blue-600 text-white px-8 py-3 rounded-full shadow-lg shadow-blue-200 hover:scale-105 transition active:scale-95">Daftar Sekarang</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-40 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 items-center gap-12">
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest">
              <Activity size={16} /> Digital Health Assistant
            </div>
            <h2 className="text-6xl md:text-7xl font-black tracking-tighter leading-[0.9] text-slate-900">
              Kesehatan <br /> <span className="text-blue-600">Lebih Pintar.</span>
            </h2>
            <p className="text-slate-500 text-lg max-w-lg font-medium leading-relaxed">
              Konsultasi cepat dengan Chatbot AI kami dan buat janji temu dokter spesialis hanya dalam hitungan detik.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <a href="#appointment" className="w-full sm:w-auto bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-xl shadow-slate-200">
                Buat Janji Temu <ArrowRight size={20} />
              </a>
              <div className="flex -space-x-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-10 h-10 border-4 border-white bg-slate-200 rounded-full flex items-center justify-center font-bold text-[10px]">DR</div>
                ))}
                <div className="pl-5 text-xs font-bold text-slate-400 self-center">Dipilih oleh 1000+ Pasien</div>
              </div>
            </div>
          </div>
          {/* Hero Illustration Placeholder */}
          <div className="relative flex justify-center">
            <div className="w-72 h-72 md:w-96 md:h-96 bg-blue-600 rounded-[4rem] rotate-12 shadow-2xl shadow-blue-200"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 md:w-80 md:h-80 bg-white/20 backdrop-blur-2xl rounded-3xl border border-white/30 rotate-[-6deg] flex flex-col p-8 space-y-4">
                <div className="h-4 w-3/4 bg-white/40 rounded-full"></div>
                <div className="h-4 w-1/2 bg-white/40 rounded-full"></div>
                <div className="mt-10 p-4 bg-white rounded-2xl shadow-xl flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-400 rounded-full flex items-center justify-center text-white"><CheckCircle2 size={24} /></div>
                  <div className="text-xs font-bold text-slate-800">Dokter Siap Melayani</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Services Section */}
      <section id="services" className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-20">
            <h3 className="text-sm font-black text-blue-600 uppercase tracking-[0.3em]">Services</h3>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Layanan Unggulan Kami</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((s: any) => (
              <div key={s.id} className="bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <ShieldCheck size={32} />
                </div>
                <h4 className="font-black text-2xl mb-3">{s.name}</h4>
                <p className="text-slate-400 text-sm font-medium leading-relaxed mb-6">{s.description}</p>
                <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
                  <span className="text-blue-600 font-black text-xl">{s.price}</span>
                  <div className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-transparent transition">
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section id="doctors" className="py-32">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="space-y-4 mb-20">
            <h3 className="text-sm font-black text-blue-600 uppercase tracking-[0.3em]">Specialists</h3>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Tim Dokter Ahli</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {doctors.map((d: any) => (
              <div key={d.id} className="p-8 rounded-[3rem] border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group">
                <div className="w-24 h-24 bg-slate-100 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl group-hover:scale-110 transition">
                  👨‍⚕️
                </div>
                <h4 className="font-black text-lg text-slate-800">{d.name}</h4>
                <p className="text-sm font-bold text-blue-600 uppercase tracking-widest mt-1">{d.specialty}</p>
                <div className="mt-6 flex items-center justify-center gap-2 text-slate-400 text-[10px] font-bold italic uppercase tracking-tighter">
                  <Clock size={12} /> {d.schedule}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Appointment Section */}
      <section id="appointment" className="py-32 px-6">
        <div className="max-w-4xl mx-auto bg-slate-900 rounded-[3.5rem] p-8 md:p-20 text-white relative overflow-hidden shadow-2xl">
          {/* Background Decorative Circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>

          <div className="relative z-10 space-y-12">
            <div className="text-center space-y-4">
              <h3 className="text-4xl md:text-5xl font-black tracking-tight">Buat Janji Temu</h3>
              <p className="text-slate-400 font-medium">Layanan instan tanpa perlu antri panjang.</p>
            </div>

            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 ml-2">Nama Pasien</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type="text" placeholder="Septian" required
                    className="w-full pl-12 pr-6 py-5 bg-white/5 border border-white/10 rounded-3xl focus:ring-2 focus:ring-blue-600 transition outline-none text-white font-medium"
                    value={formData.patient_name}
                    onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 ml-2">WhatsApp</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type="text" placeholder="628123..." required
                    className="w-full pl-12 pr-6 py-5 bg-white/5 border border-white/10 rounded-3xl focus:ring-2 focus:ring-blue-600 transition outline-none text-white font-medium"
                    value={formData.patient_phone}
                    onChange={(e) => setFormData({ ...formData, patient_phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 ml-2">Pilih Dokter</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <select
                    required className="w-full pl-12 pr-6 py-5 bg-white/5 border border-white/10 rounded-3xl focus:ring-2 focus:ring-blue-600 transition outline-none text-white font-medium appearance-none"
                    value={formData.doctor_name}
                    onChange={(e) => setFormData({ ...formData, doctor_name: e.target.value })}
                  >
                    <option value="" className="text-black">Pilih Dokter</option>
                    {doctors.map((d: any) => <option key={d.id} value={d.name} className="text-black">{d.name} ({d.specialty})</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 ml-2">Waktu Kedatangan</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type="datetime-local" required
                    className="w-full pl-12 pr-6 py-5 bg-white/5 border border-white/10 rounded-3xl focus:ring-2 focus:ring-blue-600 transition outline-none text-white font-medium invert-calendar-icon"
                    value={formData.appointment_date}
                    onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
                  />
                </div>
              </div>
              <button className="md:col-span-2 w-full bg-blue-600 text-white py-6 rounded-[2rem] font-black text-xl hover:bg-blue-500 hover:-translate-y-1 transition-all shadow-2xl shadow-blue-600/30">
                KONFIRMASI PENDAFTARAN
              </button>
              {status.msg && (
                <p className={`md:col-span-2 text-center text-sm font-black uppercase tracking-widest mt-4 ${status.type === 'error' ? 'text-red-400' : 'text-green-400'}`}>
                  {status.msg}
                </p>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-slate-50 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-6">
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-black text-sm italic">K</div>
            <h1 className="text-xl font-black tracking-tighter text-slate-900 italic">KLINIK.AI</h1>
          </div>
          <div className="flex justify-center gap-10 text-xs font-bold uppercase tracking-widest text-slate-400">
            <p className="flex items-center gap-2"><MapPin size={14} /> Jl. Merdeka No. 10</p>
            <p className="flex items-center gap-2"><Phone size={14} /> 021-1234-567</p>
          </div>
          <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.4em]">&copy; 2026 Klinik Sehat Sejahtera. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}