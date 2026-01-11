
const STORAGE_KEY = 'documents';
let fakeDocuments = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [
  { id: 1, consultation_id: 1, title: 'Checkup Report.pdf', type: 'pdf', data: 'fake-base64-data' },
];

const saveToStorage = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(fakeDocuments));
};

export const listDocuments = async (consultation_id = null, q = "", page = 1, perPage = 8) => {
  let filtered = fakeDocuments;
  if (consultation_id) {
    filtered = filtered.filter(d => d.consultation_id === consultation_id);
  }
  if (q) {
    filtered = filtered.filter(d =>
      d.title.toLowerCase().includes(q.toLowerCase())
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

export const uploadDocument = async (consultation_id, { title, file }) => {
  const newDocument = {
    id: Date.now(),
    consultation_id,
    title: title || file.name,
    type: file.type.split('/')[1] || 'pdf',
    data: 'fake-base64-data', // simule
    size: file.size || 0,
  };
  fakeDocuments.push(newDocument);
  saveToStorage();
  return newDocument;
};

export const deleteDocument = async (id) => {
  fakeDocuments = fakeDocuments.filter(d => d.id !== id);
  saveToStorage();
  return id;
};

export const getDocument = async (id) => {
  return fakeDocuments.find(d => d.id === id) || null;
};
