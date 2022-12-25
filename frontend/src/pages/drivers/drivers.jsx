import React from 'react'
import Slider from '../../components/slider';
import Page from './page';

const Drivers = () => {
  return (
      <div id="drivers">
          <div className="flexing">
            <Slider index={2} />
            <Page />
          </div>
      </div>
  );
}

export default Drivers;