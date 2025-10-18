import express from "express";
import cors from "cors";              // ✅ Import CORS
import stateRoutes from "./routes/states.js";
import weatherRoutes from "./routes/weather.js";

const app = express();
const PORT = 5000;

// ✅ Middleware
app.use(cors());                     // <-- Allow requests from frontend (port 3000)
app.use(express.json());

// ✅ Default route
app.get("/", (req, res) => {
  res.send("🌍 Weather API is running...");
});

// ✅ API routes
app.use("/api/states", stateRoutes);
app.use("/api/weather", weatherRoutes);

// ✅ Start the server
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
