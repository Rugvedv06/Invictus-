import 'dotenv/config';

import app from './app.js';
import { ensureExtensions, testConnection } from './config/db.js';

const PORT = Number(process.env.PORT || 5000);

const startServer = async () => {
  try {
    await testConnection();
    await ensureExtensions();

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server', error.message);
    process.exit(1);
  }
};

startServer();
