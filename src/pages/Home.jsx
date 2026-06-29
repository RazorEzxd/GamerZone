import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Link } from 'react-router-dom';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('TODOS');
  const [search, setSearch] = useState('');

  useEffect(() => {
    supabase.from('products').select('*')
      .then(({ data, error }) => {
        if (!error && data) setProducts(data);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '60px 0' }}>
      <div style={{ width: '18px', height: '18px', border: '2px solid #222', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: '#555', fontSize: '0.82rem', letterSpacing: '0.15em' }}>CARGANDO PRODUCTOS...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const categories = ['TODOS', ...new Set(products.map(p => p.category).filter(Boolean))];
  const filtered = products
    .filter(p => activeCategory === 'TODOS' || p.category === activeCategory)
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      {/* HERO STRIP */}
      <div style={{
        background: 'linear-gradient(135deg, #111 0%, #131313 50%, #0d0d0d 100%)',
        border: '1px solid #1e1e1e',
        borderRadius: '20px',
        padding: '44px 48px',
        marginBottom: '36px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative',
      }}>
        <div style={{ position: 'absolute', right: '-40px', top: '-40px', width: '280px', height: '280px', background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div>
          <p style={{ color: '#555', fontSize: '0.7rem', letterSpacing: '0.28em', fontWeight: 700, marginBottom: '12px' }}>BIENVENIDO A GAMERZONE</p>
          <h1 style={{ color: '#fff', fontSize: '2rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '12px', letterSpacing: '-0.02em' }}>
            Equipos para<br />
            <span style={{ color: '#444' }}>jugadores serios</span>
          </h1>
          <p style={{ color: '#333', fontSize: '0.78rem', letterSpacing: '0.05em' }}>
            {products.length} productos disponibles
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            {['🖱️ Mouse', '⌨️ Teclado', '🖥️ Monitor'].map(tag => (
              <span key={tag} style={{
                background: '#161616',
                border: '1px solid #222',
                color: '#555',
                fontSize: '0.68rem',
                padding: '6px 14px',
                borderRadius: '20px',
                fontWeight: 600,
                letterSpacing: '0.05em',
              }}>{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* TOOLBAR: Filtros + Buscador */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '16px', flexWrap: 'wrap' }}>
        {/* FILTROS */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '8px 18px',
                background: activeCategory === cat ? '#fff' : '#111',
                color: activeCategory === cat ? '#000' : '#666',
                border: '1px solid',
                borderColor: activeCategory === cat ? '#fff' : '#222',
                fontSize: '0.7rem',
                letterSpacing: '0.1em',
                fontWeight: 700,
                transition: 'all 0.15s',
                cursor: 'pointer',
                borderRadius: '10px',
              }}
              onMouseEnter={e => { if (activeCategory !== cat) { e.currentTarget.style.borderColor = '#444'; e.currentTarget.style.color = '#aaa'; e.currentTarget.style.background = '#181818'; } }}
              onMouseLeave={e => { if (activeCategory !== cat) { e.currentTarget.style.borderColor = '#222'; e.currentTarget.style.color = '#666'; e.currentTarget.style.background = '#111'; } }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* BUSCADOR */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <svg style={{ position: 'absolute', left: '14px', color: '#555', pointerEvents: 'none' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar producto..."
            style={{
              background: '#111',
              border: '1px solid #222',
              color: '#ddd',
              padding: '9px 16px 9px 36px',
              fontSize: '0.78rem',
              fontFamily: 'Inter, sans-serif',
              outline: 'none',
              borderRadius: '10px',
              width: '220px',
              transition: 'border-color 0.15s',
            }}
            onFocus={e => { e.currentTarget.style.borderColor = '#444'; e.currentTarget.style.background = '#141414'; }}
            onBlur={e => { e.currentTarget.style.borderColor = '#222'; e.currentTarget.style.background = '#111'; }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{
              position: 'absolute', right: '10px',
              background: 'transparent', border: 'none',
              color: '#555', cursor: 'pointer', fontSize: '1rem',
              display: 'flex', alignItems: 'center',
            }}>×</button>
          )}
        </div>
      </div>

      {/* CONTADOR */}
      <p style={{ color: '#333', fontSize: '0.68rem', letterSpacing: '0.18em', fontWeight: 600, marginBottom: '16px' }}>
        {activeCategory === 'TODOS' ? 'TODOS LOS PRODUCTOS' : activeCategory.toUpperCase()} — {filtered.length} RESULTADOS
      </p>

      {/* GRID */}
      {filtered.length === 0 ? (
        <div style={{ padding: '80px 0', textAlign: 'center' }}>
          <p style={{ color: '#333', fontSize: '0.9rem', marginBottom: '10px' }}>No se encontraron productos</p>
          <p style={{ color: '#222', fontSize: '0.78rem' }}>Intenta con otra búsqueda o categoría</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px',
        }}>
          {filtered.map(p => (
            <Link to={`/producto/${p.id}`} key={p.id} style={{ textDecoration: 'none' }}>
              <div style={{
                background: '#0e0e0e',
                border: '1px solid #1a1a1a',
                borderRadius: '16px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s',
                height: '100%',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#333';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.7)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#1a1a1a';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* IMAGEN */}
                <div style={{
                  background: '#111',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '175px',
                  overflow: 'hidden',
                  position: 'relative',
                  borderRadius: '14px 14px 0 0',
                }}>
                  {p.stock === 0 && (
                    <div style={{
                      position: 'absolute', top: '10px', left: '10px',
                      background: '#1a0000',
                      border: '1px solid #3a0000',
                      color: '#ff4444',
                      fontSize: '0.6rem',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      padding: '4px 10px',
                      borderRadius: '8px',
                    }}>AGOTADO</div>
                  )}
                  {p.stock > 0 && p.stock <= 3 && (
                    <div style={{
                      position: 'absolute', top: '10px', left: '10px',
                      background: '#1a1000',
                      border: '1px solid #3a2a00',
                      color: '#ffaa00',
                      fontSize: '0.6rem',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      padding: '4px 10px',
                      borderRadius: '8px',
                    }}>ÚLTIMAS UNIDADES</div>
                  )}
                  <img
                    src={p.image_url}
                    alt={p.name}
                    style={{ maxHeight: '150px', maxWidth: '90%', objectFit: 'contain', transition: 'transform 0.3s' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.07)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  />
                </div>

                {/* INFO */}
                <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                  <div>
                    <span style={{
                      color: '#444',
                      fontSize: '0.6rem',
                      fontWeight: 700,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                    }}>{p.category || ''}</span>
                    <p style={{
                      color: '#ccc',
                      fontWeight: 600,
                      fontSize: '0.82rem',
                      lineHeight: 1.4,
                      marginTop: '5px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>{p.name}</p>
                  </div>

                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#fff', fontWeight: 800, fontSize: '1rem' }}>S/ {p.price}</span>
                    <span style={{
                      background: p.stock === 0 ? '#1a1a1a' : '#fff',
                      color: p.stock === 0 ? '#333' : '#000',
                      fontSize: '0.62rem',
                      fontWeight: 700,
                      padding: '5px 12px',
                      borderRadius: '8px',
                      letterSpacing: '0.08em',
                      border: p.stock === 0 ? '1px solid #222' : 'none',
                    }}>{p.stock === 0 ? 'AGOTADO' : 'VER →'}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;