<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=00d2ff&height=250&section=header&text=DentalAI%20Systems&fontSize=70&animation=fadeIn" width="100%" />
</p>

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=24&duration=3000&pause=500&color=00D2FF&center=true&vCenter=true&width=500&lines=Clinic+Automation+System;AI-Powered+Dental+Care;RAG+Implementation+with+n8n" alt="Typing SVG" />
</p>

---

### 🚀 Overview
**DentalAI** adalah sistem otomasi klinik modern yang mengintegrasikan **Artificial Intelligence (RAG)** dan alur kerja **n8n** untuk meningkatkan efisiensi operasional di **Nauli Dental Care**.

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/n8n-FF6D5A?style=for-the-badge&logo=n8n&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
</p>

---

### 🛠️ Core Tech Stack & Systems
| Category | Technology |
| :--- | :--- |
| **Frontend** | Next.js, Tailwind CSS, Shadcn UI |
| **Backend** | FastAPI (Python), Neon Cloud PostgreSQL |
| **Automation** | n8n Workflow Engine |
| **Intelligence** | RAG AI, OpenAI, LangChain |
| **Deployment** | Docker, Vercel |

---

### 📞 Connect With Developer
<p align="left">
  <a href="https://portofolio-puce-phi.vercel.app/" target="_blank">
    <img src="https://cdn.simpleicons.org/googlechrome/4285F4" width="30" title="Portfolio" />
  </a>
  &nbsp;
  <a href="https://www.linkedin.com/in/septian-a-hutasoit/" target="_blank">
    <img src="https://cdn.simpleicons.org/linkedin/0077B5" width="30" title="LinkedIn" />
  </a>
  &nbsp;
  <a href="https://www.instagram.com/tianhts_/" target="_blank">
    <img src="https://cdn.simpleicons.org/instagram/E1306C" width="30" title="Instagram" />
  </a>
  &nbsp;
  <a href="mailto:septianhutasoit@example.com">
    <img src="https://cdn.simpleicons.org/gmail/EA4335" width="30" title="Email Me" />
  </a>
</p>

---

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=16&duration=3000&pause=1000&color=777777&center=true&vCenter=true&width=435&lines=Powered+by+Nauli+Dental+Care+Automation;Smart+Modern+Dental+Care+2026" />
  <br />
  <sub>© 2024-2026 Clinic Nauli Dental Care | Built by Septian Hutasoit</sub>
</p>

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
