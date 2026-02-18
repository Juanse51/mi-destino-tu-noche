// =====================================================
// HomeScreen - Pantalla Principal
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

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { usuario, isAuthenticated } = useAuthStore();
  const [ubicacion, setUbicacion] = useState<{ latitud: number; longitud: number } | null>(null);
  const [refreshing, setRefreshing] = useState(false);

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

  const saludo = () => {
    const hora = new Date().getHours();
    if (hora < 12) return 'Buenos días';
    if (hora < 18) return 'Buenas tardes';
    return 'Buenas noches';
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

        {/* Search Bar */}
        <TouchableOpacity 
          style={styles.searchBar}
          onPress={() => navigation.navigate('Buscar')}
          activeOpacity={0.8}
        >
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchPlaceholder}>Buscar restaurantes, bares...</Text>
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
                  if (banner.enlace_url) {
                    Linking.openURL(banner.enlace_url);
                  }
                }}
              >
                <Image source={{ uri: banner.imagen_url }} style={styles.bannerImage} />
                <View style={styles.bannerOverlay} />
                <View style={styles.bannerContent}>
                  <Text style={styles.bannerTitle}>{banner.titulo}</Text>
                  {banner.subtitulo && (
                    <Text style={styles.bannerSubtitle}>{banner.subtitulo}</Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Categorías Especiales */}
        {categoriasEspeciales && Array.isArray(categoriasEspeciales) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Explora</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
                      <Text style={styles.ratingText}>{Number(item.valoracion_promedio) ? Number(item.valoracion_promedio).toFixed(1) : null || 'Nuevo'}</Text>
                    </View>
                    <Text style={styles.establecimientoPrecio}>
                      {'$'.repeat(item.rango_precios || 2)}
                      <Text style={styles.establecimientoPrecioInactive}>
                        {'$'.repeat(4 - (item.rango_precios || 2))}
                      </Text>
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Ciudades */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ciudades</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Ver todas</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {(ciudades || []).slice(0, 8).map((ciudad: any) => (
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
                    <Text style={styles.cercaRating}>⭐ {Number(item.valoracion_promedio) ? Number(item.valoracion_promedio).toFixed(1) : null || '-'}</Text>
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

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F1A' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingTop: 10, 
    paddingBottom: 15 
  },
  greeting: { fontSize: 14, color: '#9CA3AF' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', marginTop: 2 },
  headerLogo: { height: 45, width: 180 },
  notifButton: { 
    width: 44, height: 44, borderRadius: 22, 
    backgroundColor: '#1A1A2E', justifyContent: 'center', alignItems: 'center' 
  },
  notifIcon: { fontSize: 20 },
  searchBar: { 
    flexDirection: 'row', alignItems: 'center', 
    backgroundColor: '#1A1A2E', marginHorizontal: 20, 
    paddingHorizontal: 16, paddingVertical: 14, borderRadius: 16 
  },
  searchIcon: { fontSize: 18, marginRight: 10 },
  searchPlaceholder: { color: '#6B7280', fontSize: 15 },
  bannersContainer: { marginTop: 20 },
  bannersContent: { paddingHorizontal: 20 },
  banner: { 
    width: width - 60, height: 160, borderRadius: 20, 
    marginRight: 15, overflow: 'hidden' 
  },
  bannerImage: { width: '100%', height: '100%', position: 'absolute' },
  bannerOverlay: { 
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'rgba(0,0,0,0.4)' 
  },
  bannerContent: { 
    position: 'absolute', bottom: 0, left: 0, right: 0, 
    padding: 16 
  },
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
  establecimientoCard: { 
    width: CARD_WIDTH, height: 220, borderRadius: 20, 
    marginRight: 16, overflow: 'hidden', backgroundColor: '#1A1A2E' 
  },
  establecimientoImage: { width: '100%', height: '100%', position: 'absolute' },
  establecimientoOverlay: { 
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'rgba(0,0,0,0.35)' 
  },
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
  establecimientoInfo: { 
    position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16 
  },
  establecimientoNombre: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
  establecimientoTipo: { fontSize: 13, color: '#FCD34D', marginTop: 2 },
  establecimientoMeta: { 
    flexDirection: 'row', alignItems: 'center', 
    justifyContent: 'space-between', marginTop: 8 
  },
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
  ciudadImageContainer: { 
    width: 70, height: 70, borderRadius: 35, 
    overflow: 'hidden', marginBottom: 8 
  },
  ciudadImage: { width: '100%', height: '100%' },
  ciudadImagePlaceholder: { 
    width: '100%', height: '100%', 
    backgroundColor: '#1A1A2E', justifyContent: 'center', alignItems: 'center' 
  },
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
  bottomSpacer: { height: 30 },
});
