import React, { useEffect, useState } from "react";
import API from "../api";

export default function WeTodoTasks({ group, onClose }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const fetchTasks = async () => {
    try {
      const res = await API.get(`/wetodo/tasks?groupId=${group._id}`);
      setTasks(res.data || []);
    } catch (err) {
      console.error("Fetch tasks error:", err);
    }
  };

  const addTask = async () => {
    try {
      await API.post("/wetodo/tasks", { groupId: group._id, title });
      setTitle("");
      fetchTasks();
    } catch (err) {
      console.error("Add task error:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div
      style={{
        marginTop: 20,
        padding: 20,
        border: "1px solid gray",
        borderRadius: 6,
      }}
    >
      <h3>Task của nhóm: {group.name}</h3>
      <input
        type="text"
        placeholder="Nhập tên task..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button onClick={addTask}>Thêm Task</button>

      <ul>
        {tasks.map((t) => (
          <li key={t._id}>
            <input
              type="checkbox"
              checked={t.completed}
              onChange={async () => {
                await API.put(`/wetodo/tasks/${t._id}`, {
                  completed: !t.completed,
                });
                fetchTasks();
              }}
            />
            {t.title}
          </li>
        ))}
      </ul>

      <button onClick={onClose}>Đóng</button>
    </div>
  );
}
