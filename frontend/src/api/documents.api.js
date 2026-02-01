import axiosInstance from './axiosInstance';

export const listDocuments = async (consultation_id = null, q = "", page = 1, perPage = 8) => {
  if (!consultation_id) {
    return { data: [], total: 0, lastPage: 1 };
  }
  const response = await axiosInstance.get(`/consultations/${consultation_id}/documents`);
  let data = response.data;
  
  if (q) {
    data = data.filter(d => d.nom_original.toLowerCase().includes(q.toLowerCase()));
  }
  
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

export const uploadDocument = async (consultation_id, { file, type_document, description }) => {
  const formData = new FormData();
  formData.append('file', file);
  if (type_document) formData.append('type_document', type_document);
  if (description) formData.append('description', description);
  
  const response = await axiosInstance.post(
    `/consultations/${consultation_id}/documents`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

export const deleteDocument = async (id) => {
  await axiosInstance.delete(`/documents/${id}`);
  return id;
};

export const getDocument = async (id) => {
  const response = await axiosInstance.get(`/documents/${id}`);
  return response.data;
};

export const downloadDocument = async (id) => {
  const response = await axiosInstance.get(`/documents/${id}/download`, {
    responseType: 'blob',
  });
  return response.data;
};
