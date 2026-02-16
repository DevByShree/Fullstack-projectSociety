import axios from "axios";

const API = axios.create({
  baseURL: "https://fullstack-projectsociety-production.up.railway.app/api",
});

// har request ke sath token
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
