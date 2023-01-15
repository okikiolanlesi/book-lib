import axios from "axios";

const axiosLib = axios.create({
  baseURL: "https://book-lib-api-backend.onrender.com/api/v1", // for production
  // baseURL: "http://localhost:8000/api/v1", // for local development
  headers: {
    "Content-Type": "application/json",
  },
});

axiosLib.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;

    if (err.response) {
      // Access Token was expired
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;
        localStorage.clear();
        window.location.href = "/auth";
      }
    }

    return Promise.reject(err);
  }
);

export default axiosLib;
