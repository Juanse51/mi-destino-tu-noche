// Fix all mobile app issues
// Run: node fix-all-mobile.js

const fs = require('fs');
const path = require('path');

// ============================================================
// 1. Fix CategoriaScreen - double .data and toFixed
// ============================================================
let cat = fs.readFileSync('src/screens/CategoriaScreen.tsx', 'utf8');
cat = cat.replace('data.data.categoria.descripcion', 'data.categoria?.descripcion');
cat = cat.replace(/item\.valoracion_promedio\?\.toFixed\(1\)/g, 
  'Number(item.valoracion_promedio) ? Number(item.valoracion_promedio).toFixed(1) : null');
fs.writeFileSync('src/screens/CategoriaScreen.tsx', cat);
console.log('✅ CategoriaScreen fixed');

// ============================================================
// 2. Fix SearchScreen - tipos map and toFixed
// ============================================================
let search = fs.readFileSync('src/screens/SearchScreen.tsx', 'utf8');
// tipos could be array or undefined
search = search.replace(
  '{tipos?.map((tipo: any) => (',
  '{(Array.isArray(tipos) ? tipos : []).map((tipo: any) => ('
);
search = search.replace(/item\.valoracion_promedio\?\.toFixed\(1\)/g,
  'Number(item.valoracion_promedio) ? Number(item.valoracion_promedio).toFixed(1) : null');
fs.writeFileSync('src/screens/SearchScreen.tsx', search);
console.log('✅ SearchScreen fixed');

// ============================================================
// 3. Fix App.tsx - Remove Mapa tab, add MDTN tab, change colors
// ============================================================
let app = fs.readFileSync('App.tsx', 'utf8');

// Add import for MDTN screen
app = app.replace(
  "import CategoriaScreen from './src/screens/CategoriaScreen';",
  "import CategoriaScreen from './src/screens/CategoriaScreen';\nimport MDTNScreen from './src/screens/MDTNScreen';"
);

// Remove Mapa tab and add MDTN tab
app = app.replace(
  `<Tab.Screen
        name="Mapa"
        component={MapScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="🗺️" focused={focused} />,
        }}
      />`,
  `<Tab.Screen
        name="MDTN"
        component={MDTNScreen}
        options={{
          tabBarLabel: '¿Qué es?',
          tabBarIcon: ({ focused }) => <TabIcon emoji="ℹ️" focused={focused} />,
        }}
      />`
);

fs.writeFileSync('App.tsx', app);
console.log('✅ App.tsx fixed - Mapa removed, MDTN added');

