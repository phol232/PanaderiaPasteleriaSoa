let carrito = [];
window.carrito = carrito;

function cargarCarrito() {
  const datos = localStorage.getItem('carrito');
  if (datos) {
    try {
      carrito = JSON.parse(datos);
      window.carrito = carrito;
    } catch {
      carrito = [];
      window.carrito = carrito;
    }
  }
}

function guardarCarrito() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

document.addEventListener('DOMContentLoaded', () => {
  cargarCarrito();
  const carritoBtn       = document.getElementById('carrito-btn');
  const carritoContainer = document.getElementById('carrito-container');
  const carritoOverlay   = document.getElementById('carrito-overlay');
  const cerrarCarritoBtn = document.getElementById('cerrar-carrito');
  const carritoProductos = document.getElementById('carrito-productos');
  const contadorCarrito  = document.getElementById('contador-carrito');
  const carritoTotal     = document.getElementById('carrito-total');

  document.addEventListener('logout', () => {
    carrito = [];
    window.carrito = carrito;
    localStorage.removeItem('carrito');
    actualizarCarrito();
  });

  carritoBtn.addEventListener('click', e => {
    e.preventDefault();
    carritoContainer.classList.add('active');
    carritoOverlay.classList.add('active');
  });

  cerrarCarritoBtn.addEventListener('click', () => {
    carritoContainer.classList.remove('active');
    carritoOverlay.classList.remove('active');
  });

  carritoOverlay.addEventListener('click', () => {
    carritoContainer.classList.remove('active');
    carritoOverlay.classList.remove('active');
  });

  document.addEventListener('productos-cargados', () => {
    document.querySelectorAll('.agregar-carrito').forEach(boton => {
      boton.addEventListener('click', agregarAlCarrito);
    });
  });

  function agregarAlCarrito(e) {
    const card     = e.target.closest('.card');
    const id       = card.dataset.id;
    const imagen   = card.querySelector('img').src;
    const nombre   = card.querySelector('h3').textContent;
    const precio   = parseFloat(card.querySelector('.precio').textContent.replace('S/', ''));
    const existente = carrito.find(item => item.id === id);

    if (existente) {
      existente.cantidad++;
    } else {
      carrito.push({ id, imagen, nombre, precio, cantidad: 1 });
    }

    window.carrito = carrito;
    guardarCarrito();
    actualizarCarrito();
    carritoContainer.classList.add('active');
    carritoOverlay.classList.add('active');
  }

  function actualizarCarrito() {
    carritoProductos.innerHTML = '';

    if (carrito.length === 0) {
      carritoProductos.innerHTML =
          '<div class="carrito-vacio">No hay productos en el carrito</div>';
      actualizarContadorYTotal();
      return;
    }

    carrito.forEach(producto => {
      const carritoItem = document.createElement('div');
      carritoItem.classList.add('carrito-item');
      carritoItem.dataset.id = producto.id;
      carritoItem.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <div class="carrito-item-info">
          <div class="carrito-item-nombre">${producto.nombre}</div>
          <div class="carrito-item-precio">S/${producto.precio.toFixed(2)}</div>
          <div class="carrito-item-cantidad">
            <button class="btn-restar">-</button>
            <span>${producto.cantidad}</span>
            <button class="btn-sumar">+</button>
          </div>
        </div>
        <button class="carrito-item-eliminar">
          <i class="fas fa-trash"></i>
        </button>
      `;
      carritoProductos.appendChild(carritoItem);

      carritoItem.querySelector('.btn-restar').addEventListener('click', () => {
        producto.cantidad--;
        if (producto.cantidad <= 0) {
          carrito = carrito.filter(item => item.id !== producto.id);
        }
        window.carrito = carrito;
        guardarCarrito();
        actualizarCarrito();
      });

      carritoItem.querySelector('.btn-sumar').addEventListener('click', () => {
        producto.cantidad++;
        window.carrito = carrito;
        guardarCarrito();
        actualizarCarrito();
      });

      carritoItem.querySelector('.carrito-item-eliminar').addEventListener('click', () => {
        carrito = carrito.filter(item => item.id !== producto.id);
        window.carrito = carrito;
        guardarCarrito();
        actualizarCarrito();
      });
    });

    actualizarContadorYTotal();
  }

  function actualizarContadorYTotal() {
    const cantidadTotal = carrito.reduce((sum, p) => sum + p.cantidad, 0);
    const precioTotal   = carrito.reduce((sum, p) => sum + p.precio * p.cantidad, 0);
    contadorCarrito.textContent = cantidadTotal;
    carritoTotal.textContent      = `S/${precioTotal.toFixed(2)}`;
  }
  actualizarCarrito();
});