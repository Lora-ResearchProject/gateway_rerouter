const express = require("express");
const {
  receiveData,
  sendData,
  sendChatData,
} = require("../controllers/loraController");

const router = express.Router();

// Route to check if data is received from the gateway
router.post("/data", receiveData);

// Data coming from Aqua Safe is sent to Gateway
router.post("/sendData", sendData);

// Chat data is forwarded to the Gateway
router.post("/sendChatData", sendChatData);

module.exports = router;
