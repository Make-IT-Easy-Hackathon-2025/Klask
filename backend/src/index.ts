import app from './app';
import connectDB from './config/db';
import config from './config/config';

// Connect to MongoDB
connectDB();

// Start the server
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
