/*MENU BUTTONS RESPONSIVE HERE */
const burger = document.querySelector(".hamburger");
const revelnav = document.querySelector(".navbar-list");
const listItems = revelnav.querySelectorAll("li");
const navButtons = document.querySelectorAll(".nav-button");
const body = document.querySelector("body");

let burgerState = false;

navButtons.forEach((button) => {
  button.addEventListener('click', () => {
    revelnav.classList.remove('burger-style');
    body.classList.remove('no-scroll');
    burgerState = false;
  });
});

burger.addEventListener("click", () => {
  burgerState = !burgerState;
  revelnav.classList.toggle('burger-style');
  body.classList.toggle('no-scroll');

  navButtons.forEach((button, index) => {
    button.classList.toggle("white-text", burgerState);
    listItems[index].classList.toggle("menu-displayed", burgerState);
  });
});


window.addEventListener("resize", () => {
  const burgerDisplay = getComputedStyle(burger).getPropertyValue("display");

  if (burgerDisplay === "none") {
    navButtons.forEach((button) => {
      button.classList.remove("white-text");
    });

    listItems.forEach((listItem) => {
      listItem.classList.remove("menu-displayed");
    });

    revelnav.classList.remove('burger-style');
    body.classList.remove('no-scroll');
    burgerState = false;
  }
});

const callToActionButton = document.querySelector('.call-to-action');
const secondSection = document.querySelector('#main-container');

callToActionButton.addEventListener('click', () => {
  secondSection.scrollIntoView({ behavior: 'smooth' });
});

const headerDiv = document.querySelector("#table-header");
const priceH3 = headerDiv.querySelectorAll("h3")[2];


const divTableContainer = document.getElementById("table-container");
const table = document.createElement("table");
table.classList.add('table-style')

let regionToShow = ""

function displayFuelType(region, fuelname){
  clearTable(table)
  if (window.innerWidth < 650){
    buttns.style.display = "none";
  }
  stationsPerRegion(region, stationsBuild, fuelname)
  regionToShow = region
}

const bensinButton = document.getElementById("ben")
const diselButton = document.getElementById("dis")

bensinButton.addEventListener("click", function () {
  displayFuelType(currentRegion.textContent, "bensin");
  fuel = "bensin";
  priceH3.textContent = "Bensin verð";
});

diselButton.addEventListener("click", function () {
  displayFuelType(currentRegion.textContent, "disel");
  fuel = "disel";
  priceH3.textContent = "Disel verð";
});

let urlTemplate = 'https://gas-prices-iceland.onrender.com/'
const n1Url = urlTemplate + "n1";
const olisUrl = urlTemplate + "olis";
const atloliaUrl = urlTemplate + "atlanso";
const obUrl = urlTemplate + "ob";
const orkanUrl = urlTemplate + "orkan";

const stationsBuild = [
  { code: 'ob', url: obUrl, img: 'logos/ob.png', time: 600000 },
  { code: 'olis',url: olisUrl, img: 'logos/olis.png', time: 600150 },
  { code: 'orkan', url: orkanUrl, img: 'logos/orkan.png', time: 600200 },
  { code: 'n1', url: n1Url, img: 'logos/n1.png', time: 600300 },
  { code: 'atl',url: atloliaUrl, img: 'logos/atlantsolia.png', time: 600500 }  ];

function paintAndreset(resetthis, painthis){
  for (let bt = 0; bt < resetthis.length; bt++){
    resetthis[bt].style.backgroundColor = "unset"
  }
  painthis.style.backgroundColor = "#00425A"
}

/*new code*/
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const currentRegion = document.getElementById("current-region");
const regionItems = Array.from(document.querySelectorAll(".carousel-item"));

let currentRegionIndex = 0;

prevButton.addEventListener("click", function () {
  currentRegionIndex--;
  if (currentRegionIndex < 0) {
    currentRegionIndex = regionItems.length - 1;
  }
  currentRegion.textContent = regionItems[currentRegionIndex].textContent;
  clearTable(table);
  stationsPerRegion(currentRegion.textContent, stationsBuild, fuel);
});

nextButton.addEventListener("click", function () {
  currentRegionIndex++;
  if (currentRegionIndex >= regionItems.length) {
    currentRegionIndex = 0;
  }
  currentRegion.textContent = regionItems[currentRegionIndex].textContent;
  clearTable(table);
  stationsPerRegion(currentRegion.textContent, stationsBuild, fuel);
});

/*new code*/

function updatePrices(url) {
  return fetch(url)
    .then(response => response.json())
    .catch(error => {
      console.error('Error fetching prices:', error);
    });
}

//The three functions below are to handle the table element and it´s content

function fillRow(imageurl, name, price, row){
  const logo = document.createElement("img");
  logo.src = imageurl;
  logo.classList.add("logo-style")

  const logocell = document.createElement("th");   
  logocell.appendChild(logo)

  const namecell = document.createElement("th");
  namecell.classList.add("table-cell-style")

  if (name.length >= 15 && (name.includes(',') || name.includes(' '))) {
    const regex = /,| /;
    const parts = name.split(regex, 2);
    const firstPart = parts[0] + " ";
    const secondPart = parts[1];
    namecell.appendChild(document.createTextNode(firstPart))
    namecell.appendChild(document.createTextNode(secondPart))
  }else{
    namecell.appendChild(document.createTextNode(name))
  }
  
  const pricecell = document.createElement("th");
  pricecell.style.fontSize = "1.3em"
   pricecell.style.color = "#1C2E35";
  pricecell.appendChild(document.createTextNode(price))
  row.appendChild(logocell);
  row.appendChild(namecell);
  row.appendChild(pricecell);
}


function newRows(filtered, imglink, gasprice, type) {
  return filtered.map(station => {
    let stationUpperFirst = station[0].toUpperCase() + station.slice(1);
    const pricesRow = document.createElement('tr');
    fillRow(imglink, stationUpperFirst, gasprice[station][type], pricesRow);
    pricesRow.classList.add('table-row-style');
    return pricesRow;
  }).sort((a, b) => parseFloat(a.lastElementChild.textContent) - parseFloat(b.lastElementChild.textContent));
}

function clearTable(tableElement) {
  const rows = Array.from(tableElement.querySelectorAll('tr'));
  rows.forEach(row => row.remove());
}

function displayPrices(tableElement, imgurl, link, newrows, area, gas) {
  updatePrices(link)
    .then(data => {
      const filteredStations = Object.keys(data)
        .filter(station => data[station].region === area);
      // Get rows in the table + make more rows from API all & sort them
      const rows = Array.from(tableElement.querySelectorAll('tr'));
      const moreRows = newrows(filteredStations, imgurl, data, gas);
      rows.sort((a, b) => parseFloat(a.lastElementChild.textContent) - parseFloat(b.lastElementChild.textContent));
      let mergedRows = [...rows, ...moreRows].sort((a, b) => parseFloat(a.lastElementChild.textContent) - parseFloat(b.lastElementChild.textContent));

      mergedRows.forEach(row => tableElement.appendChild(row));
      divTableContainer.appendChild(tableElement);
    })
}

function stationsPerRegion(region, stations, oil){
  for (let st = 0; st < stations.length; st++){
    updatePrices(stations[st]['url']);
    setInterval(() => updatePrices(stations[st]['url']), stations[st]['time']);
    setInterval(displayPrices(table, stations[st]['img'], stations[st]['url'], newRows, region, oil),
    stations[st]['time'])
  }
}


stationsPerRegion(currentRegion.textContent, stationsBuild, "bensin");
fuel = "bensin";





