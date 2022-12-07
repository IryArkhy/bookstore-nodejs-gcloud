import config from './config';
import app from './server';

app.listen(Number(config.port), () => {
  console.log(`Hello on ${config.port} ${JSON.stringify(config)}`);
});
