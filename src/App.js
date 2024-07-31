import "./App.css";
import { BrowserRouter } from "react-router-dom";
import RouteUsers from "./components/RouteUsers/RouteUsers";
import RouteAdmin from "./RouteAdmin/RouteAdmin";
import { ToastContainer } from "react-toastify";


function App() {
  return (
    <BrowserRouter>     
        <RouteAdmin></RouteAdmin>
      <RouteUsers></RouteUsers>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
