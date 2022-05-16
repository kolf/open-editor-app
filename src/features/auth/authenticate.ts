import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import authService from 'src/services/authService';
import { getFirstChild } from 'src/utils/tools';
interface AuthenticateState {
  token?: string;
  loading: boolean;
  user?: any;
  menus?: any[];
  permissons?: string[];
  error?: any;
}

const initialState: AuthenticateState = {
  token: localStorage.getItem('accessToken') || '',
  loading: false,
  user: undefined,
  menus: JSON.parse(localStorage.getItem('menus') || '[]'),
  permissons: JSON.parse(localStorage.getItem('permissons') || '[]'),
  error: null
};

export const login = createAsyncThunk('users/login', async (params: any) => {
  const login = await authService.login(params);
  return login;
});

export const getMe = createAsyncThunk('users/getMe', async () => {
  const me = await authService.me();
  return me;
});

export const authenticateSlice = createSlice({
  name: 'authenticate',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    removeToken: state => {
      state.token = '';
    },
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
    logout: state => {
      state.token = '';
      state.user = undefined;
      state.menus = undefined;
      state.user = undefined;
      localStorage.removeItem('user');
      localStorage.removeItem('menus');
      localStorage.removeItem('user');
      localStorage.removeItem('permissons');
      localStorage.removeItem('accessToken');
    },
    setLoading: state => {
      state.loading = true;
    }
  },
  extraReducers: builder => {
    builder.addCase(login.pending, (state, action) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      localStorage.removeItem('accessToken');
    });

    builder.addCase(login.fulfilled, (state, action) => {
      const { token, user, menus, permissons } = action.payload;
      Object.assign(state, {
        token,
        user,
        menus,
        permissons,
        loading: false
      });

      // const firstMenuItem = getFirstChild(menus);
      localStorage.setItem('accessToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('menus', JSON.stringify(menus));
      localStorage.setItem('permissons', JSON.stringify(permissons));
    });

    builder.addCase(getMe.pending, state => {
      state.loading = true;
    });

    builder.addCase(getMe.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error;

      localStorage.removeItem('user');
      localStorage.removeItem('menus');
      localStorage.removeItem('permissons');
      localStorage.removeItem('accessToken');
    });

    builder.addCase(getMe.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.data;
    });
  }
});

const { actions, reducer } = authenticateSlice;
export const { setToken, removeToken, setUser, logout, setLoading } = actions;
export default reducer;
