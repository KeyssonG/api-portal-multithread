import axios from 'axios';

const authApi = axios.create({
  baseURL: 'http://localhost:8089', 
});

export const authService = {
  async login<T = any>(username: string, password: string): Promise<{ data: T }> {
    const response = await authApi.post<T>('/login', { username, password });
    return response;
  },

  async changePassword(token: string, newPassword: string) {
    const response = await authApi.put('/alterar/senha', { newPassword }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};