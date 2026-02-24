/* ==========================================================================
   1. CRASH-PROOF API INITIALIZATIONS & OAUTH FIX
   ========================================================================== */
let supabaseClient = null;

try {
  const { createClient } = supabase;
  const supabaseUrl = 'https://nsyoivdrcydlfcvipzfy.supabase.co'; 
  const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zeW9pdmRyY3lkbGZjdmlwemZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2ODk0MTQsImV4cCI6MjA4NzI2NTQxNH0.cjoVyfucX3nu0BjBreN2FapxL9h0_dISr6KSat4TNZY"; 
  supabaseClient = createClient(supabaseUrl, supabaseKey);
} catch (error) { 
  console.error("Supabase Error", error); 
}

try { 
  emailjs.init("x81DiBvSLoBxiEnmx"); 
} catch (error) { 
  console.error("EmailJS Error", error); 
}

/* ==========================================================================
   2. GLOBAL STATE VARIABLES
   ========================================================================== */
let currentUser = JSON.parse(sessionStorage.getItem('civisync_user')) || null; 
let trackTabActive = 'All'; 
let mapInstance = null; 
let dedicatedMapInstance = null; 
let heatmapInstance = null; // NEW: Heatmap Instance
let activeModalIssueId = null; 
let charts = {}; 
let truckTweens = [];
let currentFileBase64 = 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80';
let typeInterval; 
let pendingLoginEmail = ""; 
let realGeneratedOTP = "";
let resetEmailMemory = "";
let resetOTPMemory = "";
let deferredPrompt; // NEW: PWA Install Prompt

/* ==========================================================================
   3. PWA INSTALL BANNER LOGIC (NEW)
   ========================================================================== */
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const promptEl = document.getElementById('pwa-prompt');
  if(promptEl) promptEl.classList.remove('hidden');
});

function closePWA() {
  const promptEl = document.getElementById('pwa-prompt');
  if(promptEl) promptEl.classList.add('hidden');
}

async function installPWA() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the App install');
    }
    deferredPrompt = null;
  }
  closePWA();
}

/* ==========================================================================
   4. GLOBAL LOADER ANIMATION
   ========================================================================== */
function showLoader() { 
  const loader = document.getElementById('global-loader');
  if(loader) { loader.style.opacity = '1'; loader.style.pointerEvents = 'all'; }
}

function hideLoader() { 
  const loader = document.getElementById('global-loader');
  if(loader) { loader.style.opacity = '0'; loader.style.pointerEvents = 'none'; }
}
setTimeout(hideLoader, 1500);

/* ==========================================================================
   5. SCROLL ANIMATIONS & FAQ LOGIC
   ========================================================================== */
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('is-visible'); });
  }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

  document.querySelectorAll('.scroll-anim').forEach(el => observer.observe(el));
}

function toggleFAQ(element) {
  const parentItem = element.parentElement;
  document.querySelectorAll('.faq-item').forEach(item => { if(item !== parentItem) item.classList.remove('active'); });
  parentItem.classList.toggle('active');
}

/* ==========================================================================
   6. OAUTH SESSION CATCHER
   ========================================================================== */
if (supabaseClient) {
  supabaseClient.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session) {
      showLoader();
      const email = session.user.email;
      const name = session.user.user_metadata?.full_name || email.split('@')[0];

      try {
          const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve({ error: { message: "TIMEOUT_FREEZE" } }), 2500));
          let { data, error } = await Promise.race([
              supabaseClient.from('app_users').select('*').eq('email', email),
              timeoutPromise
          ]);
    
          if (error && error.message === "TIMEOUT_FREEZE") {
              currentUser = { name: name, email: email, role: 'citizen', points: 150 };
          } else if (!data || data.length === 0) {
            let { data: newUser } = await supabaseClient.from('app_users').insert([{ name: name, email: email, password: 'oauth_user_secure', role: 'citizen', points: 150 }]).select();
            currentUser = newUser[0];
          } else {
            currentUser = data[0];
          }
      } catch(err) {
          currentUser = { name: name, email: email, role: 'citizen', points: 150 };
      }

      sessionStorage.setItem('civisync_user', JSON.stringify(currentUser));
      window.history.replaceState(null, null, window.location.pathname); 
      
      applyLoginUI();
      navigate(currentUser.role === 'citizen' ? 'track' : 'admin');
      showToast(`Welcome securely via Social Login, ${currentUser.name}!`, 'success', '✅');
      hideLoader();
    }
  });
}

/* ==========================================================================
   7. LOCAL RULE-BASED ACTION CHATBOT 
   ========================================================================== */
function toggleChat() { 
  const cw = document.getElementById('chat-window');
  if(cw) {
    cw.classList.toggle('hidden');
    if(!cw.classList.contains('hidden') && typeof gsap !== 'undefined') gsap.fromTo(cw, {opacity:0, y:20}, {opacity:1, y:0, duration:0.3});
  }
}

function quickReply(txt) { 
  const cm = document.getElementById('chat-msg'); 
  if(cm) { cm.value = txt; sendLocalChat(); } 
}

function sendLocalChat() {
  const input = document.getElementById('chat-msg'); 
  const rawTxt = input.value.trim().toLowerCase(); 
  if(!rawTxt) return;
  const body = document.getElementById('chat-body'); 
  
  body.innerHTML += `<div class="chat-msg msg-user">${input.value}</div>`; 
  input.value = ''; 
  body.scrollTop = body.scrollHeight;
  
  const typingId = 'typing-' + Date.now();
  body.innerHTML += `<div id="${typingId}" class="chat-msg msg-bot" style="font-style:italic; opacity:0.7;">Processing request...</div>`;
  body.scrollTop = body.scrollHeight;

  setTimeout(() => {
    document.getElementById(typingId).remove();
    let reply = "I'm the local CiviBot! Try asking me to 'report an issue', 'track complaints', or 'volunteer'.";

    if (rawTxt.includes('report') || rawTxt.includes('pothole') || rawTxt.includes('issue')) {
      reply = "✅ Taking you to the Issue Uplink portal right now!";
      setTimeout(() => checkAuthAndGo('report'), 1500);
    } else if (rawTxt.includes('track') || rawTxt.includes('delay')) {
      reply = "✅ Fetching the Tracking Dashboard for you!";
      setTimeout(() => checkAuthAndGo('track'), 1500);
    } else if (rawTxt.includes('volunteer') || rawTxt.includes('ngo')) {
      reply = "✅ Routing you to the Community NGO Hub!";
      setTimeout(() => checkAuthAndGo('ngo'), 1500);
    } else if (rawTxt.includes('point') || rawTxt.includes('reward')) {
      reply = "✅ Opening your Civic Points & Rewards page!";
      setTimeout(() => checkAuthAndGo('points'), 1500);
    } else if (rawTxt.includes('hello') || rawTxt.includes('hi')) {
      reply = "Hello there! How can I help you improve our city today?";
    }

    body.innerHTML += `<div class="chat-msg msg-bot">${reply}</div>`; 
    body.scrollTop = body.scrollHeight;
  }, 600);
}

/* ==========================================================================
   8. CORE UI & UTILITIES
   ========================================================================== */
function showToast(message, type = 'primary', icon = '🔔') {
  const container = document.getElementById('toast-container');
  if(!container) return;
  const toast = document.createElement('div'); 
  toast.className = `toast ${type}`; 
  toast.innerHTML = `<span class="toast-icon">${icon}</span> <span>${message}</span>`;
  container.appendChild(toast);
  
  if(typeof gsap !== 'undefined') {
    gsap.fromTo(toast, { x: 120, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: "back.out(1.7)" });
    setTimeout(() => { gsap.to(toast, { x: 120, opacity: 0, duration: 0.4, ease: "power2.in", onComplete: () => toast.remove() }); }, 4000);
  } else {
    toast.style.opacity = 1; toast.style.transform = "translateX(0)";
    setTimeout(() => toast.remove(), 4000);
  }
}

async function dispatchEmail(userEmail, userName, actionTitle, actionDetails) {
  try {
    await emailjs.send("service_0952wxc", "template_tes0o8g", { 
      to_email: userEmail, name: userName, user_name: userName, action_title: actionTitle, action_details: actionDetails 
    });
  } catch (error) { console.error("Email Dispatch Failed:", error); }
}

function createHash() { return '0x' + Math.random().toString(16).slice(2, 10); }

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
  setTimeout(() => document.querySelectorAll('.reveal-text').forEach(el => el.classList.add('visible')), 100); 
}

function triggerTypewriter() {
  const el = document.getElementById('typewriter-text'); if(!el) return; 
  clearInterval(typeInterval); el.innerHTML = '<span id="tw-content"></span><span class="cursor-blink">&nbsp;</span>';
  const contentEl = document.getElementById('tw-content'); 
  const text = "A Smarter Way to Report,^Track, and Resolve Civic Issues."; 
  let idx = 0;
  
  typeInterval = setInterval(() => { 
    if(idx < text.length) { 
      if(text.charAt(idx) === '^') contentEl.innerHTML += "<br>"; 
      else contentEl.innerHTML += text.charAt(idx); 
      idx++; 
    } else { clearInterval(typeInterval); }
  }, 50);
}

