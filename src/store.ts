import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import loadingSlice from './features/loading/loading';
import authenticateSlice from './features/auth/authenticate';
import collapsedSlice from './features/collapsedMenu/collapsedMenu';
import optionsSlice from './features/options/options';
import searchSlice from './features/search/search';
export const store = configureStore({
  reducer: {
    collapsed: collapsedSlice,
    user: authenticateSlice,
    loading: loadingSlice,
    search: searchSlice,
    options: optionsSlice
  },
  middleware: getDefaultMiddleware({
    serializableCheck: false
  })
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
