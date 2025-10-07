import React, { useEffect, useState } from "react";
import API from "../api";
import WeTodoGroup from "./WeTodoGroup";
import WeTodoTasks from "./WeTodoTasks";

export default function WeTodoList() {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showGroupForm, setShowGroupForm] = useState(false);

  const fetchGroups = async () => {
    try {
      const res = await API.get("/wetodo/groups");
      setGroups(res.data);
    } catch (err) {
      console.error("Fetch groups error:", err);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Danh sách nhóm</h2>
      <button onClick={() => setShowGroupForm(true)}>+ Tạo nhóm mới</button>

      <ul>
        {groups.map((g) => (
          <li key={g._id}>
            <b>{g.name}</b>{" "}
            <button onClick={() => setSelectedGroup(g)}>Xem Task</button>
          </li>
        ))}
      </ul>

      {showGroupForm && (
        <WeTodoGroup
          onClose={() => setShowGroupForm(false)}
          onCreated={fetchGroups}
        />
      )}

      {selectedGroup && (
        <WeTodoTasks
          group={selectedGroup}
          onClose={() => setSelectedGroup(null)}
        />
      )}
    </div>
  );
}
