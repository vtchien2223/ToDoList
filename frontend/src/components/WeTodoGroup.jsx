import React, { useState } from "react";
import API from "../api";

export default function WeTodoGroup({ onClose, onCreated }) {
  const [groupName, setGroupName] = useState("");
  const [email, setEmail] = useState("");
  const [groupId, setGroupId] = useState(null);
  const [message, setMessage] = useState("");

  const createGroup = async () => {
    try {
      const res = await API.post("/wetodo/groups", { name: groupName });
      setGroupId(res.data._id);
      setMessage("Tạo nhóm thành công!");
      onCreated();
    } catch (err) {
      console.error("Create group error:", err);
      setMessage("Lỗi khi tạo nhóm.");
    }
  };

  const addMember = async () => {
    try {
      await API.post(`/wetodo/groups/${groupId}/invite`, { email });
      setMessage("Thêm thành viên thành công!");
      setEmail("");
    } catch (err) {
      console.error("Add member error:", err);
      setMessage("Lỗi khi thêm thành viên.");
    }
  };

  return (
    <div
      style={{
        padding: 20,
        border: "1px solid gray",
        borderRadius: 6,
        marginTop: 20,
      }}
    >
      <h3>Tạo nhóm mới</h3>
      <input
        type="text"
        placeholder="Tên nhóm"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />
      <button onClick={createGroup}>Tạo nhóm</button>

      {groupId && (
        <>
          <h4 style={{ marginTop: 20 }}>Thêm thành viên</h4>
          <input
            type="email"
            placeholder="Nhập email thành viên"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={addMember}>Thêm</button>
        </>
      )}

      <p style={{ color: "green" }}>{message}</p>
      <button onClick={onClose}>Đóng</button>
    </div>
  );
}