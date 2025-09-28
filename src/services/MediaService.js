import { axiosConfig } from '../config/axiosConfig';

const getMedia = async () => {
  const response = await axiosConfig.get('media');
  return response.data;
};

const createMedia = async (data) => {
  console.log('Datos enviados al backend:', data); // Log the data being sent
  const response = await axiosConfig.post('media', data);
  return response.data;
};

const updateMedia = async (id, data) => {
  const response = await axiosConfig.put(`media/${id}`, data);
  return response.data;
};

const deleteMedia = async (id) => {
  const response = await axiosConfig.delete(`media/${id}`);
  return response.data;
};

const getMediaByTipo = async (tipoId) => {
  try {
    const response = await axiosConfig.get('media', {
      params: { tipo: tipoId }
    });
    return response.data;
  } catch (error) {
    console.error(`Error al obtener media por tipo ID ${tipoId}:`, error);
    throw error;
  }
};

const MediaService = {
  getMedia,
  createMedia,
  updateMedia,
  deleteMedia,
  getMediaByTipo
};

export default MediaService;