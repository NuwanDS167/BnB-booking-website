import axios from 'axios';
import React, { useContext, useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../UserContext';

import SubNav from './SubNav';
import './css/Dashboard.css';
import { Chart } from 'chart.js/auto';

export default function Dashboard() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [places, setPlaces] = useState([]);
  const [activeBookingCount, setActiveBookingCount] = useState(0);

  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    axios.get('/UsersAdmin').then(response => {
      setUsers(response.data);
    });
  }, []);

  useEffect(() => {
    axios.get('/BookingsAdmin').then(response => {
      setBookings(response.data);
    });
  }, []);

  useEffect(() => {
    axios.get('/Accommodation').then(response => {
      setPlaces(response.data);
    });
  }, []);



  // active booking count
  useEffect(() => {
    const today = new Date();
    const count = bookings.reduce((total, booking) => {
      const checkOutDate = new Date(booking.checkOut);
      if (checkOutDate > today) {
        return total + 1;
      }
      return total;
    }, 0);
    setActiveBookingCount(count);
  }, [bookings]);




  // daily booking graph

  useEffect(() => {
    const prepareGraphData = () => {
      // Get the earliest and latest booking dates
      const minDate = new Date(Math.min(...bookings.map(booking => new Date(booking.checkIn))));
      const maxDate = new Date(Math.max(...bookings.map(booking => new Date(booking.checkIn))));

      // Generate an array of dates within the range
      const dates = [];
      let currentDate = new Date(minDate);
      while (currentDate <= maxDate) {
        dates.push(currentDate.toDateString());
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Count the number of bookings for each date
      const bookingCounts = bookings.reduce((counts, booking) => {
        const checkInDate = new Date(booking.checkIn).toDateString();
        counts[checkInDate] = (counts[checkInDate] || 0) + 1;
        return counts;
      }, {});

      // Assign a count of 0 to dates without bookings
      dates.forEach(date => {
        if (!(date in bookingCounts)) {
          bookingCounts[date] = 0;
        }
      });

      const counts = dates.map(date => bookingCounts[date]);

      return { dates, counts };
    };

    const { dates, counts } = prepareGraphData();

    if (chartRef.current) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      chartInstanceRef.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: dates,
          datasets: [
            {
              label: 'Number of Bookings',
              data: counts,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {  responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              precision: 0,
            },
          },
        },
      });
    }
  }, [bookings]);



// total booking graph

const chartRefTotalBookings = useRef(null);
const chartInstanceRefTotalBookings = useRef(null);

// ...

useEffect(() => {
  const prepareTotalBookingsData = () => {
    // Get the earliest and latest booking dates
    const minDate = new Date(Math.min(...bookings.map(booking => new Date(booking.checkIn))));
    const maxDate = new Date(Math.max(...bookings.map(booking => new Date(booking.checkIn))));

    // Generate an array of dates within the range
    const dates = [];
    let currentDate = new Date(minDate);
    while (currentDate <= maxDate) {
      dates.push(currentDate.toDateString());
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Calculate the cumulative total of bookings for each date
    const totalBookingsCounts = {};
    let cumulativeTotal = 0;
    bookings.forEach(booking => {
      const checkInDate = new Date(booking.checkIn).toDateString();
      cumulativeTotal += 1;
      totalBookingsCounts[checkInDate] = cumulativeTotal;
    });

    // Assign the previous cumulative total to dates without bookings
    let previousTotal = 0;
    dates.forEach(date => {
      if (date in totalBookingsCounts) {
        previousTotal = totalBookingsCounts[date];
      } else {
        totalBookingsCounts[date] = previousTotal;
      }
    });

    const counts = dates.map(date => totalBookingsCounts[date]);

    return { dates, counts };
  };

  const { dates, counts } = prepareTotalBookingsData();

  const chartRefTotalBookings = document.getElementById('totalBookingsGraph');

  if (chartRefTotalBookings) {
    if (chartInstanceRefTotalBookings.current) {
      chartInstanceRefTotalBookings.current.destroy();
    }

    const ctx = chartRefTotalBookings.getContext('2d');
    chartInstanceRefTotalBookings.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [
          {
            label: 'Total Bookings',
            data: counts,
            backgroundColor: 'rgba(10, 255, 10, 0.2)',
            borderColor: 'rgba(10, 255, 10, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {  responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            precision: 0,
          },
        },
      },
    });
  }
}, [bookings]);



  if (!user) {
    return <div className='empty'>Unauthorized</div>;
  }

  if (user.name !== 'admin') {
    return <div className='empty'>Unauthorized</div>;
  }

  return (
    <div className='pageContainer-dashboard'>
      <div>
        <SubNav />
      </div>
      <div>
        <div><h2>Dashboard</h2></div>

        <div className='dashboardbox'>
          <div className='dashboard-singlebox'>
            <span>Number of Users</span>
            <div className='dashboard-singlebox-amount'>
              {users.length - 1}
            </div>
          </div>

          <div className='dashboard-singlebox'>
            <span>Number of Places</span>
            <div className='dashboard-singlebox-amount'>{places.length}</div>
          </div>

          <div className='dashboard-singlebox'>
            <span>Number of Bookings</span>
            <div className='dashboard-singlebox-amount'>{bookings.length}</div>
          </div>

          <div className='dashboard-singlebox'>
            <span>Active Bookings</span>
            <div className='dashboard-singlebox-amount'>{activeBookingCount}</div>
          </div>
        </div>

      <div className='chart-container'  >
        <canvas id='bookingGraph' ref={chartRef}></canvas>
        <canvas id='totalBookingsGraph' ref={chartRefTotalBookings}></canvas>
      </div>

      </div>
      
    </div>
  );
}