import Task from "../../models/Task.js";
import mongoose from "mongoose";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const getAllTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const { status } = req.query;

    const filter = { userId: req.user._id };
    if (status && ["active", "completed"].includes(status)) {
      filter.status = status;
    }

    const tasks = await Task.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Task.countDocuments(filter);

    res.status(200).json({
      tasks,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalTasks: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error when calling getAllTasks", error);
    res.status(500).json({ message: error.message });
  }
};

export const getTaskCounts = async (req, res) => {
  try {
    const activeCount = await Task.countDocuments({ userId: req.user._id, status: "active" });
    const completedCount = await Task.countDocuments({ userId: req.user._id, status: "completed" });
    const totalCount = await Task.countDocuments({ userId: req.user._id });

    res.status(200).json({
      total: totalCount,
      active: activeCount,
      completed: completedCount,
    });
  } catch (error) {
    console.error("Error when calling getTaskCounts", error);
    res.status(500).json({ message: error.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Tiêu đề không được để trống" });
    }
    const newTask = await Task.create({ title: title.trim(), userId: req.user._id });
    res.status(201).json(newTask);
  } catch (error) {
    console.error("Error when calling createTask", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }
    const { title, status, completedAt } = req.body;
    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { title, status, completedAt },
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ message: "Công việc không tồn tại" });
    }
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Error when calling updateTask", error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }
    const deletedTask = await Task.findOneAndDelete({ _id: id, userId: req.user._id });
    if (!deletedTask) {
      return res.status(404).json({ message: "Công việc không tồn tại" });
    }
    res.status(200).json({ message: "Công việc đã xóa thành công" });
  } catch (error) {
    console.error("Error when calling deleteTask", error);
    res.status(500).json({ message: error.message });
  }
};
