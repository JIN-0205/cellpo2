import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

// リクエストごとにトークンをヘッダーに追加
API.interceptors.request.use((req: any) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// サインアップ
export const signup = (formData: { username: string; password: string }) =>
  API.post("/users/signup", formData);

// ログイン
export const login = (formData: { username: string; password: string }) =>
  API.post("/users/login", formData);

// ログアウト
export const logout = () => API.post("/users/logout");
