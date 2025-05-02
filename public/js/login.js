async function validarTokenAlInicio() {
  const token    = localStorage.getItem('token');
  const userMenu = document.getElementById('user-menu');
  const userName = document.getElementById('user-name');

  if (!token) {
    userMenu.classList.remove('active');
    return;
  }

  try {
    const res = await fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error();

    const { usuario } = await res.json();
    userName.textContent = usuario;
    userMenu.classList.add('active');

  } catch {
    localStorage.removeItem('token');
    document.dispatchEvent(new Event('logout'));
    userMenu.classList.remove('active');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const authModal = document.getElementById('auth');
  const tabLogin  = document.getElementById('tab-login');
  const loginForm = document.getElementById('form-login');
  const btnPagar  = document.getElementById('btn-pagar');
  const logoutBtn = document.getElementById('logout-btn');
  const userMenu  = document.getElementById('user-menu');

  validarTokenAlInicio();
  btnPagar.addEventListener('click', e => {
    e.preventDefault();
    if (!localStorage.getItem('token')) {
      tabLogin.checked = true;
      authModal.classList.add('active');
    } else {
      document.dispatchEvent(new Event('login-success'));
    }
  });
  authModal.addEventListener('click', e => {
    if (e.target === authModal) authModal.classList.remove('active');
  });
  loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    const usuario = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;

    try {
      const res  = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, password })
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Credenciales incorrectas');
        return;
      }

      localStorage.setItem('token', data.token);
      authModal.classList.remove('active');
      document.dispatchEvent(new Event('login-success'));

    } catch {
      alert('Servidor no disponible');
    }
  });
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    document.dispatchEvent(new Event('logout'));
    userMenu.classList.remove('active');

  });
});
