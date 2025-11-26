import axios from "axios";

export const api = axios.create({
    baseURL: "https://mcphubcorp.site/",
    timeout: 5000,
});