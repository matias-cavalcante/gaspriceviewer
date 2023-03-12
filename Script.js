import { displayPrices } from './tableFunctions.js';

const divTableContainer = document.getElementById("table-container");
const table = document.createElement("table");
table.classList.add('table-style')

const updateTimeBox = document.getElementById("time-since-updated")

const orkanUrl = 'https://gas-prices-iceland.onrender.com/orkan';

function updatePrices(url) {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      localStorage.setItem('prices', JSON.stringify(data));
      localStorage.setItem('lastUpdateTime', Date.now().toString());
    })
    .catch(error => {
      console.error('Error fetching prices:', error);
    });
}

function updateLastUpdateTime(updatebox) {
  const lastUpdateTime = localStorage.getItem('lastUpdateTime');
  if (lastUpdateTime) {
    const timeDiffMs = Date.now() - new Date(parseInt(lastUpdateTime));
    const timeDiffMin = Math.floor(timeDiffMs / (1000 * 60));
    updatebox.textContent = `Last update was ${timeDiffMin} minutes ago`;
  } else {
    updatebox.textContent = 'N/A';
  }
}

//The three functions below are to handle the table element and it´s content

  
//Fetches data calling API's
updatePrices(orkanUrl);
setInterval(updatePrices(orkanUrl), 1800000);

//Loads the new data shows it instead of the older one
displayPrices(table);
setInterval(displayPrices(table), 30000)

//Keeps track of when last update took place
updateLastUpdateTime(updateTimeBox);
setInterval(updateLastUpdateTime(updateTimeBox), 60000)

