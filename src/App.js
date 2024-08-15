import "./App.css";
<<<<<<< HEAD
import { BrowserRouter } from "react-router-dom";
import RouteUsers from "./RouteUsers/RouteUsers";
import RouteAdmin from "./RouteAdmin/RouteAdmin";
import { ToastContainer } from "react-toastify";
=======

import Form from "./components/Login&Register/Form";
>>>>>>> 106a8bb4f3e93a38b0e99c7ee8efac1405c981cd

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/UI&UX/Body/Home/Home";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import ResetPassword from "./components/ForgotPassword/ResetPassword";
import OTP from "./components/ForgotPassword/OTP";
function App() {
  return (
    <BrowserRouter>
<<<<<<< HEAD
    <ToastContainer />
      <RouteAdmin></RouteAdmin>
      <RouteUsers></RouteUsers>
=======
      <Routes>
        <Route path="/" element={<Home></Home>}></Route>
        <Route path="/login" element={<Form></Form>}></Route>
        <Route
          path="/formForgetPassword"
          element={<ForgotPassword></ForgotPassword>}
        ></Route>
        <Route path="/otp" element={<OTP></OTP>}></Route>
        <Route
          path="/resetPassword"
          element={<ResetPassword></ResetPassword>}
        ></Route>
      </Routes>
>>>>>>> 106a8bb4f3e93a38b0e99c7ee8efac1405c981cd
    </BrowserRouter>
  );
}

export default App;
