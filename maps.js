function init() {
    let mapInstance;
    let currentInfoWindow;

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
        mapTypeControl: false,
      });
  
      data.results.forEach(gasStation => {
        addMarker(
          gasStation.geo.lat,
          gasStation.geo.lon,
          gasStation.name,
          `${gasStation.company} ${gasStation.name}<br>Bensin 95: ${gasStation.bensin95}<br>Diesel: ${gasStation.diesel}`,
          "logos/fuel-station.png"
        );
      });
            
      getUserLocation();
    }
  
    function getUserLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            const userPosition = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
  
            const userMarker = addMarker(userPosition.lat, userPosition.lng, "Your Location", "You are here");
            userMarker.setIcon("http://maps.google.com/mapfiles/ms/icons/green-dot.png");
  
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
  
      function addMarker(lat, lng, title, content, iconUrl) {
        const marker = new google.maps.Marker({
          position: { lat, lng },
          map: mapInstance,
          title: title,
          icon: iconUrl,
        });
      
        const infoWindow = new google.maps.InfoWindow({
          content: content,
        });
      
        // Open the InfoWindow when the user clicks the marker
        marker.addListener('click', () => {
          if (currentInfoWindow) {
            currentInfoWindow.close();
          }
          infoWindow.open(mapInstance, marker);
          currentInfoWindow = infoWindow;
        });
      
        return marker;
      }
    fetchData();
  }
  
  window.initMap = init;