import axios from "axios";

export const api = axios.create({
    //baseURL: "https://mcphubcorp.site/",
    baseURL: "http://localhost:8080/",
    timeout: 5000,
});