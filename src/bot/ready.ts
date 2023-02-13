import { Client } from 'discord.js';
import { messageHandler } from './handlers/message';

export const ready = (client: Client) => {
  client.on('messageCreate', messageHandler(client));

  client.on('ready', () => {
    console.info(`Bot ready!`, {
      model: process.env.OPENAI_MODEL,
      behavior: process.env.OPENAI_BEHAVIOR,
    });
  });
};
