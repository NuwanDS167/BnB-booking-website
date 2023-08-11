import React from 'react'
import {Link, Navigate} from "react-router-dom";
import {useState} from "react";
import axios from 'axios';

import './CSS/Login.css';

export default function Register() {

  const [name,setName] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  
  
    async function registerUser(ev){
    ev.preventDefault();

    if (name === 'admin') {
      alert('Sorry, "admin" is not an allowed username.');
      return;
    }


    if (!name || !email || !password) {
      alert('Please fill in all fields');
      return;
    }
    
    try{
    await axios.post('/reg',{
      name,
      email,
      password,
    
  });
      alert('Registration successful');
      setRedirect(true);
  }catch(e){
    alert('Registration failed')
  }
}


if (redirect){
  return <Navigate to={'/Login'}/>;
}


  return (
    <div className="login-main">
        <h1>Register</h1>

<form className="loginform" onSubmit={registerUser}>

    <div>
      Username <br></br>
      <input type="text" placeholder='username'  className="input-field"
      value={name} 
      onChange={ev => setName(ev.target.value)}/>
    </div> <br></br>
    <div>    
      Email address <br></br>
      <input type="email" placeholder='mail@email.com' className="input-field"
      value={email} 
      onChange={ev => setEmail(ev.target.value)}/>
    </div> <br></br>
    <div> 
      Password  <br></br>
      <input type='Password' placeholder='password' className="input-field"
      value={password} 
      onChange={ev => setPassword(ev.target.value)}/>
    </div>   <br></br>
      <button className="button">Sign up</button>
    <div><br></br>
      Already have an account?&emsp; <Link to={'/Login'}>Log in</Link>
    </div>
    </form>
    </div>
  )
}
