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
    if (!form.username) newErrors.username = 'El nombre de usuario es obligatorio.';
    if (!form.full_name) newErrors.full_name = 'El nombre completo es obligatorio.';
    if (!form.email) newErrors.email = 'El correo es obligatorio.';
    if (!form.password) newErrors.password = 'La contraseña es obligatoria.';
    if (!form.confirm_password) newErrors.confirm_password = 'Repite tu contraseña.';
    if (form.password && form.password !== form.confirm_password) newErrors.confirm_password = 'Las contraseñas deben coincidir.';
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
        setSuccessMessage(data.message || 'Registro exitoso.');
        setForm({ username: '', full_name: '', email: '', password: '', confirm_password: '', address: '' });
        setUserIdCookie(data.user_id);
        window.location.href = '/';
      } else {
        setServerError(data.error || 'Error en el registro.');
      }
    } catch (err) {
      setServerError('No se pudo conectar con el servidor.');
    }
  };

  function setUserIdCookie(value) {
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `user_id=${encodeURIComponent(value)}; expires=${expires}; path=/`;
  }

  return (
    <div className="signup-page">
      <div className="signup-form">
        <h2>Crear cuenta</h2>
        <form onSubmit={handleSubmit} noValidate>
          {['username', 'full_name', 'email', 'password', 'confirm_password', 'address'].map(field => {
            const labelMap = {
              username: 'Usuario',
              full_name: 'Nombre completo',
              email: 'Correo electrónico',
              password: 'Contraseña',
              confirm_password: 'Repetir contraseña',
              address: 'Dirección (opcional)'
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
            Registrarme
          </button>
        </form>

        <div className="footer-text">
          ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
        </div>
      </div>
    </div>
  );
}
