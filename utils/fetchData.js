const getRestaurants = async () => {
    try {
        const response = await fetch('https://media2.edu.metropolia.fi/restaurant/api/v1/restaurants');
        if (!response.ok) throw new Error('Invalid input');
        const jsonData = await response.json();
        return jsonData;
    } catch (error) {
        console.log(error.message);
        return [];
    }
};

const fetchMenu = async (menu, id) => {
    menu.splice(0, menu.length);
    try {
        const response = await fetch(`https://media2.edu.metropolia.fi/restaurant/api/v1/restaurants/daily/${id}/fi`);
        if(!response.ok) throw new Error('Invalid input');
        const jsonData = await response.json();
        menu.push(jsonData);
    } catch (error) {
        console.log(error.message);
    }
  }

  
  const fetchWeeklyMenu = async (weekly, id) => {

    weekly.splice(0, weekly.length);
    try {
        const response = await fetch(`https://media2.edu.metropolia.fi/restaurant/api/v1/restaurants/weekly/${id}/fi`);
        if(!response.ok) throw new Error('Invalid input');
        const jsonData = await response.json();
        weekly.push(jsonData);
    } catch (error) {
        console.log(error.message);
    }
  }




export {getRestaurants, fetchMenu, fetchWeeklyMenu}



