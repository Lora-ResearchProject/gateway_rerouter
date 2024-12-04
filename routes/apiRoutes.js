const express = require("express");
const { reRouteGpsData } = require("../controllers/apiController");

const router = express.Router();

// Data coming from the gateway is rerouted to Aqua Safe
router.post("/reRoute/Gps", reRouteGpsData);

module.exports = router;
