// Fix mobile app adjustments
// Run: node fix-app-adjustments.js

const fs = require('fs');

// ============================================================
// 1. Fix EstablecimientoScreen - logo centered, Instagram btn, 
//    correct "Ir" direction, proper image display
// ============================================================
const estScreen = `// EstablecimientoScreen.tsx - Detalle de Establecimiento
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking, Share, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { establecimientosApi, favoritosApi } from '../api/client';
import { useAuthStore } from '../store/authStore';

const { width } = Dimensions.get('window');

export default function EstablecimientoScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { slug } = route.params;
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'info' | 'menu' | 'resenas'>('info');

  const { data: est, isLoading } = useQuery({
    queryKey: ['establecimiento', slug],
    queryFn: () => establecimientosApi.getBySlug(slug),
  });

  const toggleFavorito = useMutation({
    mutationFn: () => favoritosApi.toggle(est?.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['establecimiento', slug] }),
  });

  const handleShare = async () => { await Share.share({ message: \`¡Mira \${est?.nombre}! https://midestinotunoche.asobares.org/\${est?.slug}\` }); };
  const handleCall = () => est?.telefono && Linking.openURL(\`tel:\${est.telefono}\`);
  const handleWhatsApp = () => est?.whatsapp && Linking.openURL(\`https://wa.me/57\${est.whatsapp}\`);
  const handleMaps = () => {
    if (est?.direccion) {
      const query = encodeURIComponent(est.direccion + ', ' + (est.ciudad_nombre || 'Colombia'));
      Linking.openURL(\`https://www.google.com/maps/search/?api=1&query=\${query}\`);
    }
  };
  const handleInstagram = () => {
    if (est?.instagram) {
      const ig = est.instagram.replace('@', '').replace('https://www.instagram.com/', '').replace('https://instagram.com/', '').replace('/', '');
      Linking.openURL(\`https://www.instagram.com/\${ig}\`);
    }
  };

  if (isLoading || !est) return <SafeAreaView style={styles.container}><View style={styles.loading}><Text style={styles.loadingText}>Cargando...</Text></View></SafeAreaView>;

  const hasLogo = est.logo_url || est.imagen_principal;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Image - Logo centrado sobre fondo oscuro */}
        <View style={styles.imageContainer}>
          <View style={styles.headerBg} />
          <View style={styles.logoContainer}>
            <Image source={{ uri: hasLogo }} style={styles.logoImage} resizeMode="contain" />
          </View>
          <SafeAreaView style={styles.headerButtons}>
            <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.headerBtnIcon}>←</Text>
            </TouchableOpacity>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.headerBtn} onPress={handleShare}>
                <Text style={styles.headerBtnIcon}>↗</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerBtn} onPress={() => isAuthenticated ? toggleFavorito.mutate() : navigation.navigate('Login')}>
                <Text style={styles.headerBtnIcon}>{est.es_favorito ? '❤️' : '🤍'}</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
          <View style={styles.badgesContainer}>
            <View style={[styles.tipoBadge, { backgroundColor: est.tipo_color || '#0073FF' }]}>
              <Text style={styles.tipoBadgeText}>{est.tipo_icono} {est.tipo_nombre}</Text>
            </View>
          </View>
        </View>

        <View style={styles.mainInfo}>
          <Text style={styles.nombre}>{est.nombre}</Text>
          <Text style={styles.tipoComida}>{est.tipo_comida_nombre}</Text>
          {est.ciudad_nombre && <Text style={styles.ciudad}>{est.ciudad_nombre} {est.departamento_nombre ? '• ' + est.departamento_nombre : ''}</Text>}
          <View style={styles.metaRow}>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingStar}>⭐</Text>
              <Text style={styles.ratingText}>{est.valoracion_promedio ? Number(est.valoracion_promedio).toFixed(1) : 'Nuevo'}</Text>
              <Text style={styles.ratingCount}>({est.total_valoraciones || 0})</Text>
            </View>
            <Text style={styles.precio}>{'$'.repeat(est.rango_precios || 2)}</Text>
          </View>
          {est.genero_musical && (
            <View style={styles.generoMusical}>
              <Text style={styles.generoText}>🎵 {est.genero_musical}</Text>
            </View>
          )}
          {est.etiquetas?.length > 0 && (
            <View style={styles.etiquetas}>
              {est.etiquetas.map((et: any, i: number) => (
                <View key={i} style={styles.etiqueta}><Text style={styles.etiquetaText}>{et.icono} {et.nombre}</Text></View>
              ))}
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          {est.telefono && (
            <TouchableOpacity style={[styles.actionBtn, styles.actionBtnPrimary]} onPress={handleCall}>
              <Text style={styles.actionText}>📞 Llamar</Text>
            </TouchableOpacity>
          )}
          {est.whatsapp && (
            <TouchableOpacity style={[styles.actionBtn, styles.actionBtnWhatsApp]} onPress={handleWhatsApp}>
              <Text style={styles.actionText}>💬 WhatsApp</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={[styles.actionBtn, styles.actionBtnMaps]} onPress={handleMaps}>
            <Text style={styles.actionText}>🧭 Ir</Text>
          </TouchableOpacity>
        </View>

        {/* Instagram button */}
        {est.instagram && (
          <TouchableOpacity style={styles.instagramBtn} onPress={handleInstagram}>
            <Text style={styles.instagramText}>📷 Instagram: @{est.instagram.replace('@', '').replace('https://www.instagram.com/', '').replace('https://instagram.com/', '').replace('/', '')}</Text>
          </TouchableOpacity>
        )}

        {/* Tabs */}
        <View style={styles.tabs}>
          {(['info', 'menu', 'resenas'] as const).map((tab) => (
            <TouchableOpacity key={tab} style={[styles.tab, activeTab === tab && styles.tabActive]} onPress={() => setActiveTab(tab)}>
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab === 'info' ? 'Info' : tab === 'menu' ? 'Menú' : 'Reseñas'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.tabContent}>
          {activeTab === 'info' && (
            <View>
              {est.descripcion && <Text style={styles.descripcion}>{est.descripcion}</Text>}
              <View style={styles.infoCard}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoIcon}>📍</Text>
                  <View style={{flex:1}}><Text style={styles.infoLabel}>Dirección</Text><Text style={styles.infoValue}>{est.direccion}</Text></View>
                </View>
                {est.telefono && (
                  <View style={styles.infoItem}>
                    <Text style={styles.infoIcon}>📞</Text>
                    <View style={{flex:1}}><Text style={styles.infoLabel}>Teléfono</Text><Text style={styles.infoValue}>{est.telefono}</Text></View>
                  </View>
                )}
                {est.email && (
                  <View style={styles.infoItem}>
                    <Text style={styles.infoIcon}>📧</Text>
                    <View style={{flex:1}}><Text style={styles.infoLabel}>Email</Text><Text style={styles.infoValue}>{est.email}</Text></View>
                  </View>
                )}
                {est.horarios && (
                  <View style={styles.infoItem}>
                    <Text style={styles.infoIcon}>🕐</Text>
                    <View style={{flex:1}}><Text style={styles.infoLabel}>Horarios</Text><Text style={styles.infoValue}>{est.horarios}</Text></View>
                  </View>
                )}
              </View>
              {est.galeria?.length > 0 && (
                <View style={styles.galeria}>
                  <Text style={styles.galeriaTitle}>Fotos</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {est.galeria.map((foto: any, i: number) => <Image key={i} source={{ uri: foto.url }} style={styles.galeriaImage} />)}
                  </ScrollView>
                </View>
              )}
            </View>
          )}
          {activeTab === 'menu' && (
            <View style={styles.emptyTab}><Text style={styles.emptyIcon}>🍽️</Text><Text style={styles.emptyText}>Ver menú en el establecimiento</Text></View>
          )}
          {activeTab === 'resenas' && (
            <View>
              {est.valoraciones_recientes?.length > 0 ? est.valoraciones_recientes.map((val: any, i: number) => (
                <View key={i} style={styles.resenaCard}>
                  <Text style={styles.resenaUserName}>{val.usuario_nombre} • {'⭐'.repeat(val.puntuacion)}</Text>
                  {val.comentario && <Text style={styles.resenaComentario}>{val.comentario}</Text>}
                </View>
              )) : (
                <View style={styles.emptyTab}><Text style={styles.emptyIcon}>📝</Text><Text style={styles.emptyText}>Sin reseñas aún</Text></View>
              )}
            </View>
          )}
        </View>

        {/* Dev footer */}
        <TouchableOpacity style={styles.devBy} onPress={() => Linking.openURL('https://www.vamosarayar.com')}>
          <Text style={styles.devByText}>Desarrollado por Rayar!</Text>
        </TouchableOpacity>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F1A' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#FFF', fontSize: 16 },
  imageContainer: { height: 280, position: 'relative', backgroundColor: '#1A1A2E' },
  headerBg: { ...StyleSheet.absoluteFillObject, backgroundColor: '#1A1A2E' },
  logoContainer: { 
    position: 'absolute', top: 60, left: 0, right: 0, bottom: 40,
    justifyContent: 'center', alignItems: 'center',
  },
  logoImage: { width: 180, height: 180, borderRadius: 20 },
  headerButtons: { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16 },
  headerRight: { flexDirection: 'row', gap: 8 },
  headerBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  headerBtnIcon: { fontSize: 20, color: '#FFF' },
  badgesContainer: { position: 'absolute', bottom: 16, left: 16, flexDirection: 'row', gap: 8 },
  tipoBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  tipoBadgeText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  mainInfo: { padding: 20 },
  nombre: { fontSize: 26, fontWeight: 'bold', color: '#FFF' },
  tipoComida: { fontSize: 15, color: '#0073FF', marginTop: 4 },
  ciudad: { fontSize: 13, color: '#9CA3AF', marginTop: 4 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  ratingBadge: { flexDirection: 'row', alignItems: 'center' },
  ratingStar: { fontSize: 16 },
  ratingText: { fontSize: 16, fontWeight: 'bold', color: '#FFF', marginLeft: 4 },
  ratingCount: { fontSize: 13, color: '#6B7280', marginLeft: 4 },
  precio: { fontSize: 18, fontWeight: 'bold', color: '#10B981' },
  generoMusical: { backgroundColor: '#1A1A2E', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginTop: 12, alignSelf: 'flex-start' },
  generoText: { fontSize: 13, color: '#FFF' },
  etiquetas: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  etiqueta: { backgroundColor: '#1A1A2E', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  etiquetaText: { fontSize: 12, color: '#FFF' },
  actions: { flexDirection: 'row', paddingHorizontal: 20, gap: 10 },
  actionBtn: { flex: 1, alignItems: 'center', paddingVertical: 12, borderRadius: 12 },
  actionBtnPrimary: { backgroundColor: '#0073FF' },
  actionBtnWhatsApp: { backgroundColor: '#25D366' },
  actionBtnMaps: { backgroundColor: '#4285F4' },
  actionText: { fontSize: 13, fontWeight: 'bold', color: '#FFF' },
  instagramBtn: { 
    marginHorizontal: 20, marginTop: 10, paddingVertical: 12, 
    backgroundColor: '#E1306C', borderRadius: 12, alignItems: 'center' 
  },
  instagramText: { color: '#FFF', fontSize: 13, fontWeight: 'bold' },
  tabs: { flexDirection: 'row', marginTop: 20, borderBottomWidth: 1, borderBottomColor: '#1A1A2E' },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: '#0073FF' },
  tabText: { fontSize: 14, color: '#6B7280' },
  tabTextActive: { color: '#0073FF', fontWeight: '600' },
  tabContent: { padding: 20 },
  descripcion: { fontSize: 14, color: '#D1D5DB', lineHeight: 22 },
  infoCard: { backgroundColor: '#1A1A2E', borderRadius: 12, padding: 16, marginTop: 16 },
  infoItem: { flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#374151' },
  infoIcon: { fontSize: 18, marginRight: 12 },
  infoLabel: { fontSize: 11, color: '#6B7280' },
  infoValue: { fontSize: 14, color: '#FFF', marginTop: 2 },
  galeria: { marginTop: 20 },
  galeriaTitle: { fontSize: 16, fontWeight: 'bold', color: '#FFF', marginBottom: 12 },
  galeriaImage: { width: 180, height: 130, borderRadius: 12, marginRight: 12 },
  emptyTab: { alignItems: 'center', paddingVertical: 40 },
  emptyIcon: { fontSize: 48 },
  emptyText: { fontSize: 14, color: '#6B7280', marginTop: 12 },
  resenaCard: { backgroundColor: '#1A1A2E', borderRadius: 12, padding: 14, marginBottom: 12 },
  resenaUserName: { fontSize: 14, fontWeight: '600', color: '#FFF' },
  resenaComentario: { fontSize: 13, color: '#D1D5DB', marginTop: 8 },
  devBy: { alignItems: 'center', marginTop: 20, paddingVertical: 10 },
  devByText: { fontSize: 12, color: '#4B5563' },
});
`;
fs.writeFileSync('src/screens/EstablecimientoScreen.tsx', estScreen);
console.log('✅ EstablecimientoScreen - logo centrado, Instagram, Ir corregido');

