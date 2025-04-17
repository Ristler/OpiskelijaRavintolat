const restaurantModal = (menu, restaurant) => {

const { address, city, company, name, phone, postalCode, _id} = restaurant;
const { courses } = menu;

  let menuHtml = `
  <h1>${name}</h1>
  
  <table>`

courses.forEach(element => {
    menuHtml +=  
    `
    <tr>
    <td>
       ${element.name} 
    </td>
    </tr>
    `;    
});
menuHtml += `</table>`;
return menuHtml;
} 




const weeklyMenuModal = (weekly, restaurant) => {
    const { name } = restaurant;
    console.log('Weekly data in modal:', weekly);

    let menuHtml = `
    <h1>${name}</h1>
    <table style="border-collapse: collapse; width: 100%;">
        <tr>`;
    
    // Check if weekly has data
    if (weekly && weekly.days) {
        // First, add day headers
        weekly.days.forEach(day => {
            menuHtml += `
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">
                ${day.date}
            </th>`;
        });

        menuHtml += '</tr><tr>';

        // Then add courses under each day
        weekly.days.forEach(day => {
            menuHtml += `
            <td style="border: 1px solid #ddd; padding: 8px; vertical-align: top;">
                ${day.courses.map(course => `
                    <div style="margin-bottom: 8px;">${course.name}</div>
                `).join('')}
            </td>`;
        });
    } else {
        menuHtml += `<th>No weekly menu available</th>`;
    }

    menuHtml += `</tr></table>`;
    return menuHtml;
}


//testaaaa
const navBar = () => {
    // Start with a basic navbar
    let html = `
    <header>
        <h1><img src="assets/logoicon.png" alt="logo"></h1>
        <nav>
            <ul>
                <li><a href="profile.html">Profiili</a></li>
                <li><a id="loginorlogout" href="#">Kirjaudu sisään</a></li>
            </ul>
        </nav>
    </header>`;

    document.body.insertAdjacentHTML('afterbegin', html);

    // Dynamic login/logout behavior
    const loginOrLogoutLink = document.getElementById('loginorlogout');
    const token = localStorage.getItem('token'); // Check if user is logged in

    if (token) {
        loginOrLogoutLink.textContent = 'Kirjaudu ulos'; // Change text to logout
        loginOrLogoutLink.onclick = () => {
            localStorage.removeItem('token'); // Remove the token on logout
            location.reload(); // Reload to update UI
        };
    } else {
        loginOrLogoutLink.textContent = 'Kirjaudu sisään'; // Default to login
        loginOrLogoutLink.onclick = () => {
            window.location.href = 'login.html'; // Redirect to login page
        };
    }
}


export {restaurantModal, weeklyMenuModal, navBar};

