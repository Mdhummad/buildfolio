<div align="center">

# 🚀 Buildfolio

**Build a stunning portfolio & ATS-optimized resume in minutes — powered by Gemini AI**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-buildfolio--one.vercel.app-22d3ee?style=for-the-badge&logo=vercel&logoColor=white)](https://buildfolio-one.vercel.app)
[![Backend](https://img.shields.io/badge/API-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://buildfolio-t1vl.onrender.com/health)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![License](https://img.shields.io/badge/License-MIT-fb923c?style=for-the-badge)](LICENSE)

</div>

---

## ✨ What is Buildfolio?

Buildfolio is a full-stack web application that lets anyone — developer, designer, or student — build a professional portfolio website and ATS-optimized resume in minutes. No design skills, no coding knowledge required.

- **Fill** in your details through a clean, guided 6-step wizard
- **Choose** from 5 premium, professionally crafted portfolio templates
- **Optimize** your resume against any job description using Gemini AI
- **Download** your entire portfolio as a ready-to-deploy ZIP file

---

## 🖥️ Live Links

| Service | URL |
|---------|-----|
| 🌐 Frontend (Vercel) | [buildfolio-one.vercel.app](https://buildfolio-one.vercel.app) |
| ⚙️ Backend API (Render) | [buildfolio-t1vl.onrender.com](https://buildfolio-t1vl.onrender.com/health) |
| 📦 GitHub | [github.com/Mdhummad/buildfolio](https://github.com/Mdhummad/buildfolio) |

---

## 🎯 Core Features

### 📝 6-Step Portfolio Builder
A guided wizard that collects everything needed to generate your portfolio and resume:

| Step | What You Fill In |
|------|-----------------|
| Personal | Name, title, summary, email, phone, location, website, profile photo |
| Experience | Company, role, dates, location, achievements (unlimited entries) |
| Education | Institution, degree, field, GPA, dates (unlimited entries) |
| Skills | Technical skills, programming languages, tools & platforms, soft skills |
| Projects | Name, description, tech stack, live demo URL, GitHub URL, featured flag |
| Links | GitHub, LinkedIn, Twitter/X, Dribbble, Medium, LeetCode, certifications |

### 🎨 5 Premium Templates
| Template | Style |
|----------|-------|
| Minimal | Clean, whitespace-focused, corporate-professional |
| Creative | Bold colors, design-forward layout |
| Terminal | Dark code-editor aesthetic with monospace fonts |
| Magazine | Editorial, typographic, print-inspired |
| Glassmorphic | Dark glass UI with blur effects and gradients |

### 🤖 Gemini AI Resume Optimizer
Paste any job description and get back:
- **ATS Score** (0–100) with a visual score ring
- **Matched keywords** already in your profile
- **Missing keywords** from the job description
- **Optimized professional summary** rewritten for the role
- **Reordered skills** prioritized for the JD
- **Experience enhancement tips** with suggested bullet points
- **Score breakdown** by keyword match, experience, skills, and formatting

### 📥 ZIP Export
Download your complete portfolio as a ZIP containing ready-to-deploy HTML, CSS, and JS files — host it on GitHub Pages, Netlify, or anywhere.

### 🔐 Secure Auth System
- JWT-based authentication (7-day tokens)
- bcryptjs password hashing
- Forgot-password email flow with 1-hour expiry tokens
- Auto token invalidation on 401 responses

### ☁️ Cloud Data Persistence
Your portfolio data is saved to MongoDB Atlas and synced across sessions. Log in from any device and pick up where you left off.

---

## 🛠️ Tech Stack

### Frontend
```
React 19          — UI framework
React Router v7   — client-side routing
React Hook Form   — form state management & validation
Axios             — HTTP client
Lucide React      — icon library
Vite 8            — build tool & dev server
TailwindCSS v3    — utility-first styling
Vanilla CSS       — custom design system & animations
Google Fonts      — Cormorant Garamond, Figtree, JetBrains Mono
```

### Backend
```
Node.js + Express — REST API server
Mongoose          — MongoDB ODM
MongoDB Atlas     — cloud database
bcryptjs          — password hashing
jsonwebtoken      — JWT auth
cors              — Cross-Origin Resource Sharing
dotenv            — environment variable management
nodemailer        — password reset emails
archiver          — ZIP file generation
Gemini AI API     — resume optimization (gemini-1.5-flash)
```

### Deployment
```
Vercel    — frontend hosting (auto-deploy from GitHub)
Render    — backend hosting (auto-deploy from GitHub)
```

---

## 📁 Project Structure

```
buildfolio/
├── backend/                    # Express API server
│   ├── middleware/
│   │   └── auth.js             # JWT verification middleware
│   ├── models/
│   │   ├── User.js             # User schema (name, email, hashed password, reset token)
│   │   └── Portfolio.js        # Portfolio data schema (linked to user)
│   ├── routes/
│   │   ├── auth.js             # /api/auth — register, login, forgot/reset password
│   │   ├── portfolio.js        # /api/portfolio — GET and PUT portfolio data
│   │   ├── export.js           # /api/export — generate & stream ZIP download
│   │   └── gemini.js           # /api/gemini — AI resume optimization
│   ├── server.js               # Express app setup, CORS, DB connection
│   └── package.json
│
├── src/                        # React frontend
│   ├── components/
│   │   ├── AuthModal.jsx       # Login/Register overlay modal
│   │   └── Navbar.jsx          # Top navigation bar
│   ├── context/
│   │   ├── AuthContext.jsx     # Auth state (user, token, login, logout)
│   │   └── PortfolioContext.jsx # Portfolio data state + server sync
│   ├── pages/
│   │   ├── LandingPage.jsx     # Marketing homepage
│   │   ├── BuilderPage.jsx     # 6-step portfolio builder wizard
│   │   ├── PreviewPage.jsx     # Live template preview + AI optimizer
│   │   └── TemplatePage.jsx    # Template selection gallery
│   ├── portfolio-templates/
│   │   ├── Template1_Minimal/
│   │   ├── Template2_Creative/
│   │   ├── Template3_Terminal/
│   │   ├── Template4_Magazine/
│   │   └── Template5_Glassmorphic/
│   ├── utils/
│   │   └── api.js              # Axios instance with JWT interceptor
│   └── index.css               # Global design system & animations
│
├── vercel.json                 # Vercel SPA rewrite config
├── render.yaml                 # Render backend deploy config
└── package.json                # Frontend dependencies
```

---

## ⚙️ Local Development Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Google Gemini API key (free at [aistudio.google.com](https://aistudio.google.com/apikey))

### 1. Clone the repo
```bash
git clone https://github.com/Mdhummad/buildfolio.git
cd buildfolio
```

### 2. Setup the backend
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:5173
PORT=5000
GEMINI_API_KEY=your_gemini_api_key

# Optional — for forgot password emails
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
```

Start the backend:
```bash
npm run dev
```

### 3. Setup the frontend
```bash
# from root directory
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 🚀 Deployment

### Frontend — Vercel
1. Connect the GitHub repo to Vercel
2. Framework: **Vite**
3. Add environment variable: `VITE_API_URL = https://your-render-url.onrender.com`
4. Deploy — auto-deploys on every push to `main`

### Backend — Render
1. Connect the GitHub repo to Render
2. **Root Directory:** `backend`
3. **Build Command:** `npm install`
4. **Start Command:** `npm start`
5. Add environment variables (see `.env.example`)
6. Deploy — auto-deploys on every push to `main`

---

## 🔌 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Create new account |
| POST | `/api/auth/login` | ❌ | Login, returns JWT |
| POST | `/api/auth/forgot-password` | ❌ | Send reset email |
| POST | `/api/auth/reset-password` | ❌ | Reset with token |
| GET | `/api/portfolio` | ✅ | Fetch saved portfolio |
| PUT | `/api/portfolio` | ✅ | Save portfolio data |
| POST | `/api/export` | ✅ | Download portfolio ZIP |
| POST | `/api/gemini/optimize-resume` | ✅ | AI resume analysis |
| GET | `/health` | ❌ | Server + DB health check |

---

## 🔒 Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGO_URI` | ✅ | MongoDB Atlas connection string |
| `JWT_SECRET` | ✅ | Secret key for signing JWT tokens |
| `FRONTEND_URL` | ✅ | Frontend URL for CORS (e.g. https://yourapp.vercel.app) |
| `PORT` | ⚠️ Auto-set | Server port (Render injects this automatically) |
| `GEMINI_API_KEY` | 🔵 Optional | Google Gemini API key for AI features |
| `SMTP_HOST` | 🔵 Optional | SMTP host for password reset emails |
| `SMTP_PORT` | 🔵 Optional | SMTP port (usually 587) |
| `SMTP_USER` | 🔵 Optional | SMTP username / Gmail address |
| `SMTP_PASS` | 🔵 Optional | SMTP password / Gmail app password |

### Frontend (Vercel)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | 🔵 Optional | Backend URL override (defaults to Render URL in code) |

---

## 🧪 Health Check

Verify the backend is running:
```
GET https://buildfolio-t1vl.onrender.com/health
```
Expected response:
```json
{ "status": "ok", "time": "...", "db": "connected" }
```

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

<div align="center">

Made with ❤️ by [Mdhummad](https://github.com/Mdhummad)

⭐ Star this repo if you find it useful!

</div>
