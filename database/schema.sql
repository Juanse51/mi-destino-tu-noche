-- =====================================================
-- MI DESTINO TU NOCHE - Base de Datos Completa
-- =====================================================
-- Incluye: Usuarios, Establecimientos, Valoraciones,
-- Favoritos, Lista "Quiero ir", Historial, Banners,
-- Notificaciones, Categorías especiales, Etiquetas
-- =====================================================

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- =====================================================
-- TABLAS DE USUARIOS Y AUTENTICACIÓN
-- =====================================================

CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100),
    avatar_url TEXT,
    telefono VARCHAR(20),
    
    -- Autenticación con Google
    google_id VARCHAR(255) UNIQUE,
    google_avatar_url TEXT,
    
    -- Roles y permisos
    rol VARCHAR(20) DEFAULT 'usuario' CHECK (rol IN ('usuario', 'propietario', 'admin', 'superadmin')),
    
    -- Notificaciones push
    push_token TEXT,
    notificaciones_habilitadas BOOLEAN DEFAULT true,
    
    -- Estado
    activo BOOLEAN DEFAULT true,
    email_verificado BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ultimo_login TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- TABLAS DE UBICACIÓN
-- =====================================================

CREATE TABLE departamentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL UNIQUE,
    codigo VARCHAR(10),
    activo BOOLEAN DEFAULT true
);

CREATE TABLE ciudades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL,
    departamento_id UUID REFERENCES departamentos(id),
    slug VARCHAR(100) UNIQUE,
    imagen_url TEXT,
    descripcion TEXT,
    latitud DECIMAL(10, 8),
    longitud DECIMAL(11, 8),
    activo BOOLEAN DEFAULT true,
    orden INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CATEGORÍAS Y TIPOS
-- =====================================================

CREATE TABLE tipos_establecimiento (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(50) NOT NULL UNIQUE,
    slug VARCHAR(50) UNIQUE,
    icono VARCHAR(50),
    color VARCHAR(7),
    descripcion TEXT,
    orden INT DEFAULT 0,
    activo BOOLEAN DEFAULT true
);

-- Insertar tipos base
INSERT INTO tipos_establecimiento (nombre, slug, icono, color, orden) VALUES
('Restaurante', 'restaurante', '🍽️', '#FF6B35', 1),
('Bar', 'bar', '🍺', '#9B59B6', 2),
('Café', 'cafe', '☕', '#8B4513', 3),
('Discoteca', 'discoteca', '🎉', '#E91E63', 4),
('Gastrobar', 'gastrobar', '🍸', '#00BCD4', 5);

CREATE TABLE tipos_comida (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) UNIQUE,
    icono VARCHAR(50),
    activo BOOLEAN DEFAULT true
);

-- Insertar tipos de comida
INSERT INTO tipos_comida (nombre, slug, icono) VALUES
('Colombiana', 'colombiana', '🇨🇴'),
('Internacional', 'internacional', '🌍'),
('Italiana', 'italiana', '🇮🇹'),
('Mexicana', 'mexicana', '🇲🇽'),
('Japonesa', 'japonesa', '🇯🇵'),
('Peruana', 'peruana', '🇵🇪'),
('Parrilla', 'parrilla', '🥩'),
('Mariscos', 'mariscos', '🦐'),
('Vegetariana', 'vegetariana', '🥗'),
('Comida rápida', 'comida-rapida', '🍔'),
('Postres', 'postres', '🍰'),
('Café de especialidad', 'cafe-especialidad', '☕');

-- =====================================================
-- CATEGORÍAS ESPECIALES
-- =====================================================

CREATE TABLE categorias_especiales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) UNIQUE,
    descripcion TEXT,
    icono VARCHAR(50),
    color VARCHAR(7),
    imagen_url TEXT,
    activo BOOLEAN DEFAULT true,
    orden INT DEFAULT 0
);

-- Insertar categorías especiales
INSERT INTO categorias_especiales (nombre, slug, descripcion, icono, color, orden) VALUES
('Círculo Gastro', 'circulo-gastro', 'Los mejores restaurantes seleccionados por su calidad gastronómica', '⭐', '#FFD700', 1),
('Cámara de la Diversidad', 'camara-diversidad', 'Espacios inclusivos y amigables con la comunidad LGBTIQ+', '🏳️‍🌈', '#FF69B4', 2),
('Tardeo', 'tardeo', 'Los mejores lugares para disfrutar desde temprano', '🌅', '#FF8C00', 3),
('Pet Friendly', 'pet-friendly', 'Lugares donde las mascotas son bienvenidas', '🐕', '#4CAF50', 4);

