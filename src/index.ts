import { RedisClient } from "./redisclient";

const redis = new RedisClient();
const port = 6379;
const ip   = '127.0.0.1';

redis.connect(port, ip, () => {
  console.log('Conectou');
  redis.set('nome2', 'naiara');
});

setTimeout(() => {
  redis.get('nome2');
}, 2000);

setTimeout(() => {
  redis.del('nome2');
}, 2000);