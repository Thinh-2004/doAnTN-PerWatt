import "./App.css";
import Form from "./components/Login&Register/Form";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/UI&UX/Body/Home/Home";
import Market from "./components/Market/Market";
import IsMarket from "./components/Market/CheckUsers/IsMarket/IsMarket";


function App() {
  return (
    <BrowserRouter>      
      <Routes>
        <Route path="/" element={<Home></Home>}></Route>
        <Route path="login" element={<Form></Form>}></Route>
        <Route path="/cart" element={<h1>hello</h1>}></Route>
        <Route path="/market" element={<Market></Market>}></Route>
        <Route path="/profileMarket/*" element={<IsMarket></IsMarket>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
