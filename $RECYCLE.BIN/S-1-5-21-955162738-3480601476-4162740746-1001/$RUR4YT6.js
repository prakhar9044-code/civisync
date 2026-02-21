export async function updateComplaintStatus(id, newStatus) {
    const db = await initDB();
    return new Promise((resolve) => {
        const tx = db.transaction('complaints', 'readwrite');
        const store = tx.objectStore('complaints');
        const request = store.get(id);
        
        request.onsuccess = () => {
            const data = request.result;
            data.status = newStatus;
            store.put(data);
            resolve(true);
        };
    });
}