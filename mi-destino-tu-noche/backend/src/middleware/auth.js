// =====================================================
// Middleware de Autenticación
// =====================================================

const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'mi-destino-tu-noche-secret-key';

// Verificar token JWT
const verificarToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }
    
    const token = authHeader.split(' ')[1];
    
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Obtener usuario de la base de datos
    const result = await query(
      'SELECT id, email, nombre, apellido, avatar_url, rol, activo FROM usuarios WHERE id = $1',
      [decoded.userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }
    
    const usuario = result.rows[0];
    
    if (!usuario.activo) {
      return res.status(401).json({ error: 'Usuario desactivado' });
    }
    
    req.usuario = usuario;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado', code: 'TOKEN_EXPIRED' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido' });
    }
    console.error('Error en autenticación:', error);
    res.status(500).json({ error: 'Error de autenticación' });
  }
};

// Token opcional (para rutas que funcionan con o sin auth)
const tokenOpcional = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.usuario = null;
      return next();
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const result = await query(
      'SELECT id, email, nombre, apellido, avatar_url, rol, activo FROM usuarios WHERE id = $1',
      [decoded.userId]
    );
    
    req.usuario = result.rows.length > 0 && result.rows[0].activo ? result.rows[0] : null;
    next();
  } catch (error) {
    req.usuario = null;
    next();
  }
};

// Verificar roles
const verificarRol = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ error: 'No autenticado' });
    }
    
    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({ error: 'No tienes permisos para esta acción' });
    }
    
    next();
  };
};

// Verificar si es admin
const esAdmin = verificarRol('admin', 'superadmin');

// Verificar si es propietario del recurso o admin
const esPropietarioOAdmin = (obtenerPropietarioId) => {
  return async (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ error: 'No autenticado' });
    }
    
    if (['admin', 'superadmin'].includes(req.usuario.rol)) {
      return next();
    }
    
    const propietarioId = await obtenerPropietarioId(req);
    
    if (propietarioId !== req.usuario.id) {
      return res.status(403).json({ error: 'No tienes permisos para este recurso' });
    }
    
    next();
  };
};

// Generar tokens
const generarTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
  
  const refreshToken = jwt.sign(
    { userId, type: 'refresh' },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  return { accessToken, refreshToken };
};

module.exports = {
  verificarToken,
  tokenOpcional,
  verificarRol,
  esAdmin,
  esPropietarioOAdmin,
  generarTokens,
  JWT_SECRET
};
