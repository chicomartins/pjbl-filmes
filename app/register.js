import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useAuth } from "../src/context/AuthContext";
import { supabase } from "../src/services/supabaseConfig";
import { db } from "../src/services/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  // 📸 Escolher foto da galeria
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão necessária", "Autorize o acesso à galeria.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: [ImagePicker.MediaType.image],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setPhoto(result.assets[0].uri);
    }
  };

  // 📷 Tirar foto com a câmera
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão necessária", "Autorize o acesso à câmera.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setPhoto(result.assets[0].uri);
    }
  };

  // 📤 Upload direto para Supabase usando arrayBuffer
  const uploadPhoto = async (uri, uid) => {
    try {
      const response = await fetch(uri);
      const buffer = await response.arrayBuffer(); // ✅ arrayBuffer em vez de blob
      const fileBytes = new Uint8Array(buffer);

      const filePath = `profile_photos/${uid}.jpg`;

      const { error } = await supabase.storage
        .from("profile_photos")
        .upload(filePath, fileBytes, {
          contentType: "image/jpeg",
          upsert: true,
        });

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from("profile_photos")
        .getPublicUrl(filePath);

      return publicUrlData.publicUrl;
    } catch (error) {
      console.error("Erro no upload:", error);
      Alert.alert("Erro", "Não foi possível enviar a foto de perfil.");
      return null;
    }
  };

  // 🧾 Cadastro completo
  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Preencha todos os campos!");
      return;
    }

    try {
      setLoading(true);

      // Cria usuário no Firebase Auth
      const newUser = await register({ email, password });

      // Faz upload da foto (se houver)
      let photoURL = null;
      if (photo) {
        photoURL = await uploadPhoto(photo, newUser.uid);
      }

      // Salva dados no Firestore
      await setDoc(doc(db, "users", newUser.uid), {
        name,
        email,
        photoURL,
        createdAt: new Date().toISOString(),
      });

      Alert.alert("Sucesso", "Conta criada com sucesso! Faça login para continuar.");
      router.replace("/login");
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      Alert.alert("Erro", "Não foi possível criar a conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Conta</Text>

      {/* Foto de perfil */}
      <TouchableOpacity
        style={styles.photoPicker}
        onPress={() =>
          Alert.alert(
            "Escolher foto",
            "Selecione uma opção",
            [
              { text: "Galeria", onPress: pickImage },
              { text: "Câmera", onPress: takePhoto },
              { text: "Cancelar", style: "cancel" },
            ],
            { cancelable: true }
          )
        }
      >
        <Image
          source={{
            uri: photo || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
          }}
          style={styles.avatar}
        />
        <Text style={styles.photoText}>Selecionar foto</Text>
      </TouchableOpacity>

      {/* Inputs */}
      <TextInput
        style={styles.input}
        placeholder="Nome completo"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Botão de cadastro */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Cadastrar</Text>}
      </TouchableOpacity>

      {/* Voltar para login */}
      <TouchableOpacity style={styles.secondaryButton} onPress={() => router.replace("/login")}>
        <Text style={styles.secondaryButtonText}>Voltar ao login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 30, textAlign: "center" },
  photoPicker: { alignItems: "center", marginBottom: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  photoText: { color: "#0066cc" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#0066cc",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: { color: "#fff", fontSize: 16 },
  secondaryButton: { alignItems: "center", marginTop: 10 },
  secondaryButtonText: { color: "#0066cc", fontSize: 16 },
});
