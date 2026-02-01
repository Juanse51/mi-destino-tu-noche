-- =====================================================
-- MIGRACIÓN: Sistema de Cupones
-- =====================================================

-- Tabla principal de cupones
CREATE TABLE cupones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    establecimiento_id UUID NOT NULL REFERENCES establecimientos(id) ON DELETE CASCADE,
    
    -- Info del cupón
    codigo VARCHAR(50) UNIQUE NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    
    -- Tipo de descuento
    tipo_descuento VARCHAR(20) NOT NULL DEFAULT 'porcentaje' 
        CHECK (tipo_descuento IN ('porcentaje', 'monto_fijo', '2x1', 'gratis', 'combo')),
    valor_descuento DECIMAL(10, 2),  -- porcentaje (0-100) o monto fijo en COP
    
    -- Condiciones
    consumo_minimo DECIMAL(12, 2) DEFAULT 0,
    aplica_a VARCHAR(50) DEFAULT 'todo'
        CHECK (aplica_a IN ('todo', 'comida', 'bebidas', 'postres', 'especificos')),
    descripcion_condiciones TEXT,
    
    -- Límites de uso
    max_usos_total INT,           -- NULL = ilimitado
    max_usos_por_usuario INT DEFAULT 1,
    usos_actuales INT DEFAULT 0,
    
    -- Vigencia
    fecha_inicio TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    fecha_fin TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Días válidos (JSON: ["lunes", "martes", ...])
    dias_validos JSONB DEFAULT '["lunes","martes","miercoles","jueves","viernes","sabado","domingo"]',
    hora_inicio TIME,
    hora_fin TIME,
    
    -- Imagen / Diseño
    imagen_url TEXT,
    color_fondo VARCHAR(7) DEFAULT '#FF6B35',
    
    -- Estado
    activo BOOLEAN DEFAULT true,
    destacado BOOLEAN DEFAULT false,
    
    -- Creador
    creado_por UUID REFERENCES usuarios(id),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_cupones_establecimiento ON cupones(establecimiento_id);
CREATE INDEX idx_cupones_codigo ON cupones(codigo);
CREATE INDEX idx_cupones_activo ON cupones(activo);
CREATE INDEX idx_cupones_fechas ON cupones(fecha_inicio, fecha_fin);
CREATE INDEX idx_cupones_destacado ON cupones(destacado) WHERE destacado = true;

-- Registro de canjes / uso de cupones
CREATE TABLE cupones_canjes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cupon_id UUID NOT NULL REFERENCES cupones(id) ON DELETE CASCADE,
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    establecimiento_id UUID NOT NULL REFERENCES establecimientos(id) ON DELETE CASCADE,
    
    -- Info del canje
    estado VARCHAR(20) NOT NULL DEFAULT 'canjeado'
        CHECK (estado IN ('canjeado', 'usado', 'expirado', 'cancelado')),
    codigo_verificacion VARCHAR(8),  -- código corto para verificar en el local
    
    -- Timestamps
    fecha_canje TIMESTAMP WITH TIME ZONE DEFAULT NOW(),  -- cuando el usuario tomó el cupón
    fecha_uso TIMESTAMP WITH TIME ZONE,                   -- cuando lo usó en el local
    
    UNIQUE(cupon_id, usuario_id, fecha_canje)
);

CREATE INDEX idx_canjes_cupon ON cupones_canjes(cupon_id);
CREATE INDEX idx_canjes_usuario ON cupones_canjes(usuario_id);
CREATE INDEX idx_canjes_establecimiento ON cupones_canjes(establecimiento_id);

-- Función para verificar disponibilidad de cupón
CREATE OR REPLACE FUNCTION verificar_cupon(
    p_codigo VARCHAR,
    p_usuario_id UUID
) RETURNS TABLE (
    valido BOOLEAN,
    mensaje TEXT,
    cupon_id UUID,
    titulo VARCHAR,
    tipo_descuento VARCHAR,
    valor_descuento DECIMAL,
    establecimiento_nombre VARCHAR
) AS $$
DECLARE
    v_cupon RECORD;
    v_usos_usuario INT;
