import './CSS/Accountdata.css'
import React, { useContext, useState } from "react";
import { UserContext } from '../UserContext';
import { Navigate, useParams } from "react-router-dom";
import axios from 'axios';
import Accommodationusr from './Accommodationusr';
import AccountNav from '../Components/AccountNav';

export default function Account() {
  
    const [redirect,setRedirect] = useState(null);
    const {ready,user,setUser}= useContext(UserContext);

 const {subpage}= useParams();
    console.log(subpage);
    
    async function logout(){
      const confirmed = window.confirm("Are you sure you want to log out?");
      if (confirmed) {
        await axios.post('/logout');
        setRedirect('/');
        setUser(null);
      }
    }

    if(!ready){
      return 'loading';
    }


    if(ready && !user && !redirect){
        return <Navigate to={'/Login'}/>

    }

   if (redirect){
    return <Navigate to={redirect}/>
   }

  return (
    <div className="main">
      <AccountNav/>
      
        {subpage === undefined && (
            <div className="logtext">
              Logged in as {user.name}<br></br><br></br>
              <button onClick={logout}>Logout</button>

            </div>

        )}
          {subpage === 'Accommodationusr' && (

              <Accommodationusr/>

          )}


    </div>
  );

}

