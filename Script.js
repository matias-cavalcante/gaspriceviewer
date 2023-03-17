const reveal = document.getElementById("choose")
const buttns = document.getElementById("regions")


const divTableContainer = document.getElementById("table-container");
const table = document.createElement("table");
table.classList.add('table-style')

const bensinButton = document.getElementById("ben")
const diselButton = document.getElementById("dis")

bensinButton.addEventListener("click", function(){
  fuel = 'bensin'
  bensinButton.style.backgroundColor = "#011826"
  diselButton.style.backgroundColor = "#02436c"

})

diselButton.addEventListener("click", function(){
  fuel = 'disel'
  diselButton.style.backgroundColor = "#011826"
  bensinButton.style.backgroundColor = "#02436c"
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

let revealState = false;

reveal.addEventListener("click", function(){
  if (revealState == false){
    buttns.style.display = "flex"
    buttns.style.flexDirection = "column"
    buttns.style.height = "65vh"
    buttns.style.justifyContent = "space-around"
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
  namecell.appendChild(document.createTextNode(name))

  const pricecell = document.createElement("th");
  pricecell.style.fontSize = "1.3em"
  pricecell.style.color = "#0c5380"  
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


let fuel = 'disel'

//Buttons to display stations & prices in each region of the country
const capital = document.getElementById("capital")
capital.addEventListener("click", function(){ 
  clearTable(table)
  if (window.innerWidth < 650){
    buttns.style.display = "none";
  }
  stationsPerRegion("Höfuðborgarsvæðið", stationsBuild, fuel)
})

const south = document.getElementById("south")
south.addEventListener("click", function(){
  clearTable(table)
  if (window.innerWidth < 650){
    buttns.style.display = "none";
  }
  stationsPerRegion("Suðurland", stationsBuild, fuel)
})

const north = document.getElementById("north")
north.addEventListener("click", function(){
  clearTable(table)
  if (window.innerWidth < 650){
    buttns.style.display = "none";
  }
  stationsPerRegion("Norðurland", stationsBuild, fuel)
})

const westfjords = document.getElementById("westfjords")
westfjords.addEventListener("click", function(){
  clearTable(table)
  if (window.innerWidth < 650){
    buttns.style.display = "none";
  }
  stationsPerRegion("Vestfirðir", stationsBuild, fuel)
})

const west = document.getElementById("west")
west.addEventListener("click", function(){
  clearTable(table)
  if (window.innerWidth < 650){
    buttns.style.display = "none";
  }
  stationsPerRegion("Vesturland", stationsBuild, fuel)
})

const east = document.getElementById("east")
east.addEventListener("click", function(){
  clearTable(table)
  if (window.innerWidth < 650){
    buttns.style.display = "none";
  }
  stationsPerRegion("Austurland", stationsBuild, fuel)
})

const southwest = document.getElementById("southwest")
southwest.addEventListener("click", function(){
  clearTable(table)
  if (window.innerWidth < 650){
    buttns.style.display = "none";
  }
  stationsPerRegion("Suðvesturhornið", stationsBuild, fuel)
})

//Initial call for content display in page
stationsPerRegion("Höfuðborgarsvæðið", stationsBuild, fuel);

window.addEventListener('resize', function() {
  if (window.innerWidth > 650) {
    buttns.style.display = "flex"
    buttns.style.height = "325px"

    }else if (window.innerWidth < 650){
        buttns.style.display = "none"
    }
});



