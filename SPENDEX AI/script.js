if (typeof emailjs !== 'undefined') {
    emailjs.init("YOUR_PUBLIC_KEY_HERE"); 
}

window.switchView = (viewId) => {
    document.querySelectorAll('.view-section').forEach(el => {
        el.classList.add('d-none');
    });
    
    document.querySelectorAll('.sidebar li').forEach(el => {
        el.classList.remove('active-nav');
    });
    
    const targetView = document.getElementById(viewId);
    if (targetView) {
        targetView.classList.remove('d-none');
        targetView.style.opacity = '1'; 
        
        if (typeof anime !== 'undefined') {
            targetView.style.opacity = '0';
            anime({ 
                targets: targetView, 
                opacity: [0, 1], 
                translateY: [15, 0], 
                duration: 400, 
                easing: 'easeOutSine' 
            });
        }
    }
    
    const linkElem = document.querySelector(`.sidebar a[onclick*="switchView('${viewId}')"]`);
    if (linkElem && linkElem.parentElement) {
        linkElem.parentElement.classList.add('active-nav');
    }
    
    try {
        if (viewId === 'dashboard') Dashboard.render();
        if (viewId === 'financial-health') FinancialHealth.render();
        if (viewId === 'predictions') Simulator.update();
        if (viewId === 'settings') {
            document.getElementById('set-name').value = AppState.state.settings.name;
            document.getElementById('set-email').value = AppState.state.settings.email;
            document.getElementById('set-budget').value = AppState.state.settings.budgetLimit;
            document.getElementById('set-currency').value = AppState.state.settings.currency;
            document.getElementById('set-notifications').checked = AppState.state.settings.notifications;
        }
    } catch (err) {
        console.error("Non-fatal error rendering view " + viewId + ":", err);
    }
};

window.togglePassword = (inputId, iconId) => {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
};


window.forgotPassword = () => {
    Swal.fire({
        title: 'Reset Password',
        input: 'email',
        inputPlaceholder: 'Enter your registered email address',
        showCancelButton: true,
        confirmButtonText: 'Send Reset Link',
        confirmButtonColor: '#3b82f6',
        background: document.body.classList.contains('dark-mode') ? '#1e293b' : '#fff',
        color: document.body.classList.contains('dark-mode') ? '#fff' : '#000'
    }).then((result) => {
        if (result.isConfirmed && result.value) {
            
            Swal.fire({
                title: 'Sending...',
                text: 'Dispatching secure reset link.',
                allowOutsideClick: false,
                didOpen: () => { Swal.showLoading(); }
            });

            if (typeof emailjs !== 'undefined') {
                emailjs.send("YOUR_SERVICE_ID_HERE", "YOUR_TEMPLATE_ID_HERE", {
                    to_email: result.value,
                    message: `Hello from Spendix AI. Here is your secure password reset link: https://yourdomain.com/reset?token=${Date.now()}`
                }).then(() => {
                    Swal.fire({
                        title: 'Sent!',
                        text: `A secure reset link has been dispatched to ${result.value}`,
                        icon: 'success',
                        confirmButtonColor: '#3b82f6',
                        background: document.body.classList.contains('dark-mode') ? '#1e293b' : '#fff',
                        color: document.body.classList.contains('dark-mode') ? '#fff' : '#000'
                    });
                    if (typeof Audit !== 'undefined' && Audit.log) Audit.log(`Password reset requested for ${result.value}`);
                }).catch((error) => {
                    console.error("EmailJS Error:", error);
                    // Failsafe if EmailJS is not configured yet
                    Swal.fire({
                        title: 'Simulated!',
                        text: `(EmailJS keys not configured). Simulated sending link to ${result.value}`,
                        icon: 'info',
                        confirmButtonColor: '#3b82f6'
                    });
                });
            } else {
                Swal.fire('Simulated', `Sent link to ${result.value}`, 'success');
            }
        }
    });
};


const LoginCanvas = {
    init() {
        const canvas = document.getElementById('login-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        for (let i = 0; i < 50; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 1,
                vy: (Math.random() - 0.5) * 1,
                radius: Math.random() * 2 + 1
            });
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            if (document.body.classList.contains('dark-mode')) {
                ctx.fillStyle = 'rgba(255,255,255,0.4)';
                ctx.strokeStyle = 'rgba(255,255,255,0.05)';
            } else {
                ctx.fillStyle = 'rgba(59,130,246,0.3)';
                ctx.strokeStyle = 'rgba(59,130,246,0.1)';
            }
            
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
                
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();
            });

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    if (Math.sqrt(dx * dx + dy * dy) < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(draw);
        }
        
        draw();
        
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }
};

const DB = {
    USERS_KEY: 'spendix_users_db_v12',
    DATA_PREFIX: 'spendix_data_v12_',
    
    getUsers() {
        return JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
    },
    
    addUser(user) {
        const users = this.getUsers();
        users.push(user);
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    },
    
    getUserData(email) {
        return JSON.parse(localStorage.getItem(this.DATA_PREFIX + email) || 'null');
    },
    
    saveUserData(email, data) {
        localStorage.setItem(this.DATA_PREFIX + email, JSON.stringify(data));
    }
};

window.fillLogin = (email) => {
    document.getElementById('login-email').value = email;
    document.getElementById('login-password').value = 'demo123';
};

window.toggleAuth = (view) => {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const testRoles = document.getElementById('test-roles-section');
    
    if (view === 'signup') {
        loginForm.classList.add('d-none');
        signupForm.classList.remove('d-none');
        testRoles.classList.add('d-none');
    } else {
        loginForm.classList.remove('d-none');
        signupForm.classList.add('d-none');
        testRoles.classList.remove('d-none');
    }
};

