import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // Make sure this matches your API port
  withCredentials: true,             // Crucial for cookies/sessions
});

export const loginUser = (data: any) => api.post("/login", data);
export const registerUser = (data: any) => api.post("/register", data);

export default api;