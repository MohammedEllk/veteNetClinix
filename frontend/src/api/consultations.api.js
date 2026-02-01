import axiosInstance from './axiosInstance';

export const listConsultations = async (q = "", page = 1, perPage = 6, animal_id = null) => {
  const response = await axiosInstance.get('/consultations', {
    params: { q, animal_id }
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

export const createConsultation = async (consultation) => {
  const response = await axiosInstance.post('/consultations', consultation);
  return response.data;
};

export const updateConsultation = async (id, data) => {
  const response = await axiosInstance.put(`/consultations/${id}`, data);
  return response.data;
};

export const deleteConsultation = async (id) => {
  await axiosInstance.delete(`/consultations/${id}`);
  return id;
};

export const getConsultation = async (id) => {
  const response = await axiosInstance.get(`/consultations/${id}`);
  return response.data;
};

export const listConsultationsByAnimal = async (animal_id) => {
  const response = await axiosInstance.get(`/animaux/${animal_id}/consultations`);
  return response.data;
};
