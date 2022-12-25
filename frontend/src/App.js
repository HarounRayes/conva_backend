import './App.css';
import './Style.scss';
//import Page from './pages/dashboard/page';

import {
  BrowserRouter as Router,
  Route,
  Routes,
} from 'react-router-dom';

//import Page from './pages/reservation/page';
import Reservations from './pages/reservation/reservations';
import Dashboard from './pages/dashboard/Dashboard';
import Users from './pages/users/users';
import Drivers from './pages/drivers/drivers';
import Cars from './pages/cars/cars';
import Page from './pages/dashboard/page';

function App() {

  return (
    <div className="App">
    
        <Router>
          {/* <Switch>
            <PrivateRouteAdmin exact path="/dashboard" userType = {userType} component={Dashboard}></PrivateRouteAdmin>
            <PrivateRouteAdmin exact path="/dashboard/competitions" userType = {userType} component={Competition}></PrivateRouteAdmin>
          </Switch> */}
            <Routes>
              <Route path="/" element={<Page />} />
              <Route path="/reservations" element={<Reservations />} />
              <Route path="/users" element={<Users />} />
              <Route path="/drivers" element={<Drivers />} />
              <Route path="/cars" element={<Cars />} />
            </Routes>

            {/* <PrivateRoute exact path="/profile" userType = {userType} component={Profile}></PrivateRoute> */}

        </Router>
      
    </div>
  );
}

export default App;