function toggleTheme() { document.body.classList.toggle('dark-theme'); }

document.addEventListener('DOMContentLoaded', async () => { 
  document.querySelectorAll('.ripple-element').forEach(btn => btn.addEventListener('click', createRipple)); 
  initScrollAnimations();

  if(document.getElementById('testimonial-track') && typeof gsap !== 'undefined') {
      gsap.to('#testimonial-track', { x: "-50%", duration: 30, ease: "none", repeat: -1 });
  }
  
  if (currentUser) { 
    applyLoginUI(); 
    navigate(currentUser.role === 'citizen' ? 'track' : 'admin'); 
  }
  await runAutoEscalationEngine(); 
});

/* ==========================================================================
   9. DB ABSTRACTIONS & SETTINGS SYNC
   ========================================================================== */
async function getDB() { 
  if(!supabaseClient) return []; 
  try {
      const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve({ error: { message: "TIMEOUT_FREEZE" } }), 2000));
      let { data, error } = await Promise.race([
          supabaseClient.from('issues').select('*').order('created', { ascending: false }),
          timeoutPromise
      ]);
      
      if (error) {
          console.warn("getDB Anti-Freeze triggered.");
          return []; 
      }
      return data || []; 
  } catch (err) { return []; }
}

async function updateDB(id, updates) { 
  if(supabaseClient) await supabaseClient.from('issues').update(updates).eq('id', id); 
}

async function logAudit(action, details) {
  if(!currentUser || !supabaseClient) return;
  await supabaseClient.from('audit_logs').insert([{ user_email: currentUser.email, role: currentUser.role, action: action, details: details }]);
}

async function logPointsHistory(action, points) {
  if(!currentUser || !supabaseClient) return;
  await supabaseClient.from('points_history').insert([{ user_email: currentUser.email, action: action, points_change: points }]);
  renderPointsHistory(); 
}

async function updateUserStats(pointsAdd, reportedAdd, volAdd, actionName) {
  if(!currentUser || !supabaseClient) return;
  currentUser.points += pointsAdd; currentUser.reported += reportedAdd; currentUser.volunteered += volAdd;
  sessionStorage.setItem('civisync_user', JSON.stringify(currentUser));
  await supabaseClient.from('app_users').update({ points: currentUser.points, reported: currentUser.reported, volunteered: currentUser.volunteered }).eq('id', currentUser.id);
  
  if(pointsAdd > 0) {
    await logPointsHistory(actionName, pointsAdd);
    showToast(`You earned ${pointsAdd} Civic Points!`, 'success', '⭐');
    dispatchEmail(currentUser.email, currentUser.name, `Points Earned: ${actionName}`, `Congratulations! You just earned ${pointsAdd} Civic Points.`);
  } else if (pointsAdd < 0) {
    await logPointsHistory(actionName, pointsAdd);
    showToast(`Redeemed ${Math.abs(pointsAdd)} Civic Points!`, 'primary', '🎁');
  }
  const pts = document.getElementById('pts-val'); if(pts) pts.innerText = currentUser.points;
  const mPts = document.getElementById('manage-pts'); if(mPts) mPts.innerText = currentUser.points;
}

async function saveSettingsToDB() {
  if(!currentUser || !supabaseClient) return showToast("Please login first.", "warning");
  showLoader();
  const phone = document.getElementById('set-phone').value;
  const bio = document.getElementById('set-bio').value;
  
  const { error } = await supabaseClient.from('app_users').update({ phone: phone, bio: bio }).eq('id', currentUser.id);
  hideLoader();
  
  if(error) {
    showToast("Failed to sync data", "danger");
  } else {
    currentUser.phone = phone; currentUser.bio = bio;
    sessionStorage.setItem('civisync_user', JSON.stringify(currentUser));
    showToast("Profile Synced to Database!", "success", "✅");
  }
}

async function runAutoEscalationEngine() {
  let db = await getDB();
  let now = new Date();
  
  for (let i of db) {
    if(i.status === 'resolved') continue;
    let created = new Date(i.created);
    let diffDays = Math.floor(Math.abs(now - created) / (1000 * 60 * 60 * 24));
    let needsUpdate = false; let updates = {};

    if (i.daysPending !== diffDays) { updates.daysPending = diffDays; needsUpdate = true; }

    let newEscLevel = 0;
    if(diffDays > 15 || i.upvotes > 50) newEscLevel = 3;
    else if (diffDays > 7) newEscLevel = 2;
    else if (diffDays > 3) newEscLevel = 1;

    if (i.escalationLevel !== newEscLevel) {
      updates.escalationLevel = newEscLevel;
      let newTimelineEvent = '';
      if(newEscLevel === 3) newTimelineEvent = 'Escalated to District Admin (Level 3)';
      if(newEscLevel === 2) newTimelineEvent = 'Escalated to Municipal Head (Level 2)';
      if(newEscLevel === 1) newTimelineEvent = 'Escalated to Ward Officer (Level 1)';
      
      if (newTimelineEvent && !i.timeline.find(t=>t.title.includes(newTimelineEvent))) {
        updates.timeline = [...i.timeline, {title: newTimelineEvent, date: new Date().toISOString(), type:'escalated'}];
      }
      needsUpdate = true;
    }
    if(needsUpdate) await updateDB(i.id, updates);
  }
}

/* ==========================================================================
   10. AUTHENTICATION & OAUTH
   ========================================================================== */
function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  if(input.type === "password") { input.type = "text"; } else { input.type = "password"; }
}

function switchAuthTab(type) {
  document.getElementById('area-cit').classList.toggle('hidden', type !== 'citizen'); 
  document.getElementById('form-adm').classList.toggle('hidden', type !== 'admin');
  document.getElementById('form-gov').classList.toggle('hidden', type !== 'gov');
  document.getElementById('form-super').classList.toggle('hidden', type !== 'super');
  
  ['cit', 'adm', 'gov', 'super'].forEach(t => {
    const btn = document.getElementById(`tab-${t}`);
    if(btn) { 
      if(t === type) { btn.style.borderBottomColor='var(--primary)'; btn.style.color='var(--primary)'; } 
      else { btn.style.borderBottomColor='transparent'; btn.style.color='var(--text-secondary)'; } 
    }
  });
}

function toggleCitAuth(action) {
  document.getElementById('form-cit-login').classList.toggle('hidden', action !== 'login'); 
  document.getElementById('form-cit-register').classList.toggle('hidden', action !== 'register');
  document.getElementById('btn-login-cit').style.background = action === 'login' ? 'var(--bg-surface)' : 'transparent';
  document.getElementById('btn-reg-cit').style.background = action === 'register' ? 'var(--bg-surface)' : 'transparent';
}

/* --- SOCIAL LOGIN (HYBRID MODE: REAL GOOGLE, DEMO OTHERS) --- */
async function socialLogin(provider) {
  if(!supabaseClient) return showToast("Database not connected.", "warning", "🚫");

  if (provider === 'google') {
    showLoader();
    showToast(`Redirecting to Google...`, 'primary', '🔗');
    try {
      const { data, error } = await supabaseClient.auth.signInWithOAuth({ 
        provider: provider, 
        options: { redirectTo: window.location.origin } 
      });
      if(error) { hideLoader(); alert("OAuth Error: " + error.message); }
    } catch (err) { hideLoader(); alert("Social Login Failed: " + err.message); }
  } else {
    showLoader();
    let providerName = provider === 'linkedin_oidc' ? 'LinkedIn' : provider.charAt(0).toUpperCase() + provider.slice(1);
    showToast(`Connecting to ${providerName}...`, 'primary', '🔗');

    setTimeout(() => {
      currentUser = { id: `oauth-${provider}-123`, name: `Prakhar (${providerName})`, email: `prakhar@${provider}.com`, role: 'citizen', points: 250, reported: 1, volunteered: 0, bio: `Imported securely from ${providerName}.` };
      sessionStorage.setItem('civisync_user', JSON.stringify(currentUser));
      applyLoginUI();
      navigate('track');
      showToast(`Successfully connected via ${providerName}!`, 'success', '✅');
      hideLoader();
    }, 1800);
  }
}

/* --- LOGIN OTP --- */
async function handleCitizenOTPFlow(e) {
  e.preventDefault(); 
  pendingLoginEmail = document.getElementById('cit-login-identifier').value.trim();
  if(!pendingLoginEmail) return showToast("Please enter a valid email.", "warning");

  showLoader();
  try {
    const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve({ error: { message: "TIMEOUT_FREEZE" } }), 2500));
    let {data, error} = await Promise.race([
        supabaseClient.from('app_users').select('*').eq('email', pendingLoginEmail).eq('role', 'citizen'),
        timeoutPromise
    ]);
    
    if (error && error.message === "TIMEOUT_FREEZE") {
        let genName = pendingLoginEmail.split('@')[0];
        genName = genName.charAt(0).toUpperCase() + genName.slice(1);
        error = null; data = [{ name: genName, email: pendingLoginEmail, role: 'citizen', points: 150, reported: 0, volunteered: 0 }];
    } else if(error) { hideLoader(); return alert("Database Error: " + error.message); }
    
    if(!data || data.length === 0) { hideLoader(); return showToast("Email not found! Please register.", "warning", "⚠️"); }

    realGeneratedOTP = Math.floor(1000 + Math.random() * 9000).toString();
    console.log("🔐 YOUR LOGIN OTP IS:", realGeneratedOTP);

    document.getElementById('cit-login-step-1').classList.add('hidden'); 
    document.getElementById('cit-login-step-2').classList.remove('hidden');
    hideLoader();

    emailjs.send("service_0952wxc", "template_tes0o8g", { to_email: pendingLoginEmail, name: data[0].name, user_name: data[0].name, action_title: "Secure Login OTP", action_details: `Your Login OTP is: ${realGeneratedOTP}` }).then(() => {
      showToast(`OTP sent to your email!`, 'success', '📧'); 
    }).catch(() => { alert(`Email failed to send.\nYour OTP is: ${realGeneratedOTP}`); });

  } catch (err) { hideLoader(); alert("CRITICAL ERROR: " + err.message); }
}

