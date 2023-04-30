function init() {
    let companies = ['Orkan', 'Olís', 'ÓB', 'Atlantsolía', 'N1' ]
    let start = 0;
    let markers = []; 

    const chooseCompany = document.getElementById("choose-company")
    const companiesCarousel = document.getElementById("companies-carousel")
   
    const currentCompany = document.getElementById("current-company")
    const arrowLeft = document.getElementById("prev-com");
    const arrowRight = document.getElementById("next-com");

    async function fetchData() {
        const response = await fetch('https://apis.is/petrol');
        const data = await response.json();
        initMap(data);
     
        chooseCompany.addEventListener("click", function(){
            companiesCarousel.classList.toggle("hidden");
            companiesCarousel.classList.toggle("carousel-cont");
    
            if (chooseCompany.textContent === "Veldu olíufélag") {
                chooseCompany.textContent = "Sýna öll olíufélög";
                clearMarkers()
                addMarkersByCompany(companies[0], data)

            } else if (chooseCompany.textContent === "Sýna öll olíufélög"){
                chooseCompany.textContent = "Veldu olíufélag";
                //carefull here
                clearMarkers()
                initMap(data)
            }
        })

        arrowLeft.addEventListener("click", function(){
            let selectedCompany = "";
            if (start >= 1){
                selectedCompany = companies[start-1]
                currentCompany.innerText = selectedCompany
                start = start - 1
            }
            else if (start == 0){
                start = companies.length-1
                selectedCompany = companies[start]
                currentCompany.innerText = selectedCompany
            }
            clearMarkers()
            addMarkersByCompany(selectedCompany, data)
        })
    
        arrowRight.addEventListener("click", function(){
            let selectedCompany = "";
            if (start <= companies.length - 2) {
                start = start + 1;
                selectedCompany = companies[start];
                currentCompany.innerText = selectedCompany;
            } else if (start == companies.length - 1) {
                start = 0;
                selectedCompany = companies[start];
                currentCompany.innerText = selectedCompany;
              }
            clearMarkers()
            addMarkersByCompany(selectedCompany, data)
        })
    
      }

    function clearMarkers() {
        for (let i = 0; i < markers.length; i++) {
          markers[i].setMap(null);
        }
        markers = [];
      }

      function addMarkersByCompany(companyName, data) {
        // Loop through the gas stations data and add markers only for the matching company
        data.results.forEach(gasStation => {
          if (gasStation.company === companyName) {
            const marker = addMarker(
              gasStation.geo.lat,
              gasStation.geo.lon,
              gasStation.name,
              `${gasStation.company} ${gasStation.name}<br>Bensín ${gasStation.bensin95}<br>Dísel ${gasStation.diesel}`,
              getCompanyName(gasStation.company)
            );
          }
        });
      }
    
    /*

    function getCompanyName(name){
        const parts = name.split(" "); // Split the string on the space
        const firstPart = parts[0]; // Get the first element of the array
        let img =  "markers/" + firstPart.toLowerCase() + ".png"
        img.style.height = "70px";
        return img
    }*/


    function getCompanyName(name) {
        const parts = name.split(" "); // Split the string on the space
        const firstPart = parts[0]; // Get the first element of the array
        const imgSrc = "markers/" + firstPart.toLowerCase() + ".png";
        const icon = {
          url: imgSrc,
          scaledSize: new google.maps.Size(40, 36), // Set the desired dimensions
        };
        return icon;
      }
      



      
    let mapInstance;
    let currentInfoWindow;

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
          `${gasStation.company} ${gasStation.name}<br><span style="color: #1C2E35;">Bensín </span> ${gasStation.bensin95}<br>Dísel ${gasStation.diesel}`,
          getCompanyName(gasStation.company)
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
            userMarker.setIcon("markers/pin.png");
  
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

        markers.push(marker);  //
        return marker;
      }
    fetchData();
  }
  
  window.initMap = init;
      
  