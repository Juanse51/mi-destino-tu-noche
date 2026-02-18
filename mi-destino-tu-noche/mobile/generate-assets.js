// Generar assets para la app: icon.png, splash.png, adaptive-icon.png, favicon.png
// Ejecutar: npm install sharp && node generate-assets.js

const sharp = require('sharp');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, 'assets');
const LOGO_PATH = path.join(ASSETS_DIR, 'logo.png');
const BG_COLOR = { r: 26, g: 26, b: 46, alpha: 1 }; // #1a1a2e

async function generateIcon() {
  // icon.png - 1024x1024 con logo centrado sobre fondo oscuro
  const logoBuffer = await sharp(LOGO_PATH)
    .resize(700, 700, { fit: 'inside', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  await sharp({
    create: { width: 1024, height: 1024, channels: 4, background: BG_COLOR }
  })
    .composite([{ input: logoBuffer, gravity: 'centre' }])
    .png()
    .toFile(path.join(ASSETS_DIR, 'icon.png'));

  console.log('✅ icon.png (1024x1024)');
}

async function generateAdaptiveIcon() {
  // adaptive-icon.png - 1024x1024 con más padding para Android
  const logoBuffer = await sharp(LOGO_PATH)
    .resize(600, 600, { fit: 'inside', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  await sharp({
    create: { width: 1024, height: 1024, channels: 4, background: BG_COLOR }
  })
    .composite([{ input: logoBuffer, gravity: 'centre' }])
    .png()
    .toFile(path.join(ASSETS_DIR, 'adaptive-icon.png'));

  console.log('✅ adaptive-icon.png (1024x1024)');
}

async function generateSplash() {
  // splash.png - 1284x2778 (iPhone 14 Pro Max size)
  const logoBuffer = await sharp(LOGO_PATH)
    .resize(800, 800, { fit: 'inside', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  await sharp({
    create: { width: 1284, height: 2778, channels: 4, background: BG_COLOR }
  })
    .composite([{ input: logoBuffer, gravity: 'centre' }])
    .png()
    .toFile(path.join(ASSETS_DIR, 'splash.png'));

  console.log('✅ splash.png (1284x2778)');
}

async function generateFavicon() {
  // favicon.png - 48x48
  const logoBuffer = await sharp(LOGO_PATH)
    .resize(40, 40, { fit: 'inside', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  await sharp({
    create: { width: 48, height: 48, channels: 4, background: BG_COLOR }
  })
    .composite([{ input: logoBuffer, gravity: 'centre' }])
    .png()
    .toFile(path.join(ASSETS_DIR, 'favicon.png'));

  console.log('✅ favicon.png (48x48)');
}

async function main() {
  console.log('🎨 Generando assets...\n');
  await generateIcon();
  await generateAdaptiveIcon();
  await generateSplash();
  await generateFavicon();
  console.log('\n✅ Todos los assets generados en /assets/');
}

main().catch(err => console.error('Error:', err));
