
const STORAGE_KEY = 'owners';
let fakeOwners = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [
  { id: 1, nom: 'John Doe', telephone: '0601020304', email: 'john@example.com', adresse: 'Paris' },
  { id: 2, nom: 'Jane Smith', telephone: '0605060708', email: 'jane@example.com', adresse: 'Lyon' },
];

const saveToStorage = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(fakeOwners));
};

export const listOwners = async (q = "", page = 1, perPage = 8) => {
  let filtered = fakeOwners;
  if (q) {
    filtered = filtered.filter(o =>
      o.nom.toLowerCase().includes(q.toLowerCase()) ||
      o.telephone.includes(q) ||
      o.email.toLowerCase().includes(q.toLowerCase())
    );
  }
  const total = filtered.length;
  const lastPage = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  const end = start + perPage;
  return {
    data: filtered.slice(start, end),
    total,
    lastPage,
  };
};

export const createOwner = async (owner) => {
  const newOwner = { ...owner, id: Date.now() };
  fakeOwners.push(newOwner);
  saveToStorage();
  return newOwner;
};

export const updateOwner = async (id, data) => {
  const idx = fakeOwners.findIndex(o => o.id === id);
  if (idx === -1) throw new Error('Not found');
  fakeOwners[idx] = { ...fakeOwners[idx], ...data };
  saveToStorage();
  return fakeOwners[idx];
};

export const deleteOwner = async (id) => {
  fakeOwners = fakeOwners.filter(o => o.id !== id);
  saveToStorage();
  return id;
};

export const getOwner = async (id) => {
  return fakeOwners.find(o => o.id === id) || null;
};
