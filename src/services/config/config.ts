import { AxiosRequestConfig } from 'axios';

export const axiosRequestConfiguration: AxiosRequestConfig = {
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json'
  }
};
