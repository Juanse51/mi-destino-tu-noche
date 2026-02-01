-- =====================================================
-- MI DESTINO TU NOCHE - PARTE 2: Establecimientos y Features
-- Ejecutar en: Supabase SQL Editor (después de Parte 1)
-- =====================================================

-- =====================================================
-- ESTABLECIMIENTOS
-- =====================================================
CREATE TABLE establecimientos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(200) NOT NULL,
    slug VARCHAR(220) UNIQUE,
    descripcion TEXT,
    descripcion_corta VARCHAR(300),
    tipo_id UUID REFERENCES tipos_establecimiento(id),
    tipo_comida_id UUID REFERENCES tipos_comida(id),
    ciudad_id UUID REFERENCES ciudades(id),
    direccion VARCHAR(300),
    direccion_adicional VARCHAR(200),
    barrio VARCHAR(100),
    latitud DECIMAL(10, 8),
    longitud DECIMAL(11, 8),
    ubicacion GEOGRAPHY(POINT, 4326),
    telefono VARCHAR(20),
    telefono_2 VARCHAR(20),
    whatsapp VARCHAR(20),
    email VARCHAR(255),
    sitio_web VARCHAR(255),
    instagram VARCHAR(100),
    facebook VARCHAR(100),
    tiktok VARCHAR(100),
    imagen_principal TEXT,
    imagen_portada TEXT,
    logo_url TEXT,
    horarios JSONB DEFAULT '{}',
    rango_precios INT DEFAULT 2 CHECK (rango_precios BETWEEN 1 AND 4),
    precio_promedio DECIMAL(12, 2),
    valoracion_promedio DECIMAL(2, 1) DEFAULT 0,
    total_valoraciones INT DEFAULT 0,
    total_visitas INT DEFAULT 0,
    activo BOOLEAN DEFAULT true,
    verificado BOOLEAN DEFAULT false,
    destacado BOOLEAN DEFAULT false,
    propietario_id UUID REFERENCES usuarios(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_establecimientos_ubicacion ON establecimientos USING GIST(ubicacion);
CREATE INDEX idx_establecimientos_ciudad ON establecimientos(ciudad_id);
CREATE INDEX idx_establecimientos_tipo ON establecimientos(tipo_id);
CREATE INDEX idx_establecimientos_activo ON establecimientos(activo);
CREATE INDEX idx_establecimientos_slug ON establecimientos(slug);
CREATE INDEX idx_establecimientos_nombre ON establecimientos USING gin(to_tsvector('spanish', nombre));

-- Relaciones
CREATE TABLE establecimientos_categorias_especiales (
    establecimiento_id UUID REFERENCES establecimientos(id) ON DELETE CASCADE,
    categoria_especial_id UUID REFERENCES categorias_especiales(id) ON DELETE CASCADE,
    fecha_asignacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (establecimiento_id, categoria_especial_id)
);

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
-- VALORACIONES
-- =====================================================
CREATE TABLE valoraciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    establecimiento_id UUID REFERENCES establecimientos(id) ON DELETE CASCADE,
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    puntuacion INT NOT NULL CHECK (puntuacion BETWEEN 1 AND 5),
    puntuacion_comida INT CHECK (puntuacion_comida BETWEEN 1 AND 5),
    puntuacion_servicio INT CHECK (puntuacion_servicio BETWEEN 1 AND 5),
    puntuacion_ambiente INT CHECK (puntuacion_ambiente BETWEEN 1 AND 5),
    puntuacion_precio INT CHECK (puntuacion_precio BETWEEN 1 AND 5),
    titulo VARCHAR(200),
    comentario TEXT,
    estado VARCHAR(20) DEFAULT 'publicada' CHECK (estado IN ('pendiente', 'publicada', 'rechazada', 'reportada')),
    votos_utiles INT DEFAULT 0,
    respuesta TEXT,
    respuesta_fecha TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(establecimiento_id, usuario_id)
);

