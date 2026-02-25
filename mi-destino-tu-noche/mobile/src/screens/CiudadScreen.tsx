// CiudadScreen.tsx - con filtro por categoría
import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { establecimientosApi } from '../api/client';

function InitialsAvatar({ nombre, size = 60 }: { nombre: string; size?: number }) {
  const initials = nombre.split(' ').filter(w => w.length > 0).slice(0, 2).map(w => w[0].toUpperCase()).join('');
  const colors = ['#FF6B35', '#9B59B6', '#3498DB', '#E91E63', '#2ECC71', '#F39C12', '#1ABC9C', '#E74C3C'];
  return (
    <View style={{ width: size, height: size, backgroundColor: colors[nombre.length % colors.length], justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: '#FFF', fontSize: size * 0.35, fontWeight: 'bold' }}>{initials}</Text>
    </View>
  );
}

export default function CiudadScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { slug, nombre } = route.params;
  const [filtro, setFiltro] = useState('Todos');

  const { data, isLoading } = useQuery({
    queryKey: ['ciudad', slug],
    queryFn: () => establecimientosApi.getAll({ ciudad: slug, limite: 100 })
  });

  const establecimientos = data?.establecimientos || [];

  // Extract unique tipos for filter
  const tipos = useMemo(() => {
    const tipoSet = new Map<string, { nombre: string; icono: string; color: string }>();
    establecimientos.forEach((e: any) => {
      if (e.tipo_nombre && !tipoSet.has(e.tipo_nombre)) {
        tipoSet.set(e.tipo_nombre, { nombre: e.tipo_nombre, icono: e.tipo_icono || '📍', color: e.tipo_color || '#0073FF' });
      }
    });
    return Array.from(tipoSet.values());
  }, [establecimientos]);

  const filtered = filtro === 'Todos'
    ? establecimientos
    : establecimientos.filter((e: any) => e.tipo_nombre === filtro);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}><Text style={styles.backIcon}>←</Text></TouchableOpacity>
        <Text style={styles.title}>{nombre}</Text>
        <Text style={styles.count}>{filtered.length} lugares</Text>
      </View>

      {/* Category Filters */}
      {tipos.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll} contentContainerStyle={styles.filtersContent}>
          <TouchableOpacity
            onPress={() => setFiltro('Todos')}
            style={[styles.filterChip, filtro === 'Todos' && styles.filterChipActive]}
          >
            <Text style={[styles.filterText, filtro === 'Todos' && styles.filterTextActive]}>📍 Todos</Text>
          </TouchableOpacity>
          {tipos.map((tipo) => (
            <TouchableOpacity
              key={tipo.nombre}
              onPress={() => setFiltro(tipo.nombre)}
              style={[styles.filterChip, filtro === tipo.nombre && { backgroundColor: tipo.color, borderColor: tipo.color }]}
            >
              <Text style={[styles.filterText, filtro === tipo.nombre && styles.filterTextActive]}>
                {tipo.icono} {tipo.nombre}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Establecimiento', { slug: item.slug })}>
            {item.imagen_principal ? (
              <Image source={{ uri: item.imagen_principal }} style={styles.image} />
            ) : (
              <View style={[styles.image, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#1A1A2E' }]}>
                <InitialsAvatar nombre={item.nombre} size={50} />
              </View>
            )}
            <View style={styles.info}>
              <Text style={styles.nombre} numberOfLines={1}>{item.nombre}</Text>
              {item.tipo_nombre && (
                <View style={[styles.tipoBadge, { backgroundColor: (item.tipo_color || '#0073FF') + '20' }]}>
                  <Text style={[styles.tipoText, { color: item.tipo_color || '#0073FF' }]}>{item.tipo_icono} {item.tipo_nombre}</Text>
                </View>
              )}
              <Text style={styles.rating}>⭐ {item.valoracion_promedio ? Number(item.valoracion_promedio).toFixed(1) : 'Nuevo'}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>{isLoading ? '⏳' : '🏙️'}</Text>
            <Text style={styles.emptyText}>{isLoading ? 'Cargando...' : 'No hay lugares con este filtro'}</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F1A' },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  backBtn: { marginBottom: 8 },
  backIcon: { fontSize: 24, color: '#FFF' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#FFF' },
  count: { fontSize: 13, color: '#9CA3AF', marginTop: 4 },
  filtersScroll: { maxHeight: 50, marginBottom: 4 },
  filtersContent: { paddingHorizontal: 16, paddingVertical: 6 },
  filterChip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    marginRight: 8, borderWidth: 1, borderColor: '#374151', backgroundColor: '#1A1A2E',
  },
  filterChipActive: { backgroundColor: '#0073FF', borderColor: '#0073FF' },
  filterText: { color: '#9CA3AF', fontSize: 13, fontWeight: '500' },
  filterTextActive: { color: '#FFF' },
  list: { padding: 8 },
  row: { justifyContent: 'space-between' },
  card: { width: '48%', backgroundColor: '#1A1A2E', borderRadius: 14, marginBottom: 12, overflow: 'hidden' },
  image: { width: '100%', height: 120 },
  info: { padding: 10 },
  nombre: { fontSize: 14, fontWeight: 'bold', color: '#FFF' },
  tipoBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginTop: 4, alignSelf: 'flex-start' },
  tipoText: { fontSize: 11, fontWeight: '600' },
  rating: { fontSize: 12, color: '#FFF', marginTop: 6 },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 60 },
  emptyText: { fontSize: 16, color: '#6B7280', marginTop: 16 },
});
