const app = require('./src/app');
const { initializeDatabase } = require('./src/config/database');
const { checkKimiConnection } = require('./src/config/kimi');

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await initializeDatabase();
    console.log('✅ Database initialized');

    // Verify Kimi K2.6 endpoint is reachable
    const kimi = await checkKimiConnection();
    if (kimi.ok) {
      console.log(`✅ Kimi K2.6 connected  model=${kimi.model}  endpoint=${kimi.baseUrl}`);
    } else {
      console.warn(`⚠️  Kimi K2.6 not reachable: ${kimi.error}`);
      console.warn('   AI endpoints will return 502 until the endpoint is configured.');
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
