import axios from "axios";

export const feedApi = axios.create({
    // baseURL: "https://mcphubcorp.site/",
    baseURL: "http://localhost:8080/",
    timeout: 5000,
});