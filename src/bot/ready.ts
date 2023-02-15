import { Client } from 'discord.js';
import { log } from '../log';
import { ConfigType } from '../types';
import { messageHandler } from './handlers/message';

export const ready = (client: Client, config: ConfigType) => {
  client.on('messageCreate', messageHandler(client, config));

  client.on('ready', () => {
    log(`Bot ready!`);
    log({
      ...config,
      openai: {
        ...config.openai,
        apiKey: '****',
      },
      botToken: '****',
    });
  });
};
