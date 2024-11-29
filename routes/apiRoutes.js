const express = require('express');
const { sendDataToApi } = require('../services/apiService');

const router = express.Router();

//Data coming from the gateway is Re routed to Aqua Safe
router.post('/reRoute/Gps', async (req, res) => {
  const { id, l, s } = req.body;

  if (!id || !l || typeof s !== 'number') {
    return res.status(400).json({
      success: false,
      message: 'Invalid data format. Ensure "id", "l", and "s" are provided.',
    });
  }

  try {
    const formattedData = { id, l, s };
    const apiResponse = await sendDataToApi(formattedData);

    res.status(200).json({
      success: true,
      message: 'Data successfully sent to the API.',
      apiResponse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to send data to the API.',
      error: error.message,
    });
  }
});

module.exports = router;
