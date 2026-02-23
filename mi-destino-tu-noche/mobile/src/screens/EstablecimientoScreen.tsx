// EstablecimientoScreen.tsx - Detalle de Establecimiento con Sedes
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
  const handleShare = async () => {
    if (!est) return;
    await Share.share({ message: '¡Mira ' + est.nombre + '! https://midestinotunoche.asobares.org/' + est.slug });
  };
  const handleCall = () => est?.telefono && Linking.openURL('tel:' + est.telefono);
  const handleWhatsApp = () => {
    if (est?.whatsapp) {
      const num = est.whatsapp.startsWith('57') ? est.whatsapp : '57' + est.whatsapp;
      Linking.openURL('https://wa.me/' + num + '?text=Hola%2C%20te%20hablo%20desde%20Mi%20Destino%20Tu%20Noche%2C%20quisiera%20hacer%20una%20reserva.');
    }
  };
  const handleMaps = () => {
    if (est?.direccion) {
      const query = encodeURIComponent(est.direccion + ', ' + (est.ciudad_nombre || 'Colombia'));
      Linking.openURL('https://www.google.com/maps/search/?api=1&query=' + query);
    }
  };
  const handleInstagram = () => {
    if (est?.instagram) {
      const ig = est.instagram.replace('@', '').replace('https://www.instagram.com/', '').replace('https://instagram.com/', '').replace('/', '');
      Linking.openURL('https://www.instagram.com/' + ig);
    }
  };
  if (isLoading || !est) return <SafeAreaView style={styles.container}><View style={styles.loading}><Text style={styles.loadingText}>Cargando...</Text></View></SafeAreaView>;
  const logoImg = est.logo_url || est.imagen_principal;
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <View style={styles.headerBg} />
          <View style={styles.logoContainer}>
            <Image source={{ uri: logoImg }} style={styles.logoImage} resizeMode="contain" />
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
          {est.tipo_comida_nombre ? <Text style={styles.tipoComida}>{est.tipo_comida_nombre}</Text> : null}
          {est.ciudad_nombre ? <Text style={styles.ciudad}>{est.ciudad_nombre}{est.departamento_nombre ? ' • ' + est.departamento_nombre : ''}</Text> : null}
          <View style={styles.metaRow}>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingStar}>⭐</Text>
              <Text style={styles.ratingText}>{est.valoracion_promedio ? Number(est.valoracion_promedio).toFixed(1) : 'Nuevo'}</Text>
              <Text style={styles.ratingCount}>({est.total_valoraciones || 0})</Text>
            </View>
            <Text style={styles.precio}>{'$'.repeat(est.rango_precios || 2)}</Text>
          </View>
          {est.genero_musical ? (
            <View style={styles.generoMusical}>
              <Text style={styles.generoText}>🎵 {est.genero_musical}</Text>
            </View>
          ) : null}
          {est.etiquetas && est.etiquetas.length > 0 ? (
            <View style={styles.etiquetas}>
              {est.etiquetas.map((et: any, i: number) => (
                <View key={i} style={styles.etiqueta}><Text style={styles.etiquetaText}>{et.icono} {et.nombre}</Text></View>
              ))}
            </View>
          ) : null}
        </View>
        <View style={styles.actions}>
          {est.telefono ? (
            <TouchableOpacity style={[styles.actionBtn, styles.actionBtnPrimary]} onPress={handleCall}>
              <Text style={styles.actionText}>📞 Llamar</Text>
            </TouchableOpacity>
          ) : null}
          {est.whatsapp ? (
            <TouchableOpacity style={[styles.actionBtn, styles.actionBtnWhatsApp]} onPress={handleWhatsApp}>
              <Text style={styles.actionText}>💬 WhatsApp</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity style={[styles.actionBtn, styles.actionBtnMaps]} onPress={handleMaps}>
            <Text style={styles.actionText}>🧭 Ir</Text>
          </TouchableOpacity>
        </View>
        {est.instagram ? (
          <TouchableOpacity style={styles.instagramBtn} onPress={handleInstagram}>
            <Text style={styles.instagramText}>📷 Instagram</Text>
          </TouchableOpacity>
        ) : null}
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
          {activeTab === 'info' ? (
            <View>
              {est.descripcion ? <Text style={styles.descripcion}>{est.descripcion}</Text> : null}
              <View style={styles.infoCard}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoIcon}>📍</Text>
                  <View style={{flex:1}}><Text style={styles.infoLabel}>Dirección</Text><Text style={styles.infoValue}>{est.direccion}</Text></View>
                </View>
                {est.telefono ? (
                  <View style={styles.infoItem}>
                    <Text style={styles.infoIcon}>📞</Text>
                    <View style={{flex:1}}><Text style={styles.infoLabel}>Teléfono</Text><Text style={styles.infoValue}>{est.telefono}</Text></View>
                  </View>
                ) : null}
                {est.email ? (
                  <View style={styles.infoItem}>
                    <Text style={styles.infoIcon}>📧</Text>
                    <View style={{flex:1}}><Text style={styles.infoLabel}>Email</Text><Text style={styles.infoValue}>{est.email}</Text></View>
                  </View>
                ) : null}
                {est.horarios && typeof est.horarios === "string" ? (
                  <View style={styles.infoItem}>
                    <Text style={styles.infoIcon}>🕐</Text>
                    <View style={{flex:1}}><Text style={styles.infoLabel}>Horarios</Text><Text style={styles.infoValue}>{est.horarios}</Text></View>
                  </View>
                ) : null}
              </View>
              {/* SEDES - Si es sede principal */}
              {est.sedes && est.sedes.length > 0 ? (
                <View style={styles.sedesSection}>
                  <Text style={styles.sedesTitle}>🏢 Sedes ({est.sedes.length})</Text>
                  {est.sedes.map((sede: any) => (
                    <TouchableOpacity key={sede.id} style={styles.sedeCard} onPress={() => navigation.push('Establecimiento', { slug: sede.slug })}>
                      <View style={styles.sedeIconBox}><Text style={styles.sedeIcon}>📍</Text></View>
                      <View style={styles.sedeInfo}>
                        <Text style={styles.sedeNombre}>{sede.nombre}</Text>
                        {sede.ciudad_nombre ? <Text style={styles.sedeCiudad}>{sede.ciudad_nombre}</Text> : null}
                        {sede.direccion ? <Text style={styles.sedeDireccion}>{sede.direccion}</Text> : null}
                        {sede.telefono ? <Text style={styles.sedeTelefono}>{sede.telefono}</Text> : null}
                      </View>
                      <Text style={styles.sedeArrow}>→</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : null}
              {/* SEDES - Si es sede secundaria */}
              {est.sede_principal ? (
                <View style={styles.sedesSection}>
                  <Text style={styles.sedesTitle}>🏢 Más sedes</Text>
                  <TouchableOpacity style={styles.sedePrincipalLink} onPress={() => navigation.push('Establecimiento', { slug: est.sede_principal.slug })}>
                    <Text style={styles.sedePrincipalText}>← Ver sede principal: {est.sede_principal.nombre}</Text>
                  </TouchableOpacity>
                  {est.otras_sedes && est.otras_sedes.length > 0 ? est.otras_sedes.map((sede: any) => (
                    <TouchableOpacity key={sede.id} style={styles.sedeCard} onPress={() => navigation.push('Establecimiento', { slug: sede.slug })}>
                      <View style={styles.sedeIconBox}><Text style={styles.sedeIcon}>📍</Text></View>
                      <View style={styles.sedeInfo}>
                        <Text style={styles.sedeNombre}>{sede.nombre}</Text>
                        {sede.ciudad_nombre ? <Text style={styles.sedeCiudad}>{sede.ciudad_nombre}</Text> : null}
                        {sede.direccion ? <Text style={styles.sedeDireccion}>{sede.direccion}</Text> : null}
                      </View>
                      <Text style={styles.sedeArrow}>→</Text>
                    </TouchableOpacity>
                  )) : null}
                </View>
              ) : null}
              {est.galeria && est.galeria.length > 0 ? (
                <View style={styles.galeria}>
                  <Text style={styles.galeriaTitle}>Fotos</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {est.galeria.map((foto: any, i: number) => <Image key={i} source={{ uri: foto.url }} style={styles.galeriaImage} />)}
                  </ScrollView>
                </View>
              ) : null}
            </View>
          ) : null}
          {activeTab === 'menu' ? (
            <View style={styles.emptyTab}><Text style={styles.emptyIcon}>🍽️</Text><Text style={styles.emptyText}>Ver menú en el establecimiento</Text></View>
          ) : null}
          {activeTab === 'resenas' ? (
            <View>
              {est.valoraciones_recientes && est.valoraciones_recientes.length > 0 ? est.valoraciones_recientes.map((val: any, i: number) => (
                <View key={i} style={styles.resenaCard}>
                  <Text style={styles.resenaUserName}>{val.usuario_nombre} • {'⭐'.repeat(val.puntuacion)}</Text>
                  {val.comentario ? <Text style={styles.resenaComentario}>{val.comentario}</Text> : null}
                </View>
              )) : (
                <View style={styles.emptyTab}><Text style={styles.emptyIcon}>📝</Text><Text style={styles.emptyText}>Sin reseñas aún</Text></View>
              )}
            </View>
          ) : null}
        </View>
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
  logoContainer: { position: 'absolute', top: 60, left: 0, right: 0, bottom: 40, justifyContent: 'center', alignItems: 'center' },
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
  instagramBtn: { marginHorizontal: 20, marginTop: 10, paddingVertical: 12, backgroundColor: '#E1306C', borderRadius: 12, alignItems: 'center' },
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
  // Sedes
  sedesSection: { marginTop: 24 },
  sedesTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF', marginBottom: 12 },
  sedeCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1A2E', borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#374151' },
  sedeIconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(0,115,255,0.15)', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  sedeIcon: { fontSize: 20 },
  sedeInfo: { flex: 1 },
  sedeNombre: { fontSize: 15, fontWeight: '600', color: '#FFF' },
  sedeCiudad: { fontSize: 13, color: '#0073FF', marginTop: 2 },
  sedeDireccion: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  sedeTelefono: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  sedeArrow: { fontSize: 18, color: '#0073FF', marginLeft: 8 },
  sedePrincipalLink: { backgroundColor: 'rgba(0,115,255,0.1)', borderRadius: 12, padding: 14, marginBottom: 12 },
  sedePrincipalText: { fontSize: 14, color: '#0073FF', fontWeight: '600' },
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
