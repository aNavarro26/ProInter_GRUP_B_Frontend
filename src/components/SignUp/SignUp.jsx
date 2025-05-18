import React, { useState } from 'react';
import './SignUp.css';

const API_URL = import.meta.env.VITE_API_URL;

export default function SignupPage() {
  const [form, setForm] = useState({
    username: '',
    full_name: '',
    email: '',
    password: '',
    confirm_password: '',
    address: ''
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [focusField, setFocusField] = useState('');
  const [hoverButton, setHoverButton] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.username) newErrors.username = 'Username is required.';
    if (!form.full_name) newErrors.full_name = 'Full name is required.';
    if (!form.email) {
      newErrors.email = 'Email is required.';
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = 'Invalid email format.';
    }
    if (!form.password) newErrors.password = 'Password is required.';
    if (!form.confirm_password) newErrors.confirm_password = 'Please confirm your password.';
    if (form.password && form.password !== form.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match.';
    }

    return newErrors;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setServerError('');
    setSuccessMessage('');
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      const resp = await fetch(`${API_URL}/users/signup/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await resp.json();
      if (resp.ok) {
        setSuccessMessage(data.message || 'Registration successful.');
        setForm({ username: '', full_name: '', email: '', password: '', confirm_password: '', address: '' });
        setUserIdCookie(data.user_id);
        window.location.href = '/';
      } else {
        setServerError(data.error || 'Registration failed.');
      }
    } catch (err) {
      setServerError('Failed to connect to the server.');
    }
  };

  function setUserIdCookie(value) {
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `user_id=${encodeURIComponent(value)}; expires=${expires}; path=/`;
  }

  return (
    <div className="signup-page">
      <div className="signup-form">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit} noValidate>
          {['username', 'full_name', 'email', 'password', 'confirm_password', 'address'].map(field => {
            const labelMap = {
              username: 'Username',
              full_name: 'Full Name',
              email: 'Email',
              password: 'Password',
              confirm_password: 'Confirm Password',
              address: 'Address (optional)'
            };
            const isPassword = field.includes('password');
            const type = isPassword ? 'password' : field === 'email' ? 'email' : 'text';
            return (
              <div key={field} className="form-group">
                <label htmlFor={field}>{labelMap[field]}</label>
                <input
                  type={type}
                  name={field}
                  id={field}
                  value={form[field]}
                  onChange={handleChange}
                  onFocus={() => setFocusField(field)}
                  onBlur={() => setFocusField('')}
                  className={focusField === field ? 'focused' : ''}
                />
                {errors[field] && <div className="error-text">{errors[field]}</div>}
              </div>
            );
          })}

          {serverError && <div className="error-text center">{serverError}</div>}
          {successMessage && <div className="success-text">{successMessage}</div>}

          <button
            type="submit"
            onMouseEnter={() => setHoverButton(true)}
            onMouseLeave={() => setHoverButton(false)}
            className={hoverButton ? 'hovered' : ''}
          >
            Sign Up
          </button>
        </form>

        <div className="footer-text">
          Already have an account? <a href="/login">Log in</a>
        </div>
      </div>
    </div>
  );
}
