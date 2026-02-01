-- =====================================================
-- MI DESTINO TU NOCHE - PARTE 1: Extensiones y Tablas Base
-- Ejecutar en: Supabase SQL Editor
-- =====================================================

-- Extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- =====================================================
-- USUARIOS
-- =====================================================
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100),
    avatar_url TEXT,
    telefono VARCHAR(20),
    google_id VARCHAR(255) UNIQUE,
    google_avatar_url TEXT,
    rol VARCHAR(20) DEFAULT 'usuario' CHECK (rol IN ('usuario', 'propietario', 'admin', 'superadmin')),
    push_token TEXT,
    notificaciones_habilitadas BOOLEAN DEFAULT true,
    activo BOOLEAN DEFAULT true,
    email_verificado BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ultimo_login TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- UBICACIÓN
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
-- TIPOS Y CATEGORÍAS
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

INSERT INTO categorias_especiales (nombre, slug, descripcion, icono, color, orden) VALUES
('Círculo Gastro', 'circulo-gastro', 'Los mejores restaurantes seleccionados por su calidad gastronómica', '⭐', '#FFD700', 1),
('Cámara de la Diversidad', 'camara-diversidad', 'Espacios inclusivos y amigables con la comunidad LGBTIQ+', '🏳️‍🌈', '#FF69B4', 2),
('Tardeo', 'tardeo', 'Los mejores lugares para disfrutar desde temprano', '🌅', '#FF8C00', 3),
('Pet Friendly', 'pet-friendly', 'Lugares donde las mascotas son bienvenidas', '🐕', '#4CAF50', 4);

-- =====================================================
-- ETIQUETAS
-- =====================================================
CREATE TABLE etiquetas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) UNIQUE,
    icono VARCHAR(50),
    categoria VARCHAR(50),
    activo BOOLEAN DEFAULT true,
    orden INT DEFAULT 0
);

INSERT INTO etiquetas (nombre, slug, icono, categoria, orden) VALUES
('WiFi gratis', 'wifi', '📶', 'servicio', 1),
('Música en vivo', 'musica-en-vivo', '🎵', 'servicio', 2),
('DJ', 'dj', '🎧', 'servicio', 3),
('Karaoke', 'karaoke', '🎤', 'servicio', 4),
('Delivery', 'delivery', '🛵', 'servicio', 5),
('Para llevar', 'para-llevar', '📦', 'servicio', 6),
('Reservaciones', 'reservaciones', '📅', 'servicio', 7),
('Terraza', 'terraza', '🌿', 'ambiente', 10),
('Rooftop', 'rooftop', '🏙️', 'ambiente', 11),
('Vista panorámica', 'vista-panoramica', '🌄', 'ambiente', 12),
('Ambiente romántico', 'romantico', '💕', 'ambiente', 13),
('Familiar', 'familiar', '👨‍👩‍👧‍👦', 'ambiente', 14),
('Ideal para grupos', 'grupos', '👥', 'ambiente', 15),
('Tranquilo', 'tranquilo', '😌', 'ambiente', 16),
('Fiestero', 'fiestero', '🎉', 'ambiente', 17),
('Parqueadero', 'parqueadero', '🅿️', 'facilidad', 20),
('Valet parking', 'valet', '🚗', 'facilidad', 21),
('Acceso discapacitados', 'accesible', '♿', 'facilidad', 22),
('Zona infantil', 'zona-infantil', '🧒', 'facilidad', 23),
('Pet friendly', 'pet-friendly', '🐕', 'facilidad', 24),
('Aire acondicionado', 'aire-acondicionado', '❄️', 'facilidad', 25),
('Zona fumadores', 'fumadores', '🚬', 'facilidad', 26),
('Efectivo', 'efectivo', '💵', 'pago', 30),
('Tarjetas', 'tarjetas', '💳', 'pago', 31),
('Nequi', 'nequi', '📱', 'pago', 32),
('Daviplata', 'daviplata', '📱', 'pago', 33);
