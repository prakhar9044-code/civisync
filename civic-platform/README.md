# 🏙️ CivicPulse — Smart Civic Issue Reporting & Resolution Platform

> **Hackathon Project** | Domain: Smart Cities · GovTech · Civic Innovation

A full-stack platform that empowers citizens to instantly report civic issues while enabling authorities to track, prioritize, and resolve them transparently.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                        │
│  React + Vite · Tailwind CSS · Leaflet Maps · Chart.js         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────────────┐ │
│  │  Auth    │ │ Report   │ │ Dashbrd  │ │  Analytics/Chat   │ │
│  │  Pages   │ │  Form    │ │ Citizen/ │ │  Real-time Socket │ │
│  └──────────┘ │GPS+Voice │ │  Admin   │ └───────────────────┘ │
│               └──────────┘ └──────────┘                        │
└────────────────────────────┬────────────────────────────────────┘
                             │  HTTP/REST + WebSocket (Socket.IO)
┌────────────────────────────▼────────────────────────────────────┐
│                     BACKEND (Node.js/Express)                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────────────┐ │
│  │  Auth    │ │ Reports  │ │Analytics │ │  Socket.IO Server │ │
│  │  JWT     │ │  CRUD    │ │  Routes  │ │  Real-time events │ │
│  └──────────┘ └──────────┘ └──────────┘ └───────────────────┘ │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  AI Utilities: Priority Scoring · Dept Routing · Duplicate  ││
│  │  Detection · Gamification Engine · Audit Hash Chain        ││
│  └─────────────────────────────────────────────────────────────┘│
│  Rate Limiting · JWT Middleware · Multer File Upload           │
└────────────────────────────┬────────────────────────────────────┘
                             │  Mongoose ODM
┌────────────────────────────▼────────────────────────────────────┐
│                       MongoDB Database                          │
│  Users · Reports · Messages                                     │
│  Indexes: geospatial, status+priority, userId, createdAt        │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✨ Features

### Citizen Portal
- 📝 **4-step issue reporting** with GPS auto-detect, drag-and-drop media, and review
- 🎤 **Voice-to-text input** using Web Speech API (en-IN locale)
- 🤖 **AI category suggestion** — real-time NLP keyword analysis while typing
- 📍 **Reverse geocoding** via Nominatim (free, no API key needed)
- 📊 **Real-time status tracking** with progress timeline
- 💬 **Live chat** with authorities per report
- ▲ **Community upvoting** — boosts priority score
- 🏆 **Gamification** — points, badges (First Reporter, Civic Champion, City Guardian)
- 🔔 **Real-time notifications** via WebSocket when status changes

### Authority / Admin Dashboard
- 📋 **All complaints** with advanced filters (status, priority)
- ⚡ **One-click status updates** directly from the table
- 🗺️ **Interactive hotspot map** of all active issues
- 🏛️ **Department performance** analytics with resolution rate bars
- 📡 **Live dashboard** — new reports appear automatically via Socket.IO

### Analytics
- 📊 **Category breakdown** bar chart
- 🍩 **Status distribution** doughnut chart
- 📈 **30-day trend** line chart (submitted vs resolved)
- 🏆 **Civic Champions** leaderboard

### Smart Backend
- 🔀 **Auto-routing** to correct department based on issue category
- 🧠 **AI priority scoring** (0–100) using keyword NLP + category weights
- 🔍 **Duplicate detection** using Haversine distance (100m radius, same category)
- ⛓️ **Blockchain-style audit trail** via SHA-256 hash chaining
- 🔒 **JWT auth** with role-based access (citizen / authority / admin)
- ⚙️ **Rate limiting**, input validation, CORS, secure file uploads

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone & Install

```bash
# Backend
cd backend
cp .env.example .env
# Edit .env: set MONGO_URI, JWT_SECRET
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Seed the Database

```bash
cd backend
npm run seed
```

This creates:
| Role | Email | Password |
|------|-------|---------|
| Admin | admin@civic.gov.in | admin123 |
| Authority | authority@civic.gov.in | auth123 |
| Citizen | priya@email.com | pass123 |

Plus 40 sample reports across New Delhi / NCR.

### 3. Start the App

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# → http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# → http://localhost:5173
```

Open **http://localhost:5173** and log in with any demo account.

---

## 🌐 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Register new user |
| POST | `/api/auth/login` | — | Login |
| GET | `/api/auth/me` | ✅ | Current user profile |
| POST | `/api/reports` | ✅ | Create report (multipart) |
| GET | `/api/reports` | ✅ | List reports (paginated, filterable) |
| GET | `/api/reports/:id` | ✅ | Get single report |
| PUT | `/api/reports/:id/status` | 🔒 authority | Update status |
| POST | `/api/reports/:id/upvote` | ✅ | Toggle upvote |
| GET | `/api/reports/:id/messages` | ✅ | Get chat messages |
| POST | `/api/reports/:id/messages` | ✅ | Send chat message |
| GET | `/api/analytics/overview` | ✅ | Dashboard stats |
| GET | `/api/analytics/by-category` | ✅ | Category breakdown |
| GET | `/api/analytics/trend` | ✅ | 30-day trend |
| GET | `/api/analytics/hotspots` | ✅ | Map hotspot data |
| GET | `/api/analytics/leaderboard` | ✅ | Top citizens |
| GET | `/api/analytics/dept-performance` | 🔒 authority | Dept stats |

---

## 🐳 Docker (Optional)

```bash
# From project root
docker-compose up --build
```

Dockerfile provided for containerized deployment.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, React Router |
| Charts | Chart.js + react-chartjs-2 |
| Maps | Leaflet.js + OpenStreetMap |
| Real-time | Socket.IO |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (jsonwebtoken) |
| File Upload | Multer |
| AI/ML | Custom NLP keyword engine + priority scorer |
| Rate Limiting | express-rate-limit |

---

## 📊 Problem → Solution → Impact

| Problem | Solution | Impact |
|---------|----------|--------|
| 40% issues never reported | Simple 4-step form with GPS + voice | ↑ Report volume |
| Slow reporting systems | AI auto-routing + priority scoring | ↓ Response time |
| No transparency | Real-time status tracking + chat | ↑ Citizen trust |
| Poor dept coordination | Smart routing to correct dept | ↑ Resolution rate |
| No data insights | Analytics dashboard + hotspot maps | Data-driven governance |
| Low civic engagement | Gamification with points & badges | ↑ Community participation |

---

## 📁 Project Structure

```
civic-platform/
├── backend/
│   ├── models/         User.js, Report.js, Message.js
│   ├── routes/         auth.js, reports.js, analytics.js
│   ├── middleware/     auth.js (JWT + RBAC)
│   ├── utils/          prioritize.js, seed.js
│   └── server.js       Express + Socket.IO
└── frontend/
    └── src/
        ├── components/ Navbar, ReportCard, IssueMap, ChatBox, StatsGrid
        ├── pages/      Auth, CitizenDashboard, AdminDashboard,
        │               ReportIssue, ReportDetail, Analytics
        ├── context/    AuthContext.jsx
        └── lib/        api.js, utils.js
```
