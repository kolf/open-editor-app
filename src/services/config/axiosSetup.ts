import axios, { AxiosRequestConfig, AxiosInstance } from 'axios';
import { PATH } from 'src/routes/path';
import { toastMessage, TypeToast } from 'src/components/common/ToastMessage';

const initialization = (config: AxiosRequestConfig): AxiosInstance => {
  const axiosInstance = axios.create(config);

  axiosInstance.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

  axiosInstance.interceptors.request.use(
    config => {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        config.headers.common['Authorization'] = `Bearer ${accessToken}`;
      }
      return config;
    },
    error => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    response => {
      return response;
    },
    error => {
      console.log(error.response, 'error')
      switch (error.response.status) {
        case 401:
          window.location.href = PATH.LOGIN;
          toastMessage('你没有权限', error.response.data.error, TypeToast.ERROR);
          localStorage.removeItem('accessToken');
          break;
        case 404:
          window.location.href = PATH.PAGE_404;
          break;
        case 500:
          toastMessage('请求错误', error.response.data.error, TypeToast.ERROR);
          break;
        default:
          toastMessage('请求错误', error.response.data.error, TypeToast.ERROR);
      }

      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export default initialization;
