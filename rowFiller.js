

export function logoContentAndCell(url){
    const logo = document.createElement("img");
    logo.src = url;
    logo.classList.add("logo-style")
  
    const logoBox = document.createElement("th");   
    logoBox.appendChild(logo)
    return logoBox
  }
  
  export function priceContentAndCell(value){
    const priceBox = document.createElement("th");
    priceBox.style.fontSize = "1.3em"
    priceBox.style.color = "#1C2E35";
    priceBox.appendChild(document.createTextNode(value))
    return priceBox
  }
  
  export function nameContentAndCell(namevalue){
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
  
 export function fillRow(imageurl, name, price, row){
    let logoCell = logoContentAndCell(imageurl)
    const theNameCell = nameContentAndCell(name)
    const pricecell = priceContentAndCell(price)
    row.appendChild(logoCell);
    row.appendChild(theNameCell);
    row.appendChild(pricecell);
  }