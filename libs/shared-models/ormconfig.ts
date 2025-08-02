import { DataSource } from 'typeorm';
import { User } from './src/lib/entities/user.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'macbook',
  password: '',
  database: 'workflows_db',
  entities: [User],
  migrations: ['./src/lib/migrations/*.ts'],
  synchronize: false,
  logging: true,
});
