import { createSlice } from '@reduxjs/toolkit';
import { SearchType } from 'src/declarations/enums/query';

interface searchState {
  searchType: SearchType;
  keywords: string;
  show: boolean;
  fire: boolean;
}

const initialState: searchState = {
  searchType: SearchType.原始ID,
  keywords: '',
  show: false,
  fire: false
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchType: (state, action) => {
      state.searchType = action.payload
    },
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
export const { setSearchType, setKeywords, setShow, openFire } = actions;
export default reducer;
