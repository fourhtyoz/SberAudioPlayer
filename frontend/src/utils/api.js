import axios from 'axios';

export const host = 'localhost'
export const api = axios.create({ baseURL: `http://${host}:8000` });

api.interceptors.request.use((config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    response => response,
    error => {
        console.log(error.response.status)
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        const token = localStorage.getItem('token')
        if (token) {
            window.location.href = '/';
            localStorage.removeItem('token'); 
        }
      }
      return Promise.reject(error);
    }
  );


export const register = async (username, password) => {
    return await api.post(`/register/`, { username, password });
};


export const getToken = () => {
    return localStorage.getItem('token');
};
