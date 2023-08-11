import axios from 'axios';
import React, { useEffect, useState,useContext } from 'react'
import { UserContext } from '../UserContext';
import { Navigate, useParams,useNavigate  } from 'react-router-dom'
import './CSS/Accommodationpage.css';
import LocationImage from './Images/location.png';

import moment from "moment";
import { differenceInCalendarDays, format } from 'date-fns';
import { number, expirationDate, cvv } from 'card-validator';


//perks
import ParkingImage from './Images/perks/parking.png';
import PetsImage from './Images/perks/pets.png';
import TvImage from './Images/perks/tv.png';
import RadioImage from './Images/perks/radio.png';
import KitchenImage from './Images/perks/kitchen.png';
import WifiImage from './Images/perks/wifi.png';
import PoolImage from './Images/perks/pool.png';



export default function Accommodationpage() {


  const { user } = useContext(UserContext);

 // const [checkIn, setcheckIn] = useState("");
 const checkIn = moment().format("YYYY-MM-DD");
 const [checkOut, setCheckOut] = useState(moment(checkIn).add(1, 'day').format("YYYY-MM-DD"));
 const [name, setName] = useState(user ? user.name : '');
 const [mobile,setMobile] = useState('');
 const [cardno,setCardno] = useState('');
 const [expirationdate ,setExpirationdate] = useState('');
 const [cvvv,setCvvv] = useState('');
 const [redirect,setRedirect] = useState('');
 const[showBookingForm,setShowBookingForm] = useState(false);
 const navigate = useNavigate();
 const [isLoading, setIsLoading] = useState(true);
 

const handleCheckOutChange = (event) => {
  const selectedCheckOutDate = event.target.value;
  if (selectedCheckOutDate > checkIn) {
    setCheckOut(selectedCheckOutDate);
  } else {
    alert("CheckOut date must be greater than Today");
  }
};


let numberOfNights = 0;
if (checkIn && checkOut) {
  numberOfNights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
}



    const{id} = useParams();
    const[place,setPlace]= useState(null);
    const[showAllPhotos,setShowAllPhotos] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [netRating, setNetRating] = useState(0);


    const [checkTillDate,setCheckTillDate]= useState('');  

    useEffect(()=>{
      if(!id){
        return;
      }
      axios.get('/Accommodationusr/'+id).then(response =>{
          const {data} = response;
          setCheckTillDate(data.checkTillDate);
         
      }); 
    },[id]);


    
    useEffect(() => {
    
    axios.get(`/api/bookings?place=${id}`)
      .then(response => {
        const bookingIds = response.data.map(booking => booking._id);
        axios.get(`/api/reviews?booking=${bookingIds.join(',')}`)
          .then(response => {
            setReviews(response.data);
          })
          .catch(error => {
            console.log(error);
          });
      })
      .catch(error => {
        console.log(error);
      });
  }, [id]);

  useEffect(() => {
    if (reviews.length > 0) {
      const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
      setNetRating(totalRating / reviews.length);
    } else {
      setNetRating(null);
    }
  }, [reviews]);




    const [showBookingButton, setShowBookingButton] = useState(false);
    


useEffect(() => {
  const tillDate = new Date(checkTillDate);
  const checkInDate = new Date(checkIn);
 
  
  if (checkInDate >= tillDate) {
    setShowBookingButton(true);
  }
}, [checkTillDate, checkIn]);





    useEffect(()=>{

        if(!id){
            return;
        }
        axios.get('/Accommodationusr/'+id).then(response=>{
            setPlace(response.data);
            setIsLoading(false);
        })

    },[id]);
    

    if (isLoading) {
      return <div>
        <div className='mainn'></div>
        <div class="container">
              <div class="loader"></div>
              </div>
              </div>
      ;
    }



 
    if(!place)return'';


  

        if(showBookingForm){
          return(
            <div className='main-bookingform' >
          <div><h1 className='Accommodation-title'>{place.title}</h1>  </div>  <br></br>
              
            <form className="bookingform" onSubmit={bookThisPlace}>
            <div className="booking-inouttot">
              <label >Check in:</label>
              <span>{checkIn}</span>
            </div>
            <div className="booking-inouttot">
              <label >Check out:</label>
              <input type="date" id="checkOutDate" value={checkOut} onChange={handleCheckOutChange} required />
            </div>

            <div>
              {numberOfNights > 0 && (
                <div>

                      <div className="booking-inouttot">
                        <label>No of Nights:</label> 
                        <span>{numberOfNights}</span>
                      </div>

                      <div className="booking-inouttot">
                      <label>Total: </label>
                            <span>{numberOfNights * place.price} LKR</span>
                      </div>

                      <div className="booking-namemo">
                        <label >Name:</label>
                        <input type="text" id="name" placeholder="" value={name} onChange={(ev) => setName(ev.target.value)} required />
                      </div>
                      <div className="booking-namemo">
                        <label >Mobile no:</label>
                        <input type="number" id="mobile" placeholder="" value={mobile} onChange={ev => setMobile(ev.target.value)} required />
                      </div>
                      <div className="booking-namemo">
                        <label >Card no:</label>
                        <input type="number" pattern="\d{4}\s?\d{4}\s?\d{4}\s?\d{4}" id="card" placeholder="" value={cardno} onChange={ev => setCardno(ev.target.value)} required />
                      </div>
                      <div className="booking-namemo">
                        <label >Expiration date (MM/YYYY):</label>
                        <input type="text"  id="expiration" placeholder="" value={expirationdate} onChange={ev => setExpirationdate(ev.target.value)} required />
                      </div>
                      <div className="booking-namemo">
                        <label >CVV:</label>
                        <input type="number" id="cvvv" placeholder="" value={cvvv} onChange={ev => setCvvv(ev.target.value)} required />
                      </div>
                </div>
              )}
            </div>
                   <button className='formbutton' type="submit">Book</button>
                   &emsp;&emsp;
                   <button className='formbutton' onClick={()=>setShowBookingForm(false)}>Close</button>
          </form>
          </div>
          );
        }



    if(showAllPhotos){
      return(
        <div className="extraphotos">
          <div className="extraphotosgrid" >
            <div style={{paddingLeft:"20px"}}>
              <button  onClick={()=> setShowAllPhotos(false)}>Close</button>
            </div>
          {place?.photos?.length > 0 && place.photos.map(photo =>(
            <div className="extraphotosImage">
              <img alt="" src={'http://localhost:4000/uploads/'+photo} className="smaller"/>
            </div>
          ))}
        </div>
        </div>
      );
    }

    
//perks
const perkImages = {
  Pets: PetsImage,
  TV: TvImage,
  Radio: RadioImage,
  Parking: ParkingImage,
  Pool: PoolImage,
  Wifi: WifiImage,
  Kitchen: KitchenImage,
};




    

    async function bookThisPlace(event) {
      event.preventDefault(); 
    
      if (!user) {
        alert("Please login to book this place.");
        return;
      }
    
      if (!checkOut || !name || !mobile || !cardno || !expirationdate || !cvvv) {
        alert("Please fill all the required fields.");
        return;
      }

          // Validate card number
      const cardNumberValidation = number(cardno);
      if (!cardNumberValidation.isPotentiallyValid || !cardNumberValidation.isValid) {
        alert("Please enter a valid card number.");
        return;
      }

      // Validate expiration date
      const expirationDateValidation = expirationDate(expirationdate);
      if (!expirationDateValidation.isPotentiallyValid || !expirationDateValidation.isValid) {
        alert("Please enter a valid expiration date.");
        return;
      }

      // Validate CVV
      const cvvValidation = cvv(cvvv);
      if (!cvvValidation.isPotentiallyValid || !cvvValidation.isValid) {
        alert("Please enter a valid CVV.");
        return;
      }


      const response = await axios.put('/Accommodationusr', {
        id: place._id,
        checkTillDate: checkOut,
      });
    
      if (response.data === 'ok') {
        const bookingResponse = await axios.post('/bookings', {
          checkIn,
          checkOut,
          name,
          mobile,
          place: place._id,
        });
        
        const bookingId = bookingResponse.data._id;

      
        const amount = numberOfNights * place.price;

      const paymentResponse = await axios.post('/payment', {
        booking: bookingId,
        user: user._id,
        amount,
      });


        navigate('/Accountdata/Bookings/' + bookingId);
      }
    }

    
    if (redirect){
      
      return <Navigate to ={redirect}/>
    }
    

 

    return (
      <div className="ap-main">
      <div  style={{ overflowX: 'hidden' }}>
      
      <div><h1 className='Accommodation-title'>{place.title}</h1> </div>  

       {/*display rating based on availability*/}

      <div className='Accommodation-rating-flexbox'>{netRating !== null ? (
          <p style={{ marginRight: '40px'}}>Rating: {netRating.toFixed(1)}</p>
        ) : (
          <p style={{ marginRight: '40px'}}>Rating: Not rated yet</p>
        )}
         <img alt="1" src={LocationImage} className="addressimage" />&nbsp;
        <a className='Accommodation-address' target="_blank" rel='noreferrer' href={'https://maps.google.com/?q='+place.address}>{place.address}</a>
        </div>

     
      <br/>


       {/*displaying photos*/}
          <div 
                className="photogrid">
                <div className="photogrid-photo1">
                  {place.photos?.[0] && (
                     <>
                     <img alt="" src={`http://localhost:4000/uploads/${place.photos[0]}`} />
                     <div className="photobutton-container">
                       <button className="photobutton" onClick={()=>setShowAllPhotos(true)}>More photos</button>
                     </div>
                   </>
                  )}
                </div>
                <div className="photogrid-photo2">
                  {place.photos?.[1] && (
                    <img alt="" src={`http://localhost:4000/uploads/${place.photos[1]}`} />
                  )}
                </div>
                <div className="photogrid-photo3">
                  {place.photos?.[2] && (
                    <img alt="" src={`http://localhost:4000/uploads/${place.photos[2]}`} />
                  )}
                </div>
                <div className="photogrid-photo4">
                  {place.photos?.[3] && (
                    <img alt="" src={`http://localhost:4000/uploads/${place.photos[3]}`} />
                  )}
                </div>
                <div className="photogrid-photo5">
                  {place.photos?.[4] && (
                    <img alt="" src={`http://localhost:4000/uploads/${place.photos[4]}`} />
                  )}
                </div>
                        
          </div>

         

          <br/>
    <div className='description-singlepage'> {place.description} </div> <br/>
       
    <div className='booking-container-single'>
      <div className='forbookingflex'>

       <div>Max Guests : {place.maxGuests}</div>  <br/>
       <div className='accommodation-features'>What this place offers</div><br/><br/>
        {place.perks.map((perk) => (
        <div key={perk} style={{ marginBottom: '3px'}}>
        <img className='perkimage' src={perkImages[perk]} alt={perk} /> &nbsp;&nbsp;
          {perk}</div>  ))} <br/>
           
       
      
      </div> 

{/*booking widget */}

            <div className='booking-fixedpart'>
               <div>{place.price} LKR per night</div>
            <br></br>
            {showBookingButton ? (

            <div><button className='bookingbutton' onClick={()=>setShowBookingForm(true)}>Book </button></div>

       ): (
        <label>Booked till : {format(new Date(checkTillDate), 'yyyy-MM-dd')}</label>
      )}
          </div>
          </div>
      
            
        <div>
      
          {reviews.length > 0 ? (
            <>
              <h2 className='Accommodation-reviews'>Reviews</h2>
              <div className="parent-container">
                {reviews.map((review) => (
                  <div className="singlereview" key={review._id}>
                    <div className="review-info">
                      <p>{review.user}</p>
                      <p>{review.rating}</p>
                    </div>
                    <div className="review-text">
                      <p>{review.review}</p>
                    </div>
                  </div>
                ))}
              </div>
              
            </>
          ) : (
            <p>No reviews</p>
          )}
        </div> 
      

    </div>
    </div>
  )
}
