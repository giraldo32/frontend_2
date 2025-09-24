import { axiosConfig } from "../config/axiosConfig";

const obtenerGeneros = () => {
    return axiosConfig.get('generos', {
        headers: {
            'Content-Type': 'application/json',
            'Accept' : 'application/json'
        }
    })
}

const creaGenero = (data = {}) => {
    return axiosConfig.post('generos', data, {
        headers: {
            'Content-Type': 'application/json',
            'Accept' : 'application/json'
        }
    })
}

const obtenerGeneroPorId = async (id) => {
  const response = await axiosConfig.get(`generos/${id}`);
  return response.data;
};

const editarGenero = async (id, data) => {
  const response = await axiosConfig.put(`generos/${id}`, data);
  return response.data;
};

const eliminarGenero = async (id) => {
  const response = await axiosConfig.delete(`generos/${id}`);
  return response.data;
};

export {
    obtenerGeneros,
    creaGenero,
    obtenerGeneroPorId,
    editarGenero,
    eliminarGenero  
}


