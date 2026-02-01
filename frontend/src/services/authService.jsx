import { login as apiLogin, logout as apiLogout, getCurrentUser as apiGetCurrentUser, register as apiRegister } from '../api/auth.api';

export async function login(email, password) {
  const data = await apiLogin(email, password);
  return data.user;
}

export function logout() {
  apiLogout();
}

export async function getCurrentUser() {
  return await apiGetCurrentUser();
}

export async function register(name, email, password) {
  const data = await apiRegister(name, email, password);
  return data.user;
}

export function isAuthenticated() {
  return !!localStorage.getItem('accessToken');
}

// --- Gestion des utilisateurs (pour vétérinaires) ---
const USERS_KEY = "users";
const fakeUsers = [
  { id: 1, name: "DrMoha", email: "drMoha@test.com", password: "123456", role: "veterenaire" },
  { id: 2, name: "Admin", email: "aa@aa.com", password: "aa", role: "admin" },
];

function getAllUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY)) || fakeUsers;
}
function saveAllUsers(arr) {
  localStorage.setItem(USERS_KEY, JSON.stringify(arr));
}
function addUser(data) {
  const arr = getAllUsers();
  const id = Date.now();
  arr.push({ ...data, id });
  saveAllUsers(arr);
  return { id };
}
function updateUser(id, data) {
  const arr = getAllUsers();
  const idx = arr.findIndex((u) => u.id === id);
  if (idx !== -1) arr[idx] = { ...arr[idx], ...data };
  saveAllUsers(arr);
}
function removeUser(id) {
  const arr = getAllUsers().filter((u) => u.id !== id);
  saveAllUsers(arr);
}

export { getAllUsers, addUser, updateUser, removeUser };