CREATE TABLE valoraciones_fotos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    valoracion_id UUID REFERENCES valoraciones(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    url_thumbnail TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- FAVORITOS, QUIERO IR, HISTORIAL
-- =====================================================
CREATE TABLE favoritos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    establecimiento_id UUID REFERENCES establecimientos(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(usuario_id, establecimiento_id)
);

CREATE TABLE quiero_ir (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    establecimiento_id UUID REFERENCES establecimientos(id) ON DELETE CASCADE,
    nota TEXT,
    prioridad INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(usuario_id, establecimiento_id)
);

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
-- BANNERS
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
    ubicacion VARCHAR(50) DEFAULT 'home' CHECK (ubicacion IN ('home', 'busqueda', 'detalle', 'categoria', 'ciudad')),
    ciudad_id UUID REFERENCES ciudades(id),
    fecha_inicio TIMESTAMP WITH TIME ZONE,
    fecha_fin TIMESTAMP WITH TIME ZONE,
    activo BOOLEAN DEFAULT true,
    impresiones INT DEFAULT 0,
    clics INT DEFAULT 0,
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
    tipo VARCHAR(50) NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    mensaje TEXT NOT NULL,
    imagen_url TEXT,
    enlace_tipo VARCHAR(50),
    enlace_id UUID,
    leida BOOLEAN DEFAULT false,
    enviada_push BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notificaciones_usuario ON notificaciones(usuario_id);

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
-- REPORTES
-- =====================================================
CREATE TABLE reportes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tipo VARCHAR(50) NOT NULL,
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
-- CONFIGURACIÓN
-- =====================================================
CREATE TABLE configuracion (
    clave VARCHAR(100) PRIMARY KEY,
    valor TEXT,
    tipo VARCHAR(20) DEFAULT 'texto',
    descripcion TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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
-- CUPONES
-- =====================================================
CREATE TABLE cupones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    establecimiento_id UUID NOT NULL REFERENCES establecimientos(id) ON DELETE CASCADE,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    tipo_descuento VARCHAR(20) NOT NULL DEFAULT 'porcentaje' 
        CHECK (tipo_descuento IN ('porcentaje', 'monto_fijo', '2x1', 'gratis', 'combo')),
    valor_descuento DECIMAL(10, 2),
    consumo_minimo DECIMAL(12, 2) DEFAULT 0,
    aplica_a VARCHAR(50) DEFAULT 'todo'
        CHECK (aplica_a IN ('todo', 'comida', 'bebidas', 'postres', 'especificos')),
    descripcion_condiciones TEXT,
    max_usos_total INT,
    max_usos_por_usuario INT DEFAULT 1,
    usos_actuales INT DEFAULT 0,
    fecha_inicio TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    fecha_fin TIMESTAMP WITH TIME ZONE NOT NULL,
    dias_validos JSONB DEFAULT '["lunes","martes","miercoles","jueves","viernes","sabado","domingo"]',
    hora_inicio TIME,
    hora_fin TIME,
    imagen_url TEXT,
    color_fondo VARCHAR(7) DEFAULT '#FF6B35',
    activo BOOLEAN DEFAULT true,
    destacado BOOLEAN DEFAULT false,
    creado_por UUID REFERENCES usuarios(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_cupones_establecimiento ON cupones(establecimiento_id);
CREATE INDEX idx_cupones_codigo ON cupones(codigo);
CREATE INDEX idx_cupones_activo ON cupones(activo);
CREATE INDEX idx_cupones_fechas ON cupones(fecha_inicio, fecha_fin);

CREATE TABLE cupones_canjes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cupon_id UUID NOT NULL REFERENCES cupones(id) ON DELETE CASCADE,
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    establecimiento_id UUID NOT NULL REFERENCES establecimientos(id) ON DELETE CASCADE,
    estado VARCHAR(20) NOT NULL DEFAULT 'canjeado'
        CHECK (estado IN ('canjeado', 'usado', 'expirado', 'cancelado')),
    codigo_verificacion VARCHAR(8),
    fecha_canje TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_uso TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_canjes_cupon ON cupones_canjes(cupon_id);
CREATE INDEX idx_canjes_usuario ON cupones_canjes(usuario_id);
