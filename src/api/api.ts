import axios from "axios";

export const api = axios.create({
    baseURL: "http://34.69.220.152/",
    timeout: 5000,
});