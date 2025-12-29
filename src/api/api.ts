import axios from "axios";
const API_HOST = import.meta.env.VITE_API_HOST;
export const api = axios.create({
    baseURL: API_HOST,
    timeout: 5000,
});