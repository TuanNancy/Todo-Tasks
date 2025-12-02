import Task from "../../models/Task.js";

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    console.error("loi khi goi getALLTasks", error);
    res.status(500).json({ message: error.message });
  }
};

export const createTask = (req, res) => {
  res.status(201).json({ message: "them thanh cong" });
};

export const updateTask = (req, res) => {
  res.status(201).json({ message: "cap nhat thanh cong" });
};

export const deleteTask = (req, res) => {
  res.status(201).json({ message: "Công việc đã xóa thành công" });
};
