import React, { useState } from 'react';
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

  const commonStyles = {
    container: {
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #eef2ff 0%, #ffffff 100%)', padding: '20px', fontFamily: 'Arial, sans-serif'
    },
    card: {
      backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '450px', padding: '30px'
    },
    title: { margin: '0 0 24px', fontSize: '28px', color: '#333', textAlign: 'center' },
    label: { display: 'block', marginBottom: '6px', fontSize: '14px', color: '#555' },
    input: focusField => ({ width: '100%', padding: '10px 12px', fontSize: '14px', border: '1px solid', borderColor: focusField ? '#7c3aed' : '#ccc', borderRadius: '6px', transition: 'border-color 0.2s', outline: 'none' }),
    errorText: { marginTop: '4px', fontSize: '12px', color: '#e53e3e' },
    button: hover => ({ width: '100%', padding: '12px', fontSize: '16px', fontWeight: 'bold', backgroundColor: hover ? '#5b21b6' : '#7c3aed', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'background-color 0.2s' }),
    footerText: { marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#666' },
    link: { color: '#7c3aed', textDecoration: 'none', fontWeight: 'bold' }
  };

  return (
    <div style={commonStyles.container}>
      <div style={commonStyles.card}>
        <h2 style={commonStyles.title}>Crear cuenta</h2>
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
            const isFocused = focusField === field;
            const isPassword = field.includes('password');
            const type = isPassword ? 'password' : field === 'email' ? 'email' : 'text';
            return (
              <div key={field} style={{ marginBottom: '18px' }}>
                <label htmlFor={field} style={commonStyles.label}>{labelMap[field]}</label>
                <input
                  type={type}
                  name={field}
                  id={field}
                  value={form[field]}
                  onChange={handleChange}
                  onFocus={() => setFocusField(field)}
                  onBlur={() => setFocusField('')}
                  style={commonStyles.input(isFocused)}
                />
                {errors[field] && <div style={commonStyles.errorText}>{errors[field]}</div>}
              </div>
            );
          })}

          {serverError && <div style={{ ...commonStyles.errorText, textAlign: 'center' }}>{serverError}</div>}
          {successMessage && <div style={{ marginTop: '10px', textAlign: 'center', color: '#276749' }}>{successMessage}</div>}

          <button
            type="submit"
            onMouseEnter={() => setHoverButton(true)}
            onMouseLeave={() => setHoverButton(false)}
            style={commonStyles.button(hoverButton)}
          >
            Registrarme
          </button>
        </form>

        <div style={commonStyles.footerText}>
          ¿Ya tienes cuenta? <a href="#" style={commonStyles.link}>Inicia sesión</a>
        </div>
      </div>
    </div>
  );
}
