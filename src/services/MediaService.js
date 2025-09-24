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

const MediaService = {
  getMedia,
  createMedia,
  updateMedia,
  deleteMedia,
};

export default MediaService;