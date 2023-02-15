import { log } from '../log';
import { ConfigType } from '../types';
import { getClient } from './getClient';
import { ready } from './ready';

export const startBot = async (config: ConfigType) => {
  log('Bot starting...');
  const client = getClient(config.botToken);

  ready(client, config);
};
