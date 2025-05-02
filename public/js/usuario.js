// public/js/usuario.js
document.addEventListener('DOMContentLoaded', () => {
  const userMenu     = document.getElementById('user-menu');
  const userNameSpan = document.getElementById('user-name');
  const userDropdown = document.getElementById('user-dropdown');
  const logoutBtn    = document.getElementById('logout-btn');
  const authModal    = document.getElementById('auth');
  function cerrarSesion() {
    localStorage.removeItem('token');
    window.carrito = [];
    document.dispatchEvent(new Event('logout'));
    userDropdown.classList.remove('active');
    userMenu.classList.remove('active');
  }
  async function initUsuario() {
    const token = localStorage.getItem('token');
    if (!token) {
      userMenu.classList.remove('active');
      return;
    }
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('No autorizado');
      const { usuario } = await res.json();
      userNameSpan.textContent = usuario;
      userMenu.classList.add('active');
    } catch {
      cerrarSesion();
    }
  }
  userMenu.addEventListener('click', e => {
    if (e.target === logoutBtn) return;
    userDropdown.classList.toggle('active');
  });
  logoutBtn.addEventListener('click', cerrarSesion);
  initUsuario();
  document.addEventListener('login-success', initUsuario);
});
