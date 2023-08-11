import './CSS/Userbooking.css'
import React, { useEffect, useState, useContext} from 'react';
import AccountNav from "../Components/AccountNav";
import axios from 'axios';
import { Link, Navigate } from 'react-router-dom';
import { differenceInCalendarDays, format } from 'date-fns';
import { UserContext } from '../UserContext';

export default function Userbooking() {

  const { user } = useContext(UserContext);

  
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(()=>{

    axios.get('/bookings').then(response=>{
      setBookings(response.data);
      setIsLoading(false);
    });
  },[]);
  
  
  if (isLoading) {
    return <div>
      <div className='mainn'></div>
      <div class="container">
            <div class="loader"></div>
            </div>
            </div>
    ;
  }


  if (!user) {
    return <Navigate to="/Login" />;
  }
  console.log('User:', user);

    
  return (
    <div className="main">
      <div>
        <AccountNav />
      </div>
  
      <div className="booking-container">
  {bookings?.length > 0 ? (
    bookings.map((booking, index) => (
      <Link to={`/Accountdata/Bookings/${booking._id}`} key={index} className="booking-link">
        <div className="booking-image-container">
          {booking.place.photos.length > 0 && (
            <img src={`http://localhost:4000/uploads/${booking.place.photos[0]}`} alt="" className="booking-image" />
          )}
        </div>
        <div className="booking-details-container">
          <div className="booking-title">{booking.place.title}</div>
          <div className="booking-address">{booking.place.address}</div>
          <div className="booking-dates"> {format(new Date(booking.checkIn), 'yyyy-MM-dd')} to {format(new Date(booking.checkOut), 'yyyy-MM-dd')}</div>
          <div className="booking-nights">Number of nights: {differenceInCalendarDays(new Date(booking.checkOut), new Date(booking.checkIn))}</div>
        </div>
      </Link>
    ))
  ) : (
    <div className="no-bookings-message">No bookings available</div>
  )}
</div>
  
    </div>
  );
}

