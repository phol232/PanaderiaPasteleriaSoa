// public/js/orders.js
document.addEventListener('DOMContentLoaded', () => {
  const ordersModal  = document.getElementById('orders');
  const paymentModal = document.getElementById('payment');
  const closeOrders  = document.getElementById('close-orders');

  document.addEventListener('login-success', () => {
    const carrito = window.carrito || [];
    const listEl  = document.getElementById('orders-list');
    listEl.innerHTML = '';

    let subtotal = 0;
    carrito.forEach(item => {
      const itemSub = item.precio * item.cantidad;
      subtotal += itemSub;
      const div = document.createElement('div');
      div.className = 'order-item';
      div.innerHTML = `<span>${item.nombre} x ${item.cantidad}</span>
                       <span>S/${itemSub.toFixed(2)}</span>`;
      listEl.appendChild(div);
    });

    const igv   = subtotal * 0.18;
    const total = subtotal + igv;
    document.getElementById('orders-subtotal').textContent = subtotal.toFixed(2);
    document.getElementById('orders-igv').textContent      = igv.toFixed(2);
    document.getElementById('orders-total').textContent    = total.toFixed(2);

    ordersModal.classList.add('active');
  });

  closeOrders.addEventListener('click', () => {
    if (confirm('¿Deseas salir sin continuar con tu compra?')) {
      ordersModal.classList.remove('active');
    }
  });
  ordersModal.addEventListener('click', e => {
    if (e.target === ordersModal && confirm('¿Salir sin comprar?')) {
      ordersModal.classList.remove('active');
    }
  });
  document.getElementById('btn-proceed-payment')
    .addEventListener('click', () => {
      ordersModal.classList.remove('active');
      paymentModal.classList.add('active');
    });
  paymentModal.addEventListener('click', e => {
    if (e.target === paymentModal) paymentModal.classList.remove('active');
  });
  document.getElementById('form-payment')
    .addEventListener('submit', e => {
      e.preventDefault();
      const method = document.querySelector('input[name="paymentMethod"]:checked').value;
      alert(`Método de pago: ${method}`);
      paymentModal.classList.remove('active');
    });
});
