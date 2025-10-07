const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const groupController = require("../controllers/groupController");
const groupTaskController = require("../controllers/groupTaskController");

// Nhóm
router.post("/groups", auth, groupController.createGroup);
router.get("/groups", auth, groupController.getGroups);
router.post("/groups/:id/invite", auth, groupController.inviteMember);

// Task trong nhóm
router.post("/groups/:id/tasks", auth, groupTaskController.createGroupTask);
router.get("/groups/:id/tasks", auth, groupTaskController.getGroupTasks);
router.put("/tasks/:id/assign", auth, groupTaskController.assignMembers);
router.put("/tasks/:id/toggle", auth, groupTaskController.toggleComplete);
module.exports = router;
