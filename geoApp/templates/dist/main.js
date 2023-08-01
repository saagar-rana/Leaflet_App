//Add map
var map = L.map("map", {
  zoomControl: false,
  measureControl: true,
}).setView([28.3949, 84.124], 7);

var osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
}).addTo(map);

var Stadia_AlidadeSmoothDark = L.tileLayer(
  "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
  {
    maxZoom: 20,
  }
);

var Stamen_Watercolor = L.tileLayer(
  "https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}",
  {
    subdomains: "abcd",
    minZoom: 1,
    maxZoom: 16,
    ext: "jpg",
  }
);

// Add marker
// map.on("click", function (e) {
//   L.marker([e.latlng.lat, e.latlng.lng])
//     .addTo(map)
//     .bindPopup("latitude " + e.latlng.lat.toString())
//     .openPopup();
// });

var single = L.marker([28.3949, 84.124], {
  opacity: 0.5,
  draggable: true,
})
  .addTo(map)
  .bindPopup("Hello dear")
  .openPopup();

// Add scale
L.control.scale().addTo(map);

//Manage Attribution
L.control
  .attribution()
  .setPrefix((prefix = "adsf"))
  .addTo(map);

map.on("mousemove", function (e) {
  document.getElementById("coordinate").innerHTML =
    "Lat: " + `${e.latlng.lat}` + " Lng: " + `${e.latlng.lng}`;
});

// GeoJson
var marker = L.markerClusterGroup();
var geo = L.geoJSON(data);
geo.addTo(marker);
marker.addTo(map);

//layer control
var baseLayers = {
  One: osm,
  Two: Stadia_AlidadeSmoothDark,
  Three: Stamen_Watercolor,
};

var overlays = {
  Marker: geo,
  Single: single,
};

L.control.layers(baseLayers, overlays, { position: "topleft" }).addTo(map);


//Zoom map
var mapId = document.getElementById("map");
function fullScreenView() {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    mapId.requestFullscreen();
  }
}
