import React from 'react';
import {Routes, Route} from 'react-router-dom'
import Home from '../UI&UX/Body/Home/Home';
import Form from '../Login&Register/Form';
import Market from '../Market/Market';
import IsMarket from '../Market/CheckUsers/IsMarket/IsMarket';

const RouteUsers = (props) => {
    return (
        <Routes>
        <Route path="/" element={<Home></Home>}></Route>
        <Route path="login" element={<Form></Form>}></Route>
        <Route path="/cart" element={<h1>hello</h1>}></Route>
        <Route path="/market" element={<Market></Market>}></Route>
        <Route path="/profileMarket/*" element={<IsMarket></IsMarket>}></Route>
        <Route path='*'>404 Not Found</Route>
      </Routes>
    );
};

export default RouteUsers;