-- =====================================================
-- ETIQUETAS/CARACTERÍSTICAS
-- =====================================================

CREATE TABLE etiquetas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) UNIQUE,
    icono VARCHAR(50),
    categoria VARCHAR(50), -- 'servicio', 'ambiente', 'facilidad', 'pago'
    activo BOOLEAN DEFAULT true,
    orden INT DEFAULT 0
);

-- Insertar etiquetas predefinidas
INSERT INTO etiquetas (nombre, slug, icono, categoria, orden) VALUES
-- Servicios
('WiFi gratis', 'wifi', '📶', 'servicio', 1),
('Música en vivo', 'musica-en-vivo', '🎵', 'servicio', 2),
('DJ', 'dj', '🎧', 'servicio', 3),
('Karaoke', 'karaoke', '🎤', 'servicio', 4),
('Delivery', 'delivery', '🛵', 'servicio', 5),
('Para llevar', 'para-llevar', '📦', 'servicio', 6),
('Reservaciones', 'reservaciones', '📅', 'servicio', 7),
-- Ambiente
('Terraza', 'terraza', '🌿', 'ambiente', 10),
('Rooftop', 'rooftop', '🏙️', 'ambiente', 11),
('Vista panorámica', 'vista-panoramica', '🌄', 'ambiente', 12),
('Ambiente romántico', 'romantico', '💕', 'ambiente', 13),
('Familiar', 'familiar', '👨‍👩‍👧‍👦', 'ambiente', 14),
('Ideal para grupos', 'grupos', '👥', 'ambiente', 15),
('Tranquilo', 'tranquilo', '😌', 'ambiente', 16),
('Fiestero', 'fiestero', '🎉', 'ambiente', 17),
-- Facilidades
('Parqueadero', 'parqueadero', '🅿️', 'facilidad', 20),
('Valet parking', 'valet', '🚗', 'facilidad', 21),
('Acceso discapacitados', 'accesible', '♿', 'facilidad', 22),
('Zona infantil', 'zona-infantil', '🧒', 'facilidad', 23),
('Pet friendly', 'pet-friendly', '🐕', 'facilidad', 24),
('Aire acondicionado', 'aire-acondicionado', '❄️', 'facilidad', 25),
('Zona fumadores', 'fumadores', '🚬', 'facilidad', 26),
-- Métodos de pago
('Efectivo', 'efectivo', '💵', 'pago', 30),
('Tarjetas', 'tarjetas', '💳', 'pago', 31),
('Nequi', 'nequi', '📱', 'pago', 32),
('Daviplata', 'daviplata', '📱', 'pago', 33);

-- =====================================================
-- ESTABLECIMIENTOS
-- =====================================================

CREATE TABLE establecimientos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Información básica
    nombre VARCHAR(200) NOT NULL,
    slug VARCHAR(220) UNIQUE,
    descripcion TEXT,
    descripcion_corta VARCHAR(300),
    
    -- Tipo y categoría
    tipo_id UUID REFERENCES tipos_establecimiento(id),
    tipo_comida_id UUID REFERENCES tipos_comida(id),
    
    -- Ubicación
    ciudad_id UUID REFERENCES ciudades(id),
    direccion VARCHAR(300),
    direccion_adicional VARCHAR(200),
    barrio VARCHAR(100),
    latitud DECIMAL(10, 8),
    longitud DECIMAL(11, 8),
    ubicacion GEOGRAPHY(POINT, 4326),
    
    -- Contacto
    telefono VARCHAR(20),
    telefono_2 VARCHAR(20),
    whatsapp VARCHAR(20),
    email VARCHAR(255),
    sitio_web VARCHAR(255),
    
    -- Redes sociales
    instagram VARCHAR(100),
    facebook VARCHAR(100),
    tiktok VARCHAR(100),
    
    -- Imágenes
    imagen_principal TEXT,
    imagen_portada TEXT,
    logo_url TEXT,
    
    -- Horarios (JSON)
    horarios JSONB DEFAULT '{}',
    
    -- Precios
    rango_precios INT DEFAULT 2 CHECK (rango_precios BETWEEN 1 AND 4),
    precio_promedio DECIMAL(12, 2),
    
    -- Valoraciones (calculados)
    valoracion_promedio DECIMAL(2, 1) DEFAULT 0,
    total_valoraciones INT DEFAULT 0,
    total_visitas INT DEFAULT 0,
    
    -- Estado
    activo BOOLEAN DEFAULT true,
    verificado BOOLEAN DEFAULT false,
    destacado BOOLEAN DEFAULT false,
    
    -- Propietario
    propietario_id UUID REFERENCES usuarios(id),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para búsqueda y geolocalización
