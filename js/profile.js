const token = localStorage.getItem('token');
const username = localStorage.getItem('username');
const profileUsername = document.querySelector('#username');
const logout = document.querySelector('#logout');



//IF USER IS NOT AUTHED, REDIRECT TO LOGIN.
if(!token) {
    window.location.href = 'login.html';

};


const initializeProfile = async ()  => {

    profileUsername.innerHTML = `Hei ${username}!`
        
};



logout.addEventListener('click', function(event) {
    event.preventDefault();
    console.log("klikkasit mua!");
    if(token) {
        localStorage.clear();
        location.reload();
    }
  });
initializeProfile();