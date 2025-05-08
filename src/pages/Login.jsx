import React, { useState } from 'react';
const API_URL = import.meta.env.VITE_API_URL;

export default function LoginPage() {
  const [incorrecta, setIncorrecta] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    Login(e.nativeEvent.srcElement[0].value, e.nativeEvent.srcElement[1].value)
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
      }else{
        const data = await res.json();
        // Save user data to local storage or state
        setUserIdCookie(data.user_id);
        // Redirect to home page or dashboard
        window.location.href = '/';
      }
  }

  function setUserIdCookie(value) {
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `user_id=${encodeURIComponent(value)}; expires=${expires}; path=/`;
  }
  
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "2rem",
          border: "1px solid #ddd",
          borderRadius: "8px",
          backgroundColor: "#fff",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          width: "300px",
        }}
      >
        <h2 style={{ marginBottom: "1rem", textAlign: "center" }}>Login</h2>
        <label style={{ marginBottom: "0.5rem" }}>
          Username:
          <input
            type="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "0.5rem",
              marginTop: "0.25rem",
              marginBottom: "1rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </label>
        <label style={{ marginBottom: "0.5rem" }}>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "0.5rem",
              marginTop: "0.25rem",
              marginBottom: "1rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </label>
        {incorrecta && (
          <h5 style={{ color: "red" }}>Usuario o contraseña incorrectos</h5>
        )}
        <button
          type="submit"
          style={{
            padding: "0.75rem",
            border: "none",
            borderRadius: "4px",
            backgroundColor: "#007bff",
            color: "#fff",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}
