import path from 'path';

export const config = {
  dataDirectory: process.env.DATA_DIR || process.cwd(),
  logLevel: process.env.LOG_LEVEL || 'info',
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
};

export const getDatabasePath = () => {
  return path.join(config.dataDirectory, 'todos.db');
};

