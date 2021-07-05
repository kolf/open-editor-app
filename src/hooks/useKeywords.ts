import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from 'react-redux';
import { setShow, openFire } from 'src/features/search/search';

export const useKeywords = (visible) => {
  const dispatch = useDispatch();
  const { keywords, show, fire } = useSelector((state: any) => state.search);
  const [value, setValue] = useState('')

  useEffect(() => {
    dispatch(setShow(visible))
  }, [visible])

  useEffect(() => {
    if (fire) {
      setValue(keywords)
      dispatch(openFire(false))
    }
  }, [fire])


  return [value]
}
