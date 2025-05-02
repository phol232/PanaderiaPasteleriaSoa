require('dotenv').config();
const express       = require('express');
const cors          = require('cors');
const path          = require('path');
const swaggerUi     = require('swagger-ui-express');
const swaggerDoc    = require('./swagger.json');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth',       require('./routes/authRoutes'));
app.use('/api/productos',  require('./routes/productosRoutes'));
app.use('/api/categorias', require('./routes/categoriasRoutes'));
app.use('/api/clientes',   require('./routes/clientesRoutes'));
app.use('/api/ventas',     require('./routes/ventasRoutes'));

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use(express.static(path.join(__dirname, 'public')));

app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Recurso API no encontrado' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
