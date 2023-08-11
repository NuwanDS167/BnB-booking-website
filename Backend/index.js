const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config()
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
const User = require ('./models/User.js');
const Place = require ('./models/Place.js');
const Booking = require ('./models/Booking.js');
const Review = require('./models/Review');
const Payment = require('./models/Payment.js');
const Subscribe = require('./models/Subscribe.js');
const cookieParser = require('cookie-parser');
const imageDownloader = require('image-downloader');
const multer = require('multer');
const fs = require('fs');

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret ='testforcookie';

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname+'/uploads'));

    app.use(cors({
    credentials: true,
    origin:'http://localhost:3000'

}));



console.log(process.env.MONGO_URL)
mongoose.connect(process.env.MONGO_URL);


// used to get user data. Never called in the actual code
function getUserDataFromToken(token){
 
  return new Promise((resolve, reject)=>{
    jwt.verify(token, jwtSecret, {}, async (err, userData)=> {
      if (err) throw err;
      resolve(userData);
    });
  });
}





app.get('/test',(req,res) => {

    res.json('test ok');
});


// use to send subscription data to the database
app.post('/sub',async (req,res) =>{
  const {email} = req.body;
 
 try{
  const subDoc = await Subscribe.create({
      email,     
  });
   res.json(subDoc);
}
catch(e){
  res.status(422).json(e);
}
});




// use to send new user registration data to the database
app.post('/reg',async (req,res) =>{
    const {name,email,password} = req.body;
   
   try{
    const userDoc = await User.create({
        name,
        email,
        password:bcrypt.hashSync(password, bcryptSalt),

    });
     res.json(userDoc);
}
catch(e){
    res.status(422).json(e);
}
   
});


// use to validate login data which send from frontend and create token
app.post('/login', async (req,res) => {
    const {email,password} = req.body;
    const userDoc = await User.findOne({email});
    if(userDoc){
        const passOk = bcrypt.compareSync(password, userDoc.password);
        if(passOk){
            jwt.sign({
                email:userDoc.email,
                id:userDoc._id,
                name:userDoc.name
            }, jwtSecret, {}, (err,token) => {
                if (err) throw err;
                res.cookie('token', token).json({user: userDoc, token: token});
            });
            
        }else{
            res.json('incorrect password');
        }
    }else{
    res.json('not found');
        }
});


//use to sent user data to front end based on the token
app.get('/profile',(req,res) => {
    const {token} = req.cookies;

    if (token){
        jwt.verify(token, jwtSecret, {}, (err, userData)=> {
            if (err) throw err;
            res.json(userData);
        });
    } else{
    res.json(null);

        }
}
)

app.post('/logout', (req,res)=>{
    res.cookie('token','').json(true);
});


//use to store photo details when uploaded by a link
app.post('/uploadbylink', async(req,res) =>{
    const {link} = req.body;
    const newName = 'photo'+Date.now() +'.jpg';
    await imageDownloader.image({
        url: link,
        dest: __dirname +'/uploads/' + newName,

    });
     res.json(newName);
});


// photo uploads by local pc
const photosMiddleware = multer({dest:'uploads/'});
app.post('/upload', photosMiddleware.array('photos', 100),(req,res) =>{
   
   const uploadedFiles =[];
    for(let i=0; i<req.files.length; i++){
        const {path, originalname} =req.files[i];
        const parts = originalname.split('.');
        const ext = parts[parts.length-1];
       
        const newName = 'photo' + Date.now() + '.' + ext;
        const newPath = 'uploads/' + newName;
    
        fs.renameSync(path, newPath);
        uploadedFiles.push(newPath.replace('uploads/', ''));
       
    }
    res.json(uploadedFiles[0]);
});



  // Authorized  // send place detalis to database

app.post('/places', (req, res) => {
    const { token } = req.cookies;
  
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
  
    const {
      title,
      address,
      addedPhotos,
      description,
      perks,
      maxGuests,
      price,
      checkTillDate,
    } = req.body;
  
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) {
        console.error(`Error verifying JWT: ${err.message}`);
        return res.status(401).json({ message: 'Invalid token' });
      }
  
      const { id } = userData;
  
      if (!id) {
        console.error('User ID not found in JWT');
        return res.status(401).json({ message: 'Invalid token' });
      }
  
      try {
        const placeDoc = await Place.create({
          owner: id,
          title,
          address,
          photos: addedPhotos,
          description,
          perks,
          maxGuests,
          price,
          checkTillDate,
        });
  
        res.json(placeDoc);
      } catch (err) {
        console.error(`Error creating place: ${err.message}`);
        res.status(500).json({ message: 'Error creating place' });
      }
    });
  });


  // Authorized  , // retreive place data and send them to frontend

  app.get('/places', (req, res) => {
    const { token } = req.cookies;
  
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
  
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) {
        console.error(`Error verifying JWT: ${err.message}`);
        return res.status(401).json({ message: 'Invalid token' });
      }
  
      const { id } = userData;
  
      if (!id) {
        console.error('User ID not found in JWT');
        return res.status(401).json({ message: 'Invalid token' });
      }
  
      try {
        const places = await Place.find({ owner: id });
        res.json(places);
      } catch (err) {
        console.error(`Error retrieving places: ${err.message}`);
        res.status(500).json({ message: 'Error retrieving places' });
      }
    });
  });



