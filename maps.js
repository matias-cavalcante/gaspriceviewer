function init() {
    let mapInstance;
  
    async function fetchData() {
        const response = await fetch('https://apis.is/petrol');
        const data = await response.json();
        return data;
      }      
  
    async function initMap() {
        const data = await fetchData();
      
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
          setTimeout(() => {
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
          }, 1000);
        } else {
          console.error("Geolocation is not supported by this browser.");
        }
      }
      
    function addMarker(lat, lng, title, content) {
      const marker = new google.maps.Marker({
        position: { lat, lng },
        map: mapInstance,
        title: title,
      });
  
      const infoWindow = new google.maps.InfoWindow({
        content: content,
      });
  
      marker.addListener('mouseover', () => {
        infoWindow.open(mapInstance, marker);
      });
  
      marker.addListener('mouseout', () => {
        infoWindow.close();
      });
  
      return marker;
    }
  
    fetchData();
  }
  
  window.initMap = init;
  