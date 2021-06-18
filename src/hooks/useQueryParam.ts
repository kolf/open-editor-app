import { useLocation } from 'react-router-dom';
import queryString from 'querystring'

export const useQuery = () => {
  const { search } = useLocation()
  if (!search) {
    return {}
  }
  return queryString.parse(search.substr(1))
};
