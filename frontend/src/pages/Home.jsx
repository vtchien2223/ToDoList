import { useEffect, useState } from "react";
import { taskAPI } from "../api";
import TaskForm from "../components/TaskForm";
import TaskItem from "../components/TaskItem";

const Home = () => {
  const [tasks, setTasks] = useState([]);

  // Lấy danh sách task
  const fetchTasks = async () => {
    const res = await taskAPI.get("/");
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Thêm task
  const addTask = async (title) => {
    const res = await taskAPI.post("/", { title });
    setTasks([...tasks, res.data]);
  };

  // Xóa task
  const deleteTask = async (id) => {
    await taskAPI.delete(`/${id}`);
    setTasks(tasks.filter((task) => task._id !== id));
  };

  // Toggle completed
  const toggleTask = async (id, completed) => {
    const res = await taskAPI.put(`/${id}`, { completed });
    setTasks(
      tasks.map((task) => (task._id === id ? res.data : task))
    );
  };

  return (
    <div style={{ maxWidth: "400px", margin: "20px auto" }}>
      <h1>To-Do List</h1>
      <TaskForm onAdd={addTask} />
      <div>
        {tasks.map((task) => (
          <TaskItem
            key={task._id}
            task={task}
            onDelete={deleteTask}
            onToggle={toggleTask}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
