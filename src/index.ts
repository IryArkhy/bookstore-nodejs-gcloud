import config from './config';
import app from './server';

app.listen(Number(config.port), () => {
  console.log(
    `Hello on ${config.port} ${process.env.STAGE} ${process.env.STAGE}
    ${process.env.JWT_SECRET}
    ${JSON.stringify(config)}`,
  );
});
