import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { findUser } from '../storage/userStorage';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin() {
    const user = await findUser(email, password);

    if (user) {
      Alert.alert('Bem-vindo!', `Olá, ${user.name}`);
      // depois vamos navegar para a tela principal
    } else {
      Alert.alert('Erro', 'Usuário ou senha incorretos!');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rate My Movie 🎬</Text>

      <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} />
      <TextInput placeholder="Senha" secureTextEntry style={styles.input} value={password} onChangeText={setPassword} />

      <Button title="Entrar" onPress={handleLogin} />
      <Button title="Criar Conta" onPress={() => navigation.navigate('Register')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 28, textAlign: 'center', marginBottom: 20, fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 10 },
});