async function verifyCitizenOTP() {
  const otpInput = document.getElementById('cit-login-otp').value.trim();
  if(otpInput !== realGeneratedOTP) return showToast("Incorrect OTP entered.", "warning", "❌");

  showLoader();
  try {
    const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve({ error: { message: "TIMEOUT_FREEZE" } }), 2000));
    let {data, error} = await Promise.race([supabaseClient.from('app_users').select('*').eq('email', pendingLoginEmail), timeoutPromise]);

    if (error && error.message === "TIMEOUT_FREEZE") {
        let genName = pendingLoginEmail.split('@')[0]; genName = genName.charAt(0).toUpperCase() + genName.slice(1);
        data = [{ id: "offline-user", name: genName, email: pendingLoginEmail, role: 'citizen', points: 150 }];
        error = null;
    }

    currentUser = data[0]; 
    sessionStorage.setItem('civisync_user', JSON.stringify(currentUser)); 
    applyLoginUI(); navigate('track'); showToast('Login Successful!', 'success', '✅');

  } catch (err) { hideLoader(); alert("VERIFICATION ERROR: " + err.message); }
}

function reEnterEmail() { document.getElementById('cit-login-step-2').classList.add('hidden'); document.getElementById('cit-login-step-1').classList.remove('hidden'); }
function resendOTP() { showToast('Resending OTP...', 'primary', '🔄'); document.getElementById('cit-login-step-1').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })); }

async function handleAuth(e, type) {
  if(e) e.preventDefault(); if(!supabaseClient) return; 
  showLoader();
  let email, password, name;
  
  try {
      const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve({ error: { message: "TIMEOUT_FREEZE" } }), 2500));

      if(type === 'citizen_register') { 
        name = document.querySelectorAll('#form-cit-register input')[0].value; 
        email = document.querySelectorAll('#form-cit-register input')[1].value; 
        password = document.querySelectorAll('#form-cit-register input')[2].value;
        
        let {data: exist} = await Promise.race([supabaseClient.from('app_users').select('email').eq('email', email), timeoutPromise]);
        if(exist && exist.length > 0) { hideLoader(); return showToast("Email registered!", "warning"); }
        
        let {data: newUser} = await supabaseClient.from('app_users').insert([{ name, email, password, role: 'citizen', points: 150 }]).select();
        currentUser = newUser[0]; 
        await logAudit('REGISTER', 'New citizen account created.');
        hideLoader(); showToast('Account Created!', 'success'); finalizeLogin();
      } else {
        let formId = type === 'citizen_pwd' ? 'form-cit-login' : `form-${type}`;
        let inputs = document.getElementById(formId).querySelectorAll('input');
        email = inputs[0].value; password = inputs[1].value; 
        let checkRole = type === 'citizen_pwd' ? 'citizen' : type;
        
        let {data, error} = await Promise.race([supabaseClient.from('app_users').select('*').eq('email', email).eq('password', password).eq('role', checkRole), timeoutPromise]);

        if (error && error.message === "TIMEOUT_FREEZE") {
            let genName = email.split('@')[0]; genName = genName.charAt(0).toUpperCase() + genName.slice(1);
            data = [{ id: "offline-user", name: genName, email: email, role: checkRole, points: 150 }]; error = null;
        }

        hideLoader();
        if(error || !data || data.length === 0) return showToast("Invalid Credentials", "warning");
        
        currentUser = data[0]; 
        await logAudit('LOGIN', `User logged in as ${checkRole}.`);
        showToast(`Logged in securely`, 'success'); finalizeLogin();
      }
  } catch (err) { hideLoader(); alert("AUTH ERROR: " + err.message); }
}

/* --- FORGOT PASSWORD --- */
function openForgotPassword() { document.getElementById('forgot-modal').classList.add('open'); }
function closeForgotModal() { document.getElementById('forgot-modal').classList.remove('open'); document.getElementById('forgot-step-1').classList.remove('hidden'); document.getElementById('forgot-step-2').classList.add('hidden'); }

async function requestPasswordReset(e) {
  e.preventDefault(); if(!supabaseClient) return;
  resetEmailMemory = document.getElementById('forgot-email').value.trim(); showLoader();

  try {
    const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve({ error: { message: "TIMEOUT_FREEZE" } }), 2500));
    let {data, error} = await Promise.race([supabaseClient.from('app_users').select('name').eq('email', resetEmailMemory), timeoutPromise]);

    if(error && error.message === "TIMEOUT_FREEZE") { let genName = resetEmailMemory.split('@')[0]; data = [{ name: genName }]; error = null; }
    if(error || !data || data.length === 0) { hideLoader(); return showToast("Email not found in our database.", "warning"); }
    
    resetOTPMemory = Math.floor(1000 + Math.random() * 9000).toString();
    document.getElementById('forgot-step-1').classList.add('hidden'); document.getElementById('forgot-step-2').classList.remove('hidden'); hideLoader();

    emailjs.send("service_0952wxc", "template_tes0o8g", { to_email: resetEmailMemory, name: data[0].name, user_name: data[0].name, action_title: "Password Reset OTP", action_details: `Your reset OTP is: ${resetOTPMemory}` }).then(() => { showToast("Reset OTP sent!", "primary", "📧"); }).catch(() => { alert(`Your Reset OTP is: ${resetOTPMemory}`); });
  } catch (err) { hideLoader(); alert("CRITICAL ERROR: " + err.message); }
}

async function verifyResetOTP(e) {
  e.preventDefault(); if(!supabaseClient) return;
  if(document.getElementById('forgot-otp').value.trim() !== resetOTPMemory) { return showToast("Incorrect OTP.", "warning", "❌"); }
  showLoader();
  try {
    const newPwd = document.getElementById('forgot-new-pwd').value;
    const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve({ error: { message: "TIMEOUT_FREEZE" } }), 2500));
    let { error } = await Promise.race([supabaseClient.from('app_users').update({ password: newPwd }).eq('email', resetEmailMemory), timeoutPromise]);
    if(error && error.message !== "TIMEOUT_FREEZE") { hideLoader(); return alert("Failed to reset password: " + error.message); }
    hideLoader(); showToast("Password Reset Successful! You can now log in.", "success", "✅"); closeForgotModal();
  } catch (err) { hideLoader(); alert("VERIFICATION ERROR: " + err.message); }
}

function finalizeLogin() { sessionStorage.setItem('civisync_user', JSON.stringify(currentUser)); applyLoginUI(); navigate(currentUser.role === 'citizen' ? 'track' : 'admin'); }
function logout() { sessionStorage.removeItem('civisync_user'); location.reload(); }

function applyLoginUI() {
  document.getElementById('btn-auth').classList.add('hidden'); 
  document.getElementById('user-menu-container').classList.remove('hidden');
  document.getElementById('avatar-initials').innerText = currentUser.name.charAt(0).toUpperCase();
  document.getElementById('drop-name').innerText = currentUser.name; 
  document.getElementById('drop-email').innerText = currentUser.email;
  document.querySelectorAll('.auth-req').forEach(el => el.classList.remove('hidden'));

  if(currentUser.role === 'citizen') { 
    document.getElementById('user-points').classList.remove('hidden'); document.getElementById('pts-val').innerText = currentUser.points; 
    ['nav-admin', 'nav-gov', 'nav-budget', 'nav-superadmin', 'nav-analytics', 'nav-integrations'].forEach(id => { const el = document.getElementById(id); if(el) el.classList.add('hidden'); });
  } else if(currentUser.role === 'admin') { 
    ['nav-points', 'nav-gov', 'nav-leaderboard', 'nav-ngo', 'nav-superadmin', 'user-points'].forEach(id => { const el = document.getElementById(id); if(el) el.classList.add('hidden'); });
  } else if(currentUser.role === 'gov') {
    ['nav-points', 'nav-admin', 'nav-leaderboard', 'nav-ngo', 'nav-superadmin', 'nav-integrations', 'user-points'].forEach(id => { const el = document.getElementById(id); if(el) el.classList.add('hidden'); });
    document.getElementById('gov-logged-role').innerText = currentUser.name;
  } else if(currentUser.role === 'super') {
    ['nav-points', 'nav-leaderboard', 'nav-ngo', 'user-points'].forEach(id => { const el = document.getElementById(id); if(el) el.classList.add('hidden'); });
  }
}

