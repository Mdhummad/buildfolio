// Buildfolio — API utility
import axios from "axios";

// Production: same domain (Vercel serverless at /api/*)
// Development: local Express backend on port 5000
const api = axios.create({
  baseURL: import.meta.env.DEV ? "http://localhost:5000" : "",
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
