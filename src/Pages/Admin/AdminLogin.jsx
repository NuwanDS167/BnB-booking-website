import axios  from 'axios';
import React, { useContext } from 'react'
import {Link} from "react-router-dom";
import {useState} from "react";
import {Navigate } from "react-router-dom";
import { UserContext} from '../../UserContext';
import './css/login.css';


export default function AdminLogin() { 

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  
  const {setUser} = useContext(UserContext);
  
  async function handleLoginSubmit(ev){
    ev.preventDefault();

    if (email !== 'admin@gmail.com') {
      alert('Incorrect email');
      return;
    }

    try{
      const userInfo = await axios.post('/login', {email,password});
      if (userInfo.data.user) {
        setUser(userInfo.data.user);
        alert('Login Successful');
        setRedirect(true);
      } else if (userInfo.data === 'incorrect password') {
        alert('Incorrect password');
      } else {
        alert('User not found');
      }
    }
    catch(e){
      alert('Login failed');
    }
  }
  

    if (redirect){
    return <Navigate to={'/Admin/Dashboard'}/>;
  }


  return (
   
    <div className="login-main"> 
    
    <h1>Admin Login</h1>
    <form className="loginform" onSubmit={handleLoginSubmit}>
   
      <div>
        Email <br></br><input type="email" placeholder='mail@email.com' className="input-field"
           value={email} 
           onChange={ev => setEmail(ev.target.value)}/>
      </div><br></br>
      <div>
        Password  <br></br><input type='Password' placeholder='password' className="input-field"
           value={password} 
           onChange={ev => setPassword(ev.target.value)} />
      </div><br></br>
        <button className="button">Login</button>
      
    
    </form>
    
    </div>

  )
}