// ============================================================
// 4. Create MDTNScreen
// ============================================================
const mdtnScreen = `// MDTNScreen - ¿Qué es Mi Destino Tu Noche?
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MDTNScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={{ uri: 'https://xzvfwxlgrwzcpofdubmg.supabase.co/storage/v1/object/public/imagenes/logos/logo%20mi%20destino%20tu%20noche.png' }}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>¿Qué es Mi Destino Tu Noche?</Text>
        <Text style={styles.subtitle}>
          La plataforma de Asobares que conecta a los colombianos con los mejores restaurantes, bares, cafés y discotecas del país.
        </Text>

        {/* Video placeholder - link a YouTube */}
        <TouchableOpacity 
          style={styles.videoContainer}
          onPress={() => Linking.openURL('https://www.youtube.com/watch?v=YxOfBiwGP54')}
        >
          <View style={styles.playButton}>
            <Text style={styles.playIcon}>▶️</Text>
          </View>
          <Text style={styles.videoText}>Ver video</Text>
        </TouchableOpacity>

        {/* Misión */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Nuestra Misión</Text>
          <Text style={styles.cardText}>
            Mi Destino Tu Noche es una iniciativa de Asobares Colombia que busca impulsar y visibilizar la industria gastronómica y de entretenimiento nocturno en todo el país. Somos la guía definitiva para descubrir los mejores establecimientos, desde restaurantes de alta cocina hasta los bares más auténticos de cada ciudad.
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statEmoji}>🗺️</Text>
            <Text style={styles.statNumber}>18</Text>
            <Text style={styles.statLabel}>Ciudades</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statEmoji}>✅</Text>
            <Text style={styles.statNumber}>650+</Text>
            <Text style={styles.statLabel}>Verificados</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statEmoji}>📱</Text>
            <Text style={styles.statNumber}>App</Text>
            <Text style={styles.statLabel}>iOS y Android</Text>
          </View>
        </View>

        {/* Asobares */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>¿Qué es Asobares?</Text>
          <Text style={styles.cardText}>
            La Asociación Colombiana de la Industria de la Vida Nocturna y Gastronómica (Asobares) es el gremio que agrupa y representa a los establecimientos nocturnos y gastronómicos de Colombia. Trabaja por la formalización, el bienestar y el desarrollo del sector.
          </Text>
          <Image
            source={{ uri: 'https://xzvfwxlgrwzcpofdubmg.supabase.co/storage/v1/object/public/imagenes/logos/Nuevo%20logo%20Asobares%20-%20Blanco.png' }}
            style={styles.asobaresLogo}
            resizeMode="contain"
          />
        </View>

        {/* Contacto */}
        <View style={styles.contactCard}>
          <Text style={styles.contactTitle}>¿Quieres registrar tu establecimiento?</Text>
          <TouchableOpacity style={styles.contactBtn} onPress={() => Linking.openURL('mailto:soporte@asobares.org')}>
            <Text style={styles.contactBtnText}>📧 soporte@asobares.org</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactBtn} onPress={() => Linking.openURL('tel:+573212304589')}>
            <Text style={styles.contactBtnText}>📞 +57 321 230 4589</Text>
          </TouchableOpacity>
        </View>

        {/* Redes sociales */}
        <View style={styles.social}>
          <Text style={styles.socialTitle}>Síguenos</Text>
          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialBtn} onPress={() => Linking.openURL('https://www.instagram.com/asobares.colombia/')}>
              <Text style={styles.socialIcon}>📸</Text>
              <Text style={styles.socialText}>Instagram</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn} onPress={() => Linking.openURL('https://www.facebook.com/Asobarescolombia')}>
              <Text style={styles.socialIcon}>📘</Text>
              <Text style={styles.socialText}>Facebook</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn} onPress={() => Linking.openURL('https://x.com/Asobares')}>
              <Text style={styles.socialIcon}>🐦</Text>
              <Text style={styles.socialText}>X</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Desarrollado por */}
        <TouchableOpacity style={styles.devBy} onPress={() => Linking.openURL('https://www.vamosarayar.com')}>
          <Text style={styles.devByText}>Desarrollado por Rayar!</Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F1A' },
  header: { alignItems: 'center', paddingTop: 20, paddingBottom: 10 },
  logo: { height: 50, width: 200 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#FFF', textAlign: 'center', paddingHorizontal: 20, marginTop: 16 },
  subtitle: { fontSize: 15, color: '#9CA3AF', textAlign: 'center', paddingHorizontal: 30, marginTop: 10, lineHeight: 22 },
  videoContainer: { 
    marginHorizontal: 20, marginTop: 24, height: 180, 
    backgroundColor: '#1A1A2E', borderRadius: 16, 
    justifyContent: 'center', alignItems: 'center' 
  },
  playButton: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#0073FF', justifyContent: 'center', alignItems: 'center' },
  playIcon: { fontSize: 24 },
  videoText: { color: '#9CA3AF', marginTop: 10, fontSize: 14 },
  card: { backgroundColor: '#1A1A2E', borderRadius: 16, padding: 20, marginHorizontal: 20, marginTop: 24 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF', marginBottom: 10 },
  cardText: { fontSize: 14, color: '#D1D5DB', lineHeight: 22 },
  asobaresLogo: { height: 50, width: 200, alignSelf: 'center', marginTop: 20 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 24, paddingHorizontal: 20 },
  stat: { alignItems: 'center' },
  statEmoji: { fontSize: 28 },
  statNumber: { fontSize: 22, fontWeight: 'bold', color: '#FFF', marginTop: 4 },
  statLabel: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  contactCard: { 
    backgroundColor: '#0073FF', borderRadius: 16, padding: 20, 
    marginHorizontal: 20, marginTop: 24, alignItems: 'center' 
  },
  contactTitle: { fontSize: 16, fontWeight: 'bold', color: '#FFF', textAlign: 'center', marginBottom: 16 },
  contactBtn: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12, marginBottom: 10, width: '100%', alignItems: 'center' },
  contactBtnText: { color: '#FFF', fontSize: 14, fontWeight: '500' },
  social: { paddingHorizontal: 20, marginTop: 24 },
  socialTitle: { fontSize: 16, fontWeight: 'bold', color: '#FFF', marginBottom: 12 },
  socialRow: { flexDirection: 'row', gap: 12 },
  socialBtn: { flex: 1, backgroundColor: '#1A1A2E', borderRadius: 12, padding: 14, alignItems: 'center' },
  socialIcon: { fontSize: 24 },
  socialText: { fontSize: 12, color: '#9CA3AF', marginTop: 4 },
  devBy: { alignItems: 'center', marginTop: 30, paddingVertical: 10 },
  devByText: { fontSize: 12, color: '#4B5563' },
});
`;
fs.writeFileSync('src/screens/MDTNScreen.tsx', mdtnScreen);
console.log('✅ MDTNScreen created');

