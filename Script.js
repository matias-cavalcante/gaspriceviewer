const divTableContainer = document.getElementById("table-container");
const table = document.createElement("table");
table.classList.add('table-style')

const updateTimeBox = document.getElementById("time-since-updated")

const orkanUrl = 'https://gas-prices-iceland.onrender.com/orkan';
const n1Url = 'https://gas-prices-iceland.onrender.com/n1';
const olisUrl = 'https://gas-prices-iceland.onrender.com/olis';
const atloliaUrl = 'https://gas-prices-iceland.onrender.com/atlanso';
const obUrl = 'https://gas-prices-iceland.onrender.com/ob';

 
function updatePrices(url, name) {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      localStorage.setItem('prices-' + name, JSON.stringify(data));
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

function fillRow(imageurl, name, price, row){
  const logo = document.createElement("img");
  logo.src = imageurl;
  logo.classList.add("logo-style")

  const logocell = document.createElement("th");   
  logocell.appendChild(logo)

  const namecell = document.createElement("th");
  namecell.classList.add("table-cell-style")
  namecell.appendChild(document.createTextNode(name))

  const pricecell = document.createElement("th");
  pricecell.style.fontSize = "1.3em"
  pricecell.appendChild(document.createTextNode(price))

  row.appendChild(logocell);
  row.appendChild(namecell);
  row.appendChild(pricecell);
}

function newRows(filtered, imglink, gasprice) {
  return filtered.map(station => {
    let stationUpperFirst = station[0].toUpperCase() + station.slice(1);
    const pricesRow = document.createElement('tr');
    fillRow(imglink, stationUpperFirst, gasprice[station].bensin, pricesRow);
    pricesRow.classList.add('table-row-style');
    return pricesRow;
  }).sort((a, b) => parseFloat(a.lastElementChild.textContent) - parseFloat(b.lastElementChild.textContent));
}


function displayPrices(tableElement, imgurl, key, newrows, area) {
  //Get values from LOCAL STORAGE + only cares about 'VESTURLAND' values. Change latter
  const prices = JSON.parse(localStorage.getItem('prices-' + key) || '{}');
  const filteredStations = Object.keys(prices)
    .filter(station => prices[station].region === area);

  // Get rows in the table + make more rows from API all & sort them
  const rows = Array.from(tableElement.querySelectorAll('tr'));
  const moreRows = newrows(filteredStations, imgurl, prices);

  rows.sort((a, b) => parseFloat(a.lastElementChild.textContent) - parseFloat(b.lastElementChild.textContent));
  let mergedRows = [...rows, ...moreRows].sort((a, b) => parseFloat(a.lastElementChild.textContent) - parseFloat(b.lastElementChild.textContent));

  mergedRows.forEach(row => tableElement.appendChild(row));
  divTableContainer.appendChild(tableElement);
}

function clearTable(tableElement) {
  const rows = Array.from(tableElement.querySelectorAll('tr'));
  rows.forEach(row => row.remove());
}


function stationsPerRegion(showRegion){
  //Call and add OB station values
  updatePrices(obUrl, 'ob');
  setInterval(() => updatePrices(obUrl, 'ob'), 600000);

  setInterval(displayPrices(table, "logos/ob.png", 'ob', newRows, showRegion), 60050)


//Call and add OLIS station values
  updatePrices(olisUrl, 'olis');
  setInterval(() => updatePrices(olisUrl, 'olis'), 600150);
  setInterval(displayPrices(table, "logos/olis.png", 'olis', newRows, showRegion), 600180)


//Call and add ORKAN station values
  updatePrices(orkanUrl, 'orkan');
  setInterval(() => updatePrices(orkan, 'orkan'), 600200);

  setInterval(displayPrices(table, "logos/orkan.png", 'orkan', newRows, showRegion), 600250)


  //Call and add N1 station values
  updatePrices(n1Url, 'n1')
  setInterval(() => updatePrices(n1Url, 'n1'), 600300);
  setInterval(displayPrices(table, "logos/n1.png", 'n1', newRows, showRegion), 600400);

  //Call and add N1 station values
  updatePrices(atloliaUrl, 'atl')
  setInterval(() => updatePrices(atloliaUrl, 'atl'), 600500);
  setInterval(displayPrices(table, "logos/atlantsolia.png", 'atl', newRows, showRegion), 600600);
}

stationsPerRegion("Höfuðborgarsvæðið")

const capital = document.getElementById("capital")
capital.addEventListener("click", function(){
  clearTable(table)
  stationsPerRegion("Höfuðborgarsvæðið")
})

const south = document.getElementById("south")
south.addEventListener("click", function(){
  clearTable(table)
  stationsPerRegion("Suðurland")
})

const north = document.getElementById("north")
north.addEventListener("click", function(){
  clearTable(table)
  stationsPerRegion("Norðurland")
})

const westfjords = document.getElementById("westfjords")
westfjords.addEventListener("click", function(){
  clearTable(table)
  stationsPerRegion("Vestfirðir")
})

const west = document.getElementById("west")
west.addEventListener("click", function(){
  clearTable(table)
  stationsPerRegion("Vesturland")
})

const east = document.getElementById("east")
east.addEventListener("click", function(){
  clearTable(table)
  stationsPerRegion("Austurland")
})

const southwest = document.getElementById("southwest")
southwest.addEventListener("click", function(){
  clearTable(table)
  stationsPerRegion("Suðvesturhornið")
})








//Keeps track of when last update took place
setInterval(() => updateLastUpdateTime(updateTimeBox), 30000);
