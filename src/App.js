import "./App.css";
import { BrowserRouter } from "react-router-dom";
import RouteUsers from "./RouteUsers/RouteUsers";
import RouteAdmin from "./RouteAdmin/RouteAdmin";
import { ToastContainer } from "react-toastify";
import CheckTimeLogOut from "./Session/CheckTimeLogOut";  
import { Box } from "@mui/material";
import { ThemeModeContext } from "./components/ThemeMode/ThemeModeProvider";
import { useContext } from "react";

function App() {
  CheckTimeLogOut();
  const {mode} = useContext(ThemeModeContext);
  console.log(mode);

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
