// ProfileScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../store/authStore';

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const { usuario, isAuthenticated, logout } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loginPrompt}>
          <Text style={styles.promptEmoji}>👤</Text>
          <Text style={styles.promptTitle}>Mi Perfil</Text>
          <Text style={styles.promptText}>Inicia sesión para ver tu perfil</Text>
          <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const menuItems = [
    { icon: '📝', title: 'Mis Reseñas', screen: 'MisResenas' },
    { icon: '📋', title: 'Quiero Ir', screen: 'QuieroIr' },
    { icon: '🕐', title: 'Historial de Visitas', screen: 'Historial' },
    { icon: '🔔', title: 'Notificaciones', screen: 'Notificaciones' },
    { icon: '⚙️', title: 'Configuración', screen: 'Configuracion' },
    { icon: '❓', title: 'Ayuda', screen: 'Ayuda' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            {usuario?.avatar_url ? (
              <Image source={{ uri: usuario.avatar_url }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>{usuario?.nombre?.charAt(0).toUpperCase()}</Text>
              </View>
            )}
          </View>
          <Text style={styles.nombre}>{usuario?.nombre} {usuario?.apellido}</Text>
          <Text style={styles.email}>{usuario?.email}</Text>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Editar Perfil</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Reseñas</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Favoritos</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Visitas</Text>
          </View>
        </View>

        {/* Menu */}
        <View style={styles.menu}>
          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.menuItem}
              onPress={() => navigation.navigate(item.screen)}
            >
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutIcon}>🚪</Text>
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F1A' },
  loginPrompt: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  promptEmoji: { fontSize: 80 },
  promptTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFF', marginTop: 20 },
  promptText: { fontSize: 16, color: '#6B7280', marginTop: 8 },
  loginButton: { backgroundColor: '#0073FF', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 12, marginTop: 24 },
  loginButtonText: { fontSize: 16, fontWeight: 'bold', color: '#FFF' },
  header: { alignItems: 'center', paddingVertical: 30 },
  avatarContainer: { marginBottom: 16 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  avatarPlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#0073FF', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 40, fontWeight: 'bold', color: '#FFF' },
  nombre: { fontSize: 24, fontWeight: 'bold', color: '#FFF' },
  email: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  editButton: { marginTop: 16, paddingVertical: 10, paddingHorizontal: 24, backgroundColor: '#1A1A2E', borderRadius: 20 },
  editButtonText: { color: '#0073FF', fontWeight: '600' },
  stats: { flexDirection: 'row', backgroundColor: '#1A1A2E', marginHorizontal: 20, borderRadius: 16, padding: 20 },
  statItem: { flex: 1, alignItems: 'center' },
  statNumber: { fontSize: 24, fontWeight: 'bold', color: '#FFF' },
  statLabel: { fontSize: 12, color: '#6B7280', marginTop: 4 },
  statDivider: { width: 1, backgroundColor: '#374151' },
  menu: { marginTop: 24, paddingHorizontal: 20 },
  menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1A2E', padding: 16, borderRadius: 12, marginBottom: 8 },
  menuIcon: { fontSize: 20, marginRight: 16 },
  menuTitle: { flex: 1, fontSize: 16, color: '#FFF' },
  menuArrow: { fontSize: 20, color: '#6B7280' },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 24, marginBottom: 40, padding: 16 },
  logoutIcon: { fontSize: 20, marginRight: 8 },
  logoutText: { fontSize: 16, color: '#EF4444', fontWeight: '600' },
});
