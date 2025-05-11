import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

const API_URL = import.meta.env.VITE_API_URL;

export default function Profile() {
  const [form, setForm] = useState({
    username: '',
    full_name: '',
    email: '',
    address: ''
  });
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState('account');
  const [message, setMessage] = useState('');

  // Helper para leer cookies
  const getCookie = (name) => {
    const match = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return match ? match.pop() : null;
  };

  const userId = getCookie('user_id');

  useEffect(() => {
    if (!userId) {
      setError('No se encontró el identificador de usuario.');
      return;
    }

    const fetchSection = async () => {
      setLoading(true);
      setError('');
      try {
        if (selected === 'account') {
          const respUser = await fetch(`${API_URL}/users/${userId}/`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });
          const userData = await respUser.json();
          if (respUser.ok) setUser(userData);
          else throw new Error(userData.error || 'Error al cargar datos de usuario.');

        } else if (selected === 'orders') {
          const respOrders = await fetch(`${API_URL}/orders/user/${userId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });
          const ordersData = await respOrders.json();
          if (respOrders.ok) setOrders(ordersData);
          else throw new Error(ordersData.error || 'Error al cargar pedidos.');
        }
      } catch (err) {
        setError(err.message || 'No se pudo conectar con el servidor.');
      } finally {
        setLoading(false);
      }
    };

    fetchSection();
  }, [selected]);

  var handleLogout = function(name) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    window.location.href = '/';
};
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage('');
  setError('');
  try {
    const resp = await fetch(`${API_URL}/api/user/${userId}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(form)
    });
    const data = await resp.json();
    if (resp.ok) {
      setMessage('Perfil actualizado correctamente.');
    } else {
      setError(data.error || 'Error al actualizar perfil.');
    }
  } catch {
    setError('No se pudo conectar con el servidor.');
  } finally {
    setLoading(false);
  }
};
const handleChange = (e) => {
  const { name, value } = e.target;
  setForm(prev => ({ ...prev, [name]: value }));
};

  const sidebarButtonStyle = (active) => ({
    display: 'block',
    width: '100%',
    padding: '0.8rem 1rem',
    marginBottom: '0.5rem',
    textAlign: 'left',
    background: active ? '#e0e0e0' : 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem'
  });

  const logoutButtonStyle = {
    ...sidebarButtonStyle(false),
    background: 'red',
    color: '#fff'
  };

  return (
    <div>
      <Navbar />
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <aside
          style={{
            width: "200px",
            background: "#fff",
            borderRight: "1px solid #ddd",
            padding: "1rem",
          }}
        >
          <button
            style={sidebarButtonStyle(selected === "account")}
            onClick={() => setSelected("account")}
          >
            Cuenta
          </button>
          <button
            style={sidebarButtonStyle(selected === "orders")}
            onClick={() => setSelected("orders")}
          >
            Pedidos
          </button>
          <button
            style={logoutButtonStyle}
            onClick={() => handleLogout("user_id")}
          >
            Logout
          </button>
        </aside>

        <div style={{ flex: 1, background: "#f5f5f5" }}>
          <main style={{ padding: "2rem" }}>
            {loading ? (
              <div>Cargando...</div>
            ) : error ? (
              <div style={{ color: "red" }}>{error}</div>
            ) : selected === "account" ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                }}
              >
                <div style={{ width: "40%" }}>
                  <h2>Datos del Usuario</h2>
                  {user ? (
                    <div
                      style={{
                        backgroundColor: "#ffffff",
                        borderRadius: "10px",
                        padding: "10%",
                        display: "flex",
                        flexDirection: "column",
                        gap: "50px",
                        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <p>
                        <strong>Usuario:</strong> {user.username}
                      </p>
                      <p>
                        <strong>Nombre completo:</strong> {user.full_name}
                      </p>
                      <p>
                        <strong>Email:</strong> {user.email}
                      </p>
                      <p>
                        <strong>Dirección:</strong> {user.address}
                      </p>
                      <p>
                        <strong>Rol:</strong> {user.role}
                      </p>
                    </div>
                  ) : (
                    <p>No hay datos de usuario.</p>
                  )}
                </div>
                <form onSubmit={handleSubmit} style={{width: "40%"}}>
                  <h2 style={{}}>Modificar Perfil</h2>

                  {message && <p style={{ color: "green" }}>{message}</p>}
                  {error && <p style={{ color: "red" }}>{error}</p>}
                  <div
                    style={{
                      backgroundColor: "#ffffff",
                      padding: "10%",
                      borderRadius: "10px",
                      boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <div
                      style={{
                        marginBottom: "1rem",
                      }}
                    >
                      <label
                        htmlFor="username"
                        style={{ display: "block", marginBottom: "0.5rem" }}
                      >
                        Usuario
                      </label>
                      <input
                        id="username"
                        name="username"
                        type="text"
                        value={form.username}
                        onChange={handleChange}
                        disabled={loading}
                        style={{
                          width: "100%",
                          padding: "0.5rem",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: "1rem" }}>
                      <label
                        htmlFor="full_name"
                        style={{ display: "block", marginBottom: "0.5rem" }}
                      >
                        Nombre completo
                      </label>
                      <input
                        id="full_name"
                        name="full_name"
                        type="text"
                        value={form.full_name}
                        onChange={handleChange}
                        disabled={loading}
                        style={{
                          width: "100%",
                          padding: "0.5rem",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: "1rem" }}>
                      <label
                        htmlFor="email"
                        style={{ display: "block", marginBottom: "0.5rem" }}
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        disabled={loading}
                        style={{
                          width: "100%",
                          padding: "0.5rem",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: "1rem" }}>
                      <label
                        htmlFor="address"
                        style={{ display: "block", marginBottom: "0.5rem" }}
                      >
                        Dirección
                      </label>
                      <input
                        id="address"
                        name="address"
                        type="text"
                        value={form.address}
                        onChange={handleChange}
                        disabled={loading}
                        style={{
                          width: "100%",
                          padding: "0.5rem",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        display: "block",
                        width: "100%",
                        padding: "0.75rem",
                        background: "#0d47a1",
                        color: "#fff",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "1rem",
                      }}
                    >
                      {loading ? "Guardando..." : "Guardar cambios"}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div>
                <h2>Historial de Pedidos</h2>
                {orders.length === 0 ? (
                  <p>No hay pedidos aún.</p>
                ) : (
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th
                          style={{
                            border: "1px solid #ddd",
                            padding: "0.5rem",
                          }}
                        >
                          Pedido #
                        </th>
                        <th
                          style={{
                            border: "1px solid #ddd",
                            padding: "0.5rem",
                          }}
                        >
                          Fecha
                        </th>
                        <th
                          style={{
                            border: "1px solid #ddd",
                            padding: "0.5rem",
                          }}
                        >
                          Total
                        </th>
                        <th
                          style={{
                            border: "1px solid #ddd",
                            padding: "0.5rem",
                          }}
                        >
                          Estado
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((o) => (
                        <tr key={o.id}>
                          <td
                            style={{
                              border: "1px solid #ddd",
                              padding: "0.5rem",
                            }}
                          >
                            {o.id}
                          </td>
                          <td
                            style={{
                              border: "1px solid #ddd",
                              padding: "0.5rem",
                            }}
                          >
                            {new Date(o.date).toLocaleDateString()}
                          </td>
                          <td
                            style={{
                              border: "1px solid #ddd",
                              padding: "0.5rem",
                            }}
                          >
                            $
                            {o.total !== undefined
                              ? o.total.toFixed(2)
                              : "0.00"}
                          </td>
                          <td
                            style={{
                              border: "1px solid #ddd",
                              padding: "0.5rem",
                            }}
                          >
                            {o.status}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
