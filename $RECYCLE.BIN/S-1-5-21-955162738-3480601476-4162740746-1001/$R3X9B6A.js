import { getAllComplaints, updateComplaintStatus } from './storage.js';

document.addEventListener('DOMContentLoaded', async () => {
    const complaints = await getAllComplaints();
    
    initMap(complaints);
    drawCanvasChart(complaints);
    populateAdminTable(complaints);
    startSLATimers();

    // Data Export Feature
    document.getElementById('exportDataBtn').addEventListener('click', () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(complaints, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", "civic_data_export.json");
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    });

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });
});

// --- PURE CANVAS API ANALYTICS ---
function drawCanvasChart(complaints) {
    const canvas = document.getElementById('analyticsChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Aggregate data by department
    const deptCounts = { 'Water Board': 0, 'Electricity Dept': 0, 'Public Works (Roads)': 0, 'Sanitation': 0 };
    complaints.forEach(c => { if (deptCounts[c.dept] !== undefined) deptCounts[c.dept]++; });

    const departments = Object.keys(deptCounts);
    const counts = Object.values(deptCounts);
    const maxCount = Math.max(...counts, 1); // Avoid division by zero

    // Chart dimensions
    const barWidth = 40;
    const spacing = 50;
    const startX = 40;
    const chartHeight = 200;
    const baseY = 250;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '12px system-ui';
    ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-color');

    departments.forEach((dept, index) => {
        const count = counts[index];
        const barHeight = (count / maxCount) * chartHeight;
        const x = startX + (index * (barWidth + spacing));
        const y = baseY - barHeight;

        // Draw Bar
        ctx.fillStyle = '#0056b3'; // Primary brand color
        ctx.fillRect(x, y, barWidth, barHeight);

        // Draw Value
        ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-color');
        ctx.fillText(count.toString(), x + 15, y - 10);

        // Draw Label (Shortened for space)
        const shortDept = dept.split(' ')[0]; 
        ctx.fillText(shortDept, x - 5, baseY + 20);
    });
}

// --- TABLE & UI POPULATION ---
function populateAdminTable(complaints) {
    const tbody = document.getElementById('adminIssueList');
    tbody.innerHTML = '';
    const fragment = document.createDocumentFragment();

    complaints.forEach(c => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${c.id}</td>
            <td><span class="badge ${c.severity.toLowerCase()}">${c.severity}</span></td>
            <td>${c.dept}</td>
            <td>
                <select class="status-dropdown" data-id="${c.id}">
                    <option value="Open" ${c.status === 'Open' ? 'selected' : ''}>Open</option>
                    <option value="In Progress" ${c.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                    <option value="Resolved" ${c.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
                </select>
            </td>
            <td class="sla-timer" data-timestamp="${c.timestamp}" data-severity="${c.severity}" data-status="${c.status}">
                Calculating...
            </td>
            <td><button class="btn-outline" onclick="alert('Viewing ${c.id}')">View</button></td>
        `;
        fragment.appendChild(tr);
    });
    tbody.appendChild(fragment);

    // Attach status change listeners
    document.querySelectorAll('.status-dropdown').forEach(dropdown => {
        dropdown.addEventListener('change', async (e) => {
            const newStatus = e.target.value;
            // Note: updateComplaintStatus would need to be added to storage.js (fetches item, updates status, puts back)
            // await updateComplaintStatus(e.target.dataset.id, newStatus);
            e.target.parentElement.nextElementSibling.dataset.status = newStatus;
        });
    });
}

// --- SLA COUNTDOWN SIMULATION ---
function startSLATimers() {
    setInterval(() => {
        const timers = document.querySelectorAll('.sla-timer');
        const now = new Date().getTime();

        timers.forEach(timer => {
            if (timer.dataset.status === 'Resolved') {
                timer.innerHTML = `<span style="color: green;">✅ Met SLA</span>`;
                return;
            }

            const createdAt = new Date(timer.dataset.timestamp).getTime();
            let slaHours = 72; // Default Medium/Low
            if (timer.dataset.severity === 'Critical') slaHours = 24;
            if (timer.dataset.severity === 'High') slaHours = 48;

            const deadline = createdAt + (slaHours * 60 * 60 * 1000);
            const distance = deadline - now;

            if (distance < 0) {
                timer.innerHTML = `<span style="color: red; font-weight: bold;">🚨 SLA Breached</span>`;
                return;
            }

            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            
            // Highlight if under 5 hours
            const color = (hours < 5) ? 'red' : 'inherit';
            timer.innerHTML = `<span style="color: ${color}">${hours}h ${minutes}m</span>`;
        });
    }, 60000); // Update every minute to save CPU cycles
}

// --- LEAFLET MAP INTEGRATION ---
function initMap(complaints) {
    // Default to New Delhi coordinates as fallback if no local data
    const map = L.map('adminMap').setView([28.6139, 77.2090], 11);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    const severityColors = {
        'Critical': 'red',
        'High': 'orange',
        'Medium': 'blue',
        'Low': 'gray'
    };

    complaints.forEach(c => {
        if (c.lat && c.lng) {
            // Simulated custom colored markers using basic Leaflet CircleMarkers
            L.circleMarker([c.lat, c.lng], {
                color: severityColors[c.severity] || 'blue',
                radius: 8,
                fillOpacity: 0.8
            })
            .addTo(map)
            .bindPopup(`<b>${c.id}</b><br>${c.dept}<br>Severity: ${c.severity}`);
        }
    });
}