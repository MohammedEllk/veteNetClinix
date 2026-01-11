
const STORAGE_KEY = 'consultations';
let fakeConsultations = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [
  { id: 1, animal_id: 1, date_consultation: '2023-12-01', motif: 'Vaccin', diagnostic: 'RAS', traitement: '', recommandations: '', poids: '12', temperature: '38.5' },
  { id: 2, animal_id: 2, date_consultation: '2023-12-10', motif: 'Vermifuge', diagnostic: 'RAS', traitement: '', recommandations: '', poids: '4', temperature: '38.0' },
];

const saveToStorage = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(fakeConsultations));
};

export const listConsultations = async (q = "", page = 1, perPage = 6, animal_id = null) => {
  let filtered = fakeConsultations;
  if (animal_id) {
    filtered = filtered.filter(c => c.animal_id === animal_id);
  }
  if (q) {
    filtered = filtered.filter(c =>
      c.motif.toLowerCase().includes(q.toLowerCase()) ||
      c.diagnostic.toLowerCase().includes(q.toLowerCase())
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

export const createConsultation = async (consultation) => {
  const newConsultation = { ...consultation, id: Date.now() };
  fakeConsultations.push(newConsultation);
  saveToStorage();
  return newConsultation;
};

export const updateConsultation = async (id, data) => {
  const idx = fakeConsultations.findIndex(c => c.id === id);
  if (idx === -1) throw new Error('Not found');
  fakeConsultations[idx] = { ...fakeConsultations[idx], ...data };
  saveToStorage();
  return fakeConsultations[idx];
};

export const deleteConsultation = async (id) => {
  fakeConsultations = fakeConsultations.filter(c => c.id !== id);
  saveToStorage();
  return id;
};

export const getConsultation = async (id) => {
  return fakeConsultations.find(c => c.id === id) || null;
};

export const listConsultationsByAnimal = async (animal_id) => {
  return fakeConsultations.filter(c => c.animal_id === animal_id);
};
