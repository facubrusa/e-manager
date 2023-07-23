import axios from 'axios';
import { toast } from 'react-toastify';

const axiosApi = () => {
  const client = axios.create({
    baseURL: 'http://localhost:4000/v1',
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
