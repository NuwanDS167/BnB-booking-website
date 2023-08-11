import React, { useContext, useState } from "react";
import baselogo from '../Components/logo.png';
import './Navbar.css';
import {Link} from "react-router-dom";
import {UserContext} from '../UserContext';
import userlogo from '../Components/user.png';



export default function Navbar() {
  const {user} = useContext(UserContext);


  return (
    <nav className="nav">
      
       <p><Link className="link" to={'/'}><img className="image" src={baselogo}  alt="1"></img></Link></p>
       <div>
        <ul className="navlist">
            
            
           <Link className="link" to={'/Accommodation'}><button>Accomodation</button></Link>
           <Link className="link" to={'/About'} ><button>About Us</button></Link>
           <Link className="link" to={user?"/Accountdata":"/Login"}>
            <button className="logindata">
            
            <img className="imagelogo" src={userlogo}  alt="1"></img>
                {!!user && (
               <span className="name">
              {user.name}
               </span>
              )}

            </button>
          </Link>
         </ul>
          </div>


      

      </nav>
    );
  };
