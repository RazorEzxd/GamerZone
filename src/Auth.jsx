import { useState } from 'react';
import { supabase } from './supabase';

function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else alert('¡Revisa tu correo para confirmar!');
  };

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else alert('¡Bienvenido a GamerZone!');
  };

  return (
    <div style={{ padding: '20px', color: 'white' }}>
      <h2>Acceder a GamerZone</h2>
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Contraseña" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleSignUp}>Registrarse</button>
      <button onClick={handleLogin}>Iniciar Sesión</button>
    </div>
  );
}

export default Auth;