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
    console.log("Response from gateway:", response);
  } catch (error) {
    console.error("Error sending data to gateway:", error.message);
  }
}

async function forwardChatDataToGateway(data) {
  try {
    const response = await axios.post(gatewayUrl2, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Response from gateway:", response);
  } catch (error) {
    console.error("Error sending data to gateway:", error.message);
  }
}

module.exports = { sendDataToGateway, forwardChatDataToGateway };
