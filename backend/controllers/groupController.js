const Group = require("../models/Group");
const User = require("../models/User");

// 🧠 Tạo nhóm mới
exports.createGroup = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.id;

    const group = new Group({
      name,
      owner: userId,
      members: [{ user: userId, role: "key" }],
    });

    await group.save();
    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📜 Lấy tất cả nhóm user tham gia
exports.getGroups = async (req, res) => {
  try {
    const userId = req.user.id;
    const groups = await Group.find({ "members.user": userId }).populate("members.user", "name email");
    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✉️ Mời thành viên vào nhóm (qua email)
exports.inviteMember = async (req, res) => {
  try {
    const { email, role } = req.body;
    const { id } = req.params;
    const userId = req.user.id;

    const group = await Group.findById(id);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (!group.owner.equals(userId))
      return res.status(403).json({ message: "Only owner can invite members" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // kiểm tra trùng
    const isMember = group.members.some((m) => m.user.equals(user._id));
    if (isMember)
      return res.status(400).json({ message: "User already in group" });

    group.members.push({ user: user._id, role: role || "member" });
    await group.save();

    res.json({ message: "Member invited successfully", group });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
