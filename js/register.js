import {createUser, userAvailable, userLogin} from "../utils/fetchUser.js";

const handleSubmit = async (event) => {
    event.preventDefault();
    const username = document.querySelector('#user').value;
    const password = document.querySelector('#password').value;
    const email = document.querySelector('#email').value;

    try {
        const user = { username, password, email };
        const creds = {username, password};
        const response = await userAvailable(username);
        console.log('Response:', response);  // Changed from available to response

        if(response.available === true) {
            await createUser(user);
            const userResponse = await userLogin(creds);

            localStorage.setItem('token', userResponse.token);
            localStorage.setItem('username', userResponse.data.username);
            localStorage.setItem('email', userResponse.data.email);
            localStorage.setItem('favoriteRestaurant', userResponse.data.favouriteRestaurant);
            localStorage.setItem('userId', userResponse.data._id);
            localStorage.setItem('role', userResponse.data.role);
            localStorage.setItem('avatar', userResponse.data.avatar);

            window.location.href = "main.html";
        } else {
            console.log("username is not available")
        }
    } catch (error) {
        console.error('Registration failed:', error);
    }
};

document.querySelector('.authForm').addEventListener('submit', handleSubmit);

export default handleSubmit;