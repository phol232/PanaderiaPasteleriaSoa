// public/productos.js
document.addEventListener('DOMContentLoaded', async () => {
  const grid = document.querySelector('.grid-productos');

  try {
    const res = await fetch('/api/productos');
    const productos = await res.json();

    grid.innerHTML = '';

    productos.forEach(p => {
      const precioNum = typeof p.precio === 'string'
        ? parseFloat(p.precio)
        : p.precio;
      const imgSrc = p.imagen || 'img/pan.png';

      const card = document.createElement('div');
      card.className = 'card';
      card.dataset.id = p.id;
      card.innerHTML = `
        <img src="${imgSrc}" alt="${p.nombre}">
        <h3>${p.nombre}</h3>
        <p class="precio">S/${precioNum.toFixed(2)}</p>
        <button class="agregar-carrito">Agregar</button>
      `;
      grid.appendChild(card);
    });
    document.dispatchEvent(new Event('productos-cargados'));

  } catch (err) {
    console.error('Error cargando productos:', err);
    grid.innerHTML = '<p>Error al cargar productos.</p>';
  }
});
