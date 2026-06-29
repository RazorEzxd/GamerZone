import { useState } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    if (isRegister) {
      const { error } = await supabase.auth.signUp({ email: form.email, password: form.password });
      if (error) { setError(error.message); setLoading(false); return; }
      navigate('/');
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
      if (error) { setError('Email o contraseña incorrectos'); setLoading(false); return; }
      navigate('/');
    }
    setLoading(false);
  };

  const inputStyle = {
    background: '#111',
    border: '1px solid #252525',
    color: '#fff',
    padding: '14px 18px',
    fontSize: '0.88rem',
    fontFamily: 'Inter, sans-serif',
    outline: 'none',
    width: '100%',
    borderRadius: '12px',
    transition: 'border-color 0.15s, background 0.15s',
    boxSizing: 'border-box',
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 200px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: '#0e0e0e',
        border: '1px solid #1e1e1e',
        borderRadius: '24px',
        padding: '44px 40px',
        display: 'flex',
        flexDirection: 'column',
        gap: '28px',
      }}>

        {/* LOGO + TÍTULO */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '52px', height: '52px',
            background: '#fff',
            borderRadius: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            <span style={{ color: '#000', fontWeight: 900, fontSize: '0.9rem', letterSpacing: '-0.03em' }}>GZ</span>
          </div>
          <p style={{ color: '#555', fontSize: '0.7rem', letterSpacing: '0.22em', marginBottom: '10px', fontWeight: 700 }}>
            GAMERZONE
          </p>
          <h1 style={{ color: '#fff', fontSize: '1.7rem', fontWeight: 700, lineHeight: 1.2 }}>
            {isRegister ? 'Crear cuenta' : 'Iniciar sesión'}
          </h1>
          <p style={{ color: '#444', fontSize: '0.8rem', marginTop: '8px' }}>
            {isRegister ? 'Completa los datos para registrarte' : 'Ingresa tus credenciales para continuar'}
          </p>
        </div>

        {/* CAMPOS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ color: '#555', fontSize: '0.68rem', letterSpacing: '0.12em', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
              CORREO ELECTRÓNICO
            </label>
            <input
              name="email"
              type="email"
              placeholder="correo@ejemplo.com"
              value={form.email}
              onChange={handleChange}
              style={inputStyle}
              onFocus={e => { e.currentTarget.style.borderColor = '#444'; e.currentTarget.style.background = '#141414'; }}
              onBlur={e => { e.currentTarget.style.borderColor = '#252525'; e.currentTarget.style.background = '#111'; }}
            />
          </div>
          <div>
            <label style={{ color: '#555', fontSize: '0.68rem', letterSpacing: '0.12em', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
              CONTRASEÑA
            </label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              style={inputStyle}
              onFocus={e => { e.currentTarget.style.borderColor = '#444'; e.currentTarget.style.background = '#141414'; }}
              onBlur={e => { e.currentTarget.style.borderColor = '#252525'; e.currentTarget.style.background = '#111'; }}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div style={{
            background: '#1a0000',
            border: '1px solid #3a0000',
            borderRadius: '12px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff4444" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <p style={{ color: '#ff4444', fontSize: '0.78rem', fontWeight: 500 }}>{error}</p>
          </div>
        )}

        {/* BOTÓN PRINCIPAL */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            padding: '16px',
            background: loading ? '#1a1a1a' : '#fff',
            color: loading ? '#444' : '#000',
            border: loading ? '1px solid #222' : 'none',
            borderRadius: '12px',
            fontSize: '0.82rem',
            letterSpacing: '0.15em',
            fontWeight: 800,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
          }}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#e8e8e8'; }}
          onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#fff'; }}
        >
          {loading ? (
            <>
              <div style={{ width: '14px', height: '14px', border: '2px solid #333', borderTopColor: '#888', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              CARGANDO...
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </>
          ) : (
            <>
              {isRegister ? 'CREAR CUENTA' : 'INGRESAR'}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </>
          )}
        </button>

        {/* DIVIDER */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ flex: 1, height: '1px', background: '#1a1a1a' }} />
          <span style={{ color: '#333', fontSize: '0.68rem' }}>o</span>
          <div style={{ flex: 1, height: '1px', background: '#1a1a1a' }} />
        </div>

        {/* TOGGLE REGISTRO/LOGIN */}
        <button
          onClick={() => { setIsRegister(!isRegister); setError(''); }}
          style={{
            background: 'transparent',
            border: '1px solid #222',
            color: '#888',
            borderRadius: '12px',
            padding: '13px',
            fontSize: '0.78rem',
            cursor: 'pointer',
            transition: 'all 0.15s',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#444'; e.currentTarget.style.color = '#ccc'; e.currentTarget.style.background = '#111'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#222'; e.currentTarget.style.color = '#888'; e.currentTarget.style.background = 'transparent'; }}
        >
          {isRegister ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
        </button>
      </div>
    </div>
  );
}

export default Login;