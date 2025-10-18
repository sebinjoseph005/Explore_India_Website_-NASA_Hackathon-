import express from "express";
import { getWeatherByState, getAllStatesWeather, getHistoricalWeather } from "../controllers/weatherController.js";

const router = express.Router();

router.get("/:id", getWeatherByState);
router.get("/", getAllStatesWeather);
router.get("/historical/:id", getHistoricalWeather);

export default router;