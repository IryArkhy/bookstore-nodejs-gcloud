import config from './config';
import app from './server';

app.listen(Number(config.port), () => {
  console.log(`Hello on ${config.port} ${process.env.NODE_ENV}`);
});
