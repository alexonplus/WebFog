// Initialize map centered on Gothenburg
const map = L.map('map').setView([57.7089, 11.9746], 13);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
}).addTo(map);

// Create a fog layer
const fogLayer = L.layerGroup().addTo(map);
const fogOpacity = 0.6;

// Cover the whole map with fog initially
function generateFog() {
    const bounds = map.getBounds();
    const nw = bounds.getNorthWest();
    const se = bounds.getSouthEast();

    const rect = L.rectangle([nw, se], { color: 'black', weight: 0, fillOpacity: fogOpacity });
    fogLayer.addLayer(rect);
}
generateFog();

// Watch user's location
if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;

            // Clear previous fog around current position
            const radiusMeters = 100;
            const circle = L.circle([lat, lng], { radius: radiusMeters });

            fogLayer.eachLayer(layer => {
                if (layer.getBounds && circle.getBounds().intersects(layer.getBounds())) {
                    fogLayer.removeLayer(layer);
                }
            });

            // Add or update position circle
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

            // Center the map on current position
            map.setView([lat, lng], map.getZoom());
        },
        (err) => { console.error('Geolocation error:', err); },
        { enableHighAccuracy: true }
    );
} else {
    console.warn("Geolocation is not supported by this browser");
}
