// =====================================================
// MI DESTINO TU NOCHE - Backend API
// =====================================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

// =====================================================
// MIDDLEWARES
// =====================================================

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// =====================================================
// RUTAS
// =====================================================

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API v1
const API_PREFIX = '/api/v1';

app.use(`${API_PREFIX}/auth`, require('./routes/auth'));
app.use(`${API_PREFIX}/usuarios`, require('./routes/usuarios'));
app.use(`${API_PREFIX}/establecimientos`, require('./routes/establecimientos'));
app.use(`${API_PREFIX}/ciudades`, require('./routes/ciudades'));
app.use(`${API_PREFIX}/valoraciones`, require('./routes/valoraciones'));
app.use(`${API_PREFIX}/favoritos`, require('./routes/favoritos'));
app.use(`${API_PREFIX}/quiero-ir`, require('./routes/quieroIr'));
app.use(`${API_PREFIX}/historial`, require('./routes/historial'));
app.use(`${API_PREFIX}/menu`, require('./routes/menu'));
app.use(`${API_PREFIX}/banners`, require('./routes/banners'));
app.use(`${API_PREFIX}/notificaciones`, require('./routes/notificaciones'));
app.use(`${API_PREFIX}/upload`, require('./routes/upload'));
app.use(`${API_PREFIX}/admin`, require('./routes/admin'));
app.use(`${API_PREFIX}/categorias`, require('./routes/categorias'));
app.use(`${API_PREFIX}/etiquetas`, require('./routes/etiquetas'));

// =====================================================
// MANEJO DE ERRORES
// =====================================================

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// =====================================================
// INICIAR SERVIDOR
// =====================================================

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════╗
║     🌙 MI DESTINO TU NOCHE - API Server 🌙        ║
╠═══════════════════════════════════════════════════╣
║  Puerto: ${PORT}                                     ║
║  Entorno: ${process.env.NODE_ENV || 'development'}                        ║
║  API: http://localhost:${PORT}/api/v1                ║
╚═══════════════════════════════════════════════════╝
  `);
});

module.exports = app;
