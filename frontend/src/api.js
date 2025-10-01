import axios from "axios";

export const taskAPI = axios.create({
  baseURL: process.env.REACT_APP_TASK_URL,
});