// CiudadScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { establecimientosApi } from '../api/client';

export default function CiudadScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { slug, nombre } = route.params;
  const { data, isLoading } = useQuery({ 
    queryKey: ['ciudad', slug], 
    queryFn: () => establecimientosApi.getAll({ ciudad: slug, limite: 50 }) 
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.backIcon}>←</Text></TouchableOpacity>
        <Text style={styles.title}>{nombre} 🏙️</Text>
        <View style={{ width: 40 }} />
      </View>
      <FlatList
        data={data?.establecimientos || []}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Establecimiento', { slug: item.slug })}>
            <Image source={{ uri: item.imagen_principal }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.nombre} numberOfLines={1}>{item.nombre}</Text>
              <Text style={styles.tipo}>{item.tipo_nombre}</Text>
              <Text style={styles.rating}>⭐ {Number(Number(item.valoracion_promedio) ? Number(item.valoracion_promedio).toFixed(1) : null || '-'}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🏙️</Text>
            <Text style={styles.emptyText}>{isLoading ? 'Cargando...' : 'No hay lugares en esta ciudad'}</Text>
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
  list: { padding: 8 },
  row: { justifyContent: 'space-between' },
  card: { width: '48%', backgroundColor: '#1A1A2E', borderRadius: 12, marginBottom: 12, overflow: 'hidden' },
  image: { width: '100%', height: 120 },
  info: { padding: 10 },
  nombre: { fontSize: 14, fontWeight: 'bold', color: '#FFF' },
  tipo: { fontSize: 12, color: '#0073FF', marginTop: 2 },
  rating: { fontSize: 12, color: '#FFF', marginTop: 4 },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 60 },
  emptyText: { fontSize: 16, color: '#6B7280', marginTop: 16 },
});
