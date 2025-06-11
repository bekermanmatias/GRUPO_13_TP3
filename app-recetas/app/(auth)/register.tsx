import { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/context/ThemeContext'; // o el path correcto

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { theme, toggleTheme, mode } = useTheme();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // El usuario será redirigido automáticamente por _layout.js al estar autenticado
    } catch (e) {
      setError('No se pudo registrar. ¿Ya tenés una cuenta?');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]} >Registro</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor={theme.placeholderText}
        style={[styles.input, { backgroundColor: theme.inputBackground, borderColor: theme.border }]}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Contraseña"
        placeholderTextColor={theme.placeholderText}
        style={[styles.input, { backgroundColor: theme.inputBackground, borderColor: theme.border }]}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        placeholder="Confirmar contraseña"
        placeholderTextColor={theme.placeholderText}
        style={[styles.input, { backgroundColor: theme.inputBackground, borderColor: theme.border }]}
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {error ? <Text style={[styles.error, { color: theme.error }]}>{error}</Text> : null}

      <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary }]} onPress={handleRegister}>
        <Text style={[styles.buttonText, { color: theme.buttonText }]}>Registrarse</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.loginLink}
        onPress={() => router.push('/(auth)/login')}
      >
        <Text style={[styles.loginText, { color: theme.link }]}>¿Ya tenés cuenta? Iniciar sesión</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={toggleTheme} style={{ marginTop: 20, alignItems: 'center' }}>
        <Text style={{ color: theme.link }}>
          Cambiar a modo {mode === 'light' ? 'oscuro' : 'claro'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    fontSize: 16,
    color: 'inherit', // para tomar el color del tema
  },
  error: {
    marginBottom: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 3,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginLink: {
    alignItems: 'center',
    marginTop: 8,
  },
  loginText: {
    fontWeight: '600',
    fontSize: 16,
  },
});
