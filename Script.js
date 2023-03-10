const divTableContainer = document.getElementById("results");


const tableElement = document.createElement("table");
tableElement.classList.add('table-style')

const headerRow = document.createElement("tr");
headerRow.classList.add("table-row-style")

const updateTimeBox = document.getElementById("time-since-updated")

function fillRow(content, row){
    const cell = document.createElement("th");
    cell.textContent = content;
    cell.classList.add("t-cell-style")
    row.appendChild(cell);
}

fillRow('Station', headerRow )
fillRow('Region', headerRow )
fillRow('Petrol', headerRow )
fillRow('Diesel', headerRow )

tableElement.appendChild(headerRow);


function updateLastUpdateTime() {
    const updateTimeElement = updateTimeBox;
    const lastUpdateTime = localStorage.getItem('lastUpdateTime');
    if (lastUpdateTime) {
      const date = new Date(parseInt(lastUpdateTime));
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      const formattedTime = `${hours}:${minutes}:${seconds}`;
      updateTimeElement.textContent = `Last update was at ${formattedTime}`;
    } else {
      updateTimeElement.textContent = 'N/A';
    }
}
  
    

const apiUrl = 'https://gas-prices-iceland.onrender.com/orkan';

function clearTable(table) {
    if (table.childElementCount > 1) {
      const rows = table.querySelectorAll('tr:not(:first-child)');
      Array.from(rows).forEach(row => row.remove());
    }
  }
  


function updatePrices() {
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        localStorage.setItem('prices', JSON.stringify(data));
        localStorage.setItem('lastUpdateTime', Date.now().toString());
      })
      .catch(error => {
        console.error('Error fetching prices:', error);
      });
  }





updatePrices();

// Update the prices in local storage every 5 minutes
setInterval(updatePrices, 1800000);

// Define a function to display the prices from local storage
function displayPrices() {
    const prices = JSON.parse(localStorage.getItem('prices') || '{}'); 
    
    const filteredStations = Object.keys(prices)
    .filter(station => prices[station].region === 'Vesturland');

    clearTable(tableElement)

      filteredStations.forEach(station => {
        let stationUpperFirst = station[0].toUpperCase();
        let stationUpdated = stationUpperFirst + station.slice(1)

        const stationInfo = prices[station];
        const pricesRow = document.createElement("tr");

        fillRow(stationUpdated, pricesRow)
        fillRow(stationInfo.region, pricesRow)
        fillRow(stationInfo.bensin, pricesRow)
        fillRow(stationInfo.disel, pricesRow)
        pricesRow.classList.add("table-row-style")

        tableElement.appendChild(pricesRow)
    });
    divTableContainer.appendChild(tableElement)
}
  
displayPrices();
//Maybe change this to setInterval so you can see live changes, and not only with browser in and out
window.addEventListener('focus', displayPrices);

updateLastUpdateTime();
setInterval(updateLastUpdateTime, 60000)

