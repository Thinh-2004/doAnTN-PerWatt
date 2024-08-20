import "./App.css";
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
    </BrowserRouter>
  );
}

export default App;
