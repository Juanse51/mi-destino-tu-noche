// =====================================================
// HomeScreen - Pantalla Principal (sync con web)
// =====================================================

import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, FlatList, Dimensions, RefreshControl, Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import * as Location from 'expo-location';
import { establecimientosApi, ciudadesApi, categoriasApi, bannersApi } from '../api/client';
import { useAuthStore } from '../store/authStore';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.75;

const API_URL = 'https://mi-destino-api.onrender.com/api/v1';

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { usuario, isAuthenticated } = useAuthStore();
  const [ubicacion, setUbicacion] = useState<{ latitud: number; longitud: number } | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [cadenas, setCadenas] = useState<any[]>([]);

  // Obtener ubicación
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setUbicacion({
          latitud: loc.coords.latitude,
          longitud: loc.coords.longitude,
        });
      }
    })();
  }, []);

  // Cargar cadenas
  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/establecimientos/bogota-beer-company`).then(r => r.json()),
      fetch(`${API_URL}/establecimientos/la-plaza-de-andres-el-retiro`).then(r => r.json()),
      fetch(`${API_URL}/establecimientos/storia-d-amore-cali`).then(r => r.json()),
      fetch(`${API_URL}/establecimientos/full-80s-cll-118`).then(r => r.json()),
    ]).then(results => {
      setCadenas(results.filter(r => r && r.id));
    }).catch(() => {});
  }, []);

  // Queries
  const { data: destacados, refetch: refetchDestacados } = useQuery({
    queryKey: ['destacados'],
    queryFn: () => establecimientosApi.getDestacados({ limite: 10 }),
  });

  const { data: cercanos, refetch: refetchCercanos } = useQuery({
    queryKey: ['cercanos', ubicacion],
    queryFn: () => ubicacion 
      ? establecimientosApi.getCercanos({ ...ubicacion, radio: 5000 })
      : Promise.resolve([]),
    enabled: !!ubicacion,
  });

  const { data: ciudades } = useQuery({
    queryKey: ['ciudades'],
    queryFn: () => ciudadesApi.getAll(),
  });

  const { data: categoriasEspeciales } = useQuery({
    queryKey: ['categorias-especiales'],
    queryFn: () => categoriasApi.getEspeciales(),
  });

  const { data: banners } = useQuery({
    queryKey: ['banners-home'],
    queryFn: () => bannersApi.getAll({ ubicacion: 'home' }),
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchDestacados(), refetchCercanos()]);
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0073FF" />
        }
      >
        {/* Header con Logo */}
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
        </View>

        {/* Frase */}
        <Text style={styles.heroFrase}>
          ¿Sabes <Text style={styles.heroFraseBold}>qué vas a hacer</Text> cuando caiga la tarde y <Text style={styles.heroFraseBold}>comience la noche</Text>?
        </Text>

        {/* By Asobares */}
        <TouchableOpacity onPress={() => Linking.openURL('https://asobares.org/')}>
          <Text style={styles.byAsobares}>By Asobares Colombia</Text>
        </TouchableOpacity>

        {/* Search Bar */}
        <TouchableOpacity 
          style={styles.searchBar}
          onPress={() => navigation.navigate('Buscar')}
          activeOpacity={0.8}
        >
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchPlaceholder}>Buscar restaurantes, bares, cafés...</Text>
        </TouchableOpacity>

        {/* Botón grupo grande */}
        <TouchableOpacity
          style={styles.grupoBtn}
          onPress={() => Linking.openURL('https://wa.me/573212304589?text=Hola%2C%20te%20hablo%20desde%20Mi%20Destino%20Tu%20Noche%2C%20tengo%20un%20grupo%20grande%20y%20necesito%20ayuda.')}
        >
          <Text style={styles.grupoBtnText}>👥 ¿Tienes un grupo grande? ¡Contáctanos!</Text>
        </TouchableOpacity>

        {/* Banners */}
        {banners && Array.isArray(banners) && banners.length > 0 && (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.bannersContainer}
            contentContainerStyle={styles.bannersContent}
          >
            {banners.map((banner: any) => (
              <TouchableOpacity
                key={banner.id}
                style={styles.banner}
                onPress={() => {
                  bannersApi.registrarClic(banner.id);
                  if (banner.enlace_url) Linking.openURL(banner.enlace_url);
                }}
              >
                <Image source={{ uri: banner.imagen_url }} style={styles.bannerImage} />
                <View style={styles.bannerOverlay} />
                <View style={styles.bannerContent}>
                  <Text style={styles.bannerTitle}>{banner.titulo}</Text>
                  {banner.subtitulo && <Text style={styles.bannerSubtitle}>{banner.subtitulo}</Text>}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Ciudades */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ciudades</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {(ciudades || []).map((ciudad: any) => (
              <TouchableOpacity
                key={ciudad.id}
                style={styles.ciudadCard}
                onPress={() => navigation.navigate('Ciudad', { slug: ciudad.slug, nombre: ciudad.nombre })}
              >
                <View style={styles.ciudadImageContainer}>
                  {ciudad.imagen_url ? (
                    <Image source={{ uri: ciudad.imagen_url }} style={styles.ciudadImage} />
                  ) : (
                    <View style={styles.ciudadImagePlaceholder}>
                      <Text style={styles.ciudadEmoji}>🏙️</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.ciudadNombre}>{ciudad.nombre}</Text>
                <Text style={styles.ciudadCount}>{ciudad.total_establecimientos} lugares</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Categorías Especiales */}
        {categoriasEspeciales && Array.isArray(categoriasEspeciales) && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { paddingHorizontal: 20 }]}>Explora por categoría</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12 }}>
              {categoriasEspeciales.map((cat: any) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.categoryCard, { backgroundColor: cat.color + '20' }]}
                  onPress={() => navigation.navigate('Categoria', { slug: cat.slug, nombre: cat.nombre })}
                >
                  <Text style={styles.categoryIcon}>{cat.icono}</Text>
                  <Text style={[styles.categoryName, { color: cat.color }]}>{cat.nombre}</Text>
                  <Text style={styles.categoryCount}>{cat.total_establecimientos} lugares</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Banner Calendario de Eventos */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.calendarioBanner}>
            <Text style={styles.calendarioTitle}>📅 Calendario de eventos y festivales</Text>
            <Text style={styles.calendarioSubtitle}>Descubre lo mejor que viene para ti</Text>
          </TouchableOpacity>
        </View>

        {/* Cadenas */}
        {cadenas.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { paddingHorizontal: 20, textAlign: 'center' }]}>
              Las mejores cadenas de cafés, bares y restaurantes del país
            </Text>
            <Text style={styles.cadenasSubtitle}>Conoce las marcas con presencia en todo el territorio</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 16 }}>
              {cadenas.map((est: any) => (
                <TouchableOpacity
                  key={est.id}
                  style={styles.cadenaCard}
                  onPress={() => navigation.navigate('Establecimiento', { slug: est.slug })}
                >
                  {est.imagen_principal ? (
                    <Image source={{ uri: est.imagen_principal }} style={styles.cadenaImage} />
                  ) : (
                    <View style={styles.cadenaImagePlaceholder}>
                      <Text style={{ fontSize: 30 }}>🏢</Text>
                    </View>
                  )}
                  <Text style={styles.cadenaNombre} numberOfLines={2}>{est.nombre}</Text>
                  <Text style={styles.cadenaSedes}>{est.sedes?.length || 0} sedes</Text>
                  <Text style={styles.cadenaLink}>Ver sedes →</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* DJs Banner */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.djsBanner}
            onPress={() => navigation.navigate('DJs')}
          >
            <Text style={styles.djsBannerTitle}>🎧 ¿Tienes una fiesta?</Text>
            <Text style={styles.djsBannerSubtitle}>Nosotros tenemos el DJ. Conoce los mejores DJs de Colombia.</Text>
            <View style={styles.djsBannerBtn}>
              <Text style={styles.djsBannerBtnText}>Conoce nuestros DJs →</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Destacados */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Destacados</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Buscar', { destacados: true })}>
              <Text style={styles.seeAll}>Ver más</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={Array.isArray(destacados?.establecimientos) ? destacados.establecimientos : Array.isArray(destacados) ? destacados : []}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.establecimientoCard}
                onPress={() => navigation.navigate('Establecimiento', { slug: item.slug })}
                activeOpacity={0.9}
              >
                <Image source={{ uri: item.imagen_principal }} style={styles.establecimientoImage} />
                <View style={styles.establecimientoOverlay} />
                <View style={[styles.tipoBadge, { backgroundColor: item.tipo_color || '#0073FF' }]}>
                  <Text style={styles.tipoIcon}>{item.tipo_icono}</Text>
                  <Text style={styles.tipoText}>{item.tipo_nombre}</Text>
                </View>
                {item.verificado && (
                  <View style={styles.verificadoBadge}>
                    <Text style={styles.verificadoIcon}>✓</Text>
                  </View>
                )}
                <View style={styles.establecimientoInfo}>
                  <Text style={styles.establecimientoNombre} numberOfLines={1}>{item.nombre}</Text>
                  <Text style={styles.establecimientoTipo}>{item.tipo_comida_nombre || item.ciudad_nombre}</Text>
                  <View style={styles.establecimientoMeta}>
                    <View style={styles.ratingBadge}>
                      <Text style={styles.ratingStar}>⭐</Text>
                      <Text style={styles.ratingText}>
                        {item.valoracion_promedio ? Number(item.valoracion_promedio).toFixed(1) : 'Nuevo'}
                      </Text>
                    </View>
                    <Text style={styles.establecimientoPrecio}>
                      {'$'.repeat(item.rango_precios || 2)}
                      <Text style={styles.establecimientoPrecioInactive}>{'$'.repeat(4 - (item.rango_precios || 2))}</Text>
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Cerca de ti */}
        {cercanos && Array.isArray(cercanos) && cercanos.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Cerca de ti 📍</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Mapa')}>
                <Text style={styles.seeAll}>Ver mapa</Text>
              </TouchableOpacity>
            </View>
            {cercanos.slice(0, 5).map((item: any) => (
              <TouchableOpacity
                key={item.id}
                style={styles.cercaCard}
                onPress={() => navigation.navigate('Establecimiento', { slug: item.slug })}
              >
                <Image source={{ uri: item.imagen_principal }} style={styles.cercaImage} />
                <View style={styles.cercaInfo}>
                  <Text style={styles.cercaNombre} numberOfLines={1}>{item.nombre}</Text>
                  <Text style={styles.cercaTipo}>{item.tipo_nombre}</Text>
                  <View style={styles.cercaMeta}>
                    <Text style={styles.cercaRating}>⭐ {item.valoracion_promedio ? Number(item.valoracion_promedio).toFixed(1) : "-"}</Text>
                    <Text style={styles.cercaDistancia}>
                      • {(item.distancia / 1000).toFixed(1)} km
                    </Text>
                  </View>
                </View>
                <View style={styles.cercaPrecio}>
                  <Text style={styles.cercaPrecioText}>{'$'.repeat(item.rango_precios || 2)}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Stats */}
        <View style={styles.statsSection}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>1000+</Text>
              <Text style={styles.statLabel}>Establecimientos</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>18</Text>
              <Text style={styles.statLabel}>Ciudades</Text>
            </View>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>50k+</Text>
              <Text style={styles.statLabel}>Usuarios</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>10k+</Text>
              <Text style={styles.statLabel}>Reseñas</Text>
            </View>
          </View>
        </View>

        {/* Desarrollado por */}
        <TouchableOpacity style={styles.devBy} onPress={() => Linking.openURL('https://www.vamosarayar.com')}>
          <Text style={styles.devByText}>Desarrollado por Rayar!</Text>
        </TouchableOpacity>
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F1A' },
  header: { 
    flexDirection: 'row', justifyContent: 'space-between', 
    alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10 
  },
  headerLogo: { height: 45, width: 180 },
  notifButton: { 
    width: 44, height: 44, borderRadius: 22, 
    backgroundColor: '#1A1A2E', justifyContent: 'center', alignItems: 'center' 
  },
  notifIcon: { fontSize: 20 },
  heroFrase: { fontSize: 16, color: '#FB923C', textAlign: 'center', paddingHorizontal: 40, marginTop: 4 },
  heroFraseBold: { fontWeight: 'bold' },
  byAsobares: { fontSize: 13, color: '#9CA3AF', textAlign: 'center', marginTop: 6, marginBottom: 12 },
  searchBar: { 
    flexDirection: 'row', alignItems: 'center', 
    backgroundColor: '#1A1A2E', marginHorizontal: 20, 
    paddingHorizontal: 16, paddingVertical: 14, borderRadius: 16 
  },
  searchIcon: { fontSize: 18, marginRight: 10 },
  searchPlaceholder: { color: '#6B7280', fontSize: 15 },
  grupoBtn: {
    backgroundColor: '#25D366', marginHorizontal: 20, marginTop: 12,
    paddingVertical: 12, borderRadius: 16, alignItems: 'center',
  },
  grupoBtnText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  bannersContainer: { marginTop: 20 },
  bannersContent: { paddingHorizontal: 20 },
  banner: { 
    width: width - 60, height: 160, borderRadius: 20, 
    marginRight: 15, overflow: 'hidden' 
  },
  bannerImage: { width: '100%', height: '100%', position: 'absolute' },
  bannerOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
  bannerContent: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16 },
  bannerTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
  bannerSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  section: { marginTop: 28 },
  sectionHeader: { 
    flexDirection: 'row', justifyContent: 'space-between', 
    alignItems: 'center', paddingHorizontal: 20, marginBottom: 16 
  },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF' },
  seeAll: { fontSize: 14, color: '#0073FF', fontWeight: '600' },
  listContent: { paddingLeft: 20 },
  categoryCard: { 
    padding: 16, borderRadius: 16, marginLeft: 20, 
    marginRight: 8, minWidth: 120 
  },
  categoryIcon: { fontSize: 28 },
  categoryName: { fontSize: 14, fontWeight: 'bold', marginTop: 8 },
  categoryCount: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  // Calendario banner
  calendarioBanner: {
    marginHorizontal: 20, paddingVertical: 20, paddingHorizontal: 24,
    borderRadius: 20, overflow: 'hidden',
    backgroundColor: '#7C3AED',
  },
  calendarioTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
  calendarioSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 6 },
  // Cadenas
  cadenasSubtitle: { fontSize: 13, color: '#9CA3AF', textAlign: 'center', marginTop: 6, paddingHorizontal: 20 },
  cadenaCard: {
    width: 140, backgroundColor: '#1A1A2E', borderRadius: 16, padding: 16,
    marginLeft: 20, alignItems: 'center', borderWidth: 1, borderColor: '#374151',
  },
  cadenaImage: { width: 60, height: 60, borderRadius: 12 },
  cadenaImagePlaceholder: {
    width: 60, height: 60, borderRadius: 12, backgroundColor: 'rgba(0,115,255,0.15)',
    justifyContent: 'center', alignItems: 'center',
  },
  cadenaNombre: { fontSize: 14, fontWeight: 'bold', color: '#FFF', textAlign: 'center', marginTop: 10 },
  cadenaSedes: { fontSize: 12, color: '#9CA3AF', marginTop: 4 },
  cadenaLink: { fontSize: 12, color: '#0073FF', marginTop: 4 },
  // DJs banner
  djsBanner: {
    marginHorizontal: 20, paddingVertical: 24, paddingHorizontal: 24,
    borderRadius: 20, overflow: 'hidden',
    backgroundColor: '#312E81',
  },
  djsBannerTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFF', textAlign: 'center' },
  djsBannerSubtitle: { fontSize: 15, color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginTop: 8 },
  djsBannerBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)', paddingVertical: 10, paddingHorizontal: 20,
    borderRadius: 20, alignSelf: 'center', marginTop: 14,
  },
  djsBannerBtnText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  // Establecimiento cards
  establecimientoCard: { 
    width: CARD_WIDTH, height: 220, borderRadius: 20, 
    marginRight: 16, overflow: 'hidden', backgroundColor: '#1A1A2E' 
  },
  establecimientoImage: { width: '100%', height: '100%', position: 'absolute' },
  establecimientoOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)' },
  tipoBadge: { 
    position: 'absolute', top: 12, left: 12, 
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 
  },
  tipoIcon: { fontSize: 12 },
  tipoText: { color: '#FFF', fontSize: 11, fontWeight: 'bold', marginLeft: 4, textTransform: 'uppercase' },
  verificadoBadge: { 
    position: 'absolute', top: 12, right: 12, 
    width: 24, height: 24, borderRadius: 12, 
    backgroundColor: '#10B981', justifyContent: 'center', alignItems: 'center' 
  },
  verificadoIcon: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  establecimientoInfo: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16 },
  establecimientoNombre: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
  establecimientoTipo: { fontSize: 13, color: '#FCD34D', marginTop: 2 },
  establecimientoMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  ratingBadge: { 
    flexDirection: 'row', alignItems: 'center', 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 
  },
  ratingStar: { fontSize: 12 },
  ratingText: { fontSize: 13, fontWeight: 'bold', color: '#FFF', marginLeft: 4 },
  establecimientoPrecio: { fontSize: 14, fontWeight: 'bold', color: '#10B981' },
  establecimientoPrecioInactive: { color: '#4B5563' },
  ciudadCard: { alignItems: 'center', marginLeft: 20, width: 80 },
  ciudadImageContainer: { width: 70, height: 70, borderRadius: 35, overflow: 'hidden', marginBottom: 8 },
  ciudadImage: { width: '100%', height: '100%' },
  ciudadImagePlaceholder: { width: '100%', height: '100%', backgroundColor: '#1A1A2E', justifyContent: 'center', alignItems: 'center' },
  ciudadEmoji: { fontSize: 28 },
  ciudadNombre: { fontSize: 13, fontWeight: '600', color: '#FFF', textAlign: 'center' },
  ciudadCount: { fontSize: 11, color: '#9CA3AF', marginTop: 2 },
  cercaCard: { 
    flexDirection: 'row', backgroundColor: '#1A1A2E', 
    marginHorizontal: 20, marginBottom: 12, borderRadius: 16, overflow: 'hidden' 
  },
  cercaImage: { width: 100, height: 100 },
  cercaInfo: { flex: 1, padding: 12, justifyContent: 'center' },
  cercaNombre: { fontSize: 16, fontWeight: 'bold', color: '#FFF' },
  cercaTipo: { fontSize: 13, color: '#0073FF', marginTop: 2 },
  cercaMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  cercaRating: { fontSize: 13, color: '#FFF', fontWeight: '500' },
  cercaDistancia: { fontSize: 13, color: '#9CA3AF', marginLeft: 4 },
  cercaPrecio: { justifyContent: 'center', paddingRight: 16 },
  cercaPrecioText: { fontSize: 14, color: '#10B981', fontWeight: 'bold' },
  // Stats
  statsSection: { marginTop: 28, paddingHorizontal: 20 },
  statsRow: { flexDirection: 'row', marginBottom: 16 },
  statItem: { flex: 1, alignItems: 'center' },
  statNumber: { fontSize: 28, fontWeight: 'bold', color: '#0073FF' },
  statLabel: { fontSize: 13, color: '#9CA3AF', marginTop: 4 },
  devBy: { alignItems: 'center', marginTop: 20, paddingVertical: 10 },
  devByText: { fontSize: 12, color: '#4B5563' },
  bottomSpacer: { height: 30 },
});
