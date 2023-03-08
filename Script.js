
const box = document.getElementById("results")


const now = new Date();
const hour = now.getHours();


// 1. Define the API endpoint URL
const apiUrl = 'http://127.0.0.1:5000/orkan';


setInterval(function() {

// 2. Fetch data from the API
fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    console.log(data['borgarnes'])
    box.append(data['borgarnes'], " ", hour)
  })}, 500000);

