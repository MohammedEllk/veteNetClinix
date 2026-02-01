import axiosInstance from './axiosInstance';

export const listAnimals = async (q = "", page = 1, perPage = 6, proprietaire_id = null) => {
  const response = await axiosInstance.get('/animaux', {
    params: { q, proprietaire_id }
  });
  const data = response.data;
  const total = data.length;
  const lastPage = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  const end = start + perPage;
  return {
    data: data.slice(start, end),
    total,
    lastPage,
  };
};

export const createAnimal = async (animal) => {
  const response = await axiosInstance.post('/animaux', animal);
  return response.data;
};

export const updateAnimal = async (id, data) => {
  const response = await axiosInstance.put(`/animaux/${id}`, data);
  return response.data;
};

export const deleteAnimal = async (id) => {
  await axiosInstance.delete(`/animaux/${id}`);
  return id;
};

export const getAnimal = async (id) => {
  const response = await axiosInstance.get(`/animaux/${id}`);
  return response.data;
};

export const listAnimalsByOwner = async (proprietaire_id) => {
  const response = await axiosInstance.get(`/proprietaires/${proprietaire_id}/animaux`);
  return response.data;
};
