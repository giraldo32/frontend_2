import { axiosConfig } from '../config/axiosConfig';

const getProductoras = async () => {
  const response = await axiosConfig.get('productoras');
  return response.data;
};

const createProductora = async (data) => {
  const response = await axiosConfig.post('productoras', data);
  return response.data;
};

const updateProductora = async (id, data) => {
  const response = await axiosConfig.put(`productoras/${id}`, data);
  return response.data;
};

const deleteProductora = async (id) => {
  const response = await axiosConfig.delete(`productoras/${id}`);
  return response.data;
};

const ProductoraService = {
  getProductoras,
  createProductora,
  updateProductora,
  deleteProductora,
};

export default ProductoraService;