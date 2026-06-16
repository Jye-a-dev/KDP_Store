import { registerAs } from '@nestjs/config';

export const envConfig = registerAs('env', () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
}));
