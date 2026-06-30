async function loadBeaches() {
  const res = await fetch('beaches.json');
  if (!res.ok) throw new Error('Failed to load beaches.json');
  return res.json();
}

function indexForDate(dateStr, count) {
  // simple deterministic hash for given date string
  let h = 2166136261 >>> 0;
  for (let i = 0; i < dateStr.length; i++) {
    h ^= dateStr.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h % count;
}

function formatCoords(lat, lng) {
  return `${lat.toFixed(6)}N, ${lng.toFixed(6)}E`;
}

document.addEventListener('DOMContentLoaded', async () => {
  const nameEl = document.getElementById('beach-name');
  const coordsEl = document.getElementById('coords');
  const copyBtn = document.getElementById('copy-btn');
  const todayEl = document.getElementById('today');

  const today = new Date();
  const iso = today.toISOString().slice(0,10); // YYYY-MM-DD
  todayEl.textContent = today.toLocaleDateString('de');

  let beaches = [];
  try { beaches = await loadBeaches(); } catch (e) { nameEl.textContent = 'Unable to load beaches'; return; }
  if (!beaches.length) { nameEl.textContent = 'No beaches defined'; return; }

  const idx = indexForDate(iso, beaches.length);
  const beach = beaches[idx];

  nameEl.textContent = beach.name;
  coordsEl.textContent = formatCoords(beach.lat, beach.lng);

  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(`${beach.lat}, ${beach.lng}`);
      copyBtn.textContent = 'Copied! Have fun!';
      setTimeout(()=>copyBtn.textContent='Copy coordinates', 1500);
    } catch (err) {
      console.error(err);
      copyBtn.textContent = 'Copy failed';
      setTimeout(()=>copyBtn.textContent='Copy coordinates', 1500);
    }
  });

  // init Leaflet map
  const map = L.map('map', {attributionControl:false}).setView([beach.lat, beach.lng], 15);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  const marker = L.marker([beach.lat, beach.lng]).addTo(map);
  marker.bindPopup(`<strong>${beach.name}</strong><br/>${formatCoords(beach.lat, beach.lng)}`).openPopup();
});
