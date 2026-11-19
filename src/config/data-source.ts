import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'boilerplate_db',
    synchronize: process.env.NODE_ENV !== 'production',
    logging: false,
    entities: ['dist/entities/**/*.js'],
    migrations: ['dist/migrations/**/*.js'],
});