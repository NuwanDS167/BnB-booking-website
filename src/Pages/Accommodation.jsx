import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import './CSS/Accommodation.css';


export default function Accommodation() {
    const [places,setPlaces]=useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [isFiltered, setIsFiltered] = useState(false);
    const [sortBy, setSortBy] = useState('Inaugural');


    useEffect(()=>{
        axios.get('/Accommodation').then(response =>{
            setPlaces(response.data);
        });
    },[]);


    const handleInputChange = (event) => {
      setSearchInput(event.target.value);
    };
  
    const handleSearchClick = () => {
      setSearchQuery(searchInput);
      setIsFiltered(false);
    };
  
    const filteredPlaces = places.filter(
      (place) =>
        place.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.address.toLowerCase().includes(searchQuery.toLowerCase())
    ).filter((place) => {
        if (!isFiltered) {
            return true;
        }
        if (minPrice && !maxPrice) {
            return place.price >= minPrice;
        }
        if (!minPrice && maxPrice) {
            return place.price <= maxPrice;
        }
        return place.price >= minPrice && place.price <= maxPrice;
    });


    const handleMinPriceChange = (event) => {
      setMinPrice(Number(event.target.value));
    };
  
    const handleMaxPriceChange = (event) => {
      setMaxPrice(Number(event.target.value));
    };
  
    const handleFilterClick = () => {
      setIsFiltered(true);
    };
  
    const handleResetFilterClick = () => {
      setMinPrice('');
      setMaxPrice('');
      setIsFiltered(false);
    };


  
    const handleSortByClick = (event) => {
      setSortBy(event.target.innerText);
    };
  
    const sortedPlaces = [...filteredPlaces].sort((a, b) => {
      if (sortBy === 'A-Z') {
        return a.title.localeCompare(b.title);
      } else if (sortBy === 'Price low to high') {
        return a.price - b.price;
      } else if (sortBy === 'Price high to low') {
        return b.price - a.price;
      } else {
        return 0;
      }
    });


    return (
      <div className="main">
        
       
        <div className="searchbox">
          <input type="text" value={searchInput} onChange={handleInputChange} />
          <button onClick={handleSearchClick}>Search</button>
          <br></br>
          <br></br>
        </div>


        <div class="filtering-sorting-container">
  <div class="filtering-container">
    <input type="number" placeholder="min price" value={minPrice} onChange={handleMinPriceChange} />
    <span> - &nbsp;</span>
    <input type="number" placeholder="max price" value={maxPrice} onChange={handleMaxPriceChange} />
    <button onClick={handleFilterClick}>Filter</button>
    {isFiltered && (
      <button onClick={handleResetFilterClick}>Reset Filter</button>
    )}
  </div>
  
  
  <div class="sorting-container">
    <span>Sort by:</span>
    <button onClick={handleSortByClick}>Inaugural</button>
    <button onClick={handleSortByClick}>A-Z</button>
    <button onClick={handleSortByClick}>Price low to high</button>
    <button onClick={handleSortByClick}>Price high to low</button>
  </div>
</div>


        <br/>
        <div className="grid">
          {sortedPlaces.length > 0 ? (
            sortedPlaces.map((place) => (
              <div onClick={() => window.scrollTo(0, 0)}>
              <Link to={`/Accommodation/${place._id}`} className="place-card" key={place._id}>
               <div className="image-container">
               {place.photos?.[0] && (
                 <img src={`http://localhost:4000/uploads/${place.photos[0]}`} alt="" className="place-image"/>
                )}
                </div>
  
                <div style={{ flex: 1 }}>
                  <div className="title">{place.title}</div>
                  <div className="address">{place.address}</div>
                  <div className="price">{place.price} LKR/night</div>
                </div>
              </Link></div>
            ))
          ) : (
            <div>No results found</div>
          )}
        </div>
      </div>
    );
}