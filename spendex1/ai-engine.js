const AIEngine = {
    // 1. Rule-Based / Regex Categorization
    categorizeExpense(description) {
        const desc = description.toLowerCase();
        const rules = {
            'Software': ['aws', 'cloud', 'github', 'saas', 'subscription'],
            'Payroll': ['salary', 'wage', 'bonus', 'contractor'],
            'Utilities': ['internet', 'electric', 'water', 'power'],
            'Travel': ['flight', 'uber', 'hotel', 'taxi']
        };

        for (const [category, keywords] of Object.entries(rules)) {
            if (keywords.some(kw => desc.includes(kw))) {
                return category;
            }
        }
        return 'Uncategorized'; // Requires user training
    },

    // 2. Anomaly Detection (Z-Score Mock)
    isAnomaly(amount, category) {
        const expenses = DB.get('expenses').filter(e => e.category === category);
        if (expenses.length < 3) return false;

        const amounts = expenses.map(e => e.amount);
        const mean = amounts.reduce((a, b) => a + b) / amounts.length;
        // Simple threshold: If more than 2x the average of that category, flag it.
        return amount > (mean * 2); 
    },

    // 3. Linear Regression for Predictions
    predictNextMonthExpense(category) {
        const expenses = DB.get('expenses').filter(e => e.category === category);
        if (expenses.length < 2) return null;

        // x = index (time), y = amount
        let n = expenses.length;
        let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

        expenses.forEach((exp, i) => {
            let x = i + 1;
            let y = exp.amount;
            sumX += x;
            sumY += y;
            sumXY += (x * y);
            sumX2 += (x * x);
        });

        // Linear Regression Formula
        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;
        
        // Predict next data point (n + 1)
        const prediction = slope * (n + 1) + intercept;
        return prediction > 0 ? prediction.toFixed(2) : 0;
    }
};