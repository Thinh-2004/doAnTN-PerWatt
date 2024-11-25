import "./App.css";
import { BrowserRouter } from "react-router-dom";
import RouteUsers from "./RouteUsers/RouteUsers";
import RouteAdmin from "./RouteAdmin/RouteAdmin";
import { ToastContainer } from "react-toastify";
import CheckTimeLogOut from "./Session/CheckTimeLogOut";
import { Box } from "@mui/material";
import { ThemeModeContext } from "./components/ThemeMode/ThemeModeProvider";
import { useContext, useEffect } from "react";

function App() {
  // CheckTimeLogOut();
  const { mode } = useContext(ThemeModeContext);

  // const detectDevTools = () => {
  //   const threshold = 160;
  //   let isDevToolsOpen = false;

  //   const checkSizeDifference = () => {
  //     if (
  //       window.outerWidth - window.innerWidth > threshold ||
  //       window.outerHeight - window.innerHeight > threshold
  //     ) {
  //       isDevToolsOpen = true;
  //       handleDevToolsOpen();
  //     }
  //   };

  //   const checkExecutionTime = () => {
  //     const start = performance.now();
  //     // debugger; // Lệnh này sẽ chậm hơn khi DevTools đang mở
  //     const end = performance.now();

  //     if (end - start > 100) {
  //       // Nếu thời gian thực thi vượt quá 100ms, DevTools có khả năng đang mở
  //       isDevToolsOpen = true;
  //       handleDevToolsOpen();
  //     }
  //   };

  //   const handleDevToolsOpen = () => {
  //     if (isDevToolsOpen) {
  //       window.location.href = "/login"; // Điều hướng về trang đăng nhập
  //       localStorage.clear(); // Xóa dữ liệu người dùng
  //       console.log(
  //         "%cVui lòng tắt developer tool để tiếp tục trải nghiệm website",
  //         "color: red; font-size: 16px; font-weight: bold;"
  //       );
  //     }
  //   };

  //   // Lắng nghe sự kiện thay đổi kích thước cửa sổ
  //   window.addEventListener("resize", checkSizeDifference);

  //   // Kiểm tra thời gian thực thi
  //   setInterval(checkExecutionTime, 1000); // Kiểm tra định kỳ mỗi giây
  // };

  // useEffect(() => {
  //   detectDevTools(); // Kiểm tra ngay khi trang load
  // }, []);

  return (
    <>
      <Box
        sx={{
          bgcolor: "background.default",
          color: "text.primary",
        }}
      >
        <BrowserRouter>
          <RouteAdmin />
          <RouteUsers />
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            closeOnClick={true}
            draggable={true}
            pauseOnHover={true}
            theme={mode === "light" ? "light" : "dark"}
          />
        </BrowserRouter>
      </Box>
    </>
  );
}

export default App;