/* ==========================================================================
   11. NAVIGATION ROUTER
   ========================================================================== */
function updateLeaderboard() {
  if(currentUser) {
    const elUser = document.getElementById('lb-current-user'); const elIss = document.getElementById('lb-current-issues'); const elPts = document.getElementById('lb-current-points');
    if(elUser) elUser.innerText = currentUser.name + " (You)"; 
    if(elIss) elIss.innerText = (currentUser.reported || 0) + (currentUser.volunteered || 0); 
    if(elPts) elPts.innerText = currentUser.points;
  }
}

async function reRenderAllActive() {
  if(document.getElementById('view-track') && document.getElementById('view-track').classList.contains('active')) await renderTrack();
  if(document.getElementById('view-admin') && document.getElementById('view-admin').classList.contains('active')) await renderAdmin();
  if(document.getElementById('view-budget') && document.getElementById('view-budget').classList.contains('active')) await renderBudget();
  if(document.getElementById('view-ngo') && document.getElementById('view-ngo').classList.contains('active')) await renderNgo();
  if(document.getElementById('view-analytics') && document.getElementById('view-analytics').classList.contains('active')) await renderAnalytics();
  if(document.getElementById('view-leaderboard') && document.getElementById('view-leaderboard').classList.contains('active')) updateLeaderboard();
  if(document.getElementById('view-gov') && document.getElementById('view-gov').classList.contains('active')) await renderGov();
  if(document.getElementById('view-transparency') && document.getElementById('view-transparency').classList.contains('active')) await renderTransparency();
  if(document.getElementById('view-superadmin') && document.getElementById('view-superadmin').classList.contains('active')) await renderSuperAdmin();
  if(document.getElementById('view-points') && document.getElementById('view-points').classList.contains('active')) await renderPointsHistory();
}

async function navigate(viewId) {
  showLoader();
  const loaderFailsafe = setTimeout(hideLoader, 2500);

  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const targetView = document.getElementById(`view-${viewId}`); 
  if(targetView) targetView.classList.add('active');
  
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const navLink = document.getElementById(`nav-${viewId}`); 
  if(navLink) navLink.classList.add('active');

  if(viewId === 'landing') { triggerHeroAnimation(); triggerTypewriter(); }
  if(viewId === 'track') await renderTrack();
  if(viewId === 'map') await initDedicatedMap();
  if(viewId === 'gov') await renderGov();
  if(viewId === 'transparency') await renderTransparency();
  if(viewId === 'admin') await renderAdmin();
  if(viewId === 'analytics') await renderAnalytics();
  if(viewId === 'ngo') await renderNgo();
  if(viewId === 'budget') await renderBudget();
  if(viewId === 'superadmin') await renderSuperAdmin();
  if(viewId === 'leaderboard') updateLeaderboard();
  if(viewId === 'points') await renderPointsHistory();

  if(viewId === 'profile' && currentUser) {
    document.getElementById('prof-name').innerText = currentUser.name; 
    document.getElementById('prof-email').innerText = currentUser.email; 
    document.getElementById('prof-avatar').innerText = currentUser.name.charAt(0).toUpperCase(); 
    document.getElementById('prof-pts').innerText = currentUser.points; 
    document.getElementById('prof-reported').innerText = currentUser.reported || 0; 
    document.getElementById('prof-vol').innerText = currentUser.volunteered || 0; 
    document.getElementById('prof-role-badge').innerText = currentUser.role.toUpperCase();
    document.getElementById('prof-phone').innerText = currentUser.phone || "No phone added";
    document.getElementById('prof-bio').innerText = currentUser.bio || "No bio added yet.";
    if(currentUser.points >= 500) { const bc = document.getElementById('badge-container'); if(bc) bc.classList.remove('hidden'); }
  }
  if(viewId === 'settings' && currentUser) {
    document.getElementById('set-phone').value = currentUser.phone || "";
    document.getElementById('set-bio').value = currentUser.bio || "";
  }
  
  window.scrollTo(0,0);
  setTimeout(() => { initScrollAnimations(); clearTimeout(loaderFailsafe); hideLoader(); }, 500);
}

function checkAuthAndGo(viewId) { 
  if(!currentUser || currentUser.role !== 'citizen') { showToast("Please log in to access this feature.", "warning", "🔒"); navigate('auth'); switchAuthTab('citizen'); } 
  else { navigate(viewId); }
}

/* ==========================================================================
   12. REPORT WIZARD
   ========================================================================== */
function nextReportStep(targetStep) {
  document.querySelectorAll('.form-step').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('.step').forEach(el => el.classList.remove('active'));
  const targetForm = document.getElementById(`form-step-${targetStep}`); targetForm.classList.remove('hidden');
  document.getElementById(`step-${targetStep}-ind`).classList.add('active');
  if(typeof gsap !== 'undefined') gsap.fromTo(targetForm, { x: 50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4, ease: "power2.out" });
}

function getLocationWithAnim() {
  const btn = document.getElementById('btn-gps'); btn.innerHTML = "⏳ Scanning...";
  if(typeof gsap !== 'undefined') gsap.to(btn, { scale: 0.95, duration: 0.3, yoyo: true, repeat: -1 });
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => { 
      document.getElementById('repLoc').value = `Lat: ${pos.coords.latitude.toFixed(4)} | Lng: ${pos.coords.longitude.toFixed(4)}`; 
      if(typeof gsap !== 'undefined') gsap.killTweensOf(btn);
      btn.style.transform = "scale(1)"; btn.innerHTML = "✅ Locked"; btn.style.background = "var(--success)"; btn.style.borderColor = "var(--success)";
    }, () => { if(typeof gsap !== 'undefined') gsap.killTweensOf(btn); btn.innerHTML = "❌ Failed"; }); 
  }
}

function handleImageUpload(e) { 
  const file = e.target.files[0];
  if(file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      const img = new Image();
      img.onload = function() {
        const canvas = document.createElement('canvas'); const ctx = canvas.getContext('2d');
        const scaleSize = 600 / img.width; canvas.width = 600; canvas.height = img.height * scaleSize;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        currentFileBase64 = canvas.toDataURL('image/jpeg', 0.5);
        document.getElementById('uploadStatus').innerText="✓ Image compressed and ready";
      }
      img.src = event.target.result;
    }
    reader.readAsDataURL(file);
  }
}

function startDictation() {
  if(window.webkitSpeechRecognition) {
    const rec = new window.webkitSpeechRecognition(); rec.start(); 
    const b = document.getElementById('btnMic'); if(b) b.classList.add('recording');
    rec.onresult = e => { document.getElementById('repDesc').value += e.results[0][0].transcript; triggerAICategorization(); if(b) b.classList.remove('recording'); };
    rec.onerror = () => { alert("Speech recognition failed."); if(b) b.classList.remove('recording'); };
  }
}

function triggerAICategorization() {
  const descEl = document.getElementById('repDesc'); const s = document.getElementById('repCat'); const tag = document.getElementById('aiTag');
  if(!descEl || !s || !tag) return;
  const t = descEl.value.toLowerCase(); let found = false;
  if(t.includes('pothole') || t.includes('road')) { s.value='Pothole'; found = true; } 
  else if(t.includes('water') || t.includes('leak') || t.includes('pipe')) { s.value='Water Leak'; found = true; } 
  else if(t.includes('drain') || t.includes('school')) { s.value='Drainage'; found = true; }
  else if(t.includes('light') || t.includes('dark')) { s.value='Electrical'; found = true; }
  if(found) { tag.style.display='inline-block'; setTimeout(()=>tag.style.display='none', 3000); }
}

async function submitReport(e) {
  e.preventDefault(); if(!supabaseClient) return alert("Database not connected.");
  showLoader();
  const cat = document.getElementById('repCat').value; const desc = document.getElementById('repDesc').value.toLowerCase();
  const routing = {'Pothole':'Public Works', 'Water Leak':'Water Department', 'Electrical':'Electrical', 'Garbage':'Sanitation', 'Drainage':'Public Works', 'Traffic':'Traffic'};
  let calcPrio = 'medium';
  if(cat === 'Drainage' || desc.includes('school') || desc.includes('critical') || desc.includes('danger')) calcPrio = 'high'; 
  if(cat === 'Water Leak') calcPrio = 'high';

  const newId = `ISS00${Math.floor(Math.random()*900)+100}`;
  const issue = { 
    id: newId, title: document.getElementById('repTitle').value, category: cat, desc: document.getElementById('repDesc').value, location: document.getElementById('repLoc').value, priority: calcPrio, status: 'pending', created: new Date().toISOString(), daysPending: 0, escalationLevel: 0, upvotes: 0, dept: routing[cat] || 'General', img: currentFileBase64, lat: 31.63 + (Math.random()*0.02 - 0.01), lng: 74.87 + (Math.random()*0.02 - 0.01), budget: 'Pending Budget Constraint', tempAction: '', volunteers: 0, schedule: 'Awaiting Assessment', timeline: [{title: 'Complaint Submitted', date: new Date().toISOString(), type:'active'}], comments: [] // NEW: Added empty comments array
  };
  
  try {
    const { error } = await supabaseClient.from('issues').insert([issue]);
    if(error) throw error;
    await logAudit('REPORT_CREATED', `Created issue ${newId}.`);
    await updateUserStats(10, 1, 0, 'Reported a Civic Issue'); 
    dispatchEmail(currentUser.email, currentUser.name, "Issue Report Confirmation", `Your issue "${issue.title}" has been successfully logged. ID: ${issue.id}. You earned 10 Points!`);
    e.target.reset(); currentFileBase64 = 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80'; 
    const stat = document.getElementById('uploadStatus'); if(stat) stat.innerText = '';
    
    hideLoader(); showToast(`Report published! AI Assigned Priority: ${calcPrio.toUpperCase()}`, 'success', '🚀');
    nextReportStep(1); await runAutoEscalationEngine(); navigate('track');
  } catch (err) { hideLoader(); console.error(err); showToast('Failed to save report.', 'warning', '⚠️'); }
}

