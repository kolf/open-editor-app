const isDev = process.env.NODE_ENV === 'development';

const config = {
  app: {
    NAME: 'VCG内容审核平台'
  },
  api: {},
  data: {
    DEFAULT_TIME: '0000-00-00 00:00:00',
    DATE_FORMAT: 'YYYY-MM-DD',
    SECOND_MINUTE: 'YYYY-MM-DD HH:mm',
    SECOND_FORMAT: 'YYYY-MM-DD HH:mm:ss'
  }
};

export default config;
