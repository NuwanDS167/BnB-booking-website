import React from 'react'

export default function Perks({selected,onChange}) {
  
  function handleCbClick(ev){

    const {checked,name} = ev.target;
    
    if (checked){
        onChange([...selected, name]);
    }else{
        onChange([...selected.filter(selectedName => selectedName !== name)]);
    }

  }
  
  return (
    <div> 
    <div>  <label><input type='checkbox' checked={selected.includes('Parking')} name="Parking" onChange={handleCbClick}/><span>Parking</span></label></div>
    <div>  <label><input type='checkbox' checked={selected.includes('Pets')} name="Pets" onChange={handleCbClick}/><span>Pets</span></label></div>
    <div>  <label><input type='checkbox' checked={selected.includes('TV')} name="TV" onChange={handleCbClick}/><span>TV</span></label></div>
    <div>  <label><input type='checkbox' checked={selected.includes('Radio')} name="Radio" onChange={handleCbClick}/><span>Radio</span></label></div>
    <div>  <label><input type='checkbox' checked={selected.includes('Pool')} name="Pool" onChange={handleCbClick}/><span>Pool</span></label></div>
    <div>  <label><input type='checkbox' checked={selected.includes('Wifi')} name="Wifi" onChange={handleCbClick}/><span>Wifi</span></label></div>
    <div>  <label><input type='checkbox' checked={selected.includes('Kitchen')} name="Kitchen" onChange={handleCbClick}/><span>Kitchen</span></label></div>
    </div>
  )
}
