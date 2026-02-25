// =====================================================
// HomeScreen - Pantalla Principal (sync con web)
// =====================================================

import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, Dimensions, RefreshControl, Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import * as Location from 'expo-location';
import { establecimientosApi, ciudadesApi, bannersApi } from '../api/client';
import { useAuthStore } from '../store/authStore';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.75;
const API_URL = 'https://mi-destino-api.onrender.com/api/v1';

const categoriasHome = [
  { id: 'circulo-gastro', nombre: 'Círculo Gastro', icono: '', color: '#FFD700', slug: 'circulo-gastro', logo: 'https://midestinotunoche.asobares.org/circulo-gastro.png' },
  { id: 'camara-diversidad', nombre: 'Cámara de la Diversidad', icono: '🏳️‍🌈', color: '#FF69B4', slug: 'camara-diversidad', navigate: 'Diversidad' },
  { id: 'transportes', nombre: 'Transportes', icono: '🚌', color: '#3F51B5', slug: 'transportes', navigate: 'Transportes' },
  { id: 'parques', nombre: 'Parques de Diversiones', icono: '🎢', color: '#4CAF50', slug: 'parques', navigate: 'Parques' },
];

function InitialsAvatar({ nombre, size = 60 }: { nombre: string; size?: number }) {
  const initials = nombre.split(' ').filter(w => w.length > 0).slice(0, 2).map(w => w[0].toUpperCase()).join('');
  const colors = ['#FF6B35', '#9B59B6', '#3498DB', '#E91E63', '#2ECC71', '#F39C12', '#1ABC9C', '#E74C3C'];
  const colorIndex = nombre.length % colors.length;
  return (
    <View style={{ width: size, height: size, borderRadius: size * 0.3, backgroundColor: colors[colorIndex], justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: '#FFF', fontSize: size * 0.35, fontWeight: 'bold' }}>{initials}</Text>
    </View>
  );
}

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { usuario, isAuthenticated } = useAuthStore();
  const [ubicacion, setUbicacion] = useState<{ latitud: number; longitud: number } | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setUbicacion({ latitud: loc.coords.latitude, longitud: loc.coords.longitude });
      }
    })();
  }, []);

  const { data: destacados, refetch: refetchDestacados } = useQuery({
    queryKey: ['destacados'],
    queryFn: () => establecimientosApi.getDestacados({ limite: 10 }),
  });
  const { data: cercanos, refetch: refetchCercanos } = useQuery({
    queryKey: ['cercanos', ubicacion],
    queryFn: () => ubicacion ? establecimientosApi.getCercanos({ ...ubicacion, radio: 5000 }) : Promise.resolve([]),
    enabled: !!ubicacion,
  });
  const { data: ciudades } = useQuery({ queryKey: ['ciudades'], queryFn: () => ciudadesApi.getAll() });
  const { data: banners } = useQuery({ queryKey: ['banners-home'], queryFn: () => bannersApi.getAll({ ubicacion: 'home' }) });

  const onRefresh = async () => { setRefreshing(true); await Promise.all([refetchDestacados(), refetchCercanos()]); setRefreshing(false); };
  const destacadosArray = Array.isArray(destacados?.establecimientos) ? destacados.establecimientos : Array.isArray(destacados) ? destacados : [];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0073FF" />}>
        {/* 1. Header - logo centrado, campana oculta */}
        <View style={styles.header}>
          <Image source={{ uri: 'https://xzvfwxlgrwzcpofdubmg.supabase.co/storage/v1/object/public/imagenes/logos/logo%20mi%20destino%20tu%20noche.png' }} style={styles.headerLogo} resizeMode="contain" />
        </View>

        <Text style={styles.heroFrase}>¿Sabes <Text style={styles.heroFraseBold}>qué vas a hacer</Text> cuando caiga la tarde y <Text style={styles.heroFraseBold}>comience la noche</Text>?</Text>
        <TouchableOpacity onPress={() => Linking.openURL('https://asobares.org/')}><Text style={styles.byAsobares}>By Asobares Colombia</Text></TouchableOpacity>

        <TouchableOpacity style={styles.searchBar} onPress={() => navigation.navigate('Buscar')} activeOpacity={0.8}>
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchPlaceholder}>Buscar restaurantes, bares, cafés...</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.grupoBtn} onPress={() => Linking.openURL('https://wa.me/573212304589?text=Hola%2C%20te%20hablo%20desde%20Mi%20Destino%20Tu%20Noche%2C%20tengo%20un%20grupo%20grande%20y%20necesito%20ayuda.')}>
          <Text style={styles.grupoBtnText}>👥 ¿Tienes un grupo grande? ¡Contáctanos!</Text>
        </TouchableOpacity>

        {/* Banners */}
        {banners && Array.isArray(banners) && banners.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bannersContainer} contentContainerStyle={styles.bannersContent}>
            {banners.map((banner: any) => (
              <TouchableOpacity key={banner.id} style={styles.banner} onPress={() => { bannersApi.registrarClic(banner.id); if (banner.enlace_url) Linking.openURL(banner.enlace_url); }}>
                <Image source={{ uri: banner.imagen_url }} style={styles.bannerImage} />
                <View style={styles.bannerOverlay} />
                <View style={styles.bannerContent}><Text style={styles.bannerTitle}>{banner.titulo}</Text>{banner.subtitulo && <Text style={styles.bannerSubtitle}>{banner.subtitulo}</Text>}</View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* 2. Ciudades - grid 3 por fila, cuadros redondeados */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Ciudades</Text></View>
          <View style={styles.ciudadesGrid}>
            {(ciudades || []).map((ciudad: any) => (
              <TouchableOpacity key={ciudad.id} style={styles.ciudadCard} onPress={() => navigation.navigate('Ciudad', { slug: ciudad.slug, nombre: ciudad.nombre })}>
                <View style={styles.ciudadImageContainer}>
                  {ciudad.imagen_url ? (<Image source={{ uri: ciudad.imagen_url }} style={styles.ciudadImage} />) : (<View style={styles.ciudadImagePlaceholder}><Text style={styles.ciudadEmoji}>🏙️</Text></View>)}
                </View>
                <Text style={styles.ciudadNombre}>{ciudad.nombre}</Text>
                <Text style={styles.ciudadCount}>{ciudad.total_establecimientos} lugares</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 3. Categorías - con logo circulo gastro, sin Tardeo ni Pet Friendly */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { paddingHorizontal: 20 }]}>Explora por categoría</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12 }}>
            {categoriasHome.map((cat) => (
              <TouchableOpacity key={cat.id} style={[styles.categoryCard, { backgroundColor: cat.color + '20' }]} onPress={() => { if (cat.navigate) { navigation.navigate(cat.navigate); } else { navigation.navigate('Categoria', { slug: cat.slug, nombre: cat.nombre }); } }}>
                {cat.logo ? (<Image source={{ uri: cat.logo }} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFF' }} resizeMode="contain" />) : (<Text style={styles.categoryIcon}>{cat.icono}</Text>)}
                <Text style={[styles.categoryName, { color: cat.color }]}>{cat.nombre}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Calendario */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.calendarioBanner} onPress={() => navigation.navigate('Calendario')}><Text style={styles.calendarioTitle}>📅 Calendario de eventos y festivales</Text><Text style={styles.calendarioSubtitle}>Descubre lo mejor que viene para ti</Text></TouchableOpacity>
        </View>

        {/* DJs */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.djsBanner} onPress={() => navigation.navigate('DJs')}>
            <Text style={styles.djsBannerTitle}>🎧 ¿Tienes una fiesta?</Text>
            <Text style={styles.djsBannerSubtitle}>Nosotros tenemos el DJ. Conoce los mejores DJs de Colombia.</Text>
            <View style={styles.djsBannerBtn}><Text style={styles.djsBannerBtnText}>Conoce nuestros DJs →</Text></View>
          </TouchableOpacity>
        </View>

        {/* Destacados - oculto */}

        {/* Cerca de ti */}
        {cercanos && Array.isArray(cercanos) && cercanos.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Cerca de ti 📍</Text><TouchableOpacity onPress={() => navigation.navigate('Mapa')}><Text style={styles.seeAll}>Ver mapa</Text></TouchableOpacity></View>
            {cercanos.slice(0, 5).map((item: any) => (
              <TouchableOpacity key={item.id} style={styles.cercaCard} onPress={() => navigation.navigate('Establecimiento', { slug: item.slug })}>
                {item.imagen_principal ? (<Image source={{ uri: item.imagen_principal }} style={styles.cercaImage} />) : (<View style={[styles.cercaImage, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#1A1A2E' }]}><InitialsAvatar nombre={item.nombre} size={50} /></View>)}
                <View style={styles.cercaInfo}><Text style={styles.cercaNombre} numberOfLines={1}>{item.nombre}</Text><Text style={styles.cercaTipo}>{item.tipo_nombre}</Text><View style={styles.cercaMeta}><Text style={styles.cercaRating}>⭐ {item.valoracion_promedio ? Number(item.valoracion_promedio).toFixed(1) : "-"}</Text><Text style={styles.cercaDistancia}>• {(item.distancia / 1000).toFixed(1)} km</Text></View></View>
                <View style={styles.cercaPrecio}><Text style={styles.cercaPrecioText}>{'$'.repeat(item.rango_precios || 2)}</Text></View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* 6. Stats removidas */}

        <TouchableOpacity style={styles.devBy} onPress={() => Linking.openURL('https://www.vamosarayar.com')}><Text style={styles.devByText}>Desarrollado por Rayar!</Text></TouchableOpacity>
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F1A' },
  header: { alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10 },
  headerLogo: { height: 45, width: 180 },
  heroFrase: { fontSize: 16, color: '#FB923C', textAlign: 'center', paddingHorizontal: 40, marginTop: 4 },
  heroFraseBold: { fontWeight: 'bold' },
  byAsobares: { fontSize: 13, color: '#9CA3AF', textAlign: 'center', marginTop: 6, marginBottom: 12 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1A2E', marginHorizontal: 20, paddingHorizontal: 16, paddingVertical: 14, borderRadius: 16 },
  searchIcon: { fontSize: 18, marginRight: 10 },
  searchPlaceholder: { color: '#6B7280', fontSize: 15 },
  grupoBtn: { backgroundColor: '#25D366', marginHorizontal: 20, marginTop: 12, paddingVertical: 12, borderRadius: 16, alignItems: 'center' },
  grupoBtnText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  bannersContainer: { marginTop: 20 },
  bannersContent: { paddingHorizontal: 20 },
  banner: { width: width - 60, height: 160, borderRadius: 20, marginRight: 15, overflow: 'hidden' },
  bannerImage: { width: '100%', height: '100%', position: 'absolute' },
  bannerOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
  bannerContent: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16 },
  bannerTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
  bannerSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  section: { marginTop: 28 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF' },
  seeAll: { fontSize: 14, color: '#0073FF', fontWeight: '600' },
  listContent: { paddingLeft: 20 },
  categoryCard: { padding: 16, borderRadius: 16, marginLeft: 20, marginRight: 8, minWidth: 120 },
  categoryIcon: { fontSize: 28 },
  categoryName: { fontSize: 14, fontWeight: 'bold', marginTop: 8 },
  calendarioBanner: { marginHorizontal: 20, paddingVertical: 20, paddingHorizontal: 24, borderRadius: 20, backgroundColor: '#7C3AED' },
  calendarioTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
  calendarioSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 6 },
  djsBanner: { marginHorizontal: 20, paddingVertical: 24, paddingHorizontal: 24, borderRadius: 20, backgroundColor: '#312E81' },
  djsBannerTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFF', textAlign: 'center' },
  djsBannerSubtitle: { fontSize: 15, color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginTop: 8 },
  djsBannerBtn: { backgroundColor: 'rgba(255,255,255,0.2)', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20, alignSelf: 'center', marginTop: 14 },
  djsBannerBtnText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  establecimientoCard: { width: CARD_WIDTH, height: 220, borderRadius: 20, marginRight: 16, overflow: 'hidden', backgroundColor: '#1A1A2E' },
  establecimientoImage: { width: '100%', height: '100%', position: 'absolute' },
  establecimientoOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)' },
  tipoBadge: { position: 'absolute', top: 12, left: 12, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  tipoIcon: { fontSize: 12 },
  tipoText: { color: '#FFF', fontSize: 11, fontWeight: 'bold', marginLeft: 4, textTransform: 'uppercase' },
  verificadoBadge: { position: 'absolute', top: 12, right: 12, width: 24, height: 24, borderRadius: 12, backgroundColor: '#10B981', justifyContent: 'center', alignItems: 'center' },
  verificadoIcon: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  establecimientoInfo: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16 },
  establecimientoNombre: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
  establecimientoTipo: { fontSize: 13, color: '#FCD34D', marginTop: 2 },
  establecimientoMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  ratingStar: { fontSize: 12 },
  ratingText: { fontSize: 13, fontWeight: 'bold', color: '#FFF', marginLeft: 4 },
  establecimientoPrecio: { fontSize: 14, fontWeight: 'bold', color: '#10B981' },
  establecimientoPrecioInactive: { color: '#4B5563' },
  ciudadesGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12 },
  ciudadCard: { width: (width - 48) / 3, alignItems: 'center', marginBottom: 16, paddingHorizontal: 4 },
  ciudadImageContainer: { width: '100%', height: 70, borderRadius: 12, overflow: 'hidden', marginBottom: 6 },
  ciudadImage: { width: '100%', height: '100%' },
  ciudadImagePlaceholder: { width: '100%', height: '100%', backgroundColor: '#1A1A2E', justifyContent: 'center', alignItems: 'center', borderRadius: 12 },
  ciudadEmoji: { fontSize: 28 },
  ciudadNombre: { fontSize: 12, fontWeight: '600', color: '#FFF', textAlign: 'center' },
  ciudadCount: { fontSize: 10, color: '#9CA3AF', marginTop: 2 },
  cercaCard: { flexDirection: 'row', backgroundColor: '#1A1A2E', marginHorizontal: 20, marginBottom: 12, borderRadius: 16, overflow: 'hidden' },
  cercaImage: { width: 100, height: 100 },
  cercaInfo: { flex: 1, padding: 12, justifyContent: 'center' },
  cercaNombre: { fontSize: 16, fontWeight: 'bold', color: '#FFF' },
  cercaTipo: { fontSize: 13, color: '#0073FF', marginTop: 2 },
  cercaMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  cercaRating: { fontSize: 13, color: '#FFF', fontWeight: '500' },
  cercaDistancia: { fontSize: 13, color: '#9CA3AF', marginLeft: 4 },
  cercaPrecio: { justifyContent: 'center', paddingRight: 16 },
  cercaPrecioText: { fontSize: 14, color: '#10B981', fontWeight: 'bold' },
  devBy: { alignItems: 'center', marginTop: 20, paddingVertical: 10 },
  devByText: { fontSize: 12, color: '#4B5563' },
  bottomSpacer: { height: 30 },
});
