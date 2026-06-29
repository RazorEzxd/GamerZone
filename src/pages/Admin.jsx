import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import { ADMIN_EMAIL } from '../config';

function Admin() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('pedidos');
  const [pedidos, setPedidos] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', category: '', price: '', stock: '', image_url: '', description: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session || session.user.email !== ADMIN_EMAIL) {
        navigate('/');
      }
    });
    loadPedidos();
    loadProducts();
  }, []);

  const loadPedidos = async () => {
    const { data } = await supabase.from('pedidos').select('*').order('fecha_creacion', { ascending: false });
    setPedidos(data || []);
    setLoading(false);
  };

  const loadProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('id');
    setProducts(data || []);
  };

  const updateEstado = async (id, estado) => {
    await supabase.from('pedidos').update({ estado }).eq('id', id);
    loadPedidos();
  };

  const handleFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSaveProduct = async () => {
    if (!form.name || !form.price || !form.stock) {
      alert('Nombre, precio y stock son obligatorios');
      return;
    }
    if (editingId) {
      await supabase.from('products').update({
        name: form.name,
        category: form.category,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        image_url: form.image_url,
        description: form.description,
      }).eq('id', editingId);
      setEditingId(null);
    } else {
      await supabase.from('products').insert({
        name: form.name,
        category: form.category,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        image_url: form.image_url,
        description: form.description,
      });
    }
    setForm({ name: '', category: '', price: '', stock: '', image_url: '', description: '' });
    loadProducts();
  };

  const handleEdit = (p) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      category: p.category || '',
      price: p.price,
      stock: p.stock,
      image_url: p.image_url || '',
      description: p.description || '',
    });
    setTab('productos');
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este producto?')) return;
    await supabase.from('products').delete().eq('id', id);
    loadProducts();
  };

  const estadoColors = {
    pendiente: '#444',
    pagado: '#1a3a1a',
    enviado: '#1a1a3a',
    entregado: '#2a2a00',
    cancelado: '#3a0000',
  };

  const inputStyle = {
    background: '#0f0f0f',
    border: '1px solid #1a1a1a',
    color: '#fff',
    padding: '10px 14px',
    fontSize: '0.78rem',
    fontFamily: 'Inter, sans-serif',
    outline: 'none',
    width: '100%',
  };

  const labelStyle = {
    color: '#444',
    fontSize: '0.62rem',
    letterSpacing: '0.12em',
    marginBottom: '4px',
    display: 'block',
  };

  if (loading) return <p style={{ color: '#333', fontSize: '0.8rem', letterSpacing: '0.15em' }}>CARGANDO...</p>;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <p style={{ color: '#333', fontSize: '0.68rem', letterSpacing: '0.2em', marginBottom: '32px' }}>
        PANEL ADMINISTRADOR
      </p>

      {/* TABS */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
        {['pedidos', 'productos'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '8px 20px',
              background: tab === t ? '#fff' : 'transparent',
              color: tab === t ? '#000' : '#555',
              border: tab === t ? '1px solid #fff' : '1px solid #222',
              fontSize: '0.68rem',
              letterSpacing: '0.1em',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* TAB PEDIDOS */}
      {tab === 'pedidos' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {pedidos.length === 0 ? (
            <p style={{ color: '#333', fontSize: '0.8rem' }}>No hay pedidos aún.</p>
          ) : pedidos.map(p => (
            <div key={p.id} style={{
              background: '#0f0f0f',
              border: '1px solid #1a1a1a',
              padding: '20px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr auto',
              gap: '16px',
              alignItems: 'center',
            }}>
              <div>
                <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.82rem', marginBottom: '4px' }}>{p.nombre}</p>
                <p style={{ color: '#444', fontSize: '0.7rem' }}>{p.email}</p>
                <p style={{ color: '#444', fontSize: '0.7rem' }}>{p.telefono} · DNI: {p.dni}</p>
                <p style={{ color: '#444', fontSize: '0.7rem', marginTop: '4px' }}>{p.direccion}</p>
              </div>
              <div>
                <p style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', marginBottom: '8px' }}>S/ {parseFloat(p.total).toFixed(2)}</p>
                <p style={{ color: '#555', fontSize: '0.65rem' }}>{new Date(p.fecha_creacion).toLocaleDateString('es-PE')}</p>
              </div>
              <select
                value={p.estado}
                onChange={e => updateEstado(p.id, e.target.value)}
                style={{
                  background: estadoColors[p.estado] || '#1a1a1a',
                  border: '1px solid #222',
                  color: '#fff',
                  padding: '8px 12px',
                  fontSize: '0.68rem',
                  letterSpacing: '0.1em',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                <option value="pendiente">PENDIENTE</option>
                <option value="pagado">PAGADO</option>
                <option value="enviado">ENVIADO</option>
                <option value="entregado">ENTREGADO</option>
                <option value="cancelado">CANCELADO</option>
              </select>
            </div>
          ))}
        </div>
      )}

      {/* TAB PRODUCTOS */}
      {tab === 'productos' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>

          {/* FORMULARIO */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <p style={{ color: '#444', fontSize: '0.68rem', letterSpacing: '0.15em', marginBottom: '4px' }}>
              {editingId ? 'EDITAR PRODUCTO' : 'NUEVO PRODUCTO'}
            </p>

            {[
              { name: 'name', label: 'NOMBRE *' },
              { name: 'category', label: 'CATEGORÍA' },
              { name: 'price', label: 'PRECIO *' },
              { name: 'stock', label: 'STOCK *' },
              { name: 'image_url', label: 'URL IMAGEN' },
            ].map(f => (
              <div key={f.name}>
                <label style={labelStyle}>{f.label}</label>
                <input name={f.name} value={form[f.name]} onChange={handleFormChange} style={inputStyle} />
              </div>
            ))}

            <div>
              <label style={labelStyle}>DESCRIPCIÓN</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleFormChange}
                rows={3}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleSaveProduct}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#fff',
                  color: '#000',
                  border: 'none',
                  fontSize: '0.72rem',
                  letterSpacing: '0.15em',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {editingId ? 'GUARDAR CAMBIOS' : 'AGREGAR PRODUCTO'}
              </button>
              {editingId && (
                <button
                  onClick={() => { setEditingId(null); setForm({ name: '', category: '', price: '', stock: '', image_url: '', description: '' }); }}
                  style={{
                    padding: '12px 16px',
                    background: 'transparent',
                    color: '#444',
                    border: '1px solid #222',
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                  }}
                >
                  CANCELAR
                </button>
              )}
            </div>
          </div>

          {/* LISTA PRODUCTOS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '600px', overflowY: 'auto' }}>
            <p style={{ color: '#444', fontSize: '0.68rem', letterSpacing: '0.15em', marginBottom: '4px' }}>
              PRODUCTOS ({products.length})
            </p>
            {products.map(p => (
              <div key={p.id} style={{
                background: '#0f0f0f',
                border: '1px solid #1a1a1a',
                padding: '12px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '12px',
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: '#fff', fontSize: '0.75rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</p>
                  <p style={{ color: '#444', fontSize: '0.65rem' }}>S/ {p.price} · Stock: {p.stock}</p>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                  <button
                    onClick={() => handleEdit(p)}
                    style={{
                      background: 'transparent',
                      border: '1px solid #222',
                      color: '#aaa',
                      padding: '5px 10px',
                      fontSize: '0.65rem',
                      cursor: 'pointer',
                      letterSpacing: '0.08em',
                    }}
                  >EDITAR</button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    style={{
                      background: 'transparent',
                      border: '1px solid #3a0000',
                      color: '#ff4444',
                      padding: '5px 10px',
                      fontSize: '0.65rem',
                      cursor: 'pointer',
                      letterSpacing: '0.08em',
                    }}
                  >ELIMINAR</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;