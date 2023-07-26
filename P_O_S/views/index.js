document.addEventListener('DOMContentLoaded', () => {
    const signInButton = document.getElementById('sign-in-button');
    const logInButton = document.getElementById('log-in-button');
  
    signInButton.addEventListener('click', () => {
     // Send a POST request to the server for sign-in
     fetch('/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ /* add any relevant sign-in data here */ })
    })
    .then(response => response.json())
    .then(data => {
      // Handle the response from the server, e.g., display a message, redirect, etc.
      console.log(data);
    })
    .catch(error => {
      console.error('Error during sign-in:', error);
    });
  });
    logInButton.addEventListener('click', () => {
      // Send a POST request to the server for log-in
    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ /* add any relevant log-in data here */ })
    })
    .then(response => response.json())
    .then(data => {
      // Handle the response from the server, e.g., display a message, redirect, etc.
      console.log(data);
    })
    .catch(error => {
      console.error('Error during log-in:', error);
    });
  });
});
  