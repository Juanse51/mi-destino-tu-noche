# 🚀 Guía de Despliegue - Mi Destino Tu Noche

## Paso 2: Desplegar Backend en Render

### 2.1 Subir código a GitHub

1. Ve a https://github.com y crea un repositorio nuevo:
   - Nombre: `mi-destino-tu-noche`
   - Privado (recomendado)
   - NO marcar "Add README" ni nada más

2. En tu terminal (Mac):
```bash
cd ~/Downloads/mi-destino-tu-noche   # o donde tengas la carpeta
git init
git add .
git commit -m "Initial commit - Mi Destino Tu Noche"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/mi-destino-tu-noche.git
git push -u origin main
```

### 2.2 Obtener Database URL de Supabase

1. En Supabase → Settings → Database
2. Busca "Connection string" → pestaña "URI"
3. Copia el string. Se ve así:
   `postgresql://postgres.[project-id]:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres`
4. Reemplaza `[YOUR-PASSWORD]` con la contraseña que pusiste al crear el proyecto

### 2.3 Crear servicio en Render

1. Ve a https://render.com y crea cuenta (puedes usar GitHub)
2. Dashboard → "New" → "Web Service"
3. Conecta tu repositorio de GitHub `mi-destino-tu-noche`
4. Configura:
   - **Name:** `mi-destino-api`
   - **Region:** Oregon (US West)
   - **Branch:** main
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free

5. En "Environment Variables" agrega estas variables:

| Variable | Valor |
|----------|-------|
| NODE_ENV | production |
| PORT | 3001 |
| DATABASE_URL | (el connection string de Supabase del paso 2.2) |
| SUPABASE_URL | https://xzvfwxlgrwzcpofdubmg.supabase.co |
| SUPABASE_ANON_KEY | (tu anon key) |
| SUPABASE_SERVICE_KEY | (tu service_role key) |
| JWT_SECRET | (genera uno: abre terminal y escribe `openssl rand -base64 32`) |
| JWT_REFRESH_SECRET | (genera otro: `openssl rand -base64 32`) |
| CORS_ORIGINS | https://midestinotunoche.com,https://admin.midestinotunoche.com |

6. Clic en "Create Web Service"
7. Espera ~3-5 minutos mientras se despliega
8. Cuando diga "Live", tu API estará en algo como:
   `https://mi-destino-api.onrender.com`

### 2.4 Verificar que funciona

Abre en tu navegador:
```
https://mi-destino-api.onrender.com/health
```
Debería responder: `{"status":"ok","timestamp":"..."}`

---

## Paso 3: Desplegar Web en Vercel

### 3.1 Crear proyecto en Vercel

1. Ve a https://vercel.com y crea cuenta (usa GitHub)
2. "Add New" → "Project"
3. Importa el repositorio `mi-destino-tu-noche`
4. Configura:
   - **Framework Preset:** Next.js
   - **Root Directory:** `web`

5. En "Environment Variables":

| Variable | Valor |
|----------|-------|
| NEXT_PUBLIC_API_URL | https://mi-destino-api.onrender.com/api/v1 |
| NEXT_PUBLIC_SUPABASE_URL | https://xzvfwxlgrwzcpofdubmg.supabase.co |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | (tu anon key) |

6. "Deploy"

### 3.2 Conectar dominio personalizado

1. En Vercel → tu proyecto → Settings → Domains
2. Agrega: `midestinotunoche.com` (o tu dominio)
3. Vercel te dará registros DNS para configurar
4. Ve al panel de tu proveedor de dominio y agrega:
   - Tipo: CNAME
   - Nombre: @ (o www)
   - Valor: `cname.vercel-dns.com`

---

## Paso 4: Desplegar Admin en Vercel

1. En Vercel → "Add New" → "Project"
2. Importa el MISMO repositorio
3. Configura:
   - **Root Directory:** `admin`
   - **Framework Preset:** Next.js

4. Environment Variables (mismas + una extra):

| Variable | Valor |
|----------|-------|
| NEXT_PUBLIC_API_URL | https://mi-destino-api.onrender.com/api/v1 |
| NEXT_PUBLIC_SUPABASE_URL | https://xzvfwxlgrwzcpofdubmg.supabase.co |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | (tu anon key) |

5. Deploy → Conectar subdominio `admin.midestinotunoche.com`

---

## Paso 5: App Móvil (Play Store / App Store)

Esto requiere cuentas de desarrollador:
- Google Play Console: $25 USD (pago único)
- Apple Developer: $99 USD/año

Para build:
```bash
cd mobile
npx expo install expo-dev-client
eas build --platform android  # Para APK/AAB
eas build --platform ios      # Para iOS (necesita Mac o EAS)
```
