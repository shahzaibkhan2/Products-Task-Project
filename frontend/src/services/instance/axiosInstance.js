import axios from "axios";


export const axiosInstance = axios.create({
  baseURL: "http://localhost:4000/api/v1",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
});