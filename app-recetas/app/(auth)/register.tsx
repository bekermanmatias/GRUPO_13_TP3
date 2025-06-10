// app/(auth)/register.js
import { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

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
    <View>
      <Text>Registro</Text>
      <TextInput placeholder="Email" onChangeText={setEmail} />
      <TextInput placeholder="Contraseña" secureTextEntry onChangeText={setPassword} />
      <TextInput placeholder="Confirmar contraseña" secureTextEntry onChangeText={setConfirmPassword} />
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      <Button title="Registrarse" onPress={handleRegister} />
    </View>
  );
}
