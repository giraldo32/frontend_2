import { axiosConfig } from '../config/axiosConfig';

const getMedia = async () => {
  const response = await axiosConfig.get('media');
  return response.data;
};

const createMedia = async (data) => {
  console.log('📤 MediaService - Datos que se van a enviar:');
  console.log('- Objeto completo:', data);
  console.log('- nombre:', data.nombre);
  console.log('- url:', data.url);
  console.log('- Keys disponibles:', Object.keys(data));
  console.log('- JSON final:', JSON.stringify(data, null, 2));
  
  // Verificar que los campos no estén vacíos
  if (!data.nombre) {
    throw new Error('El campo nombre está vacío');
  }
  if (!data.url) {
    throw new Error('El campo url está vacío');
  }
  
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