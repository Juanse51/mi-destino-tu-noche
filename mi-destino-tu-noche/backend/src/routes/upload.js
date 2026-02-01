// =====================================================
// Rutas de Upload de Imágenes
// =====================================================

const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const { supabase } = require('../config/database');
const { verificarToken } = require('../middleware/auth');

// Configurar multer
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes'), false);
    }
  }
});

// Subir imagen
router.post('/imagen', verificarToken, upload.single('imagen'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó imagen' });
    }
    
    const { carpeta = 'general' } = req.body;
    
    // Procesar imagen con Sharp
    const processedImage = await sharp(req.file.buffer)
      .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toBuffer();
    
    // Crear thumbnail
    const thumbnail = await sharp(req.file.buffer)
      .resize(300, 300, { fit: 'cover' })
      .jpeg({ quality: 80 })
      .toBuffer();
    
    const fileName = `${uuidv4()}.jpg`;
    const thumbName = `${uuidv4()}_thumb.jpg`;
    
    // Subir a Supabase Storage
    const { data: mainData, error: mainError } = await supabase.storage
      .from('imagenes')
      .upload(`${carpeta}/${fileName}`, processedImage, {
        contentType: 'image/jpeg'
      });
    
    if (mainError) throw mainError;
    
    const { data: thumbData, error: thumbError } = await supabase.storage
      .from('imagenes')
      .upload(`${carpeta}/thumbnails/${thumbName}`, thumbnail, {
        contentType: 'image/jpeg'
      });
    
    // Obtener URLs públicas
    const { data: { publicUrl: url } } = supabase.storage
      .from('imagenes')
      .getPublicUrl(`${carpeta}/${fileName}`);
    
    const { data: { publicUrl: thumbnailUrl } } = supabase.storage
      .from('imagenes')
      .getPublicUrl(`${carpeta}/thumbnails/${thumbName}`);
    
    res.json({
      url,
      url_thumbnail: thumbnailUrl,
      nombre: fileName
    });
  } catch (error) {
    console.error('Error subiendo imagen:', error);
    res.status(500).json({ error: 'Error al subir imagen' });
  }
});

// Subir múltiples imágenes
router.post('/imagenes', verificarToken, upload.array('imagenes', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No se proporcionaron imágenes' });
    }
    
    const { carpeta = 'general' } = req.body;
    const resultados = [];
    
    for (const file of req.files) {
      const processedImage = await sharp(file.buffer)
        .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toBuffer();
      
      const thumbnail = await sharp(file.buffer)
        .resize(300, 300, { fit: 'cover' })
        .jpeg({ quality: 80 })
        .toBuffer();
      
      const fileName = `${uuidv4()}.jpg`;
      const thumbName = `${uuidv4()}_thumb.jpg`;
      
      await supabase.storage
        .from('imagenes')
        .upload(`${carpeta}/${fileName}`, processedImage, { contentType: 'image/jpeg' });
      
      await supabase.storage
        .from('imagenes')
        .upload(`${carpeta}/thumbnails/${thumbName}`, thumbnail, { contentType: 'image/jpeg' });
      
      const { data: { publicUrl: url } } = supabase.storage
        .from('imagenes')
        .getPublicUrl(`${carpeta}/${fileName}`);
      
      const { data: { publicUrl: thumbnailUrl } } = supabase.storage
        .from('imagenes')
        .getPublicUrl(`${carpeta}/thumbnails/${thumbName}`);
      
      resultados.push({ url, url_thumbnail: thumbnailUrl });
    }
    
    res.json({ imagenes: resultados });
  } catch (error) {
    console.error('Error subiendo imágenes:', error);
    res.status(500).json({ error: 'Error al subir imágenes' });
  }
});

// Eliminar imagen
router.delete('/imagen', verificarToken, async (req, res) => {
  try {
    const { path } = req.body;
    
    if (!path) {
      return res.status(400).json({ error: 'Path requerido' });
    }
    
    await supabase.storage.from('imagenes').remove([path]);
    
    res.json({ mensaje: 'Imagen eliminada' });
  } catch (error) {
    console.error('Error eliminando imagen:', error);
    res.status(500).json({ error: 'Error al eliminar imagen' });
  }
});

module.exports = router;
