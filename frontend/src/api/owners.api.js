import axiosInstance from './axiosInstance';

export const listOwners = async (q = "", page = 1, perPage = 8) => {
  const response = await axiosInstance.get('/proprietaires', {
    params: { q, page, per_page: perPage }
  });
  return {
    data: response.data.data,
    total: response.data.total,
    lastPage: response.data.last_page,
  };
};

export const createOwner = async (owner) => {
  const response = await axiosInstance.post('/proprietaires', {
    nom: owner.nom,
    prenom: owner.prenom,
    telephone: owner.telephone,
    email: owner.email,
    adresse: owner.adresse,
  });
  return response.data;
};

export const updateOwner = async (id, data) => {
  const response = await axiosInstance.put(`/proprietaires/${id}`, data);
  return response.data;
};

export const deleteOwner = async (id) => {
  await axiosInstance.delete(`/proprietaires/${id}`);
  return id;
};

export const getOwner = async (id) => {
  const response = await axiosInstance.get(`/proprietaires/${id}`);
  return response.data;
};

export const getOwnerDetails = async (id) => {
  const response = await axiosInstance.get(`/proprietaires/${id}/details`);
  return response.data;
};
