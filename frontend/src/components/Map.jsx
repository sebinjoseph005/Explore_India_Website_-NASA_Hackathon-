import React from 'react'
import { useNavigate } from 'react-router-dom'
import statesData from '../data/states.json' // ✅ Use states.json for coordinates
import indiaMap from '../assets/india-map.png'

const Map = () => {
  const navigate = useNavigate()

  const handleStateClick = (stateId) => {
    navigate(`/state/${stateId}`)
  }

  return (
    <div className="map-container">
      <h2 className="section-title">Explore Indian States</h2>
      
      {/* Added instruction line */}
      <p className="map-instruction">Click on the states in the map to check out detailed information!</p>

      <div 
        className="india-map"
        style={{
          backgroundImage: `url(${indiaMap})`
        }}
      >
        {statesData.states.map((state) => (
          <div
            key={state.id}
            className="state"
            style={{
              top: state.coordinates.top,
              left: state.coordinates.left,
            }}
            onClick={() => handleStateClick(state.id)}
          >
            <i className="fas fa-map-pin"></i> {state.name}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Map