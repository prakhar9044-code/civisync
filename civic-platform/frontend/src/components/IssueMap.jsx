import { useEffect, useRef } from 'react';
import { CATEGORY_META, STATUS_META } from '../lib/utils';

let L;
// Leaflet must be imported dynamically to avoid SSR issues

export default function IssueMap({ reports = [], height = '400px', interactive = true }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (mapInstanceRef.current) return;
    // Leaflet is global from CDN or npm
    import('leaflet').then(leaflet => {
      L = leaflet.default;

      const map = L.map(mapRef.current, {
        center: [28.6139, 77.2090],
        zoom: 11,
        zoomControl: true,
        scrollWheelZoom: interactive,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !reports.length) return;
    const map = mapInstanceRef.current;

    // Remove old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    reports.forEach(r => {
      if (!r.location?.lat || !r.location?.lng) return;
      const cat = CATEGORY_META[r.category] || CATEGORY_META.other;
      const status = STATUS_META[r.status] || STATUS_META.pending;

      const icon = window.L?.divIcon({
        className: '',
        html: `<div style="
          background:${status.color};
          width:32px;height:32px;
          border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          display:flex;align-items:center;justify-content:center;
          border:2px solid white;
          box-shadow:0 2px 8px rgba(0,0,0,0.3);
          font-size:14px;
        "><span style="transform:rotate(45deg)">${cat.icon}</span></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -36],
      });

      if (!window.L) return;
      const marker = window.L.marker([r.location.lat, r.location.lng], icon ? { icon } : {})
        .addTo(map)
        .bindPopup(`
          <div style="font-family:'Plus Jakarta Sans',sans-serif;min-width:180px">
            <p style="font-weight:700;font-size:13px;margin-bottom:4px">${r.title || 'Issue'}</p>
            <p style="color:#64748b;font-size:11px;margin-bottom:6px">${r.reportId || ''}</p>
            <div style="display:flex;gap:6px;flex-wrap:wrap">
              <span style="background:${status.color}20;color:${status.color};padding:2px 8px;border-radius:99px;font-size:11px;font-weight:600">${status.label}</span>
              <span style="background:#e2e8f0;color:#475569;padding:2px 8px;border-radius:99px;font-size:11px">${cat.label}</span>
            </div>
            <p style="color:#94a3b8;font-size:11px;margin-top:6px">📍 ${r.location.address || ''}</p>
          </div>
        `);

      markersRef.current.push(marker);
    });

    // Fit bounds to all markers
    if (markersRef.current.length > 0) {
      try {
        const group = window.L.featureGroup(markersRef.current);
        map.fitBounds(group.getBounds().pad(0.2));
      } catch (_) {}
    }
  }, [reports]);

  // Hack: expose L globally after import
  useEffect(() => {
    import('leaflet').then(l => { window.L = l.default; });
  }, []);

  return (
    <div ref={mapRef} style={{ height, width: '100%', borderRadius: '1rem', overflow: 'hidden' }}
      className="border border-slate-200 dark:border-white/10" />
  );
}
