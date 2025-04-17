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



  export  {createUser, userAvailable, userLogin}