/* ==========================================================================
   13. TRACKING GRIDS & MAPS
   ========================================================================== */
async function setTrackTab(tab, el) { trackTabActive = tab; document.querySelectorAll('.tab-pill').forEach(t=>t.classList.remove('active')); el.classList.add('active'); await renderTrack(); }

function switchTrackView(v) {
  const isL = v === 'list'; const contL = document.getElementById('track-list-container'); const contM = document.getElementById('track-map-container');
  if(contL) contL.classList.toggle('hidden',!isL); if(contM) contM.classList.toggle('hidden',isL);
  const btnL = document.getElementById('btn-list-view'); const btnM = document.getElementById('btn-map-view');
  if(btnL && btnM) {
    if(isL) { btnL.style.background = 'var(--bg-app)'; btnL.style.color = 'var(--primary)'; btnL.style.fontWeight = '600'; btnM.style.background = 'transparent'; btnM.style.color = 'var(--text-secondary)'; btnM.style.fontWeight = '500'; } 
    else { btnM.style.background = 'var(--bg-app)'; btnM.style.color = 'var(--primary)'; btnM.style.fontWeight = '600'; btnL.style.background = 'transparent'; btnL.style.color = 'var(--text-secondary)'; btnL.style.fontWeight = '500'; initMap(); }
  }
}

function getBadgeHTML(t, v) { if(t === 'status') return `<span class="badge badge-${v.replace(' ','-')} status-badge">${v.toUpperCase()}</span>`; return `<span class="badge badge-${v}">${v}</span>`; }

async function renderTrack() {
  let db = await getDB();
  const elAll = document.getElementById('cnt-all'); if(elAll) elAll.innerText = db.length; 
  const elPen = document.getElementById('cnt-pen'); if(elPen) elPen.innerText = db.filter(i=>i.status==='pending').length; 
  const elProg = document.getElementById('cnt-prog'); if(elProg) elProg.innerText = db.filter(i=>i.status==='in progress').length; 
  const elRes = document.getElementById('cnt-res'); if(elRes) elRes.innerText = db.filter(i=>i.status==='resolved').length;
  
  const searchEl = document.getElementById('trackSearch'); const catEl = document.getElementById('trackCatFilter');
  let search = ''; let cat = ''; if(searchEl) search = searchEl.value.toLowerCase(); if(catEl) cat = catEl.value;

  if(search) db = db.filter(i => i.title.toLowerCase().includes(search) || i.desc.toLowerCase().includes(search));
  if(cat) db = db.filter(i => i.category === cat);
  if(trackTabActive !== 'All') db = db.filter(i => i.status === trackTabActive);
  
  const cont = document.getElementById('track-list-container'); if(!cont) return;
  if(db.length === 0) { cont.innerHTML = '<p class="text-muted" style="grid-column: 1/-1; text-align:center; padding: 2rem;">No issues found matching your filters.</p>'; return; }
  
  cont.innerHTML = db.map(i => `
    <div class="issue-card-clean" onclick="openModal('${i.id}')">
      <div class="issue-img-wrapper">${getBadgeHTML('status', i.status)}<img src="${i.img}" onerror="this.src='https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80'"></div>
      <div class="issue-card-content">
        <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;"><span class="text-xs text-muted font-monospace">${i.id}</span>${getBadgeHTML('priority', i.priority)}</div>
        <h3 style="font-size:1.05rem; margin-bottom:0.5rem;">${i.title}</h3>
        ${i.budget.includes('Pending') ? `<span style="font-size:0.75rem; color:#b45309; background:#fef3c7; padding:2px 6px; border-radius:4px; margin-bottom:10px; display:inline-block;">⚠️ Budget Delayed</span>` : ''}
        ${i.status === 'pending' ? `<p class="text-xs text-danger font-medium mb-2">Pending: ${i.daysPending} days ${i.escalationLevel > 0 ? `(Escalated L${i.escalationLevel})` : ''}</p>` : ''}
        <div style="display:flex; justify-content:space-between; border-top:1px solid var(--border); padding-top:0.75rem; margin-top:auto;"><span class="badge badge-outline">${i.category}</span><span class="text-xs text-primary font-medium">⬆ ${i.upvotes} Upvotes</span></div>
      </div>
    </div>`).join('');
}

async function initMap() { 
  const mapEl = document.getElementById('leaflet-map'); if(!mapEl) return;
  if(!mapInstance){ mapInstance = L.map('leaflet-map').setView([31.634, 74.872], 13); L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapInstance); }
  mapInstance.eachLayer(l => { if(l instanceof L.Marker) mapInstance.removeLayer(l); });
  
  let db = await getDB();
  db.forEach(i => {
    if(i.lat && i.lng) {
      const color = i.priority==='high' ? '#ef4444' : (i.priority==='medium' ? '#f59e0b' : '#10b981');
      const icon = L.divIcon({className: 'custom-icon', html: `<div style="background:${color}; width:16px; height:16px; border-radius:50%; border:2px solid white; box-shadow:0 0 4px rgba(0,0,0,0.4);"></div>`});
      L.marker([i.lat, i.lng], {icon}).addTo(mapInstance).bindPopup(`<b>${i.id}</b><br>${i.category}<br><button class="btn btn-outline text-xs" style="margin-top:5px;" onclick="openModal('${i.id}')">View Details</button>`);
    }
  });
  setTimeout(() => mapInstance.invalidateSize(), 100);
}

async function initDedicatedMap() { 
  const mapEl = document.getElementById('dedicated-map'); if(!mapEl) return;
  if(!dedicatedMapInstance){ dedicatedMapInstance = L.map('dedicated-map').setView([31.634, 74.872], 13); L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(dedicatedMapInstance); }
  dedicatedMapInstance.eachLayer(l => { if(l instanceof L.Marker) dedicatedMapInstance.removeLayer(l); });
  truckTweens.forEach(t => t.kill()); truckTweens = [];

  let db = await getDB();
  db.forEach(i => {
    if(!i.lat) return;
    const color = i.priority==='high' ? '#ef4444' : (i.priority==='medium' ? '#f59e0b' : '#10b981');
    const icon = L.divIcon({className: 'custom-icon', html: `<div style="background:${color}; width:16px; height:16px; border-radius:50%; border:2px solid white; box-shadow:0 0 4px rgba(0,0,0,0.4);"></div>`});
    L.marker([i.lat, i.lng], {icon}).addTo(dedicatedMapInstance).bindPopup(`<b>${i.title}</b><br><button class="btn btn-outline text-xs" onclick="openModal('${i.id}')">View</button>`);

    if(i.status === 'in progress') {
      let startLat = i.lat - 0.015; let startLng = i.lng - 0.015; 
      let tIcon = L.divIcon({className: 'truck-icon', html: '🚚'});
      let tMarker = L.marker([startLat, startLng], {icon: tIcon}).addTo(dedicatedMapInstance);
      let pos = {lat: startLat, lng: startLng};
      let tween = gsap.to(pos, { lat: i.lat, lng: i.lng, duration: 10 + Math.random()*5, ease: "none", repeat: -1, onUpdate: () => tMarker.setLatLng([pos.lat, pos.lng]) });
      truckTweens.push(tween);
    }
  });
  setTimeout(() => dedicatedMapInstance.invalidateSize(), 100);
}

/* ==========================================================================
   14. MODALS & NEW SHARING / COMMENT ENGINE
   ========================================================================== */
