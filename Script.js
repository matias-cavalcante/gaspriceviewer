/*
//WEBPAGE REGIONS
const body = document.querySelector("body");
const secondSection = document.querySelector('#main-container');

//NAVBAR ELEMENTS
const burger = document.querySelector(".hamburger");
const revelnav = document.querySelector(".navbar-list");

//import revelnav
const listItems = revelnav.querySelectorAll("li");
const navButtons = document.querySelectorAll(".nav-button");

const callToActionButton = document.querySelector('.call-to-action');

//CHANGE FUEL TYPE DISPLAYED WITH THESE BUTTONS
const bensinButton = document.getElementById("ben")
const diselButton = document.getElementById("dis")

//TABLE (IN MIDDLE SECTION) COMPONENTS
const headerDiv = document.querySelector("#table-header");
const priceH3 = headerDiv.querySelectorAll("h3")[2];
const divTableContainer = document.getElementById("table-container");
const table = document.createElement("table");

//CAROUSEL BUTTONS SWITCH COMPONENTS
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const currentRegion = document.getElementById("current-region");
const regionItems = Array.from(document.querySelectorAll(".carousel-item"));

//FORMAT OF DATA REQUIRED FOR EACH GAS STATION
const stationsBuild = [
  { code: 'ob', url: 'https://gas-prices-iceland.onrender.com/ob', img: 'logos/ob.png', time: 600000 },
  { code: 'olis',url: 'https://gas-prices-iceland.onrender.com/olis', img: 'logos/olis.png', time: 600150 },
  { code: 'orkan', url: 'https://gas-prices-iceland.onrender.com/orkan', img: 'logos/orkan.png', time: 600200 },
  { code: 'n1', url:'https://gas-prices-iceland.onrender.com/n1' , img: 'logos/n1.png', time: 600300 },
  { code: 'atl',url: 'https://gas-prices-iceland.onrender.com/atlanso', img: 'logos/atlantsolia.png', time: 600500 }];
*/

import * as constants from './Components.js';


let burgerState = false;
//IMPORTED
constants.navButtons.forEach((button) => {
  button.addEventListener('click', () => {
    //IMPORTED
    constants.revelnav.classList.remove('burger-style');
    //CAREFULL
    constants.body.classList.remove('no-scroll');
    burgerState = false;
  });
});
//IMPORTED
constants.burger.addEventListener("click", () => {
  burgerState = !burgerState;
  //IMPORTED
  constants.revelnav.classList.toggle('burger-style');
  //CAREFULL
  constants.body.classList.toggle('no-scroll');
  //IMPORTED
  constants.navButtons.forEach((button, index) => {
    button.classList.toggle("white-text", burgerState);
    //IMPORTED
    constants.listItems[index].classList.toggle("menu-displayed", burgerState);
  });
});


window.addEventListener("resize", () => {
  //IMPORTED
  const burgerDisplay = getComputedStyle(constants.burger).getPropertyValue("display");

  if (burgerDisplay === "none") {
    //IMPORTED
    constants.navButtons.forEach((button) => {
      button.classList.remove("white-text");
    });
    //IMPORTED
    constants.listItems.forEach((listItem) => {
      listItem.classList.remove("menu-displayed");
    });
    //IMPORTED
    constants.revelnav.classList.remove('burger-style');
    //CAREFULL
    constants.body.classList.remove('no-scroll');
    burgerState = false;
  }
});



//IMPORTED
constants.callToActionButton.addEventListener('click', () => {
  //IMPORTED
  constants.secondSection.scrollIntoView({ behavior: 'smooth' });
});

//IMPORTED
constants.table.classList.add('table-style')

let regionToShow = ""
//IMPORTED
constants.bensinButton.addEventListener("click", function () {
  fuel = "bensin"
  //IMPORTED
  constants.priceH3.textContent = "Bensin verð";
  clearTable(constants.table)
  stationsPerRegion(constants.currentRegion.textContent, constants.stationsBuild, "bensin");
});
//IMPORTED
constants.diselButton.addEventListener("click", function () {
  fuel = "disel";
  //IMPORTED
  constants.priceH3.textContent = "Disel verð";
  clearTable(constants.table)
  stationsPerRegion(constants.currentRegion.textContent, constants.stationsBuild, "disel");
});

function paintAndreset(resetthis, painthis){
  for (let bt = 0; bt < resetthis.length; bt++){
    resetthis[bt].style.backgroundColor = "unset"
  }
  painthis.style.backgroundColor = "#00425A"
}



let currentRegionIndex = 0;
//import
constants.prevButton.addEventListener("click", function () {
  constants.currentRegionIndex--;
  if (currentRegionIndex < 0) {
    currentRegionIndex = constants.regionItems.length - 1;
  }

  constants.currentRegion.style.transform = "translateX(20%)";
  setTimeout(() => {
    constants.currentRegion.textContent = constants.regionItems[currentRegionIndex].textContent;
    constants.currentRegion.style.transform = "translateX(-20%)";
  }, 100);

  setTimeout(() => {
    constants.currentRegion.style.transform = "translateX(0)";
    //imported
    clearTable(constants.table);
    stationsPerRegion(constants.currentRegion.textContent, constants.stationsBuild, fuel);
  }, 200);
});

