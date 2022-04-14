import axios, { AxiosRequestConfig, AxiosInstance } from 'axios';
import { toastMessage, TypeToast } from 'src/components/common/ToastMessage';

const initialization = (config: AxiosRequestConfig): AxiosInstance => {
  const axiosInstance = axios.create(config);

  axiosInstance.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

  axiosInstance.interceptors.request.use(
    config => {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        config.headers.common['token'] = `${accessToken}`;
        // config.headers.common['authorization'] = `${accessToken}`;
      }
      return config;
    },
    error => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    response => {
      const { errCode, errMessage } = response.data;
      switch (errCode) {
        case 401:
          window.location.href = '/login'
          toastMessage('你没有权限！', errMessage, TypeToast.ERROR);
          localStorage.removeItem('accessToken');
          break;
        case 400:
          return Promise.reject(response.data);
        default:
      }
      return response;
    },
    error => {
      debugger;
      switch (error.response.status) {
        case 401:
          window.location.href = '/login'
          toastMessage('你没有权限', error.response.data.error, TypeToast.ERROR);
          localStorage.removeItem('accessToken');
          break;
        // case 404:
        // window.location.href = PATH.PAGE_404;
        //   break;
        // case 500:
        // toastMessage('请求错误', error.response.data.error, TypeToast.ERROR);
        // break;
        // default:
        // toastMessage('请求错误', error.response.data.error, TypeToast.ERROR);
      }

      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export default initialization;
