import { axiosConfig } from '../config/axiosConfig';

const getTipos = async () => {
  const response = await axiosConfig.get('tipos');
  return response.data;
};

const createTipo = async (data) => {
  const response = await axiosConfig.post('tipos', data);
  return response.data;
};

const updateTipo = async (id, data) => {
  const response = await axiosConfig.put(`tipos/${id}`, data);
  return response.data;
};

const deleteTipo = async (id) => {
  const response = await axiosConfig.delete(`tipos/${id}`);
  return response.data;
};

const TipoService = {
  getTipos,
  createTipo,
  updateTipo,
  deleteTipo,
};

export default TipoService;