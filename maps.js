function init() {
    let companies = ['Orkan', 'Olis', 'Ob', 'Atlantsolia', 'N1' ]
    let start = 0;
    let markers = []; 



    const currentCompany = document.getElementById("current-company")
    const arrowLeft = document.getElementById("prev-com");
    const arrowRight = document.getElementById("next-com");

    function clearMarkers() {
        for (let i = 0; i < markers.length; i++) {
          markers[i].setMap(null);
        }
        markers = [];
      }
      
    arrowLeft.addEventListener("click", function(){
        if (start >= 1){
            currentCompany.innerText = companies[start-1]
            start = start - 1
        }
        else if (start == 0){
            start = companies.length-1
            currentCompany.innerText = companies[start]
        }

        clearMarkers()
    })

    arrowRight.addEventListener("click", function(){
        if (start <= companies.length-2){
            start = start + 1
            currentCompany.innerText = companies[start]
        }
        else if (start == companies.length-1){
            start = companies.length - start
            currentCompany.innerText = companies[start]
        }
        clearMarkers()
    })






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


        //NEW CODE - NEW CODE - NEW CODE -
        //NEW CODE - NEW CODE - NEW CODE -
        markers.push(marker);  //
        return marker;
      }
    fetchData();
  }
  
  window.initMap = init;
      
  