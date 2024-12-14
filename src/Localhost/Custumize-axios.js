import axios from "axios";
import { jwtDecode } from "jwt-decode";

const instance = axios.create({
  baseURL: "http://localhost:8080/",
  headers: {
    "Content-Type": "application/json",
  },
});

const APITinhThanh = axios.create({
  baseURL: "https://provinces.open-api.vn/",
});

//Kiểm tra có đăng nhập hay không
const isTokenNearExpiry = (token) => {
  if (!token) return true;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000); // Thời gian hiện tại (giây)
    const bufferTime = 5 * 60; // 5 phút
    return decoded.exp < currentTime + bufferTime; // Token sắp hết hạn nếu còn dưới 5 phút
  } catch (error) {
    console.error("Token không hợp lệ:", error);
    return true;
  }
};

let isRefreshing = false;
let refreshSubscribers = [];

const onRefreshed = (newToken) => {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback) => {
  refreshSubscribers.push(callback);
};

//Làm mới token
const refreshToken = async (token) => {
  if (!isRefreshing) {
    isRefreshing = true;
    try {
      const response = await axios.post("http://localhost:8080/form/refesh", {
        token,
      });
      const newAccessToken = response.data.result.token;

      // Cập nhật token vào localStorage
      localStorage.setItem("hadfjkdshf", newAccessToken);

      // Thông báo cho các request đang chờ
      onRefreshed(newAccessToken);

      isRefreshing = false;
      return newAccessToken;
    } catch (error) {
      console.error("Làm mới token thất bại:", error);
      localStorage.clear();
      // window.location.href = "/";
      isRefreshing = false;
      throw error;
    }
  }

  // Nếu có request đang refresh, chờ kết quả
  return new Promise((resolve) => {
    addRefreshSubscriber((newToken) => {
      resolve(newToken);
    });
  });
};

// Request Interceptor: Kiểm tra token sắp hết hạn
instance.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem("hadfjkdshf");

    if (token) {
      if (isTokenNearExpiry(token)) {
        token = await refreshToken(token);
      }

      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Xử lý lỗi 401 nếu có
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const token = localStorage.getItem("hadfjkdshf");

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshToken(token);

        // Cập nhật Access Token mới vào request ban đầu
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return instance(originalRequest);
      } catch (refreshError) {
        console.error("Không thể làm mới token sau lỗi 401:", refreshError);
        localStorage.clear();
        // window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
export { APITinhThanh };
