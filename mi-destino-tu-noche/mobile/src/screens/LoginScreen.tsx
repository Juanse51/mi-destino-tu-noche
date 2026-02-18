// =====================================================
// LoginScreen - Inicio de Sesión
// =====================================================

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../store/authStore';

// Google Sign In solo funciona en móvil nativo, no en web
let GoogleSignin: any = null;
if (Platform.OS !== 'web') {
  try {
    const googleModule = require('@react-native-google-signin/google-signin');
    GoogleSignin = googleModule.GoogleSignin;
    GoogleSignin.configure({
      webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
    });
  } catch (e) {
    console.log('Google Sign In no disponible');
  }
}

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const { login, loginWithGoogle, isLoading, error, clearError } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }
    
    const success = await login(email, password);
    if (success) {
      navigation.goBack();
    }
  };

  const handleGoogleLogin = async () => {
    if (Platform.OS === 'web' || !GoogleSignin) {
      Alert.alert('Info', 'Google Sign In solo está disponible en la app móvil');
      return;
    }
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const { idToken } = await GoogleSignin.getTokens();
      
      if (idToken) {
        const success = await loginWithGoogle(idToken);
        if (success) {
          navigation.goBack();
        }
      }
    } catch (error: any) {
      console.error('Error Google Sign In:', error);
      Alert.alert('Error', 'No se pudo iniciar sesión con Google');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        {/* Header */}
        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.logo}>🌙</Text>
          <Text style={styles.title}>Mi Destino Tu Noche</Text>
          <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
        </View>

        {/* Google Button */}
        <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
          <Text style={styles.googleIcon}>G</Text>
          <Text style={styles.googleText}>Continuar con Google</Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>o</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputIcon}>📧</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#6B7280"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputIcon}>🔒</Text>
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#6B7280"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}

          <TouchableOpacity 
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Register Link */}
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>¿No tienes cuenta? </Text>
          <TouchableOpacity onPress={() => {
            clearError();
            navigation.replace('Register');
          }}>
            <Text style={styles.registerLink}>Regístrate</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F1A' },
  content: { flex: 1, paddingHorizontal: 24 },
  closeButton: { 
    alignSelf: 'flex-end', marginTop: 10,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#1A1A2E', justifyContent: 'center', alignItems: 'center'
  },
  closeIcon: { fontSize: 18, color: '#FFF' },
  header: { alignItems: 'center', marginTop: 20, marginBottom: 40 },
  logo: { fontSize: 60 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#FFF', marginTop: 16 },
  subtitle: { fontSize: 16, color: '#9CA3AF', marginTop: 8 },
  googleButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#FFF', paddingVertical: 14, borderRadius: 12
  },
  googleIcon: { 
    fontSize: 20, fontWeight: 'bold', color: '#4285F4',
    marginRight: 12 
  },
  googleText: { fontSize: 16, fontWeight: '600', color: '#333' },
  divider: { 
    flexDirection: 'row', alignItems: 'center', 
    marginVertical: 24 
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#374151' },
  dividerText: { color: '#6B7280', marginHorizontal: 16 },
  form: { gap: 16 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#1A1A2E', borderRadius: 12,
    paddingHorizontal: 16, height: 56
  },
  inputIcon: { fontSize: 20, marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: '#FFF' },
  errorText: { color: '#EF4444', textAlign: 'center' },
  loginButton: {
    backgroundColor: '#0073FF', paddingVertical: 16,
    borderRadius: 12, alignItems: 'center', marginTop: 8
  },
  loginButtonDisabled: { opacity: 0.7 },
  loginButtonText: { fontSize: 16, fontWeight: 'bold', color: '#FFF' },
  registerContainer: { 
    flexDirection: 'row', justifyContent: 'center', 
    marginTop: 32 
  },
  registerText: { color: '#9CA3AF', fontSize: 15 },
  registerLink: { color: '#0073FF', fontSize: 15, fontWeight: '600' },
});
