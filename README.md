
# Gateway Service

This repository contains a Node.js application for forwarding data between services and a gateway. The application provides APIs to send GPS and chat data to specified endpoints, utilizing `axios` for HTTP requests.

---

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup](#setup)
- [Usage](#usage)
- [Testing](#testing)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Forwarding GPS Data**: Sends GPS location data to the gateway.
- **Forwarding Chat Data**: Sends chat data to the gateway.
- **Error Handling**: Captures and logs API errors.
- **Environment Configuration**: Uses `.env` for customizable endpoints.

---

## Technologies Used

- **Node.js**: JavaScript runtime.
- **Express**: Lightweight framework for API routes.
- **Axios**: For making HTTP requests.
- **Jest**: Testing framework.
- **dotenv**: For managing environment variables.

---

## Setup

### Prerequisites
- [Node.js](https://nodejs.org) (v14 or later)
- [npm](https://npmjs.com)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/your-repo.git
   ```
2. Navigate to the project directory:
   ```bash
   cd your-repo
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

---

## Usage

### Start the Application
Run the server:
```bash
npm start
```

### Example API Endpoints
1. **Send GPS Data**:
   - Endpoint: `POST /sendDataToGateway`
   - Body:
     ```json
     {
       "id": "123",
       "gps": "80.123|13.456"
     }
     ```

2. **Send Chat Data**:
   - Endpoint: `POST /forwardChatDataToGateway`
   - Body:
     ```json
     {
       "id": "123",
       "chat": "Hello world"
     }
     ```

---

## Testing

This repository uses **Jest** for testing.

### Run Tests
Execute the following command to run all tests:
```bash
npm test
```

### Example Test Output
```plaintext
PASS  services/gatewayService.test.js
  Gateway Service
    sendDataToGateway
      ✓ should send data to the gateway for GPS broadcast and return the response (5 ms)
      ✓ should throw an error if the request fails (2 ms)
    forwardChatDataToGateway
      ✓ should send chat data to the gateway and return the response (3 ms)
      ✓ should throw an error if the request fails (1 ms)
```

---

## Folder Structure

```
├── services/
│   ├── apiService.js        # Handles forwarding of data to external APIs
│   ├── gatewayService.js    # Handles forwarding of data to the gateway
├── routes/
│   ├── apiRoutes.js         # API route definitions
│   ├── loraRoutes.js        # Gateway-specific routes
├── controllers/
│   ├── apiController.js     # Controller for API routes
│   ├── loraController.js    # Controller for gateway routes
├── utils/
│   ├── logger.js            # Winston logger configuration
├── .env                     # Environment variables
├── app.log                  # Application logs (git ignored)
├── package.json             # Project metadata and dependencies
├── server.js                # Entry point for the application
├── README.md                # Project documentation
```

---

## Contributing

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your message"
   ```
4. Push the branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Submit a pull request.

---

## License

This project is licensed under the [MIT License](LICENSE).

---