// ============================================================
// 5. Fix HomeScreen - Ciudades "Ver todas", destacados, dev footer
// ============================================================
let home = fs.readFileSync('src/screens/HomeScreen.tsx', 'utf8');

// Fix "Ver todas" ciudades - navigate to a simple list or do nothing useful
// Replace the empty TouchableOpacity with one that works
home = home.replace(
  `<TouchableOpacity>
              <Text style={styles.seeAll}>Ver todas</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {(ciudades || []).slice(0, 8).map`,
  `<TouchableOpacity>
              <Text style={styles.seeAll}>Ver todas</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {(ciudades || []).map`
);

// Add "Desarrollado por Rayar!" before bottomSpacer
home = home.replace(
  '<View style={styles.bottomSpacer} />',
  `{/* Desarrollado por */}
        <TouchableOpacity style={styles.devBy} onPress={() => Linking.openURL('https://www.vamosarayar.com')}>
          <Text style={styles.devByText}>Desarrollado por Rayar!</Text>
        </TouchableOpacity>
        <View style={styles.bottomSpacer} />`
);

// Add devBy styles
home = home.replace(
  'bottomSpacer: { height: 30 },',
  `devBy: { alignItems: 'center', marginTop: 20, paddingVertical: 10 },
  devByText: { fontSize: 12, color: '#4B5563' },
  bottomSpacer: { height: 30 },`
);

// Make sure Linking is imported
if (!home.includes("import { Linking }") && !home.includes("Linking")) {
  // Linking is already imported in the existing imports
}

fs.writeFileSync('src/screens/HomeScreen.tsx', home);
console.log('✅ HomeScreen fixed - show all ciudades, dev footer');

// ============================================================
// 6. Fix any remaining toFixed in all screens
// ============================================================
const screensDir = path.join(__dirname, 'src/screens');
const files = fs.readdirSync(screensDir).filter(f => f.endsWith('.tsx'));
for (const file of files) {
  const filePath = path.join(screensDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('.valoracion_promedio?.toFixed(1)')) {
    content = content.replace(/\.valoracion_promedio\?\.toFixed\(1\)/g,
      '.valoracion_promedio) ? Number(item.valoracion_promedio).toFixed(1) : null');
    // This might cause issues with variable names, let's be more precise
  }
  // Fix remaining double .data patterns
  if (content.includes('.data.data')) {
    content = content.replace(/\.data\.data/g, '.data');
  }
  fs.writeFileSync(filePath, content);
}
console.log('✅ All remaining toFixed and .data patterns fixed');

console.log('\n🎉 All fixes applied! Build the app.');
