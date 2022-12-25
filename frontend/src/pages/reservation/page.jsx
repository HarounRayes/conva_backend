import React, { useEffect, useState } from 'react'
import { BiMap } from 'react-icons/bi';
import axios from 'axios';
import { Pagination } from '../../components/Pagination';


const Page = () => {

    const [reservations, setReservations] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [showpagination, setShowpagination] = useState(false);


    useEffect(() => {
        axios.get(`${process.env.REACT_APP_SERVER_END_POINT}/admin/all/reservations?page=${currentPage}`).then((res) => {
            const reservationsList = res.data.reservations;
            setPages(parseInt(res.data.pages));
            setShowpagination(true);
            reservationsList.forEach(element => {
                setReservations((list) => [...list, element]); 
            });
        });

        return () => {
            setReservations([]);
        }

    }, [currentPage]);


  return (
    <div className='reservations'>
        <div className="top">
            <h2>Reservations</h2>
        </div>
        <br />
        <table>
            <thead width="100%">
                <th width="80">ID</th>
                <th width="140">Start Wilaya</th>
                <th width="140">Arrive Wilaya</th>
                <th width="100">Start Date</th>
                <th width="80">Start Time</th>
                <th width="60">Places</th>
                <th width="60">Price</th>
                <th width="60">Driver</th>
                <th width="90">Orginal</th>
                <th width="80">Destination</th>
                <th width="60">Status</th>
                <th width="120">Actions</th>
            </thead>
            <tbody>
                {reservations.map((item, index) => {
                    return (<tr>
                        <td>R-{item.id}</td>
                        <td>
                            <div className="colmun">
                                <p>{item.s_name}</p>
                                <span>{item.s_city_place}</span>
                            </div>
                        </td>
                        <td>
                            <div className="colmun">
                                <p>{item.e_name}</p>
                                <span>{item.e_city_place}</span>
                            </div>
                        </td>
                        <td>{item.start_date.split('T')[0]}</td>
                        <td>{item.start_time}</td>
                        <td>{item.place_numbers}</td>
                        <td>{item.price} DA</td>
                        <td>{item.user_name}</td>
                        <td><BiMap size={20} /></td>
                        <td><BiMap size={20} /></td>
                        <td>{item.r_status}</td>
                        <td>Nothing Now</td>
                    </tr>);
                })}
            </tbody>
        </table>
        <br />

        {(showpagination&&pages>1)&&<Pagination currentPage={currentPage} pages={pages} SetCurrentPage={setCurrentPage} />}

    </div>
  );
}
export default Page;