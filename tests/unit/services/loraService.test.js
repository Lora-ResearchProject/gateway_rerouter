const axios = require("axios");
const { sendDataToGateway, forwardChatDataToGateway } = require("../../../services/loraService");

jest.mock("axios"); // Mock Axios

describe("Gateway Service", () => {
  beforeAll(() => {
    // Set environment variable mocks
    process.env.GATEWAY_BASE_URL = "http://mock-gateway-base-url";
  });

  describe("sendDataToGateway", () => {
    it("should send data to the gateway for GPS broadcast and return the response", async () => {
      const mockData = { id: "123", gps: "80.123|13.456" };
      const mockResponse = { status: 200, data: { success: true, message: "Data broadcasted" } };

      // Mock Axios POST request
      axios.post.mockResolvedValueOnce(mockResponse);

      const result = await sendDataToGateway(mockData);

      // Assertions
      expect(axios.post).toHaveBeenCalledWith(
        `${process.env.GATEWAY_BASE_URL}/api/broadcast-gps`,
        mockData,
        { headers: { "Content-Type": "application/json" } }
      );
      expect(result).toEqual(mockResponse);
    });

    it("should throw an error if the request fails", async () => {
      const mockData = { id: "123", gps: "80.123|13.456" };
      const mockError = new Error("Network error");

      // Mock Axios POST to throw an error
      axios.post.mockRejectedValueOnce(mockError);

      await expect(sendDataToGateway(mockData)).rejects.toThrow("Network error");
    });
  });

  describe("forwardChatDataToGateway", () => {
    it("should send chat data to the gateway and return the response", async () => {
      const mockData = { id: "123", chat: "Hello world" };
      const mockResponse = { status: 200, data: { success: true, message: "Chat data forwarded" } };

      // Mock Axios POST request
      axios.post.mockResolvedValueOnce(mockResponse);

      const result = await forwardChatDataToGateway(mockData);

      // Assertions
      expect(axios.post).toHaveBeenCalledWith(
        `${process.env.GATEWAY_BASE_URL}/api/broadcast-chat_data`,
        mockData,
        { headers: { "Content-Type": "application/json" } }
      );
      expect(result).toEqual(mockResponse);
    });

    it("should throw an error if the request fails", async () => {
      const mockData = { id: "123", chat: "Hello world" };
      const mockError = new Error("Server error");

      // Mock Axios POST to throw an error
      axios.post.mockRejectedValueOnce(mockError);

      await expect(forwardChatDataToGateway(mockData)).rejects.toThrow("Server error");
    });
  });
});
