const Task = require("../models/Task");

exports.getTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10; 
    const skip = (page - 1) * limit;
    const tasks = await Task.find({ user: userId })
      .sort({ completed: 1, createdAt: -1 }) 
      .skip(skip)
      .limit(limit);
    const totalTasks = await Task.countDocuments({ user: userId });

    res.json({
      tasks,
      totalPages: Math.ceil(totalTasks / limit),
      currentPage: page,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.createTask = async (req, res) => {
  try {
    const { title, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Thiếu tiêu đề task" });
    }

    const newTask = await Task.create({
      title,
      dueDate,
      user: req.user.id, 
    });

    res.status(201).json(newTask);
  } catch (error) {
    console.error("Lỗi tạo task:", error);
    res.status(500).json({ message: "Lỗi server khi tạo task" });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed, dueDate } = req.body;

    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, user: req.user.id }, 
      { title, completed, dueDate },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task không tồn tại hoặc không thuộc user" });
    }

    res.json(updatedTask);
  } catch (error) {
    console.error("Lỗi cập nhật task:", error);
    res.status(500).json({ message: "Lỗi server khi cập nhật task" });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTask = await Task.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });

    if (!deletedTask) {
      return res.status(404).json({ message: "Task không tồn tại hoặc không thuộc user" });
    }

    res.json({ message: "Xóa task thành công!" });
  } catch (error) {
    console.error("Lỗi xóa task:", error);
    res.status(500).json({ message: "Lỗi server khi xóa task" });
  }
};
