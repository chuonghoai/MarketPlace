import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface Artisan {
  id: string;
  fullName: string;
  avatar?: string;
  birthDate?: string;
  createdAt: string;
  updatedAt: string;
  productCount?: number;
}

export const artisanService = {
  getAll: async (page: number = 1, limit: number = 20, search: string = '') => {
    const response = await axios.get(`${API_URL}/artisans`, {
      params: { page, limit, search }
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await axios.get(`${API_URL}/artisans/${id}`);
    return response.data;
  },

  create: async (data: Partial<Artisan>) => {
    const response = await axios.post(`${API_URL}/artisans`, data);
    return response.data;
  },

  update: async (id: string, data: Partial<Artisan>) => {
    const response = await axios.patch(`${API_URL}/artisans/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await axios.delete(`${API_URL}/artisans/${id}`);
    return response.data;
  },

  updateProducts: async (id: string, productIds: string[]) => {
    const response = await axios.patch(`${API_URL}/artisans/${id}/products`, { productIds });
    return response.data;
  }
};
