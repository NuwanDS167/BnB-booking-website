import React, { useState } from "react";
import './Footer.css'
import axios from "axios";


export default function Footer(){

    const [email,setEmail] = useState('');



    async function SubscribeSubscribe(ev){
        ev.preventDefault();
 
        if (!email ) {
          alert('Please enter a email');
          return;
        }
        
        try{
        await axios.post('/sub',{       
          email,     
      });
          alert('Subscription successful');
          setEmail('');
      }catch(e){
        alert('Already subscribed')
      }
    }



    return(
        <div className="main-footer">
            <div className="content-wrap">
                <div className="row">
                    <p>Subscribe and we'll send the best deals to you</p>
                    <form onSubmit={SubscribeSubscribe}>
                    <input type="email" className="footerinput"
                            value={email} 
                            onChange={ev => setEmail(ev.target.value)}/>

                            <button className="footerbutton">Subscribe</button>
                    </form>
                    <hr/>
                    <p className="com-s">
                        &copy;2023 BnB Base | All rights reserved |<a className="link" href="/Terms" > Terms of Services</a> | <a className="link" href="/Privacy"> Privacy Policy</a>
                    </p>
                    <div><hr/></div>
                </div>
            </div>
        </div>
    )
}
