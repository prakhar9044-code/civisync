const ExpenseView = {
    render() {
        return `
            <div class="card">
                <h2>Log Expense</h2>
                <div style="display: flex; gap: 10px; margin-top: 15px;">
                    <input type="text" id="exp-desc" placeholder="E.g., AWS Hosting" style="padding: 8px;">
                    <input type="number" id="exp-amount" placeholder="Amount" style="padding: 8px;">
                    <button id="btn-add-exp" style="padding: 8px 15px; background: var(--accent); color: #fff; border:none; cursor:pointer;">Add Expense</button>
                </div>
                <p id="ai-suggestion" style="color: var(--text-secondary); margin-top: 10px; font-size: 0.8rem;"></p>
                
                <h3 style="margin-top:30px;">Recent Expenses</h3>
                <ul id="exp-list" style="list-style: none; margin-top:15px;"></ul>
            </div>
        `;
    },
    init() {
        this.cacheDOM();
        this.bindEvents();
        this.renderList();
    },
    cacheDOM() {
        this.descInput = document.getElementById('exp-desc');
        this.amountInput = document.getElementById('exp-amount');
        this.addBtn = document.getElementById('btn-add-exp');
        this.list = document.getElementById('exp-list');
        this.suggestionBox = document.getElementById('ai-suggestion');
    },
    bindEvents() {
        // AI Categorization on typing (Debounced naturally by user typing speed, but for prod use a real debounce)
        this.descInput.addEventListener('input', (e) => {
            const val = e.target.value;
            if(val.length > 2) {
                const cat = AIEngine.categorizeExpense(val);
                this.suggestionBox.innerText = `🤖 AI Suggestion: ${cat}`;
            } else {
                this.suggestionBox.innerText = '';
            }
        });

        this.addBtn.addEventListener('click', () => this.addExpense());
    },
    addExpense() {
        const desc = this.descInput.value;
        const amount = parseFloat(this.amountInput.value);
        if (!desc || isNaN(amount)) return Swal.fire('Error', 'Invalid inputs', 'error');

        const category = AIEngine.categorizeExpense(desc);
        
        // AI Anomaly Check
        if (AIEngine.isAnomaly(amount, category)) {
            Swal.fire({
                title: 'Unusual Expense Detected!',
                text: `This amount ($${amount}) is significantly higher than your average for ${category}. Proceed?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, log it'
            }).then((result) => {
                if (result.isConfirmed) this.saveData(desc, amount, category);
            });
        } else {
            this.saveData(desc, amount, category);
        }
    },
    saveData(desc, amount, category) {
        const expenses = DB.get('expenses');
        expenses.push({ id: Date.now(), date: new Date().toISOString().split('T')[0], amount, category, desc });
        DB.save('expenses', expenses);
        
        Swal.fire('Success', 'Expense logged and auto-categorized via AI.', 'success');
        this.descInput.value = ''; this.amountInput.value = '';
        this.renderList();
    },
    renderList() {
        const expenses = DB.get('expenses').reverse(); // Newest first
        this.list.innerHTML = expenses.map(e => `
            <li style="padding: 10px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between;">
                <span><strong>${e.desc}</strong> <small>(${e.category})</small></span>
                <span class="text-accent">$${e.amount}</span>
            </li>
        `).join('');
    }
};