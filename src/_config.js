var config = {};

config.mongoURI = {
  test: 'mongodb://localhost/capstone_api_test',
  development: 'mongodb://localhost/capstone_api',
  production: process.env.MONGODB_URI,
};

module.exports = config;
