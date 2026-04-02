<!-- HEADER BANNER -->
<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=200&section=header&text=DentalAI%20Systems&fontSize=50&animation=fadeIn" width="100%" />
</p>

<!-- TYPING EFFECT -->
<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=28&duration=3000&pause=500&color=FF6D5A&center=true&vCenter=true&width=435&lines=DentAI;AI+Dental+Clinic;n8n+Automation" alt="Typing SVG" />
</p>

<br />

<!-- AVATAR BOTS (Diberi jarak antar gambar) -->
<p align="center">
  <img src="https://api.dicebear.com/7.x/bottts/svg?seed=tooth&backgroundColor=FF6D5A&radius=50&scale=90" width="120" />
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://api.dicebear.com/7.x/bottts/svg?seed=n8n&backgroundColor=4A90E2&radius=50&scale=90" width="120" />
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://api.dicebear.com/7.x/bottts/svg?seed=ai&backgroundColor=764ba2&radius=50&scale=90" width="120" />
</p>

<br />

<!-- STATUS BADGES -->
<p align="center">
  <img src="https://img.shields.io/badge/Workflow-n8n-FF6D5A?style=for-the-badge&logo=n8n&logoColor=white" />
  &nbsp;
  <img src="https://img.shields.io/badge/Status-Production--Ready-brightgreen?style=for-the-badge" />
</p>

<br />
<hr />
<br />

<!-- TECH STACK BADGES -->
<div align="center">
  <h3>🚀 Smart Dashboard & AI Chatbot System</h3>
  <p><b>Next.js • FastAPI • NeonCloud • n8n • RAG AI</b></p>
  
  <img src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white" /> &nbsp;
  <img src="https://img.shields.io/badge/FastAPI-005571?style=flat-square&logo=fastapi" /> &nbsp;
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white" /> &nbsp;
  <img src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white" /> &nbsp;
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square" />
</div>

<br />
<br />

<!-- SOCIAL MEDIA / CONNECT -->
<div align="center">
  <p><b>📞 Connect With Us</b></p>
  <a href="https://portofolio-puce-phi.vercel.app/" target="_blank">
    <img src="https://cdn.simpleicons.org/googlechrome/4285F4" width="30" title="Portfolio" />
  </a>
  &nbsp;&nbsp;
  <a href="https://www.linkedin.com/in/septian-a-hutasoit/" target="_blank">
    <img src="https://cdn.simpleicons.org/linkedin/0077B5" width="30" title="LinkedIn" />
  </a>
  &nbsp;&nbsp;
  <a href="https://www.instagram.com/tianhts_/" target="_blank">
    <img src="https://cdn.simpleicons.org/instagram/E1306C" width="30" title="Instagram" />
  </a>
  &nbsp;&nbsp;
  <a href="mailto:email-kamu@gmail.com">
    <img src="https://cdn.simpleicons.org/gmail/EA4335" width="30" title="Email" />
  </a>
</div>

<br />

<!-- FOOTER -->
<div align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=16&duration=3000&pause=1000&color=FF6D5A&center=true&vCenter=true&width=435&lines=Made+with+%E2%9D%A4%EF%B8%8F+for+Modern+Dental+Care;Powered+by+n8n+and+OpenAI" />
  <br />
  <sub>© 2024 Clinic Nauli Dental Care Systems | Software Engineer | @NauliDentalCare2026</sub>
</div>

## 🛠️ Tech Stack & WorkFlow
Sistem ini mengintegrasikan Dashboard User yang responsif dengan automasi workflow dan chatbot Ai cerdas berbasis RAG (Retrieval-Augmented Generation).
###  Arsitektur Sistem (Live Workflow)
```mermaid
graph TD
    subgraph Frontend_Layer
    A[User Dashboard] -->|Interact| B(Next.js App)
    end

    subgraph Backend_Layer
    B -->|API Request| C{FastAPI Gateway}
    C -->|Query/Store| D[(PostgreSQL / Neon)]
    end
    subgraph Automation_Layer Workflow
    C -->|Trigger Event| E[n8n Workflow]
    E -->|Notification| F{Channels}
    F -->|Send| G[WhatsApp Reminder]
    F -->|Send| H[Email Notification]
    end

    style A fill:#f9f,stroke:#333,stroke-width:2px
    style C fill:#00d1b2,stroke:#333,stroke-width:2px
    style E fill:#ff6d5a,stroke:#333,stroke-width:2px
    style G fill:#25D366,stroke:#333,stroke-width:2px
