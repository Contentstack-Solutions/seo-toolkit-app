import { AxiosRequestConfig } from "axios";
// import config from "../../containers/SentimentAnalysisWidget/config.json";
export const getGCOptions = (options: AxiosRequestConfig) => {
  return {
    ...options,
    headers: {
      ...options.headers,
      "Content-Type": "application/json",
    },
  };
};

export const getCSOptions = (options: AxiosRequestConfig) => {
  return {
    ...options,
    headers: {
      ...options.headers,
      "Content-Type": "application/json",
      // authorization: config.CS_CM_TOKEN,
      // api_key: config.CS_API_KEY,
      authorization: process.env.REACT_APP_CS_CM_TOKEN,
      api_key: process.env.REACT_APP_CS_API_KEY,
    },
  };
};
