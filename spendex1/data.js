const DB = {
    init() {
        if (!localStorage.getItem('spendex_data')) {
            const mockData = {
                expenses: [
                    { id: 1, date: '2026-02-10', amount: 1500, category: 'Software', desc: 'Cloud Hosting' },
                    { id: 2, date: '2026-02-11', amount: 450, category: 'Utilities', desc: 'Internet' }
                ],
                employees: [],
                budget: { limits: { Software: 2000, Utilities: 500 } }
            };
            localStorage.setItem('spendex_data', JSON.stringify(mockData));
        }
    },
    get(table) {
        const data = JSON.parse(localStorage.getItem('spendex_data'));
        return table ? data[table] : data;
    },
    save(table, records) {
        const data = this.get();
        data[table] = records;
        localStorage.setItem('spendex_data', JSON.stringify(data));
        window.dispatchEvent(new Event('dataChanged')); // Event-driven update trigger
    }
};

DB.init();