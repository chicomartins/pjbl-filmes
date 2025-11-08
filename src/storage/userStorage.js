import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = '@users';

export async function saveUser(user) {
  const users = await getUsers();
  users.push(user);
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export async function getUsers() {
  const data = await AsyncStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
}

export async function findUser(email, password) {
  const users = await getUsers();
  return users.find(u => u.email === email && u.password === password);
}