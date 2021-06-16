import { useSelector } from 'react-redux';
import { RootState } from 'src/store';

export const useCurrentUser = () => {
  const user = useSelector((state: RootState) => state.user.user);
  if (user.ucId) {
    return user
  }
  return undefined;
};
