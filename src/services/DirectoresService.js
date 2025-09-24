import { axiosConfig } from '../config/axiosConfig';

const getDirectors = async () => {
  const response = await axiosConfig.get('directores');
  return response.data;
};

const createDirector = async (data) => {
  const response = await axiosConfig.post('directores', data);
  return response.data;
};

const updateDirector = async (id, data) => {
  const response = await axiosConfig.put(`directores/${id}`, data);
  return response.data;
};

const deleteDirector = async (id) => {
  const response = await axiosConfig.delete(`directores/${id}`);
  return response.data;
};

const DirectoresService = {
  getDirectors,
  createDirector,
  updateDirector,
  deleteDirector,
};

export default DirectoresService;