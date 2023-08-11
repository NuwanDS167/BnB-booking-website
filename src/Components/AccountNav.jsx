import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './AccountNav.css';

export default function AccountNav() {
  const location = useLocation();

  return (
    <nav className="subNav">
      <Link to={'/Accountdata'}>
        <button className={`navButton ${location.pathname === '/Accountdata' ? 'active' : ''}`}>
          My profile
        </button>
      </Link>
      <Link to={'/Accountdata/Bookings'}>
        <button className={`navButton ${location.pathname === '/Accountdata/Bookings' ? 'active' : ''}`}>
          My Bookings
        </button>
      </Link>
      <Link to={'/Accountdata/Accommodationusr'}>
        <button className={`navButton ${location.pathname === '/Accountdata/Accommodationusr' ? 'active' : ''}`}>
          My Places
        </button>
      </Link>
    </nav>
  );
}
