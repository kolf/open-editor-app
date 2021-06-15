const isDev = process.env.NODE_ENV === "development";

const config = {
  app: {
    NAME: 'VCG内容审核平台'
  },
  api: {

  },
  data: {
    DATE_FORMAT: "YYYY-MM-DD",
    SECOND_MINUTE: 'YYYY-MM-DD HH:mm',
    SECOND_FORMAT: 'YYYY-MM-DD HH:mm:ss',
  },
};

export default config;

