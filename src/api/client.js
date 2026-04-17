import axios from "axios";

const raw = process.env.REACT_APP_API_URL?.trim();
// Never leave baseURL undefined (axios would send /api/* to :3000 and fail).
export const api = axios.create({
  baseURL: raw || "http://localhost:5000",
});