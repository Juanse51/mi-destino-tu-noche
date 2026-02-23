// DJsScreen.tsx - Directorio de DJs
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const djs = [
  { nombre: 'DJ JOKER', genero: 'Crossover', whatsapp: '573103220781', email: 'jokerdjiba@gmail.com', disponibilidad: 'A nivel nacional' },
  { nombre: 'DJ SANTIAGO CRUZ', genero: 'Crossover', whatsapp: '573028270452', email: 'antiagofelipe17@hotmail.com', disponibilidad: 'Cundinamarca' },
  { nombre: 'DJ ANDRÉS MACIÁ', genero: 'Crossover, ritmos latinos, electrónica global y clásicos atemporales', whatsapp: '573008369131', email: 'cotizaciondjam@gmail.com', disponibilidad: 'Regional, nacional e internacional' },
  { nombre: 'DJ ZMOXX', genero: 'Crossover', whatsapp: '573215758189', email: 'DJZMOXX77@GMAIL.COM', disponibilidad: 'Regional y nacional' },
  { nombre: 'DJ JARO PITRO', genero: 'House, Nu Disco, Afro House, Tech House, Deep House, Caribbean, Crossover, Clásicos 70s-80s-2000s', whatsapp: '573106570454', email: 'jaropitro@hotmail.com', disponibilidad: 'Cartagena y nacional' },
  { nombre: 'TRVX', genero: 'Groove, Trance, Techno', whatsapp: '573026666975', email: 'sebastianpena3124@gmail.com', disponibilidad: 'Nacional' },
  { nombre: 'DJ ALEXIS CASTAÑO', genero: 'Crossover', whatsapp: '573217042557', email: 'djalexiscastano@gmail.com', disponibilidad: 'Nacional y regional' },
  { nombre: 'KIKE SERRANO', genero: 'House, Fusión, Latino', whatsapp: '573008054648', email: 'djkikeserrano@gmail.com', disponibilidad: 'Cartagena y nacional' },
  { nombre: 'DJ DANIEL MIELES', genero: 'Crossover, electrónica y urbano', whatsapp: '573008105366', email: 'danielmielesproducciones@gmail.com', disponibilidad: 'Local, nacional e internacional' },
  { nombre: 'JOHNNY HOUSE-IN', genero: 'House, Nu Disco', whatsapp: '', email: '', disponibilidad: 'Nacional' },
  { nombre: 'DUBCODE', genero: 'Electrónica', whatsapp: '', email: '', disponibilidad: 'Nacional' },
  { nombre: 'MACHU75', genero: 'House, Progressive House, Dance', whatsapp: '', email: '', disponibilidad: 'Zipaquirá, Cundinamarca - Nacional' },
  { nombre: 'LIUCH DJ', genero: 'Afro House, Tech House, Progressive, Techno', whatsapp: '', email: '', disponibilidad: 'Zipaquirá, Cundinamarca - Nacional' },
];

const colores = ['#FF6B35', '#9B59B6', '#E91E63', '#00BCD4', '#4CAF50', '#FF9800', '#3F51B5', '#F44336', '#009688', '#FF5722', '#673AB7', '#2196F3', '#8BC34A'];

