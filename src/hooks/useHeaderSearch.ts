import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setShow, openFire } from 'src/features/search/search';

export const useHeaderSearch = run => {
  const dispatch = useDispatch();
  const { keywords, fire } = useSelector((state: any) => state.search);

  useEffect(() => {
    dispatch(setShow(true));
  }, []);

  useEffect(() => {
    if (fire) {
      run();
      dispatch(openFire(false));
    }
  }, [fire]);

  return [keywords];
};
