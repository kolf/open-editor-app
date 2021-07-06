import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOptions, setLoading } from 'src/features/options/options';
import commonService from 'src/services/commonService';

export const useOptions = () => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state: any) => state.options);

  useEffect(() => {
    if (!loading && !data) {
      fetchData();
    }

    // TODO 添加错误处理
    async function fetchData() {
      dispatch(setLoading(true));
      try {
        const [providerOptions, categoryOptions, allReason] = await Promise.all([
          commonService.getOptions({ type: 'provider' }),
          commonService.getOptions({ type: 'category' }),
          commonService.getOptions({ type: 'allReason' })
        ]);
        dispatch(
          setOptions({
            providerOptions,
            categoryOptions,
            allReason
          })
        );
        dispatch(setLoading(false));
      } catch (error) {
        dispatch(setLoading(false));
      }
    }
  }, [loading, data]);

  return { ...data, loading };
};
