import "./App.css";
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
function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default App;
