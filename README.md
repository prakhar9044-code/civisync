# 🏙️ CiviSync - Smart City Management Platform

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)

**CiviSync** is a next-generation civic technology platform designed to bridge the gap between citizens, NGOs, and municipal authorities. It goes beyond simple issue reporting by introducing AI-driven routing, transparent budget tracking, and community volunteering to build smarter, safer cities together.

## ✨ Key Features

### For Citizens 🧑‍🤝‍🧑
* **Smart Issue Reporting:** Report issues (potholes, leaks, electrical) using text, image uploads, or **voice dictation**.
* **AI-Assisted Routing:** Automatically categorizes reports and routes them to the correct municipal department.
* **Interactive City Map:** Visualize all active city issues and digital safety advisories in real-time using Leaflet.js.
* **Civic Gamification:** Earn points for reporting issues and climb the community leaderboard. Redeem points for civic rewards (e.g., Metro Passes).
* **Offline Mode:** Report issues even without an internet connection. The app automatically syncs your reports once you are back online.

### For Authorities 🛡️
* **Admin Dashboard:** Track department performance, manage high-priority hazards, and update issue statuses.
* **Budget Transparency:** Clearly mark issues that are delayed due to funding constraints so citizens understand *why* a fix is pending.
* **Analytics & Escalation:** View data visualizations (Chart.js) and generate automated, data-driven PDF reports (html2pdf.js) to justify future funding requirements at city planning meetings.

### For NGOs & Community Partners 🤝
* **NGO Hub:** Browse municipal issues that are currently delayed due to budget constraints.
* **Adopt an Issue:** Pledge volunteer hours, funds, or resources to fix community problems when government budgets fall short.

## 🛠️ Tech Stack

This project is built using a modern, lightweight, vanilla front-end stack to ensure speed and simplicity:

* **Frontend:** HTML5, CSS3 (Custom properties, CSS Grid/Flexbox), JavaScript (ES6+)
* **Mapping:** [Leaflet.js](https://leafletjs.com/) (Interactive maps)
* **Analytics:** [Chart.js](https://www.chartjs.org/) (Data visualization)
* **PDF Generation:** [html2pdf.js](https://ekoopmans.github.io/html2pdf.js/)
* **Database:** Simulated via `localStorage` (No backend setup required to test the UI!)

## 🚀 Getting Started

Since CiviSync is a front-end application utilizing `localStorage`, running it locally is incredibly easy.

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/YOUR-USERNAME/CiviSync.git](https://github.com/YOUR-USERNAME/CiviSync.git)
