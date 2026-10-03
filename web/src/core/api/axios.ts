import axios from "axios";
import { getDeviceId } from "../utils/device.util";

import { ENV } from "../config/env.config";

export const axiosInstance = axios.create({
    baseURL: ENV.API_URL,
    timeout: ENV.API_TIMEOUT,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use((config) => {
    config.headers['x-device-id'] = getDeviceId();
    // Also include a basic user-agent hint if possible, although browsers handle User-Agent, 
    // it's sometimes blocked for custom headers, but standard User-Agent header is sent by browser.
    return config;
});