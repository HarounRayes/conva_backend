import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Pagination } from '../../components/Pagination';


const Page = () => {

    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [showpagination, setShowpagination] = useState(false);


    useEffect(() => {
        axios.get(`${process.env.REACT_APP_SERVER_END_POINT}/admin/all/users?page=${currentPage}`).then((res) => {
            const usersList = res.data.users;
            setPages(parseInt(res.data.pages));
            setShowpagination(true);
            usersList.forEach(element => {
                setUsers((list) => [...list, element]); 
            });
        });

        return () => {
            setUsers([]);
        }

    }, [currentPage]);


  return (
    <div className='users'>
        <div className="top">
            <h2>Users</h2>
        </div>
        <br />
        <table>
            <thead width="100%">
                <th width="80">ID</th>
                <th width="140">Name</th>
                <th width="140">Email</th>
                <th width="140">Phone</th>
                <th width="100">Join Date</th>
                <th width="60">Bonus</th>
                <th width="60">Status</th>
                <th width="120">Actions</th>
            </thead>
            <tbody>
                {users.map((item, index) => {
                    return (<tr>
                        <td>R-{item.id}</td>
                        <td>{item.name}</td>
                        <td>{item.email}</td>
                        <td>0{item.phone}</td>
                        <td>{item.created_at.split('T')[0]}</td>
                        <td>{item.bonus}</td>
                        <td>{item.status}</td>
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