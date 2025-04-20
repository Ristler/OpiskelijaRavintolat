import { uploadAvatar, getFavoriteRestaurantId} from '../utils/fetchUser.js';
import { getRestaurant } from '../utils/fetchData.js';

const token = localStorage.getItem('token');
const username = localStorage.getItem('username');
const profileUsername = document.querySelector('#username');
const logout = document.querySelector('#logout');
const profilePictureButton = document.querySelector('#profilePictureButton');
const updateProfile = document.querySelector('#update');
const favRestaurant = document.querySelector('#favRestaurant');
let selectedFile = null;

if(!token) {
    window.location.href = 'login.html';
}

const initializeProfile = async () => {
    profileUsername.innerHTML = `Hei <b>${username}!</b>`;
    const favRestaurantId = await getFavoriteRestaurantId();

    // Set default image immediately
    profilePictureButton.src = 'assets/profilePlaceholder.png';

    if(favRestaurantId) {
        const favRestaurantName = await getRestaurant(favRestaurantId);
        const {name} = favRestaurantName;
        favRestaurant.innerHTML = `Suosikkiravintola: <b>${name}</b>`;
    } else {
        favRestaurant.innerHTML = `Suosikkiravintolaa ei ole valittu!`;
    }
    
    const currentAvatar = localStorage.getItem('avatar');
    if (currentAvatar) {
        const avatarUrl = `https://media2.edu.metropolia.fi/restaurant/uploads/${currentAvatar}`;
        const img = new Image();
        img.onload = () => {
            profilePictureButton.src = avatarUrl;
        };
        img.onerror = () => {
            profilePictureButton.src = 'assets/profilePlaceholder.png';
        };
        img.src = avatarUrl;
    }
};

profilePictureButton.addEventListener('click', async () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    
    fileInput.onchange = async (event) => {
        selectedFile = event.target.files[0];
        if (!selectedFile) return;
    
        const reader = new FileReader();
        reader.onload = (e) => {
            profilePictureButton.src = e.target.result;
        };
        reader.readAsDataURL(selectedFile);
    };
    fileInput.click();
});

updateProfile.addEventListener('click', async () => {
    if (!selectedFile) return;

    try {
        const result = await uploadAvatar(selectedFile);
        if (result.data && result.data.avatar) {
            profilePictureButton.src = `https://media2.edu.metropolia.fi/restaurant/uploads/${result.data.avatar}`;
            localStorage.setItem('avatar', result.data.avatar);
            selectedFile = null;
            alert('Profiilikuva vaihdettu.')
        }
    } catch (error) {
        console.error('Avatar upload failed:', error);
        profilePictureButton.src = 'assets/profilePlaceholder.png';
    }
});

logout.addEventListener('click', function(event) {
    event.preventDefault();

    if(token) {
        localStorage.clear();
        location.reload();
    }
});

initializeProfile();