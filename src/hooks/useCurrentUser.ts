import { useSelector } from 'react-redux';
import { RootState } from 'src/store';

export const useCurrentUser = () => {
  const user = useSelector((state: RootState) => {
    return state.user.user;
  });
  if (user.id) {
    return user;
  }
  return undefined;
};
