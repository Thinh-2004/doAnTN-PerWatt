import React from 'react';
import Header from '../UI&UX/Header/Header';
import Footer from '../UI&UX/Footer/Footer';
import CardsUs from './CardsUs';
import Product from '../UI&UX/Body/Home/Product/ProductItem';
const MainUserSeller = () => {
  return (
    <div className="MainUserSeller">
      <Header></Header>
      <div className="container">
      <h1>Overview chart</h1>
      <CardsUs></CardsUs>
      <div className="" style={{ marginTop: "70px" }}>
     <Product></Product>
      </div>
      <Footer></Footer>
    </div>
    /</div>
  );
};

export default MainUserSeller;