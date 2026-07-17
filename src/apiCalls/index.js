import axios from "axios"
const DEVELOPMENT_API = "http://localhost:5000/api"; 
const PRODUCTION_API = (import.meta.env.VITE_API_URL || "") + "/api";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.DEV ? DEVELOPMENT_API : PRODUCTION_API,
  withCredentials: true,
});