// for single accommodation page
app.get('/Accommodationusr/:id', async (req, res) => {
    const {id}= req.params;
    res.json(await Place.findById(id));
  });


  
// update place
  app.put('/Accommodationusr', async (req, res) => {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
  
    const {
      id,
      title,
      address,
      addedPhotos,
      description,
      perks,
      maxGuests,
      price,
      checkTillDate,
    } = req.body;
  
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
  
      const placeDoc = await Place.findById(id);
      // Remove the check userData.id === placeDoc.owner
  
      if (checkTillDate) {
        placeDoc.set({ checkTillDate });
      }
  
      if (title) {
        placeDoc.set({ title });
      }
  
      if (address) {
        placeDoc.set({ address });
      }
  
      if (addedPhotos) {
        placeDoc.set({ photos: addedPhotos });
      }
  
      if (description) {
        placeDoc.set({ description });
      }
  
      if (perks) {
        placeDoc.set({ perks });
      }
  
      if (maxGuests) {
        placeDoc.set({ maxGuests });
      }
  
      if (price) {
        placeDoc.set({ price });
      }
  
      await placeDoc.save();
      res.json('ok');
    });
  });




app.get('/Accommodation',async ( req,res)=>{

    res.json(await Place.find());
})



// send booking data to the database
app.post('/bookings', async (req, res) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) {
      console.error(`Error verifying JWT: ${err.message}`);
      return res.status(401).json({ message: 'Invalid token' });
    }

    const { place, checkIn, checkOut, name, mobile } = req.body;

    try {

      // create a new booking
      const bookingDoc = await Booking.create({
        place,
        checkIn,
        checkOut,
        name,
        mobile,
        user: userData.id,
      });


      res.json(bookingDoc);
    } catch (err) {
      console.error(`Error creating booking: ${err.message}`);
      res.status(500).json({ message: 'Error creating booking' });
    }
  });
});



// send payment data to the database
app.post('/payment', async (req, res) => {
  const { token } = req.cookies;
  const today = new Date().toISOString().split('T')[0];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) {
      console.error(`Error verifying JWT: ${err.message}`);
      return res.status(401).json({ message: 'Invalid token' });
    }

    try {
      const { booking, user, amount } = req.body;

      // Create a new payment
      const paymentDoc = await Payment.create({
        booking,
        amount,
        user: userData.id,
        date: today,
      });

      res.status(201).json(paymentDoc);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while processing the payment.' });
    }
  });
});



// all booking data for a single user
app.get('/bookings', async (req, res) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) {
      console.error(`Error verifying JWT: ${err.message}`);
      return res.status(401).json({ message: 'Invalid token' });
    }


    try {
      const bookings = await Booking.find({ user: userData.id }).populate('place');
      res.json(bookings);
    } catch (err) {
      
      console.error(`Error retrieving bookings: ${err.message}`);
      res.status(500).json({ message: 'Error retrieving bookings' });
    }
  });
});



// Bookings for a single selected place

app.get('/BookingsSinglaplace/:placeId', async (req, res) => {
  try {
    const { placeId } = req.params;
    const bookings = await Booking.find({ place: placeId }).populate('place').populate('user');
    res.json(bookings);
  } catch (err) {
    console.error(`Error retrieving bookings: ${err.message}`);
    res.status(500).json({ message: 'Error retrieving bookings' });
  }
});



// retreive booking data and send them to booking details page in frontend
app.get('/Bookings/:id', async (req, res) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) {
      console.error(`Error verifying JWT: ${err.message}`);
      return res.status(401).json({ message: 'Invalid token' });
    }

    try {
      const booking = await Booking.findOne({ _id: req.params.id, user: userData.id }).populate('place');
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      res.json(booking);
    } catch (err) {
      console.error(`Error retrieving booking: ${err.message}`);
      res.status(500).json({ message: 'Error retrieving booking' });
    }
  });
});


// send review data to the database
app.post('/reviews', async (req, res) => {
  try {
    const { booking, place, review, rating } = req.body;

    // Check if the booking ID is valid
    const bookingObj = await Booking.findById(booking);
    if (!bookingObj) {
      return res.status(400).json({ error: 'Invalid booking ID' });
    }

    // Retrieve the user name from the booking document
    const userName = bookingObj.name;

    // Create a new review document
    const newReview = new Review({
      booking,
      place,
      user: userName,
      review,
      rating,
    });

    // Save the review to the database
    await newReview.save();

    res.status(201).json({ message: 'Review created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});



// retreive review data and send them to the fornt end
app.get('/reviews', async (req, res) => {
  const { booking } = req.query;
  try {
    const reviews = await Review.find({ booking });
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});





// GET /api/bookings?place=:placeId
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find({ place: req.query.place });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/reviews?booking=:bookingIds
app.get('/api/reviews', async (req, res) => {
  try {
    const bookingIds = req.query.booking.split(',');
    const reviews = await Review.find({ booking: { $in: bookingIds } }).populate('place');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



//  Admin bookings

app.get('/BookingsAdmin', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('place');
    res.json(bookings);
  } catch (err) {
    console.error(`Error retrieving bookings: ${err.message}`);
    res.status(500).json({ message: 'Error retrieving bookings' });
  }
});


// Admin userdata

app.get('/UsersAdmin',async ( req,res)=>{

  res.json(await User.find());
})




app.get('/PaymentAdmin',async ( req,res)=>{

  res.json(await Payment.find());
  
})




app.listen(4000);