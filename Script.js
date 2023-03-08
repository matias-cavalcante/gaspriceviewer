const box = document.getElementById("results");

// Define the API endpoint URL
const apiUrl = 'https://gas-prices-iceland.onrender.com/orkan';


let count = 0;
setInterval(function(){
    const now = new Date();
    const hour = now.getHours();
    const min = now.getMinutes();
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
          box.append(data['baula'].region, " ", hour, ":", min)
      })
      if (count == 4){
        count = 0
      }
      count++;
    }, 5000)