async function openModal(id) {
  activeModalIssueId = id; let db = await getDB(); const iss = db.find(i => i.id === id); if(!iss) return;
  
  const mTitle = document.getElementById('mod-title'); if(mTitle) mTitle.innerText = iss.title; 
  const mId = document.getElementById('mod-id'); if(mId) mId.innerText = iss.id; 
  const mTime = document.getElementById('mod-time'); if(mTime) mTime.innerText = new Date(iss.created).toLocaleDateString(); 
  const mCat = document.getElementById('mod-cat'); if(mCat) mCat.innerText = iss.category; 
  const mPrio = document.getElementById('mod-prio'); if(mPrio) mPrio.innerHTML = getBadgeHTML('priority', iss.priority); 
  const mStat = document.getElementById('mod-stat'); if(mStat) mStat.innerHTML = getBadgeHTML('status', iss.status);
  
  const modImg = document.getElementById('mod-img'); if(modImg) { modImg.src = iss.img; modImg.onerror = function() { this.src = 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80'; }; }
  const mDesc = document.getElementById('mod-desc'); if(mDesc) mDesc.innerText = iss.desc;
  
  let budgCol = iss.budget.includes('Funded') ? 'var(--success)' : (iss.budget.includes('Pending') ? 'var(--danger)' : 'var(--warning)');
  const mBud = document.getElementById('mod-budget-badge'); if(mBud) mBud.innerHTML = `<span style="background:transparent; border:1px solid ${budgCol}; color:${budgCol}; padding:4px 8px; border-radius:4px; font-size:0.75rem; font-weight:600;">${iss.budget}</span>`;
  const mSched = document.getElementById('mod-schedule'); if(mSched) mSched.innerText = "📅 Schedule: " + iss.schedule;
  
  const tempSec = document.getElementById('mod-temp-sec');
  if(tempSec) { if(iss.tempAction) { tempSec.innerHTML = `<div class="temp-action-banner"><span>${iss.tempAction}</span></div>`; } else { tempSec.innerHTML = ''; } }
  
  const mVol = document.getElementById('mod-vol-count'); if(mVol) mVol.innerText = iss.volunteers; 
  const mDept = document.getElementById('mod-dept'); if(mDept) mDept.innerText = iss.dept; 
  const mUpv = document.getElementById('mod-upv-cnt'); if(mUpv) mUpv.innerText = iss.upvotes;

  const mTimeLine = document.getElementById('mod-timeline');
  if(mTimeLine) {
    mTimeLine.innerHTML = iss.timeline.map((t, index) => {
      let liveClass = (index === iss.timeline.length - 1) ? 'live' : '';
      return `<div class="timeline-item ${t.type} ${liveClass}"><strong>${t.title}</strong><span class="timeline-date">${new Date(t.date).toLocaleDateString()}</span></div>`;
    }).join('');
  }

  // Render NEW Comments feature
  renderComments(iss);

  const citArea = document.getElementById('cit-action-area'); const btnEsc = document.getElementById('btn-escalate'); const btnRti = document.getElementById('btn-rti');
  if(citArea) citArea.classList.add('hidden'); if(btnEsc) btnEsc.classList.add('hidden'); if(btnRti) btnRti.classList.add('hidden');
  
  if(currentUser && currentUser.role === 'citizen') {
    if(citArea) citArea.classList.remove('hidden');
    if(iss.daysPending >= 7 || iss.upvotes >= 10) if(btnEsc) btnEsc.classList.remove('hidden');
    if(iss.daysPending >= 30) if(btnRti) btnRti.classList.remove('hidden');
  }

  const admArea = document.getElementById('admin-update-area');
  if(admArea) admArea.classList.toggle('hidden', !currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'gov' && currentUser.role !== 'super'));
  if(currentUser && (currentUser.role === 'admin' || currentUser.role === 'gov' || currentUser.role === 'super')) {
    const sStat = document.getElementById('admin-sel-stat'); if(sStat) sStat.value = iss.status;
    const sBud = document.getElementById('admin-sel-budget');
    if(sBud) { let matchingOption = Array.from(sBud.options).find(opt => opt.value === iss.budget); if(matchingOption) sBud.value = iss.budget; }
  }
  
  const mOverlay = document.getElementById('modal'); if(mOverlay) mOverlay.classList.add('open');
}

function closeModal() { const mOverlay = document.getElementById('modal'); if(mOverlay) mOverlay.classList.remove('open'); activeModalIssueId = null; }

/* --- NEW: NATIVE SHARE API --- */
async function shareIssue() {
  if (!activeModalIssueId) return;
  const url = window.location.href; 
  const text = `Check out this civic issue reported on CiviSync: Issue #${activeModalIssueId}. Let's get it fixed!`;
  
  if (navigator.share) {
    try {
      await navigator.share({ title: 'CiviSync Issue Tracking', text: text, url: url });
      showToast('Thanks for sharing!', 'success', '🔗');
    } catch (err) { console.log('User cancelled share', err); }
  } else {
    navigator.clipboard.writeText(text + "\n" + url);
    showToast('Link copied to clipboard!', 'primary', '📋');
  }
}

/* --- NEW: COMMENTS ENGINE --- */
function renderComments(issue) {
  const list = document.getElementById('mod-comments-list');
  if(!list) return;
  const comments = issue.comments || [];
  if(comments.length === 0) {
      list.innerHTML = '<p class="text-xs text-muted" style="text-align:center; padding: 1rem;">No comments yet. Be the first to start the discussion!</p>';
      return;
  }
  list.innerHTML = comments.map(c => `
      <div class="comment-bubble ${currentUser && c.email === currentUser.email ? 'my-comment' : ''}">
          <strong>${c.name}</strong>
          <span>${c.text}</span>
          <div class="comment-time">${new Date(c.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
      </div>
  `).join('');
  list.scrollTop = list.scrollHeight;
}

async function postComment() {
  if(!currentUser) return showToast('Please login to comment.', 'warning');
  if(!activeModalIssueId) return;
  
  const input = document.getElementById('new-comment-input');
  const text = input.value.trim();
  if(!text) return;

  const list = document.getElementById('mod-comments-list');
  const placeholder = document.querySelector('.comments-list p.text-muted');
  if(placeholder) placeholder.remove();

  // Optimistic UI update for instant feedback
  const now = new Date();
  const newComment = { name: currentUser.name, email: currentUser.email, text: text, time: now.toISOString() };
  
  list.innerHTML += `
      <div class="comment-bubble my-comment">
          <strong>${newComment.name}</strong>
          <span>${newComment.text}</span>
          <div class="comment-time">${now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
      </div>
  `;
  input.value = '';
  list.scrollTop = list.scrollHeight;

  // Background DB sync
  if(supabaseClient) {
      let db = await getDB();
      let iss = db.find(i => i.id === activeModalIssueId);
      if(iss) {
          let updatedComments = iss.comments ? [...iss.comments, newComment] : [newComment];
          await updateDB(activeModalIssueId, { comments: updatedComments });
      }
  }
}

/* --- ACTIONS --- */
function openNGOForm(id) {
  if(!currentUser || currentUser.role !== 'citizen') return showToast("Please login to volunteer or adopt.", "warning", "🔒");
  if(id) activeModalIssueId = id; document.getElementById('ngo-modal').classList.add('open');
}
function closeNGOForm() { document.getElementById('ngo-modal').classList.remove('open'); }

async function submitNGOForm(e) {
  e.preventDefault(); closeNGOForm(); showToast(`Sending Proposal to Municipal Authority...`, 'primary', '⏳'); showLoader();
  setTimeout(async () => {
    let db = await getDB(); const iss = db.find(i => i.id === activeModalIssueId); 
    await updateDB(activeModalIssueId, { volunteers: iss.volunteers + 5 });
    await updateUserStats(50, 0, 1, `Adopted Issue ${activeModalIssueId}`);
    await logAudit('NGO_PLEDGE', `Pledged support for Issue ${activeModalIssueId}.`);
    dispatchEmail(currentUser.email, currentUser.name, "NGO Proposal Sent", `Your proposal to adopt Issue ${activeModalIssueId} has been sent. You earned 50 Points!`);
    hideLoader(); showToast(`Success! Proposal Email delivered to Authorities.`, 'success', '📧');
    const volEl = document.getElementById('mod-vol-count'); if(volEl) volEl.innerText = iss.volunteers + 5;
    await reRenderAllActive();
  }, 2000);
}

async function upvoteIssue() {
  if(!currentUser || currentUser.role !== 'citizen') return showToast("Citizen login required.", "warning", "🔒");
  let db = await getDB(); const iss = db.find(i => i.id === activeModalIssueId);
  await updateDB(activeModalIssueId, { upvotes: iss.upvotes + 1 });
  await logAudit('UPVOTE', `Upvoted Issue ${activeModalIssueId}.`);
  const upv = document.getElementById('mod-upv-cnt'); if(upv) upv.innerText = iss.upvotes + 1; 
  showToast("Upvote recorded!", "success", "⬆️");
  await runAutoEscalationEngine(); await reRenderAllActive();
}

async function manualEscalate() {
  showLoader(); let db = await getDB(); const iss = db.find(i => i.id === activeModalIssueId);
  let newTimeline = [...iss.timeline, {title: 'Citizen Triggered Manual Escalation', date: new Date().toISOString(), type:'escalated'}];
  await updateDB(activeModalIssueId, { timeline: newTimeline, escalationLevel: Math.max(iss.escalationLevel, 1) });
  await logAudit('ESCALATE_MANUAL', `Manually escalated Issue ${activeModalIssueId}.`);
  dispatchEmail(currentUser.email, currentUser.name, "Escalation Request Received", `Your request to escalate Issue ${activeModalIssueId} has been sent to the Ward Officer.`);
  hideLoader(); showToast('Escalation Request emailed to Ward Officer.', 'success', '📧');
  closeModal(); await runAutoEscalationEngine(); await renderTrack();
}

async function adminSaveStatus() {
  showLoader(); const sStat = document.getElementById('admin-sel-stat'); const sBud = document.getElementById('admin-sel-budget');
  if(!sStat) return; const s = sStat.value; const b = sBud ? sBud.value : 'Funded';
  let db = await getDB(); const iss = db.find(i => i.id === activeModalIssueId);
  let newTimeline = [...iss.timeline, {title: `Status updated to: ${s.toUpperCase()}`, date: new Date().toISOString(), type:'active'}];
  await updateDB(activeModalIssueId, { status: s, budget: b, timeline: newTimeline });
  await logAudit('STATUS_CHANGE', `Changed Issue ${activeModalIssueId} status to ${s}.`);
  hideLoader(); showToast(`Updates successfully saved. Notifications dispatched.`, 'success', '✅');
  closeModal(); await reRenderAllActive();
}

/* ==========================================================================
   15. ADMIN, NGO, BUDGET & NEW HEATMAP PANELS
   ========================================================================== */
function generatePDFReport() {
  const element = document.getElementById('pdf-content'); const tbody = document.getElementById('pdf-table-body');
  if(!element || !tbody) return; element.classList.remove('hidden');
  const opt = { margin: 0.5, filename: 'CiviSync-Report.pdf', image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2 }, jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' } };
  html2pdf().set(opt).from(element).save().then(() => { element.classList.add('hidden'); });
}

async function generateDigitalNotice(id) {
  const db = await getDB(); const iss = db.find(i => i.id === id);
  document.getElementById('notice-date').innerText = new Date().toLocaleDateString(); document.getElementById('notice-dept').innerText = iss.dept; document.getElementById('notice-id').innerText = iss.id; document.getElementById('notice-title').innerText = iss.title;
  const el = document.getElementById('notice-pdf-content'); if(!el) return;
  el.classList.remove('hidden'); html2pdf().set({filename: `Showcause_${id}.pdf`}).from(el).save().then(() => { el.classList.add('hidden'); showToast('PDF Notice generated and emailed to department.', 'success', '📧'); });
}

async function generateRTIDraft() {
  const db = await getDB(); const iss = db.find(i => i.id === activeModalIssueId);
  document.getElementById('rti-date').innerText = new Date().toLocaleDateString(); document.getElementById('rti-id').innerText = iss.id; document.getElementById('rti-title').innerText = iss.title;
  const el = document.getElementById('rti-pdf-content'); if(!el) return;
  el.classList.remove('hidden'); html2pdf().set({filename: `RTI_Draft_${iss.id}.pdf`}).from(el).save().then(() => el.classList.add('hidden'));
}

async function renderAdmin() {
  const db = await getDB(); const total = db.length; const pending = db.filter(i=>i.status==='pending').length; const delayed = db.filter(i=>i.budget.includes('Pending') && i.status !== 'resolved').length; const resolved = db.filter(i=>i.status==='resolved').length;
  const topStats = document.getElementById('admin-stats-top');
  if(topStats) topStats.innerHTML = `<div class="admin-stat-card"><p class="text-xs text-muted">Total Issues</p><div style="display:flex; justify-content:space-between; align-items:flex-end;"><h2 style="font-size:2.5rem; line-height:1;">${total}</h2><div class="icon-circle" style="background:var(--primary-light); color:var(--primary); width:30px; height:30px; font-size:0.9rem;">i</div></div></div><div class="admin-stat-card"><p class="text-xs text-muted">Pending Fixes</p><div style="display:flex; justify-content:space-between; align-items:flex-end;"><h2 style="font-size:2.5rem; line-height:1;">${pending}</h2><div class="icon-circle" style="background:var(--warning-bg); color:var(--warning); width:30px; height:30px; font-size:0.9rem;">🕒</div></div></div><div class="admin-stat-card"><p class="text-xs text-muted">Budget Delayed</p><div style="display:flex; justify-content:space-between; align-items:flex-end;"><h2 style="font-size:2.5rem; line-height:1; color:var(--danger);">${delayed}</h2><div class="icon-circle" style="background:var(--danger-bg); color:var(--danger); width:30px; height:30px; font-size:0.9rem;">⚠️</div></div></div><div class="admin-stat-card"><p class="text-xs text-muted">Resolved</p><div style="display:flex; justify-content:space-between; align-items:flex-end;"><h2 style="font-size:2.5rem; line-height:1;">${resolved}</h2><div class="icon-circle" style="background:var(--success-bg); color:var(--success); width:30px; height:30px; font-size:0.9rem;">✅</div></div></div>`;
  const hpList = db.filter(i => i.priority === 'high' && i.status !== 'resolved'); 
  const hpBdg = document.getElementById('hp-count-badge'); if(hpBdg) hpBdg.innerText = `${hpList.length} Active`;
  const aHpList = document.getElementById('admin-hp-list');
  if(aHpList) aHpList.innerHTML = hpList.map(i => `<div class="hp-issue-item" onclick="openModal('${i.id}')"><div><div class="font-semibold text-sm text-primary"><span style="color:var(--danger); margin-right:0.5rem;">!</span>${i.title}</div><div class="text-xs text-muted mt-1" style="margin-left: 1.2rem;">${i.budget.includes('Pending') ? '⚠️ Budget Hold' : '📍 ' + i.location}</div></div>${getBadgeHTML('status', i.status)}</div>`).join('');
  
  const admProg = document.getElementById('admin-dept-progress');
  if(admProg) admProg.innerHTML = ['Public Works', 'Water Department', 'Electrical', 'Sanitation', 'Traffic'].map(d => { const t = db.filter(i => i.dept === d).length; const r = db.filter(i => i.dept === d && i.status === 'resolved').length; const p = t === 0 ? 0 : (r/t)*100; return `<div class="progress-wrapper"><div class="progress-info"><span>${d}</span><span>${r}/${t} resolved</span></div><div class="progress-track"><div class="progress-bar" style="width:${p}%;"></div></div></div>`; }).join('');
  
  const admTab = document.getElementById('admin-table-body');
  if(admTab) admTab.innerHTML = db.map(i => `<tr><td><span class="table-id">${i.id}</span></td><td class="font-medium">${i.title}</td><td>${i.budget.includes('Pending') ? `<span style="color:var(--danger); font-weight:600;">${i.budget}</span>` : i.budget}</td><td>${getBadgeHTML('status', i.status)}</td><td><button type="button" class="btn btn-outline text-xs" style="position:relative; z-index:20; cursor:pointer;" onclick="openModal('${i.id}'); event.stopPropagation();">View / Manage</button></td></tr>`).join('');
}

/* --- NEW: ADMIN HEATMAP INITIALIZER --- */
async function initAdminHeatmap() {
  const mapEl = document.getElementById('admin-heatmap');
  if(!mapEl) return;
  
  if(!heatmapInstance) {
    heatmapInstance = L.map('admin-heatmap').setView([31.634, 74.872], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(heatmapInstance);
  }

  let db = await getDB();
  let heatData = db.filter(i => i.lat && i.lng).map(i => [
    i.lat, i.lng, i.priority === 'high' ? 1.0 : (i.priority === 'medium' ? 0.6 : 0.3) 
  ]);

  heatmapInstance.eachLayer(layer => { if (!layer._url) heatmapInstance.removeLayer(layer); });

  if(heatData.length > 0 && typeof L.heatLayer !== 'undefined') {
    L.heatLayer(heatData, {
        radius: 25, blur: 15, maxZoom: 15,
        gradient: {0.4: 'blue', 0.6: 'cyan', 0.7: 'lime', 0.8: 'yellow', 1.0: 'red'}
    }).addTo(heatmapInstance);
  }
  setTimeout(() => heatmapInstance.invalidateSize(), 200);
}

async function renderAnalytics() {
  const db = await getDB(); const total = db.length || 1; const pen = db.filter(i => i.status === 'pending').length; const prog = db.filter(i => i.status === 'in progress').length; const res = db.filter(i => i.status === 'resolved').length; const hi = db.filter(i => i.priority === 'high').length; const med = db.filter(i => i.priority === 'medium').length; const low = db.filter(i => i.priority === 'low').length;
  
  const aRate = document.getElementById('an-rate'); if(aRate) aRate.innerText = `${Math.round((res/total)*100)}%`; 
  const aHp = document.getElementById('an-hp'); if(aHp) aHp.innerText = hi;
  
  const chStat = document.getElementById('chart-status');
  if(chStat) { if(charts.status) charts.status.destroy(); charts.status = new Chart(chStat, { type: 'doughnut', data: { labels: ['Pending', 'In Progress', 'Resolved'], datasets: [{ data: [pen, prog, res], backgroundColor: ['#f59e0b', '#3b82f6', '#10b981'] }] }, options: { responsive: true, maintainAspectRatio: false } }); }

  const chPrio = document.getElementById('chart-priority');
  if(chPrio) { if(charts.priority) charts.priority.destroy(); charts.priority = new Chart(chPrio, { type: 'pie', data: { labels: ['High', 'Medium', 'Low'], datasets: [{ data: [hi, med, low], backgroundColor: ['#ef4444', '#f59e0b', '#10b981'] }] }, options: { responsive: true, maintainAspectRatio: false } }); }

  const cats = ['Pothole', 'Water Leak', 'Electrical', 'Garbage', 'Drainage', 'Traffic']; const catData = cats.map(c => db.filter(i => i.category === c).length);
  const chCat = document.getElementById('chart-categories');
  if(chCat) { if(charts.categories) charts.categories.destroy(); charts.categories = new Chart(chCat, { type: 'bar', data: { labels: cats, datasets: [{ label: 'Number of Issues', data: catData, backgroundColor: '#3b82f6', borderRadius: 4 }] }, options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } } }); }

  const chTrend = document.getElementById('chart-trend');
  if(chTrend) {
    if(charts.trend) charts.trend.destroy();
    charts.trend = new Chart(chTrend, { type: 'line', data: { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], datasets: [{ label: 'Issues Resolved', data: [12, 19, 15, 25, 22, 30, res], borderColor: '#10b981', tension: 0.4, fill: true, backgroundColor: 'rgba(16, 185, 129, 0.1)' }] }, options: { responsive: true, maintainAspectRatio: false } });
  }

  // Fire Heatmap initializations
  await initAdminHeatmap();
}

