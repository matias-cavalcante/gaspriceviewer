let mapInstance;

function initMap() {
  mapInstance = new google.maps.Map(document.getElementById("map"), {
    mapId: "d6c7877e45ecfbc3",
    center: { lat: 64.9631, lng: -19.0208 },
    zoom: 2,
  });

  // Add the marker after the map has been initialized
  addMarker(64.14657013, -21.89452573);

  return mapInstance;
}

window.initMap = initMap;

function addMarker(lat, lng) {
  const marker = new google.maps.Marker({
    position: { lat, lng },
    map: mapInstance,
  });

  return marker;
}

window.addMarker = addMarker;
