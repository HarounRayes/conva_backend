import React from 'react'
import Slider from '../../components/slider';
import Page from './page';

const Cars = () => {
  return (
      <div id="cars">
          <div className="flexing">
            <Slider index={3} />
            <Page />
          </div>
      </div>
  );
}

export default Cars;