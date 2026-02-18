// Script para aplicar cambios al HomeScreen y App.tsx
// Ejecutar: node fix-app-colors.js

const fs = require('fs');
const path = require('path');

// 1. Fix HomeScreen.tsx - cambiar header y colores
const homeFile = path.join(__dirname, 'src/screens/HomeScreen.tsx');
let home = fs.readFileSync(homeFile, 'utf8');

// Reemplazar header con logo
home = home.replace(
  `{/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{saludo()} 👋</Text>
            <Text style={styles.title}>
              {isAuthenticated ? usuario?.nombre : '¿A dónde vamos?'}
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.notifButton}
            onPress={() => isAuthenticated ? navigation.navigate('Notificaciones') : navigation.navigate('Login')}
          >
            <Text style={styles.notifIcon}>🔔</Text>
          </TouchableOpacity>
        </View>`,
  `{/* Header con Logo */}
        <View style={styles.header}>
          <Image 
            source={{ uri: 'https://xzvfwxlgrwzcpofdubmg.supabase.co/storage/v1/object/public/imagenes/logos/logo%20mi%20destino%20tu%20noche.png' }}
            style={styles.headerLogo}
            resizeMode="contain"
          />
          <TouchableOpacity 
            style={styles.notifButton}
            onPress={() => isAuthenticated ? navigation.navigate('Notificaciones') : navigation.navigate('Login')}
          >
            <Text style={styles.notifIcon}>🔔</Text>
          </TouchableOpacity>
        </View>`
);

// Cambiar todos los colores naranja a azul
home = home.replace(/#FF6B35/g, '#0073FF');
home = home.replace(/rgba\(255, 107, 53/g, 'rgba(0, 115, 255');

// Agregar estilo headerLogo después de header style
home = home.replace(
  `notifButton: {`,
  `headerLogo: { height: 45, width: 180 },
  notifButton: {`
);

fs.writeFileSync(homeFile, home);
console.log('✅ HomeScreen.tsx actualizado');

// 2. Fix App.tsx - cambiar colores
const appFile = path.join(__dirname, 'App.tsx');
let app = fs.readFileSync(appFile, 'utf8');

app = app.replace(/#FF6B35/g, '#0073FF');
app = app.replace(/rgba\(255, 107, 53/g, 'rgba(0, 115, 255');

fs.writeFileSync(appFile, app);
console.log('✅ App.tsx actualizado');

// 3. Fix otros screens que puedan tener naranja
const screensDir = path.join(__dirname, 'src/screens');
const files = fs.readdirSync(screensDir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(screensDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('#FF6B35')) {
    content = content.replace(/#FF6B35/g, '#0073FF');
    content = content.replace(/rgba\(255, 107, 53/g, 'rgba(0, 115, 255');
    fs.writeFileSync(filePath, content);
    console.log(`✅ ${file} - colores actualizados`);
  }
}

console.log('\n✅ Todos los archivos actualizados');
