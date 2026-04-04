import axios from "axios";

const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  if (import.meta.env.PROD) {
    return "/api";
  }

  return "http://localhost:5001/api";
};

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
  withCredentials: true,
});

// Auth
export const register = async (data) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const login = async (data) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const logout = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

export const getMe = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

// Tasks
export const getAllTasks = async (page = 1, limit = 5, filter = "all") => {
  try {
    const params = new URLSearchParams({ page, limit });
    if (filter !== "all") {
      params.append("status", filter);
    }
    const response = await api.get(`/tasks?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Lỗi khi lấy danh sách công việc"
    );
  }
};

export const createTask = async (title) => {
  try {
    const response = await api.post("/tasks", { title });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Lỗi khi tạo công việc mới"
    );
  }
};

export const updateTask = async (id, data) => {
  try {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Lỗi khi cập nhật công việc"
    );
  }
};

export const deleteTask = async (id) => {
  try {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Lỗi khi xóa công việc");
  }
};

export const getTaskCounts = async () => {
  try {
    const response = await api.get("/tasks/counts");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Lỗi khi lấy thống kê công việc"
    );
  }
};

export default api;
