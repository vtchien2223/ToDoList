import React from "react";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const handleSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;
    try {
      const res = await axios.post(process.env.REACT_APP_AUTH_URL, {
        token,
      });
      console.log("Server response:", res.data);
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        alert("Đăng nhập thành công!");
        navigate("/home"); 
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi đăng nhập backend!");
    }
  };

  const handleError = () => {
    console.log("Google login failed");
    alert("Đăng nhập thất bại!");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
    </div>
  );
}