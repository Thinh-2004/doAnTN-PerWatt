import "./App.css";
<<<<<<< HEAD

import Form from "./components/Login&Register/Form";
=======
import { BrowserRouter } from "react-router-dom";
import RouteUsers from "./components/RouteUsers/RouteUsers";
import RouteAdmin from "./RouteAdmin/RouteAdmin";
import { ToastContainer } from "react-toastify";

>>>>>>> origin/thinhtq

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/UI&UX/Body/Home/Home";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import ResetPassword from "./components/ForgotPassword/ResetPassword";
import OTP from "./components/ForgotPassword/OTP";
function App() {
  return (
<<<<<<< HEAD
    <BrowserRouter>
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
=======
    <BrowserRouter>     
        <RouteAdmin></RouteAdmin>
      <RouteUsers></RouteUsers>
      <ToastContainer />
>>>>>>> origin/thinhtq
    </BrowserRouter>
  );
}

export default App;
