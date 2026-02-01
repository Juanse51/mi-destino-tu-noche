-- =====================================================
-- MI DESTINO TU NOCHE - PARTE 3: Funciones, Triggers, Datos y RLS
-- Ejecutar en: Supabase SQL Editor (después de Parte 2)
-- =====================================================

-- =====================================================
-- FUNCIONES Y TRIGGERS
-- =====================================================

-- Actualizar timestamp automáticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_usuarios_updated BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_establecimientos_updated BEFORE UPDATE ON establecimientos FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_valoraciones_updated BEFORE UPDATE ON valoraciones FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_banners_updated BEFORE UPDATE ON banners FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_cupones_updated BEFORE UPDATE ON cupones FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Generar slug
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

-- Auto-generar slug de establecimientos
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

-- Auto-actualizar ubicación geográfica
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

-- Auto-actualizar valoración promedio
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

-- Verificar cupón
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
    SELECT c.*, e.nombre as est_nombre INTO v_cupon
    FROM cupones c
    JOIN establecimientos e ON e.id = c.establecimiento_id
    WHERE c.codigo = UPPER(p_codigo);
    
    IF v_cupon IS NULL THEN
        RETURN QUERY SELECT false, 'Cupón no encontrado'::TEXT, NULL::UUID, NULL::VARCHAR, NULL::VARCHAR, NULL::DECIMAL, NULL::VARCHAR;
        RETURN;
    END IF;
    
    IF NOT v_cupon.activo THEN
        RETURN QUERY SELECT false, 'Cupón inactivo'::TEXT, v_cupon.id, v_cupon.titulo, v_cupon.tipo_descuento, v_cupon.valor_descuento, v_cupon.est_nombre::VARCHAR;
        RETURN;
    END IF;
    
    IF NOW() < v_cupon.fecha_inicio THEN
        RETURN QUERY SELECT false, 'Cupón aún no vigente'::TEXT, v_cupon.id, v_cupon.titulo, v_cupon.tipo_descuento, v_cupon.valor_descuento, v_cupon.est_nombre::VARCHAR;
        RETURN;
    END IF;
    
    IF NOW() > v_cupon.fecha_fin THEN
        RETURN QUERY SELECT false, 'Cupón expirado'::TEXT, v_cupon.id, v_cupon.titulo, v_cupon.tipo_descuento, v_cupon.valor_descuento, v_cupon.est_nombre::VARCHAR;
        RETURN;
    END IF;
    
    IF v_cupon.max_usos_total IS NOT NULL AND v_cupon.usos_actuales >= v_cupon.max_usos_total THEN
        RETURN QUERY SELECT false, 'Cupón agotado'::TEXT, v_cupon.id, v_cupon.titulo, v_cupon.tipo_descuento, v_cupon.valor_descuento, v_cupon.est_nombre::VARCHAR;
        RETURN;
    END IF;
    
    SELECT COUNT(*) INTO v_usos_usuario
    FROM cupones_canjes
    WHERE cupon_id = v_cupon.id AND usuario_id = p_usuario_id AND estado IN ('canjeado', 'usado');
    
    IF v_usos_usuario >= v_cupon.max_usos_por_usuario THEN
        RETURN QUERY SELECT false, 'Ya usaste este cupón'::TEXT, v_cupon.id, v_cupon.titulo, v_cupon.tipo_descuento, v_cupon.valor_descuento, v_cupon.est_nombre::VARCHAR;
        RETURN;
    END IF;
    
    RETURN QUERY SELECT true, 'Cupón válido'::TEXT, v_cupon.id, v_cupon.titulo, v_cupon.tipo_descuento, v_cupon.valor_descuento, v_cupon.est_nombre::VARCHAR;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- DATOS INICIALES: Departamentos y Ciudades
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
-- USUARIO ADMIN INICIAL
-- (password: Admin123! - hash bcrypt)
-- =====================================================
INSERT INTO usuarios (email, password_hash, nombre, apellido, rol, activo, email_verificado) VALUES
('admin@midestinotunoche.com', '$2b$10$8K1p3uE6PGb1HZWBZN8Kz.Wy8C5p2mRkKVhdJ.p0Nj5bK3vvO2Vm6', 'Admin', 'Principal', 'superadmin', true, true);

-- =====================================================
-- STORAGE BUCKET (ejecutar en Supabase dashboard)
-- Nota: Los buckets se crean mejor desde el panel
-- pero dejamos el SQL por referencia
-- =====================================================
-- INSERT INTO storage.buckets (id, name, public) VALUES ('imagenes', 'imagenes', true);

-- =====================================================
-- POLÍTICAS DE SEGURIDAD (RLS)
-- =====================================================

ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE establecimientos ENABLE ROW LEVEL SECURITY;
ALTER TABLE valoraciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE favoritos ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiero_ir ENABLE ROW LEVEL SECURITY;
ALTER TABLE historial_visitas ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE cupones ENABLE ROW LEVEL SECURITY;
ALTER TABLE cupones_canjes ENABLE ROW LEVEL SECURITY;

-- Lectura pública
CREATE POLICY "establecimientos_public_read" ON establecimientos FOR SELECT USING (activo = true);
CREATE POLICY "valoraciones_public_read" ON valoraciones FOR SELECT USING (estado = 'publicada');
CREATE POLICY "cupones_public_read" ON cupones FOR SELECT USING (activo = true AND fecha_fin >= NOW());

-- Políticas de acceso autenticado  
CREATE POLICY "usuarios_self_read" ON usuarios FOR SELECT USING (auth.uid() = id);
CREATE POLICY "usuarios_self_update" ON usuarios FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "favoritos_self_read" ON favoritos FOR SELECT USING (auth.uid() = usuario_id);
CREATE POLICY "favoritos_self_manage" ON favoritos FOR ALL USING (auth.uid() = usuario_id);

CREATE POLICY "quiero_ir_self_read" ON quiero_ir FOR SELECT USING (auth.uid() = usuario_id);
CREATE POLICY "quiero_ir_self_manage" ON quiero_ir FOR ALL USING (auth.uid() = usuario_id);

CREATE POLICY "historial_self_read" ON historial_visitas FOR SELECT USING (auth.uid() = usuario_id);
CREATE POLICY "historial_self_insert" ON historial_visitas FOR INSERT WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "notificaciones_self_read" ON notificaciones FOR SELECT USING (auth.uid() = usuario_id);
CREATE POLICY "notificaciones_self_update" ON notificaciones FOR UPDATE USING (auth.uid() = usuario_id);

CREATE POLICY "canjes_self_read" ON cupones_canjes FOR SELECT USING (auth.uid() = usuario_id);
CREATE POLICY "canjes_self_insert" ON cupones_canjes FOR INSERT WITH CHECK (auth.uid() = usuario_id);

-- =====================================================
-- ¡LISTO! Base de datos completa
-- =====================================================
