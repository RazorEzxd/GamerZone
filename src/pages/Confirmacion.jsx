import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabase';

function Confirmacion() {
  const { id } = useParams();
  const [pedido, setPedido] = useState(null);
  const [detalles, setDetalles] = useState([]);

  useEffect(() => {
    supabase.from('pedidos').select('*').eq('id', id).single()
      .then(({ data }) => setPedido(data));

    supabase.from('detalle_pedido').select('*').eq('pedido_id', id)
      .then(({ data }) => setDetalles(data || []));
  }, [id]);

  if (!pedido) return (
    <p style={{ color: '#333', fontSize: '0.8rem', letterSpacing: '0.15em' }}>CARGANDO...</p>
  );

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '40px' }}>
        <p style={{ color: '#2a2a2a', fontSize: '0.68rem', letterSpacing: '0.2em', marginBottom: '12px' }}>
          PEDIDO CONFIRMADO
        </p>
        <h1 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px' }}>
          ¡Gracias, {pedido.nombre.split(' ')[0]}!
        </h1>
        <p style={{ color: '#444', fontSize: '0.8rem' }}>
          Te contactaremos a <span style={{ color: '#fff' }}>{pedido.email}</span> para coordinar la entrega.
        </p>
      </div>

      <div style={{
        background: '#0f0f0f',
        border: '1px solid #1a1a1a',
        padding: '24px',
        marginBottom: '24px',
      }}>
        <p style={{ color: '#333', fontSize: '0.65rem', letterSpacing: '0.2em', marginBottom: '20px' }}>
          DETALLE DEL PEDIDO
        </p>

        {detalles.map(d => (
          <div key={d.id} style={{
            display: 'flex',
            justifyContent: 'space-between',
            paddingBottom: '12px',
            marginBottom: '12px',
            borderBottom: '1px solid #1a1a1a',
          }}>
            <div>
              <p style={{ color: '#fff', fontSize: '0.78rem', fontWeight: 600 }}>{d.nombre_producto}</p>
              <p style={{ color: '#444', fontSize: '0.68rem' }}>x{d.cantidad}</p>
            </div>
            <p style={{ color: '#fff', fontSize: '0.78rem', fontWeight: 700 }}>
              S/ {(parseFloat(d.precio_unitario) * d.cantidad).toFixed(2)}
            </p>
          </div>
        ))}

        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '4px' }}>
          <span style={{ color: '#555', fontSize: '0.72rem', letterSpacing: '0.1em' }}>TOTAL PAGADO</span>
          <span style={{ color: '#fff', fontWeight: 800, fontSize: '1.1rem' }}>S/ {parseFloat(pedido.total).toFixed(2)}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <Link to="/" style={{
          padding: '12px 24px',
          background: '#fff',
          color: '#000',
          fontSize: '0.72rem',
          letterSpacing: '0.15em',
          fontWeight: 700,
        }}>
          SEGUIR COMPRANDO
        </Link>
      </div>
    </div>
  );
}

export default Confirmacion;