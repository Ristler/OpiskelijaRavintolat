//MAP
import { restaurantModal, weeklyMenuModal, navBar} from "./components.js";

import {getRestaurants, fetchMenu, fetchWeeklyMenu} from '../utils/fetchData.js';
const nearestRestaurantsButton = document.querySelector('#nearestRestaurants');
const infoContainer = document.querySelector('#infoContainer');
const modal = document.querySelector('dialog');
const closeModal = document.querySelector('#closeModal');

const loginorlogout = document.querySelector('#loginorlogout');
const registerorprofile = document.querySelector('#registerorprofile');


const token = localStorage.getItem('token');
let weeklyMenu = [];
let restaurants = [];
let menu = [];
console.log(token)
let map;


//change func name to maybe initializeSite? 
const initializeMap = async() => {
    if(token) {
        loginorlogout.innerHTML = 'Kirjaudu ulos';
        registerorprofile.innerHTML = 'Profiili';
    }

    try {
        restaurants = await getRestaurants();
        console.log('Fetched restaurants:', restaurants);
        
        // Initialize map after getting restaurants
        map = L.map('map').setView([65.192059, 24.945831], 4.49);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Add markers for restaurants
        if (restaurants && restaurants.length > 0) {
            restaurants.forEach(restaurant => {
                const y = restaurant.location.coordinates[0];
                const x = restaurant.location.coordinates[1];
                
                L.marker([x, y]).addTo(map)
                    .bindPopup(`
                        <div style="display: flex; flex-direction: column; align-items: center; text-align: center;">
                            <h3>${restaurant.name}</h3>
                            <h3>${restaurant.city}</h3>
                            <p>${restaurant.address}</p>
                             <p>${restaurant._id}</p>
                            <button class="menu-button">Katso päivän menu</button>

                            <button class="weeklyMenu">Katso viikon menu</button>
                        </div>
                    `)
                    .on('popupopen', (e) => {
                        const popup = e.popup;
                        const menuButton = popup.getElement().querySelector('.menu-button');
                        const weeklyButton = popup.getElement().querySelector('.weeklyMenu');
                        
                        menuButton.addEventListener('click', async ()  => {
                            console.log(`Clicked menu for ${restaurant.name}`);
                            await fetchMenu(menu, restaurant._id);
                            setDailyMenu(restaurant, menu, infoContainer);
                            modal.showModal();
              
                        });

                        
                        weeklyButton.addEventListener('click', async ()  => {
                            console.log(`Clicked weekly menu for ${restaurant.name}`);
                            await fetchWeeklyMenu(weeklyMenu, restaurant._id);
                            setWeeklyMenu(restaurant, weeklyMenu, infoContainer);
                            console.log(weeklyMenu);
                            modal.showModal();
                       
                        });
                    });
                    
            });
        }
    } catch (error) {
        console.error('Error initializing map:', error);
    }
}

const getNearestRestaurants = () => {

const finalList = [];

let y1 = 0;
let x1 = 0;

navigator.geolocation.getCurrentPosition((position) => {

    y1 = position.coords.latitude;
    x1 = position.coords.longitude;

   for(let i = 0; i < restaurants.length; i++) {
    const x2 = restaurants[i].location.coordinates[0];
    const y2 = restaurants[i].location.coordinates[1];

    //calc distance add
    const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

    let restaurant = {
      name: restaurants[i].name,
      address: restaurants[i].address,
      distance: distance,
      city: restaurants[i].city
    }

    finalList.push(restaurant);
  }

  finalList.sort((a,b) => a.distance-b.distance);



  },

  (error) => {
    alert("Error getting location:", error.message);
  }
);
}




//TOIMII
const setDailyMenu = (restaurant, menu, infoContainer) => {  
    infoContainer.innerHTML = '';
    try {
      menu.forEach(element => {
        infoContainer.insertAdjacentHTML("beforeend", restaurantModal(element, restaurant));
      })
    } catch (error) {
        console.log(error.message);
    }
  }



  //KESKEN
  const setWeeklyMenu = (restaurant, weekly, infoContainer) => {  
    infoContainer.innerHTML = '';
    try {
        infoContainer.insertAdjacentHTML("beforeend", weeklyMenuModal(weekly[0], restaurant));
    
    } catch (error) {
        console.log(error.message);
    } 
  }




loginorlogout.addEventListener('click', function(event) {
    event.preventDefault();
    console.log("klikkasit mua!");
    if(token) {
        localStorage.clear();
        location.reload();
    } else if(!token) {
        window.location.href = 'login.html';

    }
  });


  registerorprofile.addEventListener('click', function(event) {
    event.preventDefault();
    console.log("klikkasit mua!");
    if(token) {
        window.location.href = 'profile.html';

    } else if(!token) {
        window.location.href = 'register.html';

    }
  });


closeModal.addEventListener('click', () => {
    modal.close();

  })



nearestRestaurantsButton.addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition((position) => {
        const y1 = position.coords.latitude;
        const x1 = position.coords.longitude;
        
        // Update map view after we have the coordinates
        map.setView([y1, x1], 10);
        
        // Call getNearestRestaurants with coordinates if needed
        getNearestRestaurants();
        
        console.log('Location updated:', y1, x1);
    }, (error) => {
        console.error('Error getting location:', error.message);
    });
});

initializeMap();