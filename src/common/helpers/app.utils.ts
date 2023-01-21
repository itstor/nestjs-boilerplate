import { INestApplication, Logger } from '@nestjs/common';

export class AppUtils {
  public static appShutdown(app: INestApplication, code: string) {
    const logger: Logger = new Logger('App Shutdown');

    setTimeout(() => process.exit(1), 5000);

    logger.log(`🛑 Http server closing... with code: ${code}`);

    app.close().then(() => {
      logger.log('✅ Http server closed.');
      process.exit(0);
    });
  }

  public static killApp(app: INestApplication) {
    process.on('SIGINT', async () => {
      this.appShutdown(app, 'SIGINT');
    });

    process.on('SIGTERM', async () => {
      this.appShutdown(app, 'SIGTERM');
    });
  }
}
