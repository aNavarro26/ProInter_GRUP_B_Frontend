import React, { useState } from 'react';
import './Login.css';

const API_URL = import.meta.env.VITE_API_URL;

export default function LoginPage() {
  const [incorrecta, setIncorrecta] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    Login(username, password);
  };

  async function Login(username, password) {
    const res = await fetch(`${API_URL}/users/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      setIncorrecta(true);
    } else {
      const data = await res.json();
      setUserIdCookie(data.user_id);
      window.location.href = '/';
    }
  }

  function setUserIdCookie(value) {
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `user_id=${encodeURIComponent(value)}; expires=${expires}; path=/`;
  }

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {incorrecta && <h5 className="error">Usuario o contraseña incorrectos</h5>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}