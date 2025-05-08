const { json } = require("express");
const {
  forwardVesselDataToHotspot,
  forwardVesselDataToWebServer,
  getWeatherData,
  getHotspotData,
  forwardVesselDataToHotspotServer,
  forwardChatDataToWebServer
} = require("../services/apiService");
const logger = require('../utils/logger');

const reRouteGpsData = async (req, res) => {
  const { id, l, s } = req.body;

  if (!id || !l || typeof s !== "number") {
    return res.status(400).json({
      success: false,
      message: 'Invalid data format. Ensure "id", "l", and "s" are provided.',
    });
  }

  console.log(req.body);

  try {
    let formattedData;
    let apiResponse;

    if (s === 0) {
      // If not SOS data, the data is sent to the hotspot without the s
      formattedData = { id, l };
      console.log("Formatted data:", formattedData);
      apiResponse = await forwardVesselDataToHotspot(formattedData);
    } else {
      // If SOS the data is sent to aqua safe with s
      formattedData = { id, l, s };
      apiResponse = await forwardVesselDataToWebServer(formattedData);
    }

    logger.info(`GPS-REROUTE-RESPONSE: ${apiResponse.message}`);

    res.status(200).json({
      success: true,
      message: "Data successfully sent to the API.",
      apiResponse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send data to the API.",
      error: error.message,
    });
  }
};

const fetchWeatherData = async (req, res) => {
  try {
      const requestData = req.body; // Request payload from gateway

      console.log("Request data:", requestData);

      // Call service method to fetch data
      const weatherData = await getWeatherData(requestData);

      console.log("101" ,weatherData.data);

      // Send response back to the gateway
      res.status(200).json(weatherData.data);
  } catch (error) {
      console.error("Error fetching weather data:", error.message);
      res.status(error.response?.status || 500).json({
          success: false,
          message: "Failed to fetch weather data",
          error: error.message
      });
  }
};

const fetchHotspotData = async (req, res) => {
  try {
    const requestData = req.body; 

    console.log("Request data:", requestData);

    const hotspotData = await getHotspotData(requestData);

    res.status(200).json({
      success: true,
      hotspots: hotspotData.data.data  // Extract only the necessary data
    });          
  } catch (error) {
    console.error("Error fetching hotspot data:", error.message);
    res.status(error.response?.status || 500).json({
      success: false,
      message: "Failed to fetch hotspot data",
      error: error.message
    });
  }
}

const handleVesselLinking = async (req, res) => {
  try {
    const {vessel_id, hotspot_id} = req.body;

    const requestData = {
      vessel_id,
      hotspot_id
    };

    console.log("Request data:", requestData);

    const response = await forwardVesselDataToHotspotServer(requestData);

    res.status(200).json({
      success: true,
      message: response.data
    });
  } catch (error) {
    console.error("Error linking vessels:", error.message);
    res.status(error.response?.status || 500).json({
      success: false,
      message: "Failed to link vessels",
      error: error.message
    });
  }
}

const handleChatData = async (req, res) => {
  try {
    const requestData = req.body;

    console.log("Request data:", requestData);

    const response = await forwardChatDataToWebServer(requestData);

    res.status(200).json({
      success: true,
      message: response.data
    });
  } catch (error) {
    console.error("Error forwarding chat data:", error.message);
    res.status(error.response?.status || 500).json({
      success: false,
      message: "Failed to forward chat data",
      error: error.message
    });
  }
}
module.exports = { reRouteGpsData, fetchWeatherData , fetchHotspotData, handleVesselLinking, handleChatData};
