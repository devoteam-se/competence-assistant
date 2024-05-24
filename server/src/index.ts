import { createConfig } from './app/config';
import { configureServer } from './app/server';
import { createLogger } from './pkg/logger/logger';

const logger = createLogger();
const config = createConfig();

(async () => {
  try {
    const app = await configureServer(logger, config);

    app.listen(config.port, () => {
      logger.info(`app started on port ${config.port}`);
    });
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
})();
