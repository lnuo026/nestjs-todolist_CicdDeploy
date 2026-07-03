import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';

interface UnwrappedAxiosInstance extends AxiosInstance {
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
}

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
}) as UnwrappedAxiosInstance;

request.interceptors.response.use(
  (response) => response.data.data,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default request;
