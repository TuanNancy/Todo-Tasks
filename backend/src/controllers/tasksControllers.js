import Task from "../../models/Task.js";

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    console.error("loi khi goi getALLTasks", error);
    res.status(500).json({ message: error.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const { title } = req.body;
    const newTask = await Task.create({ title });
    res.status(201).json(newTask);
  } catch (error) {
    console.error("Lỗi khi gọi createTask", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, status, completedAt } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { title, status, completedAt },
      { new: true }
    );
    if (!updatedTask) {
      throw new Error("Công việc không tồn tại");
    }
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Lỗi khi gọi updateTask", error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) {
      throw new Error("Công việc không tồn tại");
    }
    res.status(200).json({ message: "Công việc đã xóa thành công" });
  } catch (error) {
    console.error("Lỗi khi gọi deleteTask", error);
    res.status(500).json({ message: error.message });
  }
};
