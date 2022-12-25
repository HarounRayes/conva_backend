import React from 'react'
import {MdOutlineDashboard, MdPeopleOutline, MdOutlineMoreVert} from 'react-icons/md';
import {RiReservedLine} from 'react-icons/ri';
import {AiOutlineCar} from 'react-icons/ai';
import {HiOutlineDocumentDuplicate} from 'react-icons/hi';
import { Link } from 'react-router-dom';

export const Slider = (props) => {
  return (
    <div className='slider f-c j-c-s-b'>
        <div className="top">
            <div className="role">
                <h3>Manage.</h3>
                <span>HR Management.</span>
            </div>
            <div className="nav">
                <span className='menu-title'>Main Menu</span>
                <ul>
                    <li className={props.index === 0 ? 'f-n-c active': 'f-n-c'}><Link to="/"><MdOutlineDashboard size={18} /><span className='ml2'>Dashboard</span></Link></li>
                    <li className={props.index === 1 ? 'f-n-c active': 'f-n-c'}><Link to="/users"><MdPeopleOutline size={18} /><span className='ml2'>Users</span></Link></li>
                    <li className={props.index === 2 ? 'f-n-c active': 'f-n-c'}><Link to="/drivers"><MdPeopleOutline size={18} /><span className='ml2'>Drivers</span></Link></li>
                    <li className={props.index === 3 ? 'f-n-c active': 'f-n-c'}><Link to="/cars"><AiOutlineCar size={18} /><span className='ml2'>Cars</span></Link></li>
                    <li className={props.index === 4 ? 'f-n-c active': 'f-n-c'}><Link to="/reservations"><RiReservedLine size={18} /><span className='ml2'>Reservations</span></Link></li>
                    <li className={props.index === 5 ? 'f-n-c active': 'f-n-c'}><HiOutlineDocumentDuplicate size={18} /><span className='ml2'>Documents</span></li>
                    <li className={props.index === 6 ? 'f-n-c active': 'f-n-c'}><MdOutlineMoreVert size={18} /><span className='ml2'>Others</span></li>
                </ul>
            </div>
        </div>
        <div className="bottom">
            <div className="background">
                <h3>Change Password?</h3>
                <span>click here to change your password</span>
                <button>Logout</button>
            </div>
        </div>
    </div>
  );
}

export default Slider;
