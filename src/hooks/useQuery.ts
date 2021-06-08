import React, { useReducer, useEffect, useCallback, useMemo } from 'react';

const initialState = { loading: false, data: null, error: null };

const START = 'START';
const SUCCESS = 'SUCCESS';
const ERROR = 'ERROR';
const RESET = 'RESET';

const queryReducer = (state, action) => {
  switch (action.type) {
    case START:
      return {
        ...state,
        error: null,
        loading: true
      };
    case SUCCESS:
      return {
        ...state,
        data: action.data,
        loading: false,
        error: null
      };
    case ERROR:
      return {
        ...state,
        error: action.error,
        loading: false,
        data: action.data ? action.data : null
      };
    case RESET:
      return initialState;
    default:
      throw new Error(`Received invalid action type ${action.type}`);
  }
};

const update = async ({ fetchData, params, dispatch }) => {
  dispatch({ type: START });
  try {
    const res = await fetchData(params);
    dispatch({ type: SUCCESS, data: res.data.data, });
  } catch (error) {
    dispatch({ type: ERROR, error: error.message, data: null });
  }
};

export const useQuery = (fetchData, params) => {
  const [queryState, dispatch] = useReducer(queryReducer, initialState);

  useEffect(() => {
    if (!params) {
      dispatch({ type: RESET });
      return;
    }
    update({ fetchData, params, dispatch });
  }, [JSON.stringify(params)]);

  return queryState;
};