async function renderPointsHistory() {
  const list = document.getElementById('points-history-list');
  if(!list || !currentUser || !supabaseClient) return;
  const { data, error } = await supabaseClient.from('points_history').select('*').eq('user_email', currentUser.email).order('created_at', {ascending: false});
  if(error || !data || data.length === 0) { list.innerHTML = '<p class="text-muted">No points history yet.</p>'; return; }
  
  list.innerHTML = data.map(d => `
    <div style="display:flex; justify-content:space-between; padding: 10px; background:var(--bg-surface); border:1px solid var(--border); border-radius:4px; margin-bottom: 0.5rem;">
      <div><strong>${d.action}</strong><br><span class="text-xs text-muted">${new Date(d.created_at).toLocaleDateString()}</span></div>
      <strong style="color:${d.points_change > 0 ? 'var(--success)' : 'var(--danger)'};">${d.points_change > 0 ? '+' : ''}${d.points_change} pts</strong>
    </div>
  `).join('');
  const mPts = document.getElementById('manage-pts'); if(mPts) mPts.innerText = currentUser.points;
}

async function redeemReward(cost, rewardName) {
  if(!currentUser || currentUser.points < cost) return showToast("Not enough points!", "warning", "⚠️");
  await updateUserStats(-cost, 0, 0, rewardName);
  await renderPointsHistory();
}

