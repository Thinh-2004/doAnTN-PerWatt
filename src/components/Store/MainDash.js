import React from 'react';

import './MainDash.css'
import Header from '../UI&UX/Header/Header';

import Footer from '../UI&UX/Footer/Footer';
import CardsAmin from './CardsAdmin';
import TableAd from './TableAd';

const MainDash = () => {
  return (
    <div className='MainDash'>
    <Header></Header>
    <div className="container">
    <h1>Overview chart</h1>
      <CardsAmin></CardsAmin>
      <div className="" style={{ marginTop: "70px" }}>
      <TableAd></TableAd>
      </div>
    </div>
    <Footer></Footer>
    </div>
  );
};

export default MainDash;