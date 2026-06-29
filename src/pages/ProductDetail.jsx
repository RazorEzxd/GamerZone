import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { CartContext } from '../CartContext';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    supabase.from('products').select('*').eq('id', id).single()
      .then(({ data }) => setProduct(data));
  }, [id]);

  if (!product) return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '60px 0' }}>
      <div style={{ width: '18px', height: '18px', border: '2px solid #222', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: '#555', fontSize: '0.82rem', letterSpacing: '0.15em' }}>CARGANDO PRODUCTO...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const stockColor = product.stock === 0 ? '#ff4444' : product.stock <= 3 ? '#ffaa00' : '#44cc88';
  const stockBg = product.stock === 0 ? '#1a0000' : product.stock <= 3 ? '#1a1000' : '#001a0d';
  const stockBorder = product.stock === 0 ? '#3a0000' : product.stock <= 3 ? '#3a2a00' : '#003a1a';
  const stockText = product.stock === 0 ? 'AGOTADO' : `${product.stock} EN STOCK`;

  return (
    <div style={{ maxWidth: '1040px', margin: '0 auto', padding: '0 24px' }}>

      {/* VOLVER */}
      <button
        onClick={() => navigate(-1)}
        style={{
          background: '#111',
          border: '1px solid #222',
          color: '#888',
          fontSize: '0.78rem',
          letterSpacing: '0.1em',
          padding: '9px 18px',
          marginBottom: '40px',
          fontWeight: 600,
          cursor: 'pointer',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.15s',
          fontFamily: 'Inter, sans-serif',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#444'; e.currentTarget.style.color = '#ccc'; e.currentTarget.style.background = '#1a1a1a'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#222'; e.currentTarget.style.color = '#888'; e.currentTarget.style.background = '#111'; }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        VOLVER
      </button>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '64px',
        alignItems: 'center',
      }}>
        {/* IMAGEN */}
        <div style={{
          background: '#0f0f0f',
          border: '1px solid #1e1e1e',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          aspectRatio: '1',
          padding: '48px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {product.stock === 0 && (
            <div style={{
              position: 'absolute', top: '14px', left: '14px',
              background: '#1a0000',
              border: '1px solid #3a0000',
              color: '#ff4444',
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              padding: '5px 12px',
              borderRadius: '8px',
            }}>AGOTADO</div>
          )}
          <img
            src={product.image_url}
            alt={product.name}
            style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
          />
        </div>

        {/* INFO */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

          {/* CATEGORÍA + NOMBRE */}
          <div>
            <span style={{
              display: 'inline-block',
              color: '#555',
              background: '#111',
              border: '1px solid #222',
              fontSize: '0.65rem',
              letterSpacing: '0.2em',
              marginBottom: '16px',
              fontWeight: 700,
              padding: '5px 14px',
              borderRadius: '8px',
            }}>
              {product.category?.toUpperCase() || 'GAMERZONE'}
            </span>
            <h1 style={{ color: '#fff', fontSize: '1.75rem', fontWeight: 700, lineHeight: 1.25 }}>
              {product.name}
            </h1>
          </div>

          {/* DESCRIPCIÓN */}
          {product.description && (
            <div style={{
              background: '#0e0e0e',
              border: '1px solid #1a1a1a',
              borderRadius: '14px',
              padding: '18px 20px',
            }}>
              <p style={{ color: '#666', fontSize: '0.85rem', lineHeight: 1.85 }}>
                {product.description}
              </p>
            </div>
          )}

          {/* PRECIO + STOCK */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <p style={{ color: '#fff', fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              S/ {product.price}
            </p>
            <span style={{
              color: stockColor,
              background: stockBg,
              border: `1px solid ${stockBorder}`,
              fontSize: '0.68rem',
              fontWeight: 700,
              padding: '6px 14px',
              letterSpacing: '0.1em',
              borderRadius: '10px',
            }}>
              {stockText}
            </span>
          </div>

          {/* BOTÓN AGREGAR */}
          <button
            onClick={handleAdd}
            disabled={product.stock === 0}
            style={{
              padding: '18px 36px',
              background: added ? '#111' : product.stock === 0 ? '#111' : '#fff',
              color: added ? '#44cc88' : product.stock === 0 ? '#333' : '#000',
              border: added ? '1px solid #1a3a2a' : product.stock === 0 ? '1px solid #222' : 'none',
              borderRadius: '14px',
              fontSize: '0.82rem',
              letterSpacing: '0.15em',
              fontWeight: 700,
              transition: 'all 0.2s',
              cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
              alignSelf: 'flex-start',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontFamily: 'Inter, sans-serif',
            }}
            onMouseEnter={e => { if (!added && product.stock > 0) e.currentTarget.style.background = '#e8e8e8'; }}
            onMouseLeave={e => { if (!added && product.stock > 0) e.currentTarget.style.background = '#fff'; }}
          >
            {added ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#44cc88" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                AGREGADO AL CARRITO
              </>
            ) : product.stock === 0 ? 'SIN STOCK' : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                AGREGAR AL CARRITO
              </>
            )}
          </button>

          {/* INFO EXTRA */}
          <div style={{
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap',
          }}>
            {[
              { icon: '🚚', text: 'Envío a todo el Perú' },
              { icon: '🔒', text: 'Pago seguro' },
              { icon: '📦', text: 'Garantía incluida' },
            ].map(item => (
              <div key={item.text} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#0e0e0e',
                border: '1px solid #1a1a1a',
                borderRadius: '10px',
                padding: '8px 14px',
              }}>
                <span style={{ fontSize: '0.85rem' }}>{item.icon}</span>
                <span style={{ color: '#555', fontSize: '0.7rem', fontWeight: 600 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;