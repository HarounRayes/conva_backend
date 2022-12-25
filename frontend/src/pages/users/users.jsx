import React from 'react'
import Slider from '../../components/slider';
import Page from './page';

const Users = () => {
  return (
      <div id="users">
          <div className="flexing">
            <Slider index={1} />
            <Page />
          </div>
      </div>
  );
}

export default Users;