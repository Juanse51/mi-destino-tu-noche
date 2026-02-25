// MDTNScreen - ¿Qué es Mi Destino Tu Noche?
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MDTNScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image
            source={{ uri: 'https://xzvfwxlgrwzcpofdubmg.supabase.co/storage/v1/object/public/imagenes/logos/logo%20mi%20destino%20tu%20noche.png' }}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>¿Qué es Mi Destino Tu Noche?</Text>
        <Text style={styles.subtitle}>
          La plataforma de Asobares que conecta a los colombianos con los mejores restaurantes, bares, cafés y discotecas del país.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Nuestra Misión</Text>
          <Text style={styles.cardText}>
            Mi Destino Tu Noche es una iniciativa de Asobares Colombia que busca impulsar y visibilizar la industria gastronómica y de entretenimiento nocturno en todo el país. Somos la guía definitiva para descubrir los mejores establecimientos, desde restaurantes de alta cocina hasta los bares más auténticos de cada ciudad.
          </Text>
        </View>

        {/* 9. Botones de YouTube en vez de video incrustado */}
        <View style={styles.videoBtns}>
          <TouchableOpacity style={styles.youtubeBtn} onPress={() => Linking.openURL('https://www.youtube.com/watch?v=YxOfBiwGP54')}>
            <Text style={styles.youtubeBtnEmoji}>▶️</Text>
            <Text style={styles.youtubeBtnText}>Ver video Mi Destino Tu Noche</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.youtubeBtn, { backgroundColor: '#DC2626' }]} onPress={() => Linking.openURL('https://www.youtube.com/watch?v=39-8t00QLAI')}>
            <Text style={styles.youtubeBtnEmoji}>▶️</Text>
            <Text style={styles.youtubeBtnText}>Ver video Asobares Colombia</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>¿Qué es Asobares?</Text>
          <Text style={styles.cardText}>
            La Asociación Colombiana de la Industria de la Vida Nocturna y Gastronómica (Asobares) es el gremio que agrupa y representa a los establecimientos nocturnos y gastronómicos de Colombia. Trabaja por la formalización, el bienestar y el desarrollo del sector.
          </Text>
          <Image
            source={{ uri: 'https://xzvfwxlgrwzcpofdubmg.supabase.co/storage/v1/object/public/imagenes/logos/Nuevo%20logo%20Asobares%20-%20Blanco.png' }}
            style={styles.asobaresLogo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.contactCard}>
          <Text style={styles.contactTitle}>¿Quieres registrar tu establecimiento?</Text>
          <TouchableOpacity style={styles.contactBtn} onPress={() => Linking.openURL('mailto:soporte@asobares.org')}>
            <Text style={styles.contactBtnText}>📧 soporte@asobares.org</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactBtn} onPress={() => Linking.openURL('tel:+573212304589')}>
            <Text style={styles.contactBtnText}>📞 +57 321 230 4589</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.social}>
          <Text style={styles.socialTitle}>Síguenos</Text>
          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialBtn} onPress={() => Linking.openURL('https://www.instagram.com/asobares.colombia/')}>
              <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/174/174855.png' }} style={styles.socialIconImg} />
              <Text style={styles.socialText}>Instagram</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn} onPress={() => Linking.openURL('https://www.facebook.com/Asobarescolombia')}>
              <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/174/174848.png' }} style={styles.socialIconImg} />
              <Text style={styles.socialText}>Facebook</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn} onPress={() => Linking.openURL('https://x.com/Asobares')}>
              <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/5968/5968958.png' }} style={styles.socialIconImg} />
              <Text style={styles.socialText}>X</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.devBy} onPress={() => Linking.openURL('https://www.vamosarayar.com')}>
          <Text style={styles.devByText}>Desarrollado por Rayar!</Text>
        </TouchableOpacity>
        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F1A' },
  header: { alignItems: 'center', paddingTop: 20, paddingBottom: 10 },
  logo: { height: 50, width: 200 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#FFF', textAlign: 'center', paddingHorizontal: 20, marginTop: 16 },
  subtitle: { fontSize: 15, color: '#9CA3AF', textAlign: 'center', paddingHorizontal: 30, marginTop: 10, lineHeight: 22 },
  card: { backgroundColor: '#1A1A2E', borderRadius: 16, padding: 20, marginHorizontal: 20, marginTop: 24 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF', marginBottom: 10 },
  cardText: { fontSize: 14, color: '#D1D5DB', lineHeight: 22 },
  asobaresLogo: { height: 50, width: 200, alignSelf: 'center', marginTop: 20 },
  videoBtns: { marginHorizontal: 20, marginTop: 20, gap: 12 },
  youtubeBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#FF0000', paddingVertical: 14, borderRadius: 16, gap: 8,
  },
  youtubeBtnEmoji: { fontSize: 18 },
  youtubeBtnText: { color: '#FFF', fontSize: 15, fontWeight: '600' },
  contactCard: {
    backgroundColor: '#0073FF', borderRadius: 16, padding: 20,
    marginHorizontal: 20, marginTop: 24, alignItems: 'center'
  },
  contactTitle: { fontSize: 16, fontWeight: 'bold', color: '#FFF', textAlign: 'center', marginBottom: 16 },
  contactBtn: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12, marginBottom: 10, width: '100%', alignItems: 'center' },
  contactBtnText: { color: '#FFF', fontSize: 14, fontWeight: '500' },
  social: { paddingHorizontal: 20, marginTop: 24 },
  socialTitle: { fontSize: 16, fontWeight: 'bold', color: '#FFF', marginBottom: 12 },
  socialRow: { flexDirection: 'row', gap: 12 },
  socialBtn: { flex: 1, backgroundColor: '#1A1A2E', borderRadius: 12, padding: 14, alignItems: 'center' },
  socialIconImg: { width: 28, height: 28 },
  socialText: { fontSize: 12, color: '#9CA3AF', marginTop: 6 },
  devBy: { alignItems: 'center', marginTop: 30, paddingVertical: 10 },
  devByText: { fontSize: 12, color: '#4B5563' },
});
