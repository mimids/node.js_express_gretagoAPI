const Sequelize = require('sequelize');
require('dotenv').config()


var sequelize  = new Sequelize(
  process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: process.env.DB_TYPE,
  logging: true,
  define: {
    timestamps: false
    },
  pool: {
    max: 5,
    min: 0,
    idel: 10000,
  }
})


sequelize.sync(function(errs)
{
    console.log('DATABASE SYNC', errs);
});

module.exports = sequelize