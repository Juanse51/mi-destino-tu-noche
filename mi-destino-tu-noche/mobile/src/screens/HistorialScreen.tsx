// HistorialScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { historialApi } from '../api/client';
import { useAuthStore } from '../store/authStore';

export default function HistorialScreen() {
  const navigation = useNavigation<any>();
  const { isAuthenticated } = useAuthStore();
  const { data } = useQuery({ queryKey: ['historial'], queryFn: () => historialApi.getAll(), enabled: isAuthenticated });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.backIcon}>←</Text></TouchableOpacity>
        <Text style={styles.title}>Historial 🕐</Text>
        <View style={{ width: 40 }} />
      </View>
      <FlatList
        data={data?.historial || []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Establecimiento', { slug: item.slug })}>
            <Image source={{ uri: item.imagen_principal }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.nombre}>{item.nombre}</Text>
              <Text style={styles.fecha}>{new Date(item.fecha_visita).toLocaleDateString('es-CO')}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<View style={styles.empty}><Text style={styles.emptyIcon}>🕐</Text><Text style={styles.emptyText}>Sin historial</Text></View>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F1A' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  backIcon: { fontSize: 24, color: '#FFF' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
  list: { padding: 16 },
  card: { flexDirection: 'row', backgroundColor: '#1A1A2E', borderRadius: 12, marginBottom: 12, overflow: 'hidden' },
  image: { width: 80, height: 80 },
  info: { flex: 1, padding: 12, justifyContent: 'center' },
  nombre: { fontSize: 16, fontWeight: 'bold', color: '#FFF' },
  fecha: { fontSize: 12, color: '#6B7280', marginTop: 4 },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 60 },
  emptyText: { fontSize: 16, color: '#6B7280', marginTop: 16 },
});
