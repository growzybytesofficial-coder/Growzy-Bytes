// frontend/src/api/client.js
import axios from "axios";

// Base URL: Agar .env me VITE_API_URL hai toh wo lega, warna default relative /api use karega
const API = import.meta.env.VITE_API_URL || "/api";

// Axios client
const client = axios.create({
  baseURL: API,
});

// Token interceptor (Bearer token attach karne ke liye)
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || localStorage.getItem("tv_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Custom fetch wrapper (Agar aap apne code me fetch use kar rahe hain)
export async function api(path, { method = "GET", body, token } = {}) {
  const authToken = token || localStorage.getItem("token") || localStorage.getItem("tv_token");

  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Request failed");
  return data;
}

export default client;