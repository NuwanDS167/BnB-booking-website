import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../../UserContext';

import SubNav from './SubNav';
import './css/Bookingdata.css';
import { differenceInCalendarDays, format } from 'date-fns';

export default function Bookingdata() {
  const { user } = useContext(UserContext);

  const [bookings, setBookings] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [originalBookings, setOriginalBookings] = useState([]);

  useEffect(() => {
    axios.get('/BookingsAdmin').then(response => {
      setBookings(response.data);
      setOriginalBookings(response.data);
    });
  }, []);

  const handleInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleSearchClick = () => {
    if (searchInput.trim() === '') {
      // If search input is empty, display all bookings
      setBookings(originalBookings);
    } else {
      // Filter bookings based on the search input
      const filteredBookings = originalBookings.filter(booking =>
        booking.place.title.toLowerCase().includes(searchInput.toLowerCase()) ||
        booking.place.address.toLowerCase().includes(searchInput.toLowerCase())
      );
      setBookings(filteredBookings);
    }
  };

  if (!user || user.name !== 'admin') {
    return <div className='empty'>Unauthorized</div>;
  }

  return (
    <div className='pageContainer-booking'>
      <div>
        <SubNav />
      </div>
      <div>
        <div><h2>Bookings</h2></div>

        <div className="searchbox-admin-bookingdata">
          <input type="text" value={searchInput} onChange={handleInputChange} />
          <button onClick={handleSearchClick}>Search</button>
          <br />
          <br />
        </div>

        <div className="booking-container-admin">
          {bookings.length > 0 ? (
            bookings.map((booking, index) => (
              <div key={index} className="booking-details-container-admin">
                <div>
                  <div className='booking-admin-container1'>
                    <div className="booking-id-admin">{booking._id}</div>
                    <div className="booking-title-admin">{booking.place.title}</div>
                  </div>
                  <div className="booking-address-admin">{booking.place.address}</div>
                  <div className='booking-admin-container1'>
                    <div className="booking-dates-admin"> Check In : {format(new Date(booking.checkIn), 'yyyy-MM-dd')}</div>
                    <div className="booking-dates-admin">Check Out : {format(new Date(booking.checkOut), 'yyyy-MM-dd')}</div>
                    <div className="booking-nights-admin">Number of nights: {differenceInCalendarDays(new Date(booking.checkOut), new Date(booking.checkIn))}</div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-bookings-message">No bookings available</div>
          )}
        </div>
      </div>
    </div>
  );
}