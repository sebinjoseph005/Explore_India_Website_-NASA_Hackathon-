import axios from "axios";

const NASA_URL = "https://power.larc.nasa.gov/api/temporal/daily/point";

export const fetchWeather = async (lat, lon) => {
  // Use a date range that definitely has data
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 7); // Get data from last week
  
  const formatDate = (date) => date.toISOString().slice(0, 10).replace(/-/g, "");
  
  const start = formatDate(startDate);
  const end = formatDate(endDate);

  console.log(`🌤️  Fetching NASA data for lat:${lat}, lon:${lon} from ${start} to ${end}`);

  try {
    const res = await axios.get(NASA_URL, {
      params: {
        parameters: "T2M,WS2M,PRECTOTCORR",
        community: "RE",
        longitude: lon,
        latitude: lat,
        start: start,
        end: end,
        format: "JSON",
      },
      timeout: 15000,
    });

    console.log("✅ NASA API Response received");
    
    if (!res.data || !res.data.properties) {
      console.log("❌ Invalid NASA response structure");
      throw new Error("Invalid response from NASA API");
    }

    return res.data;
  } catch (err) {
    console.error("❌ NASA API fetch failed:");
    console.error("Error:", err.message);
    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Data:", err.response.data);
    }
    throw new Error(`NASA API unavailable: ${err.message}`);
  }
};