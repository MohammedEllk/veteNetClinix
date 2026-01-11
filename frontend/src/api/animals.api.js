
const STORAGE_KEY = 'animals';
let fakeAnimals = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [
  { id: 1, nom: 'Rex', espece: 'Chien', race: 'Berger', sexe: 'M', date_naissance: '2020-01-01', proprietaire_id: 1 },
  { id: 2, nom: 'Mimi', espece: 'Chat', race: 'Européen', sexe: 'F', date_naissance: '2021-05-10', proprietaire_id: 2 },
];

const saveToStorage = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(fakeAnimals));
};

export const listAnimals = async (q = "", page = 1, perPage = 6, proprietaire_id = null) => {
  let filtered = fakeAnimals;
  if (proprietaire_id) {
    filtered = filtered.filter(a => a.proprietaire_id === proprietaire_id);
  }
  if (q) {
    filtered = filtered.filter(a =>
      a.nom.toLowerCase().includes(q.toLowerCase()) ||
      a.espece.toLowerCase().includes(q.toLowerCase()) ||
      a.race.toLowerCase().includes(q.toLowerCase())
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

export const createAnimal = async (animal) => {
  const newAnimal = { ...animal, id: Date.now() };
  fakeAnimals.push(newAnimal);
  saveToStorage();
  return newAnimal;
};

export const updateAnimal = async (id, data) => {
  const idx = fakeAnimals.findIndex(a => a.id === id);
  if (idx === -1) throw new Error('Not found');
  fakeAnimals[idx] = { ...fakeAnimals[idx], ...data };
  saveToStorage();
  return fakeAnimals[idx];
};

export const deleteAnimal = async (id) => {
  fakeAnimals = fakeAnimals.filter(a => a.id !== id);
  saveToStorage();
  return id;
};

export const getAnimal = async (id) => {
  return fakeAnimals.find(a => a.id === id) || null;
};

export const listAnimalsByOwner = async (proprietaire_id) => {
  return fakeAnimals.filter(a => a.proprietaire_id === proprietaire_id);
};
