//This service will forward data from the Gateway to other Services as needed
const axios = require('axios');
require('dotenv').config();

// Function to send data to a specific API
async function forwardVesselDataToWebServer(data) {
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

module.exports = { forwardVesselDataToWebServer, forwardVesselDataToHotspot };