CREATE INDEX idx_establecimientos_ubicacion ON establecimientos USING GIST(ubicacion);
CREATE INDEX idx_establecimientos_ciudad ON establecimientos(ciudad_id);
CREATE INDEX idx_establecimientos_tipo ON establecimientos(tipo_id);
CREATE INDEX idx_establecimientos_activo ON establecimientos(activo);
CREATE INDEX idx_establecimientos_slug ON establecimientos(slug);
CREATE INDEX idx_establecimientos_nombre ON establecimientos USING gin(to_tsvector('spanish', nombre));

-- =====================================================
-- RELACIONES DE ESTABLECIMIENTOS
-- =====================================================

-- Establecimientos con categorías especiales
CREATE TABLE establecimientos_categorias_especiales (
    establecimiento_id UUID REFERENCES establecimientos(id) ON DELETE CASCADE,
    categoria_especial_id UUID REFERENCES categorias_especiales(id) ON DELETE CASCADE,
    fecha_asignacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (establecimiento_id, categoria_especial_id)
);

-- Establecimientos con etiquetas
CREATE TABLE establecimientos_etiquetas (
    establecimiento_id UUID REFERENCES establecimientos(id) ON DELETE CASCADE,
    etiqueta_id UUID REFERENCES etiquetas(id) ON DELETE CASCADE,
    PRIMARY KEY (establecimiento_id, etiqueta_id)
);

-- =====================================================
-- GALERÍA DE FOTOS
-- =====================================================

CREATE TABLE galeria_fotos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    establecimiento_id UUID REFERENCES establecimientos(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    url_thumbnail TEXT,
    titulo VARCHAR(200),
    descripcion TEXT,
    orden INT DEFAULT 0,
    es_principal BOOLEAN DEFAULT false,
    activo BOOLEAN DEFAULT true,
    subida_por UUID REFERENCES usuarios(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_galeria_establecimiento ON galeria_fotos(establecimiento_id);

-- =====================================================
-- MENÚ
-- =====================================================

CREATE TABLE menu_categorias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    establecimiento_id UUID REFERENCES establecimientos(id) ON DELETE CASCADE,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    orden INT DEFAULT 0,
    activo BOOLEAN DEFAULT true
);

CREATE TABLE menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    categoria_id UUID REFERENCES menu_categorias(id) ON DELETE CASCADE,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(12, 2),
    precio_promocion DECIMAL(12, 2),
    imagen_url TEXT,
    disponible BOOLEAN DEFAULT true,
    destacado BOOLEAN DEFAULT false,
    vegetariano BOOLEAN DEFAULT false,
    vegano BOOLEAN DEFAULT false,
    sin_gluten BOOLEAN DEFAULT false,
    picante INT DEFAULT 0 CHECK (picante BETWEEN 0 AND 3),
    orden INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- VALORACIONES Y RESEÑAS
-- =====================================================

CREATE TABLE valoraciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    establecimiento_id UUID REFERENCES establecimientos(id) ON DELETE CASCADE,
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    
    -- Puntuaciones
    puntuacion INT NOT NULL CHECK (puntuacion BETWEEN 1 AND 5),
    puntuacion_comida INT CHECK (puntuacion_comida BETWEEN 1 AND 5),
    puntuacion_servicio INT CHECK (puntuacion_servicio BETWEEN 1 AND 5),
    puntuacion_ambiente INT CHECK (puntuacion_ambiente BETWEEN 1 AND 5),
    puntuacion_precio INT CHECK (puntuacion_precio BETWEEN 1 AND 5),
    
    -- Contenido
    titulo VARCHAR(200),
    comentario TEXT,
    
    -- Estado
    estado VARCHAR(20) DEFAULT 'publicada' CHECK (estado IN ('pendiente', 'publicada', 'rechazada', 'reportada')),
    
    -- Utilidad
    votos_utiles INT DEFAULT 0,
    
    -- Respuesta del establecimiento
    respuesta TEXT,
    respuesta_fecha TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(establecimiento_id, usuario_id)
);

