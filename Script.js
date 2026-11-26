import * as constants from './Components.js';
import { fillRow } from './rowFiller.js';

//NAVBAR AND BURGER MENU STARTS HERE
 let burgerState = false;

constants.navButtons.forEach((button) => {
  button.addEventListener('click', () => {
    constants.revelnav.classList.remove('burger-style');
    constants.body.classList.remove('no-scroll');
    burgerState = false;
  });
});

constants.burger.addEventListener("click", () => {
  burgerState = !burgerState;
  constants.revelnav.classList.toggle('burger-style');
  constants.body.classList.toggle('no-scroll');
  constants.navButtons.forEach((button, index) => {
  button.classList.toggle("white-text", burgerState);
  constants.listItems[index].classList.toggle("menu-displayed", burgerState);
  });
});

window.addEventListener("resize", () => {
  const burgerDisplay = getComputedStyle(constants.burger).getPropertyValue("display");

  if (burgerDisplay === "none") {
    constants.navButtons.forEach((button) => {
      button.classList.remove("white-text");
    });
    constants.listItems.forEach((listItem) => {
      listItem.classList.remove("menu-displayed");
    });
    constants.revelnav.classList.remove('burger-style');
    constants.body.classList.remove('no-scroll');
    burgerState = false;
  }
});
//NAVBAR AND BURGER MENU END HERE APPARENTLY

constants.callToActionButton.addEventListener('click', () => {
  constants.secondSection.scrollIntoView({ behavior: 'smooth' });
});

//TWO BUTTONS TO SEE EITHER PETROL OR DIESEL
constants.bensinButton.addEventListener("click", function () {
  fuel = "bensin"
  constants.priceH3.textContent = "Bensin verð";
  clearTable(constants.table)
  stationsPerRegion(constants.currentRegion.textContent, constants.stationsBuild, "bensin");
});
constants.diselButton.addEventListener("click", function () {
  fuel = "disel";
  constants.priceH3.textContent = "Disel verð";
  clearTable(constants.table)
  stationsPerRegion(constants.currentRegion.textContent, constants.stationsBuild, "disel");
});


let currentRegionIndex = 0;

function changeRegionIndex(increment) {
  currentRegionIndex += increment;
  if (currentRegionIndex < 0) {
    currentRegionIndex = constants.regionItems.length - 1;
  } else if (currentRegionIndex >= constants.regionItems.length) {
    currentRegionIndex = 0;
  }
}

function updateRegion(translateValue1, translateValue2) {
  constants.currentRegion.style.transform = translateValue1;
  setTimeout(() => {
    constants.currentRegion.textContent = constants.regionItems[currentRegionIndex].textContent;
    constants.currentRegion.style.transform = translateValue2;
  }, 100);

  setTimeout(() => {
    constants.currentRegion.style.transform = "translateX(0)";
    clearTable(constants.table);
    stationsPerRegion(constants.currentRegion.textContent, constants.stationsBuild, fuel);
  }, 200);
}

constants.prevButton.addEventListener("click", () => {
  changeRegionIndex(-1);
  updateRegion("translateX(20%)", "translateX(-20%)");
});

constants.nextButton.addEventListener("click", () => {
  changeRegionIndex(1);
  updateRegion("translateX(-20%)", "translateX(20%)");
});


constants.table.classList.add('table-style')

let completedRequests = 0;

function incrementCompletedRequests(totalRequests) {
  const spinnerContainer = document.querySelector('.spinner-container');
  const tableContainer = document.querySelector('#table-container');
  const tableHeader = document.querySelector('#table-header');

  // Show the spinner container and hide the table container when the first request is completed
  if (completedRequests === 0) {
    spinnerContainer.style.display = 'flex';
    tableHeader.style.display = 'none';
    tableContainer.style.display = 'none';
  }

  completedRequests++;
  console.log(`[DEBUG] Completed requests: ${completedRequests} / ${totalRequests}`);

  if (completedRequests === totalRequests) {
    // Hide the spinner container and show the table container when all requests are completed
    spinnerContainer.style.display = 'none';
    tableHeader.style.display = "flex"
    tableContainer.style.display = 'block';
    console.log("[DEBUG] All requests processed. Displaying table container.");
  }
}

