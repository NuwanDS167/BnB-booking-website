import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../UserContext';

import SubNav from './SubNav';
import './css/Paymentdata.css';
import { format } from 'date-fns';

export default function Paymentdata() {

    const { user } = useContext(UserContext);

    const [payments, setPayments] = useState([]);


    useEffect(() => {
        axios.get('/PaymentAdmin').then(response => {
            setPayments(response.data);
         
        });
      }, []);




    if (!user) {
        return <div className='empty'>Unauthorized</div>;
      }
    
      if (user.name !== 'admin') {
        return <div className='empty'>Unauthorized</div>;
      }
    

  return (
    <div className="pageContainer-payments">
      <div>
        <SubNav />
      </div>
      <div>
      <h2>Payment data</h2>

      <div style={{paddingLeft:"80px"}}>
        {payments.length > 0 ? (
        payments.map(payment => (
            <div key={payment._id} className="payment-card-admin">
          <div className='paymentdetails-container'>
            <div className='paymentid'>{payment._id}</div>
            <div className='paymentdate'>Date: {format(new Date(payment.date), 'yyyy-MM-dd')}</div>
            <div>{payment.amount} LKR</div>
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

