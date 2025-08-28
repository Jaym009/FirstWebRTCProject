// src/utils/axios.js
import axios from 'axios';

const BASE_URL = import.meta.env.MODE === "development" ? import.meta.env.VITE_API_BASE_URL : "/api"

// Create an instance of Axios
const apiClient = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true, 
});

// Optionally, you can add request and response interceptors
apiClient.interceptors.request.use(
  (config) => {
    // You can add authorization headers or other configurations here
    // config.headers['Authorization'] = `Bearer ${yourToken}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle errors globally here
    return Promise.reject(error);
  }
);

export default apiClient;