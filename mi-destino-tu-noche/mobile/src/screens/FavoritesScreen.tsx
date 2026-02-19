// FavoritesScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { favoritosApi } from '../api/client';
import { useAuthStore } from '../store/authStore';

export default function FavoritesScreen() {
  const navigation = useNavigation<any>();
  const { isAuthenticated } = useAuthStore();

  const { data: favoritos, isLoading } = useQuery({
    queryKey: ['favoritos'],
    queryFn: () => favoritosApi.getAll(),
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loginPrompt}>
          <Text style={styles.promptEmoji}>❤️</Text>
          <Text style={styles.promptTitle}>Tus Favoritos</Text>
          <Text style={styles.promptText}>Inicia sesión para guardar tus lugares favoritos</Text>
          <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Favoritos</Text>
      <FlatList
        data={favoritos || []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Establecimiento', { slug: item.slug })}
          >
            <Image source={{ uri: item.imagen_principal }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.nombre}>{item.nombre}</Text>
              <Text style={styles.tipo}>{item.tipo_nombre} • {item.ciudad_nombre}</Text>
              <Text style={styles.rating}>⭐ {Number(item.valoracion_promedio) ? Number(item.valoracion_promedio).toFixed(1) : null || '-'}</Text>
            </View>
            <Text style={styles.heart}>❤️</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>💔</Text>
            <Text style={styles.emptyText}>No tienes favoritos aún</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F1A' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FFF', padding: 20 },
  loginPrompt: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  promptEmoji: { fontSize: 80 },
  promptTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFF', marginTop: 20 },
  promptText: { fontSize: 16, color: '#6B7280', marginTop: 8, textAlign: 'center' },
  loginButton: { backgroundColor: '#0073FF', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 12, marginTop: 24 },
  loginButtonText: { fontSize: 16, fontWeight: 'bold', color: '#FFF' },
  list: { padding: 16 },
  card: { flexDirection: 'row', backgroundColor: '#1A1A2E', borderRadius: 12, marginBottom: 12, overflow: 'hidden' },
  image: { width: 100, height: 100 },
  info: { flex: 1, padding: 12, justifyContent: 'center' },
  nombre: { fontSize: 16, fontWeight: 'bold', color: '#FFF' },
  tipo: { fontSize: 13, color: '#0073FF', marginTop: 4 },
  rating: { fontSize: 13, color: '#FFF', marginTop: 6 },
  heart: { justifyContent: 'center', paddingRight: 16, fontSize: 20 },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyEmoji: { fontSize: 60 },
  emptyText: { fontSize: 16, color: '#6B7280', marginTop: 16 },
});
