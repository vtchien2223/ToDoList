const Group = require("../models/Group");
const GroupTask = require("../models/GroupTask");

// 🧠 Tạo task trong nhóm (chỉ chủ hoặc key member)
exports.createGroupTask = async (req, res) => {
  try {
    const { id } = req.params; // id nhóm
    const { title, dueDate, assignedTo } = req.body;
    const userId = req.user.id;

    const group = await Group.findById(id);
    if (!group) return res.status(404).json({ message: "Group not found" });

    // Kiểm tra quyền
    const member = group.members.find((m) => m.user.equals(userId));
    if (!member || member.role !== "key")
      return res.status(403).json({ message: "Only key members can add tasks" });

    const task = new GroupTask({
      group: id,
      title,
      dueDate,
      assignedTo,
    });
    await task.save();

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📜 Lấy danh sách task của nhóm
exports.getGroupTasks = async (req, res) => {
  try {
    const { id } = req.params; // id nhóm
    const userId = req.user.id;

    const group = await Group.findById(id);
    if (!group) return res.status(404).json({ message: "Group not found" });

    const isMember = group.members.some((m) => m.user.equals(userId));
    if (!isMember) return res.status(403).json({ message: "Not in group" });

    const tasks = await GroupTask.find({ group: id }).populate("assignedTo", "name email");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// 🏷️ Gắn tag (assign) thành viên vào task
exports.assignMembers = async (req, res) => {
  try {
    const { id } = req.params; // id task
    const { assignedTo } = req.body; // danh sách userId
    const userId = req.user.id;

    const task = await GroupTask.findById(id).populate("group");
    if (!task) return res.status(404).json({ message: "Task not found" });

    const group = await Group.findById(task.group._id);
    if (!group) return res.status(404).json({ message: "Group not found" });

    // chỉ Key hoặc chủ nhóm mới được gắn
    const member = group.members.find((m) => m.user.equals(userId));
    if (!member || member.role !== "key")
      return res.status(403).json({ message: "No permission to assign members" });

    task.assignedTo = assignedTo; // list user IDs
    await task.save();

    res.json({ message: "Assigned successfully", task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
// ✅ Toggle trạng thái hoàn thành
exports.toggleComplete = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const task = await GroupTask.findById(id).populate("group");
    if (!task) return res.status(404).json({ message: "Task not found" });

    const group = await Group.findById(task.group._id);
    if (!group) return res.status(404).json({ message: "Group not found" });

    // chỉ người được gắn hoặc chủ/key mới được thay đổi
    const member = group.members.find((m) => m.user.equals(userId));
    const isAssigned = task.assignedTo.some((m) => m.equals(userId));

    if (!member || (!isAssigned && member.role !== "key"))
      return res.status(403).json({ message: "You cannot modify this task" });

    task.completed = !task.completed;
    await task.save();

    res.json({ message: "Task updated", completed: task.completed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
