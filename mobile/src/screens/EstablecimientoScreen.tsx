// EstablecimientoScreen.tsx - Detalle de Establecimiento
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking, Share, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { establecimientosApi, favoritosApi, quieroIrApi } from '../api/client';
import { useAuthStore } from '../store/authStore';

export default function EstablecimientoScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { slug } = route.params;
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'info' | 'cupones' | 'menu' | 'resenas'>('info');
  const [copiedCupon, setCopiedCupon] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['establecimiento', slug],
    queryFn: () => establecimientosApi.getBySlug(slug),
  });

  const toggleFavorito = useMutation({
    mutationFn: () => favoritosApi.toggle(data?.data?.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['establecimiento', slug] }),
  });

  const est = data?.data;
  const handleShare = async () => { await Share.share({ message: `¡Mira ${est?.nombre}! https://midestinotunoche.com/${est?.slug}` }); };
  const handleCall = () => est?.telefono && Linking.openURL(`tel:${est.telefono}`);
  const handleWhatsApp = () => est?.whatsapp && Linking.openURL(`https://wa.me/${est.whatsapp}`);
  const handleMaps = () => est?.latitud && Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${est.latitud},${est.longitud}`);

  if (isLoading || !est) return <SafeAreaView style={styles.container}><View style={styles.loading}><Text style={styles.loadingText}>Cargando...</Text></View></SafeAreaView>;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: est.imagen_principal }} style={styles.headerImage} />
          <SafeAreaView style={styles.headerButtons}>
            <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}><Text style={styles.headerBtnIcon}>←</Text></TouchableOpacity>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.headerBtn} onPress={handleShare}><Text style={styles.headerBtnIcon}>↗</Text></TouchableOpacity>
              <TouchableOpacity style={styles.headerBtn} onPress={() => isAuthenticated ? toggleFavorito.mutate() : navigation.navigate('Login')}>
                <Text style={styles.headerBtnIcon}>{est.es_favorito ? '❤️' : '🤍'}</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
          <View style={styles.badgesContainer}>
            <View style={[styles.tipoBadge, { backgroundColor: est.tipo_color || '#FF6B35' }]}>
              <Text style={styles.tipoBadgeText}>{est.tipo_icono} {est.tipo_nombre}</Text>
            </View>
          </View>
        </View>

        <View style={styles.mainInfo}>
          <Text style={styles.nombre}>{est.nombre}</Text>
          <Text style={styles.tipoComida}>{est.tipo_comida_nombre}</Text>
          <View style={styles.metaRow}>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingStar}>⭐</Text>
              <Text style={styles.ratingText}>{Number(est.valoracion_promedio) ? Number(est.valoracion_promedio).toFixed(1) : 'Nuevo'}</Text>
              <Text style={styles.ratingCount}>({est.total_valoraciones})</Text>
            </View>
            <Text style={styles.precio}>{'$'.repeat(est.rango_precios || 2)}</Text>
          </View>
          {est.etiquetas?.length > 0 && (
            <View style={styles.etiquetas}>
              {est.etiquetas.map((et: any, i: number) => (
                <View key={i} style={styles.etiqueta}><Text style={styles.etiquetaText}>{et.icono} {et.nombre}</Text></View>
              ))}
            </View>
          )}
          {est.categorias_especiales?.length > 0 && (
            <View style={styles.categoriasEspeciales}>
              {est.categorias_especiales.map((cat: any, i: number) => (
                <View key={i} style={[styles.categoriaEspecial, { backgroundColor: cat.color + '30' }]}>
                  <Text style={[styles.categoriaEspecialText, { color: cat.color }]}>{cat.icono} {cat.nombre}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={[styles.actionBtn, styles.actionBtnPrimary]} onPress={handleCall}>
            <Text style={styles.actionText}>📞 Llamar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.actionBtnWhatsApp]} onPress={handleWhatsApp}>
            <Text style={styles.actionText}>💬 WhatsApp</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.actionBtnMaps]} onPress={handleMaps}>
            <Text style={styles.actionText}>🧭 Ir</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabs}>
          {(['info', 'cupones', 'menu', 'resenas'] as const).map((tab) => (
            <TouchableOpacity key={tab} style={[styles.tab, activeTab === tab && styles.tabActive]} onPress={() => setActiveTab(tab)}>
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab === 'info' ? 'Info' : tab === 'cupones' ? '🎟️ Cupones' : tab === 'menu' ? 'Menú' : 'Reseñas'}
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
                  <View><Text style={styles.infoLabel}>Dirección</Text><Text style={styles.infoValue}>{est.direccion}</Text></View>
                </View>
                {est.telefono && <View style={styles.infoItem}><Text style={styles.infoIcon}>📞</Text><View><Text style={styles.infoLabel}>Teléfono</Text><Text style={styles.infoValue}>{est.telefono}</Text></View></View>}
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
          {activeTab === 'cupones' && (
            <View>
              {est.cupones && est.cupones.length > 0 ? (
                est.cupones.map((cupon: any, i: number) => {
                  const daysLeft = Math.ceil((new Date(cupon.fecha_fin).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                  return (
                    <View key={i} style={[styles.cuponCard, { borderLeftColor: cupon.color_fondo }]}>
                      <View style={styles.cuponHeader}>
                        <Text style={[styles.cuponDiscount, { color: cupon.color_fondo }]}>
                          {cupon.tipo_descuento === 'porcentaje' ? `${cupon.valor_descuento}% OFF` :
                           cupon.tipo_descuento === 'monto_fijo' ? `$${cupon.valor_descuento?.toLocaleString()} OFF` :
                           cupon.tipo_descuento === '2x1' ? '2×1' : 'GRATIS'}
                        </Text>
                        <View style={styles.cuponCodeBox}>
                          <Text style={styles.cuponCodeLabel}>CÓDIGO</Text>
                          <Text style={[styles.cuponCode, { color: cupon.color_fondo }]}>{cupon.codigo}</Text>
                        </View>
                      </View>
                      <Text style={styles.cuponTitle}>{cupon.titulo}</Text>
                      <Text style={styles.cuponDesc}>{cupon.descripcion}</Text>
                      <View style={styles.cuponMeta}>
                        {cupon.consumo_minimo > 0 && <Text style={styles.cuponMetaText}>Mín: ${cupon.consumo_minimo.toLocaleString()}</Text>}
                        <Text style={styles.cuponMetaText}>{daysLeft > 0 ? `${daysLeft}d restantes` : 'Expira pronto'}</Text>
                      </View>
                      <TouchableOpacity 
                        style={[styles.cuponBtn, { backgroundColor: copiedCupon === cupon.id ? '#10B981' : cupon.color_fondo }]}
                        onPress={() => { setCopiedCupon(cupon.id); Alert.alert('Código copiado', `El código ${cupon.codigo} ha sido copiado. Preséntalo al momento de pagar.`); setTimeout(() => setCopiedCupon(null), 3000); }}
                      >
                        <Text style={styles.cuponBtnText}>{copiedCupon === cupon.id ? '✓ Copiado' : 'Usar cupón'}</Text>
                      </TouchableOpacity>
                    </View>
                  );
                })
              ) : (
                <View style={styles.emptyTab}>
                  <Text style={styles.emptyIcon}>🎟️</Text>
                  <Text style={styles.emptyText}>No hay cupones disponibles</Text>
                </View>
              )}
            </View>
          )}
          {activeTab === 'menu' && (
            <View style={styles.emptyTab}><Text style={styles.emptyIcon}>🍽️</Text><Text style={styles.emptyText}>Ver menú en el establecimiento</Text></View>
          )}
          {activeTab === 'resenas' && (
            <View>
              {est.valoraciones_recientes?.map((val: any, i: number) => (
                <View key={i} style={styles.resenaCard}>
                  <Text style={styles.resenaUserName}>{val.usuario_nombre} • {'⭐'.repeat(val.puntuacion)}</Text>
                  {val.comentario && <Text style={styles.resenaComentario}>{val.comentario}</Text>}
                </View>
              ))}
            </View>
          )}
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F1A' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#FFF', fontSize: 16 },
  imageContainer: { height: 280, position: 'relative' },
  headerImage: { width: '100%', height: '100%' },
  headerButtons: { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16 },
  headerRight: { flexDirection: 'row', gap: 8 },
  headerBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  headerBtnIcon: { fontSize: 20, color: '#FFF' },
  badgesContainer: { position: 'absolute', bottom: 16, left: 16, flexDirection: 'row', gap: 8 },
  tipoBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  tipoBadgeText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  mainInfo: { padding: 20 },
  nombre: { fontSize: 26, fontWeight: 'bold', color: '#FFF' },
  tipoComida: { fontSize: 15, color: '#FF6B35', marginTop: 4 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  ratingBadge: { flexDirection: 'row', alignItems: 'center' },
  ratingStar: { fontSize: 16 },
  ratingText: { fontSize: 16, fontWeight: 'bold', color: '#FFF', marginLeft: 4 },
  ratingCount: { fontSize: 13, color: '#6B7280', marginLeft: 4 },
  precio: { fontSize: 18, fontWeight: 'bold', color: '#10B981' },
  etiquetas: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 },
  etiqueta: { backgroundColor: '#1A1A2E', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  etiquetaText: { fontSize: 12, color: '#FFF' },
  categoriasEspeciales: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  categoriaEspecial: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  categoriaEspecialText: { fontSize: 12, fontWeight: '600' },
  actions: { flexDirection: 'row', paddingHorizontal: 20, gap: 10 },
  actionBtn: { flex: 1, alignItems: 'center', paddingVertical: 12, borderRadius: 12 },
  actionBtnPrimary: { backgroundColor: '#FF6B35' },
  actionBtnWhatsApp: { backgroundColor: '#25D366' },
  actionBtnMaps: { backgroundColor: '#4285F4' },
  actionText: { fontSize: 13, fontWeight: 'bold', color: '#FFF' },
  tabs: { flexDirection: 'row', marginTop: 20, borderBottomWidth: 1, borderBottomColor: '#1A1A2E' },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: '#FF6B35' },
  tabText: { fontSize: 14, color: '#6B7280' },
  tabTextActive: { color: '#FF6B35', fontWeight: '600' },
  tabContent: { padding: 20 },
  descripcion: { fontSize: 14, color: '#D1D5DB', lineHeight: 22 },
  infoCard: { backgroundColor: '#1A1A2E', borderRadius: 12, padding: 16, marginTop: 16 },
  infoItem: { flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#374151' },
  infoIcon: { fontSize: 18, marginRight: 12 },
  infoLabel: { fontSize: 11, color: '#6B7280' },
  infoValue: { fontSize: 14, color: '#FFF' },
  galeria: { marginTop: 20 },
  galeriaTitle: { fontSize: 16, fontWeight: 'bold', color: '#FFF', marginBottom: 12 },
  galeriaImage: { width: 180, height: 130, borderRadius: 12, marginRight: 12 },
  emptyTab: { alignItems: 'center', paddingVertical: 40 },
  emptyIcon: { fontSize: 48 },
  emptyText: { fontSize: 14, color: '#6B7280', marginTop: 12 },
  resenaCard: { backgroundColor: '#1A1A2E', borderRadius: 12, padding: 14, marginBottom: 12 },
  resenaUserName: { fontSize: 14, fontWeight: '600', color: '#FFF' },
  resenaComentario: { fontSize: 13, color: '#D1D5DB', marginTop: 8 },
  // Cupones styles
  cuponCard: { backgroundColor: '#1A1A2E', borderRadius: 12, padding: 16, marginBottom: 12, borderLeftWidth: 4 },
  cuponHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  cuponDiscount: { fontSize: 22, fontWeight: '900' },
  cuponCodeBox: { backgroundColor: '#0F0F1A', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, alignItems: 'center' },
  cuponCodeLabel: { fontSize: 8, color: '#6B7280', letterSpacing: 1 },
  cuponCode: { fontSize: 14, fontWeight: 'bold', fontFamily: 'monospace' },
  cuponTitle: { fontSize: 16, fontWeight: '600', color: '#FFF', marginBottom: 4 },
  cuponDesc: { fontSize: 13, color: '#9CA3AF', marginBottom: 10 },
  cuponMeta: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  cuponMetaText: { fontSize: 11, color: '#6B7280' },
  cuponBtn: { paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  cuponBtnText: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
});
