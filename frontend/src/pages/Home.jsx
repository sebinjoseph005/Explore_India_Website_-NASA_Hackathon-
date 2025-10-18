import React, { useState, useEffect } from 'react'
import Map from '../components/Map'
import WeatherWidget from '../components/WeatherWidget'
import CrimeRateBadge from '../components/CrimeRateBadge'
import statesData from '../data/states.json'
import '../styles/home.css'

const Home = () => {
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [historicalWeather, setHistoricalWeather] = useState(null)
  const [loadingHistorical, setLoadingHistorical] = useState(false)

  // Function to handle smooth scrolling
  const handleScrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Fetch historical weather when date or state changes
  useEffect(() => {
    if (selectedDate && selectedState) {
      fetchHistoricalWeather(selectedState, selectedDate);
    }
  }, [selectedDate, selectedState]);

  const fetchHistoricalWeather = async (stateId, date) => {
    setLoadingHistorical(true);
    try {
      const response = await fetch(`http://localhost:5000/api/weather/historical/${stateId}?date=${date}`);
      if (!response.ok) throw new Error('Failed to fetch historical weather');
      const data = await response.json();
      setHistoricalWeather(data);
    } catch (error) {
      console.error('Error fetching historical weather:', error);
      setHistoricalWeather(null);
    } finally {
      setLoadingHistorical(false);
    }
  };

  const formatDateForDisplay = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div>
      {/* Header */}
      <header>
        <div className="container header-content">
          <div className="logo">
            <i className="fas fa-map-marked-alt"></i>
            <h1>Explore India</h1>
          </div>
          <nav>
            <ul>
              <li><a href="#home" onClick={(e) => { e.preventDefault(); handleScrollToSection('home'); }}>Home</a></li>
              <li><a href="#historical-weather" onClick={(e) => { e.preventDefault(); handleScrollToSection('historical-weather'); }}>Weather History</a></li>
              <li><a href="#states" onClick={(e) => { e.preventDefault(); handleScrollToSection('states'); }}>Explore States</a></li>
              <li><a href="#live-weather" onClick={(e) => { e.preventDefault(); handleScrollToSection('live-weather'); }}>Live Weather</a></li>
              <li><a href="#safety" onClick={(e) => { e.preventDefault(); handleScrollToSection('safety'); }}>Safety</a></li>
              <li><a href="#about" onClick={(e) => { e.preventDefault(); handleScrollToSection('about'); }}>About</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="container">
          <h2>Discover Incredible India</h2>
          <p>Explore the diverse cultures, breathtaking landscapes, and rich heritage of India's beautiful states</p>
          <div className="hero-buttons">
            <a href="#states" className="btn btn-explore" onClick={(e) => { e.preventDefault(); handleScrollToSection('states'); }}>
              <i className="fas fa-map"></i> Explore States
            </a>
            <a href="#historical-weather" className="btn btn-secondary" onClick={(e) => { e.preventDefault(); handleScrollToSection('historical-weather'); }}>
              <i className="fas fa-history"></i> Check Weather History
            </a>
          </div>
        </div>
      </section>

      <div className="container">
        {/* Historical Weather Section */}
        <section className="historical-weather-section" id="historical-weather">
          <h2 className="section-title">Check Historical Weather</h2>
          <div className="weather-selector">
            <div className="selector-group">
              <label htmlFor="state-select">Select State:</label>
              <select 
                id="state-select"
                value={selectedState} 
                onChange={(e) => setSelectedState(e.target.value)}
                className="state-dropdown"
              >
                <option value="">Choose a state</option>
                {statesData.states.map((state) => (
                  <option key={state.id} value={state.id}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="selector-group">
              <label htmlFor="date-picker">Select Date:</label>
              <input
                id="date-picker"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="date-picker"
                max={new Date().toISOString().split('T')[0]} // Can't select future dates
              />
            </div>
          </div>

          {/* Historical Weather Display */}
          {loadingHistorical && (
            <div className="historical-loading">
              <div className="loading-spinner"></div>
              <p>Loading weather data for {selectedDate}...</p>
            </div>
          )}

          {historicalWeather && !loadingHistorical && (
            <div className="historical-weather-card">
              <div className="historical-weather-header">
                <h3>Weather in {historicalWeather.state}</h3>
                <p className="weather-date">{formatDateForDisplay(selectedDate)}</p>
              </div>
              <div className="historical-weather-content">
                <div className="weather-main">
                  <div className="temperature">
                    <i className="fas fa-thermometer-half"></i>
                    <span>{historicalWeather.temperature}°C</span>
                  </div>
                  <div className="weather-details-grid">
                    <div className="detail-item">
                      <i className="fas fa-wind"></i>
                      <span>Wind: {historicalWeather.windSpeed} m/s</span>
                    </div>
                    <div className="detail-item">
                      <i className="fas fa-cloud-rain"></i>
                      <span>Rainfall: {historicalWeather.rainfall} mm</span>
                    </div>
                    <div className="detail-item">
                      <i className="fas fa-info-circle"></i>
                      <span>Source: {historicalWeather.source || 'NASA POWER'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!historicalWeather && !loadingHistorical && selectedDate && selectedState && (
            <div className="no-data-message">
              <i className="fas fa-exclamation-triangle"></i>
              <p>No weather data available for the selected date and state.</p>
            </div>
          )}
        </section>

        {/* Interactive Map */}
        <section id="states">
          <Map />
        </section>

        {/* Live Weather Grid (4 states per row) */}
        <section className="weather-section" id="live-weather">
          <h2 className="section-title">Live Weather Across India</h2>
          <div className="weather-container">
            {statesData.states.map((state) => (
              <WeatherWidget 
                key={state.id} 
                stateId={state.id} 
                stateName={state.name} 
              />
            ))}
          </div>
        </section>

        {/* Crime Rate Information */}
        <section className="crime-section" id="safety">
          <h2 className="section-title">Safety Statistics</h2>
          <div className="crime-container">
            {statesData.states.map((state) => (
              <CrimeRateBadge 
                key={state.id} 
                crimeRate={state.crimeRate} 
                stateName={state.name} 
              />
            ))}
          </div>
        </section>

        {/* About Section */}
        <section className="about-section" id="about">
          <h2 className="section-title">About Indian Tourism</h2>
          <div className="about-content">
            <div className="about-text">
              <p>
                India is a land of diverse cultures, traditions, and landscapes. From the snow-capped Himalayas 
                to the sunny beaches of Goa, from the deserts of Rajasthan to the backwaters of Kerala, India 
                offers something for every traveler.
              </p>
              <p>
                Our tourism website helps you explore different states, understand their unique characteristics, 
                check weather conditions, and make informed travel decisions based on safety statistics.
              </p>
              <div className="about-buttons">
                <a href="#states" className="btn btn-explore" onClick={(e) => { e.preventDefault(); handleScrollToSection('states'); }}>
                  <i className="fas fa-map"></i> Explore States Map
                </a>
                <a href="#historical-weather" className="btn btn-secondary" onClick={(e) => { e.preventDefault(); handleScrollToSection('historical-weather'); }}>
                  <i className="fas fa-cloud-sun"></i> Check Weather
                </a>
              </div>
            </div>
            <div className="about-image">
              <img src="https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80" alt="Indian Culture" />
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer>
        <div className="container">
          <div className="footer-content">
            <div className="footer-column">
              <h3>Explore India</h3>
              <p>Your guide to discovering the incredible diversity and beauty of India's states and cultures.</p>
              <div className="social-icons">
                <a href="#"><i className="fab fa-facebook-f"></i></a>
                <a href="#"><i className="fab fa-twitter"></i></a>
                <a href="#"><i className="fab fa-instagram"></i></a>
                <a href="#"><i className="fab fa-youtube"></i></a>
              </div>
            </div>
            <div className="footer-column">
              <h3>Quick Links</h3>
              <ul>
                <li><a href="#home" onClick={(e) => { e.preventDefault(); handleScrollToSection('home'); }}>Home</a></li>
                <li><a href="#historical-weather" onClick={(e) => { e.preventDefault(); handleScrollToSection('historical-weather'); }}>Weather History</a></li>
                <li><a href="#states" onClick={(e) => { e.preventDefault(); handleScrollToSection('states'); }}>Explore States</a></li>
                <li><a href="#live-weather" onClick={(e) => { e.preventDefault(); handleScrollToSection('live-weather'); }}>Live Weather</a></li>
                <li><a href="#safety" onClick={(e) => { e.preventDefault(); handleScrollToSection('safety'); }}>Safety</a></li>
                <li><a href="#about" onClick={(e) => { e.preventDefault(); handleScrollToSection('about'); }}>About</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h3>Popular States</h3>
              <ul>
                {statesData.states.slice(0, 6).map((state) => (
                  <li key={state.id}><a href={`/state/${state.id}`}>{state.name}</a></li>
                ))}
              </ul>
            </div>
            <div className="footer-column">
              <h3>Contact Info</h3>
              <ul>
                <li><i className="fas fa-map-marker-alt"></i> New Delhi, India</li>
                <li><i className="fas fa-phone"></i> +91 9876543210</li>
                <li><i className="fas fa-envelope"></i> info@exploreindia.com</li>
              </ul>
            </div>
          </div>
          <div className="copyright">
            <p>&copy; 2024 Explore India Tourism. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home