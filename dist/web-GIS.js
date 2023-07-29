

//Leaflet browser print function
L.control.browserPrint({ position: 'topright' }).addTo(map);

//Leaflet search
L.Control.geocoder().addTo(map);

//Measure
L.control.measure().addTo(map);

// Zoom to layer
$('.zoom-layer').click(function(){
    map.setView([28.3949, 84.124],7)
  })

//Full screen map view
var mapId = document.getElementById('map');
function fullScreenView() {
    if (document.fullscreenElement) {
        document.exitFullscreen()
    } else {
        mapId.requestFullscreen();
    }
}