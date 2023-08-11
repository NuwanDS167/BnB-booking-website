import './CSS/Accommodationusr.css'
import React, { useEffect, useState ,useContext} from 'react'
import { Link, Navigate} from 'react-router-dom'
import AccountNav from '../Components/AccountNav';
import axios from 'axios';
import { UserContext } from '../UserContext';


export default function Accommodationusr() {


  const { user } = useContext(UserContext);
  
  const [places,setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

 useEffect(()=> {
    axios.get('/places').then(({data})=>{
        setPlaces(data);
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

  return (
    
    <div className="main">
      <AccountNav/>
    
      <div className="newbutton-container">
              <div>
                <Link to="/Accountdata/Accommodationusr/new">
                  <button className="newbutton">
                    
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 18" fill="currentColor" width="16" height="16">
                  <path d="M19,11H13V5a1,1,0,0,0-2,0v6H5a1,1,0,0,0,0,2h6v6a1,1,0,0,0,2,0V13h6a1,1,0,0,0,0-2Z"/></svg>
                    
                    Add new place</button>
                </Link>
              </div>
            </div>
        <div>
          <h2 className='myplacestitle'>My places</h2>
        </div>
        
        
        
                    <div className="place-container">
              {places.length > 0 && places.map((place, index) => (
                <Link to={'/Accountdata/Accommodationusr/'+place._id} key={index} className="place-link">
                  <div>
                    {place.photos.length > 0 && (
                      <img src={`http://localhost:4000/uploads/${place.photos[0]}`} alt="" />
                    )}
                  </div>
                  <div>
                    <div className="title">{place.title}</div>
                    <div className="description">{place.description}</div>
                    <div className="address">{place.address}</div>
                  </div>
                 <button > <Link className='singlebookingbutton' to={'/Accountdata/Accommodationusr/'+place._id +'/Bookings/'} key={index}>Bookings</Link></button>
                
                </Link>
              ))}
            </div>
       
 
    </div>
  )
}
