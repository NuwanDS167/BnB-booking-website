import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../UserContext';

import SubNav from './SubNav';
import './css/Userdata.css';

export default function Userdata() {
  const { user } = useContext(UserContext);

  const [users, setUsers] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [originalUsers, setOriginalUsers] = useState([]);

  useEffect(() => {
    axios.get('/UsersAdmin').then(response => {
      setUsers(response.data);
      setOriginalUsers(response.data);
    });
  }, []);

  const handleInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleSearchClick = () => {
    if (searchInput.trim() === '') {
      // If search input is empty, display all users
      setUsers(originalUsers);
    } else {
      // Filter users based on the search input
      const filteredUsers = originalUsers.filter(user =>
        user.name.toLowerCase().includes(searchInput.toLowerCase())
      );
      setUsers(filteredUsers);
    }
  };

  if (!user || user.name !== 'admin') {
    return <div className='empty'>Unauthorized</div>;
  }

  return (
    <div className='pageContainer-userdata'>
      <div>
        <SubNav />
      </div>
      <div>
        <div><h2>User data</h2></div>

        <div className="searchbox-admin-userdata">
          <input type="text" value={searchInput} onChange={handleInputChange} />
          <button onClick={handleSearchClick}>Search</button>
          <br />
          <br />
        </div>

        <div className="usergrid">
          {users.length > 0 ? (
            users.map(user => {
              if (user.name === 'admin') {
                return null; // Skip displaying the user named "admin"
              }

              return (
                <div className='user-card-admin'>
                  <div className='usercard'>
                      <div className='userid'>{user._id}</div>
                      <div className='username'>{user.name}</div>             
                      <div className='useremail'>{user.email}</div>
                  </div>
                </div>
              );
            })
          ) : (
            <div>No results found</div>
          )}
        </div>
      </div>
    </div>
  );
}