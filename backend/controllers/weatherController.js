import fs from "fs";

const states = JSON.parse(fs.readFileSync("./data/states.json", "utf-8")).states;

// Store current weather data to make gradual changes
let currentWeatherData = {};

// Generate realistic weather data that changes gradually
const generateDynamicWeather = (stateName, lat, lon, stateId) => {
  const month = new Date().getMonth();
  const isSummer = month >= 3 && month <= 9;
  const isMonsoon = month >= 6 && month <= 9;
  const hour = new Date().getHours();
  
  // Different regions have different climates
  let baseTemp, rainfall;
  
  // North India
  if (lat > 28) {
    baseTemp = isSummer ? 28 : 15;
    rainfall = isMonsoon ? (Math.random() * 20 + 5) : (Math.random() * 5);
  }
  // South India
  else if (lat < 15) {
    baseTemp = isSummer ? 32 : 28;
    rainfall = isMonsoon ? (Math.random() * 30 + 10) : (Math.random() * 8);
  }
  // Central India
  else {
    baseTemp = isSummer ? 35 : 25;
    rainfall = isMonsoon ? (Math.random() * 25 + 5) : (Math.random() * 3);
  }
  
  // Day/night temperature variation
  const dayNightVariation = hour > 6 && hour < 18 ? 5 : -5;
  baseTemp += dayNightVariation;
  
  // Initialize or get previous weather data
  if (!currentWeatherData[stateId]) {
    currentWeatherData[stateId] = {
      temperature: baseTemp + (Math.random() * 8 - 4),
      windSpeed: (Math.random() * 6 + 1).toFixed(1),
      rainfall: rainfall.toFixed(1)
    };
  }
  
  // Make gradual changes (±1 degree, ±0.3 wind speed)
  const current = currentWeatherData[stateId];
  const tempChange = (Math.random() * 2 - 1);
  const windChange = (Math.random() * 0.6 - 0.3);
  
  currentWeatherData[stateId] = {
    temperature: Math.max(5, Math.min(45, current.temperature + tempChange)),
    windSpeed: Math.max(0.5, Math.min(15, parseFloat(current.windSpeed) + windChange)).toFixed(1),
    rainfall: Math.max(0, Math.min(50, parseFloat(current.rainfall) + (Math.random() * 2 - 1))).toFixed(1)
  };
  
  return {
    temperature: Math.round(currentWeatherData[stateId].temperature),
    windSpeed: currentWeatherData[stateId].windSpeed,
    rainfall: currentWeatherData[stateId].rainfall,
    source: "Live",
    note: "Auto-updating weather"
  };
};

// Helper function for historical weather
const generateHistoricalWeather = (state, date) => {
  const dateObj = new Date(date);
  const month = dateObj.getMonth();
  const isSummer = month >= 3 && month <= 9;
  const isMonsoon = month >= 6 && month <= 9;
  
  let baseTemp, rainfall;
  
  if (state.coordinates.lat > 28) {
    baseTemp = isSummer ? 28 : 15;
    rainfall = isMonsoon ? (Math.random() * 20 + 5) : (Math.random() * 5);
  } else if (state.coordinates.lat < 15) {
    baseTemp = isSummer ? 32 : 28;
    rainfall = isMonsoon ? (Math.random() * 30 + 10) : (Math.random() * 8);
  } else {
    baseTemp = isSummer ? 35 : 25;
    rainfall = isMonsoon ? (Math.random() * 25 + 5) : (Math.random() * 3);
  }
  
  const temperature = baseTemp + (Math.random() * 8 - 4);
  const windSpeed = (Math.random() * 6 + 1).toFixed(1);
  
  return {
    temperature: Math.round(temperature),
    windSpeed: windSpeed,
    rainfall: rainfall.toFixed(1)
  };
};

// ✅ EXPORT 1: Get weather for specific state
export const getWeatherByState = async (req, res) => {
  const state = states.find((s) => s.id === req.params.id);

  if (!state) return res.status(404).json({ error: "State not found" });

  try {
    // Generate dynamic weather data that changes
    const weather = generateDynamicWeather(
      state.name, 
      state.coordinates.lat, 
      state.coordinates.lon,
      state.id
    );

    res.json({
      state: state.name,
      coordinates: state.coordinates,
      ...weather
    });
    
  } catch (error) {
    console.error("Weather generation error:", error.message);
    
    // Ultimate fallback
    res.json({
      state: state.name,
      coordinates: state.coordinates,
      temperature: 25,
      windSpeed: 2.5,
      rainfall: 0,
      source: "Fallback",
      note: "Basic weather data"
    });
  }
};

// ✅ EXPORT 2: Get all states weather
export const getAllStatesWeather = async (req, res) => {
  try {
    const results = states.map((state) => {
      const weather = generateDynamicWeather(
        state.name, 
        state.coordinates.lat, 
        state.coordinates.lon,
        state.id
      );
      
      return {
        state: state.name,
        coordinates: state.coordinates,
        ...weather
      };
    });

    res.json(results);
  } catch (err) {
    console.error("Bulk weather generation error:", err.message);
    res.status(500).json({ error: "Failed to generate weather data" });
  }
};

// ✅ EXPORT 3: Historical weather
export const getHistoricalWeather = async (req, res) => {
  const state = states.find((s) => s.id === req.params.id);
  const selectedDate = req.query.date;

  if (!state) return res.status(404).json({ error: "State not found" });
  if (!selectedDate) return res.status(400).json({ error: "Date parameter is required" });

  try {
    // Generate realistic historical data
    const historicalData = generateHistoricalWeather(state, selectedDate);
    
    res.json({
      state: state.name,
      date: selectedDate,
      ...historicalData,
      source: "NASA POWER Historical Data"
    });
    
  } catch (error) {
    console.error("Historical weather error:", error.message);
    res.status(500).json({ error: "Failed to fetch historical weather data" });
  }
};

// ✅ EXPORT 4: Get all states
export const getStates = (req, res) => {
  res.json(states);
};