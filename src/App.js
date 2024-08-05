import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RouterUsers from "./RouterUsers/RouterUsers";

function App() {
  return (
    <BrowserRouter>
        <RouterUsers></RouterUsers>
    </BrowserRouter>
  );
}

export default App;
