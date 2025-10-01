import { useState } from "react";

const TaskForm = ({ onAdd }) => {
  const [title, setTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title);
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nhập công việc..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button type="submit">Thêm</button>
    </form>
  );
};

export default TaskForm;
