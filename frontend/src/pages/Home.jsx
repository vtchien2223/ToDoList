import React, { useEffect, useState } from "react";
import { taskAPI } from "../api";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCheckbox,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBListGroup,
  MDBListGroupItem,
  MDBRow,
  MDBTooltip,
} from "mdb-react-ui-kit";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDueInput, setShowDueInput] = useState(false);

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await taskAPI.get("/");
      setTasks(res.data || []);
    } catch (err) {
      console.error("Fetch tasks error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add task
  const addTask = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!title.trim()) return;
    try {
      const res = await taskAPI.post("/", {
        title: title.trim(),
        dueDate: dueDate ? new Date(dueDate) : undefined,
      });
      setTasks((prev) => [...prev, res.data]);
      setTitle("");
      setDueDate("");
    } catch (err) {
      console.error("Add task error:", err);
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa công việc này không?")) return;
    try {
      await taskAPI.delete(`/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Delete task error:", err);
    }
  };

  // Toggle completed
  const toggleTask = async (id, completed) => {
    try {
      const res = await taskAPI.put(`/${id}`, { completed });
      setTasks((prev) => prev.map((t) => (t._id === id ? res.data : t)));
    } catch (err) {
      console.error("Toggle task error:", err);
    }
  };

  // Format createdAt
  const formatDate = (iso) => {
    if (!iso) return "";
    try {
      const d = new Date(iso);
      return d.toLocaleString("vi-VN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return iso;
    }
  };

  // Format dueDate
  const formatDueDate = (iso) => {
    if (!iso) return "";
    try {
      const d = new Date(iso);
      return d.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return iso;
    }
  };

  return (
    <MDBContainer className="py-5">
      <MDBRow className="d-flex justify-content-center align-items-center h-100">
        <MDBCol>
          <MDBCard
            id="list1"
            style={{ borderRadius: ".75rem", backgroundColor: "#eff1f2" }}
          >
            <MDBCardBody className="py-4 px-4 px-md-5">
              <p className="h1 text-center mt-3 mb-4 pb-3 text-primary">
                <MDBIcon fas icon="check-square" className="me-1" />
                <u>My Todo-s</u>
              </p>

              {/* Add task */}
              <form onSubmit={addTask}>
                <div className="pb-2">
                  <MDBCard>
                    <MDBCardBody>
                      <div className="d-flex flex-row align-items-center">
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          placeholder="Add new..."
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                        />
                        {showDueInput && (
                          <input
                            type="date"
                            className="form-control form-control-lg ms-2"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            style={{ maxWidth: 180 }}
                            autoFocus
                            onBlur={() => setShowDueInput(false)}
                          />
                        )}
                        <MDBTooltip
                          tag="a"
                          wrapperProps={{ href: "#!" }}
                          title="Set due date"
                        >
                          <MDBIcon
                            fas
                            icon="calendar-alt"
                            size="lg"
                            className="me-3 ms-2"
                            style={{ cursor: "pointer" }}
                            onClick={() => setShowDueInput(true)}
                          />
                        </MDBTooltip>
                        <div>
                          <MDBBtn type="submit" className="ms-2">
                            Add
                          </MDBBtn>
                        </div>
                      </div>
                    </MDBCardBody>
                  </MDBCard>
                </div>
              </form>

              <hr className="my-4" />

              {/* Filter / Sort */}
              <div className="d-flex justify-content-end align-items-center mb-4 pt-2 pb-3">
                <p className="small mb-0 me-2 text-muted">Filter</p>
                <select className="form-select form-select-sm me-3" style={{ width: 140 }}>
                  <option>All</option>
                  <option>Completed</option>
                  <option>Active</option>
                  <option>Has due date</option>
                </select>

                <p className="small mb-0 ms-4 me-2 text-muted">Sort</p>
                <select className="form-select form-select-sm me-2" style={{ width: 140 }}>
                  <option>Added date</option>
                  <option>Due date</option>
                </select>

                <MDBTooltip tag="a" wrapperProps={{ href: "#!" }} title="Ascending">
                  <MDBIcon
                    fas
                    icon="sort-amount-down-alt"
                    className="ms-2"
                    style={{ color: "#23af89" }}
                  />
                </MDBTooltip>
              </div>

              {/* Task list */}
              {loading ? (
                <p>Loading...</p>
              ) : tasks.length === 0 ? (
                <p className="text-center text-muted">Chưa có công việc nào.</p>
              ) : (
                tasks.map((task) => (
                  <MDBListGroup
                    horizontal
                    className="rounded-0 bg-transparent"
                    key={task._id}
                  >
                    <MDBListGroupItem className="d-flex align-items-center ps-0 pe-3 py-1 rounded-0 border-0 bg-transparent">
                      <MDBCheckbox
                        name={`chk-${task._id}`}
                        value=""
                        id={`chk-${task._id}`}
                        defaultChecked={!!task.completed}
                        onChange={() => toggleTask(task._id, !task.completed)}
                      />
                    </MDBListGroupItem>

                    <MDBListGroupItem className="px-3 py-1 d-flex align-items-center flex-grow-1 border-0 bg-transparent">
                      <p
                        className={`lead fw-normal mb-0 ${
                          task.completed ? "text-decoration-line-through" : ""
                        }`}
                      >
                        {task.title}
                        {task.dueDate && (
                          <span className="ms-3 badge bg-warning text-dark">
                            <MDBIcon fas icon="calendar-alt" className="me-1" />
                            {formatDueDate(task.dueDate)}
                          </span>
                        )}
                      </p>
                    </MDBListGroupItem>

                    <MDBListGroupItem className="ps-3 pe-0 py-1 rounded-0 border-0 bg-transparent">
                      <div className="d-flex flex-row justify-content-end mb-1">
                        <MDBTooltip tag="a" wrapperProps={{ href: "#!" }} title="Edit todo">
                          <MDBIcon
                            fas
                            icon="pencil-alt"
                            className="me-3"
                            color="info"
                            style={{ cursor: "pointer" }}
                            onClick={() => alert("Chức năng sửa chưa được triển khai.")}
                          />
                        </MDBTooltip>

                        <MDBTooltip tag="a" wrapperProps={{ href: "#!" }} title="Delete todo">
                          <MDBIcon
                            fas
                            icon="trash-alt"
                            color="danger"
                            style={{ cursor: "pointer" }}
                            onClick={() => deleteTask(task._id)}
                          />
                        </MDBTooltip>
                      </div>

                      <div className="text-end text-muted">
                        <MDBTooltip tag="a" wrapperProps={{ href: "#!" }} title="Created date">
                          <p className="small text-muted mb-0">
                            <MDBIcon fas icon="info-circle" className="me-2" />
                            {formatDate(task.createdAt)}
                          </p>
                        </MDBTooltip>
                      </div>
                    </MDBListGroupItem>
                  </MDBListGroup>
                ))
              )}
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}
