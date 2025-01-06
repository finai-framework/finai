import {ApplicationConfig, GptServiceApplication} from './application';

export * from './application';


export async function main(options: ApplicationConfig = {}) {
  const app = new GptServiceApplication(options);
  await app.boot();
  await app.start();

  const telegramBotService = await app.get('services.TelegramBotService');
  await (telegramBotService as any).initWebHook();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  return app;
}

if (require.main === module) {
  require('dotenv').config();
  // Run the application
  const config = {
    rest: {
      port: +(process.env.PORT ?? 3002),
      host: process.env.HOST,
      // The `gracePeriodForClose` provides a graceful close for http/https
      // servers with keep-alive clients. The default value is `Infinity`
      // (don't force-close). If you want to immediately destroy all sockets
      // upon stop, set its value to `0`.
      // See https://www.npmjs.com/package/stoppable
      gracePeriodForClose: 5000, // 5 seconds
      openApiSpec: {
        // useful when used with OpenAPI-to-GraphQL to locate your application
        setServersFromRequest: true,
      },
    },
  };
  main(config).catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}
