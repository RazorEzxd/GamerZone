import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../CartContext';
import { supabase } from '../supabase';

function Checkout() {
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
    dni: '',
    direccion: '',
    referencia: '',
  });

  const grouped = cart.reduce((acc, item) => {
    acc[item.id] = acc[item.id] || { ...item, qty: 0 };
    acc[item.id].qty += 1;
    return acc;
  }, {});
  const items = Object.values(grouped);
  const total = items.reduce((acc, item) => acc + parseFloat(item.price) * item.qty, 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'telefono' && (!/^\d*$/.test(value) || value.length > 9)) return;
    if (name === 'dni' && (!/^\d*$/.test(value) || value.length > 8)) return;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    const { nombre, apellidos, email, telefono, dni, direccion } = form;
    if (!nombre || !apellidos || !email || !telefono || !dni || !direccion) {
      alert('Completa todos los campos obligatorios');
      return;
    }
    if (telefono.length !== 9) { alert('El teléfono debe tener 9 dígitos'); return; }
    if (dni.length !== 8) { alert('El DNI debe tener 8 dígitos'); return; }
    if (items.length === 0) { alert('Tu carrito está vacío'); return; }

    setLoading(true);

    const { data: pedido, error } = await supabase
      .from('pedidos')
      .insert({
        nombre: `${nombre} ${apellidos}`,
        email,
        telefono: form.telefono,
        dni: form.dni,
        direccion: `${direccion}${form.referencia ? ' — Ref: ' + form.referencia : ''}`,
        total,
      })
      .select()
      .single();

    if (error) { alert('Error al crear el pedido'); setLoading(false); return; }

    const detalles = items.map(item => ({
      pedido_id: pedido.id,
      producto_id: item.id,
      nombre_producto: item.name,
      cantidad: item.qty,
      precio_unitario: parseFloat(item.price),
    }));

    await supabase.from('detalle_pedido').insert(detalles);
    clearCart();
    navigate(`/confirmacion/${pedido.id}`);
  };

  const inputStyle = {
    background: '#111',
    border: '1px solid #252525',
    color: '#fff',
    padding: '13px 16px',
    fontSize: '0.85rem',
    fontFamily: 'Inter, sans-serif',
    outline: 'none',
    width: '100%',
    borderRadius: '12px',
    transition: 'border-color 0.15s, background 0.15s',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    color: '#555',
    fontSize: '0.65rem',
    letterSpacing: '0.12em',
    marginBottom: '8px',
    display: 'block',
    fontWeight: 700,
  };

  const fieldFocus = (e) => { e.currentTarget.style.borderColor = '#444'; e.currentTarget.style.background = '#141414'; };
  const fieldBlur = (e) => { e.currentTarget.style.borderColor = '#252525'; e.currentTarget.style.background = '#111'; };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>

      {/* TÍTULO */}
      <div style={{ marginBottom: '36px' }}>
        <p style={{ color: '#555', fontSize: '0.7rem', letterSpacing: '0.22em', fontWeight: 700, marginBottom: '8px' }}>
          GAMERZONE
        </p>
        <h1 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 800 }}>Checkout</h1>
        <p style={{ color: '#444', fontSize: '0.82rem', marginTop: '8px' }}>Completa tus datos para finalizar el pedido</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>

        {/* FORMULARIO */}
        <div style={{
          background: '#0e0e0e',
          border: '1px solid #1a1a1a',
          borderRadius: '20px',
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}>
          <p style={{ color: '#888', fontSize: '0.72rem', letterSpacing: '0.15em', fontWeight: 700, marginBottom: '4px' }}>
            DATOS DE ENTREGA
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>NOMBRE *</label>
              <input name="nombre" placeholder="Alexis" value={form.nombre} onChange={handleChange} style={inputStyle} onFocus={fieldFocus} onBlur={fieldBlur} />
            </div>
            <div>
              <label style={labelStyle}>APELLIDOS *</label>
              <input name="apellidos" placeholder="Huerta" value={form.apellidos} onChange={handleChange} style={inputStyle} onFocus={fieldFocus} onBlur={fieldBlur} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>DNI * (8 dígitos)</label>
              <input name="dni" placeholder="12345678" value={form.dni} onChange={handleChange} style={inputStyle} onFocus={fieldFocus} onBlur={fieldBlur} />
            </div>
            <div>
              <label style={labelStyle}>TELÉFONO * (9 dígitos)</label>
              <input name="telefono" placeholder="987654321" value={form.telefono} onChange={handleChange} style={inputStyle} onFocus={fieldFocus} onBlur={fieldBlur} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>CORREO ELECTRÓNICO *</label>
            <input name="email" type="email" placeholder="correo@ejemplo.com" value={form.email} onChange={handleChange} style={inputStyle} onFocus={fieldFocus} onBlur={fieldBlur} />
          </div>

          <div>
            <label style={labelStyle}>DIRECCIÓN *</label>
            <input name="direccion" placeholder="Av. ejemplo 123, Lima" value={form.direccion} onChange={handleChange} style={inputStyle} onFocus={fieldFocus} onBlur={fieldBlur} />
          </div>

          <div>
            <label style={labelStyle}>REFERENCIA <span style={{ color: '#333', fontWeight: 400 }}>(opcional)</span></label>
            <input name="referencia" placeholder="Cerca al parque, piso 2..." value={form.referencia} onChange={handleChange} style={inputStyle} onFocus={fieldFocus} onBlur={fieldBlur} />
          </div>
        </div>

        {/* RESUMEN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            background: '#0e0e0e',
            border: '1px solid #1a1a1a',
            borderRadius: '20px',
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}>
            <p style={{ color: '#888', fontSize: '0.72rem', letterSpacing: '0.15em', fontWeight: 700, marginBottom: '4px' }}>
              RESUMEN DEL PEDIDO
            </p>

            {items.length === 0 ? (
              <p style={{ color: '#333', fontSize: '0.82rem', textAlign: 'center', padding: '20px 0' }}>
                Tu carrito está vacío
              </p>
            ) : (
              <>
                {items.map(item => (
                  <div key={item.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    paddingBottom: '14px',
                    borderBottom: '1px solid #1a1a1a',
                    gap: '12px',
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        color: '#ddd',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        marginBottom: '4px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}>{item.name}</p>
                      <p style={{ color: '#555', fontSize: '0.72rem' }}>Cantidad: {item.qty}</p>
                    </div>
                    <p style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 700, flexShrink: 0 }}>
                      S/ {(parseFloat(item.price) * item.qty).toFixed(2)}
                    </p>
                  </div>
                ))}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px' }}>
                  <span style={{ color: '#666', fontSize: '0.78rem', letterSpacing: '0.1em' }}>TOTAL</span>
                  <span style={{ color: '#fff', fontWeight: 800, fontSize: '1.3rem' }}>S/ {total.toFixed(2)}</span>
                </div>
              </>
            )}
          </div>

          {/* BOTÓN CONFIRMAR */}
          <button
            onClick={handleSubmit}
            disabled={loading || items.length === 0}
            style={{
              padding: '18px',
              background: loading || items.length === 0 ? '#111' : '#fff',
              color: loading || items.length === 0 ? '#333' : '#000',
              border: loading || items.length === 0 ? '1px solid #222' : 'none',
              borderRadius: '14px',
              fontSize: '0.82rem',
              letterSpacing: '0.15em',
              fontWeight: 800,
              transition: 'all 0.2s',
              cursor: loading || items.length === 0 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              fontFamily: 'Inter, sans-serif',
            }}
            onMouseEnter={e => { if (!loading && items.length > 0) e.currentTarget.style.background = '#e8e8e8'; }}
            onMouseLeave={e => { if (!loading && items.length > 0) e.currentTarget.style.background = '#fff'; }}
          >
            {loading ? (
              <>
                <div style={{ width: '14px', height: '14px', border: '2px solid #333', borderTopColor: '#888', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                PROCESANDO...
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                CONFIRMAR PEDIDO
              </>
            )}
          </button>

          {/* SEGURIDAD */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px',
            background: '#0a0a0a',
            border: '1px solid #141414',
            borderRadius: '12px',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <span style={{ color: '#333', fontSize: '0.68rem', letterSpacing: '0.1em' }}>PAGO SEGURO Y ENCRIPTADO</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;