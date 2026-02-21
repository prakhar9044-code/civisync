import { saveComplaint, getAllComplaints } from './storage.js';
import { classifySeverity, routeDepartment, isDuplicate } from './ai-engine.js';

document.addEventListener('DOMContentLoaded', () => {
    
    // Theme & Accessibility Toggles
    const themeToggle = document.getElementById('themeToggle');
    if(themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('theme-dark');
            localStorage.setItem('theme', document.body.classList.contains('theme-dark') ? 'dark' : 'light');
        });
    }

    // Auth Simulation
    const authForm = document.getElementById('authForm');
    if (authForm) {
        authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const user = document.getElementById('username').value;
            const role = document.getElementById('roleSelect').value;
            localStorage.setItem('currentUser', JSON.stringify({ user, role }));
            window.location.href = role === 'admin' ? 'admin.html' : 'citizen.html';
        });
    }

    // Citizen Dashboard Logic
    const reportForm = document.getElementById('reportForm');
    if (reportForm) {
        // Geolocation
        document.getElementById('getLocationBtn').addEventListener('click', () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((pos) => {
                    document.getElementById('lat').value = pos.coords.latitude;
                    document.getElementById('lng').value = pos.coords.longitude;
                    document.getElementById('locationDisplay').innerText = `📍 Verified: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`;
                });
            }
        });

        // Submission
        reportForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const desc = document.getElementById('issueDesc').value;
            const lat = parseFloat(document.getElementById('lat').value);
            const lng = parseFloat(document.getElementById('lng').value);

            if (!lat) return alert("Please auto-detect location first.");

            // Smart Features Execution
            const allComplaints = await getAllComplaints();
            const duplicate = allComplaints.find(c => isDuplicate(lat, lng, c.lat, c.lng));
            
            if (duplicate) {
                if(!confirm('A similar issue was reported nearby. Submit anyway?')) return;
            }

            const severity = classifySeverity(desc);
            const dept = routeDepartment(desc);

            const complaint = {
                id: 'CMP-' + Date.now(),
                desc, lat, lng, severity, dept,
                status: 'Open',
                timestamp: new Date().toISOString()
            };

            await saveComplaint(complaint);
            alert(`Report submitted! Routed to ${dept}. Severity: ${severity}`);
            loadCitizenComplaints();
            reportForm.reset();
        });

        loadCitizenComplaints();
    }
});

async function loadCitizenComplaints() {
    const list = document.getElementById('complaintList');
    if (!list) return;
    list.innerHTML = '';
    
    const complaints = await getAllComplaints();
    
    // Fragment for performance optimization
    const fragment = document.createDocumentFragment();
    
    complaints.forEach(c => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div>
                <strong>${c.id}</strong> - ${c.dept}
                <p class="small-text">${c.desc}</p>
            </div>
            <div>
                <span class="badge ${c.severity.toLowerCase()}">${c.severity}</span>
                <span class="badge">${c.status}</span>
            </div>
        `;
        fragment.appendChild(li);
    });
    list.appendChild(fragment);
}