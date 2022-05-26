import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setShow, openFire } from 'src/features/search/search';

export const useHeaderSearch = run => {
  const dispatch = useDispatch();
  const { searchType, keywords, fire, show } = useSelector((state: any) => state.search);

  useEffect(() => {
    if (!show) {
      dispatch(setShow(true));
    }
  }, [show]);

  useEffect(() => {
    if (fire) {
      run();
      dispatch(openFire(false));
    }
  }, [fire]);

  return [searchType, keywords];
};
