import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext, useState, useRef, useEffect } from 'react';
import { CartContext } from './CartContext';
import { supabase } from './supabase';
import { ADMIN_EMAIL } from './config';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import Confirmacion from './pages/Confirmacion';
import Login from './pages/Login';
import Admin from './pages/Admin';

function App() {
  const { cart, clearCart, removeFromCart } = useContext(CartContext);
  const [cartOpen, setCartOpen] = useState(false);
  const [user, setUser] = useState(null);
  const cartRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const grouped = cart.reduce((acc, item) => {
    acc[item.id] = acc[item.id] || { ...item, qty: 0 };
    acc[item.id].qty += 1;
    return acc;
  }, {});
  const items = Object.values(grouped);
  const total = items.reduce((acc, item) => acc + parseFloat(item.price) * item.qty, 0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (cartRef.current && !cartRef.current.contains(e.target)) setCartOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => { setCartOpen(false); }, [location.pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#080808' }}>

      {/* NAVBAR */}
      <nav style={{
        padding: '0 32px',
        height: '68px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #1a1a1a',
        background: 'rgba(10,10,10,0.97)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(24px)',
      }}>

        {/* IZQUIERDA: Logo + Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '36px' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px', height: '36px',
              background: '#fff',
              borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <span style={{ color: '#000', fontWeight: 900, fontSize: '0.7rem', letterSpacing: '-0.03em' }}>GZ</span>
            </div>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: '1.05rem', letterSpacing: '0.12em' }}>
              GAMER<span style={{ color: '#fff', opacity: 0.3 }}>ZONE</span>
            </span>
          </Link>

          {/* NAV LINKS */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {[{ label: 'INICIO', path: '/' }, ...(user?.email === ADMIN_EMAIL ? [{ label: 'ADMIN', path: '/admin' }] : [])].map(({ label, path }) => (
              <Link key={path} to={path} style={{
                color: isActive(path) ? '#fff' : '#666',
                fontSize: '0.72rem',
                letterSpacing: '0.12em',
                fontWeight: 700,
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '10px',
                background: isActive(path) ? '#1a1a1a' : 'transparent',
                border: isActive(path) ? '1px solid #2a2a2a' : '1px solid transparent',
                transition: 'all 0.15s',
              }}
                onMouseEnter={e => { if (!isActive(path)) { e.currentTarget.style.color = '#aaa'; e.currentTarget.style.background = '#111'; e.currentTarget.style.borderColor = '#1a1a1a'; } }}
                onMouseLeave={e => { if (!isActive(path)) { e.currentTarget.style.color = '#666'; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; } }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* DERECHA: Usuario + Carrito */}
        <div ref={cartRef} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '10px' }}>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                background: '#111',
                border: '1px solid #222',
                borderRadius: '12px',
                padding: '6px 14px 6px 8px',
              }}>
                <div style={{
                  width: '28px', height: '28px',
                  borderRadius: '50%',
                  background: '#222',
                  border: '1px solid #333',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.65rem', color: '#aaa', fontWeight: 800,
                }}>
                  {user.email[0].toUpperCase()}
                </div>
                <span style={{ color: '#666', fontSize: '0.72rem', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.email}
                </span>
              </div>
              <button onClick={handleLogout} style={{
                background: 'transparent',
                border: '1px solid #222',
                color: '#666',
                fontSize: '0.72rem',
                letterSpacing: '0.1em',
                fontWeight: 700,
                cursor: 'pointer',
                padding: '8px 16px',
                borderRadius: '10px',
                transition: 'all 0.15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#444'; e.currentTarget.style.color = '#ccc'; e.currentTarget.style.background = '#111'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#222'; e.currentTarget.style.color = '#666'; e.currentTarget.style.background = 'transparent'; }}
              >SALIR</button>
            </div>
          ) : (
            <Link to="/login" style={{
              color: '#ccc',
              fontSize: '0.72rem',
              letterSpacing: '0.1em',
              fontWeight: 700,
              textDecoration: 'none',
              padding: '8px 20px',
              border: '1px solid #333',
              borderRadius: '10px',
              background: '#111',
              transition: 'all 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#555'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = '#1a1a1a'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.color = '#ccc'; e.currentTarget.style.background = '#111'; }}
            >LOGIN</Link>
          )}

          {/* CARRITO BTN */}
          <button onClick={() => setCartOpen(!cartOpen)} style={{
            background: cart.length > 0 ? '#fff' : '#111',
            color: cart.length > 0 ? '#000' : '#888',
            border: '1px solid',
            borderColor: cart.length > 0 ? '#fff' : '#333',
            padding: '8px 18px',
            fontSize: '0.72rem',
            letterSpacing: '0.1em',
            fontWeight: 700,
            cursor: 'pointer',
            borderRadius: '10px',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
            onMouseEnter={e => {
              if (cart.length === 0) {
                e.currentTarget.style.borderColor = '#555';
                e.currentTarget.style.color = '#ccc';
                e.currentTarget.style.background = '#1a1a1a';
              }
            }}
            onMouseLeave={e => {
              if (cart.length === 0) {
                e.currentTarget.style.borderColor = '#333';
                e.currentTarget.style.color = '#888';
                e.currentTarget.style.background = '#111';
              }
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            CARRITO {cart.length > 0 && (
              <span style={{
                background: '#000',
                color: '#fff',
                borderRadius: '20px',
                padding: '2px 8px',
                fontSize: '0.65rem',
                fontWeight: 800,
                minWidth: '20px',
                textAlign: 'center',
              }}>{cart.length}</span>
            )}
          </button>

          {/* DROPDOWN */}
          {cartOpen && (
            <div style={{
              position: 'absolute',
              top: '58px',
              right: 0,
              width: '380px',
              background: '#0e0e0e',
              border: '1px solid #222',
              borderRadius: '18px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '0',
              boxShadow: '0 24px 72px rgba(0,0,0,0.95)',
              overflow: 'hidden',
            }}>
              {/* HEADER */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <p style={{ color: '#888', fontSize: '0.7rem', letterSpacing: '0.18em', fontWeight: 700 }}>
                  CARRITO {cart.length > 0 && `— ${cart.length} ITEMS`}
                </p>
                {items.length > 0 && (
                  <button onClick={clearCart} style={{
                    background: 'transparent', border: 'none',
                    color: '#444', fontSize: '0.65rem', cursor: 'pointer',
                    letterSpacing: '0.08em', fontWeight: 600,
                    transition: 'color 0.15s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.color = '#888'}
                    onMouseLeave={e => e.currentTarget.style.color = '#444'}
                  >VACIAR TODO</button>
                )}
              </div>

              {items.length === 0 ? (
                <div style={{ padding: '40px 0', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#2a2a2a" strokeWidth="1.5">
                    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                  </svg>
                  <p style={{ color: '#444', fontSize: '0.82rem', fontWeight: 600 }}>Tu carrito está vacío</p>
                  <p style={{ color: '#2a2a2a', fontSize: '0.72rem' }}>Agrega productos para continuar</p>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto', marginBottom: '16px' }}>
                    {items.map(item => (
                      <div key={item.id} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '12px 14px',
                        background: '#141414',
                        borderRadius: '12px',
                        border: '1px solid #1e1e1e',
                        gap: '10px',
                      }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ color: '#ddd', fontSize: '0.78rem', fontWeight: 600, marginBottom: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                          <p style={{ color: '#555', fontSize: '0.68rem' }}>x{item.qty} · S/ {(parseFloat(item.price) * item.qty).toFixed(2)}</p>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} style={{
                          background: '#1e1e1e', border: '1px solid #2a2a2a',
                          color: '#555', width: '26px', height: '26px',
                          fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          padding: 0, flexShrink: 0, borderRadius: '8px', cursor: 'pointer',
                          transition: 'all 0.15s',
                        }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#2a2a2a'; e.currentTarget.style.color = '#ff4444'; e.currentTarget.style.borderColor = '#3a1a1a'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = '#1e1e1e'; e.currentTarget.style.color = '#555'; e.currentTarget.style.borderColor = '#2a2a2a'; }}
                        >×</button>
                      </div>
                    ))}
                  </div>

                  {/* TOTAL */}
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '14px 0',
                    borderTop: '1px solid #1a1a1a',
                    borderBottom: '1px solid #1a1a1a',
                    marginBottom: '16px',
                  }}>
                    <span style={{ color: '#666', fontSize: '0.72rem', letterSpacing: '0.12em' }}>TOTAL DEL PEDIDO</span>
                    <span style={{ color: '#fff', fontWeight: 800, fontSize: '1.15rem' }}>S/ {total.toFixed(2)}</span>
                  </div>

                  {/* CHECKOUT BTN */}
                  <Link to="/checkout" onClick={() => setCartOpen(false)} style={{
                    padding: '14px',
                    background: '#fff',
                    color: '#000',
                    fontSize: '0.75rem',
                    letterSpacing: '0.15em',
                    fontWeight: 800,
                    textAlign: 'center',
                    textDecoration: 'none',
                    borderRadius: '12px',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = '#e8e8e8'}
                    onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                  >
                    PROCEDER AL PAGO
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* MAIN */}
      <main style={{ flex: 1, padding: '32px 24px', width: '100%', minWidth: 0 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/producto/:id" element={<ProductDetail />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/confirmacion/:id" element={<Confirmacion />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>

      {/* FOOTER */}
      <footer style={{
        borderTop: '1px solid #141414',
        padding: '28px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#080808',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '26px', height: '26px', background: '#fff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#000', fontWeight: 900, fontSize: '0.55rem' }}>GZ</span>
          </div>
          <span style={{ color: '#333', fontSize: '0.7rem', letterSpacing: '0.1em', fontWeight: 700 }}>GAMERZONE</span>
        </div>
        <p style={{ color: '#2a2a2a', fontSize: '0.65rem', letterSpacing: '0.08em' }}>
          © 2025 GAMERZONE — TODOS LOS DERECHOS RESERVADOS
        </p>
        <div style={{ display: 'flex', gap: '20px' }}>
          {['INICIO', 'PRODUCTOS', 'CONTACTO'].map(l => (
            <span key={l} style={{ color: '#2a2a2a', fontSize: '0.65rem', letterSpacing: '0.1em', cursor: 'pointer', fontWeight: 600 }}>{l}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}

export default App;