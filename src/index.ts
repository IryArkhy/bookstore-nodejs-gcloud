import config from './config';
import app from './server';

const HOST = '0.0.0.0';
app.listen(Number(config.port), HOST, () => {
  console.log(
    `Hello on ${config.port} ${process.env.STAGE} ${process.env.STAGE}
    ${process.env.JWT_SECRET}
    ${JSON.stringify(config)}`,
  );
});
