import React, { useState, useEffect } from "react"

const WeatherWidget = ({ stateId, stateName }) => {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [animation, setAnimation] = useState('')

  // Function to fetch weather data
  const fetchWeatherData = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/weather/${stateId}`)
      if (!res.ok) throw new Error("Failed to fetch weather")
      const data = await res.json()

      setWeather({
        temperature: data.temperature,
        windSpeed: data.windSpeed,
        rainfall: data.rainfall,
        note: data.note || null
      })
      
      // Add animation effect
      setAnimation('pulse')
      setTimeout(() => setAnimation(''), 1000)
      
    } catch (err) {
      setError(err.message)
      console.error("Weather fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Fetch immediately
    fetchWeatherData()
    
    // Then set up auto-refresh every 30 seconds
    const interval = setInterval(fetchWeatherData, 30000)
    
    return () => clearInterval(interval) // Cleanup
  }, [stateId])

  const getWeatherIcon = (temp) => {
    if (temp > 32) return "fas fa-sun"
    if (temp > 25) return "fas fa-cloud-sun"
    if (temp > 15) return "fas fa-cloud"
    return "fas fa-snowflake"
  }

  const getWeatherColor = (temp) => {
    if (temp > 32) return '#ff6b35'    // Hot - orange
    if (temp > 25) return '#ffa726'    // Warm - amber
    if (temp > 15) return '#4fc3f7'    // Mild - light blue
    return '#90caf9'                   // Cold - blue
  }

  if (loading) return (
    <div className="weather-card loading">
      <div className="weather-pulse"></div>
      Loading weather...
    </div>
  )
  
  if (error) return <div className="weather-card error">Error: {error}</div>
  if (!weather) return <div className="weather-card">No data available</div>

  return (
    <div 
      className={`weather-card ${animation}`}
      style={{
        background: `linear-gradient(135deg, ${getWeatherColor(weather.temperature)}, #0984e3)`
      }}
    >
      <div className="weather-location">
        <h3>{stateName}</h3>
        {weather.note && <span className="weather-note">*{weather.note}</span>}
      </div>
      <div className="weather-info">
        <div className="weather-icon">
          <i className={getWeatherIcon(weather.temperature)}></i>
        </div>
        <div className="weather-temp">{weather.temperature}°C</div>
      </div>
      <div className="weather-details">
        <p>💨 Wind: {weather.windSpeed} m/s</p>
        <p>💧 Rainfall: {weather.rainfall} mm</p>
      </div>
      <div className="weather-update-indicator">
        <div className="pulse-dot"></div>
        Live
      </div>
    </div>
  )
}

export default WeatherWidget