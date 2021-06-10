import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import authService from 'src/services/authService';
interface AuthenticateState {
  token: string;
  user: any;
  loading: boolean;
  error: any;
}

const initialState: AuthenticateState = {
  token: localStorage.getItem('accessToken') || '',
  loading: false,
  user: undefined,
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
    logOut: state => {
      state.token = '';
      state.user = undefined;
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
    },
    setLoading: state => {
      state.loading = true;
    }
  },
  extraReducers: builder => {
    builder.addCase(login.pending, state => {
      state.loading = true;
    });

    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error;
      state.user = undefined;
      localStorage.removeItem('accessToken');
    });

    builder.addCase(login.fulfilled, (state, action) => {
      console.log(action.payload, 'action.payload');
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('accessToken', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    });

    builder.addCase(getMe.pending, state => {
      state.loading = true;
    });

    builder.addCase(getMe.rejected, (state, action) => {
      state.error = action.error;
      state.user = undefined;
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      state.loading = false;
    });

    builder.addCase(getMe.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.data;
    });
  }
});

const { actions, reducer } = authenticateSlice;
export const { setToken, removeToken, setUser, logOut, setLoading } = actions;
export default reducer;
