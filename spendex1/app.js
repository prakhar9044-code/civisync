const App = {
    init() {
        this.cacheDOM();
        this.bindEvents();
        this.registerServiceWorker();
        this.handleRoute(); // Load initial view
    },
    
    cacheDOM() {
        this.viewContainer = document.getElementById('view-container');
        this.themeBtn = document.getElementById('toggle-theme');
    },

    bindEvents() {
        window.addEventListener('hashchange', () => this.handleRoute());
        this.themeBtn.addEventListener('click', () => this.toggleTheme());
    },

    toggleTheme() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', newTheme);
        
        // Animate theme switch
        gsap.fromTo(document.body, {opacity: 0.8}, {opacity: 1, duration: 0.5});
    },

    async handleRoute() {
        const hash = window.location.hash || '#dashboard';
        const route = hash.substring(1);
        
        // Highlight active menu
        document.querySelectorAll('.menu-item').forEach(el => el.classList.remove('active'));
        document.querySelector(`.menu-item[href="${hash}"]`)?.classList.add('active');

        // Render view based on route
        this.viewContainer.innerHTML = ''; 
        
        if (route === 'dashboard') {
            this.viewContainer.innerHTML = DashboardView.render();
            DashboardView.init();
        } else if (route === 'expenses') {
            this.viewContainer.innerHTML = ExpenseView.render();
            ExpenseView.init();
        } else {
            this.viewContainer.innerHTML = `<h2>Page Not Found or Under Construction</h2>`;
        }

        // GSAP page transition animation
        gsap.fromTo('.view-container', {y: 30, opacity: 0}, {y: 0, opacity: 1, duration: 0.6, ease: 'power3.out'});
    },

    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(() => console.log("Spendex PWA Active"))
                .catch(err => console.error("SW failed:", err));
        }
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());