
import './App.css';

import Form from './components/Login&Register/Form';

import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Home from './components/UI&UX/Body/Home/Home';
import MainDash from './components/Store/MainDash';
import MainUserSeller from './components/UserSeller/MainUserSeller';

function App() {
  return (
   <BrowserRouter>
    <Routes>
      <Route path='/' element={ <Home></Home>}></Route>
      <Route path='/login' element={<Form></Form>}></Route>
      <Route path='/adstore' element={<MainDash></MainDash>}></Route>
      <Route path='/userseller' element={<MainUserSeller></MainUserSeller>}></Route>
    </Routes>
   </BrowserRouter>
  );
}

export default App;
