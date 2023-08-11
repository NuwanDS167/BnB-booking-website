import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../../UserContext';

import SubNav from './SubNav';
import './css/Placesdata.css';

export default function Placesdata() {
  const { user } = useContext(UserContext);

  const [places, setPlaces] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [originalPlaces, setOriginalPlaces] = useState([]);

  useEffect(() => {
    axios.get('/Accommodation').then(response => {
      setPlaces(response.data);
      setOriginalPlaces(response.data);
    });
  }, []);

  const handleInputChange = event => {
    setSearchInput(event.target.value);
  };

  const handleSearchClick = () => {
    if (searchInput.trim() === '') {
      // If search input is empty, display all places
      setPlaces(originalPlaces);
    } else {
      // Filter places based on the search input
      const filteredPlaces = originalPlaces.filter(
        place =>
          place.title.toLowerCase().includes(searchInput.toLowerCase()) ||
          place.address.toLowerCase().includes(searchInput.toLowerCase())
      );
      setPlaces(filteredPlaces);
    }
  };

  if (!user) {
    return <div className='empty'>Unauthorized</div>;
  }

  if (user.name !== 'admin') {
    return <div className='empty'>Unauthorized</div>;
  }

  return (
    <div className="pageContainer-places">
      <div>
        <SubNav />
      </div>

      <div>
        <div><h2>Places</h2></div>

        <div className="searchbox-admin-placedata">
          <input type="text" value={searchInput} onChange={handleInputChange} />
          <button onClick={handleSearchClick}>Search</button>
          <br />
          <br />
        </div>

        <div className="placegrid-admin">
          {places.length > 0 ? (
            places.map(place => (
              <div className="place-card-admin" key={place._id}>
                <div>
                  <div className="placecontainer-1">
                    <div className="placeid-admin">{place._id}</div>
                    <div className="placetitle-admin">{place.title}</div>
                  </div>
                  <br />
                  <div className="placecontainer-2">
                    <div className="address-admin">{place.address}</div>
                    <div className="price-admin">{place.price} LKR/night</div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div>No results found</div>
          )}
        </div>
      </div>
    </div>
  );
}
