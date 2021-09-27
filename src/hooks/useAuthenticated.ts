import { getLocalStorageItem } from './../utils/localStorage';
import { useCurrentUser } from './useCurrentUser';

export const useAuthenticated = (): boolean => {
  const currentUser = useCurrentUser();
  return !!currentUser;
};

export const useAuthenticatedByLocalStorage = (): boolean => {
  const token = getLocalStorageItem('accessToken');
  return !!token;
};
