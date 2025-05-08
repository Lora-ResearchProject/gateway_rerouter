const express = require("express");
const { reRouteGpsData, fetchWeatherData, fetchHotspotData, handleVesselLinking, handleChatData } = require("../controllers/apiController");

const router = express.Router();

// Data coming from the gateway is rerouted to Aqua Safe
router.post("/reRouteGps", reRouteGpsData);

router.post("/getWeatherDataFromServer", fetchWeatherData);

router.post("/getHotpostDataFromServer", fetchHotspotData);

router.post("/handleLinkVessel", handleVesselLinking);

router.post("/handleChatData", handleChatData);

module.exports = router;
     