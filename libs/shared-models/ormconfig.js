const { DataSource } = require('typeorm');
const path = require('path');

module.exports = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'macbook',
  password: '',
  database: 'workflows_db',
  entities: [path.join(__dirname, 'src/lib/entities/*.entity.{js,ts}')],
  migrations: [path.join(__dirname, 'src/lib/migrations/*.{js,ts}')],
  synchronize: false,
  logging: true,
}); 