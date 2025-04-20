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
};

export {restaurantModal, weeklyMenuModal};

