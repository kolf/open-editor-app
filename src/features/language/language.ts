import { createSlice } from '@reduxjs/toolkit';

interface LanguageState {
  language: 'en-US' | 'zh-CN';
}

const initialState: LanguageState = {
  language: (localStorage.getItem('language') || navigator.language) as LanguageState['language']
};

export const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: state => {
      if (state.language.includes('zh')) {
        state.language = 'en-US';
      } else {
        state.language = 'zh-CN';
      }
      localStorage.setItem('language', state.language);
    }
  }
});

const { actions, reducer } = languageSlice;
export const { setLanguage } = actions;
export default reducer;
