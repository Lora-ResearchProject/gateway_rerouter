//This service will forward data from the Gateway to other Services as needed
const axios = require('axios');
require('dotenv').config();

const { forwardWeatherDataToGateway, forwardHotspotDataToGateway } = require('../services/loraService');

const apiUrl = `${process.env.AQUA_SAFE_URI}/api/server/store-location`;

// Function to send data to a specific API
async function forwardVesselDataToWebServer(data) {

  try {
    const response = await axios.post(apiUrl, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('Response from API:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending data to API:', error.message);
    throw error;
  }
}

async function forwardVesselDataToHotspot(data) {
  const apiUrl = `${process.env.HOTSPOT_URI}/save_vessel_location`;
  
  try {
    const response = await axios.post(apiUrl, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('Response from API:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending data to API:', error.message);
    throw error;
  }
}

const getWeatherData = async (requestData) => {
  try {

      // Forward the request to the web server
      const response = await axios.post(apiUrl, requestData, {
          headers: {
              "Content-Type": "application/json",
          },
      });

      console.log("Response from web server:", response.data.data);
      
      const gatewayResponse = await forwardWeatherDataToGateway(response.data.data);

      console.log("Response from gateway:", gatewayResponse.data);
      return response;

  } catch (error) {
      console.error("Error communicating with web server:", error.message);
      throw error;
  }
};

const getHotspotData = async (requestData) => {
  console.log("Request data:", requestData);
  const { latitude, longitude } = requestData;
  const apiUrl = `${process.env.HOTSPOT_URI}/suggest_fishing_hotspots?latitude=${latitude}&longitude=${longitude}`;

  console.log("API URL:", apiUrl);

  try {
      const response = await axios.get(apiUrl, requestData, {
          headers: {
              "Content-Type": "application/json",
          },
      });

      console.log("Response from hotspot server:", response.data.data);

      const gatewayResponse = await forwardHotspotDataToGateway(response.data.data);
      
      return response;

  } catch (error) {
      console.error("Error communicating with hotspot server:", error.message);
      throw error;
  }
}

const forwardVesselDataToHotspotServer = async (requestData) => {
  const apiUrl = `${process.env.HOTSPOT_URI}/link_vessel_to_hotspot`;
  
  try {
    const response = await axios.post(apiUrl, requestData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('Response from API:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending data to API:', error.message);
    throw error;
  }
};

const forwardChatDataToWebServer = async (data) => {
  const apiUrl = `${process.env.AQUA_SAFE_URI}/api/server/store-location`;

  try {
    const response = await axios.post(apiUrl, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('Response from API:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending data to API:', error.message);
    throw error;
  }
}

module.exports = { forwardVesselDataToWebServer, forwardVesselDataToHotspot, getWeatherData, getHotspotData , forwardVesselDataToHotspotServer, forwardChatDataToWebServer};
