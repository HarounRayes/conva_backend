import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Pagination } from '../../components/Pagination';


const Page = () => {

    const [cars, setCars] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [showpagination, setShowpagination] = useState(false);


    useEffect(() => {
        axios.get(`${process.env.REACT_APP_SERVER_END_POINT}/admin/all/cars?page=${currentPage}`).then((res) => {
            const carsList = res.data.cars;
            setPages(parseInt(res.data.pages));
            setShowpagination(true);
            carsList.forEach(element => {
                setCars((list) => [...list, element]); 
            });
        });

        return () => {
            setCars([]);
        }

    }, [currentPage]);


  return (
    <div className='cars'>
        <div className="top">
            <h2>Cars</h2>
        </div>
        <br />
        <table>
            <thead width="100%">
                <th width="80">ID</th>
                <th width="140">Driver name</th>
                <th width="140">Car name</th>
                <th width="140">Capacity</th>
                <th width="140">Registeration</th>
                <th width="60">doc 1</th>
                <th width="60">doc 2</th>
                <th width="60">Approved at</th>
                <th width="120">Actions</th>
            </thead>
            <tbody>
                {cars.map((item, index) => {
                    return (<tr>
                        <td>C-{item.id}</td>
                        <td>{item.name}</td>
                        <td>{item.car_name}</td>
                        <td>{item.car_capacity}</td>
                        <td>{item.registration_number}</td>
                        <td>----</td>
                        <td>----</td>
                        <td>{item.approved_at.split('T')[0]}</td>
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