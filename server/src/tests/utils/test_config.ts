import mongoose from 'mongoose';

interface Config {
    port: number;
    mongoose: {
        url: string;
        options: mongoose.ConnectOptions;
    };
    jwt: {
        secret: string;
        accessExpirationMinutes: number;
        refreshExpirationDays: number;
    };
}

const config: Config = {
  port: parseInt(process.env.PORT || '3000', 10),
  mongoose: {
    url: process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/syntheticrealities-test',
    options: {},
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'test-secret',
    accessExpirationMinutes: 10,
    refreshExpirationDays: 7,
  },
};

export default config; 