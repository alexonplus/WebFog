// Initialize map centered on Gothenburg
const map = L.map('map').setView([57.7089, 11.9746], 13);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
}).addTo(map);

// Fog layer
const fogLayer = L.layerGroup().addTo(map);
const fogOpacity = 0.6;

// Load previously visited locations from localStorage
let visited = JSON.parse(localStorage.getItem('visited')) || [];

// Draw fog tiles (rectangles)
function drawFog() {
    fogLayer.clearLayers();
    const bounds = map.getBounds();
    const nw = bounds.getNorthWest();
    const se = bounds.getSouthEast();
    const rect = L.rectangle([nw, se], { color: 'black', weight: 0, fillOpacity: fogOpacity });
    fogLayer.addLayer(rect);

    // Remove fog for visited locations
    visited.forEach(pos => {
        const circle = L.circle([pos.lat, pos.lng], { radius: pos.radius });
        fogLayer.eachLayer(layer => {
            if (layer.getBounds && circle.getBounds().intersects(layer.getBounds())) {
                fogLayer.removeLayer(layer);
            }
        });
    });
}

// Initial fog
drawFog();

// Watch user's position
if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            const radiusMeters = 50; // radius of visible area

            // Save this location to visited if not already
            visited.push({ lat, lng, radius: radiusMeters });
            localStorage.setItem('visited', JSON.stringify(visited));

            // Remove fog around current position
            drawFog();

            // Add or update user's circle
            if (!window.positionCircle) {
                window.positionCircle = L.circle([lat, lng], {
                    radius: radiusMeters,
                    color: 'blue',
                    fillColor: '#30f',
                    fillOpacity: 0.3
                }).addTo(map);
            } else {
                window.positionCircle.setLatLng([lat, lng]);
            }
            window.positionCircle.bringToFront();

            // Center map on user
            map.setView([lat, lng], map.getZoom());
        },
        (err) => { console.error('Geolocation error:', err); },
        { enableHighAccuracy: true }
    );
} else {
    console.warn("Geolocation is not supported by this browser");
}
