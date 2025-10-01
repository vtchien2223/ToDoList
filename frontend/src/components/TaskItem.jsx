const TaskItem = ({ task, onDelete, onToggle }) => {
  return (
    <div style={{ display: "flex", gap: "10px", margin: "5px 0" }}>
      <span
        style={{
          textDecoration: task.completed ? "line-through" : "none",
          cursor: "pointer",
        }}
        onClick={() => onToggle(task._id, !task.completed)}
      >
        {task.title}
      </span>
      <button onClick={() => onDelete(task._id)}>Xóa</button>
    </div>
  );
};

export default TaskItem;
