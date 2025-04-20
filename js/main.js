
import { restaurantModal, weeklyMenuModal} from "./components.js";
import {getRestaurants, fetchMenu, fetchWeeklyMenu} from '../utils/fetchData.js';
import { addFavoriteRestaurant, getFavoriteRestaurantId } from "../utils/fetchUser.js";

//ELEMENTS
const nearestRestaurantsButton = document.querySelector('#nearestRestaurants');


const favorite = document.querySelector('#favoriteRestaurant');



const infoContainer = document.querySelector('#infoContainer');
const modal = document.querySelector('dialog');
const closeModal = document.querySelector('#closeModal');
const loginorlogout = document.querySelector('#loginorlogout');
const registerorprofile = document.querySelector('#registerorprofile');


//LOCALSTORAGE
const token = localStorage.getItem('token');


let weeklyMenu = [];
let restaurants = [];
let menu = [];
let map;

const initializeSite = async() => {
    favorite.style.display = 'none'; 
    const favId = await getFavoriteRestaurantId();
    console.log(favId);
    nearestRestaurantsButton.innerHTML = `Lähimmät<br>ravintolat`;
       

    if(favId) {

         favorite.innerHTML= `Suosikki<br>ravintolani`
         favorite.style.display = 'block';
    }

    if(token) {
        loginorlogout.innerHTML = 'Kirjaudu ulos';
        registerorprofile.innerHTML = 'Profiili';
    } else {
        favorite.style.display = 'none'; 
    }
    try {
        restaurants = await getRestaurants();
        map = L.map('map').setView([65.192059, 24.945831], 4.49);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        if (restaurants && restaurants.length > 0) {
            restaurants.forEach(restaurant => {
                const y = restaurant.location.coordinates[0];
                const x = restaurant.location.coordinates[1];
                
                L.marker([x, y]).addTo(map)
                    .bindPopup(`
                        <div style="display: flex; flex-direction: column; align-items: center; text-align: center;">
                            <h3>${restaurant.name} ${restaurant.company}</h3>
                            <p>Osoite: ${restaurant.address}, ${restaurant.city}, ${restaurant.postalCode}</p>
                            <p>Puhelinnumero: ${restaurant.phone}</p>

                            <div class="popupButtons">
                             <button id="menu-button">Katso päivän menu</button>
                             <button id="weeklyMenu">Katso viikon menu</button>
                              ${token ? `<img class="favoriteButton" src="./assets/suosikkiNappi.png" alt="Aseta suosikkiravintola" style="width: 50px; height: 50px;"/>` : ''}
                            </div>
                        </div>
                    `)
                    .on('popupopen', (e) => {
                        const popup = e.popup;
                        const menuButton = popup.getElement().querySelector('#menu-button');
                        const weeklyButton = popup.getElement().querySelector('#weeklyMenu');
                        const favoriteButton = popup.getElement().querySelector('.favoriteButton'); // Add this line

                        menuButton.addEventListener('click', async ()  => {
                            await fetchMenu(menu, restaurant._id);
                            setDailyMenu(restaurant, menu, infoContainer);
                            modal.showModal();
              
                        });
                      
                        weeklyButton.addEventListener('click', async ()  => {
                            await fetchWeeklyMenu(weeklyMenu, restaurant._id);
                            setWeeklyMenu(restaurant, weeklyMenu, infoContainer);
                            modal.showModal();
                        })
                        favoriteButton.addEventListener('click', async ()  => {
                            await addFavoriteRestaurant(restaurant._id);
                            alert(`${restaurant.name} lisätty suosikiksi!`);
                        });
                    })
            })}
    } catch (error) {
        console.error('Error initializing site:', error);
    }
};

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
)
};

const getRestaurantCoordinates = (restaurantId) => {
    const restaurant = restaurants.find(r => r._id === restaurantId);
    if (!restaurant) {
        console.error('Restaurant not found');
        return null;
    }
    return {
        lat: restaurant.location.coordinates[1],
        lng: restaurant.location.coordinates[0] 
    }
};

const getFavoriteRestaurantName = async () => {
    try {
        const favId = await getFavoriteRestaurant();
        if (!favId) {
            console.log('No favorite restaurant set');
            return null;
        }

        const restaurant = restaurants.find(r => r._id === favId);
        if (restaurant) {
            localStorage.setItem('favRestaurantName', restaurant.name);
            return restaurant.name;
        } else {
            console.log('Restaurant not found');
            return null;
        }
    } catch (error) {
        console.error('Error getting favorite restaurant name:', error);
        return null;
    }
};


const setDailyMenu = (restaurant, menu, infoContainer) => {  
    infoContainer.innerHTML = '';
    try {
      menu.forEach(element => {
        infoContainer.insertAdjacentHTML("beforeend", restaurantModal(element, restaurant));
      })
    } catch (error) {
        console.log(error.message);
    }
  };

  const setWeeklyMenu = (restaurant, weekly, infoContainer) => {  
    infoContainer.innerHTML = '';
    try {
        infoContainer.insertAdjacentHTML("beforeend", weeklyMenuModal(weekly[0], restaurant));
    
    } catch (error) {
        console.log(error.message);
    } 
  };


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

  });

nearestRestaurantsButton.addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition((position) => {
        const y1 = position.coords.latitude;
        const x1 = position.coords.longitude;

        map.setView([y1, x1], 10);
        getNearestRestaurants();
        
        console.log('Location updated:', y1, x1);
    }, (error) => {
        console.error('Error getting location:', error.message);
    })
});

favorite.addEventListener('click', async () => {
    const favId = await getFavoriteRestaurantId();
    

    const coords = getRestaurantCoordinates(favId);
    if (coords) {
        map.setView([coords.lat, coords.lng], 35);
    }
});

initializeSite();