/* --- JS NAV RIPPLE & TYPEWRITER ANIMATIONS --- */
  function createRipple(event) {
    const button = event.currentTarget;
    const circle = document.createElement("span");
    const d = Math.max(button.clientWidth, button.clientHeight);
    circle.style.width = circle.style.height = `${d}px`;
    circle.style.left = `${event.clientX - button.getBoundingClientRect().left - d/2}px`;
    circle.style.top = `${event.clientY - button.getBoundingClientRect().top - d/2}px`;
    circle.classList.add("ripple");
    const existing = button.getElementsByClassName("ripple")[0]; 
    if(existing) existing.remove();
    button.appendChild(circle);
  }
  
  function triggerHeroAnimation() {
    const els = document.querySelectorAll('.reveal-text');
    els.forEach(el => el.classList.remove('visible'));
    setTimeout(() => els.forEach(el => el.classList.add('visible')), 100);
  }

  let typeInterval;
  function triggerTypewriter() {
    const el = document.getElementById('typewriter-text');
    if(!el) return;
    clearInterval(typeInterval);
    el.innerHTML = '<span id="tw-content"></span><span class="cursor-blink">&nbsp;</span>';
    const contentEl = document.getElementById('tw-content');
    const text = "A Smarter Way to Report,^Track, and Resolve Civic Issues.";
    let idx = 0;
    
    typeInterval = setInterval(() => {
      if(idx < text.length) {
        if(text.charAt(idx) === '^') {
          contentEl.innerHTML += "<br>";
        } else {
          contentEl.innerHTML += text.charAt(idx);
        }
        idx++;
      } else {
        clearInterval(typeInterval);
      }
    }, 50);
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.ripple-element').forEach(btn => btn.addEventListener('click', createRipple));
    triggerHeroAnimation();
    triggerTypewriter();
    
    // Feature 9: Show digital advisory if unread
    setTimeout(() => { 
      document.getElementById('global-advisory').classList.remove('hidden'); 
    }, 1500);
  });

  /* --- DATA & STATE (V8 Clean Wipe) --- */
  const imgPothole = 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80';
  const imgWater = 'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=600&q=80';
  const imgLight = 'https://images.unsplash.com/photo-1510133744874-096980d58fd0?auto=format&fit=crop&w=600&q=80';
  const imgTrash = 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80';
  const imgFlood = 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80';
  const imgTraffic = 'https://images.unsplash.com/photo-1506526611364-16a2468f7d92?auto=format&fit=crop&w=600&q=80';

  let currentFileBase64 = imgPothole; 
  
  function createHash() { 
    return '0x' + Math.random().toString(16).slice(2, 10) + '...' + Math.random().toString(16).slice(2, 6); 
  }

  const defaultDB = [
    { 
      id: 'ISS001', title: 'Large pothole on MG Road', category: 'Pothole', desc: 'Major accident risk. Requires immediate asphalt filling.', location: 'MG Road', 
      priority: 'high', status: 'pending', time: '2d ago', upvotes: 47, dept: 'Public Works', img: imgPothole, lat: 31.6340, lng: 74.8723, 
      budget: 'Pending Budget Constraint', tempAction: '🚧 Warning Sign Installed', volunteers: 2, schedule: 'Next Budget Cycle - Q3 2026', 
      history: [{stat:'pending | Pending Budget Constraint', date:new Date().toISOString(), hash:createHash()}] 
    },
    { 
      id: 'ISS002', title: 'Water leakage from main pipeline', category: 'Water Leak', desc: 'Continuous wastage filling up the street.', location: 'Park Street, Sector 15', 
      priority: 'high', status: 'in progress', time: '1d ago', upvotes: 32, dept: 'Water Department', img: imgWater, lat: 31.6400, lng: 74.8600, 
      budget: 'Funded', tempAction: 'Valve Partially Closed to reduce pressure', volunteers: 0, schedule: 'Immediate Action Taken', 
      history: [{stat:'in progress | Funded', date:new Date().toISOString(), hash:createHash()}] 
    },
    { 
      id: 'ISS003', title: 'Broken streetlight creating safety hazard', category: 'Electrical', desc: 'Dark area at night causing mugging risks.', location: 'Green Avenue', 
      priority: 'medium', status: 'resolved', time: '9d ago', upvotes: 23, dept: 'Electrical', img: imgLight, lat: 31.6200, lng: 74.8800, 
      budget: 'Funded', tempAction: '', volunteers: 0, schedule: 'Completed', 
      history: [{stat:'resolved | Funded', date:new Date().toISOString(), hash:createHash()}] 
    },
    { 
      id: 'ISS004', title: 'Overflowing garbage bins', category: 'Garbage', desc: 'Waste overflowing for 4 days. Strong odor.', location: 'Market Road', 
      priority: 'medium', status: 'pending', time: '2d ago', upvotes: 56, dept: 'Sanitation', img: imgTrash, lat: 31.6500, lng: 74.8500, 
      budget: 'Pending Budget Constraint', tempAction: 'Area Secured & Sanitized Temporarily', volunteers: 14, schedule: 'Weekend Cleanup Drive Scheduled', 
      history: [{stat:'pending | Pending Budget Constraint', date:new Date().toISOString(), hash:createHash()}] 
    }
  ];

  /* FORCE DB WIPE WITH V8 */
  function getDB() { 
    if(!localStorage.getItem('civisync_db_v8')) {
      localStorage.setItem('civisync_db_v8', JSON.stringify(defaultDB)); 
    }
    return JSON.parse(localStorage.getItem('civisync_db_v8')); 
  }
  
  function setDB(data) { 
    localStorage.setItem('civisync_db_v8', JSON.stringify(data)); 
  }

  let currentUser = null; 
  let trackTabActive = 'All'; 
  let mapInstance = null; 
  let dedicatedMapInstance = null; 
  let activeModalIssueId = null; 
  let charts = {};

  /* --- OFFLINE SYNC --- */
  window.addEventListener('online', syncOfflineQueue);
  window.addEventListener('offline', () => document.getElementById('offline-banner').style.display = 'block');

  function syncOfflineQueue() {
    document.getElementById('offline-banner').style.display = 'none';
    let queue = JSON.parse(localStorage.getItem('civisync_offline_v8') || '[]');
    if(queue.length > 0) {
      let db = getDB(); 
      db = [...queue, ...db]; 
      setDB(db); 
      localStorage.removeItem('civisync_offline_v8');
      alert(`Synced ${queue.length} reports submitted while offline!`);
      if(document.getElementById('view-track').classList.contains('active')) {
        renderTrack();
      }
    }
  }

  /* --- GLOBAL RE-RENDER HELPER --- */
  function reRenderAllActive() {
    renderTrack();
    if(document.getElementById('view-admin').classList.contains('active')) renderAdmin();
    if(document.getElementById('view-budget').classList.contains('active')) renderBudget();
    if(document.getElementById('view-ngo').classList.contains('active')) renderNgo();
    if(document.getElementById('view-analytics').classList.contains('active')) renderAnalytics();
    if(document.getElementById('view-leaderboard').classList.contains('active')) updateLeaderboard();
  }

  /* --- AUTH & NAVIGATION --- */
  function toggleTheme() { 
    document.body.classList.toggle('dark-theme'); 
  }
  
  function navigate(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(`view-${viewId}`).classList.add('active');
    
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    if(document.getElementById(`nav-${viewId}`)) {
      document.getElementById(`nav-${viewId}`).classList.add('active');
    }
    
    if(viewId === 'landing') { triggerHeroAnimation(); triggerTypewriter(); }
    if(viewId === 'track') renderTrack();
    if(viewId === 'admin') renderAdmin();
    if(viewId === 'analytics') renderAnalytics();
    if(viewId === 'map') initDedicatedMap();
    if(viewId === 'ngo') renderNgo();
    if(viewId === 'budget') renderBudget();
    if(viewId === 'leaderboard') updateLeaderboard();
    
    // Bind profile values dynamic
    if(viewId === 'profile' && currentUser) {
      document.getElementById('prof-name').innerText = currentUser.name;
      document.getElementById('prof-email').innerText = currentUser.email;
      document.getElementById('prof-avatar').innerText = currentUser.name.charAt(0).toUpperCase();
      document.getElementById('prof-pts').innerText = currentUser.points;
      document.getElementById('prof-reported').innerText = currentUser.reported;
      document.getElementById('prof-vol').innerText = currentUser.volunteered;
      document.getElementById('prof-role-badge').innerText = currentUser.role === 'admin' ? "Authority" : "Citizen";
    }
    if(viewId === 'points' && currentUser) { 
      document.getElementById('manage-pts').innerText = currentUser.points; 
    }
    window.scrollTo(0,0);
  }
  
  function checkAuthAndGo(viewId) { 
    if(!currentUser || currentUser.role !== 'citizen') { 
      alert("Please login to access this feature."); 
      navigate('auth'); 
      switchAuthTab('citizen'); 
    } else {
      navigate(viewId);
    }
  }
  
  function switchAuthTab(type) {
    document.getElementById('area-cit').style.animation='none'; 
    document.getElementById('form-adm').style.animation='none';
    
    document.getElementById('area-cit').classList.toggle('hidden', type !== 'citizen'); 
    document.getElementById('form-adm').classList.toggle('hidden', type !== 'admin');
    
    setTimeout(() => { 
      document.getElementById('area-cit').style.animation=''; 
      document.getElementById('form-adm').style.animation=''; 
    }, 10);
    
    const tCit = document.getElementById('tab-cit'); 
    const tAdm = document.getElementById('tab-adm');
    
    if(type === 'citizen') { 
      tCit.style.borderBottomColor='var(--primary)'; 
      tCit.style.color='var(--primary)'; 
      tAdm.style.borderBottomColor='transparent'; 
      tAdm.style.color='var(--text-secondary)'; 
    } else { 
      tAdm.style.borderBottomColor='var(--primary)'; 
      tAdm.style.color='var(--primary)'; 
      tCit.style.borderBottomColor='transparent'; 
      tCit.style.color='var(--text-secondary)'; 
    }
  }
  
  function toggleCitAuth(action) {
    document.getElementById('form-cit-login').style.animation='none'; 
    document.getElementById('form-cit-register').style.animation='none';
    
    document.getElementById('form-cit-login').classList.toggle('hidden', action !== 'login'); 
    document.getElementById('form-cit-register').classList.toggle('hidden', action !== 'register');
    document.getElementById('btn-login-cit').classList.toggle('active', action === 'login'); 
    document.getElementById('btn-reg-cit').classList.toggle('active', action === 'register');
    
    setTimeout(() => { 
      document.getElementById('form-cit-login').style.animation=''; 
      document.getElementById('form-cit-register').style.animation=''; 
    }, 10);
  }
  
  function handleAuth(e, type) {
    e.preventDefault(); 
    
    // Capture Dynamic User Info
    let uName = "User";
    let uEmail = "user@example.com";

    if(type === 'citizen') {
      const formId = e.target.id;
      if(formId === 'form-cit-register') {
        uName = e.target.querySelectorAll('input[type="text"]')[0].value || "Citizen";
        uEmail = e.target.querySelectorAll('input[type="email"]')[0].value;
      } else {
        uEmail = e.target.querySelectorAll('input[type="email"]')[0].value;
        uName = uEmail.split('@')[0]; // Quick mock name from email
      }
    } else {
      uName = "City Admin";
      uEmail = e.target.querySelectorAll('input[type="text"]')[0].value;
    }

    currentUser = { 
      name: uName, 
      email: uEmail, 
      role: type, 
      points: 150, 
      reported: 0, 
      volunteered: 0 
    }; 
    
    // UI Update - Setup Avatar Dropdown
    document.getElementById('btn-auth').classList.add('hidden');
    document.getElementById('user-menu-container').classList.remove('hidden');
    document.getElementById('avatar-initials').innerText = uName.charAt(0).toUpperCase();
    document.getElementById('drop-name').innerText = uName;
    document.getElementById('drop-email').innerText = uEmail;
    
    // Show authorized links
    document.querySelectorAll('.auth-req').forEach(el => el.classList.remove('hidden'));

    if(type === 'citizen') { 
      document.getElementById('user-points').classList.remove('hidden'); 
      document.getElementById('pts-val').innerText = currentUser.points; 
      
      // Hide Admin specific stuff
      document.getElementById('nav-admin').classList.add('hidden');
      document.getElementById('nav-budget').classList.add('hidden');
      document.getElementById('nav-analytics').classList.add('hidden');
      
      // FIX 3: Route Citizens directly to the Issues Dashboard after Login
      navigate('track'); 
    } else { 
      // Hide Citizen specific stuff
      document.getElementById('nav-points').classList.add('hidden');
      document.getElementById('nav-ngo').classList.add('hidden');
      document.getElementById('nav-leaderboard').classList.add('hidden');
      document.getElementById('user-points').classList.add('hidden');
      
      // FIX 3: Route Authorities directly to the Admin Dashboard after Login
      navigate('admin'); 
    }
  }
  
  function logout() { 
    currentUser = null; 
    document.getElementById('btn-auth').classList.remove('hidden'); 
    document.getElementById('user-menu-container').classList.add('hidden');
    
    // Hide auth-req elements
    document.querySelectorAll('.auth-req').forEach(el => el.classList.add('hidden'));
    document.getElementById('user-points').classList.add('hidden'); 
    
    navigate('landing'); 
  }

  function updateLeaderboard() {
    if(currentUser) {
      document.getElementById('lb-current-user').innerText = currentUser.name + " (You)";
      document.getElementById('lb-current-issues').innerText = currentUser.reported + currentUser.volunteered;
      document.getElementById('lb-current-points').innerText = currentUser.points;
    }
  }

  /* --- REPORT ISSUE --- */
  function getLocation() { 
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => { 
        document.getElementById('repLoc').value = `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`; 
      }, () => alert("Location denied.")); 
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }
  
  function handleImageUpload(e) { 
    const file = e.target.files[0];
    if(file) {
      const r = new FileReader(); 
      r.onload = ev => { 
        currentFileBase64 = ev.target.result; 
        document.getElementById('uploadStatus').innerText="✓ Image ready"; 
      }; 
      r.readAsDataURL(file); 
    }
  }
  
  function startDictation() {
    if(window.webkitSpeechRecognition) {
      const rec = new webkitSpeechRecognition(); 
      rec.start(); 
      const b = document.getElementById('btnMic'); 
      b.classList.add('recording');
      
      rec.onresult = e => { 
        document.getElementById('repDesc').value += e.results[0][0].transcript; 
        triggerAICategorization(); 
        b.classList.remove('recording'); 
      };
      
      rec.onerror = () => {
        alert("Speech recognition failed or was cancelled.");
        b.classList.remove('recording');
      };
    } else {
      alert("Speech recognition not supported in this browser. Try Google Chrome.");
    }
  }
  
  function triggerAICategorization() {
    const t = document.getElementById('repDesc').value.toLowerCase(); 
    const s = document.getElementById('repCat');
    const tag = document.getElementById('aiTag');
    
    let found = false;
    if(t.includes('pothole') || t.includes('road')) { s.value='Pothole'; found = true; } 
    else if(t.includes('water') || t.includes('leak') || t.includes('pipe')) { s.value='Water Leak'; found = true; } 
    else if(t.includes('light') || t.includes('dark')) { s.value='Electrical'; found = true; }
    
    if(found) {
      tag.style.display = 'inline-block';
      setTimeout(() => { tag.style.display = 'none'; }, 3000);
    }
  }
  
  function submitReport(e) {
    e.preventDefault();
    const cat = document.getElementById('repCat').value;
    const desc = document.getElementById('repDesc').value;
    const routing = {'Pothole':'Public Works', 'Water Leak':'Water Department', 'Electrical':'Electrical', 'Garbage':'Sanitation', 'Drainage':'Public Works', 'Traffic':'Traffic'};
    const isHigh = desc.toLowerCase().includes('accident') || desc.toLowerCase().includes('flood') || desc.toLowerCase().includes('danger');
    
    const issue = { 
      id: `ISS00${Math.floor(Math.random()*900)+100}`, 
      title: document.getElementById('repTitle').value, 
      category: cat, 
      desc: desc, 
      location: document.getElementById('repLoc').value, 
      priority: isHigh ? 'high' : 'medium', 
      status: 'pending', 
      time: 'Just now', 
      upvotes: 0, 
      dept: routing[cat] || 'General', 
      img: currentFileBase64, 
      lat: 31.63 + (Math.random()*0.02 - 0.01), 
      lng: 74.87 + (Math.random()*0.02 - 0.01), 
      budget: 'Pending Budget Constraint', 
      tempAction: '', 
      volunteers: 0, 
      schedule: 'Awaiting Assessment', 
      history: [{stat:'pending | Pending Budget Constraint', date:new Date().toISOString(), hash:createHash()}] 
    };
    
    if(!navigator.onLine) {
      let q = JSON.parse(localStorage.getItem('civisync_offline_v8') || '[]');
      q.push(issue); 
      localStorage.setItem('civisync_offline_v8', JSON.stringify(q));
      alert("Saved offline. Will sync when connected.");
    } else {
      let db = getDB(); 
      db.unshift(issue); 
      setDB(db);
    }

    if(currentUser){ 
      currentUser.points += 10;
      currentUser.reported += 1; // Update Profile Stats 
      document.getElementById('pts-val').innerText = currentUser.points; 
    }
    
    e.target.reset(); 
    currentFileBase64 = imgPothole; 
    document.getElementById('uploadStatus').innerText = '';
    
    alert(`Report submitted successfully! Tracking ID: ${issue.id}`);
    
    // Globally re-render to update the tables instantly
    reRenderAllActive();
    navigate('track');
  }

  /* --- TRACK ISSUES & MAPS --- */
  function setTrackTab(tab, el) { 
    trackTabActive = tab; 
    document.querySelectorAll('.tab-pill').forEach(t=>t.classList.remove('active')); 
    el.classList.add('active'); 
    renderTrack(); 
  }
  
  function switchTrackView(v) {
    const isL = v === 'list'; 
    document.getElementById('track-list-container').classList.toggle('hidden',!isL); 
    document.getElementById('track-map-container').classList.toggle('hidden',isL);
    
    const btnL = document.getElementById('btn-list-view'); 
    const btnM = document.getElementById('btn-map-view');
    
    if(isL) {
      btnL.style.background = 'var(--bg-app)'; btnL.style.color = 'var(--primary)'; btnL.style.fontWeight = '600';
      btnM.style.background = 'transparent'; btnM.style.color = 'var(--text-secondary)'; btnM.style.fontWeight = '500';
    } else {
      btnM.style.background = 'var(--bg-app)'; btnM.style.color = 'var(--primary)'; btnM.style.fontWeight = '600';
      btnL.style.background = 'transparent'; btnL.style.color = 'var(--text-secondary)'; btnL.style.fontWeight = '500';
      initMap();
    }
  }
  
  function getBadgeHTML(t, v) {
    if(t === 'status') return `<span class="badge badge-${v.replace(' ','-')} status-badge">${v.toUpperCase()}</span>`;
    return `<span class="badge badge-${v}">${v}</span>`;
  }
  
  function renderTrack() {
    let db = getDB();
    
    document.getElementById('cnt-all').innerText = db.length; 
    document.getElementById('cnt-pen').innerText = db.filter(i=>i.status==='pending').length;
    document.getElementById('cnt-prog').innerText = db.filter(i=>i.status==='in progress').length;
    document.getElementById('cnt-res').innerText = db.filter(i=>i.status==='resolved').length;
    
    const search = document.getElementById('trackSearch').value.toLowerCase();
    const cat = document.getElementById('trackCatFilter').value;
    
    if(search) db = db.filter(i => i.title.toLowerCase().includes(search) || i.desc.toLowerCase().includes(search));
    if(cat) db = db.filter(i => i.category === cat);
    if(trackTabActive !== 'All') db = db.filter(i => i.status === trackTabActive);
    
    const cont = document.getElementById('track-list-container');
    
    if(db.length === 0) { 
      cont.innerHTML = '<p class="text-muted" style="grid-column: 1/-1; text-align:center; padding: 2rem;">No issues found matching your filters.</p>'; 
      return; 
    }
    
    cont.innerHTML = db.map(i => `
      <div class="issue-card-clean" onclick="openModal('${i.id}')">
        <div class="issue-img-wrapper">
          ${getBadgeHTML('status', i.status)}
          <img src="${i.img}" onerror="this.src='${imgPothole}'">
        </div>
        <div class="issue-card-content">
          <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
            <span class="text-xs text-muted font-monospace">${i.id}</span>
            ${getBadgeHTML('priority', i.priority)}
          </div>
          <h3 style="font-size:1.05rem; margin-bottom:0.5rem;">${i.title}</h3>
          ${i.budget.includes('Pending') ? `<span style="font-size:0.75rem; color:#b45309; background:#fef3c7; padding:2px 6px; border-radius:4px; margin-bottom:10px; display:inline-block;">⚠️ Budget Delayed</span>` : ''}
          <div style="display:flex; justify-content:space-between; border-top:1px solid var(--border); padding-top:0.75rem; margin-top:auto;">
            <span class="badge badge-outline">${i.category}</span>
            <span class="text-xs text-primary font-medium">⬆ ${i.upvotes} Upvotes</span>
          </div>
        </div>
      </div>`).join('');
  }
  
  function initMap() { 
    if(!mapInstance){ 
      mapInstance = L.map('leaflet-map').setView([31.634, 74.872], 13); 
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapInstance); 
    }
    mapInstance.eachLayer(l => { if(l instanceof L.Marker) mapInstance.removeLayer(l); });
    
    getDB().forEach(i => {
      if(i.lat && i.lng) {
        const color = i.priority==='high' ? '#ef4444' : (i.priority==='medium' ? '#f59e0b' : '#10b981');
        const icon = L.divIcon({className: 'custom-icon', html: `<div style="background:${color}; width:16px; height:16px; border-radius:50%; border:2px solid white; box-shadow:0 0 4px rgba(0,0,0,0.4);"></div>`});
        L.marker([i.lat, i.lng], {icon}).addTo(mapInstance).bindPopup(`<b>${i.id}</b><br>${i.category}<br><button class="btn btn-outline text-xs" style="margin-top:5px;" onclick="openModal('${i.id}')">View Details</button>`);
      }
    });
    setTimeout(() => mapInstance.invalidateSize(), 100);
  }
  
  function initDedicatedMap() { 
    if(!dedicatedMapInstance){ 
      dedicatedMapInstance = L.map('dedicated-map').setView([31.634, 74.872], 13); 
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(dedicatedMapInstance); 
    }
    dedicatedMapInstance.eachLayer(l => { if(l instanceof L.Marker) dedicatedMapInstance.removeLayer(l); });
    
    getDB().forEach(i => {
      if(i.lat && i.lng) {
        const color = i.priority==='high' ? '#ef4444' : (i.priority==='medium' ? '#f59e0b' : '#10b981');
        const icon = L.divIcon({className: 'custom-icon', html: `<div style="background:${color}; width:16px; height:16px; border-radius:50%; border:2px solid white; box-shadow:0 0 4px rgba(0,0,0,0.4);"></div>`});
        L.marker([i.lat, i.lng], {icon}).addTo(dedicatedMapInstance).bindPopup(`<b>${i.title}</b><br>${i.status}<br><button class="btn btn-outline text-xs" style="margin-top:5px;" onclick="openModal('${i.id}')">View Details</button>`);
      }
    });
    setTimeout(() => dedicatedMapInstance.invalidateSize(), 100);
  }

  /* --- NGO HUB --- */
  function renderNgo() {
    const db = getDB();
    const unfunded = db.filter(i => i.budget.includes('Pending'));
    const cont = document.getElementById('ngo-issue-list');
    
    if(unfunded.length === 0) {
      cont.innerHTML = '<p class="text-muted" style="grid-column: 1/-1; text-align:center;">No unfunded issues right now! Great job city.</p>';
      return;
    }
    
    cont.innerHTML = unfunded.map(i => `
      <div class="issue-card-clean" style="border-color: var(--purple);">
        <div class="issue-img-wrapper"><img src="${i.img}" onerror="this.src='${imgPothole}'"></div>
        <div class="issue-card-content">
          <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
            <span class="text-xs text-muted">${i.id}</span>
            <span class="badge badge-high">Unfunded</span>
          </div>
          <h3 style="font-size:1.05rem; margin-bottom:0.5rem;">${i.title}</h3>
          <p class="text-xs text-muted mb-2">📍 ${i.location}</p>
          <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border); padding-top:0.75rem; margin-top:auto;">
            <span class="text-xs text-purple font-medium">👥 ${i.volunteers} Volunteers</span>
            <button class="btn text-xs" style="background:var(--purple); color:white; border-radius:50px; cursor:pointer;" onclick="pledgeSupport('${i.id}')">Pledge / Adopt</button>
          </div>
        </div>
      </div>`).join('');
  }
  
  function pledgeSupport(id) {
    if(!currentUser || currentUser.role !== 'citizen') return alert("Please log in as an NGO/Citizen first.");
    let db = getDB(); 
    let idx = db.findIndex(i => i.id === id); 
    db[idx].volunteers += 5; // Simulating a group adoption
    setDB(db);
    
    if(currentUser) currentUser.volunteered += 1;

    alert(`Thank you! Your NGO has pledged support for Issue ${id}. The city admin has been notified.`);
    reRenderAllActive();
  }

  /* --- BUDGET MANAGEMENT --- */
  function renderBudget() {
    const db = getDB();
    const pendingIssues = db.filter(i => i.budget.includes('Pending'));
    const tbody = document.getElementById('budget-approval-table');
    
    if(pendingIssues.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted" style="padding: 2rem;">All issues are currently funded.</td></tr>';
      return;
    }
    
    tbody.innerHTML = pendingIssues.map(i => {
      const cost = i.priority === 'high' ? '₹75,000' : '₹25,000';
      return `
      <tr>
        <td><span class="table-id">${i.id}</span></td>
        <td>
          <div class="font-medium">${i.title}</div>
          <div class="text-xs text-muted">📍 ${i.location}</div>
        </td>
        <td><span class="badge badge-outline">${i.dept}</span></td>
        <td class="font-medium" style="color:var(--danger);">${cost}</td>
        <td><button type="button" class="btn btn-success text-xs" style="border-radius:50px; position:relative; z-index:10; cursor:pointer;" onclick="allocateFunds('${i.id}'); event.stopPropagation();">Approve Funds</button></td>
      </tr>
      `;
    }).join('');
  }
  
  function allocateFunds(id) {
    let db = getDB(); 
    let idx = db.findIndex(i => i.id === id); 
    db[idx].budget = 'Funded'; 
    db[idx].status = 'in progress';
    db[idx].history.push({stat: 'in progress | Funded', date: new Date().toISOString(), hash: createHash()}); 
    setDB(db);
    alert(`Funds successfully allocated for Issue ${id}. Status changed to 'In Progress'.`);
    reRenderAllActive();
  }

  /* --- MODAL LOGIC --- */
  function openModal(id) {
    activeModalIssueId = id; 
    const iss = getDB().find(i => i.id === id); 
    if(!iss) return;
    
    document.getElementById('mod-title').innerText = iss.title; 
    document.getElementById('mod-id').innerText = iss.id;
    document.getElementById('mod-time').innerText = iss.time; 
    document.getElementById('mod-cat').innerText = iss.category;
    document.getElementById('mod-prio').innerHTML = getBadgeHTML('priority', iss.priority); 
    document.getElementById('mod-stat').innerHTML = getBadgeHTML('status', iss.status);
    
    const modImg = document.getElementById('mod-img');
    modImg.src = iss.img; 
    modImg.onerror = function() { this.src = imgPothole; };

    document.getElementById('mod-desc').innerText = iss.desc;
    
    let budgCol = iss.budget.includes('Funded') ? 'var(--success)' : (iss.budget.includes('Pending') ? 'var(--danger)' : 'var(--warning)');
    document.getElementById('mod-budget-badge').innerHTML = `<span style="background:transparent; border:1px solid ${budgCol}; color:${budgCol}; padding:4px 8px; border-radius:4px; font-size:0.75rem; font-weight:600;">${iss.budget}</span>`;
    document.getElementById('mod-schedule').innerText = "📅 Schedule: " + iss.schedule;

    const tempSec = document.getElementById('mod-temp-sec');
    if(iss.tempAction) { tempSec.innerHTML = `<div class="temp-action-banner"><span>${iss.tempAction}</span></div>`; } 
    else { tempSec.innerHTML = ''; }

    document.getElementById('mod-vol-count').innerText = iss.volunteers;
    document.getElementById('mod-dept').innerText = iss.dept; 
    document.getElementById('mod-upv-cnt').innerText = iss.upvotes;
    
    document.getElementById('mod-timeline').innerHTML = iss.history.map(h => `
      <div class="log-entry">
        <strong style="text-transform:uppercase;">${h.stat.split('|')[0]}</strong> - ${new Date(h.date).toLocaleString()}
        <br><span class="hash-text">Hash: ${h.hash}</span>
      </div>
    `).join('');
    
    document.getElementById('admin-update-area').classList.toggle('hidden', !currentUser || currentUser.role !== 'admin');
    
    if(currentUser && currentUser.role === 'admin') {
      document.getElementById('admin-sel-stat').value = iss.status;
      // Safeguard: Check if the options match the string, otherwise keep empty
      let matchingOption = Array.from(document.getElementById('admin-sel-budget').options).find(opt => opt.value === iss.budget);
      if(matchingOption) document.getElementById('admin-sel-budget').value = iss.budget;
    }
    
    document.getElementById('modal').classList.add('open');
  }
  
  function closeModal() { 
    document.getElementById('modal').classList.remove('open'); 
    activeModalIssueId = null; 
  }
  
  function upvoteIssue() {
    if(!currentUser || currentUser.role !== 'citizen') return alert("Citizen login required.");
    let db = getDB(); let idx = db.findIndex(i => i.id === activeModalIssueId); 
    db[idx].upvotes++; setDB(db); 
    document.getElementById('mod-upv-cnt').innerText = db[idx].upvotes;
    
    reRenderAllActive();
  }
  
  function volunteerForIssue() {
    if(!currentUser || currentUser.role !== 'citizen') return alert("Please login as a Citizen to volunteer.");
    let db = getDB(); let idx = db.findIndex(i => i.id === activeModalIssueId); 
    db[idx].volunteers++; setDB(db); 
    document.getElementById('mod-vol-count').innerText = db[idx].volunteers;
    
    if(currentUser) currentUser.volunteered += 1;

    alert("Thank you! You have adopted this issue. The community action team will email you details.");
    reRenderAllActive();
  }
  
  function adminSaveStatus() {
    const s = document.getElementById('admin-sel-stat').value; 
    const b = document.getElementById('admin-sel-budget').value;
    let db = getDB(); let idx = db.findIndex(i => i.id === activeModalIssueId); 
    
    db[idx].status = s; 
    db[idx].budget = b; 
    db[idx].history.push({stat: `${s} | ${b}`, date: new Date().toISOString(), hash: createHash()}); 
    setDB(db);
    
    alert("Issue updated successfully!");
    closeModal();
    reRenderAllActive(); // Instantly update the authority dashboard
  }

  /* --- ADMIN DASHBOARD & REAL PDF GENERATION --- */
  function generatePDFReport() {
    const element = document.getElementById('pdf-content');
    const tbody = document.getElementById('pdf-table-body');
    const db = getDB();
    
    const delayed = db.filter(i => i.priority === 'high' || i.budget.includes('Pending'));
    
    document.getElementById('pdf-date').innerText = new Date().toLocaleDateString();
    
    if(delayed.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" style="padding:10px; text-align:center;">No critical or delayed issues at this time.</td></tr>';
    } else {
      tbody.innerHTML = delayed.map(i => `
        <tr>
          <td style="padding: 10px; border: 1px solid #e2e8f0; font-family: monospace;">${i.id}</td>
          <td style="padding: 10px; border: 1px solid #e2e8f0;">${i.title}</td>
          <td style="padding: 10px; border: 1px solid #e2e8f0;">${i.dept}</td>
          <td style="padding: 10px; border: 1px solid #e2e8f0; color: ${i.budget.includes('Pending') ? '#ef4444' : '#10b981'}; font-weight: bold;">${i.budget}</td>
        </tr>
      `).join('');
    }

    element.classList.remove('hidden');

    const opt = {
      margin:       0.5,
      filename:     'CiviSync-Escalation-Report.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      element.classList.add('hidden');
    });
  }
  
  function renderAdmin() {
    const db = getDB();
    const total = db.length;
    const pending = db.filter(i=>i.status==='pending').length;
    const delayed = db.filter(i=>i.budget.includes('Pending')).length;
    const resolved = db.filter(i=>i.status==='resolved').length;
    
    document.getElementById('admin-stats-top').innerHTML = `
      <div class="admin-stat-card"><p class="text-xs text-muted">Total Issues</p><div style="display:flex; justify-content:space-between; align-items:flex-end;"><h2 style="font-size:2.5rem; line-height:1;">${total}</h2><div class="icon-circle" style="background:var(--primary-light); color:var(--primary); width:30px; height:30px; font-size:0.9rem;">i</div></div></div>
      <div class="admin-stat-card"><p class="text-xs text-muted">Pending Fixes</p><div style="display:flex; justify-content:space-between; align-items:flex-end;"><h2 style="font-size:2.5rem; line-height:1;">${pending}</h2><div class="icon-circle" style="background:var(--warning-bg); color:var(--warning); width:30px; height:30px; font-size:0.9rem;">🕒</div></div></div>
      <div class="admin-stat-card"><p class="text-xs text-muted">Budget Delayed</p><div style="display:flex; justify-content:space-between; align-items:flex-end;"><h2 style="font-size:2.5rem; line-height:1; color:var(--danger);">${delayed}</h2><div class="icon-circle" style="background:var(--danger-bg); color:var(--danger); width:30px; height:30px; font-size:0.9rem;">⚠️</div></div></div>
      <div class="admin-stat-card"><p class="text-xs text-muted">Resolved</p><div style="display:flex; justify-content:space-between; align-items:flex-end;"><h2 style="font-size:2.5rem; line-height:1;">${resolved}</h2><div class="icon-circle" style="background:var(--success-bg); color:var(--success); width:30px; height:30px; font-size:0.9rem;">✅</div></div></div>
    `;
    
    const hpList = db.filter(i => i.priority === 'high' && i.status !== 'resolved');
    document.getElementById('hp-count-badge').innerText = `${hpList.length} Active`;
    
    document.getElementById('admin-hp-list').innerHTML = hpList.map(i => `
      <div class="hp-issue-item" onclick="openModal('${i.id}')">
        <div>
          <div class="font-semibold text-sm text-primary"><span style="color:var(--danger); margin-right:0.5rem;">!</span>${i.title}</div>
          <div class="text-xs text-muted mt-1" style="margin-left: 1.2rem;">${i.budget.includes('Pending') ? '⚠️ Budget Hold' : '📍 ' + i.location}</div>
        </div>
        ${getBadgeHTML('status', i.status)}
      </div>
    `).join('');
    
    document.getElementById('admin-dept-progress').innerHTML = ['Public Works', 'Water Department', 'Electrical', 'Sanitation', 'Traffic'].map(d => {
      const t = db.filter(i => i.dept === d).length; 
      const r = db.filter(i => i.dept === d && i.status === 'resolved').length; 
      const p = t === 0 ? 0 : (r/t)*100;
      return `<div class="progress-wrapper"><div class="progress-info"><span>${d}</span><span>${r}/${t} resolved</span></div><div class="progress-track"><div class="progress-bar" style="width:${p}%;"></div></div></div>`;
    }).join('');
    
    /* FIX: Button completely stripped of overlay interactions to guarantee it works */
    document.getElementById('admin-table-body').innerHTML = db.map(i => `
      <tr>
        <td><span class="table-id">${i.id}</span></td>
        <td class="font-medium">${i.title}</td>
        <td>${i.budget.includes('Pending') ? `<span style="color:var(--danger); font-weight:600;">${i.budget}</span>` : i.budget}</td>
        <td>${getBadgeHTML('status', i.status)}</td>
        <td><button type="button" class="btn btn-outline text-xs" style="position:relative; z-index:20; cursor:pointer;" onclick="openModal('${i.id}'); event.stopPropagation();">View / Manage</button></td>
      </tr>
    `).join('');
  }

  /* --- ANALYTICS (CHART.JS) --- */
  function renderAnalytics() {
    const db = getDB(); 
    const total = db.length || 1; 
    const pen = db.filter(i => i.status === 'pending').length; 
    const prog = db.filter(i => i.status === 'in progress').length; 
    const res = db.filter(i => i.status === 'resolved').length; 
    const hi = db.filter(i => i.priority === 'high').length; 
    const med = db.filter(i => i.priority === 'medium').length; 
    const low = db.filter(i => i.priority === 'low').length;

    document.getElementById('an-rate').innerText = `${Math.round((res/total)*100)}%`; 
    document.getElementById('an-hp').innerText = hi;
    
    if(charts.status) charts.status.destroy();
    charts.status = new Chart(document.getElementById('chart-status'), {
      type: 'doughnut',
      data: { labels: ['Pending', 'In Progress', 'Resolved'], datasets: [{ data: [pen, prog, res], backgroundColor: ['#f59e0b', '#3b82f6', '#10b981'] }] },
      options: { responsive: true, maintainAspectRatio: false }
    });

    if(charts.priority) charts.priority.destroy();
    charts.priority = new Chart(document.getElementById('chart-priority'), {
      type: 'pie',
      data: { labels: ['High', 'Medium', 'Low'], datasets: [{ data: [hi, med, low], backgroundColor: ['#ef4444', '#f59e0b', '#10b981'] }] },
      options: { responsive: true, maintainAspectRatio: false }
    });

    const cats = ['Pothole', 'Water Leak', 'Electrical', 'Garbage', 'Drainage', 'Traffic'];
    const catData = cats.map(c => db.filter(i => i.category === c).length);
    
    if(charts.categories) charts.categories.destroy();
    charts.categories = new Chart(document.getElementById('chart-categories'), {
      type: 'bar',
      data: { labels: cats, datasets: [{ label: 'Number of Issues', data: catData, backgroundColor: '#3b82f6', borderRadius: 4 }] },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }
    });
  }

  /* --- CHATBOT --- */
  function toggleChat() { document.getElementById('chat-window').classList.toggle('hidden'); }
  function quickReply(txt) { document.getElementById('chat-msg').value = txt; sendChat(); }
  function sendChat() {
    const input = document.getElementById('chat-msg'); 
    const rawTxt = input.value; 
    const text = rawTxt.toLowerCase().trim(); 
    if(!text) return;
    
    const body = document.getElementById('chat-body');
    body.innerHTML += `<div class="chat-msg msg-user">${rawTxt}</div>`; 
    input.value = ''; 
    body.scrollTop = body.scrollHeight;
    
    setTimeout(() => {
      let reply = "I'm still learning! You can ask me about reporting issues, volunteering, budget delays, or how to earn civic points.";
      
      if(text.includes("report") || text.includes("new issue")) {
        reply = "You can report an issue by heading to the 'Report Issue' tab. We use AI to automatically route your request to the correct department.";
      } else if (text.includes("budget") || text.includes("delay") || text.includes("why")) {
        reply = "Some issues take longer to fix due to municipal **Budget Constraints**. We maintain full transparency—check the 'Financial & Schedule Status' on any issue to see if it's funded or scheduled for the next budget cycle!";
      } else if (text.includes("volunteer") || text.includes("community") || text.includes("adopt") || text.includes("ngo")) {
        reply = "When city funds are tight, citizens can step up! Check out the 'NGO Hub' to view unfunded projects, or click on any pending issue and look for the purple **Volunteer / Adopt** button to offer your help.";
      } else if (text.includes("temporary") || text.includes("safety") || text.includes("warning")) {
        reply = "If an issue can't be fixed immediately, authorities can apply **Temporary Actions** (like placing warning signs). These are marked in yellow on the issue details page.";
      } else if (text.includes("points") || text.includes("reward") || text.includes("metro")) {
        reply = "You earn **10 Civic Points** for every verified report! Points can be redeemed for rewards like Free Metro Passes or Library Access in the 'Community & Points' tab.";
      } else if (text.includes("report") && text.includes("admin") || text.includes("export") || text.includes("pdf")) {
        reply = "Administrators can generate automated **Policy & Escalation Reports** in PDF format from the Dashboard to justify future funding needs.";
      } else if (text.includes("map")) {
        reply = "The 'Issue Map' tab gives you a real-time geographic overview of all city issues and digital advisories.";
      }
      
      body.innerHTML += `<div class="chat-msg msg-bot">${reply}</div>`;
      body.scrollTop = body.scrollHeight;
    }, 800);
  }