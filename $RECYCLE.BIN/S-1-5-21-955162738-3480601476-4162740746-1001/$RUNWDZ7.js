// AI-Like Rule Based Engine

const keywords = {
    critical: ['wire', 'fire', 'flood', 'accident', 'collapse', 'gas'],
    high: ['pothole', 'street light', 'leak', 'drainage'],
    water: ['leak', 'flood', 'drainage', 'pipe', 'sewer'],
    electricity: ['wire', 'light', 'dark', 'pole', 'spark'],
    roads: ['pothole', 'road', 'asphalt', 'sidewalk'],
    sanitation: ['garbage', 'trash', 'waste', 'smell', 'dump']
};

export function classifySeverity(text) {
    text = text.toLowerCase();
    if (keywords.critical.some(kw => text.includes(kw))) return 'Critical';
    if (keywords.high.some(kw => text.includes(kw))) return 'High';
    return 'Medium'; // Default
}

export function routeDepartment(text) {
    text = text.toLowerCase();
    if (keywords.water.some(kw => text.includes(kw))) return 'Water Board';
    if (keywords.electricity.some(kw => text.includes(kw))) return 'Electricity Dept';
    if (keywords.roads.some(kw => text.includes(kw))) return 'Public Works (Roads)';
    return 'Sanitation'; // Default
}

// Haversine formula to check 200m radius
export function isDuplicate(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth radius in meters
    const rad = Math.PI / 180;
    const dLat = (lat2 - lat1) * rad;
    const dLon = (lon2 - lon1) * rad;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * rad) * Math.cos(lat2 * rad) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance <= 200; // Returns true if within 200m
}