-- Fotos de valoraciones
CREATE TABLE valoraciones_fotos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    valoracion_id UUID REFERENCES valoraciones(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    url_thumbnail TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- FAVORITOS
-- =====================================================

CREATE TABLE favoritos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    establecimiento_id UUID REFERENCES establecimientos(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(usuario_id, establecimiento_id)
);

-- =====================================================
-- LISTA "QUIERO IR"
-- =====================================================

CREATE TABLE quiero_ir (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    establecimiento_id UUID REFERENCES establecimientos(id) ON DELETE CASCADE,
    nota TEXT,
    prioridad INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(usuario_id, establecimiento_id)
);

-- =====================================================
-- HISTORIAL DE VISITAS
-- =====================================================

CREATE TABLE historial_visitas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    establecimiento_id UUID REFERENCES establecimientos(id) ON DELETE CASCADE,
    tipo_visita VARCHAR(20) DEFAULT 'vista' CHECK (tipo_visita IN ('vista', 'check_in', 'reserva')),
    fecha_visita TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notas TEXT
);

CREATE INDEX idx_historial_usuario ON historial_visitas(usuario_id);
CREATE INDEX idx_historial_fecha ON historial_visitas(fecha_visita);

-- =====================================================
-- BANNERS PUBLICITARIOS
-- =====================================================

CREATE TABLE banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titulo VARCHAR(200) NOT NULL,
    subtitulo VARCHAR(300),
    imagen_url TEXT NOT NULL,
    imagen_mobile_url TEXT,
    enlace_url TEXT,
    enlace_tipo VARCHAR(20) DEFAULT 'externo' CHECK (enlace_tipo IN ('externo', 'establecimiento', 'categoria', 'ciudad')),
    enlace_id UUID,
    
    -- Ubicación del banner
    ubicacion VARCHAR(50) DEFAULT 'home' CHECK (ubicacion IN ('home', 'busqueda', 'detalle', 'categoria', 'ciudad')),
    
    -- Segmentación
    ciudad_id UUID REFERENCES ciudades(id),
    
    -- Programación
    fecha_inicio TIMESTAMP WITH TIME ZONE,
    fecha_fin TIMESTAMP WITH TIME ZONE,
    
    -- Estado y métricas
    activo BOOLEAN DEFAULT true,
    impresiones INT DEFAULT 0,
    clics INT DEFAULT 0,
    
    -- Orden
    orden INT DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- NOTIFICACIONES
-- =====================================================

CREATE TABLE notificaciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    
    tipo VARCHAR(50) NOT NULL, -- 'valoracion', 'favorito', 'promocion', 'sistema'
    titulo VARCHAR(200) NOT NULL,
    mensaje TEXT NOT NULL,
    imagen_url TEXT,
    
    -- Enlace
    enlace_tipo VARCHAR(50),
    enlace_id UUID,
    
    -- Estado
    leida BOOLEAN DEFAULT false,
    enviada_push BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notificaciones_usuario ON notificaciones(usuario_id);

-- Plantillas de notificaciones push
CREATE TABLE notificaciones_plantillas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL UNIQUE,
    titulo VARCHAR(200) NOT NULL,
    mensaje TEXT NOT NULL,
    activo BOOLEAN DEFAULT true
);

-- =====================================================
-- TOKENS Y SESIONES
-- =====================================================

CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    dispositivo VARCHAR(255),
    ip VARCHAR(45),
    expira_en TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- REPORTES Y MODERACIÓN
-- =====================================================

CREATE TABLE reportes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tipo VARCHAR(50) NOT NULL, -- 'establecimiento', 'valoracion', 'usuario'
    referencia_id UUID NOT NULL,
    reportado_por UUID REFERENCES usuarios(id),
    motivo VARCHAR(100) NOT NULL,
    descripcion TEXT,
    estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'revisando', 'resuelto', 'rechazado')),
    resuelto_por UUID REFERENCES usuarios(id),
    resolucion TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CONFIGURACIÓN DEL SISTEMA
-- =====================================================

