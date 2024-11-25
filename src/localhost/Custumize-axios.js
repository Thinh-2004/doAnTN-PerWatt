import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

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

//Làm mới token
const refreshToken = async (token) => {
  if (token) {
    try {
      const response = await axios.post("http://localhost:8080/refesh", {
        token,
      });
      const newAccessToken = response.data.result.token;

      // Lưu token mới vào localStorage
      localStorage.setItem("hadfjkdshf", newAccessToken);
      // console.log("Token đã được làm mới:", newAccessToken);
      return newAccessToken;
    } catch (error) {
      console.error("Làm mới token thất bại:", error);
      // localStorage.clear();
      // window.location.href = "/";
      throw error;
    }
  }
};

// Request Interceptor: Kiểm tra token sắp hết hạn
instance.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem("hadfjkdshf");

    if (token) {
      if (isTokenNearExpiry(token)) {
        // console.log("Token sắp hết hạn, làm mới...");
        token = await refreshToken(token);
      } else {
        //  localStorage.clear();
      }

      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
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

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const token = localStorage.getItem("hadfjkdshf");
        const newAccessToken = await refreshToken(token);

        // Cập nhật Access Token mới vào request ban đầu
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return instance(originalRequest);
      } catch (refreshError) {
        console.error("Không thể làm mới token sau lỗi 401:", refreshError);
        localStorage.clear();
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
export { APITinhThanh };
