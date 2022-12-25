import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { AiOutlineBell, AiOutlineSearch } from 'react-icons/ai'
import { FcBusinessman } from 'react-icons/fc'
import DoughnutChartData from './doughnutChart'
import LineChartData from './LineChart'
import axios from 'axios';


const Dashboard = () => {

    const [users, setUsers] = useState(0);
    const [drivers, setDrivers] = useState(0);
    const [cars, setCars] = useState(0);
    const [reservations, setReservations] = useState(0);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_SERVER_END_POINT}/dashboard/infos`).then((res) => {
           setUsers(res.data.users_count);
           setDrivers(res.data.drivers_count);
           setCars(res.data.cars_count);
           setReservations(res.data.reservations_count);
        });
        console.log(users);
    }, []);


  return (
    <div className='dashboard'>
        {/* top part of dashboard */}
        <div className="d-top f j-c-s-b">
            <div className="d-left">
                <h4>Welcome back, Abdou!</h4>
                <span>Lorem ipsum dolor sit.</span>
            </div>
            <div className="d-right f-n-c">
                <div className="search-input f-n-c">
                    <AiOutlineSearch />
                    <input type="text" placeholder='search' className='ml2' />
                </div>
                <div className="notifications-icon f-c-c">
                    <AiOutlineBell />
                </div>
                <div className="avatar-picture f-c-c">
                    <FcBusinessman />
                </div>
            </div>
        </div>
        {/* statistics part of dashboard */}
        <div className="statistics">
            <div className="card f-b-c ">
                <div className="card-left">
                    <p>Clients</p>
                    <span>{users}</span>
                </div>
                <div className="card-right clients f-c-c">
                    <AiOutlineBell />
                </div>
            </div>
            <div className="card f-b-c ">
                <div className="card-left">
                    <p>Drivers</p>
                    <span>{drivers}</span>
                </div>
                <div className="card-right drivers f-c-c">
                    <AiOutlineBell />
                </div>
            </div>
            <div className="card f-b-c ">
                <div className="card-left">
                    <p>Cars</p>
                    <span>{cars}</span>
                </div>
                <div className="card-right cars f-c-c">
                    <AiOutlineBell />
                </div>
            </div>
            <div className="card f-b-c ">
                <div className="card-left">
                    <p>Reservations</p>
                    <span>{reservations}</span>
                </div>
                <div className="card-right reservations f-c-c">
                    <AiOutlineBell />
                </div>
            </div>
        </div>
        <div className="charts">
            <div className="line-chart">
                <div className="labels f-c-c">
                    <div className="client-label"><span></span><p>Client</p></div>
                    <span className='space'></span>
                    <div className="driver-label"><span></span><p>Driver</p></div>
                </div>
                <LineChartData />
            </div>
            <div className="doughnut-chart">
                <DoughnutChartData />
            </div>
        </div>
    </div>
  )
}

export default Dashboard