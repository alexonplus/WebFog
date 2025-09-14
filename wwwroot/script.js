// Initialize map centered on Gothenburg
const map = L.map('map').setView([57.7089, 11.9746], 13);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
}).addTo(map);

// Create a canvas overlay for the fog
const canvas = L.canvasLayer().addTo(map);
const fogRadius = 100; // radius of visible area in meters
let userPos = null;

// Draw fog function
function drawFog() {
    const ctx = canvas._ctx;
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas._canvas.width, canvas._canvas.height);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'; // dark fog
    ctx.fillRect(0, 0, canvas._canvas.width, canvas._canvas.height);

    if (userPos) {
        const point = map.latLngToContainerPoint(userPos);
        const radiusPx = map.latLngToContainerPoint(userPos).distanceTo(
            map.latLngToContainerPoint(
                map.containerPointToLatLng([point.x + fogRadius, point.y])
            )
        );

        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(point.x, point.y, radiusPx, 0, 2 * Math.PI);
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
    }
}

// Watch user's location
if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (pos) => {
            userPos = L.latLng(pos.coords.latitude, pos.coords.longitude);
            drawFog();
        },
        (err) => { console.error('Geolocation error:', err); },
        { enableHighAccuracy: true }
    );
} else {
    console.warn("Geolocation is not supported by this browser");
}

// Update fog on map move or zoom
map.on('move zoom', drawFog);
