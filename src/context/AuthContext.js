import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      const storedUser = await AsyncStorage.getItem("@user");
      if (storedUser) setUser(JSON.parse(storedUser));
    })();
  }, []);

  async function register({ name, email, password, photo }) {
    const storedUsers = JSON.parse(await AsyncStorage.getItem("@users")) || [];

    const alreadyExists = storedUsers.some((u) => u.email === email);
    if (alreadyExists) throw new Error("Este e-mail já está cadastrado.");

    const newUser = { name, email, password, photo };
    storedUsers.push(newUser);

    await AsyncStorage.setItem("@users", JSON.stringify(storedUsers));
    await AsyncStorage.setItem("@user", JSON.stringify(newUser));
    setUser(newUser);
  }

  async function login(email, password) {
    const storedUsers = JSON.parse(await AsyncStorage.getItem("@users")) || [];
    const found = storedUsers.find(
      (u) => u.email === email && u.password === password
    );
    if (found) {
      await AsyncStorage.setItem("@user", JSON.stringify(found));
      setUser(found);
      return true;
    }
    return false;
  }

  async function logout() {
    await AsyncStorage.removeItem("@user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
