require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const swaggerUi = require('swagger-ui-express');

console.log('🛠  Iniciando aplicación…');

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(`--> ${req.method} ${req.originalUrl}`);
    next();
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/productos', require('./routes/productosRoutes'));
app.use('/api/categorias', require('./routes/categoriasRoutes'));
app.use('/api/clientes', require('./routes/clientesRoutes'));
app.use('/api/ventas', require('./routes/ventasRoutes'));


app.get('/swagger.json', (req, res) => {
    try {
        const swaggerPath = path.join(__dirname, 'swagger.json');
        const swaggerContent = fs.readFileSync(swaggerPath, 'utf8');
        const swaggerDocument = JSON.parse(swaggerContent);

        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerDocument);
    } catch (error) {
        console.error('Error al cargar swagger.json:', error);
        res.status(500).json({ error: 'Error al cargar la documentación' });
    }
});

app.use(
    '/api/docs',
    swaggerUi.serve,
    swaggerUi.setup(null, {
        swaggerOptions: {
            url: `/swagger.json?t=${Date.now()}`,
            docExpansion: 'none'
        }
    })
);

app.use(express.static(path.join(__dirname, 'public')));
app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((req, res) => {
    res.status(404).json({ error: 'Recurso no encontrado' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));