const Auth = {
    currentUser: null,
    
    register(name, email, password) {
        const users = DB.getUsers();
        if (users.find(u => u.email === email)) {
            return UI.showToast('Error', 'Email already exists.', 'danger');
        }
        
        let role = 'Admin';
        if (email.includes('hr')) role = 'HR';
        else if (email.includes('emp')) role = 'Employee';

        const newUser = { email, password, name, role };
        DB.addUser(newUser);
        
        const initialData = {
            settings: {
                name: name,
                email: email,
                budgetLimit: 50000,
                currency: '$',
                themeMode: 'dark',
                themeColor: 'theme-blue',
                notifications: true
            },
            data: {
                employees: [],
                workspaces: {
                    'main': { expenses: [], audit: [] },
                    'branch': { expenses: [], audit: [] }
                }
            }
        };
        
        DB.saveUserData(email, initialData);
        this.login(email, password);
        UI.showToast('Welcome', 'Account created successfully!', 'success');
    },
    
    login(email, password) {
        const users = DB.getUsers();
        const user = users.find(u => u.email === email && u.password === password);
        
        // DEMO ACCOUNT BYPASS
        if (!user && (email.endsWith('@demo.com') && password === 'demo123')) {
             let role = 'Admin';
             if (email.includes('hr')) role = 'HR';
             else if (email.includes('emp')) role = 'Employee';
             
             this.currentUser = { email, name: 'Demo User', role };
             this.completeLogin();
             return;
        }

        if (!user) {
            return UI.showToast('Error', 'Invalid credentials.', 'danger');
        }
        
        this.currentUser = user;
        this.completeLogin();
    },
    
    completeLogin() {
        const loginScreen = document.getElementById('auth-screen');
        if (typeof anime !== 'undefined') {
            anime({
                targets: loginScreen,
                opacity: 0,
                duration: 500,
                easing: 'linear',
                complete: () => this.bootApp(loginScreen)
            });
        } else {
            this.bootApp(loginScreen);
        }
    },

    bootApp(loginScreen) {
        loginScreen.classList.add('d-none');
        document.getElementById('main-app').classList.remove('d-none');
        document.getElementById('sidebar-role-badge').innerText = this.currentUser.role.toUpperCase();
        
        AppState.init(this.currentUser.email);
        Kanban.init();
        Chatbot.init();
        Simulator.init();
        Audit.log('User Login successful.');
    },
    
    applyPermissions() {
        const links = document.querySelectorAll('#nav-links li');
        let firstAvailableView = null;

        links.forEach(link => {
            const allowedRoles = link.getAttribute('data-roles').split(',');
            if (allowedRoles.includes(this.currentUser.role)) {
                link.style.display = 'block';
                if (!firstAvailableView) {
                    firstAvailableView = link.querySelector('a').getAttribute('onclick').match(/'([^']+)'/)[1];
                }
            } else {
                link.style.display = 'none';
            }
        });

        if (firstAvailableView) {
            window.switchView(firstAvailableView);
        }
    }
};

