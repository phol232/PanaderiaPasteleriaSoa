document.addEventListener('DOMContentLoaded', () => {
    const authModal    = document.getElementById('auth');
    const registerForm = document.getElementById('form-register');
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nombre   = document.getElementById('reg-firstname').value.trim();
      const apellido = document.getElementById('reg-lastname').value.trim();
      const usuario  = document.getElementById('reg-username').value.trim();
      const password = document.getElementById('reg-password').value;
      const confirm  = document.getElementById('reg-confirm').value;
      if (!nombre || !apellido || !usuario || !password || !confirm) {
        alert('Por favor completa todos los campos');
        return;
      }
      if (password !== confirm) {
        alert('Las contraseñas no coinciden');
        return;
      }
  
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre, apellido, usuario, password })
        });
        const data = await res.json();
  
        if (!res.ok) {
          alert(data.error || 'Error al registrar usuario');
          return;
        }
        alert('Cliente registrado');
        localStorage.setItem('token', data.token);
        authModal.classList.remove('active');
        window.location.reload();
      } catch (err) {
        console.error('Register error:', err);
        alert('Error de red al registrar usuario');
      }
    });
  });
  