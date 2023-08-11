import './App.css';
import About from './Pages/About';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Terms from './Pages/Terms';
import Privacy from './Pages/Privacy';
import Footer from './Components/Footer';
import Navbar from './Components/Navbar';
import AccountPage from './Pages/Accountdata';
import { BrowserRouter as Router,Route,Routes, useLocation } from 'react-router-dom';
import axios from 'axios';
import {UserContextProvider} from './UserContext';
import Accommodationusr from './Pages/Accommodationusr';
import Accommodationform from './Pages/Accommodationform';
import Accommodation from './Pages/Accommodation';
import Accommodationpage from './Pages/Accommodationpage';
import Userbooking from './Pages/Userbooking';
import Userbookingsingle from './Pages/Userbookingsingle';
import Accommodationbookings from './Pages/Accommodationbookings';
import Error404 from './Pages/Error404';

import Adminlogin from './Pages/Admin/AdminLogin';
import Dashboard from './Pages/Admin/Dashboard';
import Userdata from './Pages/Admin/Userdata';
import Places from './Pages/Admin/Placesdata';
import Bookings from './Pages/Admin/Bookingdata';
import Payments from './Pages/Admin/Paymentdata';

axios.defaults.baseURL='http://localhost:4000';
axios.defaults.withCredentials = true;


function App() {



  

  

  return (
     
    <Router>
    <div className="App">
      
        <div>
          
          <UserContextProvider><Navbar/>
          
          <Routes>
            <Route index element={<Home/>}/>
            <Route path="/" element={<Home/>}/>
            <Route path="/About" element={<About />}/>
            <Route path="/Login" element={<Login/>}/> 
            <Route path="/Register" element={<Register/>}/>   
            <Route path="/Privacy" element={<Privacy/>}/>
            <Route path="/Terms" element={<Terms/>}/>
            <Route path="/Accommodation" element={<Accommodation/>}/>
            <Route path="/Accommodation/:id" element={<Accommodationpage/>}/>
            <Route path="/Accountdata/" element={<AccountPage/>}/>
            <Route path="/Accountdata/Accommodationusr" element={<Accommodationusr/>}/>
            <Route path="/Accountdata/Accommodationusr/new" element={<Accommodationform/>}/>
            <Route path="/Accountdata/Accommodationusr/:id" element={<Accommodationform/>}/>
            <Route path="/Accountdata/Bookings" element={<Userbooking/>}/>
            <Route path="/Accountdata/Bookings/:id" element={<Userbookingsingle/>}/>
            <Route path="/Accountdata/Accommodationusr/:id/Bookings" element={<Accommodationbookings/>}/>
           
            <Route path="*" element={<Error404/>}/>

            <Route path="/Admin/AdminLogin" element={<Adminlogin/>}/>
            <Route path="/Admin/Dashboard" element={<Dashboard/>}/>
            <Route path="/Admin/UserData" element={<Userdata/>}/>
            <Route path="/Admin/Places" element={<Places/>}/>
            <Route path="/Admin/Bookings" element={<Bookings/>}/>
            <Route path="/Admin/Payments" element={<Payments/>}/>
            
            
          </Routes>
           
         </UserContextProvider>
        </div>
     
      <div className="page-container">
      <div className="content-wrap"></div>
      
      <Footer />
    </div>
    
    </div></Router>
    
  );
}

export default App;


