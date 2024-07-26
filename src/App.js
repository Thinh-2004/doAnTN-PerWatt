import "./App.css";

import Form from "./components/Login&Register/Form";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/UI&UX/Body/Home/Home";
import Body from "./components/Cart/Body/Body";
import Header from "./components/UI&UX/Header/Header";
import Footer from "./components/UI&UX/Footer/Footer";

function App() {
  return (
    <BrowserRouter>
      <Header></Header>
      <Routes>
        <Route path="/" element={<Home></Home>}></Route>
        <Route path="/login" element={<Form></Form>}></Route>1
        <Route path="/cart" element={<Body></Body>}></Route>
      </Routes>
      <Footer></Footer>
    </BrowserRouter>
  );
}

export default App;
