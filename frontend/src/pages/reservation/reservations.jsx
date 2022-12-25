import React from 'react'
import Slider from '../../components/slider';
import Page from './page';

const Reservations = () => {
  return (
      <div id="reservations">
          <div className="flexing">
            <Slider index={4} />
            <Page />
          </div>
      </div>
  );
}

export default Reservations;