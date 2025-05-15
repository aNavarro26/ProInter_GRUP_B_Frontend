import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Profile.css';

const API_URL = import.meta.env.VITE_API_URL;

export default function Profile() {
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    full_name: '',
    email: '',
    address: '',
    password: '',
    new_password: ''
  });
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(
    location.state?.section === 'orders' ? 'orders' : 'account'
  );
  const [message, setMessage] = useState('');

  const getCookie = (name) => {
    const match = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return match ? match.pop() : null;
  };
  const userId = getCookie('user_id');

  useEffect(() => {
    if (!userId) {
      setError('No user ID found.');
      return;
    }
    const fetchSection = async () => {
      setLoading(true);
      setError('');
      try {
        if (selected === 'account') {
          const respUser = await fetch(`${API_URL}/users/${userId}/`);
          const userData = await respUser.json();
          if (respUser.ok) {
            setUser(userData);
            setForm(prev => ({
              ...prev,
              username: userData.username,
              full_name: userData.full_name,
              email: userData.email,
              address: userData.address
            }));
          } else {
            throw new Error(userData.error || 'Error loading user data.');
          }
        } else {
          const respOrders = await fetch(`${API_URL}/orders/user/${userId}/`);
          const ordersData = await respOrders.json();
          if (respOrders.ok) setOrders(ordersData);
          else throw new Error(ordersData.error || 'Error loading orders.');
        }
      } catch (err) {
        setError(err.message || 'Server error.');
      } finally {
        setLoading(false);
      }
    };
    fetchSection();
  }, [selected]);

  const handleLogout = () => {
    document.cookie = 'user_id=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const resp = await fetch(`${API_URL}/users/${userId}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form)
      });
      const data = await resp.json();
      if (resp.ok) setMessage('Profile updated successfully.');
      else setError(data.error || 'Error updating profile.');
    } catch {
      setError('Server error.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      const resp = await fetch(`${API_URL}/orders/${orderId}/status/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Cancelled', customer: Number(userId) })
      });
      if (resp.ok) setOrders(prev => prev.filter(o => o.order_id !== orderId));
      else alert('Could not cancel order.');
    } catch (err) {
      console.error(err);
      alert('Error cancelling order.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <div className="profile-page">
        <aside className="profile-sidebar">
          <button
            className={`sidebar-button ${selected === 'account' ? 'active' : ''}`}
            onClick={() => setSelected('account')}
          >
            Account
          </button>
          <button
            className={`sidebar-button ${selected === 'orders' ? 'active' : ''}`}
            onClick={() => setSelected('orders')}
          >
            Orders
          </button>

          {/* Only ADMIN users */}
          {user?.role === 'Admin' && (
            <button
              className="sidebar-button"
              onClick={() => navigate('/admin/products')}
            >
              Manage Products
            </button>
          )}

          <button
            className="sidebar-button logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </aside>

        <div className="profile-content">
          {loading && <div>Loading...</div>}
          {error && <div className="profile-error">{error}</div>}

          {selected === 'account' && !loading && !error && (
            <div className="account-section">
              {/* User Details */}
              <div className="profile-card">
                <h2>User Details</h2>
                {user ? (
                  <>
                    <p><strong>Username:</strong> {user.username}</p>
                    <p><strong>Full Name:</strong> {user.full_name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Address:</strong> {user.address}</p>
                    <p><strong>Role:</strong> {user.role}</p>
                  </>
                ) : (
                  <p>No user data.</p>
                )}
              </div>

              {/* Edit Profile Form */}
              <form className="profile-form" onSubmit={handleSubmit}>
                <h2>Edit Profile</h2>
                {message && <div className="profile-message">{message}</div>}
                {error && <div className="profile-error">{error}</div>}

                <div className="form-card">
                  {['username', 'full_name', 'email', 'address', 'password', 'new_password'].map(field => (
                    <div className="form-group" key={field}>
                      <label htmlFor={field}>{field.replace('_', ' ')}</label>
                      <input
                        id={field}
                        name={field}
                        type={field.includes('password') ? 'password' : 'text'}
                        value={form[field]}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </div>
                  ))}
                  <button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {selected === 'orders' && !loading && !error && (
            <div className="orders-section">
              <h2>Order History</h2>
              {orders.length === 0 ? (
                <p>No orders yet.</p>
              ) : (
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Order #</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(o => {
                      const items = Array.isArray(o.items) ? o.items : [];
                      const total = items.reduce((sum, i) => sum + i.subtotal, 0).toFixed(2);
                      const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
                      return (
                        <tr key={o.order_id}>
                          <td>{o.order_id}</td>
                          <td>{new Date(o.order_date).toLocaleDateString()}</td>
                          <td>€{total}</td>
                          <td>
                            {o.status}
                            {o.status === 'Pending' && (
                              <div className="order-actions">
                                <button
                                  className="btn-pay"
                                  onClick={() =>
                                    navigate('/checkout', {
                                      state: { orderId: o.order_id, total: parseFloat(total), itemCount }
                                    })
                                  }
                                >
                                  Pay
                                </button>
                                <button
                                  className="btn-cancel"
                                  onClick={() => handleCancelOrder(o.order_id)}
                                >
                                  Cancel
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
