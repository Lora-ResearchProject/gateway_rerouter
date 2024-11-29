const axios = require('axios');

async function sendDataToGateway(data) {
    const gatewayUrl = 'http://172.31.255.254:1880/api/data';
    try {
      const response = await axios.post(gatewayUrl, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Response from gateway:', response.data);
    } catch (error) {
      console.error('Error sending data to gateway:', error.message);
    }
  }

  module.exports = { sendDataToGateway };