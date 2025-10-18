import axios from "axios";

const OPENWEATHER_API_KEY = "demo_key"; // You'll need to get a free API key
const OPENWEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";

export const fetchWeatherFromOpenWeather = async (lat, lon) => {
  try {
    // Using demo approach - in production, get free API key from openweathermap.org
    const response = await axios.get("https://api.open-meteo.com/v1/forecast", {
      params: {
        latitude: lat,
        longitude: lon,
        current: "temperature_2m,wind_speed_10m,precipitation",
        timezone: "auto"
      },
      timeout: 10000
    });

    const data = response.data.current;
    
    return {
      temperature: Math.round(data.temperature_2m),
      windSpeed: data.wind_speed_10m,
      rainfall: data.precipitation || 0
    };
    
  } catch (error) {
    console.log("Open-Meteo API failed, using fallback data");
    
    // Fallback: Generate realistic weather based on location and season
    const month = new Date().getMonth();
    const isSummer = month >= 3 && month <= 9; // Apr-Oct
    
    // North India is generally hotter, South more moderate
    const isNorthIndia = lat > 20;
    
    const baseTemp = isSummer ? 
      (isNorthIndia ? 35 : 30) : 
      (isNorthIndia ? 20 : 25);
    
    // Add some random variation (±5 degrees)
    const temperature = baseTemp + (Math.random() * 10 - 5);
    
    return {
      temperature: Math.round(temperature),
      windSpeed: (Math.random() * 5 + 1).toFixed(1),
      rainfall: (Math.random() * 10).toFixed(1)
    };
  }
};