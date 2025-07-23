import React, { useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'
import L from "leaflet";
import { useEffect } from 'react';
import axios from 'axios';
import countryData from "../data/countryData.json"

//fix you default marker icon

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl:"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})



function MapView() {
  // const position = [20.0,0.0]
  const [geodata,setgeodata] =  useState(null); 
  const [riskdata,setriskdata] = useState([]);
//   useEffect(()=>{
//   axios.get('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
//   .then((res)=>{
//     setgeodata(res.data)
//   })
//   .catch((err)=>{
//     console.error("failed to load GEOjson",err)
//   })
// },[])
useEffect(()=>
async function fetchData() {
  try{
    const [geores, riskres] = await Promise.all([
      axios.get("https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson"),
      axios.get("https://raw.githubusercontent.com/harshdeveloper123/Global_Resilience_Map/main/maps/src/data/countryData.json")
    ])
    setgeodata(geores.data);
    setriskdata(riskres.data)
  }catch(error){
    console.error("failed to load data" ,error);
  }
  fetchData();

},[])


//helper to calculate the center of the country
function geocenter(geometry){
  let coords = [];
  if(geometry.type==="Polygon"){
    coords = geometry.coordinates[0]
  }else if(geometry.type === "MultiPolygon"){
    coords = geometry.coordinates[0][0];
  }
  const latsum =  coords.reduce((sum,coord)=>sum+coord[1],0);
  const lngsum = coords.reduce((sum,coord)=>sum+coord[0],0);

  const lat = latsum / coords.length;
  const lng = lngsum/coords.length;

  return [lat,lng]
}
  return (
    <div id='map'>
      <MapContainer 
      center={[20,0]}
      zoom={2}
      minZoom={2}
      maxZoom={18}
      maxBounds={[
        [-90,-180],
        [90,180]
      ]}
      scrollWheelZoom={true}
      style={{height:"100vh",width:"100%"}}
      >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>

      {/* <Marker position={[28.6139,77.2090]}>

        <Popup>New Delhi, India</Popup>
      </Marker> */}

      {geodata && <GeoJSON data={geodata}/>}
       {/* Loop through each feature to create markers */}
        {/* {countryData.features.map((feature, index) => (
          <Marker
            key={index}
            position={feature.geometry.coordinates.reverse()} // Flip [lon, lat] to [lat, lon]
          >
            <Popup>
              <strong>{feature.properties.name}</strong><br />
              Disaster Risk: {feature.properties.disaster_risk}<br />
              Digital Readiness: {feature.properties.digital_readiness_label} ({feature.properties.digital_readiness_score})
            </Popup>
          </Marker>
        ))} */}


           {geodata?.features.map((feature, idx) => {
          const countryName = feature.properties.ADMIN;
          const center = geocenter(feature.geometry);
          const risk = riskdata.features.find(
            (item) => item.properties.name.toLowerCase() === countryName.toLowerCase()
          );

          if (!risk) return null;

          return (
            <Marker key={idx} position={center}>
             <Popup>
  <strong>{countryName}</strong><br />
  🌍 <strong>Disaster Risk:</strong> {risk.properties.disaster_risk}<br />
  💻 <strong>Digital Readiness:</strong> {risk.properties.digital_readiness_label}<br />
  📊 <strong>Readiness Score:</strong> {risk.properties.digital_readiness_score}
</Popup>
            </Marker>
          );
        })}


      </MapContainer>
    </div>
  )
}

export default MapView