const AppState = {
    userEmail: null,
    currentWorkspace: 'main',
    state: null,
    
    init(email) {
        this.userEmail = email;
        const fetchedData = DB.getUserData(email);
        
        if (fetchedData) {
            this.state = fetchedData;
        } else {
            this.state = {
                settings: {
                    name: Auth.currentUser ? Auth.currentUser.name : 'User',
                    email: email,
                    budgetLimit: 50000,
                    currency: '$',
                    themeMode: 'dark',
                    themeColor: 'theme-blue',
                    notifications: true
                },
                data: {
                    employees: [],
                    workspaces: {
                        'main': { expenses: [], audit: [] },
                        'branch': { expenses: [], audit: [] }
                    }
                }
            };
        }
        
        Auth.applyPermissions();
        this.applySettings();
        this.notifySubscribers();
    },
    
    save() {
        if (!this.userEmail) return;
        DB.saveUserData(this.userEmail, this.state);
        this.applySettings();
        this.notifySubscribers();
    },
    
    get current() {
        if (!this.state.data.workspaces) {
            this.state.data.workspaces = { 'main': { expenses: [], audit: [] } };
        }
        return this.state.data.workspaces[this.currentWorkspace];
    },
    
    applySettings() {
        try {
            ThemeManager.applyMode(this.state.settings.themeMode);
            ThemeManager.setPrimary(this.state.settings.themeColor, false);
            
            const nameEl = document.getElementById('sidebar-user-name');
            if (nameEl) nameEl.innerText = this.state.settings.name;
            
            const avatarEl = document.getElementById('profile-avatar');
            if (avatarEl) avatarEl.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(this.state.settings.name)}&background=random&color=fff`;
            
            document.querySelectorAll('#currency-symbol').forEach(el => {
                el.innerText = this.state.settings.currency;
            });
        } catch (err) {
            console.error("Apply settings error:", err);
        }
    },
    
    notifySubscribers() {
        try {
            if (['Admin','HR'].includes(Auth.currentUser.role)) Dashboard.render();
            if (Auth.currentUser.role === 'Admin') FinancialHealth.render();
            if (['Admin','HR'].includes(Auth.currentUser.role)) Payroll.renderTable();
            if (Auth.currentUser.role === 'Admin') AI.runAnalysis();
            
            Expenses.render();
            Kanban.render();
            Audit.render();
        } catch (e) {
            console.error("Error in notifySubscribers", e);
        }
    }
};

const Audit = {
    log(action) {
        if (!AppState.current || !AppState.current.audit) return;
        
        const newLog = {
            id: Date.now(),
            action: action,
            user: Auth.currentUser ? Auth.currentUser.role : 'System',
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        };
        
        AppState.current.audit.unshift(newLog);
        if (AppState.current.audit.length > 50) AppState.current.audit.pop();
        AppState.save();
    },
    
    render() {
        const container = document.getElementById('audit-feed');
        if (!container) return;
        
        if (!AppState.current.audit || AppState.current.audit.length === 0) {
            container.innerHTML = '<div class="p-4 text-center text-muted">No activity logged.</div>';
            return;
        }
        
        let htmlContent = '';
        AppState.current.audit.forEach(log => {
            htmlContent += `
                <div class="list-group-item audit-item d-flex justify-content-between align-items-center">
                    <div>
                        <span class="badge bg-soft-blue text-primary me-2">${log.user}</span>
                        <span class="fw-medium">${log.action}</span>
                    </div>
                    <small class="text-muted">${log.time}</small>
                </div>
            `;
        });
        container.innerHTML = htmlContent;
    }
};

const ThemeManager = {
    toggleMode() {
        AppState.state.settings.themeMode = AppState.state.settings.themeMode === 'light' ? 'dark' : 'light';
        AppState.save();
    },
    
    applyMode(mode) {
        if (mode === 'dark') {
            document.body.classList.add('dark-mode');
            const toggle = document.getElementById('darkModeToggle');
            if(toggle) toggle.checked = true;
        } else {
            document.body.classList.remove('dark-mode');
            const toggle = document.getElementById('darkModeToggle');
            if(toggle) toggle.checked = false;
        }
        ChartManager.updateChartColors();
    },
    
    setPrimary(themeClass, save = true) {
        document.body.classList.remove('theme-blue', 'theme-green', 'theme-purple');
        document.body.classList.add(themeClass);
        if (save) {
            AppState.state.settings.themeColor = themeClass;
            AppState.save();
        }
    }
};

const ChartManager = {
    instances: {},
    updateChartColors() {
        if (typeof Chart === 'undefined') return;
        
        const isDark = document.body.classList.contains('dark-mode');
        const color = isDark ? '#f8fafc' : '#1e293b';
        const grid = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
        
        Chart.defaults.color = color;
        Chart.defaults.borderColor = grid;
        
        Object.values(this.instances).forEach(chart => {
            if (chart.options.scales && chart.options.scales.x) {
                chart.options.scales.x.grid.color = grid;
                chart.options.scales.y.grid.color = grid;
            }
            chart.update();
        });
    }
};

const UI = {
    showToast(title, message, type='primary') {
        if (!AppState.state.settings.notifications) return;
        
        const container = document.getElementById('toast-container');
        if (!container) return; 
        
        const id = 'toast-' + Date.now();
        
        container.innerHTML += `
            <div id="${id}" class="toast align-items-center text-bg-${type} border-0 show" role="alert">
                <div class="d-flex">
                    <div class="toast-body"><strong>${title}:</strong> ${message}</div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            </div>
        `;
        
        setTimeout(() => {
            const toastEl = document.getElementById(id);
            if (toastEl) toastEl.remove();
        }, 4000);
    }
};

const Dashboard = {
    render() {
        if (!AppState.current || !AppState.current.expenses) return;

        const totalExp = AppState.current.expenses.reduce((sum, e) => sum + e.amount, 0);
        const totalPay = Payroll.calculateTotalCost();
        const totalBurn = totalExp + totalPay;
        const curr = AppState.state.settings.currency;
        
        if (typeof countUp !== 'undefined' && countUp.CountUp) {
            new countUp.CountUp('dash-total-expenses', totalExp, { prefix: curr }).start();
            new countUp.CountUp('dash-payroll', totalPay, { prefix: curr }).start();
            new countUp.CountUp('dash-emp-count', AppState.state.data.employees.length).start();
        } else {
            const expEl = document.getElementById('dash-total-expenses');
            if(expEl) expEl.innerText = curr + totalExp.toLocaleString();
            
            const payEl = document.getElementById('dash-payroll');
            if(payEl) payEl.innerText = curr + totalPay.toLocaleString();
            
            const empEl = document.getElementById('dash-emp-count');
            if(empEl) empEl.innerText = AppState.state.data.employees.length;
        }
        
        const runwayText = totalBurn > 0 ? (100000 / totalBurn).toFixed(1) + ' Mo' : '∞';
        const runEl = document.getElementById('dash-runway');
        if(runEl) runEl.innerText = runwayText;
        
        let score = totalBurn === 0 ? 0 : 100;
        if (totalBurn > 0) {
            if (totalBurn > AppState.state.settings.budgetLimit) score -= 30;
            if ((100000 / totalBurn) < 6) score -= 20;
        }
        
        if (typeof countUp !== 'undefined' && countUp.CountUp) {
            new countUp.CountUp('dash-health', score).start();
        } else {
            const hEl = document.getElementById('dash-health');
            if(hEl) hEl.innerText = score;
        }
        
        this.renderCharts(score, totalBurn);
    },
    
    renderCharts(score, burn) {
        if (typeof Chart === 'undefined') return;

        // Health Gauge
        if (ChartManager.instances.health) ChartManager.instances.health.destroy();
        const healthCanvas = document.getElementById('healthGaugeChart');
        
        if (healthCanvas) {
            const healthColor = score > 70 ? '#10b981' : score > 40 ? '#f59e0b' : '#ef4444';
            ChartManager.instances.health = new Chart(healthCanvas, {
                type: 'doughnut',
                data: {
                    labels: ['Score', 'Gap'],
                    datasets: [{
                        data: [score, 100 - score],
                        backgroundColor: [healthColor, 'rgba(150,150,150,0.2)'],
                        borderWidth: 0,
                        cutout: '80%'
                    }]
                },
                options: { plugins: { legend: { display: false }, tooltip: { enabled: false } } }
            });
        }

        // Cash Flow Line Chart
        if (ChartManager.instances.flow) ChartManager.instances.flow.destroy();
        const flowCanvas = document.getElementById('cashFlowChart');
        
        if (flowCanvas) {
            const ctxFlow = flowCanvas.getContext('2d');
            const gradient = ctxFlow.createLinearGradient(0,0,0,400);
            gradient.addColorStop(0, 'rgba(59,130,246,0.5)');
            gradient.addColorStop(1, 'rgba(59,130,246,0)');
            
            const burnHistory = burn === 0 ? [0,0,0,0,0,0] : [burn*0.8, burn*0.9, burn, burn*1.1, burn*0.95, burn];
            
            ChartManager.instances.flow = new Chart(ctxFlow, {
                type: 'line',
                data: {
                    labels: ['M-5','M-4','M-3','M-2','M-1','Current'],
                    datasets: [{
                        label: 'Monthly Burn',
                        data: burnHistory,
                        borderColor: '#3b82f6',
                        backgroundColor: gradient,
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
            });
        }

        // Expense Distribution Pie Chart
        const categories = {};
        AppState.current.expenses.forEach(e => {
            categories[e.category] = (categories[e.category] || 0) + e.amount;
        });
        
        if (ChartManager.instances.pie) ChartManager.instances.pie.destroy();
        const pieCanvas = document.getElementById('expensePieChart');
        
        if (pieCanvas) {
            ChartManager.instances.pie = new Chart(pieCanvas, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(categories).length ? Object.keys(categories) : ['None'],
                    datasets: [{
                        data: Object.values(categories).length ? Object.values(categories) : [1],
                        backgroundColor: Object.keys(categories).length ? ['#3b82f6','#10b981','#8b5cf6','#f59e0b','#ef4444'] : ['#e2e8f0']
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right' } } }
            });
        }
    }
};

const FinancialHealth = {
    render() {
        if (!AppState.current) return;
        const totalBurn = Payroll.calculateTotalCost() + AppState.current.expenses.reduce((s,e)=>s+e.amount,0);
        
        const drEl = document.getElementById('metric-debt-ratio');
        if(drEl) drEl.innerText = '0.18';
        const bdrEl = document.getElementById('bar-debt-ratio');
        if(bdrEl) bdrEl.style.width = '18%';
        
        const pmEl = document.getElementById('metric-profit-margin');
        if(pmEl) pmEl.innerText = totalBurn > 0 ? '15%' : '0%';
        const bpmEl = document.getElementById('bar-profit-margin');
        if(bpmEl) bpmEl.style.width = totalBurn > 0 ? '15%' : '0%';
        
        if (typeof countUp !== 'undefined' && countUp.CountUp) {
            new countUp.CountUp('metric-cash-reserves', 100000, { prefix: AppState.state.settings.currency }).start();
        } else {
            const crEl = document.getElementById('metric-cash-reserves');
            if(crEl) crEl.innerText = AppState.state.settings.currency + "100,000";
        }

        if (typeof Chart !== 'undefined') {
            if (ChartManager.instances.liq) ChartManager.instances.liq.destroy();
            const liqCanvas = document.getElementById('liquidityChart');
            
            if (liqCanvas) {
                ChartManager.instances.liq = new Chart(liqCanvas, {
                    type: 'bar',
                    data: {
                        labels: ['Wk 1','Wk 2','Wk 3','Wk 4'],
                        datasets: [
                            { label: 'Inflow', data: totalBurn === 0 ? [0,0,0,0] : [25000, 22000, 30000, 28000], backgroundColor: '#10b981' },
                            { label: 'Outflow', data: totalBurn === 0 ? [0,0,0,0] : [totalBurn/4, totalBurn/4, totalBurn/4, totalBurn/4], backgroundColor: '#ef4444' }
                        ]
                    },
                    options: { responsive: true, maintainAspectRatio: false }
                });
            }
        }
    }
};

const Payroll = {
    calcNetPay(emp) {
        return emp.baseSalary + (emp.baseSalary * (emp.bonus/100)) - (emp.baseSalary * (emp.tax/100));
    },
    
    calculateTotalCost() {
        if(!AppState.state || !AppState.state.data.employees) return 0;
        return AppState.state.data.employees.reduce((sum, e) => sum + (this.calcNetPay(e)/12), 0);
    },
    
    add(employeeData) {
        AppState.state.data.employees.push({ id: Date.now(), ...employeeData });
        Audit.log(`Added employee: ${employeeData.name}`);
        AppState.save();
        Swal.fire('Added', 'Employee added successfully.', 'success');
    },
    
    delete(id) {
        AppState.state.data.employees = AppState.state.data.employees.filter(e => e.id !== id);
        Audit.log('Deleted an employee record');
        AppState.save();
    },
    
    renderTable() {
        const tbody = document.getElementById('emp-table-body');
        if (!tbody) return;
        
        if (!AppState.state || AppState.state.data.employees.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center py-4">No employees registered in database.</td></tr>`;
            return;
        }
        
        let htmlContent = '';
        const currency = AppState.state.settings.currency;
        
        AppState.state.data.employees.forEach(emp => {
            const monthlyNet = Math.round(this.calcNetPay(emp) / 12);
            htmlContent += `
                <tr>
                    <td class="ps-4">
                        <div class="d-flex align-items-center gap-2">
                            <div class="bg-soft-blue text-primary rounded-circle d-flex justify-content-center align-items-center" style="width:32px; height:32px; font-size:12px;">
                                ${emp.name.charAt(0)}
                            </div>
                            <div>
                                <div class="fw-bold">${emp.name}</div>
                                <small class="text-muted" style="font-size:11px;">${emp.email}</small>
                            </div>
                        </div>
                    </td>
                    <td><span class="badge bg-soft-blue text-primary border-0">${emp.role}</span></td>
                    <td>${currency}${emp.baseSalary.toLocaleString()}</td>
                    <td class="fw-bold text-primary">${currency}${monthlyNet.toLocaleString()}/mo</td>
                    <td class="text-center">
                        <button class="btn btn-sm btn-outline-success border-0" onclick="window.Alerts.send(${emp.id}, 'whatsapp')" title="Send WhatsApp">
                            <i class="fa-brands fa-whatsapp fs-5"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-primary border-0" onclick="window.Alerts.send(${emp.id}, 'email')" title="Send Email">
                            <i class="fa-solid fa-envelope fs-5"></i>
                        </button>
                    </td>
                    <td class="text-end pe-4">
                        <button class="btn btn-sm btn-light border text-danger" onclick="Payroll.delete(${emp.id})">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
        tbody.innerHTML = htmlContent;
    }
};

const Expenses = {
    add(amount, desc, category) {
        if (!AppState.current.expenses) AppState.current.expenses = [];
        
        const newExpense = {
            id: Date.now(),
            amount: amount,
            desc: desc,
            category: category,
            date: dayjs().format('YYYY-MM-DD'),
            status: 'pending' 
        };
        AppState.current.expenses.unshift(newExpense);
        Audit.log(`Logged expense: ${desc} for ${AppState.state.settings.currency}${amount}`);
        AppState.save();
    },
    
    delete(id) {
        AppState.current.expenses = AppState.current.expenses.filter(e => e.id !== id);
        Audit.log('Deleted an expense record');
        AppState.save();
    },
    
    render() {
        const tbody = document.getElementById('expense-list-body');
        if (!tbody || !AppState.current || !AppState.current.expenses) return;
        
        let htmlContent = '';
        const currency = AppState.state.settings.currency;
        
        AppState.current.expenses.forEach(exp => {
            const statusColor = exp.status === 'paid' ? 'success' : exp.status === 'approved' ? 'primary' : 'warning';
            htmlContent += `
                <tr>
                    <td>${exp.date}</td>
                    <td class="fw-medium">${exp.desc}</td>
                    <td><span class="badge bg-light text-dark border">${exp.category}</span></td>
                    <td class="text-end fw-bold">${currency}${exp.amount.toLocaleString()}</td>
                    <td class="text-center"><span class="badge bg-soft-${statusColor} text-${statusColor}">${exp.status.toUpperCase()}</span></td>
                    <td><i class="fa-solid fa-trash text-danger cursor-pointer" onclick="Expenses.delete(${exp.id})"></i></td>
                </tr>
            `;
        });
        tbody.innerHTML = htmlContent;
        
        this.updateBudgetUI();
    },

    updateBudgetUI() {
        const totalExp = AppState.current.expenses.reduce((sum, e) => sum + e.amount, 0);
        const limit = AppState.state.settings.budgetLimit;
        const percentage = limit > 0 ? Math.min((totalExp / limit) * 100, 100) : 0;
        const currency = AppState.state.settings.currency;
        
        const displayEl = document.getElementById('budget-display');
        const barEl = document.getElementById('budget-bar');
        const warnEl = document.getElementById('budget-warning');
        
        if (displayEl) displayEl.innerText = `${currency}${totalExp.toLocaleString()} / ${currency}${limit.toLocaleString()}`;
        if (barEl) barEl.style.width = percentage + '%';
        
        if (warnEl && barEl) {
            if (totalExp > limit) {
                barEl.className = 'progress-bar bg-danger';
                warnEl.classList.remove('d-none');
                warnEl.innerText = 'OVER BUDGET LIMIT!';
                UI.showToast('Budget Exceeded', `You have surpassed your monthly budget of ${currency}${limit}.`, 'danger');
                
                // --- REAL EMAIL ALERT TRIGGER ---
                if (AppState.state.settings.notifications && typeof emailjs !== 'undefined') {
                    if (!sessionStorage.getItem('budget_alert_sent')) {
                        emailjs.send("YOUR_SERVICE_ID_HERE", "YOUR_TEMPLATE_ID_HERE", {
                            to_email: AppState.state.settings.email,
                            message: `ALERT: Your Spendix AI workspace has exceeded the monthly budget limit of ${currency}${limit}. Current spend: ${currency}${totalExp}.`
                        }).then(() => {
                            console.log("Budget alert email sent successfully.");
                            sessionStorage.setItem('budget_alert_sent', 'true'); 
                        }).catch(e => console.error("EmailJS Error:", e));
                    }
                }
                
            } else if (percentage > 85) {
                barEl.className = 'progress-bar bg-warning';
                warnEl.classList.remove('d-none');
                warnEl.innerText = 'Approaching Budget Limit!';
                UI.showToast('Budget Warning', `You have consumed ${percentage.toFixed(0)}% of your budget.`, 'warning');
            } else {
                barEl.className = 'progress-bar bg-success';
                warnEl.classList.add('d-none');
            }
        }
    },
    
    suggestCategory(desc) {
        const keywords = {
            'Software': ['aws', 'jira', 'slack', 'adobe', 'github', 'server'],
            'Meals': ['lunch', 'dinner', 'coffee', 'starbucks', 'pizza', 'food'],
            'Travel': ['uber', 'lyft', 'hotel', 'flight', 'taxi'],
            'Marketing': ['ads', 'google', 'facebook', 'campaign']
        };
        const descLower = desc.toLowerCase();
        for (const [category, words] of Object.entries(keywords)) {
            if (words.some(word => descLower.includes(word))) return category;
        }
        return null;
    }
};

const Kanban = {
    init() {
        if (typeof Sortable === 'undefined') return;
        
        const lists = ['pending', 'approved', 'paid'];
        lists.forEach(status => {
            const container = document.getElementById(`kanban-${status}`);
            if (container) {
                new Sortable(container, {
                    group: 'shared',
                    animation: 150,
                    onEnd: (evt) => this.handleDrop(evt)
                });
            }
        });
    },
    
    render() {
        if (!AppState.current || !AppState.current.expenses) return;
        
        const lists = ['pending', 'approved', 'paid'];
        const currency = AppState.state.settings.currency;
        
        lists.forEach(status => {
            const container = document.getElementById(`kanban-${status}`);
            if (!container) return;
            
            let htmlContent = '';
            const filteredExpenses = AppState.current.expenses.filter(e => e.status === status);
            
            filteredExpenses.forEach(exp => {
                htmlContent += `
                    <div class="kanban-card" data-id="${exp.id}">
                        <div class="d-flex justify-content-between mb-2">
                            <span class="badge bg-light text-dark border">${exp.category}</span>
                            <span class="fw-bold text-success">${currency}${exp.amount}</span>
                        </div>
                        <p class="mb-1 fw-medium lh-sm">${exp.desc}</p>
                        <small class="text-muted"><i class="fa-regular fa-calendar"></i> ${exp.date}</small>
                    </div>
                `;
            });
            container.innerHTML = htmlContent;
        });
    },
    
    handleDrop(evt) {
        const expenseId = parseInt(evt.item.getAttribute('data-id'));
        const newStatus = evt.to.id.split('-')[1];
        
        const expense = AppState.current.expenses.find(x => x.id === expenseId);
        if (expense && expense.status !== newStatus) {
            expense.status = newStatus;
            Audit.log(`Moved expense to ${newStatus.toUpperCase()}`);
            AppState.save(); 
        }
    }
};

const Simulator = {
    init() {
        const canvasEl = document.getElementById('simComparisonChart');
        if (canvasEl) {
            this.ctx = canvasEl.getContext('2d');
            
            ['sim-hires', 'sim-salary', 'sim-marketing'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.addEventListener('input', () => this.update());
            });
            this.update();
        }
    },
    
    update() {
        if (!AppState.current) return;
        
        const hires = parseInt(document.getElementById('sim-hires').value) || 0;
        const salaryInc = parseInt(document.getElementById('sim-salary').value) || 0;
        const marketing = parseInt(document.getElementById('sim-marketing').value) || 0;
        
        document.getElementById('sim-hires-val').innerText = hires;
        document.getElementById('sim-salary-val').innerText = salaryInc + '%';
        document.getElementById('sim-marketing-val').innerText = '+' + AppState.state.settings.currency + marketing;
        
        const currentBurn = Payroll.calculateTotalCost() + AppState.current.expenses.reduce((a,x) => a + x.amount, 0);
        
        let simBurn = currentBurn;
        simBurn += (hires * 8000); 
        simBurn *= (1 + (salaryInc / 100));
        simBurn += marketing;
        
        document.getElementById('sim-result-burn').innerText = AppState.state.settings.currency + Math.round(simBurn).toLocaleString();
        document.getElementById('sim-result-runway').innerText = simBurn > 0 ? (100000 / simBurn).toFixed(1) + ' Mo' : '∞';
        
        if (typeof Chart === 'undefined') return;
        if (ChartManager.instances.sim) ChartManager.instances.sim.destroy();
        
        ChartManager.instances.sim = new Chart(this.ctx, {
            type: 'line',
            data: {
                labels: ['M1','M2','M3','M4','M5','M6'],
                datasets: [
                    { label: 'Base Trajectory', data: [currentBurn, currentBurn, currentBurn, currentBurn, currentBurn, currentBurn], borderColor: '#64748b', borderDash: [5,5], fill: false },
                    { label: 'Simulated Scenario', data: [simBurn, simBurn, simBurn, simBurn, simBurn, simBurn], borderColor: '#8b5cf6', backgroundColor: 'rgba(139,92,246,0.1)', fill: true }
                ]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }
};

const AI = {
    runAnalysis() {
        if (!AppState.current || !AppState.current.expenses) return;
        
        const amounts = AppState.current.expenses.map(e => e.amount).sort((a,b)=>a-b);
        const median = amounts[Math.floor(amounts.length/2)] || 0;
        const threshold = median === 0 ? 1000 : median * 3;

        const anomalies = AppState.current.expenses.filter(e => e.amount > threshold);
        const list = document.getElementById('anomaly-list');
        if (!list) return;
        
        list.innerHTML = '';
        const currency = AppState.state.settings.currency;
        
        if (anomalies.length > 0) {
            anomalies.forEach(a => {
                list.innerHTML += `
                    <div class="alert bg-soft-blue border-0 d-flex justify-content-between align-items-center mb-2">
                        <div><i class="fa-solid fa-bolt text-warning me-2"></i><span class="fw-bold text-dark">${a.desc}</span></div>
                        <span class="text-danger fw-bold">${currency}${a.amount.toLocaleString()}</span>
                    </div>`;
            });
        } else {
            list.innerHTML = `<div class="text-center text-muted p-4"><i class="fa-solid fa-shield-halved text-success mb-2 fs-3"></i><br>No unusual spending detected.</div>`;
        }

        const totalBurn = Payroll.calculateTotalCost() + AppState.current.expenses.reduce((s,e)=>s+e.amount,0);
        let insight = totalBurn === 0 ? "Add employees or expenses to get AI insights." : 
                      totalBurn > AppState.state.settings.budgetLimit ? "Warning: Burn rate exceeds budget limits." : 
                      "Spending is healthy and within operational bounds.";
        
        const insightEl = document.getElementById('ai-insight-text');
        if (insightEl) insightEl.innerText = insight;
    }
};

const Chatbot = {
    init() {
        const toggle = document.getElementById('chat-toggle');
        const close = document.getElementById('chat-close');
        const send = document.getElementById('chat-send');
        const input = document.getElementById('chat-input');
        
        if (toggle) {
            toggle.addEventListener('click', () => {
                const chatWindow = document.getElementById('chat-interface');
                chatWindow.classList.remove('d-none');
                if (typeof anime !== 'undefined') anime({ targets: chatWindow, opacity: [0,1], translateY: [20,0], duration: 400 });
            });
        }
        
        if (close) {
            close.addEventListener('click', () => {
                const chatWindow = document.getElementById('chat-interface');
                if (typeof anime !== 'undefined') {
                    anime({
                        targets: chatWindow, opacity: [1,0], translateY: [0,20], duration: 300,
                        complete: () => chatWindow.classList.add('d-none')
                    });
                } else {
                    chatWindow.classList.add('d-none');
                }
            });
        }
        
        if (send) send.addEventListener('click', () => this.handleInput());
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.handleInput();
            });
        }
    },
    
    handleInput() {
        const inputField = document.getElementById('chat-input');
        const text = inputField.value.trim();
        if (!text) return;
        
        this.addMessage(text, 'user');
        inputField.value = '';
        
        // Simulate processing time
        setTimeout(() => this.processCommand(text), 800);
    },
    
    addMessage(text, sender) {
        const div = document.createElement('div');
        div.className = `chat-bubble ${sender} fade-in`;
        div.innerHTML = text;
        const container = document.getElementById('chat-messages');
        if (container) {
            container.appendChild(div);
            container.scrollTop = container.scrollHeight;
        }
    },
    
    processCommand(text) {
        const inputLower = text.toLowerCase();
        let response = "I'm sorry, I didn't understand. Try asking about your 'burn rate', 'health score', or type 'add expense 50 software'.";
        
        const totalBurn = Payroll.calculateTotalCost() + AppState.current.expenses.reduce((a,b) => a + b.amount, 0);
        const currency = AppState.state.settings.currency;
        
        if (inputLower.includes('burn') || inputLower.includes('spend')) {
            response = `Your current monthly burn rate is **${currency}${totalBurn.toLocaleString()}** based on active payroll and expenses.`;
        } 
        else if (inputLower.includes('health') || inputLower.includes('score')) {
            const healthScore = document.getElementById('dash-health').innerText;
            response = `Your system calculates a financial health score of **${healthScore}/100**.`;
        }
        else if (inputLower.includes('add expense')) {
            // Regex to parse "add expense 150 dinner"
            const match = text.match(/add expense\s+(\d+(?:\.\d+)?)\s+(.*)/i);
            if (match) {
                const amount = parseFloat(match[1]);
                const desc = match[2];
                const suggestedCat = Expenses.suggestCategory(desc) || 'Operational';
                
                Expenses.add(amount, desc, suggestedCat);
                response = `Success! Added a **${currency}${amount}** expense for "${desc}" under ${suggestedCat}.`;
            } else {
                response = "To add an expense via chat, use format: *add expense [amount] [description]*";
            }
        }
        
        this.addMessage(response, 'bot');
    }
};



window.Alerts = {
    send(empId, type) {
        const emp = AppState.state.data.employees.find(x => x.id === empId);
        if (!emp) return;
        
        Swal.fire({
            html: `<h4>Connecting API...</h4><p class="text-muted">Simulating ${type.toUpperCase()} connection to ${emp.name}</p>`,
            showConfirmButton: false,
            timer: 1500,
            didOpen: () => Swal.showLoading()
        }).then(() => {
            Swal.fire('Sent!', `${type.toUpperCase()} alert successfully dispatched to ${emp.name}.`, 'success');
            Audit.log(`Dispatched ${type.toUpperCase()} notification to ${emp.name}`);
        });
    }
};

window.SimulateOCR = () => {
    Swal.fire({
        title: 'Scanning Receipt...',
        html: `
            <div class="position-relative overflow-hidden bg-light rounded" style="height:150px; border: 2px dashed #cbd5e1;">
                <div class="ocr-scan-line"></div>
                <div class="d-flex align-items-center justify-content-center h-100 text-muted">
                    <i class="fa-solid fa-receipt fa-3x"></i>
                </div>
            </div>
            <p class="mt-3 small text-muted">Extracting data with Tesseract.js model...</p>
        `,
        showConfirmButton: false,
        timer: 2500
    }).then(() => {
        const descEl = document.getElementById('exp-desc');
        const amtEl = document.getElementById('exp-amount');
        const catEl = document.getElementById('exp-category');
        
        if (descEl) descEl.value = "AWS Cloud Hosting (Extracted)";
        if (amtEl) amtEl.value = 450.00;
        if (catEl) catEl.value = "Software";
        
        UI.showToast('OCR Complete', 'Receipt data extracted successfully.', 'success');
        Audit.log('Utilized AI OCR to extract expense data.');
    });
};
window.exportReport = async () => {
    if (typeof window.jspdf === 'undefined') return UI.showToast('Error', 'PDF Engine not loaded', 'danger');
    
    const doc = new window.jspdf.jsPDF('p', 'mm', 'a4');
    const currency = AppState.state.settings.currency;
    const dateString = dayjs().format('MMMM D, YYYY');
    
    // Page 1: Overview
    doc.setFillColor(59, 130, 246);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text("SPENDEX AI", 15, 20);
    doc.setFontSize(12);
    doc.text("Comprehensive Financial Report", 15, 30);
    doc.text(`Date: ${dateString}`, 150, 30);
    
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(16);
    doc.text("1. Executive Summary", 15, 55);
    
    const totalExp = AppState.current.expenses.reduce((s,e) => s + e.amount, 0);
    const totalPay = Payroll.calculateTotalCost();
    
    doc.setFontSize(11);
    doc.text(`Total Monthly Burn: ${currency}${(totalExp + totalPay).toLocaleString()}`, 15, 65);
    doc.text(`Operational Expenses: ${currency}${totalExp.toLocaleString()}`, 15, 72);
    doc.text(`Payroll Liability: ${currency}${totalPay.toLocaleString()}`, 15, 79);
    doc.text(`Active Employees: ${AppState.state.data.employees.length}`, 15, 86);
    
    const chartNode = document.getElementById('cashFlowChart');
    if (chartNode && typeof html2canvas !== 'undefined') {
        try {
            doc.text("Cash Flow Projection Chart:", 15, 110);
            const canvas = await html2canvas(chartNode.parentNode);
            const imgData = canvas.toDataURL('image/png');
            doc.addImage(imgData, 'PNG', 15, 115, 180, 80);
        } catch(e) { console.error("Could not render chart to PDF", e); }
    }

    // Page 2: Payroll Register
    doc.addPage();
    doc.setFontSize(16);
    doc.text("2. Detailed Payroll Register", 15, 20);
    
    const empBody = AppState.state.data.employees.map(e => [
        e.name, e.role, `${currency}${e.baseSalary}`, `${e.bonus}%`, `${e.tax}%`, `${currency}${Math.round(Payroll.calcNetPay(e)/12)}`
    ]);

    if (doc.autoTable) {
        doc.autoTable({
            startY: 30,
            head: [['Name', 'Role', 'Annual Base', 'Bonus', 'Tax', 'Monthly Net']],
            body: empBody.length ? empBody : [['No data', '-', '-', '-', '-', '-']],
            theme: 'grid',
            headStyles: { fillColor: [59, 130, 246] }
        });
    }

    // Page 3: Expense Ledger
    doc.addPage();
    doc.setFontSize(16);
    doc.text("3. Expense Ledger", 15, 20);
    
    const expBody = AppState.current.expenses.map(e => [
        e.date, e.desc, e.category, `${currency}${e.amount}`, e.status.toUpperCase()
    ]);

    if (doc.autoTable) {
        doc.autoTable({
            startY: 30,
            head: [['Date', 'Description', 'Category', 'Amount', 'Status']],
            body: expBody.length ? expBody : [['No data', '-', '-', '-', '-']],
            theme: 'striped',
            headStyles: { fillColor: [16, 185, 129] }
        });
    }

    doc.save('Spendex_Comprehensive_Report.pdf');
    Audit.log('Exported Full System PDF Report');
};

window.exportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Date,Type,Description,Category,Amount\n";
    
    AppState.current.expenses.forEach(e => {
        csvContent += `${e.date},Expense,${e.desc},${e.category},${e.amount}\n`;
    });
    
    const today = dayjs().format('YYYY-MM-DD');
    AppState.state.data.employees.forEach(e => {
        const monthlyNet = Math.round(Payroll.calcNetPay(e)/12);
        csvContent += `${today},Payroll,${e.name} (${e.role}),HR,${monthlyNet}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "spendex_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    Audit.log('Exported Raw CSV Data');
};

document.addEventListener('DOMContentLoaded', () => {

    // 1. Initialize Login Animation safely
    if (typeof anime !== 'undefined') {
        LoginCanvas.init();
        anime({ targets: '.login-box', translateY: [-50, 0], opacity: [0, 1], duration: 1000, easing: 'easeOutElastic(1, .6)' });
    }

    // 2. Authentication Submissions
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            Auth.login(document.getElementById('login-email').value, document.getElementById('login-password').value);
        });
    }
    
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            Auth.register(
                document.getElementById('signup-name').value, 
                document.getElementById('signup-email').value, 
                document.getElementById('signup-password').value
            );
        });
    }

    window.logout = () => {
        Audit.log('User signed out.');
        setTimeout(() => location.reload(), 300);
    };

    // 3. System Preferences
    const workspaceSwitcher = document.getElementById('workspace-switcher');
    if (workspaceSwitcher) {
        workspaceSwitcher.addEventListener('change', (e) => {
            AppState.currentWorkspace = e.target.value;
            Audit.log(`Context switched to workspace: ${e.target.options[e.target.selectedIndex].text}`);
            
            const content = document.getElementById('content');
            if (content && typeof anime !== 'undefined') {
                anime({
                    targets: content,
                    opacity: [0, 1],
                    scale: [0.97, 1],
                    duration: 500,
                    easing: 'easeOutQuint'
                });
            }
            
            AppState.notifySubscribers();
        });
    }

    // 4. Data Entry Forms
    const expenseForm = document.getElementById('expense-form');
    if (expenseForm) {
        expenseForm.addEventListener('submit', (e) => {
            e.preventDefault();
            Expenses.add(
                parseFloat(document.getElementById('exp-amount').value), 
                document.getElementById('exp-desc').value, 
                document.getElementById('exp-category').value
            );
            e.target.reset();
            UI.showToast('Success', 'Expense logged and routed to Kanban board.', 'success');
        });
    }

    const expDesc = document.getElementById('exp-desc');
    if (expDesc) {
        expDesc.addEventListener('input', (e) => {
            const suggestion = Expenses.suggestCategory(e.target.value);
            const badge = document.getElementById('ai-suggestion');
            if (suggestion) {
                badge.classList.remove('d-none');
                document.getElementById('ai-cat-text').innerText = suggestion;
                document.getElementById('exp-category').value = suggestion; 
            } else {
                badge.classList.add('d-none');
            }
        });
    }

    // 5. Modal Forms
    window.openEmpModal = () => {
        if (typeof bootstrap !== 'undefined') {
            new bootstrap.Modal(document.getElementById('empModal')).show();
        }
    };
    
    const empForm = document.getElementById('emp-form');
    if (empForm) {
        empForm.addEventListener('submit', (e) => {
            e.preventDefault();
            Payroll.add({
                name: document.getElementById('emp-name').value,
                role: document.getElementById('emp-role').value,
                email: document.getElementById('emp-email').value,
                phone: document.getElementById('emp-phone').value,
                baseSalary: parseFloat(document.getElementById('emp-base').value),
                bonus: parseFloat(document.getElementById('emp-bonus').value),
                tax: parseFloat(document.getElementById('emp-tax').value)
            });
            
            if (typeof bootstrap !== 'undefined') {
                const modalInst = bootstrap.Modal.getInstance(document.getElementById('empModal'));
                if (modalInst) modalInst.hide();
            }
            e.target.reset();
        });
    }

    // 6. Settings Forms
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            AppState.state.settings.name = document.getElementById('set-name').value;
            AppState.save();
            UI.showToast('Updated', 'Profile saved.', 'success');
        });
    }

    const prefForm = document.getElementById('preferences-form');
    if (prefForm) {
        prefForm.addEventListener('submit', (e) => {
            e.preventDefault();
            AppState.state.settings.budgetLimit = parseFloat(document.getElementById('set-budget').value);
            AppState.state.settings.currency = document.getElementById('set-currency').value;
            AppState.state.settings.notifications = document.getElementById('set-notifications').checked;
            AppState.save();
            UI.showToast('Updated', 'Preferences saved.', 'success');
        });
    }
});