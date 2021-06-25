import { createSlice } from '@reduxjs/toolkit';

interface searchState {
  keywords: string;
  show: boolean;
  fire: boolean
}

const initialState: searchState = {
  keywords: '',
  show: false,
  fire: false
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setKeywords: (state, action) => {
      state.keywords = action.payload;
    },
    setShow: (state, action) => {
      state.show = action.payload;
    },
    openFire: (state, action) => {
      state.fire = action.payload;
    }
  }
});

const { actions, reducer } = searchSlice;
export const { setKeywords, setShow, openFire } = actions;
export default reducer;
