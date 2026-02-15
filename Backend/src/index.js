import 'dotenv/config';

import app from './app.js';
import { ensureExtensions, testConnection } from './config/db.js';
import { ensureDemoCredentials } from './services/auth.service.js';

const PORT = Number(process.env.PORT || 5000);

const startServer = async () => {
  try {
    await testConnection();
    await ensureExtensions();
    if (process.env.ENABLE_DEMO_CREDENTIALS !== 'false') {
      await ensureDemoCredentials();
    }

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server', error.message);
    process.exit(1);
  }
};

startServer();

// Force restart to pick up .env changes
