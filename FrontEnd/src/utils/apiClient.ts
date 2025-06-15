
import axios from 'axios';
import { tokenManager } from './tokenManager';
import baseURL from '../constants/constant';

export const axiosClient = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  }
});

axiosClient.interceptors.request.use((config) => {
  const token = tokenManager.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const apiClient = {
  // Generic API call with JWT header
  async call(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const url = `${baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...tokenManager.getAuthHeader(),
      ...options.headers
    };

    return fetch(url, {
      ...options,
      headers
    });
  },

  // GET request with auth
  async get(endpoint: string): Promise<Response> {
    return this.call(endpoint, { method: 'GET' });
  },

  // POST request with auth
  async post(endpoint: string, data?: any): Promise<Response> {
    return this.call(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    });
  },

  // PUT request with auth
  async put(endpoint: string, data?: any): Promise<Response> {
    return this.call(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    });
  },

  // DELETE request with auth
  async delete(endpoint: string): Promise<Response> {
    return this.call(endpoint, { method: 'DELETE' });
  }
};
