const mapDiv = document.getElementById('map');
const initialLat = parseFloat(mapDiv.dataset.lat) || 28.6139; 
const initialLon = parseFloat(mapDiv.dataset.lon) || 77.2088;
const titleName = mapDiv.dataset.title; 


// Initialize map
const map = L.map('map').setView([initialLat, initialLon], 9);

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
  subdomains: 'abcd',
  maxZoom: 19
}).addTo(map);


const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Add marker at listing location
let marker = L.marker([initialLat, initialLon], {icon: redIcon}).addTo(map)
  .bindPopup(`<h4>${titleName}</h4><p>Exact Locaion will be provided after booking</p>`)
  .openPopup();

// Nominatim search
async function nominatimSearch(query) {
  const params = new URLSearchParams({
    q: query,
    format: 'json',
    limit: 1,
    email: 'smile@gmail.com'
  });
  const url = 'https://nominatim.openstreetmap.org/search?' + params;
  const res = await fetch(url);
  return await res.json();
}



  map.setView([lat, lon], 15);
  if(marker) marker.setLatLng([lat, lon])
        .bindPopup(`<b>${r.display_name}</b>`)
        .openPopup();
  else marker = L.marker([lat, lon]).addTo(map)
        .bindPopup(`<b>${r.display_name}</b>`)
        .openPopup();


