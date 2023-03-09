/*const box = document.getElementById("results");

// Define the API endpoint URL
const apiUrl = 'https://gas-prices-iceland.onrender.com/orkan';


let count = 0;
setInterval(function(){
    const now = new Date();
    const hour = now.getHours();
    const min = now.getMinutes();
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
          box.append(data['baula'].region, " ", hour, ":", min)
      })
      if (count == 4){
        box.innerHTML = "";
        count = 0
      }
      count++;
    }, 5000)
*/

const apiUrl = 'https://gas-prices-iceland.onrender.com/orkan';

// Define a function to fetch the latest prices from the API and update the prices in local storage
function updatePrices() {
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      localStorage.setItem('prices', JSON.stringify(data));
    })
    .catch(error => {
      console.error('Error fetching prices:', error);
    });
}

// Call the updatePrices function initially to populate local storage with the latest prices
updatePrices();

// Update the prices in local storage every 5 minutes
setInterval(updatePrices, 10 * 60 * 1000);

// Define a function to display the prices from local storage
function displayPrices() {
    const pricesElement = document.getElementById('results');
    pricesElement.innerHTML = '';
  
    const prices = JSON.parse(localStorage.getItem('prices') || '{}');

  
    const now = new Date();
    const hour = now.getHours();
    const min = now.getMinutes();
    
    let count = 0;
  
    Object.keys(prices).forEach(station => {

        if (count == 10){
            return "";
        } 
      const stationPrices = prices[station];
      const stationElement = document.createElement('div');
      let stationUpperFirst = station[0].toUpperCase();
      let stationUpdated = stationUpperFirst + station.slice(1, -1)
      stationElement.innerText = `${stationUpdated}: ${stationPrices.region} ${stationPrices.bensin} ${stationPrices.disel} ${" - "}${hour}:${min}`;
      const littleBox = document.createElement('div');
      littleBox.classList.add('station-box')
      littleBox.appendChild(stationElement)
      pricesElement.appendChild(littleBox);

   
    count++;
      
    });
}
  

// Call the displayPrices function initially to display the prices from local storage
displayPrices();

// Add an event listener to update the prices on the page when the window is focused
window.addEventListener('focus', displayPrices);

