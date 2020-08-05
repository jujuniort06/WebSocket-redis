import { RedisClient } from "./redisclient";

const redis = new RedisClient();
const port  = 6379;
const ip    = '127.0.0.1';

redis.connect(port, ip).then(() => {
  console.log('Conexão com REDIS realizada com sucesso!');

  redis.set('nome', 'julio').then((data) => {
    redis.get('nome').then((data) => {
      console.log(data.toString());
    }).catch(() => {
      console.log('Não foi possível encontrar essa chave.');
    });
  });
}).catch(() => {
  console.log('Não foi possível realizar a conexão com o REDIS.');
});