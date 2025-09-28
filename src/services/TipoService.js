import { axiosConfig } from '../config/axiosConfig';
import Swal from 'sweetalert2';

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
  try {
    const response = await axiosConfig.delete(`tipos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar tipo con ID ${id}:`, error);
    // Reenviar el error para manejarlo en el componente
    throw error;
  }
};

// Verificar si un tipo está siendo usado por registros de media
const checkTipoUsage = async (id) => {
  try {
    // Usar directamente axiosConfig para evitar dependencia circular
    const response = await axiosConfig.get(`media?tipo=${id}`);
    return { data: response.data };
  } catch (error) {
    console.error(`Error al verificar uso del tipo con ID ${id}:`, error);
    throw error;
  }
};

// Eliminar un tipo forzosamente, primero eliminando la asociación con medias
const deleteTipoForzado = async (id) => {
  try {
    // 1. Obtenemos todas las medias asociadas a este tipo
    const { data: mediasRelacionadas } = await checkTipoUsage(id);
    
    // Mostrar indicador de progreso
    Swal.fire({
      title: 'Eliminando asociaciones',
      html: 'Preparando medias para eliminar el tipo...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    
    // 2. Para cada media, actualizamos el tipo a null o eliminamos la asociación
    if (mediasRelacionadas && mediasRelacionadas.length > 0) {
      // Creamos un servicio temporal para actualizar medias
      const MediaUpdateService = {
        updateMedia: async (id, data) => {
          const response = await axiosConfig.put(`media/${id}`, data);
          return response.data;
        }
      };
      
      const totalMedias = mediasRelacionadas.length;
      let procesadas = 0;
      
      // Asignar cada media a un valor que no cause conflicto en el backend
      for (const media of mediasRelacionadas) {
        if (media._id) {
          try {
            // Intentamos establecer el tipo a null o eliminarlo del objeto
            await MediaUpdateService.updateMedia(media._id, { tipo: null });
          } catch (mediaError) {
            console.error(`No se pudo actualizar la media ${media._id}`, mediaError);
            // Continuar con las demás aunque una falle
          }
          
          procesadas++;
          if (procesadas % 5 === 0 || procesadas === totalMedias) {
            Swal.update({
              html: `Preparando medias para eliminar el tipo...<br>${procesadas} de ${totalMedias} (${Math.round(procesadas/totalMedias*100)}%)`
            });
          }
        }
      }
    }
    
    // 3. Ahora que no hay asociaciones, intentamos eliminar el tipo
    const response = await axiosConfig.delete(`tipos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar tipo forzosamente con ID ${id}:`, error);
    throw error;
  }
};

// Reasignar medias a otro tipo y luego eliminar el tipo original
const reasignarYEliminarTipo = async (tipoId, nuevoTipoId, medias) => {
  try {
    // Importamos MediaService en tiempo de ejecución para evitar dependencias circulares
    // Usamos una importación dinámica para evitar problemas de referencias circulares
    const MediaService = {
      updateMedia: async (id, data) => {
        const response = await axiosConfig.put(`media/${id}`, data);
        return response.data;
      }
    };
    
    // Mostrar indicador de progreso
    Swal.fire({
      title: 'Actualizando medias',
      html: 'Reasignando medias al nuevo tipo...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    
    // Procesar las medias en lotes para evitar sobrecargar el servidor
    const totalMedias = medias.length;
    let procesadas = 0;
    
    for (const media of medias) {
      if (media._id) {
        await MediaService.updateMedia(media._id, { tipo: nuevoTipoId });
        procesadas++;
        
        // Actualizar porcentaje cada 5 medias
        if (procesadas % 5 === 0 || procesadas === totalMedias) {
          Swal.update({
            html: `Reasignando medias al nuevo tipo...<br>${procesadas} de ${totalMedias} (${Math.round(procesadas/totalMedias*100)}%)`
          });
        }
      }
    }
    
    // Una vez reasignadas todas las medias, eliminar el tipo original
    await deleteTipo(tipoId);
    
    return { success: true };
  } catch (error) {
    console.error(`Error al reasignar y eliminar tipo con ID ${tipoId}:`, error);
    throw error;
  }
};

const TipoService = {
  getTipos,
  createTipo,
  updateTipo,
  deleteTipo,
  deleteTipoForzado,
  reasignarYEliminarTipo,
  checkTipoUsage
};

export default TipoService;