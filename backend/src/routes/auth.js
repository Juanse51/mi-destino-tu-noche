// =====================================================
// Rutas de Autenticación (Email + Google)
// =====================================================

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { OAuth2Client } = require('google-auth-library');
const { query } = require('../config/database');
const { generarTokens, verificarToken, JWT_SECRET } = require('../middleware/auth');
const jwt = require('jsonwebtoken');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// =====================================================
// REGISTRO CON EMAIL
// =====================================================
router.post('/registro', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),
  body('nombre').trim().notEmpty().withMessage('El nombre es requerido')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { email, password, nombre, apellido } = req.body;
    
    // Verificar si el email ya existe
    const existe = await query('SELECT id FROM usuarios WHERE email = $1', [email]);
    if (existe.rows.length > 0) {
      return res.status(400).json({ error: 'Este email ya está registrado' });
    }
    
    // Hash de contraseña
    const passwordHash = await bcrypt.hash(password, 12);
    
    // Crear usuario
    const result = await query(`
      INSERT INTO usuarios (email, password_hash, nombre, apellido)
      VALUES ($1, $2, $3, $4)
      RETURNING id, email, nombre, apellido, avatar_url, rol
    `, [email, passwordHash, nombre, apellido || null]);
    
    const usuario = result.rows[0];
    const tokens = generarTokens(usuario.id);
    
    // Guardar refresh token
    await query(`
      INSERT INTO refresh_tokens (usuario_id, token, expira_en)
      VALUES ($1, $2, NOW() + INTERVAL '7 days')
    `, [usuario.id, tokens.refreshToken]);
    
    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      usuario,
      ...tokens
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// =====================================================
// LOGIN CON EMAIL
// =====================================================
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { email, password } = req.body;
    
    // Buscar usuario
    const result = await query(`
      SELECT id, email, password_hash, nombre, apellido, avatar_url, rol, activo
      FROM usuarios WHERE email = $1
    `, [email]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    const usuario = result.rows[0];
    
    if (!usuario.activo) {
      return res.status(401).json({ error: 'Cuenta desactivada' });
    }
    
    if (!usuario.password_hash) {
      return res.status(401).json({ 
        error: 'Esta cuenta usa inicio de sesión con Google',
        code: 'USE_GOOGLE_LOGIN'
      });
    }
    
    // Verificar contraseña
    const passwordValido = await bcrypt.compare(password, usuario.password_hash);
    if (!passwordValido) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    // Actualizar último login
    await query('UPDATE usuarios SET ultimo_login = NOW() WHERE id = $1', [usuario.id]);
    
    const tokens = generarTokens(usuario.id);
    
    // Guardar refresh token
    await query(`
      INSERT INTO refresh_tokens (usuario_id, token, expira_en)
      VALUES ($1, $2, NOW() + INTERVAL '7 days')
    `, [usuario.id, tokens.refreshToken]);
    
    delete usuario.password_hash;
    
    res.json({
      mensaje: 'Inicio de sesión exitoso',
      usuario,
      ...tokens
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

// =====================================================
// LOGIN/REGISTRO CON GOOGLE
// =====================================================
router.post('/google', [
  body('idToken').notEmpty().withMessage('Token de Google requerido')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { idToken } = req.body;
    
    // Verificar token de Google
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;
    
    // Buscar usuario existente por Google ID o email
    let result = await query(`
      SELECT id, email, nombre, apellido, avatar_url, rol, activo
      FROM usuarios WHERE google_id = $1 OR email = $2
    `, [googleId, email]);
    
    let usuario;
    let esNuevo = false;
    
    if (result.rows.length === 0) {
      // Crear nuevo usuario
      const nombres = name.split(' ');
      const nombre = nombres[0];
      const apellido = nombres.slice(1).join(' ') || null;
      
      result = await query(`
        INSERT INTO usuarios (email, nombre, apellido, google_id, google_avatar_url, avatar_url, email_verificado)
        VALUES ($1, $2, $3, $4, $5, $5, true)
        RETURNING id, email, nombre, apellido, avatar_url, rol
      `, [email, nombre, apellido, googleId, picture]);
      
      usuario = result.rows[0];
      esNuevo = true;
    } else {
      usuario = result.rows[0];
      
      if (!usuario.activo) {
        return res.status(401).json({ error: 'Cuenta desactivada' });
      }
      
      // Actualizar Google ID si no lo tiene
      await query(`
        UPDATE usuarios 
        SET google_id = COALESCE(google_id, $1),
            google_avatar_url = $2,
            ultimo_login = NOW()
        WHERE id = $3
      `, [googleId, picture, usuario.id]);
    }
    
    const tokens = generarTokens(usuario.id);
    
    // Guardar refresh token
    await query(`
      INSERT INTO refresh_tokens (usuario_id, token, expira_en)
      VALUES ($1, $2, NOW() + INTERVAL '7 days')
    `, [usuario.id, tokens.refreshToken]);
    
    res.json({
      mensaje: esNuevo ? 'Cuenta creada con Google' : 'Inicio de sesión exitoso',
      usuario,
      esNuevo,
      ...tokens
    });
  } catch (error) {
    console.error('Error en login con Google:', error);
    if (error.message.includes('Token used too late') || error.message.includes('Invalid token')) {
      return res.status(401).json({ error: 'Token de Google inválido o expirado' });
    }
    res.status(500).json({ error: 'Error al autenticar con Google' });
  }
});

// =====================================================
// REFRESH TOKEN
// =====================================================
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token requerido' });
    }
    
    // Verificar token
    const decoded = jwt.verify(refreshToken, JWT_SECRET);
    
    if (decoded.type !== 'refresh') {
      return res.status(401).json({ error: 'Token inválido' });
    }
    
    // Verificar en base de datos
    const result = await query(`
      SELECT rt.*, u.activo
      FROM refresh_tokens rt
      JOIN usuarios u ON u.id = rt.usuario_id
      WHERE rt.token = $1 AND rt.expira_en > NOW()
    `, [refreshToken]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Refresh token inválido o expirado' });
    }
    
    if (!result.rows[0].activo) {
      return res.status(401).json({ error: 'Usuario desactivado' });
    }
    
    // Generar nuevos tokens
    const tokens = generarTokens(decoded.userId);
    
    // Eliminar token viejo y guardar nuevo
    await query('DELETE FROM refresh_tokens WHERE token = $1', [refreshToken]);
    await query(`
      INSERT INTO refresh_tokens (usuario_id, token, expira_en)
      VALUES ($1, $2, NOW() + INTERVAL '7 days')
    `, [decoded.userId, tokens.refreshToken]);
    
    res.json(tokens);
  } catch (error) {
    console.error('Error en refresh:', error);
    res.status(401).json({ error: 'Error al refrescar token' });
  }
});

// =====================================================
// LOGOUT
// =====================================================
router.post('/logout', verificarToken, async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (refreshToken) {
      await query('DELETE FROM refresh_tokens WHERE token = $1', [refreshToken]);
    }
    
    // Limpiar push token
    await query('UPDATE usuarios SET push_token = NULL WHERE id = $1', [req.usuario.id]);
    
    res.json({ mensaje: 'Sesión cerrada exitosamente' });
  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({ error: 'Error al cerrar sesión' });
  }
});

// =====================================================
// VERIFICAR TOKEN
// =====================================================
router.get('/verificar', verificarToken, async (req, res) => {
  res.json({ usuario: req.usuario });
});

// =====================================================
// REGISTRAR PUSH TOKEN
// =====================================================
router.post('/push-token', verificarToken, async (req, res) => {
  try {
    const { pushToken } = req.body;
    
    await query('UPDATE usuarios SET push_token = $1 WHERE id = $2', [pushToken, req.usuario.id]);
    
    res.json({ mensaje: 'Push token registrado' });
  } catch (error) {
    console.error('Error guardando push token:', error);
    res.status(500).json({ error: 'Error al guardar push token' });
  }
});

module.exports = router;
