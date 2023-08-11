import deletephoto from '../Components/trash.png';
import React, { useEffect, useState ,useContext} from 'react'
import { UserContext } from '../UserContext';
import Perks from '../Components/Perks'
import axios from 'axios';
import { Navigate, useParams } from 'react-router-dom';
import AccountNav from '../Components/AccountNav';
import './CSS/Accommodationform.css'
import moment from 'moment';

export default function Accommodationform() {

  const { user } = useContext(UserContext);

    const {id} = useParams();
    
    const [title,setTitle]= useState('');
    const [address,setAddress]= useState('');  
    const [addedPhotos,setAddedPhotos]= useState([]);  
    const [photoLink,setPhotolink]= useState('');  
    const [description,setDescription]= useState('');  
    const [perks,setPerks]= useState([]);  
    const [maxGuests,setMaxGuests]= useState(1);
    const [price,setPrice]= useState('');  
    const checkTillDate = moment().format("YYYY-MM-DD");
    const [redirect,setRedirect] = useState(false);

    const [isLoading, setIsLoading] = useState(true);
    

  
    useEffect(()=>{
      if(!id){
        setIsLoading(false);
        return;
      }
      axios.get('/Accommodationusr/'+id).then(response =>{
          const {data} = response;
          setTitle(data.title);
          setAddress(data.address);
          setAddedPhotos(data.photos);
          setDescription(data.description);
          setPerks(data.perks);
          setMaxGuests(data.maxGuests);
          setPrice(data.price);

          setIsLoading(false);
      }); 
    },[id]);


    async function addPhotoByLink(ev){
        ev.preventDefault();
      
          if (!photoLink){
            return;
          }

          if (!photoLink.startsWith("https")) {
            alert("Please provide a valid link.");
            return;
          }

          if (addedPhotos.length >= 9) {
            alert("You can only add up to 9 photos.");
            return;
          }

         const {data:filename} = await axios.post('/uploadbylink',{link: photoLink})
      
          setAddedPhotos(prev =>{
            return [...prev, filename];
      
          });
          setPhotolink('');
        }
      
        

        function uploadPhoto(ev){
      
          const files = ev.target.files;

          if (addedPhotos.length + files.length > 9) {
            alert("You can only add up to 9 photos.");
            return;
          }
          
          const data = new FormData();
         
          for (let i=0; i<files.length; i++){
            data.append('photos',files[i]);
          }
      
          axios.post('/upload', data, {
             headers:{'Content-type':'multipart/form-data'}
          }).then(response =>{
            const {data:filenames} = response;
            setAddedPhotos(prev =>{
              return [...prev, filenames];
        
            });
          })
        }
      

        function removePhoto(filename){
          setAddedPhotos([...addedPhotos.filter(photo => photo!== filename)]);
        }

        function selectAsMainPhoto(filename){
          const addedPhotosWithoutSelected = addedPhotos
          .filter(photo => photo!== filename);
          const newAddedPhotos = [filename,...addedPhotosWithoutSelected ];
          setAddedPhotos(newAddedPhotos);
        }



async function addNewPlace(ev){
ev.preventDefault();

            // Check if all fields are filled
  if (!title || !address || !addedPhotos || !description || !perks || !maxGuests || !price || !checkTillDate) {
    alert('Please fill in all the fields.');
    return;
  }

  // Check if the number of photos is less than 5
  if (addedPhotos.length < 5) {
    alert('Minimum 5 photos are required.');
    return;
  }

  if(id){
              //update
         await axios.put('/Accommodationusr',{
          id,
          title, address, addedPhotos,
          description, perks, maxGuests, price,checkTillDate
          });
            alert('Updated successfully');
            setRedirect(true); 
  }else {
              //new
         await axios.post('/places',{
         title, address, addedPhotos,
         description, perks, maxGuests, price,checkTillDate
         });
          alert('Posted successfully');
          setRedirect(true); 
  }          
   }
    if (redirect){
       return <Navigate to ={'/Accountdata/Accommodationusr'}/>
   }


        
        if (isLoading) {
          return <div>
            <div className='mainn'></div>
            <div class="container">
                  <div class="loader"></div>
                  </div>
                  </div>
          ;
        }  


        if (!user) {
          return <Navigate to="/Login" />;
        }


  return (
    <div>
      <AccountNav />
      <div className='formoutside'>
        <h2>New Place</h2>
      <form className="fullform" onSubmit={addNewPlace}>
       
      <div className="form-field">
        <h3>Title</h3>
        <input type='text' value={title} onChange={ev => setTitle(ev.target.value)} placeholder='Title' />
        </div>

        <div className="form-field">
        <h3>Address</h3>
        <input type='text' value={address} onChange={ev => setAddress(ev.target.value)} placeholder='Address' />
        </div>

        <div className="form-field">
        <h3>Photos</h3>
        <input type='text' value={photoLink} onChange={ev => setPhotolink(ev.target.value)} placeholder='upload via link' />
        <button style={{ height: '29px' }} onClick={addPhotoByLink}>add</button>
        </div>

        
        <div className='place'>
          {addedPhotos.length > 0 && addedPhotos.map(link => (
            <div key={link} className='photo-container'>
              <img className='placephoto' alt="" src={'http://localhost:4000/uploads/' + link} onClick={() => selectAsMainPhoto(link)}
                style={{ cursor: "pointer" }} />
              <button onClick={() => removePhoto(link)} className='remove-button'>
                <img alt="" src={deletephoto} className='delete-icon' />
              </button>
            </div>
          ))}
        </div>

        <br />
        <label className='upload-label'>
          <input type="file" className="hidden" onChange={uploadPhoto}></input>
          Upload from device
        </label>
            <br></br><br></br>
            
        <div className="form-field-des">
        <h3>Description</h3>
        <textarea value={description} onChange={ev => setDescription(ev.target.value)} placeholder='Description' />
        </div>

        <div className="form-field-perks">
        <h3>Perks</h3>
        <div>
          <Perks selected={perks} onChange={setPerks} />
        </div>
        </div>

        <div className="form-field-MNG">
        <h3>Max no of guests</h3>
        <input type='number' value={maxGuests} onChange={ev => setMaxGuests(ev.target.value)} placeholder='Max no of guests' />
        </div>

        <div className="form-field">
        <h3>Price</h3>
        <input type='number' value={price} onChange={ev => setPrice(ev.target.value)} placeholder='LKR/night' />
        </div>

        <br />
        <button className='button'>Submit</button>
      </form>
      </div>
    </div>
  )
}
