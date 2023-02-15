import { config } from './config';

import { startBot } from './bot';

const go = async () => {
  await startBot(config);
};

go();
