// src/components/Store/Cards.js
import React from 'react';
import './CardsAmin.css';
import { CardData } from '../../Data/Data';
import CardAd from './CardAd';



const CardsAmin = () => {
  return (
    <div className="Cards">
      {CardData.map((card, id) => (
        <div className="parentContainer" >
          <CardAd
            title={card.title}
            color={card.color}
            barValue={card.barValue}
            value={card.value}
            png={card.png}
            series={card.series}
          />
          
        </div>
      ))}
    </div>
  );
};

export default CardsAmin;