BEGIN
    -- Buscar cupón
    SELECT c.*, e.nombre as est_nombre INTO v_cupon
    FROM cupones c
    JOIN establecimientos e ON e.id = c.establecimiento_id
    WHERE c.codigo = UPPER(p_codigo);
    
    IF v_cupon IS NULL THEN
        RETURN QUERY SELECT false, 'Cupón no encontrado'::TEXT, NULL::UUID, NULL::VARCHAR, NULL::VARCHAR, NULL::DECIMAL, NULL::VARCHAR;
        RETURN;
    END IF;
    
    -- Verificar activo
    IF NOT v_cupon.activo THEN
        RETURN QUERY SELECT false, 'Este cupón está inactivo'::TEXT, v_cupon.id, v_cupon.titulo, v_cupon.tipo_descuento, v_cupon.valor_descuento, v_cupon.est_nombre::VARCHAR;
        RETURN;
    END IF;
    
    -- Verificar fechas
    IF NOW() < v_cupon.fecha_inicio THEN
        RETURN QUERY SELECT false, 'Este cupón aún no está vigente'::TEXT, v_cupon.id, v_cupon.titulo, v_cupon.tipo_descuento, v_cupon.valor_descuento, v_cupon.est_nombre::VARCHAR;
        RETURN;
    END IF;
    
    IF NOW() > v_cupon.fecha_fin THEN
        RETURN QUERY SELECT false, 'Este cupón ha expirado'::TEXT, v_cupon.id, v_cupon.titulo, v_cupon.tipo_descuento, v_cupon.valor_descuento, v_cupon.est_nombre::VARCHAR;
        RETURN;
    END IF;
    
    -- Verificar usos totales
    IF v_cupon.max_usos_total IS NOT NULL AND v_cupon.usos_actuales >= v_cupon.max_usos_total THEN
        RETURN QUERY SELECT false, 'Este cupón ha alcanzado el límite de usos'::TEXT, v_cupon.id, v_cupon.titulo, v_cupon.tipo_descuento, v_cupon.valor_descuento, v_cupon.est_nombre::VARCHAR;
        RETURN;
    END IF;
    
    -- Verificar usos por usuario
    SELECT COUNT(*) INTO v_usos_usuario
    FROM cupones_canjes
    WHERE cupon_id = v_cupon.id AND usuario_id = p_usuario_id AND estado IN ('canjeado', 'usado');
    
    IF v_usos_usuario >= v_cupon.max_usos_por_usuario THEN
        RETURN QUERY SELECT false, 'Ya has usado este cupón el máximo de veces permitido'::TEXT, v_cupon.id, v_cupon.titulo, v_cupon.tipo_descuento, v_cupon.valor_descuento, v_cupon.est_nombre::VARCHAR;
        RETURN;
    END IF;
    
    -- Cupón válido
    RETURN QUERY SELECT true, 'Cupón válido'::TEXT, v_cupon.id, v_cupon.titulo, v_cupon.tipo_descuento, v_cupon.valor_descuento, v_cupon.est_nombre::VARCHAR;
END;
$$ LANGUAGE plpgsql;

-- Datos de ejemplo
INSERT INTO cupones (establecimiento_id, codigo, titulo, descripcion, tipo_descuento, valor_descuento, consumo_minimo, max_usos_total, max_usos_por_usuario, fecha_inicio, fecha_fin, dias_validos, activo, destacado, color_fondo) VALUES
((SELECT id FROM establecimientos WHERE slug = 'andres-carne-de-res' LIMIT 1), 'ANDRES20', '20% de descuento', 'Válido en toda la carta de platos principales', 'porcentaje', 20, 50000, 200, 1, NOW(), NOW() + INTERVAL '60 days', '["lunes","martes","miercoles","jueves","viernes"]', true, true, '#FF6B35'),
((SELECT id FROM establecimientos WHERE slug = 'andres-carne-de-res' LIMIT 1), 'ANDRES2X1', '2x1 en Cócteles', 'Aplica en cócteles de la casa', '2x1', NULL, 0, 100, 1, NOW(), NOW() + INTERVAL '30 days', '["jueves","viernes","sabado"]', true, false, '#8B5CF6'),
((SELECT id FROM establecimientos WHERE slug = 'carmen' LIMIT 1), 'CARMEN15', '$15.000 de descuento', 'En consumos superiores a $80.000', 'monto_fijo', 15000, 80000, 150, 1, NOW(), NOW() + INTERVAL '45 days', '["lunes","martes","miercoles","jueves","viernes","sabado","domingo"]', true, true, '#10B981'),
((SELECT id FROM establecimientos WHERE slug = 'el-cielo' LIMIT 1), 'CIELOFREE', 'Postre gratis', 'Postre de la casa gratis con cualquier plato principal', 'gratis', NULL, 60000, 50, 1, NOW(), NOW() + INTERVAL '20 days', '["viernes","sabado"]', true, true, '#F59E0B');
