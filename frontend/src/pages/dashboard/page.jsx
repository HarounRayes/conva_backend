import React from 'react'
import Slider from './../../components/slider';
import Dashboard from './Dashboard';

const Page = () => {
  return (
      <div id="dashboard">
          <div className="flexing">
            <Slider index={0} />
            <Dashboard />
          </div>
      </div>
  );
}

export default Page;