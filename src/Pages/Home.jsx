import React, { useState, useEffect, useRef } from 'react';
import './CSS/Home.css';
import MainImage from './Images/homepage.png';
import { Link } from 'react-router-dom';
import axios from 'axios';



export default function Home() {
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    axios.get('/Accommodation').then((response) => {
      const sortedPlaces = response.data.sort((a, b) => b.price - a.price);
      setPlaces(sortedPlaces);
      setIsLoading(false);
    });
  }, []);


// functions for left and right slider buttons

  const carouselSlidesRef = useRef(null);
  const carouselButtonLeftRef = useRef(null);
  const carouselButtonRightRef = useRef(null);

  useEffect(() => {
    const carouselSlides = carouselSlidesRef.current;
    const carouselButtonLeft = carouselButtonLeftRef.current;
    const carouselButtonRight = carouselButtonRightRef.current;

    const handleLeftButtonClick = () => {
      carouselSlides.scrollBy({
        left: -carouselSlides.offsetWidth,
        behavior: 'smooth',
      });
    };

    const handleRightButtonClick = () => {
      carouselSlides.scrollBy({
        left: carouselSlides.offsetWidth,
        behavior: 'smooth',
      });
    };

    carouselButtonLeft.addEventListener('click', handleLeftButtonClick);
    carouselButtonRight.addEventListener('click', handleRightButtonClick);

    return () => {
      carouselButtonLeft.removeEventListener('click', handleLeftButtonClick);
      carouselButtonRight.removeEventListener('click', handleRightButtonClick);
    };
  }, []);


  
// if (isLoading) {
//     return <div>
//       <div className='mainn'></div>
//       <div class="container">
//             <div class="loader"></div>
//             </div>
//             </div>
//     ;
//   }


  return (
    <div>
      <div className="homeimagecontainer">
        <img alt="1" src={MainImage} className="mainimage" />
        <span className="homeimagetext">
          Not sure where to stay ?<br /> Explore our accommodations<br />
          <a className="link" href="/Accommodation">
            <button className='homebutton'>Browse</button>
          </a>
        </span>
      </div>

      <div>
        <h2 className='h2featured'>Featured places</h2>
      </div>

      <div className="carousel-container">
        
        <button className="carousel-button carousel-button-left" ref={carouselButtonLeftRef}>
          &lt;
        </button>

        <ul className="carousel-slides" ref={carouselSlidesRef}>
          {places.length > 0 &&
            places.slice(0,6).map((place) => (
              <li className="place-card-home" key={place._id}>
               
                <Link to={`/Accommodation/${place._id}`} className="place-card-link">
                  <div className="image-container-home">
                    {place.photos?.[0] && (
                      <img
                        src={`http://localhost:4000/uploads/${place.photos[0]}`}
                        alt=""
                        className="place-image-home"
                      />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="title-home">{place.title}</div>
                    <div className="address-home">{place.address}</div>
                  </div>
                </Link>

              </li>
            ))}
        </ul>

        <button className="carousel-button carousel-button-right" ref={carouselButtonRightRef}>
          &gt;
        </button>

      </div>
    </div>
  );
}
