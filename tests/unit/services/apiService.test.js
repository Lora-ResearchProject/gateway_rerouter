const axios = require("axios");
const { forwardVesselDataToWebServer, forwardVesselDataToHotspot } = require("../../../services/apiService");
jest.mock("axios"); // Mock axios

describe("API Service", () => {
  beforeAll(() => {
    // Mock environment variables
    process.env.AQUA_SAFE_URI = "http://mock-aqua-safe-uri";
    process.env.HOTSPOT_URI = "http://mock-hotspot-uri";
  });

  describe("forwardVesselDataToWebServer", () => {
    it("should send data to the Aqua Safe API and return the response", async () => {
      const mockData = { id: "123", location: "80.123|13.456" };
      const mockResponse = { success: true, message: "Data received" };

      // Mock axios POST request
      axios.post.mockResolvedValueOnce({ data: mockResponse });

      const result = await forwardVesselDataToWebServer(mockData);

      // Assertions
      expect(axios.post).toHaveBeenCalledWith(
        `${process.env.AQUA_SAFE_URI}/api/server/store-location`,
        mockData,
        { headers: { "Content-Type": "application/json" } }
      );
      expect(result).toEqual(mockResponse);
    });

    it("should throw an error if the request fails", async () => {
      const mockData = { id: "123", location: "80.123|13.456" };
      const mockError = new Error("Network error");

      // Mock axios POST request to throw an error
      axios.post.mockRejectedValueOnce(mockError);

      await expect(forwardVesselDataToWebServer(mockData)).rejects.toThrow("Network error");
    });
  });

  describe("forwardVesselDataToHotspot", () => {
    it("should send data to the Hotspot API and return the response", async () => {
      const mockData = { id: "123", location: "80.123|13.456" };
      const mockResponse = { success: true, message: "Data saved" };

      // Mock axios POST request
      axios.post.mockResolvedValueOnce({ data: mockResponse });

      const result = await forwardVesselDataToHotspot(mockData);

      // Assertions
      expect(axios.post).toHaveBeenCalledWith(
        `${process.env.HOTSPOT_URI}/save_vessel_location`,
        mockData,
        { headers: { "Content-Type": "application/json" } }
      );
      expect(result).toEqual(mockResponse);
    });

    it("should throw an error if the request fails", async () => {
      const mockData = { id: "123", location: "80.123|13.456" };
      const mockError = new Error("Server error");

      // Mock axios POST request to throw an error
      axios.post.mockRejectedValueOnce(mockError);

      await expect(forwardVesselDataToHotspot(mockData)).rejects.toThrow("Server error");
    });
  });
});