export default function DJsScreen() {
  const navigation = useNavigation<any>();
  const [search, setSearch] = useState('');

  const filtered = djs.filter(dj =>
    dj.nombre.toLowerCase().includes(search.toLowerCase()) ||
    dj.genero.toLowerCase().includes(search.toLowerCase()) ||
    dj.disponibilidad.toLowerCase().includes(search.toLowerCase())
  );

  const whatsappMsg = encodeURIComponent('Hola, te contacto desde Mi Destino Tu Noche, estoy interesado en contratar tus servicios de DJ.');

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <SafeAreaView>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.backBtnText}>← Volver</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>🎧 ¿Tienes una fiesta?</Text>
            <Text style={styles.headerSubtitle}>Nosotros tenemos el DJ. Conoce los mejores DJs de Colombia.</Text>
            
            {/* Search */}
            <View style={styles.searchContainer}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar por nombre, género o ciudad..."
                placeholderTextColor="#6B7280"
                value={search}
                onChangeText={setSearch}
              />
            </View>
          </SafeAreaView>
        </View>

        {/* Count */}
        <Text style={styles.count}>{filtered.length} DJs disponibles</Text>

        {/* DJs List */}
        <View style={styles.list}>
          {filtered.map((dj, i) => (
            <View key={i} style={styles.djCard}>
              {/* Color header */}
              <View style={[styles.djCardHeader, { backgroundColor: colores[i % colores.length] + '40' }]}>
                <View style={[styles.avatar, { backgroundColor: colores[i % colores.length] }]}>
                  <Text style={styles.avatarText}>{dj.nombre.charAt(0)}</Text>
                </View>
              </View>

              {/* Content */}
              <View style={styles.djCardContent}>
                <Text style={styles.djNombre}>{dj.nombre}</Text>
                
                <View style={styles.djInfoRow}>
                  <Text style={styles.djInfoIcon}>🎵</Text>
                  <Text style={styles.djGenero}>{dj.genero}</Text>
                </View>

                <View style={styles.djInfoRow}>
                  <Text style={styles.djInfoIcon}>📍</Text>
                  <Text style={styles.djDisponibilidad}>{dj.disponibilidad}</Text>
                </View>

                {/* Buttons */}
                <View style={styles.djButtons}>
                  {dj.whatsapp ? (
                    <TouchableOpacity
                      style={styles.djBtnWhatsApp}
                      onPress={() => Linking.openURL('https://wa.me/' + dj.whatsapp + '?text=' + whatsappMsg)}
                    >
                      <Text style={styles.djBtnText}>💬 WhatsApp</Text>
                    </TouchableOpacity>
                  ) : null}
                  {dj.email ? (
                    <TouchableOpacity
                      style={styles.djBtnEmail}
                      onPress={() => Linking.openURL('mailto:' + dj.email)}
                    >
                      <Text style={styles.djBtnText}>📧 Email</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>
            </View>
          ))}

          {filtered.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyText}>No se encontraron DJs</Text>
            </View>
          ) : null}
        </View>

        {/* CTA */}
        <View style={styles.cta}>
          <Text style={styles.ctaTitle}>¿Eres DJ y quieres estar aquí?</Text>
          <Text style={styles.ctaSubtitle}>Únete al directorio de DJs de Mi Destino Tu Noche</Text>
          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={() => Linking.openURL('https://wa.me/573212304589?text=Hola%2C%20soy%20DJ%20y%20quiero%20registrarme%20en%20Mi%20Destino%20Tu%20Noche.')}
          >
            <Text style={styles.ctaBtnText}>💬 Contáctanos</Text>
          </TouchableOpacity>
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
  header: { backgroundColor: '#1a1060', paddingBottom: 20 },
  backBtn: { paddingHorizontal: 20, paddingVertical: 10 },
  backBtnText: { color: 'rgba(255,255,255,0.6)', fontSize: 14 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#FFF', textAlign: 'center', marginTop: 8 },
  headerSubtitle: { fontSize: 15, color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginTop: 8, paddingHorizontal: 30 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)', marginHorizontal: 20, marginTop: 16, borderRadius: 12, paddingHorizontal: 14 },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, color: '#FFF', paddingVertical: 12, fontSize: 14 },
  count: { color: '#9CA3AF', fontSize: 14, paddingHorizontal: 20, marginTop: 20, marginBottom: 12 },
  list: { paddingHorizontal: 20 },
  djCard: { backgroundColor: '#1A1A2E', borderRadius: 16, marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#374151' },
  djCardHeader: { height: 60, justifyContent: 'flex-end', paddingLeft: 20, paddingBottom: -20 },
  avatar: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: -28, left: 20, borderWidth: 3, borderColor: '#1A1A2E' },
  avatarText: { fontSize: 24, fontWeight: 'bold', color: '#FFF' },
  djCardContent: { padding: 20, paddingTop: 36 },
  djNombre: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
  djInfoRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 8 },
  djInfoIcon: { fontSize: 14, marginRight: 8, marginTop: 1 },
  djGenero: { fontSize: 13, color: '#D1D5DB', flex: 1 },
  djDisponibilidad: { fontSize: 13, color: '#9CA3AF', flex: 1 },
  djButtons: { flexDirection: 'row', gap: 10, marginTop: 14 },
  djBtnWhatsApp: { flex: 1, backgroundColor: '#25D366', paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  djBtnEmail: { flex: 1, backgroundColor: '#0073FF', paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  djBtnText: { color: '#FFF', fontSize: 13, fontWeight: '600' },
  empty: { alignItems: 'center', paddingVertical: 40 },
  emptyIcon: { fontSize: 48 },
  emptyText: { fontSize: 14, color: '#6B7280', marginTop: 12 },
  cta: { backgroundColor: '#1A1A2E', borderRadius: 16, marginHorizontal: 20, marginTop: 20, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: '#374151' },
  ctaTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF', textAlign: 'center' },
  ctaSubtitle: { fontSize: 14, color: '#9CA3AF', marginTop: 8, textAlign: 'center' },
  ctaBtn: { backgroundColor: '#0073FF', paddingHorizontal: 28, paddingVertical: 12, borderRadius: 12, marginTop: 16 },
  ctaBtnText: { color: '#FFF', fontSize: 15, fontWeight: '600' },
  devBy: { alignItems: 'center', marginTop: 20, paddingVertical: 10 },
  devByText: { fontSize: 12, color: '#4B5563' },
});
