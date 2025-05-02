// public/js/orders.js

document.addEventListener('DOMContentLoaded', () => {
  const ordersModal    = document.getElementById('orders');
  const closeOrders    = document.getElementById('close-orders');
  const ordersList     = document.querySelector('.orders-container');
  const btnProceed     = document.getElementById('btn-proceed-payment');
  const subtotalEl     = document.getElementById('orders-subtotal');
  const igvEl          = document.getElementById('orders-igv');
  const totalEl        = document.getElementById('orders-total');

  // Cuando el usuario se loguea y dispara login-success
  document.addEventListener('login-success', () => {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    ordersList.innerHTML = '';

    let subtotal = 0;
    carrito.forEach(item => {
      const itemSub = item.precio * item.cantidad;
      subtotal += itemSub;

      const div = document.createElement('div');
      div.className = 'order-item';
      div.innerHTML = `
        <span>
          <span class="item-name">${item.nombre}</span>
          x <span class="item-quantity">${item.cantidad}</span>
        </span>
        <span>S/${itemSub.toFixed(2)}</span>
      `;
      ordersList.appendChild(div);
    });

    const igv   = subtotal * 0.18;
    const total = subtotal + igv;

    subtotalEl.textContent = subtotal.toFixed(2);
    igvEl.textContent      = igv.toFixed(2);
    totalEl.textContent    = total.toFixed(2);

    ordersModal.classList.add('active');
  });

  // Cerrar modal sin pagar
  closeOrders?.addEventListener('click', () => {
    if (confirm('¿Deseas salir sin continuar con tu compra?')) {
      ordersModal.classList.remove('active');
    }
  });

  ordersModal.addEventListener('click', e => {
    if (e.target === ordersModal && confirm('¿Salir sin comprar?')) {
      ordersModal.classList.remove('active');
    }
  });

  // Confirmar pago ➞ envía al backend
  btnProceed?.addEventListener('click', async () => {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    if (carrito.length === 0) {
      return alert('Tu carrito está vacío.');
    }

    // Calcula totales
    const subtotal = carrito.reduce((sum, i) => sum + i.precio * i.cantidad, 0);
    const igv      = subtotal * 0.18;
    const total    = subtotal + igv;
    const tipo_pago = document.querySelector('input[name="paymentMethod"]:checked')?.value || 'efectivo';

    try {
      // Valida token y obtiene cliente_id
      const token = localStorage.getItem('token');
      if (!token) return alert('Debes iniciar sesión para completar la compra.');

      const meRes = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!meRes.ok) return alert('Tu sesión ha expirado, vuelve a iniciar sesión.');

      const { id: cliente_id } = await meRes.json();

      // Envía venta al backend
      const res = await fetch('/api/ventas/registrar', {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          Authorization:   `Bearer ${token}`
        },
        body: JSON.stringify({
          cliente_id,
          total,
          tipo_pago,
          numero_comprobante: 'N/A',
          igv,
          descuento: 0,
          estado: 'completado',
          observaciones: '',
          empleado_id: 1,
          forma_entrega: 'recojo',
          carrito
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Error desconocido al registrar la venta');
      }

      alert('¡Pago confirmado y venta registrada con éxito!');
      localStorage.removeItem('carrito');
      location.reload();

    } catch (err) {
      console.error('Error en /api/ventas/registrar:', err);
      alert(`No se pudo procesar la venta: ${err.message}`);
    }
  });
});
