import React, { useState, useEffect } from "react";
import MyTodos from "../components/MyTodos";
import WeTodoList from "../components/WeTodoList";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBListGroup,
  MDBListGroupItem,
  MDBIcon,
} from "mdb-react-ui-kit";

export default function Home() {
  const [activeTab, setActiveTab] = useState("mytodo");
  const [loggedUser, setLoggedUser] = useState(null);
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setLoggedUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <MDBContainer fluid className="py-4">
      <MDBRow className="mb-4">
        <MDBCol>
          <div className="d-flex align-items-center justify-content-between px-3 py-2 bg-primary text-white rounded">
            <h3 className="mb-0">
              <MDBIcon fas icon="tasks" className="me-2" />
              ToDo App
            </h3>
            <div className="d-flex align-items-center">
              <MDBIcon fas icon="user-circle" className="me-2" />
              <span className="me-3">
                {loggedUser?.name || "User"}
              </span>
              <button
                onClick={handleLogout}
                style={{
                  background: "transparent",
                  border: "1px solid white",
                  color: "white",
                  borderRadius: "5px",
                  padding: "5px 10px",
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </MDBCol>
      </MDBRow>
      <MDBRow>
        <MDBCol md="3" lg="2">
          <MDBListGroup>
            <MDBListGroupItem
              action
              active={activeTab === "mytodo"}
              onClick={() => setActiveTab("mytodo")}
              className="d-flex align-items-center"
              style={{ cursor: "pointer" }}
            >
              <MDBIcon fas icon="list-ul" className="me-2" />
              MyTodo
            </MDBListGroupItem>
            <MDBListGroupItem
              action
              active={activeTab === "wetodo"}
              onClick={() => setActiveTab("wetodo")}
              className="d-flex align-items-center"
              style={{ cursor: "pointer" }}
            >
              <MDBIcon fas icon="users" className="me-2" />
              WeTodo
            </MDBListGroupItem>
          </MDBListGroup>
        </MDBCol>
        <MDBCol md="9" lg="10">
          {activeTab === "mytodo" && <MyTodos />}
          {activeTab === "wetodo" && <WeTodoList/>}
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}