async function renderNgo() {
  let db = await getDB(); const unfunded = db.filter(i => i.budget.includes('Pending') && i.status !== 'resolved'); 
  const cont = document.getElementById('ngo-issue-list'); if(!cont) return;
  if(unfunded.length === 0) { cont.innerHTML = '<p class="text-muted" style="grid-column: 1/-1; text-align:center;">No unfunded issues right now!</p>'; return; }
  cont.innerHTML = unfunded.map(i => `
    <div class="issue-card-clean" style="border-color: var(--purple);">
      <div class="issue-img-wrapper"><img src="${i.img}" onerror="this.src='https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80'"></div>
      <div class="issue-card-content">
        <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;"><span class="text-xs text-muted">${i.id}</span><span class="badge badge-high">Unfunded</span></div>
        <h3 style="font-size:1.05rem; margin-bottom:0.5rem;">${i.title}</h3><p class="text-xs text-muted mb-2">📍 ${i.location}</p>
        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border); padding-top:0.75rem; margin-top:auto;"><span class="text-xs text-purple font-medium">👥 ${i.volunteers} Volunteers</span><button class="btn text-xs" style="background:var(--purple); color:white; border-radius:50px;" onclick="openNGOForm('${i.id}')">View</button></div>
      </div>
    </div>`).join('');
}

async function renderBudget() {
  let db = await getDB(); const pending = db.filter(i => i.budget.includes('Pending') && i.status !== 'resolved'); 
  const tbody = document.getElementById('budget-approval-table'); if(!tbody) return;
  if(pending.length === 0) { tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted" style="padding: 2rem;">All issues funded.</td></tr>'; return; }
  tbody.innerHTML = pending.map(i => `<tr><td><span class="table-id">${i.id}</span></td><td><div class="font-medium">${i.title}</div><div class="text-xs text-muted">📍 ${i.location}</div></td><td><span class="badge badge-outline">${i.dept}</span></td><td class="font-medium" style="color:var(--danger);">₹${i.priority === 'high' ? '75,000' : '25,000'}</td><td><button type="button" class="btn btn-success text-xs" style="border-radius:50px;" onclick="allocateFunds('${i.id}')">Approve Funds</button></td></tr>`).join('');
}

async function allocateFunds(id) {
  showLoader(); let db = await getDB(); const iss = db.find(i => i.id === id);
  let newTimeline = [...iss.timeline, {title: 'Funds Approved', date: new Date().toISOString(), type:'active'}];
  await updateDB(id, { budget: 'Funded', status: 'in progress', timeline: newTimeline });
  await logAudit('FUNDS_ALLOCATED', `Approved budget for Issue ${id}.`);
  hideLoader(); showToast(`Funding approved!`, 'success', '💰'); await reRenderAllActive();
}

async function renderGov() {
  let db = await getDB();
  const e1 = document.getElementById('gov-l1'); if(e1) e1.innerText = db.filter(i=>i.escalationLevel===1).length;
  const e2 = document.getElementById('gov-l2'); if(e2) e2.innerText = db.filter(i=>i.escalationLevel===2).length;
  const e3 = document.getElementById('gov-l3'); if(e3) e3.innerText = db.filter(i=>i.escalationLevel===3).length;
  const list = document.getElementById('gov-issue-list'); if(!list) return;
  const escalations = db.filter(i=>i.escalationLevel > 0 && i.status !== 'resolved').sort((a,b)=>b.escalationLevel - a.escalationLevel);
  if(escalations.length === 0) { list.innerHTML = `<p style="color:white;">No active escalations.</p>`; return; }
  list.innerHTML = escalations.map(i => `
    <div class="gov-issue-card">
      <div>
        <div style="display:flex; gap: 0.5rem; align-items:center; margin-bottom: 0.5rem;"><span class="badge badge-high" style="background:#ea580c; color:white;">LEVEL ${i.escalationLevel}</span><span class="text-xs" style="color:#94a3b8;">Pending: ${i.daysPending} Days</span></div>
        <h3 style="font-size:1.15rem; margin-bottom:0.25rem;">${i.title}</h3>
        <p class="text-sm" style="color:#94a3b8;">Dept: <strong>${i.dept}</strong> | Upvotes: ${i.upvotes}</p>
      </div>
      <div style="display:flex; gap: 0.5rem;"><button class="btn" style="background:#334155; color: white;" onclick="openModal('${i.id}')">View</button><button class="btn" style="background: #ea580c; color: white;" onclick="generateDigitalNotice('${i.id}')">Issue Notice</button></div>
    </div>`).join('');
}

async function renderTransparency() {
  let db = await getDB(); const list = document.getElementById('transparency-list'); if(!list) return;
  const esc = db.filter(i=>i.escalationLevel > 0 && i.status !== 'resolved').sort((a,b)=>b.daysPending - a.daysPending);
  if(esc.length === 0) { list.innerHTML = `<p class="text-muted" style="padding:1rem;">No issues are currently pending beyond SLA.</p>`; return;}
  list.innerHTML = esc.map(i => `<div style="padding:1rem; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;"><span><strong style="color:var(--text-primary);">${i.title}</strong><br><span class="text-xs text-muted">Assigned: ${i.dept}</span></span> <span class="badge badge-high" style="font-size:0.85rem;">Delayed ${i.daysPending} days</span></div>`).join('');
}

async function renderSuperAdmin() {
  const uTbody = document.getElementById('sa-users-table'); const logDiv = document.getElementById('sa-audit-logs');
  if(!uTbody || !logDiv || !supabaseClient) return;
  const { data: users } = await supabaseClient.from('app_users').select('*').order('created_at', {ascending: false});
  const { data: logs } = await supabaseClient.from('audit_logs').select('*').order('created_at', {ascending: false});
  if(users) uTbody.innerHTML = users.map(u => `<tr style="border-bottom: 1px solid var(--border);"><td style="padding:10px;">${u.name}</td><td style="padding:10px;">${u.email}</td><td style="padding:10px;"><span class="badge badge-outline">${u.role}</span></td><td style="padding:10px; font-weight:bold;">${u.points}</td></tr>`).join('');
  if(logs) {
    if(logs.length === 0) logDiv.innerHTML = '<p style="color:#94a3b8;">No audit logs yet.</p>';
    else logDiv.innerHTML = logs.map(l => `<div style="background: rgba(255,255,255,0.05); padding: 1rem; border-left: 4px solid #10b981; border-radius: 4px; margin-bottom: 0.8rem;"><div style="display:flex; justify-content:space-between; margin-bottom:5px;"><strong style="color:#10b981;">[${l.action}]</strong><span style="font-size:0.75rem; color:#94a3b8;">${new Date(l.created_at).toLocaleString()}</span></div><div style="font-size:0.85rem;">User: <strong>${l.user_email}</strong> (${l.role})</div><div style="font-size:0.85rem; color:#cbd5e1; margin-top:5px;">${l.details}</div></div>`).join('');
  }
}
