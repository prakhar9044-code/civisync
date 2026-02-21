const DashboardView = {
    render() {
        return `
            <div class="dash-grid">
                <div class="card">
                    <h3>Financial Health Score</h3>
                    <h1 class="text-accent" id="health-score">0</h1>
                </div>
                <div class="card">
                    <h3>Expense Breakdown</h3>
                    <canvas id="expenseChart"></canvas>
                </div>
            </div>
        `;
    },
    init() {
        this.calculateHealth();
        this.renderCharts();
        
        // Re-render charts if data changes
        window.addEventListener('dataChanged', () => {
            this.calculateHealth();
            this.renderCharts();
        });
    },
    calculateHealth() {
        // Mock health score logic
        const expenses = DB.get('expenses').reduce((sum, e) => sum + e.amount, 0);
        const score = Math.max(0, 100 - (expenses / 100)); // Arbitrary mock logic
        
        // Animate number counter
        gsap.to({val: 0}, {
            val: score, 
            duration: 2, 
            onUpdate: function() {
                document.getElementById('health-score').innerText = Math.floor(this.targets()[0].val) + "/100";
            }
        });
    },
    renderCharts() {
        const ctx = document.getElementById('expenseChart').getContext('2d');
        const expenses = DB.get('expenses');
        
        // Aggregate data
        const categories = {};
        expenses.forEach(e => {
            categories[e.category] = (categories[e.category] || 0) + e.amount;
        });

        if (window.expenseChartInst) window.expenseChartInst.destroy();
        
        window.expenseChartInst = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(categories),
                datasets: [{
                    data: Object.values(categories),
                    backgroundColor: ['#28A745', '#007BFF', '#FFC107', '#DC3545']
                }]
            },
            options: { responsive: true, animation: { animateScale: true } }
        });
    }
};