const createUser = async (user) => {
    try {
      const response = await fetch('https://media2.edu.metropolia.fi/restaurant/api/v1/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      });
  
      if (!response.ok) throw new Error('Failed to create user');
  
      const result = await response.json();
      console.log('User created:', result);
      return result;
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const userAvailable = async (username) => {
    try {
        const response = await fetch(`https://media2.edu.metropolia.fi/restaurant/api/v1/users/available/${username}`);
        if (!response.ok) throw new Error('Invalid input');
        const jsonData = await response.json();
        return jsonData;
    } catch (error) {
        console.log(error.message);
    }
};

const userLogin = async (user) => {
    console.log(JSON.stringify(user))
    try {
      const response = await fetch('https://media2.edu.metropolia.fi/restaurant/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      });
  
      if (!response.ok) throw new Error('Failed to login.');
  
      const result = await response.json();
      console.log('User logged in', result);
      return result;
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const addFavoriteRestaurant = async (restaurantId) => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    try {
        const response = await fetch(`https://media2.edu.metropolia.fi/restaurant/api/v1/users`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                favouriteRestaurant: restaurantId
            })
        });

        if (!response.ok) throw new Error('Failed to update favorite restaurant');

        const result = await response.json();
        console.log('Favorite restaurant updated:', result);
        return result;
    } catch (error) {
        console.error('Error updating favorite:', error.message);
        throw error;
    }
};

const getFavoriteRestaurantId = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`https://media2.edu.metropolia.fi/restaurant/api/v1/users/token`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Failed to fetch favorite restaurant');

        const result = await response.json();
        return result.favouriteRestaurant;
    } catch (error) {
        console.error('Error fetching favorite:', error.message);
        return null;
    }
};

const uploadAvatar = async (avatarFile) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('avatar', avatarFile);

    try {
        const response = await fetch('https://media2.edu.metropolia.fi/restaurant/api/v1/users/avatar', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (!response.ok) throw new Error('Failed to upload avatar');

        const result = await response.json();
        console.log('Avatar uploaded successfully:', result);
        
        if (result.data && result.data.avatar) {
            localStorage.setItem('avatar', result.data.avatar);
        }
        
        return result;
    } catch (error) {
        console.error('Error uploading avatar:', error);
        throw error;
    }
};

export {
    createUser, 
    userAvailable, 
    userLogin, 
    addFavoriteRestaurant, 
    getFavoriteRestaurantId,
    uploadAvatar
};