import { useCallback, useRef } from 'react';

type Callback<T> = (e: T) => void;

export const useDoubleClick = <T>(onClick: Callback<T>, onDoubleClick: Callback<T>, timeout: number = 200) => {
  const clickTimeout = useRef(null);

  const clearClickTimeout = () => {
    if (clickTimeout) {
      clearTimeout(clickTimeout.current);
      clickTimeout.current = undefined;
    }
  };

  return useCallback(
    e => {
      e.stopPropagation();
      clearClickTimeout();
      if (onClick && e.detail === 1) {
        clickTimeout.current = setTimeout(() => {
          onClick(e);
        }, timeout);
      }
      if (e.detail % 2 === 0) {
        onDoubleClick(e);
      }
    },
    [onClick, onDoubleClick]
  );
};
