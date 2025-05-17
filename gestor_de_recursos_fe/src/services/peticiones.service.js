// src/services/peticiones.service.js
import api from "./axiosConfig";

// Obtener todas las peticiones
export const getPeticiones = async () => {
  try {
    const response = await api.get("peticiones/api/v1/");
    return response.data;
  } catch (error) {
    console.error("Error al obtener las peticiones:", error);
    return [];
  }
};

// Crear nueva petición
export const createPeticion = async (data) => {
  try {
    const response = await api.post("peticiones/api/v1/", data);
    return response.data;
  } catch (error) {
    console.error("Error al crear petición:", error.response?.data || error.message);
    throw error;
  }
};

// Eliminar petición
export const deletePeticion = async (id) => {
  try {
    const response = await api.delete(`peticiones/api/v1/${id}/`);
    return response;
  } catch (error) {
    console.error("Error al eliminar petición:", error);
    return null;
  }
};

// Actualizar petición
export const updatePeticion = async (id, data) => {
  try {
    const response = await api.patch(`peticiones/api/v1/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar petición:", error);
    return null;
  }
};