// ============================================================
// 2. Fix MDTNScreen - video incrustado, label "¿Qué es MDTN?"
// ============================================================
let mdtn = fs.readFileSync('src/screens/MDTNScreen.tsx', 'utf8');

// Replace video placeholder with WebView
mdtn = `// MDTNScreen - ¿Qué es Mi Destino Tu Noche?
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

export default function MDTNScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
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

        {/* Video incrustado */}
        <View style={styles.videoContainer}>
          <WebView
            source={{ uri: 'https://www.youtube.com/embed/YxOfBiwGP54' }}
            style={styles.video}
            allowsFullscreenVideo={true}
            javaScriptEnabled={true}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Nuestra Misión</Text>
          <Text style={styles.cardText}>
            Mi Destino Tu Noche es una iniciativa de Asobares Colombia que busca impulsar y visibilizar la industria gastronómica y de entretenimiento nocturno en todo el país. Somos la guía definitiva para descubrir los mejores establecimientos, desde restaurantes de alta cocina hasta los bares más auténticos de cada ciudad.
          </Text>
        </View>

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

        <View style={styles.contactCard}>
          <Text style={styles.contactTitle}>¿Quieres registrar tu establecimiento?</Text>
          <TouchableOpacity style={styles.contactBtn} onPress={() => Linking.openURL('mailto:soporte@asobares.org')}>
            <Text style={styles.contactBtnText}>📧 soporte@asobares.org</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactBtn} onPress={() => Linking.openURL('tel:+573212304589')}>
            <Text style={styles.contactBtnText}>📞 +57 321 230 4589</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.social}>
          <Text style={styles.socialTitle}>Síguenos</Text>
          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialBtn} onPress={() => Linking.openURL('https://www.instagram.com/asobares.colombia/')}>
              <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/174/174855.png' }} style={styles.socialIconImg} />
              <Text style={styles.socialText}>Instagram</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn} onPress={() => Linking.openURL('https://www.facebook.com/Asobarescolombia')}>
              <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/174/174848.png' }} style={styles.socialIconImg} />
              <Text style={styles.socialText}>Facebook</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn} onPress={() => Linking.openURL('https://x.com/Asobares')}>
              <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/5968/5968958.png' }} style={styles.socialIconImg} />
              <Text style={styles.socialText}>X</Text>
            </TouchableOpacity>
          </View>
        </View>

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
  videoContainer: { marginHorizontal: 20, marginTop: 24, height: 210, borderRadius: 16, overflow: 'hidden' },
  video: { flex: 1, backgroundColor: '#000' },
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
  socialIconImg: { width: 28, height: 28 },
  socialText: { fontSize: 12, color: '#9CA3AF', marginTop: 6 },
  devBy: { alignItems: 'center', marginTop: 30, paddingVertical: 10 },
  devByText: { fontSize: 12, color: '#4B5563' },
});
`;
fs.writeFileSync('src/screens/MDTNScreen.tsx', mdtn);
console.log('✅ MDTNScreen - video incrustado, iconos reales de redes');

// ============================================================
// 3. Fix App.tsx - tab label "¿Qué es MDTN?"
// ============================================================
let app = fs.readFileSync('App.tsx', 'utf8');
app = app.replace("tabBarLabel: '¿Qué es?'", "tabBarLabel: '¿Qué es MDTN?'");
fs.writeFileSync('App.tsx', app);
console.log('✅ App.tsx - tab label updated');

console.log('\n🎉 All adjustments applied!');
console.log('⚠️  Instala react-native-webview: npx expo install react-native-webview');
