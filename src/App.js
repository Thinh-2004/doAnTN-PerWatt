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
  CheckTimeLogOut();
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
  //       window.location.href = "/form-thong-bao";
  //     }
  //   };

  //   const checkExecutionDelay = () => {
  //     const start = performance.now();
  //     setTimeout(() => {
  //       const end = performance.now();
  //       if (end - start > 100) {
  //         // độ trễ cao, giả định DevTools mở
  //         isDevToolsOpen = true;
  //         window.location.href = "/form-thong-bao";
  //       }
  //     }, 100);
  //   };

  //   window.addEventListener("resize", checkSizeDifference);
  //   setInterval(checkExecutionDelay, 1000);
  // };

  // detectDevTools();

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
