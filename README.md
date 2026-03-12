# 🦷 DentAI: Sistem Automasi & Kecerdasan Buatan Klinik Gigi

![n8n](https://img.shields.io/badge/Workflow-n8n-FF6D5A?style=for-the-badge&logo=n8n)
![OpenAI](https://img.shields.io/badge/AI-OpenAI%20GPT--4-412991?style=for-the-badge&logo=openai)
![Status](https://img.shields.io/badge/Status-Production--Ready-brightgreen?style=for-the-badge)

**DentAI** adalah solusi automasi cerdas yang dirancang untuk mentransformasi operasional klinik gigi konvensional menjadi entitas digital modern. Menggunakan **n8n** sebagai orkestrator workflow dan **AI** sebagai otak pengolah data, sistem ini menangani mulai dari reservasi pasien hingga analisis gejala awal secara otomatis.

---

## ✨ Fitur Unggulan

- 🤖 **AI Receptionist 24/7**: Chatbot cerdas (WhatsApp/Telegram) yang dapat menjawab pertanyaan seputar layanan klinik, harga, dan jadwal dokter.
- 📅 **Smart Scheduling**: Sinkronisasi otomatis antara chat pasien dengan Google Calendar atau sistem manajemen klinik.
- 🦷 **AI Symptom Analyzer**: Memberikan edukasi awal berdasarkan keluhan pasien sebelum bertemu dokter.
- 🔔 **Automated Reminders**: Pengingat otomatis H-1 jadwal kontrol melalui WhatsApp untuk mengurangi tingkat *no-show*.
- 📊 **Sentiment Analysis**: Menganalisis feedback pasien untuk meningkatkan kualitas layanan klinik.
- 📑 **Auto-Summarize Medical Record**: Merangkum percakapan awal pasien menjadi catatan medis singkat untuk dokter.

---

## 🛠️ Tech Stack

- **Workflow Engine:** [n8n](https://n8n.io/) (Self-hosted/Cloud)
- **AI Models:** OpenAI GPT-4 / Anthropic Claude
- **Database:** Supabase / PostgreSQL / Google Sheets
- **Communication:** Evolution API (WhatsApp) / Telegram Bot API
- **Integration:** Google Calendar, Gmail.

---

## 📐 Arsitektur Sistem

```mermaid
graph TD
    A[Pasien via WhatsApp/Web] --> B{n8n Workflow}
    B --> C[AI Engine: Klasifikasi & Jawaban]
    C --> D[Database/CRM: Simpan Data]
    B --> E[Google Calendar: Booking]
    B --> F[Notifikasi Internal Staf]
    C --> G[Output Jawaban ke Pasien]
