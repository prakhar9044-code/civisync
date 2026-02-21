# 🏙️ CiviSync - Smart City Management System

![Vanilla JS](https://img.shields.io/badge/Vanilla_JS-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-Semantic-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-Custom_Properties-1572B6?style=for-the-badge&logo=css3&logoColor=white)

CiviSync is an offline-capable, Single-Page Application (SPA) built with vanilla web technologies. It serves as a municipal issue tracking and management dashboard, featuring role-based access control (RBAC), GIS mapping, and dynamic state management without the need for a traditional backend infrastructure.

## 🏗️ System Architecture

CiviSync utilizes a lightweight, custom-built DOM-manipulation engine to simulate SPA routing. 

* **View Management:** The application holds all views in the DOM and toggles `.active` and `.hidden` CSS classes to navigate between states (e.g., `view-landing`, `view-track`, `view-admin`) to ensure zero-latency transitions.
* **State Persistence:** Employs the browser's `localStorage` API (`civisync_db_v8`) as a pseudo-database to store user sessions, issue tickets, and audit trails.
* **Offline-First Strategy:** Implements a queuing system (`civisync_offline_v8`). Network status is monitored via `navigator.onLine` and `window.addEventListener('online')` to cache POST requests locally and sync them upon network restoration.

## ⚙️ Core Technical Components

### 1. Web APIs Integrated
* **Geolocation API:** Fetches high-accuracy lat/long coordinates for precise issue mapping.
* **Web Speech API (`webkitSpeechRecognition`):** Enables native voice-to-text dictation for issue descriptions, bypassing the need for external transcription microservices.
* **FileReader API:** Handles client-side image processing, converting uploaded images into Base64 strings for local storage persistence.

### 2. Third-Party Libraries
* **Leaflet.js:** Renders interactive map layers. Issue coordinates are dynamically mapped to `L.marker` instances with custom DOM-node icons based on hazard priority.
* **Chart.js:** Processes local state arrays to generate real-time `<canvas>` visualizations (Doughnut, Pie, and Bar charts) for the analytics dashboard.
* **html2pdf.js:** Manipulates the DOM to generate hidden printable views, converting HTML nodes and CSS styles into downloadable Blob/PDF instances for administrative escalation reports.

### 3. Data Schema (Simulated Payload)
The application handles issue objects utilizing the following JSON structure:
```json
{
  "id": "ISS001",
  "title": "Large pothole on MG Road",
  "category": "Pothole",
  "desc": "Major accident risk. Requires immediate asphalt filling.",
  "location": "MG Road",
  "priority": "high",
  "status": "pending",
  "upvotes": 47,
  "dept": "Public Works",
  "img": "data:image/jpeg;base64,...",
  "lat": 31.6340,
  "lng": 74.8723,
  "budget": "Pending Budget Constraint",
  "volunteers": 2,
  "history": [
    {
      "stat": "pending | Pending Budget Constraint",
      "date": "2026-02-21T10:00:00.000Z",
      "hash": "0x5a2b...f1c"
    }
  ]
}
🚀 Local Development Setup
Because the application relies on fetching external map tiles and parsing Base64 files, serving it over the file:// protocol may trigger Cross-Origin Resource Sharing (CORS) or strict MIME-type security errors in modern browsers.

Prerequisites: Node.js, Python, or the VS Code Live Server extension.

1. Clone the repository

Bash
git clone [https://github.com/YOUR-USERNAME/CiviSync.git](https://github.com/YOUR-USERNAME/CiviSync.git)
cd CiviSync
2. Serve locally
Using Python 3:

Bash
python -m http.server 8000
Using Node.js (http-server):

Bash
npx http-server -p 8000
3. Access the application
Navigate to http://localhost:8000 in your browser.

🔐 Authentication Protocol (Mock)
The handleAuth() function dynamically injects user session data into the global currentUser object.

Citizen Role: Unlocks DOM elements with the .auth-req class, initializes the gamification points state, and routes to Maps('track').

Admin Role: Bypasses gamification UI, unlocks budget/analytics parameters, and routes to Maps('admin'). Admin login: ID: City Admin, Pass: admin123.

🛣️ Roadmap: Backend Migration Path
To transition this prototype into a production-ready full-stack application, the following refactoring roadmap is proposed:

API Layer: Replace getDB() and setDB() local storage handlers with fetch() or Axios calls to a RESTful API (e.g., Express.js or FastAPI).

Database: Migrate the JSON array to a NoSQL (MongoDB) or Relational (PostgreSQL with PostGIS for spatial queries) database.

Authentication: Implement JWT (JSON Web Tokens) or OAuth2.0 to replace the client-side pseudo-auth logic.

Cloud Storage: Migrate Base64 image strings to an S3 bucket (AWS/GCP) and store image URIs in the database to reduce payload overhead.

👨‍💻 Author
Prakhar

GitHub: https://github.com/prakhar9044-code
