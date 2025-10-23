import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Todo } from './entities/Todo';
import { Comment } from './entities/Comment';
import { getDatabasePath } from './config';
import { logger } from './logger';

const dbPath = getDatabasePath();

export const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: dbPath,
  synchronize: true,
  logging: false,
  entities: [Todo, Comment],
  migrations: [],
  subscribers: [],
});

let isInitialized = false;

export async function getDataSource() {
  if (!isInitialized) {
    await AppDataSource.initialize();
    isInitialized = true;
    logger.info({ path: dbPath }, 'Database connected');
  }
  return AppDataSource;
}

