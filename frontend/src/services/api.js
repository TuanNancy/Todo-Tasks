import axios from "axios";

// Sử dụng environment variable hoặc tự động detect API URL
// Trong production (deployed), API sẽ ở cùng domain với frontend
// Trong development, sử dụng localhost:5001
const getApiBaseUrl = () => {
  // Nếu có VITE_API_URL được set, dùng nó
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Nếu đang ở production (deployed), API ở cùng domain
  if (import.meta.env.PROD) {
    return "/api/tasks";
  }

  // Development: dùng localhost
  return "http://localhost:5001/api/tasks";
};

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout
});

// Get all tasks
export const getAllTasks = async () => {
  try {
    const response = await api.get("/");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Lỗi khi lấy danh sách công việc"
    );
  }
};

// Create a new task
export const createTask = async (title) => {
  try {
    const response = await api.post("/", { title });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Lỗi khi tạo công việc mới"
    );
  }
};

// Update a task
export const updateTask = async (id, data) => {
  try {
    const response = await api.put(`/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Lỗi khi cập nhật công việc"
    );
  }
};

// Delete a task
export const deleteTask = async (id) => {
  try {
    const response = await api.delete(`/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Lỗi khi xóa công việc");
  }
};

export default api;
