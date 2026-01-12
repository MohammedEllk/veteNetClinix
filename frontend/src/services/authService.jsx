// --- Gestion des utilisateurs (pour vétérinaires) ---
const USERS_KEY = "users";
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
const STORAGE_KEY = "accessToken";

const fakeUsers = [
  { id: 1, name: "DrMoha", email: "drMoha@test.com", password: "123456", role: "veterenaire" },
  { id: 2, name: "Admin", email: "aa@aa.com", password: "aa", role: "admin" },
];

function createFakeToken(payload) {
  return btoa(JSON.stringify({
    ...payload,
    exp: Date.now() + 1000 * 60 * 60 * 24,
  }));
}

function decodeFakeToken(token) {
  return JSON.parse(atob(token));
}

export async function login(email, password) {
  const user = fakeUsers.find(
    u => u.email === email && u.password === password
  );

  if (!user) {
    throw new Error("Le mots de passe ou l'email sont incorrects.");
  }

  const token = createFakeToken({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });

  localStorage.setItem(STORAGE_KEY, token);
  return user;
}

export function logout() {
  localStorage.removeItem(STORAGE_KEY);
}

export function getCurrentUser() {
  const token = localStorage.getItem(STORAGE_KEY);
  if (!token) return null;

  try {
    const data = decodeFakeToken(token);
    if (Date.now() > data.exp) {
      logout();
      return null;
    }
    return data;
  } catch {
    logout();
    return null;
  }
}

export function isAuthenticated() {
  return !!getCurrentUser();
}