import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000', 
  withCredentials: true, 
});

// Add an Interceptor to attach the token from LocalStorage automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

// --- AUTH FUNCTIONS ---
export const loginUser = (data: any) => api.post('/login', data);
export const registerUser = (data: any) => api.post('/register', data);
export const logoutUser = () => api.post('/logout');

// --- USER & PROFILE FUNCTIONS ---
export const getProfile = (username: string) => api.get(`/users/${username}`);
// Match backend: app.put("/users/profile", ...)
export const updateProfile = (data: any) => api.put("/users/profile", data);
// Match backend: app.patch("/users/password", ...)
export const updatePassword = (data: any) => api.patch("/users/password", data);

// --- CONTENT FUNCTIONS ---
export const fetchFeed = () => api.get('/sources');
export const uploadMedia = (formData: FormData) => api.post('/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const savePoster = (data: any) => api.post('/sources/design', data);

// --- SOURCE MANAGEMENT ---
export const updateSource = (id: string, data: any) => api.put(`/sources/${id}`, data);
export const trashSource = (id: string) => api.patch(`/sources/trash/${id}`);
export const deleteSourcePermanent = (id: string) => api.delete(`/sources/permanent/${id}`);

// --- SOCIAL FUNCTIONS ---
export const toggleLike = (sourceId: string) => api.post('/social/like', { sourceId });
export const toggleFollow = (followingId: string) => api.post('/social/follow', { followingId });
export const logActivity = (data: any) => api.post('/activity/log', data);
export const repostSource = (sourceId: string) => api.post(`/sources/${sourceId}/repost`);