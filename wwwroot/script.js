// Initialize map centered on Gothenburg
const map = L.map('map').setView([57.7089, 11.9746], 13);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
}).addTo(map);

// Create fog layer
const fogLayer = L.layerGroup().addTo(map);
const fogOpacity = 0.6;

// Fill the map with fog
function coverMapWithFog() {
    const bounds = map.getBounds();
    const rect = L.rectangle([bounds.getNorthWest(), bounds.getSouthEast()], {
        color: 'black',
        weight: 0,
        fillOpacity: fogOpacity
    });
    fogLayer.addLayer(rect);
}

// Clear fog around a circle
function clearFog(lat, lng, radiusMeters) {
    const circle = L.circle([lat, lng], { radius: radiusMeters });
    fogLayer.eachLayer(layer => {
        if (layer.getBounds && circle.getBounds().intersects(layer.getBounds())) {
            fogLayer.removeLayer(layer);
        }
    });
}

// Cover the map initially
coverMapWithFog();

// Watch user location
if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;

            // Clear fog around current position
            const radiusMeters = 100;
            clearFog(lat, lng, radiusMeters);

            // Add or update position circle
            if (!window.positionCircle) {
                window.positionCircle = L.circle([lat, lng], {
                    radius: 20, // circle size (visual marker)
                    color: 'blue',
                    fillColor: '#30f',
                    fillOpacity: 0.5
                }).addTo(map);
            } else {
                window.positionCircle.setLatLng([lat, lng]);
            }

            // Always keep circle on top of fog
            window.positionCircle.bringToFront();

            // Center map on current position (only first time)
            if (!window.mapCentered) {
                map.setView([lat, lng], 16);
                window.mapCentered = true;
            }
        },
        (err) => { console.error('Geolocation error:', err); },
        { enableHighAccuracy: true }
    );
} else {
    console.warn("Geolocation is not supported by this browser");
}
