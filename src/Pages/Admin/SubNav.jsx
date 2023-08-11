import React, { useContext } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import './css/SubNav.css'
import axios from 'axios';
import { UserContext } from '../../UserContext';


export default function SubNav() {

    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();


    async function logout() {
        const confirmed = window.confirm("Are you sure you want to log out?");
        if (confirmed) {
          await axios.post('/logout');
         
          setUser(null);
          navigate('/Admin/AdminLogin');
        }
      }

      if (!user) {
        return <div className='empty'>Unauthorized</div>;
      }
    
      if (user.name !== 'admin') {
        return <div className='empty'>Unauthorized</div>;
      }

  return (
    <nav className="subnav-container">

        <div> <Link to={'/Admin/Dashboard'}>
            <button className='subnavbutton-admin'>Overview</button>
        </Link>
        </div>
        <div> <Link to={'/Admin/UserData'}>
            <button className='subnavbutton-admin'>User data</button>
        </Link>
        </div>
        <div> <Link to={'/Admin/Places'}>
            <button className='subnavbutton-admin'>Places</button>
        </Link>
        </div>
        <div> <Link to={'/Admin/Bookings'}>
            <button className='subnavbutton-admin'>Bookings</button>
        </Link>
        </div>
        <div> <Link to={'/Admin/Payments'}>
            <button className='subnavbutton-admin'>Payments</button>
        </Link>
        </div>
        <div>
            <br></br><br></br>
        <button className='subnavbutton-adminlogout' onClick={logout}>Logout</button>
        </div>
    </nav>
  );
}

