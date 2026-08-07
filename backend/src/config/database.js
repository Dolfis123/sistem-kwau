const { Sequelize } = require('sequelize');
const env = require('./env');

const sequelize = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASS, {
  host: env.DB_HOST,
  port: env.DB_PORT,
  dialect: 'mysql',
  logging: false,
  define: {
    underscored: true, // kolom otomatis snake_case: created_at, updated_at
  },
  timezone: '+09:00', // WIT (Papua)
});

module.exports = sequelize;
