const box = document.getElementById("results");

// Define the API endpoint URL
const apiUrl = 'https://gas-prices-iceland.onrender.com/orkan';

// Set the interval to fetch data from the API every 5 minutes
setInterval(function() {
  // Get the current date and time
  const now = new Date();
  // Get the current hour
  const hour = now.getHours();
  // Fetch data from the API
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      console.log(data['borgarnes'])
      // Append the data and current hour to the HTML element
      box.append(data['borgarnes'], " ", hour)
    })
}, 50000); //
