import React from 'react';
import { CardDataUs } from '../../Data/Data';
import CardUs from './CardUs'; // Import đúng đường dẫn thành phần CardUs

const CardsUs = () => {
  return (
    <div className="Cards">
      {CardDataUs.map((card, id) => (
        <div className="parentContainer" key={id}>
          <CardUs
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

export default CardsUs;