function displayPrices(tableElement, imgurl, link, newrows, area, gas, totalRequests) {
  console.log(`[DEBUG] Fetching data from link: ${link}`);
  updatePrices(link)
    .then(data => {
      // Defensive check: ensure data is a valid object before parsing keys
      if (!data || typeof data !== 'object') {
        console.warn(`[DEBUG] Invalid or empty data received from ${link}. Skipping this source.`);
        incrementCompletedRequests(totalRequests);
        return;
      }

      console.log(`[DEBUG] Successfully received data for ${link}. Processing region: ${area}`);
      const filteredStations = Object.keys(data)
        .filter(station => data[station] && data[station].region === area);
      
      const rows = Array.from(tableElement.querySelectorAll('tr'));
      const moreRows = newrows(filteredStations, imgurl, data, gas);
      
      rows.sort((a, b) => parseFloat(a.lastElementChild.textContent) - parseFloat(b.lastElementChild.textContent));
      let mergedRows = [...rows, ...moreRows].sort((a, b) => parseFloat(a.lastElementChild.textContent) - parseFloat(b.lastElementChild.textContent));

      mergedRows.forEach(row => {
        if (row instanceof Node) {
          tableElement.appendChild(row);
        } else {
          console.error("[DEBUG] Invalid element:", row);
        }
      });
      constants.divTableContainer.appendChild(tableElement);
      incrementCompletedRequests(totalRequests);
    })
    .catch(err => {
      console.error(`[DEBUG] Error inside displayPrices chain for ${link}:`, err);
      incrementCompletedRequests(totalRequests); // Always release the lock so the UI doesn't freeze
    });
}

function stationsPerRegion(region, stations, oil){
  const spinnerContainer = document.querySelector('.spinner');
  const container = document.querySelector('#table-container');
  const tableHeader = document.querySelector('#table-header');
  completedRequests = 0; 
  spinnerContainer.style.display = 'block';
  tableHeader.style.display = 'none';
  container.style.display = 'none'; 

  console.log(`[DEBUG] Starting requests for ${stations.length} data sources in region: ${region}`);
  for (let st = 0; st < stations.length; st++){
    // Note: setInterval with fetch can hammer servers; keeping your structure but ensuring safe execution
    displayPrices(constants.table, stations[st]['img'], stations[st]['url'], newRows, region, oil, stations.length);
  }
}

function updatePrices(url) {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .catch(error => {
      console.error(`[DEBUG] Fetch failed for URL (${url}):`, error);
      return {}; // Return a safe empty object fallback so the promise chain doesn't break
    });
}


function newRows(filtered, imglink, gasprice, type) {
  return filtered.reduce((acc, station) => {
    if (!gasprice[station]) return acc;
    let stationUpperFirst = station[0].toUpperCase() + station.slice(1);
    const pricesRow = document.createElement('tr');
    if (gasprice[station][type] != 0 && gasprice[station][type] !== undefined) {
      fillRow(imglink, stationUpperFirst, gasprice[station][type], pricesRow);
      pricesRow.classList.add('table-row-style');
      acc.push(pricesRow); 
    }
    return acc;
  }, []).sort((a, b) => parseFloat(a.lastElementChild.textContent) - parseFloat(b.lastElementChild.textContent));
}

function clearTable(tableElement) {
  const rows = Array.from(tableElement.querySelectorAll('tr'));
  rows.forEach(row => row.remove());
}

stationsPerRegion(constants.currentRegion.textContent, constants.stationsBuild, "bensin");
let fuel = "bensin";
