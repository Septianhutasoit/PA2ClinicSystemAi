<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Dental Clinic - n8n Automation</title>
    <!-- Font Awesome Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <!-- AOS Animation Library -->
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #fff;
            overflow-x: hidden;
            min-height: 100vh;
        }

        /* Animated Background */
        .background {
            position: fixed;
            width: 100vw;
            height: 100vh;
            top: 0;
            left: 0;
            z-index: -1;
            overflow: hidden;
        }

        .background span {
            position: absolute;
            display: block;
            width: 20px;
            height: 20px;
            background: rgba(255, 255, 255, 0.05);
            animation: animate 25s linear infinite;
            bottom: -150px;
        }

        @keyframes animate {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 1;
                border-radius: 0;
            }
            100% {
                transform: translateY(-1000px) rotate(720deg);
                opacity: 0;
                border-radius: 50%;
            }
        }

        /* Navbar */
        .navbar {
            padding: 2rem 5%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            animation: slideDown 1s ease;
        }

        @keyframes slideDown {
            from {
                transform: translateY(-100px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }

        .logo {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 1.5rem;
            font-weight: 700;
        }

        .logo i {
            font-size: 2rem;
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.1);
            }
        }

        .nav-links {
            display: flex;
            gap: 2rem;
        }

        .nav-links a {
            color: #fff;
            text-decoration: none;
            font-weight: 500;
            transition: all 0.3s;
            position: relative;
        }

        .nav-links a::after {
            content: '';
            position: absolute;
            bottom: -5px;
            left: 0;
            width: 0;
            height: 2px;
            background: #fff;
            transition: width 0.3s;
        }

        .nav-links a:hover::after {
            width: 100%;
        }

        /* Hero Section */
        .hero {
            padding: 2rem 5%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            min-height: 80vh;
        }

        .hero-content {
            flex: 1;
            animation: fadeInLeft 1.5s ease;
        }

        @keyframes fadeInLeft {
            from {
                transform: translateX(-100px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        .hero-content h1 {
            font-size: 3.5rem;
            font-weight: 800;
            line-height: 1.2;
            margin-bottom: 1.5rem;
        }

        .hero-content h1 span {
            background: linear-gradient(45deg, #ff6b6b, #feca57);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            display: inline-block;
            animation: glow 3s ease-in-out infinite;
        }

        @keyframes glow {
            0%, 100% {
                text-shadow: 0 0 10px rgba(255, 107, 107, 0.5);
            }
            50% {
                text-shadow: 0 0 20px rgba(255, 107, 107, 0.8);
            }
        }

        .hero-content p {
            font-size: 1.2rem;
            opacity: 0.9;
            margin-bottom: 2rem;
            line-height: 1.6;
        }

        .cta-buttons {
            display: flex;
            gap: 1rem;
        }

        .btn {
            padding: 1rem 2rem;
            border: none;
            border-radius: 50px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            position: relative;
            overflow: hidden;
        }

        .btn-primary {
            background: #fff;
            color: #764ba2;
        }

        .btn-primary:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .btn-secondary {
            background: transparent;
            color: #fff;
            border: 2px solid #fff;
        }

        .btn-secondary:hover {
            background: #fff;
            color: #764ba2;
            transform: translateY(-5px);
        }

        .btn::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: translate(-50%, -50%);
            transition: width 0.6s, height 0.6s;
        }

        .btn:hover::before {
            width: 300px;
            height: 300px;
        }

        /* Hero Image */
        .hero-image {
            flex: 1;
            text-align: center;
            animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
            0%, 100% {
                transform: translateY(0);
            }
            50% {
                transform: translateY(-20px);
            }
        }

        .hero-image img {
            max-width: 90%;
            height: auto;
        }

        /* Tools Section */
        .tools-section {
            padding: 5rem 5%;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
        }

        .section-title {
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 3rem;
            animation: fadeInUp 1s ease;
        }

        .section-title span {
            color: #feca57;
        }

        @keyframes fadeInUp {
            from {
                transform: translateY(50px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }

        .tools-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            max-width: 1200px;
            margin: 0 auto;
        }

        .tool-card {
            background: rgba(255, 255, 255, 0.15);
            border-radius: 20px;
            padding: 2rem;
            text-align: center;
            backdrop-filter: blur(5px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: all 0.4s;
            cursor: pointer;
            animation: fadeInUp 1s ease backwards;
            animation-delay: calc(var(--i) * 0.1s);
        }

        .tool-card:hover {
            transform: translateY(-15px) scale(1.05);
            background: rgba(255, 255, 255, 0.25);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .tool-icon {
            width: 100px;
            height: 100px;
            margin: 0 auto 1.5rem;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 3rem;
            animation: rotate 10s linear infinite;
        }

        @keyframes rotate {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);
            }
        }

        .tool-card h3 {
            font-size: 1.5rem;
            margin-bottom: 1rem;
        }

        .tool-card p {
            opacity: 0.8;
            line-height: 1.6;
        }

        /* Stats Section */
        .stats-section {
            padding: 5rem 5%;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 2rem;
            max-width: 1000px;
            margin: 0 auto;
        }

        .stat-card {
            text-align: center;
            padding: 2rem;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            animation: pulse 3s ease-in-out infinite;
        }

        .stat-card i {
            font-size: 3rem;
            margin-bottom: 1rem;
            color: #feca57;
        }

        .stat-number {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
        }

        .stat-label {
            opacity: 0.8;
        }

        /* Features Section */
        .features-section {
            padding: 5rem 5%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            max-width: 1200px;
            margin: 0 auto;
        }

        .feature-card {
            background: rgba(255, 255, 255, 0.15);
            border-radius: 20px;
            padding: 2rem;
            text-align: center;
            backdrop-filter: blur(5px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: all 0.3s;
        }

        .feature-card:hover {
            transform: scale(1.05) rotateY(10deg);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .feature-icon {
            width: 80px;
            height: 80px;
            margin: 0 auto 1rem;
            background: #feca57;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            color: #764ba2;
        }

        /* Workflow Animation */
        .workflow-section {
            padding: 5rem 5%;
            position: relative;
        }

        .workflow-container {
            display: flex;
            justify-content: space-around;
            align-items: center;
            flex-wrap: wrap;
            gap: 2rem;
            position: relative;
            max-width: 1000px;
            margin: 0 auto;
        }

        .workflow-item {
            text-align: center;
            z-index: 1;
            animation: bounce 3s ease-in-out infinite;
        }

        .workflow-item:nth-child(2) {
            animation-delay: 0.5s;
        }

        .workflow-item:nth-child(3) {
            animation-delay: 1s;
        }

        @keyframes bounce {
            0%, 100% {
                transform: translateY(0);
            }
            50% {
                transform: translateY(-20px);
            }
        }

        .workflow-icon {
            width: 80px;
            height: 80px;
            background: #fff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            color: #764ba2;
            margin-bottom: 1rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .workflow-line {
            position: absolute;
            top: 40px;
            left: 0;
            width: 100%;
            height: 2px;
            background: linear-gradient(90deg, transparent, #fff, transparent);
            animation: flow 3s linear infinite;
        }

        @keyframes flow {
            0% {
                transform: scaleX(0);
                opacity: 0;
            }
            50% {
                transform: scaleX(1);
                opacity: 1;
            }
            100% {
                transform: scaleX(0);
                opacity: 0;
            }
        }

        /* Footer */
        .footer {
            padding: 3rem 5%;
            text-align: center;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .social-links {
            display: flex;
            justify-content: center;
            gap: 2rem;
            margin-bottom: 2rem;
        }

        .social-links a {
            color: #fff;
            font-size: 1.5rem;
            transition: all 0.3s;
            width: 50px;
            height: 50px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .social-links a:hover {
            background: #fff;
            color: #764ba2;
            transform: translateY(-5px) rotate(360deg);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .hero {
                flex-direction: column;
                text-align: center;
                gap: 3rem;
            }

            .hero-content h1 {
                font-size: 2.5rem;
            }

            .cta-buttons {
                justify-content: center;
            }

            .nav-links {
                display: none;
            }

            .tools-grid {
                grid-template-columns: 1fr;
            }

            .workflow-container {
                flex-direction: column;
            }

            .workflow-line {
                display: none;
            }
        }

        /* Loading Animation */
        .loading {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #764ba2;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            animation: fadeOut 1s ease forwards 2s;
        }

        @keyframes fadeOut {
            to {
                opacity: 0;
                visibility: hidden;
            }
        }

        .loader {
            width: 80px;
            height: 80px;
            border: 5px solid #fff;
            border-top-color: transparent;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            to {
                transform: rotate(360deg);
            }
        }
    </style>
</head>
<body>
    <!-- Loading Animation -->
    <div class="loading">
        <div class="loader"></div>
    </div>

    <!-- Animated Background -->
    <div class="background" id="background"></div>

    <!-- Navbar -->
    <nav class="navbar">
        <div class="logo">
            <i class="fas fa-tooth"></i>
            <span>AI Dental Clinic</span>
        </div>
        <div class="nav-links">
            <a href="#home">Home</a>
            <a href="#tools">Tools</a>
            <a href="#features">Features</a>
            <a href="#workflow">Workflow</a>
            <a href="#contact">Contact</a>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero" id="home">
        <div class="hero-content">
            <h1>
                Transform Your Dental Clinic with
                <span>AI-Powered Automation</span>
            </h1>
            <p>
                Streamline appointments, enhance patient care, and boost efficiency
                with our n8n-based AI automation system. Built for modern dental practices.
            </p>
            <div class="cta-buttons">
                <button class="btn btn-primary">Get Started</button>
                <button class="btn btn-secondary">Watch Demo</button>
            </div>
        </div>
        <div class="hero-image">
            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'%3E%3Ccircle cx='400' cy='300' r='200' fill='%23ffffff20'/%3E%3Ccircle cx='400' cy='300' r='150' fill='%23ffffff30'/%3E%3Ccircle cx='400' cy='300' r='100' fill='%23ffffff40'/%3E%3Cpath d='M400 200 L450 300 L400 400 L350 300 Z' fill='%23ffffff50'/%3E%3C/svg%3E" alt="AI Dental Illustration">
        </div>
    </section>

    <!-- Tools Section -->
    <section class="tools-section" id="tools">
        <h2 class="section-title">Powered by <span>Modern Technologies</span></h2>
        <div class="tools-grid">
            <div class="tool-card" style="--i:1">
                <div class="tool-icon">
                    <i class="fas fa-code-branch"></i>
                </div>
                <h3>n8n</h3>
                <p>Workflow automation platform connecting all your services seamlessly</p>
            </div>
            <div class="tool-card" style="--i:2">
                <div class="tool-icon">
                    <i class="fas fa-robot"></i>
                </div>
                <h3>OpenAI</h3>
                <p>GPT-4 for intelligent patient conversations and smart responses</p>
            </div>
            <div class="tool-card" style="--i:3">
                <div class="tool-icon">
                    <i class="fab fa-whatsapp"></i>
                </div>
                <h3>WhatsApp API</h3>
                <p>Direct patient communication through their favorite messaging app</p>
            </div>
            <div class="tool-card" style="--i:4">
                <div class="tool-icon">
                    <i class="fas fa-calendar"></i>
                </div>
                <h3>Google Calendar</h3>
                <p>Automated appointment scheduling and real-time availability</p>
            </div>
            <div class="tool-card" style="--i:5">
                <div class="tool-icon">
                    <i class="fas fa-database"></i>
                </div>
                <h3>PostgreSQL</h3>
                <p>Secure and scalable patient data management</p>
            </div>
            <div class="tool-card" style="--i:6">
                <div class="tool-icon">
                    <i class="fas fa-envelope"></i>
                </div>
                <h3>SendGrid</h3>
                <p>Automated email reminders and marketing campaigns</p>
            </div>
            <div class="tool-card" style="--i:7">
                <div class="tool-icon">
                    <i class="fas fa-sms"></i>
                </div>
                <h3>Twilio</h3>
                <p>SMS notifications for appointment reminders and alerts</p>
            </div>
            <div class="tool-card" style="--i:8">
                <div class="tool-icon">
                    <i class="fas fa-chart-line"></i>
                </div>
                <h3>Redis</h3>
                <p>High-performance caching for real-time analytics</p>
            </div>
        </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section">
        <div class="stat-card">
            <i class="fas fa-clock"></i>
            <div class="stat-number" data-target="247">0</div>
            <div class="stat-label">Hours Support</div>
        </div>
        <div class="stat-card">
            <i class="fas fa-calendar-check"></i>
            <div class="stat-number" data-target="98">0</div>
            <div class="stat-label">% Efficiency</div>
        </div>
        <div class="stat-card">
            <i class="fas fa-smile"></i>
            <div class="stat-number" data-target="1000">0</div>
            <div class="stat-label">Happy Patients</div>
        </div>
        <div class="stat-card">
            <i class="fas fa-bolt"></i>
            <div class="stat-number" data-target="60">0</div>
            <div class="stat-label">Seconds Response</div>
        </div>
    </section>

    <!-- Features Section -->
    <section class="features-section" id="features">
        <h2 class="section-title">Why Choose <span>Our Solution?</span></h2>
        <div class="features-grid">
            <div class="feature-card">
                <div class="feature-icon">
                    <i class="fas fa-robot"></i>
                </div>
                <h3>AI Chatbot Assistant</h3>
                <p>24/7 intelligent responses to patient inquiries using GPT-4 technology</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">
                    <i class="fas fa-calendar-alt"></i>
                </div>
                <h3>Smart Scheduling</h3>
                <p>Automated appointment booking with real-time calendar sync</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">
                    <i class="fas fa-bell"></i>
                </div>
                <h3>Multi-channel Reminders</h3>
                <p>WhatsApp, SMS, and Email reminders to reduce no-shows</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">
                    <i class="fas fa-file-medical"></i>
                </div>
                <h3>Digital Records</h3>
                <p>Secure cloud-based patient records accessible anywhere</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">
                    <i class="fas fa-chart-pie"></i>
                </div>
                <h3>Analytics Dashboard</h3>
                <p>Real-time insights into clinic performance and patient trends</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">
                    <i class="fas fa-shield-alt"></i>
                </div>
                <h3>HIPAA Compliant</h3>
                <p>Enterprise-grade security for patient data protection</p>
            </div>
        </div>
    </section>

    <!-- Workflow Section -->
    <section class="workflow-section" id="workflow">
        <h2 class="section-title">How It <span>Works</span></h2>
        <div class="workflow-container">
            <div class="workflow-item">
                <div class="workflow-icon">
                    <i class="fas fa-comment-dots"></i>
                </div>
                <h3>Patient Message</h3>
                <p>Via WhatsApp, Web, or SMS</p>
            </div>
            <div class="workflow-item">
                <div class="workflow-icon">
                    <i class="fas fa-brain"></i>
                </div>
                <h3>AI Processing</h3>
                <p>n8n + OpenAI analyze intent</p>
            </div>
            <div class="workflow-item">
                <div class="workflow-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3>Action Taken</h3>
                <p>Book, Remind, or Inform</p>
            </div>
            <div class="workflow-line"></div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer" id="contact">
        <div class="social-links">
            <a href="#"><i class="fab fa-github"></i></a>
            <a href="#"><i class="fab fa-linkedin-in"></i></a>
            <a href="#"><i class="fab fa-twitter"></i></a>
            <a href="#"><i class="fab fa-whatsapp"></i></a>
        </div>
        <p>&copy; 2026 AI Dental Clinic. All rights reserved. Powered by n8n & OpenAI.</p>
    </footer>

    <!-- Scripts -->
    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    <script>
        // Initialize AOS
        AOS.init({
            duration: 1000,
            once: true
        });

        // Animated Background
        function createBackground() {
            const bg = document.getElementById('background');
            for (let i = 0; i < 50; i++) {
                const span = document.createElement('span');
                span.style.left = Math.random() * 100 + '%';
                span.style.width = Math.random() * 30 + 'px';
                span.style.height = span.style.width;
                span.style.animationDelay = Math.random() * 20 + 's';
                span.style.animationDuration = Math.random() * 20 + 10 + 's';
                bg.appendChild(span);
            }
        }
        createBackground();

        // Counter Animation
        const counters = document.querySelectorAll('.stat-number');
        const speed = 200;

        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 1);
                } else {
                    counter.innerText = target + (target === 247 ? '' : '%');
                }
            };
            updateCount();
        });

        // Smooth Scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });

        // Hover Effects
        const cards = document.querySelectorAll('.tool-card, .feature-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'scale(1.05)';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'scale(1)';
            });
        });

        // Loading Animation
        window.addEventListener('load', () => {
            setTimeout(() => {
                document.querySelector('.loading').style.display = 'none';
            }, 2000);
        });

        // Parallax Effect
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const background = document.querySelector('.background');
            background.style.transform = `translateY(${scrolled * 0.5}px)`;
        });
    </script>
</body>
</html>
