// Initialize map centered on Gothenburg
const map = L.map('map').setView([57.7089, 11.9746], 13);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
}).addTo(map);

// Create a "fog of war" layer using a dark semi-transparent overlay
const fogLayer = L.layerGroup().addTo(map);
const tileSize = 256; // Size of each fog tile in pixels
const fogOpacity = 0.6; // Opacity of the fog

// Function to add fog around the map
function generateFog(bounds) {
    const zoom = map.getZoom();
    const nw = map.project(bounds.getNorthWest(), zoom);
    const se = map.project(bounds.getSouthEast(), zoom);

    for (let x = Math.floor(nw.x / tileSize); x <= Math.floor(se.x / tileSize); x++) {
        for (let y = Math.floor(se.y / tileSize); y <= Math.floor(nw.y / tileSize); y++) {
            const tileBounds = L.bounds(
                L.point(x * tileSize, y * tileSize),
                L.point((x + 1) * tileSize, (y + 1) * tileSize)
            );
            const sw = map.unproject(tileBounds.getBottomLeft(), zoom);
            const ne = map.unproject(tileBounds.getTopRight(), zoom);
            const rect = L.rectangle([sw, ne], {
                color: 'black',
                weight: 0,
                fillOpacity: fogOpacity
            });
            fogLayer.addLayer(rect);
        }
    }
}

// Initially cover the map with fog
generateFog(map.getBounds());

// Watch user's location
if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;

            // Remove fog around current position
            const radiusMeters = 100; // radius of visible area
            const circle = L.circle([lat, lng], { radius: radiusMeters });

            fogLayer.eachLayer(layer => {
                if (layer.getBounds && circle.getBounds().intersects(layer.getBounds())) {
                    fogLayer.removeLayer(layer);
                }
            });

            // Add or move the position circle
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
