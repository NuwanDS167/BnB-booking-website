import React from 'react'

export default function Placephoto({place, index=0}) {

    if (!place.photos?.length) {
        return '';
    }


  return (
   
        <img src={`http://localhost:4000/uploads/${place.photos[index]}`} alt="" style={{ width: "100%", height: "100%" }} />
 
  )
}
