export async function apiFetch(endpoint, opts = {}) {
    const token = localStorage.getItem('token');
    opts.headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
    try {
        const res = await fetch(endpoint, opts);
        if (res.status === 401) {
            if (navigator.onLine) {
                localStorage.removeItem('token');
                document.dispatchEvent(new Event('logout'));
            }
            throw new Error('No autorizado');
        }
        return res;
    } catch (error) {
        if (!navigator.onLine) {
            console.error("Error de conexión, reintentando más tarde");
        }
        throw error;
    }
}