import app from './index';
import config from './config/config';
import logger from './config/logger';

app.listen(config.port, () => {
    logger.info(`Server started on port ${config.port} in ${config.env} mode`);
});