CREATE TABLE configuracion (
    clave VARCHAR(100) PRIMARY KEY,
    valor TEXT,
    tipo VARCHAR(20) DEFAULT 'texto',
    descripcion TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar configuración inicial
INSERT INTO configuracion (clave, valor, tipo, descripcion) VALUES
('nombre_app', 'Mi Destino Tu Noche', 'texto', 'Nombre de la aplicación'),
('email_contacto', 'contacto@midestinotunoche.com', 'texto', 'Email de contacto'),
('telefono_contacto', '+57 321 230 4589', 'texto', 'Teléfono de contacto'),
('whatsapp_contacto', '573212304589', 'texto', 'WhatsApp de contacto'),
('instagram', '@midestinotunoche', 'texto', 'Instagram oficial'),
('facebook', 'midestinotunoche', 'texto', 'Facebook oficial'),
('version_app', '1.0.0', 'texto', 'Versión actual de la app'),
('mantenimiento', 'false', 'booleano', 'Modo mantenimiento');

-- =====================================================
-- FUNCIONES Y TRIGGERS
-- =====================================================

-- Función para actualizar timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers de updated_at
CREATE TRIGGER tr_usuarios_updated BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_establecimientos_updated BEFORE UPDATE ON establecimientos FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_valoraciones_updated BEFORE UPDATE ON valoraciones FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_banners_updated BEFORE UPDATE ON banners FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Función para generar slug
CREATE OR REPLACE FUNCTION generate_slug(texto TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN lower(
        regexp_replace(
            regexp_replace(
                translate(texto, 'áéíóúüñÁÉÍÓÚÜÑ', 'aeiouunAEIOUUN'),
                '[^a-zA-Z0-9\s-]', '', 'g'
            ),
            '\s+', '-', 'g'
        )
    );
END;
$$ LANGUAGE plpgsql;

-- Trigger para generar slug de establecimientos
CREATE OR REPLACE FUNCTION generate_establecimiento_slug()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        NEW.slug = generate_slug(NEW.nombre) || '-' || substr(NEW.id::text, 1, 8);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_establecimiento_slug BEFORE INSERT ON establecimientos FOR EACH ROW EXECUTE FUNCTION generate_establecimiento_slug();

-- Función para actualizar ubicación geográfica
CREATE OR REPLACE FUNCTION update_ubicacion()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.latitud IS NOT NULL AND NEW.longitud IS NOT NULL THEN
        NEW.ubicacion = ST_SetSRID(ST_MakePoint(NEW.longitud, NEW.latitud), 4326);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_establecimiento_ubicacion BEFORE INSERT OR UPDATE ON establecimientos FOR EACH ROW EXECUTE FUNCTION update_ubicacion();

-- Función para actualizar valoración promedio
CREATE OR REPLACE FUNCTION update_valoracion_promedio()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE establecimientos SET
        valoracion_promedio = (
            SELECT COALESCE(AVG(puntuacion), 0)
            FROM valoraciones
            WHERE establecimiento_id = COALESCE(NEW.establecimiento_id, OLD.establecimiento_id)
            AND estado = 'publicada'
        ),
        total_valoraciones = (
            SELECT COUNT(*)
            FROM valoraciones
            WHERE establecimiento_id = COALESCE(NEW.establecimiento_id, OLD.establecimiento_id)
            AND estado = 'publicada'
        )
    WHERE id = COALESCE(NEW.establecimiento_id, OLD.establecimiento_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_valoracion_promedio AFTER INSERT OR UPDATE OR DELETE ON valoraciones FOR EACH ROW EXECUTE FUNCTION update_valoracion_promedio();

-- =====================================================
-- DATOS INICIALES - DEPARTAMENTOS Y CIUDADES
-- =====================================================

INSERT INTO departamentos (nombre, codigo) VALUES
('Cundinamarca', 'CUN'),
('Antioquia', 'ANT'),
('Valle del Cauca', 'VAL'),
('Atlántico', 'ATL'),
('Bolívar', 'BOL'),
('Risaralda', 'RIS'),
('Quindío', 'QUI'),
('Caldas', 'CAL'),
('Santander', 'SAN'),
('Meta', 'MET'),
('Huila', 'HUI'),
('Córdoba', 'COR'),
('Cesar', 'CES'),
('Nariño', 'NAR'),
('Norte de Santander', 'NDS');

INSERT INTO ciudades (nombre, departamento_id, slug, latitud, longitud, orden) VALUES
('Bogotá', (SELECT id FROM departamentos WHERE codigo = 'CUN'), 'bogota', 4.6097, -74.0817, 1),
('Medellín', (SELECT id FROM departamentos WHERE codigo = 'ANT'), 'medellin', 6.2442, -75.5812, 2),
('Cali', (SELECT id FROM departamentos WHERE codigo = 'VAL'), 'cali', 3.4516, -76.5320, 3),
('Barranquilla', (SELECT id FROM departamentos WHERE codigo = 'ATL'), 'barranquilla', 10.9685, -74.7813, 4),
('Cartagena', (SELECT id FROM departamentos WHERE codigo = 'BOL'), 'cartagena', 10.3910, -75.4794, 5),
('Pereira', (SELECT id FROM departamentos WHERE codigo = 'RIS'), 'pereira', 4.8133, -75.6961, 6),
('Armenia', (SELECT id FROM departamentos WHERE codigo = 'QUI'), 'armenia', 4.5339, -75.6811, 7),
('Manizales', (SELECT id FROM departamentos WHERE codigo = 'CAL'), 'manizales', 5.0689, -75.5174, 8),
('Bucaramanga', (SELECT id FROM departamentos WHERE codigo = 'SAN'), 'bucaramanga', 7.1193, -73.1227, 9),
('Villavicencio', (SELECT id FROM departamentos WHERE codigo = 'MET'), 'villavicencio', 4.1420, -73.6266, 10),
('Neiva', (SELECT id FROM departamentos WHERE codigo = 'HUI'), 'neiva', 2.9273, -75.2819, 11),
('Montería', (SELECT id FROM departamentos WHERE codigo = 'COR'), 'monteria', 8.7479, -75.8814, 12),
('Valledupar', (SELECT id FROM departamentos WHERE codigo = 'CES'), 'valledupar', 10.4631, -73.2532, 13),
('Pasto', (SELECT id FROM departamentos WHERE codigo = 'NAR'), 'pasto', 1.2136, -77.2811, 14),
('Cúcuta', (SELECT id FROM departamentos WHERE codigo = 'NDS'), 'cucuta', 7.8891, -72.4967, 15),
('Zipaquirá', (SELECT id FROM departamentos WHERE codigo = 'CUN'), 'zipaquira', 5.0224, -74.0059, 16);

-- =====================================================
-- POLÍTICAS DE SEGURIDAD (RLS) PARA SUPABASE
-- =====================================================

-- Habilitar RLS
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE establecimientos ENABLE ROW LEVEL SECURITY;
ALTER TABLE valoraciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE favoritos ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiero_ir ENABLE ROW LEVEL SECURITY;
ALTER TABLE historial_visitas ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificaciones ENABLE ROW LEVEL SECURITY;

-- Políticas públicas (lectura)
CREATE POLICY "Establecimientos públicos" ON establecimientos FOR SELECT USING (activo = true);
CREATE POLICY "Valoraciones públicas" ON valoraciones FOR SELECT USING (estado = 'publicada');
CREATE POLICY "Ciudades públicas" ON ciudades FOR SELECT USING (activo = true);

-- Políticas de usuario autenticado
CREATE POLICY "Usuario ve su perfil" ON usuarios FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Usuario edita su perfil" ON usuarios FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Usuario ve sus favoritos" ON favoritos FOR SELECT USING (auth.uid() = usuario_id);
CREATE POLICY "Usuario gestiona favoritos" ON favoritos FOR ALL USING (auth.uid() = usuario_id);

CREATE POLICY "Usuario ve quiero ir" ON quiero_ir FOR SELECT USING (auth.uid() = usuario_id);
CREATE POLICY "Usuario gestiona quiero ir" ON quiero_ir FOR ALL USING (auth.uid() = usuario_id);

CREATE POLICY "Usuario ve historial" ON historial_visitas FOR SELECT USING (auth.uid() = usuario_id);
CREATE POLICY "Usuario crea historial" ON historial_visitas FOR INSERT WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Usuario ve notificaciones" ON notificaciones FOR SELECT USING (auth.uid() = usuario_id);
CREATE POLICY "Usuario actualiza notificaciones" ON notificaciones FOR UPDATE USING (auth.uid() = usuario_id);

-- =====================================================
-- FIN DEL ESQUEMA
-- =====================================================
