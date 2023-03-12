


export function fillRow(imageurl, name, price, row){
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

export function clearTable(table) {
    if (table.childElementCount > 1) {
      const rows = table.querySelectorAll('tr:not(:first-child)');
      Array.from(rows).forEach(row => row.remove());
    }
  }
  
export function displayPrices(tableElement) {
    const prices = JSON.parse(localStorage.getItem('prices') || '{}'); 
    const filteredStations = Object.keys(prices)
    .filter(station => prices[station].region === 'Vesturland');
    clearTable(tableElement)
      filteredStations.forEach(station => {
        let stationUpperFirst = station[0].toUpperCase();
        let stationUpdated = stationUpperFirst + station.slice(1)

        const stationInfo = prices[station];
        const pricesRow = document.createElement("tr");

        fillRow("logos/orkan.png", stationUpdated, stationInfo.bensin, pricesRow)
        //fillRow(stationInfo.disel, pricesRow) * Disel - In another section
        pricesRow.classList.add("table-row-style")

        tableElement.appendChild(pricesRow)
    });
    divTableContainer.appendChild(tableElement)
}