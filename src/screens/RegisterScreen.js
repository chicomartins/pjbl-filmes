import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { saveUser } from '../storage/userStorage';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  }

  async function handleRegister() {
    if (!name || !email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    const newUser = { name, email, password, image };
    await saveUser(newUser);

    Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
    navigation.navigate('Login');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastrar</Text>

      <TextInput placeholder="Nome" style={styles.input} value={name} onChangeText={setName} />
      <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} />
      <TextInput placeholder="Senha" secureTextEntry style={styles.input} value={password} onChangeText={setPassword} />

      <Button title="Escolher Foto de Perfil" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}

      <Button title="Cadastrar" onPress={handleRegister} />
      <Button title="Voltar para o Login" onPress={() => navigation.navigate('Login')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 10 },
  image: { width: 100, height: 100, borderRadius: 50, alignSelf: 'center', marginVertical: 10 },
});