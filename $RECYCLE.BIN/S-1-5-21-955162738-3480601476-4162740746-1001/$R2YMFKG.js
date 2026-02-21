export const DB_NAME = 'GovTechDB';
export const DB_VERSION = 1;

export function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains('complaints')) {
                const store = db.createObjectStore('complaints', { keyPath: 'id' });
                store.createIndex('status', 'status', { unique: false });
                store.createIndex('department', 'department', { unique: false });
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject('Database error');
    });
}

export async function saveComplaint(data) {
    const db = await initDB();
    return new Promise((resolve) => {
        const tx = db.transaction('complaints', 'readwrite');
        tx.objectStore('complaints').put(data);
        tx.oncomplete = () => resolve(true);
    });
}

export async function getAllComplaints() {
    const db = await initDB();
    return new Promise((resolve) => {
        const tx = db.transaction('complaints', 'readonly');
        const request = tx.objectStore('complaints').getAll();
        request.onsuccess = () => resolve(request.result);
    });
}