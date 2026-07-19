import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000",
});

let isRefreshing = false;
let pendingQueue: Array<{
    config: any;
    resolve: (value: any) => void;
    reject: (reason?: any) => void;
}> = [];

api.interceptors.request.use((config) => {

    const token = localStorage.getItem("access_token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        if (originalRequest.url === "/auth/refresh") {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            window.location.href = "/login";
            return Promise.reject(error);
        }

        if (isRefreshing) {
            originalRequest._retry = true;
            return new Promise((resolve, reject) => {
                pendingQueue.push({ config: originalRequest, resolve, reject });
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = localStorage.getItem("refresh_token");

        if (!refreshToken) {
            isRefreshing = false;
            localStorage.removeItem("access_token");
            window.location.href = "/login";
            return Promise.reject(error);
        }

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/auth/refresh",
                { refresh_token: refreshToken }
            );

            const { access_token, refresh_token: newRefresh } = response.data;

            localStorage.setItem("access_token", access_token);
            localStorage.setItem("refresh_token", newRefresh);

            pendingQueue.forEach(({ config, resolve }) => {
                resolve(api(config));
            });
            pendingQueue = [];

            originalRequest.headers.Authorization = `Bearer ${access_token}`;
            return api(originalRequest);
        } catch (refreshError) {
            pendingQueue.forEach(({ reject }) => {
                reject(refreshError);
            });
            pendingQueue = [];

            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            window.location.href = "/login";

            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

export default api;