import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080/",
  headers: {
    "Content-Type": "application/json",
  },
});

const APITinhThanh = axios.create({
  baseURL: "https://provinces.open-api.vn/",
});

instance.interceptors.request.use(
  (config) => {
    //Lấy token từ local
    const token = localStorage.getItem("hadfjkdshf");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Kiểm tra lỗi 401 (Access Token hết hạn)
    const token = localStorage.getItem("hadfjkdshf");
    if (error.response.status === 401 && !originalRequest._retry && token) {
      originalRequest._retry = true;

      try {
        // Gửi yêu cầu refresh token
        const response = await instance.post(
          "/refesh",
          {
            token: token,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const newAccessToken = response.data.result.accessToken;

        // Lưu Access Token mới vào localStorage
        localStorage.setItem("hadfjkdshf", newAccessToken);

        // Cập nhật Access Token cho request ban đầu
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return instance(originalRequest); // Thử lại request ban đầu
      } catch (refreshError) {
        console.error("Làm mới token thất bại:", refreshError);
        // Xử lý logout người dùng nếu Refresh Token cũng hết hạn
        localStorage.clear();
        window.location.href = "/"; // Điều hướng về trang đăng nhập
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
export { APITinhThanh };
