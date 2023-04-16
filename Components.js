//WEBPAGE REGIONS
export const body = document.querySelector("body");
export const secondSection = document.querySelector('#main-container');

//NAVBAR ELEMENTS
export const burger = document.querySelector(".hamburger");
export const revelnav = document.querySelector(".navbar-list");
export const listItems = revelnav.querySelectorAll("li");
export const navButtons = document.querySelectorAll(".nav-button");

export const callToActionButton = document.querySelector('.call-to-action');

//CHANGE FUEL TYPE DISPLAYED WITH THESE BUTTONS
export const bensinButton = document.getElementById("ben")
export const diselButton = document.getElementById("dis")

//TABLE (IN MIDDLE SECTION) COMPONENTS
export const headerDiv = document.querySelector("#table-header");
export const priceH3 = headerDiv.querySelectorAll("h3")[2];
export const divTableContainer = document.getElementById("table-container");
export const table = document.createElement("table");

//CAROUSEL BUTTONS SWITCH COMPONENTS
export const prevButton = document.getElementById("prev");
export const nextButton = document.getElementById("next");
export const currentRegion = document.getElementById("current-region");
export const regionItems = Array.from(document.querySelectorAll(".carousel-item"));

//FORMAT OF DATA REQUIRED FOR EACH GAS STATION
export const stationsBuild = [
  { code: 'ob', url: 'https://gas-prices-iceland.onrender.com/ob', img: 'logos/ob.png', time: 600000 },
  { code: 'olis',url: 'https://gas-prices-iceland.onrender.com/olis', img: 'logos/olis.png', time: 600150 },
  { code: 'orkan', url: 'https://gas-prices-iceland.onrender.com/orkan', img: 'logos/orkan.png', time: 600200 },
  { code: 'n1', url:'https://gas-prices-iceland.onrender.com/n1' , img: 'logos/n1.png', time: 600300 },
  { code: 'atl',url: 'https://gas-prices-iceland.onrender.com/atlanso', img: 'logos/atlantsolia.png', time: 600500 }];
