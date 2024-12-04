const {
  forwardVesselDataToHotspot,
  forwardVesselDataToWebServer,
} = require("../services/apiService");

const reRouteGpsData = async (req, res) => {
  const { id, l, s } = req.body;

  if (!id || !l || typeof s !== "number") {
    return res.status(400).json({
      success: false,
      message: 'Invalid data format. Ensure "id", "l", and "s" are provided.',
    });
  }

  try {
    let formattedData;
    let apiResponse;

    if (s === 0) {
      // If not SOS data, the data is sent to the hotspot without the s
      formattedData = { id, l };
      apiResponse = await forwardVesselDataToHotspot(formattedData);
    } else {
      // If SOS the data is sent to aqua safe with s
      formattedData = { id, l, s };
      apiResponse = await forwardVesselDataToWebServer(formattedData);
    }

    console.log(apiResponse);

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

module.exports = { reRouteGpsData };
