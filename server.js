const app = require('./src/app');
const { initializeDatabase } = require('./src/config/database');

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await initializeDatabase();
    console.log('✅ Database initialized');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
