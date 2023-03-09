const pricesElement = document.getElementById("results");
const tableElement = document.createElement("table");
tableElement.classList.add('table-style')
const headerRow = document.createElement("tr");

function fillRow(content, row){
    const cell = document.createElement("th");
    cell.textContent = content;
    row.appendChild(cell);
}

fillRow('Station', headerRow )
fillRow('Region', headerRow )
fillRow('Petrol', headerRow )
fillRow('Diesel', headerRow )

tableElement.appendChild(headerRow);

const apiUrl = 'https://gas-prices-iceland.onrender.com/orkan';

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
updatePrices();

// Update the prices in local storage every 5 minutes
setInterval(updatePrices, 10 * 60 * 1000);

// Define a function to display the prices from local storage

function displayPrices(tableContainer, table) {
    const prices = JSON.parse(localStorage.getItem('prices') || '{}'); 
    
    const filteredStations = Object.keys(prices)
    .filter(station => prices[station].region === 'Vesturland');

      filteredStations.forEach(station => {
        let stationUpperFirst = station[0].toUpperCase();
        let stationUpdated = stationUpperFirst + station.slice(1, -1)

        const stationInfo = prices[station];
        const pricesRow = document.createElement("tr");

        fillRow(stationUpdated, pricesRow)
        fillRow(stationInfo.region, pricesRow)
        fillRow(stationInfo.bensin, pricesRow)
        fillRow(stationInfo.disel, pricesRow)

        table.appendChild(pricesRow)
    });
    tableContainer.appendChild(table)
}
  
displayPrices(pricesElement,tableElement);
window.addEventListener('focus', displayPrices);

setInterval(displayPrices(pricesElement, tableElement), 300000);

