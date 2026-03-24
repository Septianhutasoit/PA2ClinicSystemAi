🦷 DentalAI: Dental Clinic Automation & Artificial Intelligence Systems
<p align="center"> <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=28&duration=3000&pause=500&color=FF6D5A&center=true&vCenter=true&width=435&lines=DentAI;AI+Dental+Clinic;n8n+Automation" alt="Typing SVG" /> </p><p align="center"> <img src="https://api.dicebear.com/7.x/bottts/svg?seed=tooth&backgroundColor=FF6D5A&radius=50&scale=90" width="150" /> <img src="https://api.dicebear.com/7.x/bottts/svg?seed=n8n&backgroundColor=4A90E2&radius=50&scale=90" width="150" /> <img src="https://api.dicebear.com/7.x/bottts/svg?seed=ai&backgroundColor=764ba2&radius=50&scale=90" width="150" /> </p><p align="center"> <img src="https://img.shields.io/badge/Workflow-n8n-FF6D5A?style=for-the-badge&logo=n8n&logoColor=white" /> <img src="https://img.shields.io/badge/OpenAI%20GPT--4-412991?style=for-the-badge&logo=openai&logoColor=white" /> <img src="https://img.shields.io/badge/Status-Production--Ready-brightgreen?style=for-the-badge" /> </p>

📞 Connect With Us
<div align="center"> <a href="https://github.com"> <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" /> </a> <a href="https://linkedin.com"> <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" /> </a> <a href="https://n8n.io"> <img src="https://img.shields.io/badge/n8n-FF6D5A?style=for-the-badge&logo=n8n&logoColor=white" /> </a> </div>
<div align="center"> <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=18&duration=3000&pause=1000&color=FF6D5A&center=true&vCenter=true&width=435&lines=Made+with+%E2%9D%A4%EF%B8%8F+for+Modern+Dental+Care;Powered+by+n8n+and+OpenAI;DentAI+%7C+Smart+Dental+Automation" /> <br /> <img src="https://api.dicebear.com/7.x/identicon/svg?seed=footer&backgroundColor=667eea&size=50" /> <br /> <sub>©  Clinic Nauli Dental Care Automation & Artificial Intelligence Systems | SoftwareEngineer | ComputerEngineering | @NauliDentalCare2026 
<div align="center">

# 🚀 Smart Dashboard & AI Chatbot System
**Next.js • FastAPI • NeonCloudPostgreSQL • n8n • RAG AI**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![NeonCloud/PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=200&section=header&text=Automation%20&%20AI%20RAG&fontSize=50&animation=fadeIn" width="100%" />
</p>

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
