import axios from "axios";

export function apiCall() {
    return axios.create({
        baseURL: "https://reviewar-be.onrender.com/api/",
    });
}
