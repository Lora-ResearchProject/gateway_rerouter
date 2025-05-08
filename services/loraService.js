//This service will forward data from other services to teh gateway
const axios = require("axios");
require('dotenv').config();

const gatewayUrl = `${process.env.GATEWAY_BASE_URL}/api/broadcast-gps`;
const gatewayUrl2 = `${process.env.GATEWAY_BASE_URL}/api/broadcast-chat_data`;
const gatewayUrl3 = `${process.env.GATEWAY_BASE_URL}/api/broadcast-weather_data`;
const gatewayUrl4 = `${process.env.GATEWAY_BASE_URL}/api/broadcast-hotspot_data`;

async function sendDataToGateway(data) {
  

  try {
    const response = await axios.post(gatewayUrl, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

async function forwardChatDataToGateway(data) {

  try {
    const response = await axios.post(gatewayUrl2, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

async function forwardWeatherDataToGateway(data) {
  try {
    const response = await axios.post(gatewayUrl3, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

async function forwardHotspotDataToGateway(data) {
  try {
    const response = await axios.post(gatewayUrl4, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

module.exports = { sendDataToGateway, forwardChatDataToGateway, forwardWeatherDataToGateway, forwardHotspotDataToGateway };
