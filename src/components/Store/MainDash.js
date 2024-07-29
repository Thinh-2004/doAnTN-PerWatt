import React from 'react';
import Cards from './Cards';
import './MainDash.css'
import Header from '../UI&UX/Header/Header';
import About from '../UI&UX/Body/Home/About/About';
import Footer from '../UI&UX/Footer/Footer';
const MainDash = () => {
  return (
    <div className='MainDash'>
    <Header></Header>
    <div className="container">
    <h1>Dashboard</h1>
      <Cards></Cards>

    </div>
    <Footer></Footer>
    </div>
  );
};

export default MainDash;