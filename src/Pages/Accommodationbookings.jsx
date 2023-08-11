import axios from 'axios';
import { differenceInCalendarDays, format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './CSS/Accommodationbookings.css';
import AccountNav from '../Components/AccountNav';

export default function AccommodationBookings() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    
    if (!id) {
      return;
    }
    axios.get(`/Accommodationusr/${id}`).then((response) => {
      setPlace(response.data);
      
    });

    axios.get(`/BookingsSinglaplace/${id}`).then((response) => {
        setBookings(response.data);
        setIsLoading(false);
      });
    }, [id]);

  if (!place) return '';


  if (isLoading) {
    return <div>
      <div className='mainn'></div>
      <div class="container">
            <div class="loader"></div>
            </div>
            </div>
    ;
  }


  
  return (
    <div  className='acbookingspage'>
             <AccountNav/>
      <div className='accobookingtitle-container'><span className='bookings-span'>Bookings -  </span> <span className='accobooking-title'>{place.title}</span> </div>
     

      <div className="booking-container-table">
              {bookings.length > 0 ? (
          <table className="booking-table-custom" >
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>User</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Number of Nights</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {bookings
                .sort((a, b) => (new Date(a.checkOut) > new Date(b.checkOut) ? -1 : 1))
                .map((booking, index) => (
                  <tr key={index} className="booking-details-row-admin">
                    <td className="booking-id-admin">{booking._id}</td>
                    <td className="booking-client-admin">{booking.user.name}</td>
                    <td className="booking-dates">
                      {format(new Date(booking.checkIn), "yyyy-MM-dd")}
                    </td>
                    <td className="booking-dates">
                      {format(new Date(booking.checkOut), "yyyy-MM-dd")}
                    </td>
                    <td className="booking-nights-admin">
                      {differenceInCalendarDays(
                        new Date(booking.checkOut),
                        new Date(booking.checkIn)
                      )}
                    </td>
                    <td
                      className={`booking-status-admin ${
                        new Date(booking.checkOut) > new Date() ? "active" : "inactive"
                      }`}
                    >
                      {new Date(booking.checkOut) > new Date() ? "Active" : "Inactive"}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        ) : (
          <div className="no-bookings-message">No bookings available</div>
        )}
</div>

    </div>
  );
}