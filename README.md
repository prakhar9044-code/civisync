# 🏙️ CiviSync: Next-Generation Smart City Management
**Developed by HACK OVERFLOW**

[![Status](https://img.shields.io/badge/Status-Live-success.svg)]()
[![Version](https://img.shields.io/badge/Version-1.0.0-blue.svg)]()
[![Stack](https://img.shields.io/badge/Stack-Vanilla_JS_%7C_Supabase-purple.svg)]()

CiviSync is a comprehensive, full-stack civic technology platform designed to bridge the critical gap between citizens, municipal authorities, and community NGOs. By utilizing smart automation, real-time geographic tracking, and unparalleled budget transparency, CiviSync eliminates bureaucratic bottlenecks and empowers communities to directly improve their urban environment.

---

## 📋 Table of Contents
- [Core Features](#-core-features)
- [Multi-Tier Architecture](#-multi-tier-architecture)
- [Technical Stack](#-technical-stack)
- [Engineering Highlights](#-engineering-highlights--bug-fixes)
- [Installation & Setup](#-installation--setup)
- [Future Roadmap](#-future-roadmap)

---

## ✨ Core Features

### 📡 Intelligent Issue Uplink (Citizen Reporting)
* **Satellite GPS Locking:** Uses the HTML5 Geolocation API to grab exact Latitude/Longitude coordinates.
* **Voice Dictation to Text:** Integrated Web Speech API allows users to speak their complaints.
* **Local AI Categorization:** Scans descriptions for keywords (e.g., "pipe", "dark", "pothole") to auto-assign the category and priority.
* **Client-Side Media Compression:** Compresses images using HTML Canvas before upload to save bandwidth.

### 🗺️ Interactive Mapping & Tracking
* **Leaflet.js Integration:** Plots all reported issues on a live, interactive city map.
* **Live Crew Tracker:** Issues marked as "In Progress" trigger an animated maintenance truck that drives to the location on the map.
* **Dynamic Grid Filtering:** Search, filter by category, and toggle between List and Map views instantly.

### 🤝 Community Gamification & NGO Hub
* **Civic Economy:** Users earn points (+10 for reporting, +50 for volunteering) that sync to a cloud database.
* **Reward Redemption:** Points can be spent on simulated rewards like Metro Passes or Library Access.
* **The NGO Hub:** When the government runs out of budget, issues are routed here so NGOs can officially pledge funds, materials, or volunteer hours via automated EmailJS proposals.

### 🏛️ Municipal Dashboard & Analytics
* **Budget Management Engine:** Admins can view available funds, review delayed issues, and officially "Approve Funds" to dispatch crews.
* **Data Visualizations:** Beautiful, interactive Doughnut, Pie, Bar, and Line charts showing resolution rates via Chart.js.
* **Automated PDF Generation:** Uses `html2pdf.js` to let admins download formatted Policy Escalation Reports.

### ⚖️ Government Escalation & Transparency
* **Time-Based SLA Automation:** Automatically upgrades issues to Level 1, Level 2, or Level 3 escalations based on days pending.
* **Digital Showcause Notices:** State Govt portal can generate and email legally-formatted warning PDFs to negligent local departments.
* **RTI Draft Generator:** Citizens gain the ability to instantly generate Right To Information (RTI) legal drafts for severely delayed issues.

### 🎨 Premium UI / UX
* **Cybernetic Pre-Loader:** A stunning, 3D rotating multi-ring loader.
* **Scroll-Triggered Animations:** `IntersectionObserver` smoothly fades and slides elements into view as the user scrolls.
* **CiviBot Assistant:** A local rule-based chatbot to navigate users through the platform.

---

## 🔐 Multi-Tier Architecture
CiviSync dynamically adapts its UI, capabilities, and database read/write permissions based on the user's role:
1. **Citizen:** Report issues, upvote community reports, earn points, redeem rewards, and pledge NGO volunteer support.
2. **Authority Admin:** Municipal access to update issue statuses, manage department budgets, view analytics, and generate PDF reports.
3. **State Government:** High-level portal to review SLA-breached issues, track multi-level escalations, and issue digital showcause notices.
4. **Super Admin:** Root-level access to the immutable Audit Trail, logging every database transaction globally.

---

## 🛠️ Technical Stack

**Frontend:**
* HTML5, CSS3 (Custom variables, glassmorphism, responsive grids)
* Vanilla JavaScript (ES6+, Async/Await, IntersectionObserver)
* GSAP (GreenSock) for high-performance animations

**Backend / BaaS:**
* Supabase (PostgreSQL Database, Row Level Security)
* Supabase Auth (OAuth for Google/Facebook/LinkedIn)

**APIs & Libraries:**
* Leaflet.js & OpenStreetMap (Geospatial mapping)
* EmailJS (Serverless OTP and notification dispatching)
* Chart.js (Data analytics)
* html2pdf.js (Client-side PDF rendering)

---

## 🐛 Engineering Highlights & Bug Fixes

We engineered robust failsafes to handle browser and network limitations during development:
* **Crushed the `LockManager` Browser Freeze:** Fixed a notorious Chromium bug where the local database would permanently freeze. We engineered a custom **`Promise.race()` 2.5-second "Anti-Freeze" bypass** that forces the app to load local memory if the database hangs.
* **Master Failsafe Timeouts:** Implemented an absolute `setTimeout` that forcefully destroys the loading screen after 4 seconds, guaranteeing users are never trapped on a loading state.
* **Asynchronous EmailJS Upgrades:** Converted OTP dispatching to a "Fire and Forget" architecture. The UI instantly advances to the next step while the email sends silently in the background, eliminating UI lag.
* **Vercel OAuth Redirect Loops Fixed:** Created a seamless `onAuthStateChange` session catcher so Social Logins immediately apply the user's role and route them without refreshing.

---

## 🚀 Installation & Setup

Since CiviSync operates as a lightweight Single Page Application (SPA) interacting with cloud APIs, setup is instantaneous.

1. Clone the repository:
   ```bash
   git clone [https://github.com/YourUsername/CiviSync.git](https://github.com/YourUsername/CiviSync.git)
Navigate to the project directory:

Bash
cd CiviSync
Run the application:

Open index.html using the Live Server extension in VS Code.

Alternatively, simply drag and drop index.html into your web browser.

(Note: API keys for Supabase and EmailJS are safely scoped via RLS and domain restrictions for this public build).

🔮 Future Roadmap
HACK OVERFLOW envisions scaling CiviSync far beyond its current web capabilities. Our roadmap includes:

Smart City IoT Integration: Connecting physical city infrastructure (like smart streetlights and water pressure sensors) to automatically generate CiviSync tickets without requiring human intervention.

Blockchain Audit Trail: Decentralizing the municipal fund logs and timelines to guarantee 100% tamper-proof financial accountability for taxpayers.

Multi-Lingual Voice AI: Expanding the Voice Dictation feature to auto-translate regional dialects directly to standard English for the central authority dashboards.

Developed with 💻 by HACK OVERFLOW
