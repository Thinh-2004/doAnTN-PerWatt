import "./App.css";
<<<<<<< HEAD
import Form from "./components/Login&Register/Form";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Body/Home/Home";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import ResetPassword from "./components/ForgotPassword/ResetPassword";
import OTP from "./components/ForgotPassword/OTP";
function App() {
  return (
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
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RouterUsers from "./RouterUsers/RouterUsers";

function App() {
  return (
    <BrowserRouter>
        <RouterUsers></RouterUsers>
>>>>>>> a4a2c76a2188eff27aed7a2ceb5503475a5fc9ca
    </BrowserRouter>
  );
}

export default App;
