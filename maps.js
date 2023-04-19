let mapInstance;

async function fetchData() {
  const response = await fetch('https://apis.is/petrol');
  const data = await response.json();
  initMap(data);
}

function initMap(data) {
    mapInstance = new google.maps.Map(document.getElementById("map"), {
      mapId: "d6c7877e45ecfbc3",
      center: { lat: 64.9631, lng: -19.0208 },
      zoom: 5,
    });
  
    // Loop through the gas station data and add markers for each location
    data.results.forEach(gasStation => {
      addMarker(gasStation.geo.lat, gasStation.geo.lon, gasStation.name, `Name: ${gasStation.name}<br>Bensin 95: ${gasStation.bensin95}<br>Diesel: ${gasStation.diesel}`);
    });
  
    // Request user location
    getUserLocation();
  
    return mapInstance;
  }



  function getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const userPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
  
          // Add a marker for the user's location
          const userMarker = addMarker(userPosition.lat, userPosition.lng, "Your Location", "You are here");
          userMarker.setIcon("http://maps.google.com/mapfiles/ms/icons/green-dot.png");
  
          // Center the map on the user's location
          mapInstance.setCenter(userPosition);
          mapInstance.setZoom(12);
        },
        error => {
          console.error("Error obtaining user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }

window.initMap = initMap;







function addMarker(lat, lng, title, content) {
  const marker = new google.maps.Marker({
    position: { lat, lng },
    map: mapInstance,
    title: title,
  });

  const infoWindow = new google.maps.InfoWindow({
    content: content,
  });

  // Show the InfoWindow when the user hovers over the marker
  marker.addListener('mouseover', () => {
    infoWindow.open(mapInstance, marker);
  });

  // Hide the InfoWindow when the user stops hovering over the marker
  marker.addListener('mouseout', () => {
    infoWindow.close();
  });

  return marker;
}

window.addMarker = addMarker;

// Fetch the data and initialize the map
fetchData();
