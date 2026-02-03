// CategoriaScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { establecimientosApi } from '../api/client';

export default function CategoriaScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { slug, nombre } = route.params;
  const { data, isLoading } = useQuery({ 
    queryKey: ['categoria', slug], 
    queryFn: () => establecimientosApi.getByCategoria(slug, { limite: 50 }) 
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.backIcon}>←</Text></TouchableOpacity>
        <Text style={styles.title}>{nombre}</Text>
        <View style={{ width: 40 }} />
      </View>
      
      {data?.data?.categoria && (
        <View style={styles.categoriaInfo}>
          <Text style={styles.categoriaDesc}>{data.data.categoria.descripcion}</Text>
        </View>
      )}
      
      <FlatList
        data={data?.data?.establecimientos || []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Establecimiento', { slug: item.slug })}>
            <Image source={{ uri: item.imagen_principal }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.nombre} numberOfLines={1}>{item.nombre}</Text>
              <Text style={styles.tipo}>{item.tipo_nombre} • {item.ciudad_nombre}</Text>
              <View style={styles.meta}>
                <Text style={styles.rating}>⭐ {Number(item.valoracion_promedio) ? Number(item.valoracion_promedio).toFixed(1) : '-'}</Text>
                <Text style={styles.precio}>{'$'.repeat(item.rango_precios || 2)}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📂</Text>
            <Text style={styles.emptyText}>{isLoading ? 'Cargando...' : 'No hay lugares en esta categoría'}</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F1A' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  backIcon: { fontSize: 24, color: '#FFF' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
  categoriaInfo: { paddingHorizontal: 16, paddingBottom: 16 },
  categoriaDesc: { fontSize: 14, color: '#9CA3AF', lineHeight: 20 },
  list: { padding: 16 },
  card: { flexDirection: 'row', backgroundColor: '#1A1A2E', borderRadius: 12, marginBottom: 12, overflow: 'hidden' },
  image: { width: 100, height: 100 },
  info: { flex: 1, padding: 12, justifyContent: 'center' },
  nombre: { fontSize: 16, fontWeight: 'bold', color: '#FFF' },
  tipo: { fontSize: 13, color: '#FF6B35', marginTop: 4 },
  meta: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  rating: { fontSize: 13, color: '#FFF' },
  precio: { fontSize: 13, color: '#10B981', fontWeight: 'bold' },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 60 },
  emptyText: { fontSize: 16, color: '#6B7280', marginTop: 16 },
});
