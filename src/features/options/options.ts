import { createSlice } from '@reduxjs/toolkit';

interface OptionsState {
  data?: any;
  loading: boolean
}

const initialState: OptionsState = {
  data: null,
  loading: false,
  // error TODO 添加错误处理
};

export const optionsSlice = createSlice({
  name: 'options',
  initialState,
  reducers: {
    setOptions: (state, action) => {
      state.data = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  }
});

const { actions, reducer } = optionsSlice;
export const { setOptions, setLoading } = actions;
export default reducer;
