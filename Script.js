const reveal = document.getElementById("choose")
const buttns = document.getElementById("regions")

const burger = document.getElementsByClassName("hamburger")[0];
const revelnav = document.getElementsByClassName("navbar-list")[0];
const listItems = revelnav.getElementsByTagName("li");
const navButtons = document.getElementsByClassName("nav-button");
const body = document.getElementsByTagName("body")[0];

burger.addEventListener("click", function() {
  revelnav.classList.toggle('burger-style');
  body.classList.toggle('no-scroll');

  for (let i = 0; i < navButtons.length; i++) {
    navButtons[i].classList.toggle("white-text");

    listItems[i].classList.toggle("menu-displayed")
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

bensinButton.addEventListener("click", function(){
  displayFuelType(regionToShow, 'bensin')
  fuel = 'bensin'
  priceH3.textContent = "Bensin verð"
})

diselButton.addEventListener("click", function(){
  displayFuelType(regionToShow, 'disel')
  fuel = 'disel'
  priceH3.textContent = "Disel verð"
})



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

let revealState = false;

reveal.addEventListener("click", function(){
  if (revealState == false){
    /*buttns.style.height = "55%"*/
    /*buttns.style.position = "absolute";*/
    buttns.style.display = "flex";
    buttns.style.justifyContent = "space-around";
    buttns.style.flexDirection = "column";
    buttns.style.zIndex = "5"
    
    reveal.style.marginBottom = "0"
    revealState = true
  }else if(revealState == true){
    buttns.style.display = "none"
    revealState = false;
  }
})


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


let fuel = ''

//Buttons to display stations & prices in each region of the country
const capital = document.getElementById("capital")
capital.addEventListener("click", function(){ 
  clearTable(table)
  if (window.innerWidth < 650){
    buttns.style.display = "none";
  }
  stationsPerRegion("Höfuðborgarsvæðið", stationsBuild, fuel)
  regionToShow = "Höfuðborgarsvæðið"
  paintAndreset(buttons, capital)
})

const south = document.getElementById("south")
south.addEventListener("click", function(){
  clearTable(table)
  if (window.innerWidth < 650){
    buttns.style.display = "none";
  }
  stationsPerRegion("Suðurland", stationsBuild, fuel)
  regionToShow = "Suðurland"
  paintAndreset(buttons, south)
})

const north = document.getElementById("north")
north.addEventListener("click", function(){
  clearTable(table)
  if (window.innerWidth < 650){
    buttns.style.display = "none";
  }
  stationsPerRegion("Norðurland", stationsBuild, fuel)
  regionToShow = "Norðurland"
  paintAndreset(buttons, north)
})

const westfjords = document.getElementById("westfjords")
westfjords.addEventListener("click", function(){
  clearTable(table)
  if (window.innerWidth < 650){
    buttns.style.display = "none";
  }
  stationsPerRegion("Vestfirðir", stationsBuild, fuel)
  regionToShow = "Vestfirðir"
  paintAndreset(buttons, westfjords)
})

const west = document.getElementById("west")
west.addEventListener("click", function(){
  clearTable(table)
  if (window.innerWidth < 650){
    buttns.style.display = "none";
  }
  stationsPerRegion("Vesturland", stationsBuild, fuel)
  regionToShow = "Vesturland"
  reveal.innerText = "Vesturland"
  buttns.style.display = "none";
  paintAndreset(buttons, west)
})

const east = document.getElementById("east")
east.addEventListener("click", function(){
  clearTable(table)
  if (window.innerWidth < 650){
    buttns.style.display = "none";
  }
  stationsPerRegion("Austurland", stationsBuild, fuel)
  regionToShow = "Austurland"
  paintAndreset(buttons, east)
})

const southwest = document.getElementById("southwest")
southwest.addEventListener("click", function(){
  clearTable(table)
  if (window.innerWidth < 650){
    buttns.style.display = "none";
  }
  stationsPerRegion("Suðvesturhornið", stationsBuild, fuel)
  regionToShow = "Suðvesturhornið"
  southwest
})

const buttons = [capital, south, southwest, north, east, westfjords, west]


//Initial call for content display in page
stationsPerRegion("Höfuðborgarsvæðið", stationsBuild, 'bensin');
fuel = 'bensin'
regionToShow = "Höfuðborgarsvæðið"




