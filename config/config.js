const path = require('path');
const rootPath = path.normalize(__dirname + '/..');
const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    root: rootPath,
    app: {
      name: 'plendifyCredits'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://127.0.0.1:27017/plendifyCredits'
  },
  test: {
    root: rootPath,
    app: {
      name: 'plendifyCredits'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://mongo/plendifyCredits',
    rabbitmq : 'amqp://localhost',
    defaultSmsProvider : "insano"
  },
  production: {
    root: rootPath,
    app: {
      name: 'plendifyCredits'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost:27017/plendifyCredits', //docker service name is mongodb,
    rabbitmq : 'amqp://plendifyadmin:pl3ndi1fyP55@localhost',
    defaultSmsProvider : "wigal"
  }
};

module.exports = config[env];
