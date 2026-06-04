import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const axiosInstance = axios.create({ baseURL: API_BASE_URL });

export const axiosInstanceWithAuth = axios.create({
  baseURL: API_BASE_URL,
});

// Flag to prevent multiple simultaneous refresh requests
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

// Process the queue of failed requests after token refresh
const processQueue = (
  error: AxiosError | null,
  token: string | null = null,
) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

/**
 * Refresh the access token using the refresh token
 * @returns Promise with the new access token
 */
export const refreshToken = async (): Promise<string> => {
  try {
    if (typeof window === "undefined") {
      throw new Error("Cannot refresh token on server side");
    }

    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    // Call the refresh token endpoint
    const response = await axiosInstance.post("/api/auth/refresh-token", {
      refreshToken,
    });

    const { accessToken, refreshToken: newRefreshToken } = response.data.data;

    // Update tokens in localStorage
    localStorage.setItem("token", accessToken);
    if (newRefreshToken) {
      localStorage.setItem("refreshToken", newRefreshToken);
    }

    return accessToken;
  } catch (error) {
    // Clear tokens on refresh failure
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");

    // Redirect to login page
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }

    throw error;
  }
};

// Request interceptor to add auth token
axiosInstanceWithAuth.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle token refresh
axiosInstanceWithAuth.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Check if error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return axiosInstanceWithAuth(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newAccessToken = await refreshToken();

        // Update the failed request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        processQueue(null, newAccessToken);

        // Retry the original request
        return axiosInstanceWithAuth(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
