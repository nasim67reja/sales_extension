import axios from "axios";

// const TOKEN = "idToken";
// const REFRESH_TOKEN = "refreshToken";

export const TOKEN = "access-token";
export const REFRESH_TOKEN = "refresh-token";

export const PUBLIC_API = axios.create({
  baseURL: "https://coreblackpigeon.shadhin.ai/dev/",
  timeout: 300000,
  headers: {
    "Content-Type": "application/json",
  },
});
export const API = axios.create({
  baseURL: "https://coreblackpigeon.shadhin.ai/dev/",
  timeout: 300000,
  headers: {
    Authorization: `Bearer ${localStorage.getItem(TOKEN)}`,
    "Content-Type": "application/json",
    // "Access-Control-Allow-Origin": "*"
  },
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${localStorage.getItem(TOKEN)}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// axios interceptor for refreshing access/id token
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalConfig = error.config;
    if (
      (error?.response?.status === 401 || error?.response?.status === 403) &&
      !originalConfig?._retry
    ) {
      originalConfig._retry = true;
      try {
        const updateTokenRes = await PUBLIC_API.post(
          `/api/token/refresh/`,
          { refresh: localStorage.getItem(REFRESH_TOKEN) },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(REFRESH_TOKEN)}`,
            },
          }
        );
        const { access } = updateTokenRes.data;
        localStorage.setItem(TOKEN, access);
        error.response.config.headers.Authorization = `Bearer ${access}`;
        return API(error.response.config);
      } catch (_error) {
        console.log(_error);
        if (error.response.status === 401 || error.response.status === 400) {
          localStorage.clear();
          window.location.replace("/");
        }
        return Promise.reject(_error);
      }
    }
    return Promise.reject(error);
  }
);
