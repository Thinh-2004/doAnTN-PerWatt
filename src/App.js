import "./App.css";
<<<<<<< HEAD
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/UI&UX/Body/Home/Home";
import Form from "./components/Login&Register/Form";
import RouteUsers from "./components/RouteUsers/RouteUsers";
import RouteAdmin from "./RouteAdmin/RouteAdmin";
import { ToastContainer } from "react-toastify";
import ForgotPassword from "./components/ForgotPasswordUser/ForgotPassword";
import ResetPassword from "./components/ForgotPasswordUser/ResetPassword";
import OTP from "./components/ForgotPasswordUser/OTP";
import ChangePassword from "./components/ChangePasswordUser/ChangePassword";
=======
import { BrowserRouter } from "react-router-dom";
import RouteUsers from "./RouteUsers/RouteUsers";
import RouteAdmin from "./RouteAdmin/RouteAdmin";
import { ToastContainer } from "react-toastify";
import CheckTimeLogOut from "./Session/CheckTimeLogOut";

>>>>>>> 58b6b921afbae8680c6ac95e820dfb3b6a74604f
function App() {
  CheckTimeLogOut();
  return (
    <BrowserRouter>
<<<<<<< HEAD
      <Routes>
        <Route path="/" element={<Home />}></Route>
        {/* Đoạn mã từ HEAD */}
        <Route path="/login" element={<Form />}></Route>
        <Route path="/formForgetPassword" element={<ForgotPassword />}></Route>
        <Route path="/otp" element={<OTP />}></Route>
        <Route path="/resetPassword" element={<ResetPassword />}></Route>
        <Route path="/changePassword" element={<ChangePassword />}></Route>
        {/* Đoạn mã từ origin/thinhtq */}
      </Routes>
      <RouteAdmin />
      <RouteUsers />
      <ToastContainer />
=======
   
      <RouteAdmin></RouteAdmin>
      <RouteUsers></RouteUsers>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick={true}
        draggable={true}
        pauseOnHover={true}
        theme="light"
      />
>>>>>>> 58b6b921afbae8680c6ac95e820dfb3b6a74604f
    </BrowserRouter>
  );
}

export default App;
