import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setShow, openFire } from 'src/features/search/search';

export const useSearchValue = () => {
  const dispatch = useDispatch();
  const { keywords, fire } = useSelector((state: any) => state.search);
  const [value, setValue] = useState('');

  useEffect(() => {
    dispatch(setShow(true));
  }, []);

  useEffect(() => {
    if (fire) {
      setValue(keywords);
      dispatch(openFire(false));
    }
  }, [fire]);

  return [value];
};
