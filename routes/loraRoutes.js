const express = require('express');
const router = express.Router();
const { sendDataToGateway } = require('../services/loraService')

//Function to check if data is recieved from the gateway
router.post('/data', (req, res) => {
  const loraData = req.body;
  console.log('Received LoRa data:', loraData);
  res.status(200).send('Data received successfully');
});

//Data coming from aqua safe is sent to Gateway
router.post('/sendData', (req, res) => {
    const inboundData = req.body;
    console.log("INBOUND DATA : " , inboundData);
    const response =  sendDataToGateway(inboundData);
    console.log('Data Sent to Gateway : ' , response);
    res.status(200).send('Data forwarded successfully'); 
})

module.exports = router;
