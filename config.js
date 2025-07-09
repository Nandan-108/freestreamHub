// config.js
const dotenv = require('dotenv')
dotenv.config();

module.exports = {
  SQL_HOST: process.env.SQL_HOST,
  SQL_USER: process.env.SQL_USER,
  SQL_PASSWORD: process.env.SQL_PASSWORD,
  SQL_DATABASE: process.env.SQL_DATABASE,
  SQL_PORT: process.env.SQL_PORT,
  NODE_ENV: process.env.NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET,
  AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
  AWS_BUCKET_REGION: process.env.AWS_BUCKET_REGION,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  API_URL: (process.env.NODE_ENV=="production"?"https://freestreamhub.onrender.com/":"http://localhost:3001/")
};
