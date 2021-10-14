import { useSelector } from 'react-redux';
import enUS from 'src/locales/enUS';
import zhCN from 'src/locales/zhCN';
import { RootState } from 'src/store';

export const useLanguage = () => {
  const { language } = useSelector((state: RootState) => state.language);
  return language.includes('zh');
};

export const useLanguagePkg = () => {
  const { language } = useSelector((state: RootState) => state.language);
  let languagePkg: any = enUS;
  if (language.includes('zh')) languagePkg = zhCN;

  console.log(language, 'language');

  return {
    language,
    languagePkg
  };
};
