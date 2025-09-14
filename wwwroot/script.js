// Создаем карту только один раз
const map = L.map('map').setView([57.7089, 11.9746], 13);

// Добавляем слой OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
}).addTo(map);

// Проверяем поддержку геолокации
if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;

            // Добавляем/обновляем кружок на карте
            if (!window.positionCircle) {
                window.positionCircle = L.circle([lat, lng], {
                    radius: 50,
                    color: 'blue',
                    fillColor: '#30f',
                    fillOpacity: 0.3
                }).addTo(map);
            } else {
                window.positionCircle.setLatLng([lat, lng]);
            }

            // Центрируем карту на текущей позиции
            map.setView([lat, lng], map.getZoom());
        },
        (err) => { console.error('Ошибка геолокации:', err); },
        { enableHighAccuracy: true }
    );
} else {
    console.warn("Геолокация не поддерживается");
}
