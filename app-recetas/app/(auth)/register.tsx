import { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { useRouter } from 'expo-router';
import { useColorScheme } from '../../hooks/useColorScheme';
import { Colors } from '../../constants/Colors';
import { useThemeColor } from '../../hooks/useThemeColor';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const theme = useColorScheme();
  
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const buttonColor = useThemeColor({}, 'buttonPrimary');

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // El usuario será redirigido automáticamente por _layout.js al estar autenticado
    } catch (e) {
      setError('Could not register. Do you already have an account?');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color: textColor }]}>Register</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#888"
        style={[styles.input, { 
          backgroundColor: Colors[theme].inputBackground,
          color: textColor,
          borderColor: theme === 'dark' ? '#555' : '#ddd'
        }]}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#888"
        style={[styles.input, { 
          backgroundColor: Colors[theme].inputBackground,
          color: textColor,
          borderColor: theme === 'dark' ? '#555' : '#ddd'
        }]}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        placeholder="Confirm password"
        placeholderTextColor="#888"
        style={[styles.input, { 
          backgroundColor: Colors[theme].inputBackground,
          color: textColor,
          borderColor: theme === 'dark' ? '#555' : '#ddd'
        }]}
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={[styles.button, { backgroundColor: buttonColor }]} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.loginLink}
        onPress={() => router.push('/(auth)/login')}
      >
        <Text style={[styles.loginText, { color: buttonColor }]}>Already have an account? Login</Text>
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
  },
  error: {
    color: 'red',
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
    color: 'white',
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
