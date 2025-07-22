import React from 'react'
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'
function MapView() {
  return (
    <div id='map'>
      <MapContainer 
      center={[20,0]}
      zoom={2}
      minZoom={2}
      maxZoom={18}
      style={{height:"100vh",width:"100%"}}
      >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>

      </MapContainer>
    </div>
  )
}

export default MapView
