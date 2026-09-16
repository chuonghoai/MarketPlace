import axios from "axios";

import { ENV } from "../config/env.config";

export const axiosInstance = axios.create({
    baseURL: ENV.API_URL,
    timeout: ENV.API_TIMEOUT,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});