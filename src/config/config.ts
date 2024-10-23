import dotenv from 'dotenv';

dotenv.config();

const config = {
    port: process.env.PORT || 3000,
    databaseUrl: process.env.DATABASE_URL || '',
    finnhubApiKey: process.env.FINNHUB_API_KEY || '',
    finnhubUrl: process.env.FINNHUB_URL,
    env: process.env.NODE_ENV || 'development',
  };
  
  if (!config.databaseUrl) {
    throw new Error('DATABASE_URL is not defined in the environment');
  }
  
  if (!config.finnhubApiKey) {
    throw new Error('FINNHUB_API_KEY is not defined in the environment');
  }
  
  if (!config.finnhubUrl) {
    throw new Error('FINNHUB_URL is not defined in the environment');
  }
  export default config;