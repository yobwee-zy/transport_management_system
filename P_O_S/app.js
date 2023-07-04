import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = () => {
    axios.post('http://localhost:4013/login', { username, password })
      .then(response => {
        if (response.data.success) {
          // Authentication successful
          const role = response.data.role;
          // Handle role-based redirection or rendering here
          setMessage(`Logged in as ${role}`);
        } else {
          // Authentication failed
          setMessage(response.data.message);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <div>
      <h1>Login</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <p>{message}</p>
    </div>
  );
};

export default App;
