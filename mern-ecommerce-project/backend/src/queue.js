const { Queue } = require('bullmq');
const { redisConnection } = require('./redis');

const orderQueue = new Queue('orders', {
  connection: redisConnection(),
});

module.exports = { orderQueue };
