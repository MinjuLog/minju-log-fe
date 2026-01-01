import axios from "axios";
const FEED_HOST = import.meta.env.VITE_FEED_HOST;
export const api = axios.create({
    baseURL: FEED_HOST,
    timeout: 5000,
});