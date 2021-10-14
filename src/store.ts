import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import loadingSlice from './features/loading/loading';
import authenticateSlice from './features/auth/authenticate';
import collapsedSlice from './features/collapsedMenu/collapsedMenu';
import searchSlice from './features/search/search';
import languageSlice from './features/language/language';
export const store = configureStore({
  reducer: {
    collapsed: collapsedSlice,
    user: authenticateSlice,
    loading: loadingSlice,
    search: searchSlice,
    language: languageSlice
  },
  middleware: getDefaultMiddleware({
    serializableCheck: false
  })
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
