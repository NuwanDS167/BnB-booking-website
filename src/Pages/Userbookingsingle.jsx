import axios from 'axios';
import React, { useEffect, useState} from 'react'
import {  Navigate, useParams  } from 'react-router-dom'
import './CSS/Userbookingsingle.css';
import LocationImage from './Images/location.png';


export default function Userbookingsingle() {

  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [review,setReview] = useState('');
  const [rating,setRating] = useState('');
  const [placeId, setPlaceId] = useState('');
  const [reviewed, setReviewed] = useState(false);
  const [loading, setLoading] = useState(true);

  const [redirect, setRedirect] = useState(false);


  


  useEffect(() => {
    async function fetchBooking() {
      try {
        const response = await axios.get(`/Bookings/${id}`);
        setPlaceId(response.data.place._id);
        setBooking(response.data);
        setLoading(false);
      } catch (err) {
        throw err;    
      }
    }
    fetchBooking();
  }, [id]);

  
 
  function isInteger(value) {
    return /^\d+$/.test(value);
  }
  
  
  async function RateThisPlace() {
    if (rating < 1 || rating > 5) {
      alert('Invalid rating value! Please enter a number between 1 to 5');
      return;
    } else if (!isInteger(rating)) {
      alert('Rating must a whole number');
      return;
    } else {
      try {
        await axios.post('/reviews', {
          booking: booking._id,
          place: placeId,
          user: booking.user,
          review,
          rating,
        });
        alert('Review submitted successfully');
        setRedirect(true);
      } catch (err) {
        console.error(err);
        alert('Error submitting review');
      }
    }
  }

  

  useEffect(() => {
    let timeout;
    if (reviewed) {
      timeout = setTimeout(() => {
        setReview('');
        setRating('');
      }, 5000);
    }
    return () => clearTimeout(timeout);
  }, [reviewed]);


  useEffect(() => {
    async function checkReviewed() {
      const reviewResponse = await axios.get(`/reviews?booking=${id}`);
      if (reviewResponse.data.length > 0) {
        setReviewed(true);
      }
    }
    checkReviewed();
  }, [id]);

  
  if (loading) {
    return <div>
      <div className='mainn'></div>
      <div class="container">
            <div class="loader"></div>
            </div>
            </div>
    ;
  }

  
  if (redirect){
    return <Navigate to={`/Accountdata/Bookings`}/>;
  }
  console.log(rating)
  

  return (
    <div className="fullpage">
      <div>
        <h1>Booking Details</h1>
          <div className='singlebooking-title-address'>
            <div className='singlebooking-title'> {booking.place.title}</div>
            <div className='singlebooking-address'><img alt="1" src={LocationImage} className="singlebooking-addressimage" />&nbsp;{booking.place.address}</div>
          </div>
        {/*displaying photos*/}
        <div 
                className="photogrid">
                <div className="photogrid-photo1">
                  {booking.place.photos?.[0] && (
                    <img alt="" src={`http://localhost:4000/uploads/${booking.place.photos[0]}`} />
                  )}
                </div>
                <div className="photogrid-photo2">
                  {booking.place.photos?.[1] && (
                    <img alt="" src={`http://localhost:4000/uploads/${booking.place.photos[1]}`} />
                  )}
                </div>
                <div className="photogrid-photo3">
                  {booking.place.photos?.[2] && (
                    <img alt="" src={`http://localhost:4000/uploads/${booking.place.photos[2]}`} />
                  )}
                </div>
                      
                <div className="photogrid-photo4">
                  {booking.place.photos?.[3] && (
                    <img alt="" src={`http://localhost:4000/uploads/${booking.place.photos[3]}`} />
                  )}
                </div>
                <div className="photogrid-photo5">
                  {booking.place.photos?.[4] && (
                    <img alt="" src={`http://localhost:4000/uploads/${booking.place.photos[4]}`} />
                  )}
                </div>
          </div>


        <div className='singlebooking-detail'> 
            <div className='singlebooking-detail-label'>Check-in date:</div> <div>{new Date(booking.checkIn).toLocaleDateString()}</div>
        </div>
        <div className='singlebooking-detail'>
            <div className='singlebooking-detail-label'>Check-out date: </div><div>{new Date(booking.checkOut).toLocaleDateString()}</div>
        </div>
        <div className='singlebooking-detail'>
            <div className='singlebooking-detail-label'>Name:</div> <div>{booking.name}</div>
        </div>
        <div className='singlebooking-detail'>
            <div className='singlebooking-detail-label'>Mobile:</div> <div>{booking.mobile}</div>
        </div>
      </div>


      {!reviewed && (
        <form className="review" onSubmit={RateThisPlace}>
          <div>
            <div className="review-field-r">
              <span>Review </span>
              <textarea className='review-textarea' placeholder="" value={review} onChange={(ev) => setReview(ev.target.value)} />
            </div>

            <div className="review-field">
              <span>Rating </span>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <input
                    type="radio"
                    id={`star${star}`}
                    name="rating"
                    value={star}
                    className="star"
                    checked={rating === star}
                    onChange={() => setRating(star)}
                  />
                ))}
                {[1, 2, 3, 4, 5].map((star) => (
                  <label htmlFor={`star${star}`} className={rating >= star ? 'selected' : ''}></label>
                ))}
              </div>
            </div>

            <div>
              <button className='button' type="submit">Rate this place</button>
            </div>
          </div>
        </form>
      )}

      {reviewed && (
        <div style={{paddingTop:'20px'}}>
          You already reviewed this place.
        </div>
      )}
    </div>
  );
}