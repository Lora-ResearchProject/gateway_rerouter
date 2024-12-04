//This service will forward data from other services to teh gateway
const axios = require("axios");

const gatewayUrl = "http://172.31.255.254:1880/api/broadcast-gps";

const gatewayUrl2 = "http://172.31.255.254:1880/api/broadcast-chat_data";

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

module.exports = { sendDataToGateway, forwardChatDataToGateway };
