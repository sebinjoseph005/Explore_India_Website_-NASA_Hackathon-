import React from 'react'
import { useParams, Link } from 'react-router-dom'
import WeatherWidget from '../components/WeatherWidget'
import CrimeRateBadge from '../components/CrimeRateBadge'
import statesData from '../data/states.json'
import '../styles/state.css'

const StatePage = () => {
  const { stateId } = useParams()
  const state = statesData.states.find(s => s.id === stateId)

  if (!state) {
    return (
      <div className="container">
        <h2>State not found</h2>
        <Link to="/" className="back-btn">
          <i className="fas fa-arrow-left"></i> Back to Home
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* State Hero Section */}
      <section className="state-hero">
        <div className="container">
          <h1>{state.name}</h1>
          <p>{state.description}</p>
        </div>
      </section>

      <div className="container">
        {/* Back Button */}
        <Link to="/" className="back-btn">
          <i className="fas fa-arrow-left"></i> Back to Map
        </Link>

        {/* State Information */}
        <div className="state-info">
          <div className="state-details">
            <h2>About {state.name}</h2>
            <p>{state.description}</p>
            <div className="state-stats">
              <div className="stat-card">
                <div className="stat-value">{state.crimeRate}%</div>
                <div className="stat-label">Crime Rate</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{state.bestTime}</div>
                <div className="stat-label">Best Time to Visit</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{state.capital}</div>
                <div className="stat-label">Capital</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{state.language}</div>
                <div className="stat-label">Language</div>
              </div>
            </div>
          </div>
        </div>

        {/* Weather Information */}
        <div className="state-weather">
          <h2 className="section-title">Weather in {state.name}</h2>
          <WeatherWidget stateId={state.id} stateName={state.name} />
        </div>

        {/* Crime Rate Information */}
        <div className="state-crime">
          <h2 className="section-title">Safety in {state.name}</h2>
          <CrimeRateBadge crimeRate={state.crimeRate} stateName={state.name} />
          <p style={{ marginTop: '1rem' }}>
            {state.crimeRate <= 15 
              ? "This state has a relatively low crime rate. Standard travel precautions are recommended."
              : state.crimeRate <= 25
              ? "This state has a moderate crime rate. Exercise increased caution, especially in crowded areas."
              : "This state has a higher crime rate. Exercise heightened caution and avoid traveling alone at night."
            }
          </p>
        </div>

        {/* Tourist Spots */}
        <h2 className="section-title">Top Tourist Spots in {state.name}</h2>
        <div className="spots-container">
          {state.spots.map((spot, index) => (
            <div key={index} className="spot-card">
              <div className="spot-image">
                <img 
                  src={spot.image} 
                  alt={spot.name} 
                  style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }} 
                />
              </div>
              <div className="spot-content">
                <h3>{spot.name}</h3>
                <p>{spot.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default StatePage
