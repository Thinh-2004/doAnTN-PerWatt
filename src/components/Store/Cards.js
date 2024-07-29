// src/components/Store/Cards.js
import React from 'react';
import './Cards.css';
import { CardData } from '../../Data/Data';
import Card from '../Card/Card';

const Cards = () => {
  return (
    <div className="Cards">
      {CardData.map((card, id) => (
        <div className="parentContainer" >
          <Card
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

export default Cards;
