const express = require('express');
const apiRoutes = require('./routes/apiRoutes');
const loraRoutes = require('./routes/loraRoutes');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Routes
app.use('/api', apiRoutes);
app.use('/lora', loraRoutes);

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running at http://0.0.0.0:${port}`);
});
