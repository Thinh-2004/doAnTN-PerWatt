import "./App.css";
import { BrowserRouter } from "react-router-dom";
import RouteUsers from "./RouteUsers/RouteUsers";
import RouteAdmin from "./RouteAdmin/RouteAdmin";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <BrowserRouter>
    <ToastContainer />
      <RouteAdmin></RouteAdmin>
      <RouteUsers></RouteUsers>
    </BrowserRouter>
  );
}

export default App;
