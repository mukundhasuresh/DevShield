import { Queue } from 'bullmq';

// Next.js might re-create the module in dev, so global is safer or just use local scoped if acceptable.
// Providing a default local fallback
const getRedisUrl = () => process.env.REDIS_URL || 'redis://localhost:6379';

const connection = {
  url: getRedisUrl()
};

export const scanQueue = new Queue('scan-jobs', {
  connection: new (require('ioredis'))(connection.url)
});
