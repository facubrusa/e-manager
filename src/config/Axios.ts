import { toast } from 'react-toastify';

import axios from 'axios';

import config from './config';

const axiosApi = () => {
  const client = axios.create({
    baseURL: config.backendUrl,
  });

  client.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      console.error(error);
      if (error.response.status === 401) {
        delete client.defaults.headers.common['Authorization'];
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      const responseMessage = error?.response?.data?.message;
      const errorMessage = responseMessage ?? 'Something went wrong';
      toast.error(errorMessage);
      return Promise.reject(error);
    }
  );

  return client;
};

export const clientAxios = axiosApi();
