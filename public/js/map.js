const mapData = document.getElementById("map-data");

const latitude = Number(mapData.dataset.latitude);
const longitude = Number(mapData.dataset.longitude);
const listingLocation = mapData.dataset.location;

const map = L.map("map").setView([latitude, longitude], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

L.marker([latitude, longitude])
    .addTo(map)
    .bindPopup(listingLocation)
    .openPopup();