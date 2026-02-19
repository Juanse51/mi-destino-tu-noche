// SearchScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { establecimientosApi, etiquetasApi, categoriasApi } from '../api/client';

export default function SearchScreen() {
  const navigation = useNavigation<any>();
  const [busqueda, setBusqueda] = useState('');
  const [filtros, setFiltros] = useState<any>({});

  const { data: resultados, isLoading } = useQuery({
    queryKey: ['busqueda', busqueda, filtros],
    queryFn: () => establecimientosApi.getAll({ busqueda, ...filtros, limite: 20 }),
    enabled: busqueda.length > 0 || Object.keys(filtros).length > 0,
  });

  const { data: tipos } = useQuery({
    queryKey: ['tipos'],
    queryFn: () => categoriasApi.getTipos(),
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar restaurantes, bares..."
            placeholderTextColor="#6B7280"
            value={busqueda}
            onChangeText={setBusqueda}
            autoFocus
          />
          {busqueda.length > 0 && (
            <TouchableOpacity onPress={() => setBusqueda('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filtros rápidos */}
      <View style={styles.filtrosContainer}>
        {(Array.isArray(tipos) ? tipos : []).map((tipo: any) => (
          <TouchableOpacity
            key={tipo.id}
            style={[styles.filtroChip, filtros.tipo === tipo.slug && styles.filtroChipActive]}
            onPress={() => setFiltros({ ...filtros, tipo: filtros.tipo === tipo.slug ? undefined : tipo.slug })}
          >
            <Text style={styles.filtroIcon}>{tipo.icono}</Text>
            <Text style={[styles.filtroText, filtros.tipo === tipo.slug && styles.filtroTextActive]}>
              {tipo.nombre}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Resultados */}
      <FlatList
        data={resultados?.establecimientos || []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.resultados}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.resultadoCard}
            onPress={() => navigation.navigate('Establecimiento', { slug: item.slug })}
          >
            <Image source={{ uri: item.imagen_principal }} style={styles.resultadoImage} />
            <View style={styles.resultadoInfo}>
              <Text style={styles.resultadoNombre}>{item.nombre}</Text>
              <Text style={styles.resultadoTipo}>{item.tipo_nombre} • {item.ciudad_nombre}</Text>
              <View style={styles.resultadoMeta}>
                <Text style={styles.resultadoRating}>⭐ {item.valoracion_promedio ? Number(item.valoracion_promedio).toFixed(1) : "-"}</Text>
                <Text style={styles.resultadoPrecio}>{'$'.repeat(item.rango_precios || 2)}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyText}>
              {busqueda ? 'No se encontraron resultados' : 'Busca tu próximo destino'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F1A' },
  searchContainer: { padding: 16 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#1A1A2E', borderRadius: 12,
    paddingHorizontal: 16, height: 50
  },
  searchIcon: { fontSize: 18, marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, color: '#FFF' },
  clearIcon: { fontSize: 16, color: '#6B7280' },
  filtrosContainer: { 
    flexDirection: 'row', paddingHorizontal: 16, 
    marginBottom: 16, gap: 8, flexWrap: 'wrap'
  },
  filtroChip: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#1A1A2E', paddingHorizontal: 12,
    paddingVertical: 8, borderRadius: 20
  },
  filtroChipActive: { backgroundColor: '#0073FF' },
  filtroIcon: { fontSize: 14, marginRight: 4 },
  filtroText: { fontSize: 13, color: '#9CA3AF' },
  filtroTextActive: { color: '#FFF' },
  resultados: { paddingHorizontal: 16 },
  resultadoCard: {
    flexDirection: 'row', backgroundColor: '#1A1A2E',
    borderRadius: 12, marginBottom: 12, overflow: 'hidden'
  },
  resultadoImage: { width: 100, height: 100 },
  resultadoInfo: { flex: 1, padding: 12, justifyContent: 'center' },
  resultadoNombre: { fontSize: 16, fontWeight: 'bold', color: '#FFF' },
  resultadoTipo: { fontSize: 13, color: '#0073FF', marginTop: 4 },
  resultadoMeta: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  resultadoRating: { fontSize: 13, color: '#FFF' },
  resultadoPrecio: { fontSize: 13, color: '#10B981', fontWeight: 'bold' },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyEmoji: { fontSize: 60 },
  emptyText: { fontSize: 16, color: '#6B7280', marginTop: 16 },
});
