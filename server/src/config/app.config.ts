import { config } from 'dotenv';

// Cargar variables de entorno
config();

export const AppConfig = {
  port: parseInt(process.env.PORT || '3000'),
  corsOrigins: [
    process.env.CORS_ORIGIN_SHELL || 'http://localhost:4200',
    process.env.CORS_ORIGIN_REMOTE || 'http://localhost:4201',
  ],
};
