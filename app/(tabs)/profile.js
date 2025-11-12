import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Button,
} from "react-native";
import { useAuth } from "../../src/context/AuthContext";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { db, storage } from "../../src/services/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [photoURL, setPhotoURL] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔁 Redireciona se não houver usuário logado
  useEffect(() => {
    if (user === null) {
      router.replace("/login");
    }
  }, [user]);

  // 🔁 Carrega dados do perfil do Firestore
  useEffect(() => {
    if (!user) return;
    const loadProfile = async () => {
      try {
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const data = snap.data();
          if (data.photoURL) setPhotoURL(data.photoURL);
          if (data.name) setDisplayName(data.name);
        } else if (user.displayName) {
          setDisplayName(user.displayName);
        }
      } catch (e) {
        console.log("Erro ao buscar perfil:", e);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [user]);

  // 📸 Tirar foto com a câmera
  async function takePhoto() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão necessária", "Autorize o acesso à câmera.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.length > 0) {
      await uploadImage(result.assets[0].uri);
    }
  }

  // 🖼️ Escolher imagem da galeria
  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão necessária", "Autorize o acesso à galeria.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.length > 0) {
      await uploadImage(result.assets[0].uri);
    }
  }

  // ☁️ Faz upload da imagem e salva no Firestore
  async function uploadImage(uri) {
    try {
      setLoading(true);

      // ✅ Converte URI para bytes
      const response = await fetch(uri);
      const buffer = await response.arrayBuffer();
      const bytes = new Uint8Array(buffer);

      const storageRef = ref(storage, `profile_photos/${user.uid}.jpg`);
      await uploadBytes(storageRef, bytes);

      const downloadURL = await getDownloadURL(storageRef);

      const userRef = doc(db, "users", user.uid);
      await setDoc(
        userRef,
        { photoURL: downloadURL, email: user.email },
        { merge: true }
      );

      setPhotoURL(downloadURL);
      Alert.alert("Sucesso", "Foto de perfil atualizada!");
    } catch (error) {
      console.error("Erro no upload:", error);
      Alert.alert("Erro", "Falha ao enviar a foto.");
    } finally {
      setLoading(false);
    }
  }

  // 🔘 Opções para trocar a foto
  function handleChangePhoto() {
    Alert.alert(
      "Alterar foto",
      "Escolha uma opção:",
      [
        { text: "Tirar foto", onPress: takePhoto },
        { text: "Escolher da galeria", onPress: pickImage },
        { text: "Cancelar", style: "cancel" },
      ],
      { cancelable: true }
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!user) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meu Perfil</Text>

      {/* Foto agora não clicável */}
      <View>
        <Image
          source={{
            uri:
              photoURL ||
              user.photoURL ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png",
          }}
          style={styles.avatar}
        />
      </View>

      <Text style={styles.name}>{displayName || "Usuário"}</Text>
      <Text style={styles.email}>{user.email}</Text>

      <Button
        title="Sair"
        color="#d9534f"
        onPress={async () => {
          await logout();
          router.replace("/login");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#ccc",
  },
  name: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 10,
  },
  email: {
    fontSize: 18,
    color: "#555",
    marginBottom: 30,
  },
});
