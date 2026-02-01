# 🌙 Mi Destino Tu Noche

**Marketplace de Restaurantes, Bares y Cafés de Colombia**

Sistema completo con Web, App Móvil (Android/iOS) y Dashboard de Administración.

---

## 📦 Contenido del Proyecto

```
mi-destino-tu-noche/
├── 📁 database/          # Esquema SQL completo
├── 📁 backend/           # API REST (Node.js + Express)
├── 📁 mobile/            # App React Native + Expo
├── 📁 web/               # Sitio web (Next.js) - Por crear
└── 📁 admin/             # Dashboard Admin (Next.js) - Por crear
```

---

## ✨ Funcionalidades Incluidas

### 📱 App Móvil
- ✅ Login con Email y **Google**
- ✅ Catálogo de establecimientos
- ✅ Búsqueda y filtros avanzados
- ✅ Geolocalización "Cerca de ti"
- ✅ Mapa interactivo
- ✅ Ficha detallada (fotos, horarios, contacto)
- ✅ Sistema de valoraciones y reseñas
- ✅ Favoritos
- ✅ Lista "Quiero ir"
- ✅ Historial de visitas
- ✅ Compartir en redes sociales
- ✅ Notificaciones push
- ✅ Perfil de usuario

### 🏷️ Categorías Especiales
- ⭐ **Círculo Gastro** - Restaurantes premium
- 🏳️‍🌈 **Cámara de la Diversidad** - Bares LGBTIQ+
- 🌅 **Tardeo** - Lugares para disfrutar desde temprano
- 🐕 **Pet Friendly** - Acepta mascotas

### 🏷️ Etiquetas Disponibles
- WiFi gratis 📶
- Música en vivo 🎵
- DJ 🎧
- Karaoke 🎤
- Terraza 🌿
- Rooftop 🏙️
- Parqueadero 🅿️
- Pet friendly 🐕
- Y muchas más...

### 🖥️ Dashboard Admin
- ✅ Estadísticas generales
- ✅ CRUD de establecimientos
- ✅ Gestión de galería de fotos
- ✅ Gestión de menús y precios
- ✅ Gestión de ciudades
- ✅ Gestión de etiquetas
- ✅ Categorías especiales
- ✅ Moderación de valoraciones
- ✅ Gestión de usuarios
- ✅ Gestión de banners publicitarios
- ✅ Notificaciones masivas

---

## 🚀 Instalación

### 1. Base de Datos (Supabase)

1. Crear cuenta en [supabase.com](https://supabase.com)
2. Crear nuevo proyecto
3. Ir a **SQL Editor**
4. Ejecutar el contenido de `database/schema.sql`

### 2. Backend

```bash
cd backend
cp .env.example .env
# Editar .env con tus credenciales

npm install
npm run dev
```

**Variables de entorno necesarias:**
```env
DATABASE_URL=postgresql://...
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=...
JWT_SECRET=tu-clave-secreta
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
```

### 3. App Móvil

```bash
cd mobile
npm install
npx expo start
```

**Para Google Sign In:**
1. Crear proyecto en [Google Cloud Console](https://console.cloud.google.com)
2. Habilitar Google Sign-In API
3. Crear credenciales OAuth 2.0
4. Configurar en `app.json` y código

### 4. Generar APK

```bash
npm install -g eas-cli
eas login
eas build --platform android --profile preview
```

---

## 📊 Arquitectura

```
                    ┌─────────────────┐
                    │    USUARIOS     │
                    └────────┬────────┘
                             │
          ┌──────────────────┼──────────────────┐
          ▼                  ▼                  ▼
    ┌──────────┐       ┌──────────┐       ┌──────────┐
    │   App    │       │   Web    │       │  Admin   │
    │  Mobile  │       │  Next.js │       │Dashboard │
    └────┬─────┘       └────┬─────┘       └────┬─────┘
         │                  │                  │
         └──────────────────┼──────────────────┘
                            ▼
                    ┌───────────────┐
                    │   Backend     │
                    │   Node.js     │
                    │   Express     │
                    └───────┬───────┘
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
        ┌──────────┐  ┌──────────┐  ┌──────────┐
        │ Supabase │  │Cloudinary│  │ Firebase │
        │PostgreSQL│  │ Imágenes │  │  Push    │
        └──────────┘  └──────────┘  └──────────┘
```

---

## 💰 Costos de Plataformas

| Servicio | Plan Gratis | Plan Pago |
|----------|-------------|-----------|
| **Supabase** | 500MB datos | $25/mes |
| **Railway** (Backend) | $5 crédito/mes | $5/mes |
| **Vercel** (Web) | 100GB bandwidth | $0 |
| **Cloudinary** | 25GB storage | $0 |
| **Google Play** | - | $25 única vez |
| **App Store** | - | $99/año |

**Total mínimo:** $0-5/mes + costos de tiendas

---

## 📱 Publicación en Tiendas

### Android (Google Play)
1. Crear cuenta en [Google Play Console](https://play.google.com/console) ($25)
2. Generar APK firmado: `eas build --platform android`
3. Subir APK y completar ficha
4. Esperar aprobación (1-3 días)

### iOS (App Store)
1. Crear cuenta en [Apple Developer](https://developer.apple.com) ($99/año)
2. Generar IPA: `eas build --platform ios`
3. Subir a App Store Connect
4. Esperar aprobación (1-7 días)

---

## 🔧 API Endpoints

### Autenticación
```
POST /api/v1/auth/registro      # Registro con email
POST /api/v1/auth/login         # Login con email
POST /api/v1/auth/google        # Login con Google
POST /api/v1/auth/refresh       # Refrescar token
POST /api/v1/auth/logout        # Cerrar sesión
```

### Establecimientos
```
GET  /api/v1/establecimientos           # Listar (con filtros)
GET  /api/v1/establecimientos/destacados # Destacados
GET  /api/v1/establecimientos/cercanos   # Cercanos (geolocalización)
GET  /api/v1/establecimientos/:slug      # Detalle
GET  /api/v1/establecimientos/categoria/:slug # Por categoría especial
```

### Usuario
```
GET  /api/v1/favoritos          # Mis favoritos
POST /api/v1/favoritos/:id/toggle # Agregar/quitar favorito
GET  /api/v1/quiero-ir          # Mi lista
GET  /api/v1/historial          # Mi historial
GET  /api/v1/usuarios/perfil    # Mi perfil
```

### Admin
```
GET  /api/v1/admin/dashboard           # Estadísticas
GET  /api/v1/admin/establecimientos    # Listar
POST /api/v1/admin/establecimientos    # Crear
PUT  /api/v1/admin/establecimientos/:id # Editar
DELETE /api/v1/admin/establecimientos/:id # Eliminar
```

---

## 🎨 Personalización

### Colores (modificar en estilos)
```javascript
const COLORS = {
  primary: '#FF6B35',      // Naranja
  secondary: '#1A1A2E',    // Azul oscuro
  background: '#0F0F1A',   // Negro
  success: '#10B981',      // Verde
  rating: '#FCD34D',       // Amarillo
};
```

### Logo y Splash
- Reemplazar `mobile/assets/icon.png` (1024x1024)
- Reemplazar `mobile/assets/splash.png` (1242x2436)
- Reemplazar `mobile/assets/adaptive-icon.png` (1024x1024)

---

## 📞 Soporte

Desarrollado para **Asobares Colombia**

- 📧 Email: contacto@midestinotunoche.com
- 📱 WhatsApp: +57 321 230 4589
- 🌐 Web: https://midestinotunoche.com

---

## 📄 Licencia

Este proyecto es propiedad de Asobares. Todos los derechos reservados.
