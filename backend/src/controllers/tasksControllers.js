export const getAllTasks = (req, res) => {
  res.status(200).send("tuan dep trai23244423");
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