constants.nextButton.addEventListener("click", function () {
  currentRegionIndex++;
  if (currentRegionIndex >= constants.regionItems.length) {
    currentRegionIndex = 0;
  }

  constants.currentRegion.style.transform = "translateX(-20%)";
  setTimeout(() => {
    constants.currentRegion.textContent = constants.regionItems[currentRegionIndex].textContent;
    constants.currentRegion.style.transform = "translateX(20%)";
  }, 100);

  setTimeout(() => {
    constants.currentRegion.style.transform = "translateX(0)";
    clearTable(constants.table);//imported
    stationsPerRegion(constants.currentRegion.textContent, constants.stationsBuild, fuel);
  }, 200);
});

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

  if (completedRequests === totalRequests) {
    // Hide the spinner container and show the table container when all requests are completed
    spinnerContainer.style.display = 'none';
    tableHeader.style.display = "flex"
    tableContainer.style.display = 'block';
  }
}

function displayPrices(tableElement, imgurl, link, newrows, area, gas, totalRequests) {
  updatePrices(link)
    .then(data => {
      const filteredStations = Object.keys(data)
        .filter(station => data[station].region === area);
      const rows = Array.from(tableElement.querySelectorAll('tr'));
      const moreRows = newrows(filteredStations, imgurl, data, gas);
      rows.sort((a, b) => parseFloat(a.lastElementChild.textContent) - parseFloat(b.lastElementChild.textContent));
      let mergedRows = [...rows, ...moreRows].sort((a, b) => parseFloat(a.lastElementChild.textContent) - parseFloat(b.lastElementChild.textContent));

      mergedRows.forEach(row => {
        if (row instanceof Node) {
          tableElement.appendChild(row);
        } else {
          console.error("Invalid element:", row);
        }
      });
      //IMPORTED
      constants.divTableContainer.appendChild(tableElement);

      // Call incrementCompletedRequests() after updating the table and pass totalRequests
      incrementCompletedRequests(totalRequests);
    })
}


function stationsPerRegion(region, stations, oil){
  const spinnerContainer = document.querySelector('.spinner');
  const container = document.querySelector('#table-container');
  const tableHeader = document.querySelector('#table-header');
  completedRequests = 0; // 
  spinnerContainer.style.display = 'block';
  tableHeader.style.display = 'none';
  container.style.display = 'none'; 

  for (let st = 0; st < stations.length; st++){
    setInterval(() => updatePrices(stations[st]['url']), stations[st]['time']);
    setInterval(displayPrices(constants.table, stations[st]['img'], stations[st]['url'], newRows, region, oil, stations.length),
    stations[st]['time'])
  }
}

function updatePrices(url) {
  return fetch(url)
    .then(response => response.json())
    .catch(error => {
      console.error('Error fetching prices:', error);
    });
}

//They all go inside fillrow

function logoContentAndCell(url){
  const logo = document.createElement("img");
  logo.src = url;
  logo.classList.add("logo-style")

  const logoBox = document.createElement("th");   
  logoBox.appendChild(logo)
  return logoBox
}

function priceContentAndCell(value){
  const priceBox = document.createElement("th");
  priceBox.style.fontSize = "1.3em"
  priceBox.style.color = "#1C2E35";
  priceBox.appendChild(document.createTextNode(value))
  return priceBox
}

function nameContentAndCell(namevalue){
  const nameCell = document.createElement("th");
  nameCell.classList.add("table-cell-style")
  if (namevalue.length >= 15 && (namevalue.includes(',') || namevalue.includes(' '))) {
    const parts = namevalue.split(/,| /, 2);
    nameCell.appendChild(document.createTextNode(parts[0] + " "))
    nameCell.appendChild(document.createTextNode(parts[1]))
  }else{
    nameCell.appendChild(document.createTextNode(namevalue))
  }
  return nameCell
}

function fillRow(imageurl, name, price, row){
  let logoCell = logoContentAndCell(imageurl)
  const theNameCell = nameContentAndCell(name)
  const pricecell = priceContentAndCell(price)
  row.appendChild(logoCell);
  row.appendChild(theNameCell);
  row.appendChild(pricecell);
}

//It finished here

function newRows(filtered, imglink, gasprice, type) {
  return filtered.reduce((acc, station) => {
    let stationUpperFirst = station[0].toUpperCase() + station.slice(1);
    const pricesRow = document.createElement('tr');
    if (gasprice[station][type] != 0) {
      fillRow(imglink, stationUpperFirst, gasprice[station][type], pricesRow);
      pricesRow.classList.add('table-row-style');
      acc.push(pricesRow); // 
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





