// RegisterScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../store/authStore';

export default function RegisterScreen() {
  const navigation = useNavigation<any>();
  const { register, isLoading, error } = useAuthStore();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!nombre || !email || !password) { Alert.alert('Error', 'Completa todos los campos'); return; }
    if (password.length < 8) { Alert.alert('Error', 'La contraseña debe tener al menos 8 caracteres'); return; }
    const success = await register({ nombre, email, password });
    if (success) navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.content}>
        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}><Text style={styles.closeIcon}>✕</Text></TouchableOpacity>
        <View style={styles.header}>
          <Text style={styles.logo}>🌙</Text>
          <Text style={styles.title}>Crear Cuenta</Text>
        </View>
        <View style={styles.form}>
          <View style={styles.inputContainer}><Text style={styles.inputIcon}>👤</Text><TextInput style={styles.input} placeholder="Nombre" placeholderTextColor="#6B7280" value={nombre} onChangeText={setNombre} /></View>
          <View style={styles.inputContainer}><Text style={styles.inputIcon}>📧</Text><TextInput style={styles.input} placeholder="Email" placeholderTextColor="#6B7280" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" /></View>
          <View style={styles.inputContainer}><Text style={styles.inputIcon}>🔒</Text><TextInput style={styles.input} placeholder="Contraseña" placeholderTextColor="#6B7280" value={password} onChangeText={setPassword} secureTextEntry /></View>
          {error && <Text style={styles.errorText}>{error}</Text>}
          <TouchableOpacity style={[styles.registerButton, isLoading && styles.buttonDisabled]} onPress={handleRegister} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.registerButtonText}>Crear Cuenta</Text>}
          </TouchableOpacity>
        </View>
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>
          <TouchableOpacity onPress={() => navigation.replace('Login')}><Text style={styles.loginLink}>Inicia Sesión</Text></TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F1A' },
  content: { flex: 1, paddingHorizontal: 24 },
  closeButton: { alignSelf: 'flex-end', marginTop: 10, width: 40, height: 40, borderRadius: 20, backgroundColor: '#1A1A2E', justifyContent: 'center', alignItems: 'center' },
  closeIcon: { fontSize: 18, color: '#FFF' },
  header: { alignItems: 'center', marginTop: 20, marginBottom: 40 },
  logo: { fontSize: 60 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#FFF', marginTop: 16 },
  form: { gap: 16 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1A2E', borderRadius: 12, paddingHorizontal: 16, height: 56 },
  inputIcon: { fontSize: 20, marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: '#FFF' },
  errorText: { color: '#EF4444', textAlign: 'center' },
  registerButton: { backgroundColor: '#0073FF', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  buttonDisabled: { opacity: 0.7 },
  registerButtonText: { fontSize: 16, fontWeight: 'bold', color: '#FFF' },
  loginContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 32 },
  loginText: { color: '#9CA3AF', fontSize: 15 },
  loginLink: { color: '#0073FF', fontSize: 15, fontWeight: '600' },
});
